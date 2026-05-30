"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_service_1 = require("./services/youtube.service");
async function run() {
    const channelUrl = 'https://www.youtube.com/@mkbhd';
    console.log("Fetching for:", channelUrl);
    try {
        const data = await (0, youtube_service_1.fetchChannelData)(channelUrl);
        console.log(`Found ${data.videos.length} regular videos and ${data.members.length} member videos.`);
        data.home.forEach((u, i) => {
            console.log(`[${i}] [${u.type}] ${u.title} - isMemberOnly: ${u.isMemberOnly}`);
        });
    }
    catch (err) {
        console.error(err);
    }
}
run();
//# sourceMappingURL=debug4.js.map