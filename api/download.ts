import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      message: "Please provide a valid Instagram URL.",
    });
  }

  try {
    const response = await axios.get(
      "https://instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com/convert",
      {
        params: { url },
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
          "x-rapidapi-host":
            "instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com",
        },
      }
    );

    const data = response.data;

    if (!data?.media?.length) {
      return res.status(400).json({
        message: "No media found for this link.",
      });
    }

    const mediaItems = data.media.map((item: any, index: number) => ({
      url: item.url,
      thumbnail: item.thumbnail,
      filename: `instagram-${item.type}-${Date.now()}-${index + 1}.${
        item.type === "video" ? "mp4" : "jpg"
      }`,
      type: item.type === "video" ? "video" : "image",
    }));

    const primary = mediaItems[0];

    return res.status(200).json({
      url: primary.url,
      thumbnail: primary.thumbnail,
      filename: primary.filename,
      type: primary.type,
      items: mediaItems.length > 1 ? mediaItems : undefined,
    });

  } catch (error: any) {
    console.error("RapidAPI error:", error.response?.data || error.message);

    return res.status(500).json({
      message:
        "Temporary error processing. Please try again in a few minutes.",
    });
  }
}
