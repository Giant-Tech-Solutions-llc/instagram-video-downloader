import { z } from 'zod';
import { insertDownloadSchema } from './schema';

export const api = {
  download: {
    process: {
      method: 'POST' as const,
      path: '/api/download/process' as const,
      input: z.object({
        url: z.string().url({ message: "Por favor, insira uma URL válida do Instagram" }),
      }),
      responses: {
        200: z.object({
          url: z.string(),
          thumbnail: z.string().optional(),
          filename: z.string().optional(),
          type: z.enum(['video', 'image']),
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
  tiktok: {
    process: {
      method: 'POST' as const,
      path: '/api/tiktok/process' as const,
      input: z.object({
        url: z.string().url({ message: "Por favor, insira uma URL válida do TikTok" }),
      }),
      responses: {
        200: z.object({
          url: z.string(),
          thumbnail: z.string().optional(),
          filename: z.string().optional(),
          type: z.enum(['video', 'image']),
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
  pinterest: {
    process: {
      method: 'POST' as const,
      path: '/api/pinterest/process' as const,
      input: z.object({
        url: z.string().url({ message: "Por favor, insira uma URL válida do Pinterest" }),
      }),
      responses: {
        200: z.object({
          url: z.string(),
          thumbnail: z.string().optional(),
          filename: z.string().optional(),
          type: z.enum(['video', 'image']),
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
  facebook: {
    process: {
      method: 'POST' as const,
      path: '/api/facebook/process' as const,
      input: z.object({
        url: z.string().url({ message: "Por favor, insira uma URL válida do Facebook" }),
      }),
      responses: {
        200: z.object({
          url: z.string(),
          thumbnail: z.string().optional(),
          filename: z.string().optional(),
          type: z.enum(['video', 'image']),
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
