import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

function slugify(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export default function AdminCategories() {
  const { toast } = useToast();
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const { data: cats = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/categories"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({ title: "Category created!" });
      resetForm();
    },
    onError: async (err: any) => {
      const data = await err?.json?.().catch(() => null);
      toast({ title: data?.message || "Error creating category.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PUT", `/api/admin/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({ title: "Category updated!" });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({ title: "Category deleted!" });
    },
  });

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (cat: any) => {
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setEditing(cat.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!name || !slug) {
      toast({ title: "Name and slug are required.", variant: "destructive" });
      return;
    }
    if (editing) {
      updateMutation.mutate({ id: editing, name, slug, description });
    } else {
      createMutation.mutate({ name, slug, description });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Categories</h1>
            <p className="text-gray-400 text-sm">{(cats as any[]).length} category(ies)</p>
          </div>
          <Button className="bg-pink-600 hover:bg-pink-700 text-white" onClick={() => { resetForm(); setShowForm(true); }} data-testid="button-new-category">
            <Plus className="w-4 h-4 mr-2" /> New Category
          </Button>
        </div>

        {showForm && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-base">{editing ? "Edit Category" : "New Category"}</CardTitle>
              <Button size="sm" variant="ghost" className="text-gray-400" onClick={resetForm}><X className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Name</Label>
                  <Input value={name} onChange={(e) => { setName(e.target.value); if (!editing) setSlug(slugify(e.target.value)); }} placeholder="Category name" className="bg-gray-800 border-gray-700 text-white" data-testid="input-category-name" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="category-slug" className="bg-gray-800 border-gray-700 text-white" data-testid="input-category-slug" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Description</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Category description" className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-category">
                <Save className="w-4 h-4 mr-2" /> {editing ? "Update" : "Create"}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : !(cats as any[]).length ? (
            <div className="p-8 text-center text-gray-400">No categories created.</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {(cats as any[]).map((cat: any) => (
                <div key={cat.id} className="p-4 flex items-center justify-between" data-testid={`row-category-${cat.id}`}>
                  <div>
                    <h3 className="text-white font-medium">{cat.name}</h3>
                    <p className="text-gray-500 text-xs">/{cat.slug} {cat.description && `— ${cat.description}`}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800" onClick={() => startEdit(cat)} data-testid={`button-edit-category-${cat.id}`}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => { if (confirm("Delete this category?")) deleteMutation.mutate(cat.id); }}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
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
