import { fetchChannelData } from './services/youtube.service';

async function run() {
  const channelUrl = 'https://www.youtube.com/@mkbhd'; 
  console.log("Fetching for:", channelUrl);
  try {
    const data = await fetchChannelData(channelUrl);
    console.log("Got posts:");
    data.posts.forEach((p: any, i: number) => {
       console.log(`[${i}] ${p.content.substring(0, 50)}... - ${p.published} (ts: ${p.timestamp})`);
    });
  } catch (err) {
    console.error(err);
  }
}

run();
