import { fetchChannelData } from './services/youtube.service';

async function run() {
  const channelUrl = 'https://www.youtube.com/@mkbhd'; 
  console.log("Fetching for:", channelUrl);
  try {
    const data = await fetchChannelData(channelUrl);
    console.log(`Found ${data.videos.length} regular videos and ${data.members.length} member videos.`);
    data.home.forEach((u: any, i: number) => {
       console.log(`[${i}] [${u.type}] ${u.title} - isMemberOnly: ${u.isMemberOnly}`);
    });
  } catch (err) {
    console.error(err);
  }
}

run();
