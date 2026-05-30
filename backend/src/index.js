"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get("/api/test", (_, res) => {
    res.json({
        message: "hello from curefeed backend",
    });
});
const youtube_service_1 = require("./services/youtube.service");
app.get("/api/channel", async (req, res) => {
    const url = req.query.url;
    if (!url) {
        res.status(400).json({ error: "Missing url query parameter" });
        return;
    }
    try {
        const data = await (0, youtube_service_1.fetchChannelData)(url);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Failed to fetch channel data" });
    }
});
app.listen(3000, () => {
    console.log("server running on port 3000");
});
//# sourceMappingURL=index.js.map