"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_service_1 = require("./services/youtube.service");
async function run() {
    const channelUrl = 'https://www.youtube.com/@mkbhd'; // or any user
    console.log("Fetching for:", channelUrl);
    try {
        const data = await (0, youtube_service_1.fetchChannelData)(channelUrl);
        console.log("Got updates:");
        data.updates.slice(0, 10).forEach((u, i) => {
            console.log(`[${i}] [${u.type}] ${u.title} - ${u.publishedTime} (ts: ${u.timestamp})`);
        });
    }
    catch (err) {
        console.error(err);
    }
}
run();
//# sourceMappingURL=debug2.js.map