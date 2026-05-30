"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testYoutube = testYoutube;
const youtubei_js_1 = require("youtubei.js");
async function testYoutube() {
    const youtube = await youtubei_js_1.Innertube.create();
    const search = await youtube.search("Fireship");
    console.log(search);
}
//# sourceMappingURL=youtube.js.map