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
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
          "X-RapidAPI-Host":
            "instagram-downloader-download-instagram-videos-stories5.p.rapidapi.com",
        },
      }
    );

    const data = response.data;

    if (!data?.videos?.length && !data?.images?.length) {
      return res.status(400).json({
        message: "Não foi possível encontrar mídia para este link.",
      });
    }

    const mediaItems: any[] = [];

    // Videos
    if (data.videos?.length) {
      data.videos.forEach((videoUrl: string, index: number) => {
        mediaItems.push({
          url: videoUrl,
          thumbnail: data.images?.[0],
          filename: `threads-video-${Date.now()}-${index + 1}.mp4`,
          type: "video",
        });
      });
    }

    // Images
    if (data.images?.length) {
      data.images.forEach((imageUrl: string, index: number) => {
        mediaItems.push({
          url: imageUrl,
          filename: `threads-image-${Date.now()}-${index + 1}.jpg`,
          type: "image",
        });
      });
    }

    const primary = mediaItems[0];

    return res.status(200).json({
      url: primary.url,
      thumbnail: primary.thumbnail,
      filename: primary.filename,
      type: primary.type,
      items: mediaItems.length > 1 ? mediaItems : undefined,
    });
  } catch (error: any) {
    console.error("RapidAPI ERROR STATUS:", error.response?.status);
    console.error("RapidAPI ERROR DATA:", error.response?.data);
    console.error("RapidAPI ERROR MESSAGE:", error.message);

    return res.status(500).json({
      message:
        "Temporary error processing. Please try again in a few minutes.",
    });
  }
}
