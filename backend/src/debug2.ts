import { fetchChannelData } from './services/youtube.service';

async function run() {
  const channelUrl = 'https://www.youtube.com/@mkbhd'; // or any user
  console.log("Fetching for:", channelUrl);
  try {
    const data = await fetchChannelData(channelUrl);
    console.log("Got updates:");
    data.updates.slice(0, 10).forEach((u: any, i: number) => {
       console.log(`[${i}] [${u.type}] ${u.title} - ${u.publishedTime} (ts: ${u.timestamp})`);
    });
  } catch (err) {
    console.error(err);
  }
}

run();
