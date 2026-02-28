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
      message: "URL inválida. Por favor, use um link válido.",
    });
  }

  try {
    const response = await axios.get(
      "https://instagram-downloader-download-instagram-videos-stories5.p.rapidapi.com/getThreads",
      {
        params: { url },
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host":
            "instagram-downloader-download-instagram-videos-stories5.p.rapidapi.com",
        },
      }
    );

    const data = response.data;

    if (!data.videos?.length && !data.images?.length) {
      return res.status(400).json({
        message: "No media could be found for this link.",
      });
    }

    const items: any[] = [];

    if (data.videos?.length) {
      data.videos.forEach((video: string, i: number) => {
        items.push({
          url: video,
          filename: `threads-video-${Date.now()}-${i + 1}.mp4`,
          type: "video",
        });
      });
    }

    if (data.images?.length) {
      data.images.forEach((image: string, i: number) => {
        items.push({
          url: image,
          filename: `threads-image-${Date.now()}-${i + 1}.jpg`,
          type: "image",
        });
      });
    }

    return res.status(200).json({
      url: items[0].url,
      filename: items[0].filename,
      type: items[0].type,
      items: items.length > 1 ? items : undefined,
    });
  } catch (error: any) {
    console.error("RapidAPI error:", error.response?.data || error.message);

    return res.status(500).json({
      message:
        "Temporary error processing. Please try again in a few minutes.",
    });
  }
}
