import { useState } from "react";
import { useProcessDownload } from "@/hooks/use-download";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  Camera,
  Check,
  CheckCircle,
  Clapperboard,
  Copy,
  Download,
  AlertCircle,
  Eye,
  History,
  Infinity,
  Loader2,
  Monitor,
  Music,
  PlayCircle,
  Shield,
  Smartphone,
  Video,
  X,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { tools } from "@/lib/tools-config";
import { blogPosts as blogPostsData } from "@/lib/blog-config";

export default function Home() {
  const [url, setUrl] = useState("");
  const { toast } = useToast();
  const processMutation = useProcessDownload();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    processMutation.mutate({ url, toolType: "video" });
  };

  const firstMedia = processMutation.data?.media?.[0];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />
      <main className="flex-grow">

        {/* HERO SECTION */}
        <section className="relative pt-12 sm:pt-16 md:pt-24 pb-16 sm:pb-24 md:pb-32 px-4 overflow-hidden bg-[#F8F9FA]">
          <div className="max-w-6xl mx-auto text-center">

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#1A1A1A] mb-6 leading-[0.95]">
              Baixar Vídeo do Instagram <br />
              <span className="text-[#E6195E]">Grátis em HD</span>
            </h1>

            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4"
            >
              <input
                type="url"
                placeholder="Insira o link do Instagram aqui..."
                className="flex-grow h-16 px-6 rounded-2xl bg-white border border-black/10 focus:border-[#E6195E] outline-none"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              <button
                type="submit"
                disabled={processMutation.isPending || !url}
                className="h-16 px-10 rounded-2xl bg-[#E6195E] text-white font-black shadow-lg disabled:opacity-50"
              >
                {processMutation.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  "BAIXAR AGORA"
                )}
              </button>
            </form>

            {processMutation.isError && (
              <div className="mt-6 text-red-500 font-bold">
                {processMutation.error?.message}
              </div>
            )}
          </div>
        </section>

        {/* RESULT SECTION */}
        <AnimatePresence>
          {processMutation.isSuccess && firstMedia && (
            <section className="py-12 bg-white">
              <div className="max-w-4xl mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl border shadow-xl overflow-hidden flex flex-col md:flex-row"
                >

                  {/* PREVIEW */}
                  <div className="md:w-1/2 bg-black/5 relative aspect-video">
                    {firstMedia.type === "video" ? (
                      <video
                        src={firstMedia.url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={firstMedia.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* DOWNLOAD SIDE */}
                  <div className="p-8 md:w-1/2 flex flex-col justify-center">
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold mb-4">
                        <CheckCircle className="w-4 h-4" /> Sucesso
                      </div>

                      <h3 className="text-2xl font-black mb-3">
                        Download Pronto!
                      </h3>

                      <p className="text-gray-500">
                        Seu arquivo foi processado com sucesso.
                      </p>
                    </div>

                    <a
                      href={firstMedia.url}
                      download
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#E6195E] text-white font-black text-lg shadow-lg hover:brightness-110 transition"
                    >
                      <Download className="w-5 h-5" />
                      {firstMedia.type === "video"
                        ? "BAIXAR VÍDEO"
                        : "BAIXAR IMAGEM"}
                    </a>

                    <button
                      onClick={() => {
                        processMutation.reset();
                        setUrl("");
                      }}
                      className="mt-4 text-sm font-bold text-black/50 hover:text-black uppercase"
                    >
                      Baixar outro arquivo
                    </button>
                  </div>

                </motion.div>
              </div>
            </section>
          )}
        </AnimatePresence>

      </main>
      <Footer />
    </div>
  );
}