const { Innertube } = require("youtubei.js");

async function run() {
  const url = 'https://www.youtube.com/@h3h3productions';
  const yt = await Innertube.create();
  const resolved = await yt.resolveURL(url);
  const channelId = resolved.payload.browseId;
  const channel = await yt.getChannel(channelId);
  
  const tabs = channel.memo.get('Tab').map((t) => t.title);
  console.log("Available tabs for H3H3:", tabs);
}

run();
