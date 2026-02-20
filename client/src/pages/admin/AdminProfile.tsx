import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, User } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/lib/admin-auth";

export default function AdminProfile() {
  const { user } = useAdminAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PUT", "/api/admin/profile", data),
    onSuccess: () => {
      toast({ title: "Perfil atualizado!" });
      setPassword("");
      setConfirmPassword("");
    },
    onError: () => {
      toast({ title: "Erro ao atualizar perfil.", variant: "destructive" });
    },
  });

  const handleSave = () => {
    if (password && password !== confirmPassword) {
      toast({ title: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    const data: any = { name };
    if (password) data.password = password;
    updateMutation.mutate(data);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
          <p className="text-gray-400 text-sm">Gerencie suas informações pessoais</p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <User className="w-4 h-4" /> Informações
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">E-mail</Label>
              <Input value={user?.email || ""} disabled className="bg-gray-800 border-gray-700 text-gray-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Função</Label>
              <Input value={user?.role || ""} disabled className="bg-gray-800 border-gray-700 text-gray-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-800 border-gray-700 text-white" data-testid="input-profile-name" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-base">Alterar Senha</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Nova Senha</Label>
              <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="bg-gray-800 border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Confirmar Senha</Label>
              <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="••••••••" className="bg-gray-800 border-gray-700 text-white" />
            </div>
          </CardContent>
        </Card>

        <Button className="bg-pink-600 hover:bg-pink-700 text-white" onClick={handleSave} disabled={updateMutation.isPending} data-testid="button-save-profile">
          <Save className="w-4 h-4 mr-2" /> Salvar Alterações
        </Button>
      </div>
    </AdminLayout>
  );
}
