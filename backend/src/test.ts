import { Innertube } from "youtubei.js";

async function main() {
  try {
    const yt = await Innertube.create();
    const url = "https://www.youtube.com/@Fireship";
    const resolved = await yt.resolveURL(url);

    const channel = await yt.getChannel(resolved.payload.browseId);
    
    // Get Videos
    const videosTab = await channel.getVideos();
    const videos = videosTab.videos || [];
    console.log("Videos array length:", videos.length);
    if (videos.length === 0) {
      // Sometimes videos are inside a different structure like grid
      const contents = videosTab.page.contents.item().as("TwoColumnBrowseResults").tabs.get({ title: "Videos" })?.content;
      console.log("Tab Content keys:", Object.keys(contents || {}));
      const items = contents?.item().as("RichGrid").contents;
      console.log("RichGrid items length:", items?.length);
      if (items && items.length > 0) {
          const first = items[0];
          console.log("First item type:", first.type);
          if (first.type === "RichItem") {
             console.log("First video title:", first.content.as("Video").title.text);
          }
      }
    }
    
    // Get Posts
    const communityTab = await channel.getCommunity();
    const posts = communityTab.posts || [];
    console.log("Posts array length:", posts.length);

  } catch (error) {
    console.error(error);
  }
}

main();
