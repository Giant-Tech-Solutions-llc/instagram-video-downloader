import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Eye, ArrowLeft, Plus, Trash2, History } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/lib/admin-auth";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function AdminPostEditor() {
  const params = useParams<{ id: string }>();
  const isEditing = !!params.id;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAdminAuth();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [status, setStatus] = useState("draft");
  const [tags, setTags] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [readTime, setReadTime] = useState("");
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [showRevisions, setShowRevisions] = useState(false);
  const [slugManuallySet, setSlugManuallySet] = useState(false);

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["/api/admin/posts", params.id],
    queryFn: () => fetch(`/api/admin/posts/${params.id}`, { credentials: "include" }).then(r => r.json()),
    enabled: isEditing,
  });

  const { data: cats = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/categories"],
  });

  const { data: revisions = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/posts", params.id, "revisions"],
    queryFn: () => fetch(`/api/admin/posts/${params.id}/revisions`, { credentials: "include" }).then(r => r.json()),
    enabled: isEditing && showRevisions,
  });

  useEffect(() => {
    if (post && isEditing) {
      setTitle(post.title || "");
      setSlug(post.slug || "");
      setMetaTitle(post.metaTitle || "");
      setMetaDescription(post.metaDescription || "");
      setContent(post.content || "");
      setExcerpt(post.excerpt || "");
      setFeaturedImage(post.featuredImage || "");
      setCategoryId(post.categoryId ? String(post.categoryId) : "");
      setStatus(post.status || "draft");
      setTags(post.tags?.join(", ") || "");
      setCanonicalUrl(post.canonicalUrl || "");
      setReadTime(post.readTime || "");
      setFaqs(post.faqs || []);
      setSlugManuallySet(true);
    }
  }, [post, isEditing]);

  useEffect(() => {
    if (!slugManuallySet && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManuallySet]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing) {
        return apiRequest("PUT", `/api/admin/posts/${params.id}`, data);
      } else {
        return apiRequest("POST", "/api/admin/posts", data);
      }
    },
    onSuccess: async (res) => {
      const data = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
      toast({ title: isEditing ? "Post atualizado!" : "Post criado!" });
      if (!isEditing) {
        navigate(`/admin/posts/edit/${data.id}`);
      }
    },
    onError: async (err: any) => {
      const data = await err?.json?.().catch(() => null);
      toast({ title: data?.message || "Erro ao salvar post.", variant: "destructive" });
    },
  });

  const handleSave = (saveStatus?: string) => {
    if (!title || !slug) {
      toast({ title: "Título e slug são obrigatórios.", variant: "destructive" });
      return;
    }

    const postData: any = {
      title,
      slug,
      metaTitle: metaTitle || title,
      metaDescription,
      content,
      excerpt,
      featuredImage,
      categoryId: categoryId ? Number(categoryId) : null,
      status: saveStatus || status,
      tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      canonicalUrl,
      readTime,
      faqs: faqs.filter(f => f.question && f.answer),
    };

    if (saveStatus === "published" && (!post || post.status !== "published")) {
      postData.publishedAt = new Date().toISOString();
    }

    saveMutation.mutate(postData);
  };

  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const canPublish = user?.role === "super_admin" || user?.role === "editor";

  if (isEditing && postLoading) {
    return (
      <AdminLayout>
        <div className="text-gray-400 text-center p-8">Carregando...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/posts")}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isEditing ? "Editar Post" : "Novo Post"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => handleSave("draft")}
              disabled={saveMutation.isPending}
              data-testid="button-save-draft"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Rascunho
            </Button>
            {canPublish && (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleSave("published")}
                disabled={saveMutation.isPending}
                data-testid="button-publish"
              >
                <Eye className="w-4 h-4 mr-2" />
                Publicar
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Título</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título do post"
                    className="bg-gray-800 border-gray-700 text-white text-lg"
                    data-testid="input-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Slug</Label>
                  <Input
                    value={slug}
                    onChange={(e) => { setSlug(e.target.value); setSlugManuallySet(true); }}
                    placeholder="url-do-post"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-slug"
                  />
                  <p className="text-gray-500 text-xs">/blog/{slug}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-base">Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escreva o conteúdo do post em HTML..."
                  className="bg-gray-800 border-gray-700 text-white min-h-[400px] font-mono text-sm"
                  data-testid="input-content"
                />
                <p className="text-gray-500 text-xs mt-2">Suporta HTML. Use tags como &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt; etc.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-base">Resumo / Excerto</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Breve descrição do post (exibido na listagem do blog)"
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                  data-testid="input-excerpt"
                />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white text-base">FAQ</CardTitle>
                <Button size="sm" variant="outline" className="border-gray-700 text-gray-300" onClick={addFaq} data-testid="button-add-faq">
                  <Plus className="w-3 h-3 mr-1" /> Adicionar
                </Button>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {faqs.length === 0 && (
                  <p className="text-gray-500 text-sm">Nenhuma FAQ adicionada. Clique em "Adicionar" para criar.</p>
                )}
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2 p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300 text-sm">Pergunta {index + 1}</Label>
                      <Button size="sm" variant="ghost" className="text-red-400 h-6" onClick={() => removeFaq(index)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateFaq(index, "question", e.target.value)}
                      placeholder="Pergunta"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, "answer", e.target.value)}
                      placeholder="Resposta"
                      className="bg-gray-700 border-gray-600 text-white min-h-[60px]"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {isEditing && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white text-base">Revisões</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-gray-300"
                    onClick={() => setShowRevisions(!showRevisions)}
                  >
                    <History className="w-3 h-3 mr-1" />
                    {showRevisions ? "Ocultar" : "Ver Revisões"}
                  </Button>
                </CardHeader>
                {showRevisions && (
                  <CardContent className="p-4">
                    {revisions.length === 0 ? (
                      <p className="text-gray-500 text-sm">Nenhuma revisão encontrada.</p>
                    ) : (
                      <div className="space-y-2">
                        {revisions.map((rev: any) => (
                          <div key={rev.id} className="p-3 bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">
                                {new Date(rev.createdAt).toLocaleString("pt-BR")}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-pink-400 h-6 text-xs"
                                onClick={() => {
                                  const snapshot = rev.contentSnapshot as any;
                                  if (snapshot.title) setTitle(snapshot.title);
                                  if (snapshot.content) setContent(snapshot.content);
                                  if (snapshot.metaTitle) setMetaTitle(snapshot.metaTitle);
                                  if (snapshot.metaDescription) setMetaDescription(snapshot.metaDescription);
                                  toast({ title: "Revisão restaurada no editor. Salve para aplicar." });
                                }}
                              >
                                Restaurar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-base">Publicação</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      {canPublish && <SelectItem value="published">Publicado</SelectItem>}
                      {canPublish && <SelectItem value="scheduled">Agendado</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Categoria</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(cats as any[]).map((cat: any) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Tags (separadas por vírgula)</Label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="instagram, download, tutorial"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-tags"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Tempo de Leitura</Label>
                  <Input
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="5 min"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-base">Imagem Destacada</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Input
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="URL da imagem ou caminho do upload"
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-featured-image"
                />
                {featuredImage && (
                  <img
                    src={featuredImage}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-base">SEO</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Meta Título</Label>
                  <Input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Título para buscadores (max 60 chars)"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-meta-title"
                  />
                  <p className="text-gray-500 text-xs">{metaTitle.length}/60 caracteres</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Meta Descrição</Label>
                  <Textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Descrição para buscadores (max 160 chars)"
                    className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
                    data-testid="input-meta-description"
                  />
                  <p className="text-gray-500 text-xs">{metaDescription.length}/160 caracteres</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">URL Canônica</Label>
                  <Input
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://..."
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                {metaTitle && (
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <p className="text-blue-400 text-sm font-medium truncate">{metaTitle || title}</p>
                    <p className="text-green-400 text-xs truncate">/blog/{slug}</p>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{metaDescription || excerpt}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
