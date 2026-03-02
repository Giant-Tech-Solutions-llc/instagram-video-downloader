import { z } from "zod";
import { insertDownloadSchema } from "./schema";

const mediaItemSchema = z.object({
  url: z.string(),
  thumbnail: z.string().optional(),
  filename: z.string().optional(),
  type: z.enum(["video", "image"]),
});

export const api = {
  download: {
    process: {
      method: "POST" as const,
      path: "/api/download" as const,
      input: z.object({
        url: z.string().url({
          message: "Por favor, insira uma URL válida do Instagram",
        }),
        toolType: z.string().optional(),
      }),
      responses: {
        200: z.object({
          // Original structure (single file)
          url: z.string().optional(),
          thumbnail: z.string().optional(),
          filename: z.string().optional(),
          type: z.enum(["video", "image"]).optional(),

          // Old multi-item support
          items: z.array(mediaItemSchema).optional(),

          // ✅ NEW RapidAPI support
          media: z
            .array(
              z.object({
                type: z.enum(["video", "image"]),
                url: z.string(),
                thumbnail: z.string().optional(),
                filename: z.string().optional(),
              })
            )
            .optional(),
        }),

        400: z.object({
          message: z.string(),
          field: z.string().optional(),
        }),

        429: z.object({
          message: z.string(),
        }),

        500: z.object({
          message: z.string(),
        }),
      },
    },
  },

  stats: {
    get: {
      method: "GET" as const,
      path: "/api/stats" as const,
      responses: {
        200: z.object({
          totalDownloads: z.number(),
          recentDownloads: z.array(
            z.object({
              createdAt: z.string(),
              status: z.string(),
            })
          ),
        }),
      },
    },
  },
};