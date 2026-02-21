import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Trash2, Copy, Image } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState } from "react";

export default function AdminMedia() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: mediaList = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/media"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => fetch(`/api/admin/media/${id}`, { method: "DELETE", credentials: "include" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      toast({ title: "Media deleted!" });
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Upload failed.");
      }

      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      toast({ title: "Upload successful!" });
    } catch (error: any) {
      toast({ title: error.message || "Upload failed.", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copied!" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Media</h1>
            <p className="text-gray-400 text-sm">{(mediaList as any[]).length} file(s)</p>
          </div>
          <div>
            <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" data-testid="input-file-upload" />
            <Button className="bg-pink-600 hover:bg-pink-700 text-white" onClick={() => fileInputRef.current?.click()} disabled={uploading} data-testid="button-upload">
              <Upload className="w-4 h-4 mr-2" /> {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-gray-400 text-center p-8">Loading...</div>
        ) : !(mediaList as any[]).length ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <Image className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No media uploaded.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(mediaList as any[]).map((m: any) => (
              <Card key={m.id} className="bg-gray-900 border-gray-800 overflow-hidden" data-testid={`card-media-${m.id}`}>
                <div className="aspect-square bg-gray-800 flex items-center justify-center">
                  <img src={m.url} alt={m.originalName} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
                <CardContent className="p-3">
                  <p className="text-white text-xs truncate mb-2">{m.originalName}</p>
                  <p className="text-gray-500 text-xs mb-2">{(m.size / 1024).toFixed(1)} KB</p>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="flex-1 border-gray-700 text-gray-300 text-xs h-7" onClick={() => copyUrl(m.url)}>
                      <Copy className="w-3 h-3 mr-1" /> Copy URL
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-400 h-7" onClick={() => { if (confirm("Delete this file?")) deleteMutation.mutate(m.id); }}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
