"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_service_1 = require("./services/youtube.service");
async function run() {
    const channelUrl = 'https://www.youtube.com/@mkbhd';
    console.log("Fetching for:", channelUrl);
    try {
        const data = await (0, youtube_service_1.fetchChannelData)(channelUrl);
        console.log("Got posts:");
        data.posts.forEach((p, i) => {
            console.log(`[${i}] ${p.content.substring(0, 50)}... - ${p.published} (ts: ${p.timestamp})`);
        });
    }
    catch (err) {
        console.error(err);
    }
}
run();
//# sourceMappingURL=debug3.js.map