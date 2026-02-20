import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/lib/admin-auth";
import { useState } from "react";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  editor: "Editor",
  author: "Autor",
  contributor: "Contribuidor",
  viewer: "Visualizador",
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-red-500/20 text-red-400",
  editor: "bg-blue-500/20 text-blue-400",
  author: "bg-green-500/20 text-green-400",
  contributor: "bg-yellow-500/20 text-yellow-400",
  viewer: "bg-gray-500/20 text-gray-400",
};

export default function AdminUsers() {
  const { toast } = useToast();
  const { user: currentUser } = useAdminAuth();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("contributor");

  const { data: users = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/users", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
      toast({ title: "Usuário criado!" });
      resetForm();
    },
    onError: async (err: any) => {
      const data = await err?.json?.().catch(() => null);
      toast({ title: data?.message || "Erro ao criar usuário.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PUT", `/api/admin/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Usuário atualizado!" });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
      toast({ title: "Usuário excluído!" });
    },
  });

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("contributor");
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (user: any) => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPassword("");
    setEditing(user.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!name || !email) {
      toast({ title: "Nome e e-mail são obrigatórios.", variant: "destructive" });
      return;
    }
    if (!editing && !password) {
      toast({ title: "Senha é obrigatória para novos usuários.", variant: "destructive" });
      return;
    }
    const data: any = { name, email, role };
    if (password) data.password = password;
    if (editing) {
      updateMutation.mutate({ id: editing, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Usuários</h1>
            <p className="text-gray-400 text-sm">{(users as any[]).length} usuário(s)</p>
          </div>
          <Button className="bg-pink-600 hover:bg-pink-700 text-white" onClick={() => { resetForm(); setShowForm(true); }} data-testid="button-new-user">
            <Plus className="w-4 h-4 mr-2" /> Novo Usuário
          </Button>
        </div>

        {showForm && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-base">{editing ? "Editar Usuário" : "Novo Usuário"}</CardTitle>
              <Button size="sm" variant="ghost" className="text-gray-400" onClick={resetForm}><X className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Nome</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" className="bg-gray-800 border-gray-700 text-white" data-testid="input-user-name" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">E-mail</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email@exemplo.com" className="bg-gray-800 border-gray-700 text-white" data-testid="input-user-email" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Senha {editing && "(deixe vazio para manter)"}</Label>
                  <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="bg-gray-800 border-gray-700 text-white" data-testid="input-user-password" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Função</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="author">Autor</SelectItem>
                      <SelectItem value="contributor">Contribuidor</SelectItem>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-user">
                <Save className="w-4 h-4 mr-2" /> {editing ? "Atualizar" : "Criar"}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Carregando...</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {(users as any[]).map((u: any) => (
                <div key={u.id} className="p-4 flex items-center justify-between" data-testid={`row-user-${u.id}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white text-sm font-medium">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{u.name}</h3>
                      <p className="text-gray-500 text-xs">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={ROLE_COLORS[u.role] || "bg-gray-500/20 text-gray-400"}>
                      {ROLE_LABELS[u.role] || u.role}
                    </Badge>
                    <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800" onClick={() => startEdit(u)} data-testid={`button-edit-user-${u.id}`}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    {u.id !== currentUser?.id && (
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => { if (confirm("Excluir usuário?")) deleteMutation.mutate(u.id); }}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
