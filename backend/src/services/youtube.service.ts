import { Innertube } from "youtubei.js";

let ytInstance: Innertube | null = null;

export const getYoutubeInstance = async (): Promise<Innertube> => {
  if (!ytInstance) {
    ytInstance = await Innertube.create();
  }
  return ytInstance;
};

export const fetchChannelData = async (url: string) => {
  const yt = await getYoutubeInstance();
  
  // Resolve channel URL to get ID
  const resolved = await yt.resolveURL(url);
  if (!resolved || !resolved.payload || !resolved.payload.browseId) {
    throw new Error("Could not resolve channel URL");
  }
  
  const channelId = resolved.payload.browseId;
  const channel = await yt.getChannel(channelId);
  
  const channelInfo = {
    id: channelId,
    name: channel.metadata.title,
    avatar: channel.metadata.avatar?.[0]?.url || "",
    subscriberCount: channel.metadata.subscriber_count,
    url: channel.metadata.url
  };

  // Fetch videos manually parsing the tree
  let videos: any[] = [];
  try {
    const videosTab = await channel.getVideos();
    const memo = videosTab.page.contents_memo;
    const lockups = memo ? memo.get('LockupView') || [] : [];
    
    if (lockups.length > 0) {
      videos = lockups.map((l: any) => {
        const title = l.metadata?.title?.text || "";
        const id = l.content_id || "";
        const imageObj = l.content_image?.image;
        const thumbnails = Array.isArray(imageObj) ? imageObj : (imageObj?.sources || []);
        
        const metadataParts = l.metadata?.metadata?.metadata_rows?.[0]?.metadata_parts || [];
        const views = metadataParts[0]?.text?.text || "";
        const published = metadataParts[1]?.text?.text || "";
        
        const bottomOverlay = l.content_image?.overlays?.find((o: any) => o.type === 'ThumbnailBottomOverlayView');
        const duration = bottomOverlay?.badges?.[0]?.text || "";
        
        // Check if it's a member video by inspecting badges or accessibility label
        const accessibilityLabel = l.renderer_context?.accessibility_context?.label || "";
        const badges = l.metadata?.badges || l.badges || [];
        
        let isMemberOnly = accessibilityLabel.toLowerCase().includes("members only") || 
                            title.toLowerCase().includes("member only") ||
                            views.toLowerCase().includes("member") ||
                            published.toLowerCase().includes("member") ||
                            badges.some((b: any) => JSON.stringify(b).toLowerCase().includes("members"));

        // Heuristic: If YouTube hides both views and published date, it is a locked member video
        if (!views && !published) {
          isMemberOnly = true;
        }

        return {
          type: "video",
          id,
          title,
          thumbnails,
          published,
          views,
          duration,
          isMemberOnly,
          timestamp: parseRelativeToMs(published)
        };
      });
    } else {
      // Fallback to legacy parser if no lockups are found
      if (videosTab.videos && videosTab.videos.length > 0) {
        videos = videosTab.videos.map((v: any) => ({
          type: "video",
          id: v.id,
          title: v.title.text,
          thumbnails: v.thumbnails,
          published: v.published.text,
          views: v.view_count.text,
          duration: v.duration.text,
          isMemberOnly: false,
          timestamp: parseRelativeToMs(v.published.text)
        }));
      }
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
  }

  // Fetch Community Posts using BackstagePost memo parser
  let posts: any[] = [];
  try {
    const communityTab = await channel.getCommunity();
    const memo = communityTab.page.contents_memo;
    const backstagePosts = memo ? memo.get('BackstagePost') || [] : [];
    
    if (backstagePosts.length > 0) {
      posts = backstagePosts.map((p: any) => {
        const published = p.published?.text || "";
        return {
          type: "post",
          id: p.id,
          author: p.author?.name || channelInfo.name,
          authorAvatar: p.author?.thumbnails?.[0]?.url || channelInfo.avatar,
          published,
          content: p.content?.text || "",
          likes: p.vote_count?.text || "0",
          comments: p.action_buttons?.reply_button?.text || "0",
          attachment: p.attachment ? parseAttachment(p.attachment) : null,
          timestamp: parseRelativeToMs(published)
        };
      });
    }
  } catch (error) {
    console.error("Error fetching community posts:", error);
  }

  // Filter regular videos (top 5)
  const regularVideos = videos.filter(v => !v.isMemberOnly).slice(0, 5);

  // Filter member-only videos (show all scraped)
  const memberVideos = videos.filter(v => v.isMemberOnly);

  // Home updates: Mix of videos (member/regular) and community posts, sorted chronologically
  const allUpdates = [...videos, ...posts];
  const homeUpdates = allUpdates
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  return {
    channel: channelInfo,
    home: homeUpdates,
    videos: regularVideos,
    members: memberVideos,
    posts: posts.slice(0, 5)
  };
};

// Helper to convert YouTube relative dates (e.g., "11 hours ago", "2 days ago") into approximate timestamps
function parseRelativeToMs(relativeText: string): number {
  const now = Date.now();
  if (!relativeText) return 0; // If missing, send to bottom of list
  
  const cleanText = relativeText.toLowerCase().trim();
  // Match "11 hours ago", "streamed 2 days ago", "premiered 1 week ago", etc.
  const match = cleanText.match(/(\d+(?:\.\d+)?)\s*(second|minute|hour|day|week|month|year)s?\s*ago/);
  if (!match) return 0; // If parsing fails, send to bottom
  
  const value = parseFloat(match[1] || '0');
  const unit = match[2] || '';
  
  let multiplier = 1000; // seconds
  if (unit.startsWith('minute')) multiplier = 60 * 1000;
  else if (unit.startsWith('hour')) multiplier = 60 * 60 * 1000;
  else if (unit.startsWith('day')) multiplier = 24 * 60 * 60 * 1000;
  else if (unit.startsWith('week')) multiplier = 7 * 24 * 60 * 60 * 1000;
  else if (unit.startsWith('month')) multiplier = 30 * 24 * 60 * 60 * 1000;
  else if (unit.startsWith('year')) multiplier = 365 * 24 * 60 * 60 * 1000;
  
  return now - (value * multiplier);
}

function parseAttachment(attachment: any) {
  const getThumbnails = (imageObj: any) => {
    if (!imageObj) return [];
    return Array.isArray(imageObj) ? imageObj : (imageObj.sources || []);
  };

  const getBestUrl = (imageObj: any) => {
    const thumbs = getThumbnails(imageObj);
    if (thumbs.length === 0) return "";
    // Always prefer the highest resolution thumbnail (usually the last one)
    return thumbs[thumbs.length - 1]?.url || thumbs[0]?.url || "";
  };

  // basic parsing for images in posts
  if (attachment.type === "PostMultiImage") {
    return {
      type: "images",
      images: (attachment.images || []).map((img: any) => getBestUrl(img.image)).filter(Boolean)
    };
  } else if (attachment.type === "BackstageImage") {
    return {
      type: "image",
      url: getBestUrl(attachment.image)
    };
  } else if (attachment.type === "Video") {
     return {
       type: "video",
       id: attachment.id,
       title: attachment.title?.text || "",
       thumbnails: getThumbnails(attachment.thumbnails)
     };
  }
  return { type: attachment.type };
}
