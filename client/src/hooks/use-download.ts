import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

export type DownloadResponse = z.infer<typeof api.download.process.responses[200]>;
export type DownloadError = z.infer<typeof api.download.process.responses[400]>;
export type StatsResponse = z.infer<typeof api.stats.get.responses[200]>;

export function useProcessDownload() {
  return useMutation<DownloadResponse, Error, { url: string; toolType?: string }>({
    mutationFn: async ({ url, toolType }) => {
      const validatedInput = api.download.process.input.parse({ url, toolType });

      const res = await fetch(api.download.process.path, {
        method: api.download.process.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedInput),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
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
          const errorData = await res.json().catch(() => null);
          if (errorData?.message) {
            throw new Error(errorData.message);
          }
          throw new Error("Erro temporário ao processar. Tente novamente em alguns minutos.");
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
    refetchInterval: 30000, 
  });
}
