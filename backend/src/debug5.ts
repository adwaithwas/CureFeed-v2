import { Innertube } from "youtubei.js";

async function run() {
  const url = 'https://www.youtube.com/@PewDiePie';
  const yt = await Innertube.create();
  const resolved = await yt.resolveURL(url);
  const channelId = resolved.payload.browseId;
  const channel = await yt.getChannel(channelId);
  
  const videosTab = await channel.getVideos();
  const lockups = videosTab.page.contents_memo?.get('LockupView') || [];
  
  for (const l of lockups) {
    const title = l.metadata?.title?.text || "";
    const badges = l.metadata?.badges || l.badges || [];
    if (badges.length > 0) {
      console.log(`Video: ${title}, badges:`, JSON.stringify(badges));
    }
  }
}

run();
