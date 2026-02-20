import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminLayout from "./AdminLayout";
import { useState } from "react";

const ACTION_LABELS: Record<string, string> = {
  login: "Login",
  create_post: "Criar Post",
  update_post: "Editar Post",
  trash_post: "Mover p/ Lixeira",
  restore_post: "Restaurar Post",
  delete_post: "Excluir Post",
  create_category: "Criar Categoria",
  create_user: "Criar Usuário",
};

export default function AdminAuditLogs() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<{ logs: any[]; total: number }>({
    queryKey: ["/api/admin/audit-logs", page],
    queryFn: () => fetch(`/api/admin/audit-logs?page=${page}&limit=30`, { credentials: "include" }).then(r => r.json()),
  });

  const totalPages = data ? Math.ceil(data.total / 30) : 1;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Logs de Auditoria</h1>
          <p className="text-gray-400 text-sm">{data?.total ?? 0} registro(s)</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Carregando...</div>
          ) : !data?.logs.length ? (
            <div className="p-8 text-center text-gray-400">Nenhum log encontrado.</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {data.logs.map((log: any) => (
                <div key={log.id} className="p-4 flex items-center justify-between" data-testid={`row-log-${log.id}`}>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-gray-800 text-gray-300">{ACTION_LABELS[log.action] || log.action}</Badge>
                    <div>
                      <p className="text-gray-400 text-sm">
                        {log.targetType && <span className="text-gray-500">{log.targetType} #{log.targetId}</span>}
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs">{new Date(log.createdAt).toLocaleString("pt-BR")}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button size="sm" variant="outline" className="border-gray-700 text-gray-300" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</Button>
            <span className="text-gray-400 text-sm flex items-center px-3">Página {page} de {totalPages}</span>
            <Button size="sm" variant="outline" className="border-gray-700 text-gray-300" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Próxima</Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
