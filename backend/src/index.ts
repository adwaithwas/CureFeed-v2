import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/test", (_, res) => {
  res.json({
    message: "hello from curefeed backend",
  });
});

import { fetchChannelData } from "./services/youtube.service";

app.get("/api/channel", async (req, res) => {
  const url = req.query.url as string;
  if (!url) {
    res.status(400).json({ error: "Missing url query parameter" });
    return;
  }

  try {
    const data = await fetchChannelData(url);
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to fetch channel data" });
  }
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});