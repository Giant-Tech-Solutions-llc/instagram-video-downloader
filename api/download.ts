import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://www.instagram.com/",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);

    const video =
      $('meta[property="og:video"]').attr("content") ||
      $('meta[property="og:video:secure_url"]').attr("content");

    const image = $('meta[property="og:image"]').attr("content");

    if (!video && !image) {
      return res.status(400).json({
        message:
          "No media found. Profile may be private or Instagram blocked the request.",
      });
    }

    return res.status(200).json({
      type: video ? "video" : "image",
      url: video || image,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to process request",
      error: error.message,
    });
  }
}
