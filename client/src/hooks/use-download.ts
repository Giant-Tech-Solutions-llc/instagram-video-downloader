import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

// Type definitions inferred from the schema
export type DownloadResponse = z.infer<typeof api.download.process.responses[200]>;
export type DownloadError = z.infer<typeof api.download.process.responses[400]>;
export type StatsResponse = z.infer<typeof api.stats.get.responses[200]>;

export function useProcessDownload() {
  return useMutation<DownloadResponse, Error, { url: string }>({
    mutationFn: async ({ url }) => {
      // Validate input before sending
      const validatedInput = api.download.process.input.parse({ url });

      const res = await fetch(api.download.process.path, {
        method: api.download.process.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedInput),
      });

      if (!res.ok) {
        // Handle specific error codes
        if (res.status === 400) {
          const errorData = await res.json();
          // Attempt to parse with schema, fallback to generic message
          const parsed = api.download.process.responses[400].safeParse(errorData);
          if (parsed.success) {
            throw new Error(parsed.data.message);
          }
          throw new Error("Solicitação inválida.");
        }
        if (res.status === 429) {
          throw new Error("Muitas solicitações. Tente novamente em instantes.");
        }
        if (res.status === 500) {
          throw new Error("Erro no servidor. Tente novamente mais tarde.");
        }
        throw new Error("Ocorreu um erro desconhecido.");
      }

      return api.download.process.responses[200].parse(await res.json());
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: [api.stats.get.path],
    queryFn: async () => {
      const res = await fetch(api.stats.get.path);
      if (!res.ok) throw new Error("Falha ao carregar estatísticas");
      return api.stats.get.responses[200].parse(await res.json());
    },
    // Refresh stats occasionally to show activity
    refetchInterval: 30000, 
  });
}
