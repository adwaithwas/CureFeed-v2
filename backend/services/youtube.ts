import { Innertube } from "youtubei.js";

export async function testYoutube() {
  const youtube = await Innertube.create();

  const search = await youtube.search("Fireship");

  console.log(search);
}