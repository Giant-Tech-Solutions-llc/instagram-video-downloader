import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, Search, RotateCcw } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const STATUS_LABELS: Record<string, string> = {
  draft: "Rascunho",
  published: "Publicado",
  scheduled: "Agendado",
  trashed: "Lixeira",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-yellow-500/20 text-yellow-400",
  published: "bg-green-500/20 text-green-400",
  scheduled: "bg-blue-500/20 text-blue-400",
  trashed: "bg-red-500/20 text-red-400",
};

export default function AdminPosts({ trashed = false }: { trashed?: boolean }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(trashed ? "trashed" : "");
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const queryParams = new URLSearchParams();
  if (trashed) queryParams.set("status", "trashed");
  else if (statusFilter) queryParams.set("status", statusFilter);
  if (search) queryParams.set("search", search);
  queryParams.set("page", String(page));

  const { data, isLoading } = useQuery<{ posts: any[]; total: number }>({
    queryKey: ["/api/admin/posts", queryParams.toString()],
    queryFn: () => fetch(`/api/admin/posts?${queryParams}`, { credentials: "include" }).then(r => r.json()),
  });

  const trashMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/posts/${id}/trash`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
      toast({ title: "Post movido para a lixeira." });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/posts/${id}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
      toast({ title: "Post restaurado." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
      toast({ title: "Post excluído permanentemente." });
    },
  });

  const totalPages = data ? Math.ceil(data.total / 20) : 1;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {trashed ? "Lixeira" : "Posts"}
            </h1>
            <p className="text-gray-400 text-sm">
              {data ? `${data.total} post(s) encontrado(s)` : "Carregando..."}
            </p>
          </div>
          {!trashed && (
            <Link href="/admin/posts/create">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white" data-testid="button-new-post">
                <Plus className="w-4 h-4 mr-2" /> Novo Post
              </Button>
            </Link>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Buscar por título..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 bg-gray-800 border-gray-700 text-white"
              data-testid="input-search"
            />
          </div>
          {!trashed && (
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1); }}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="scheduled">Agendado</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Carregando...</div>
          ) : !data?.posts.length ? (
            <div className="p-8 text-center text-gray-400">Nenhum post encontrado.</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {data.posts.map((post: any) => (
                <div key={post.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" data-testid={`row-post-${post.id}`}>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{post.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge className={STATUS_COLORS[post.status] || "bg-gray-500/20 text-gray-400"}>
                        {STATUS_LABELS[post.status] || post.status}
                      </Badge>
                      <span className="text-gray-500 text-xs">/{post.slug}</span>
                      {post.updatedAt && (
                        <span className="text-gray-500 text-xs">
                          {new Date(post.updatedAt).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {trashed ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          onClick={() => restoreMutation.mutate(post.id)}
                          data-testid={`button-restore-${post.id}`}
                        >
                          <RotateCcw className="w-3 h-3 mr-1" /> Restaurar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Excluir permanentemente?")) deleteMutation.mutate(post.id);
                          }}
                          data-testid={`button-delete-${post.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        {post.status === "published" && (
                          <Link href={`/blog/${post.slug}`}>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/posts/edit/${post.id}`}>
                          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800" data-testid={`button-edit-${post.id}`}>
                            <Edit className="w-3 h-3 mr-1" /> Editar
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => trashMutation.mutate(post.id)}
                          data-testid={`button-trash-${post.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 text-gray-300"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              Anterior
            </Button>
            <span className="text-gray-400 text-sm flex items-center px-3">
              Página {page} de {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 text-gray-300"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
