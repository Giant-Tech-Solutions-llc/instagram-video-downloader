import { useEffect, useState, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, Eye, ArrowLeft, Plus, Trash2, History, Clock, FileText, Link2, Calendar, Search } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
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

function countWords(text: string): number {
  if (!text) return 0;
  const plain = text.replace(/[#*_`~\[\]()>!|-]/g, " ").replace(/\s+/g, " ").trim();
  return plain ? plain.split(" ").length : 0;
}

function calcReadTime(wordCount: number): string {
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
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
  const [internalLinks, setInternalLinks] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [showRevisions, setShowRevisions] = useState(false);
  const [slugManuallySet, setSlugManuallySet] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasChangesRef = useRef(false);

  const wordCount = countWords(content);
  const computedReadTime = calcReadTime(wordCount);

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
      setInternalLinks(post.internalLinks || "");
      setFaqs(post.faqs || []);
      setSlugManuallySet(true);
      if (post.publishedAt) {
        const d = new Date(post.publishedAt);
        setPublishDate(d.toISOString().slice(0, 16));
      }
      hasChangesRef.current = false;
    }
  }, [post, isEditing]);

  useEffect(() => {
    if (!slugManuallySet && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManuallySet]);

  useEffect(() => {
    setReadTime(computedReadTime);
  }, [computedReadTime]);

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
      setLastSaved(new Date());
      hasChangesRef.current = false;
      if (!isEditing) {
        navigate(`/admin/posts/edit/${data.id}`);
      }
    },
    onError: async (err: any) => {
      const data = await err?.json?.().catch(() => null);
      toast({ title: data?.message || "Error saving post.", variant: "destructive" });
    },
  });

  const buildPostData = useCallback((saveStatus?: string) => {
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
      internalLinks,
      faqs: faqs.filter(f => f.question && f.answer),
    };

    if (publishDate) {
      postData.publishedAt = new Date(publishDate).toISOString();
    } else if (saveStatus === "published" && (!post || post.status !== "published")) {
      postData.publishedAt = new Date().toISOString();
    }

    return postData;
  }, [title, slug, metaTitle, metaDescription, content, excerpt, featuredImage, categoryId, status, tags, canonicalUrl, readTime, internalLinks, faqs, publishDate, post]);

  const handleSave = (saveStatus?: string) => {
    if (!title || !slug) {
      toast({ title: "Title and slug are required.", variant: "destructive" });
      return;
    }
    const postData = buildPostData(saveStatus);
    saveMutation.mutate(postData);
    if (saveStatus !== "draft") {
      toast({ title: saveStatus === "published" ? "Post published!" : "Post saved!" });
    }
  };

  useEffect(() => {
    hasChangesRef.current = true;
  }, [title, slug, metaTitle, metaDescription, content, excerpt, featuredImage, categoryId, status, tags, canonicalUrl, readTime, internalLinks, publishDate, faqs]);

  useEffect(() => {
    if (!autosaveEnabled || !isEditing) return;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      if (hasChangesRef.current && title && slug && !saveMutation.isPending) {
        const postData = buildPostData();
        saveMutation.mutate(postData);
      }
    }, 30000);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [title, slug, metaTitle, metaDescription, content, excerpt, featuredImage, categoryId, status, tags, canonicalUrl, readTime, internalLinks, publishDate, faqs, isEditing, autosaveEnabled, buildPostData]);

  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const canPublish = user?.role === "super_admin" || user?.role === "editor";

  const metaTitleLen = (metaTitle || title).length;
  const metaDescLen = metaDescription.length;
  const metaTitleColor = metaTitleLen > 60 ? "text-red-400" : metaTitleLen > 50 ? "text-yellow-400" : "text-green-400";
  const metaDescColor = metaDescLen > 160 ? "text-red-400" : metaDescLen > 140 ? "text-yellow-400" : "text-green-400";

  if (isEditing && postLoading) {
    return (
      <AdminLayout>
        <div className="text-gray-400 text-center p-8">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
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
                {isEditing ? "Edit Post" : "New Post"}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-gray-500 text-xs flex items-center gap-1">
                  <FileText className="w-3 h-3" /> {wordCount} words
                </span>
                <span className="text-gray-500 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {computedReadTime}
                </span>
                {lastSaved && (
                  <span className="text-gray-500 text-xs">
                    Saved {lastSaved.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
                {isEditing && autosaveEnabled && (
                  <Badge className="bg-green-500/10 text-green-400 text-[10px] px-1.5 py-0">Autosave ON</Badge>
                )}
              </div>
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
              Save Draft
            </Button>
            {canPublish && (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleSave("published")}
                disabled={saveMutation.isPending}
                data-testid="button-publish"
              >
                <Eye className="w-4 h-4 mr-2" />
                Publish
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title"
                    className="bg-gray-800 border-gray-700 text-white text-lg"
                    data-testid="input-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Slug</Label>
                  <Input
                    value={slug}
                    onChange={(e) => { setSlug(e.target.value); setSlugManuallySet(true); }}
                    placeholder="post-url-slug"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-slug"
                  />
                  <p className="text-gray-500 text-xs">/blog/{slug}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white text-base">Content</CardTitle>
                <span className="text-gray-500 text-xs">{wordCount} words &middot; {computedReadTime}</span>
              </CardHeader>
              <CardContent className="p-4" data-color-mode="dark">
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || "")}
                  height={500}
                  preview="live"
                  data-testid="input-content"
                />
                <p className="text-gray-500 text-xs mt-2">Write using Markdown. Use # for headings, **bold**, *italic*, - for lists, etc.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-base">Excerpt</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief post description (shown in blog listing)"
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                  data-testid="input-excerpt"
                />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white text-base">FAQ</CardTitle>
                <Button size="sm" variant="outline" className="border-gray-700 text-gray-300" onClick={addFaq} data-testid="button-add-faq">
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {faqs.length === 0 && (
                  <p className="text-gray-500 text-sm">No FAQs added. Click "Add" to create one.</p>
                )}
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2 p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300 text-sm">Question {index + 1}</Label>
                      <Button size="sm" variant="ghost" className="text-red-400 h-6" onClick={() => removeFaq(index)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateFaq(index, "question", e.target.value)}
                      placeholder="Question"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, "answer", e.target.value)}
                      placeholder="Answer"
                      className="bg-gray-700 border-gray-600 text-white min-h-[60px]"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {isEditing && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white text-base">Revisions</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-gray-300"
                    onClick={() => setShowRevisions(!showRevisions)}
                  >
                    <History className="w-3 h-3 mr-1" />
                    {showRevisions ? "Hide" : "View Revisions"}
                  </Button>
                </CardHeader>
                {showRevisions && (
                  <CardContent className="p-4">
                    {revisions.length === 0 ? (
                      <p className="text-gray-500 text-sm">No revisions found.</p>
                    ) : (
                      <div className="space-y-2">
                        {revisions.map((rev: any) => (
                          <div key={rev.id} className="p-3 bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">
                                {new Date(rev.createdAt).toLocaleString("en-US")}
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
                                  toast({ title: "Revision restored in editor. Save to apply." });
                                }}
                              >
                                Restore
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
                <CardTitle className="text-white text-base">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      {canPublish && <SelectItem value="published">Published</SelectItem>}
                      {canPublish && <SelectItem value="scheduled">Scheduled</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Publish Date
                  </Label>
                  <Input
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-publish-date"
                  />
                  <p className="text-gray-500 text-[10px]">Leave empty to use current time when publishing</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select..." />
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
                  <Label className="text-gray-300 text-sm">Tags (comma separated)</Label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="instagram, download, tutorial"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-tags"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Read Time
                  </Label>
                  <Input
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="5 min read"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <p className="text-gray-500 text-[10px]">Auto-calculated: {computedReadTime}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-base">Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Input
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="Image URL or upload path"
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
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <Link2 className="w-4 h-4" /> Internal Links
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Textarea
                  value={internalLinks}
                  onChange={(e) => setInternalLinks(e.target.value)}
                  placeholder="Add internal linking notes or URLs to link to from this post, one per line"
                  className="bg-gray-800 border-gray-700 text-white min-h-[80px] text-sm"
                  data-testid="input-internal-links"
                />
                <p className="text-gray-500 text-[10px] mt-1">Notes for internal linking strategy</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <Search className="w-4 h-4" /> SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Meta Title</Label>
                  <Input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Title for search engines (max 60 chars)"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-meta-title"
                  />
                  <div className="flex items-center justify-between">
                    <p className={`text-xs ${metaTitleColor}`}>{metaTitleLen}/60 characters</p>
                    {metaTitleLen > 60 && <span className="text-red-400 text-[10px]">Too long!</span>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Meta Description</Label>
                  <Textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Description for search engines (max 160 chars)"
                    className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
                    data-testid="input-meta-description"
                  />
                  <div className="flex items-center justify-between">
                    <p className={`text-xs ${metaDescColor}`}>{metaDescLen}/160 characters</p>
                    {metaDescLen > 160 && <span className="text-red-400 text-[10px]">Too long!</span>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Canonical URL</Label>
                  <Input
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://..."
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-3 py-2 border-b border-gray-700">
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider font-medium">Google Preview</p>
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-[#1a0dab] text-base font-medium leading-tight truncate">
                      {metaTitle || title || "Page Title"}
                    </p>
                    <p className="text-[#006621] text-xs mt-0.5 truncate">
                      baixarvideo.com/blog/{slug || "post-slug"}
                    </p>
                    <p className="text-[#545454] text-xs mt-1 line-clamp-2 leading-relaxed">
                      {metaDescription || excerpt || "Add a meta description to see how your page will appear in Google search results."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
