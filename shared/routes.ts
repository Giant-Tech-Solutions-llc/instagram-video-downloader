import { z } from 'zod';
import { insertDownloadSchema } from './schema';

const mediaItemSchema = z.object({
  url: z.string(),
  thumbnail: z.string().optional(),
  filename: z.string().optional(),
  type: z.enum(['video', 'image']),
});

export const api = {
  download: {
    process: {
      method: 'POST' as const,
      path: '/api/download' as const, // ✅ FIXED FOR VERCEL
      input: z.object({
        url: z.string().url({ message: "Por favor, insira uma URL válida do Instagram" }),
        toolType: z.string().optional(),
      }),
      responses: {
        200: z.object({
          url: z.string(),
          thumbnail: z.string().optional(),
          filename: z.string().optional(),
          type: z.enum(['video', 'image']),
          items: z.array(mediaItemSchema).optional(),
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
      method: 'GET' as const,
      path: '/api/stats' as const,
      responses: {
        200: z.object({
          totalDownloads: z.number(),
          recentDownloads: z.array(z.object({
            createdAt: z.string(),
            status: z.string(),
          })),
        }),
      },
    },
  }
};
