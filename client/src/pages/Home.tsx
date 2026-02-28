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
  History,
  Copy,
  Download,
  AlertCircle,
  Eye,
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

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />

      <main className="flex-grow">

        {/* ================= INPUT SECTION ================= */}
        <section className="pt-20 pb-24 px-4 bg-[#F8F9FA]">
          <div className="max-w-4xl mx-auto text-center">

            <h1 className="text-5xl font-black mb-6">
              Baixar Vídeo do Instagram <br />
              <span className="text-[#E6195E]">Grátis em HD</span>
            </h1>

            <form
              onSubmit={handleSubmit}
              className="bg-white p-4 rounded-3xl shadow-lg flex flex-col sm:flex-row gap-4"
            >
              <input
                type="url"
                placeholder="Cole o link do Instagram aqui..."
                className="flex-grow h-16 px-6 rounded-2xl bg-gray-100 outline-none"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              <button
                type="submit"
                disabled={processMutation.isPending || !url}
                className="h-16 px-10 rounded-2xl bg-[#E6195E] text-white font-bold text-lg disabled:opacity-50"
              >
                {processMutation.isPending ? "Processando..." : "BAIXAR AGORA"}
              </button>
            </form>

            {/* ERROR */}
            <AnimatePresence>
              {processMutation.isError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl"
                >
                  {processMutation.error.message}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </section>

        {/* ================= RESULT SECTION ================= */}
        <AnimatePresence>
          {processMutation.isSuccess && processMutation.data && (
            <section className="py-16 bg-white">
              <div className="max-w-4xl mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row"
                >
                  {/* PREVIEW */}
                  <div className="md:w-1/2 bg-black/5 relative aspect-video">
                    {processMutation.data.thumbnail ? (
                      <img
                        src={processMutation.data.thumbnail}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlayCircle className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* DOWNLOAD SIDE */}
                  <div className="md:w-1/2 p-10 flex flex-col justify-center text-center md:text-left">
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold mb-4">
                        <CheckCircle className="w-4 h-4" /> Sucesso
                      </div>

                      <h3 className="text-3xl font-black mb-3">
                        Download Pronto!
                      </h3>

                      <p className="text-gray-500">
                        Seu arquivo está pronto para baixar.
                      </p>
                    </div>

                    {/* FIXED DOWNLOAD BUTTON */}
                    <a
                      href={processMutation.data.url}
                      download={
                        processMutation.data.filename ||
                        "instagram-download.mp4"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-[#E6195E] text-white font-black text-lg hover:scale-[1.02] transition-all"
                    >
                      <Download className="w-6 h-6" />
                      {processMutation.data.type === "video"
                        ? "BAIXAR VÍDEO"
                        : "BAIXAR IMAGEM"}
                    </a>

                    <button
                      onClick={() => {
                        processMutation.reset();
                        setUrl("");
                      }}
                      className="mt-4 text-sm text-gray-400 font-bold uppercase"
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
}import { useState } from "react";
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
  History,
  Copy,
  Download,
  AlertCircle,
  Eye,
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

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />

      <main className="flex-grow">

        {/* ================= INPUT SECTION ================= */}
        <section className="pt-20 pb-24 px-4 bg-[#F8F9FA]">
          <div className="max-w-4xl mx-auto text-center">

            <h1 className="text-5xl font-black mb-6">
              Baixar Vídeo do Instagram <br />
              <span className="text-[#E6195E]">Grátis em HD</span>
            </h1>

            <form
              onSubmit={handleSubmit}
              className="bg-white p-4 rounded-3xl shadow-lg flex flex-col sm:flex-row gap-4"
            >
              <input
                type="url"
                placeholder="Cole o link do Instagram aqui..."
                className="flex-grow h-16 px-6 rounded-2xl bg-gray-100 outline-none"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              <button
                type="submit"
                disabled={processMutation.isPending || !url}
                className="h-16 px-10 rounded-2xl bg-[#E6195E] text-white font-bold text-lg disabled:opacity-50"
              >
                {processMutation.isPending ? "Processando..." : "BAIXAR AGORA"}
              </button>
            </form>

            {/* ERROR */}
            <AnimatePresence>
              {processMutation.isError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl"
                >
                  {processMutation.error.message}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </section>

        {/* ================= RESULT SECTION ================= */}
        <AnimatePresence>
          {processMutation.isSuccess && processMutation.data && (
            <section className="py-16 bg-white">
              <div className="max-w-4xl mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row"
                >
                  {/* PREVIEW */}
                  <div className="md:w-1/2 bg-black/5 relative aspect-video">
                    {processMutation.data.thumbnail ? (
                      <img
                        src={processMutation.data.thumbnail}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlayCircle className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* DOWNLOAD SIDE */}
                  <div className="md:w-1/2 p-10 flex flex-col justify-center text-center md:text-left">
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold mb-4">
                        <CheckCircle className="w-4 h-4" /> Sucesso
                      </div>

                      <h3 className="text-3xl font-black mb-3">
                        Download Pronto!
                      </h3>

                      <p className="text-gray-500">
                        Seu arquivo está pronto para baixar.
                      </p>
                    </div>

                    {/* FIXED DOWNLOAD BUTTON */}
                    <a
                      href={processMutation.data.url}
                      download={
                        processMutation.data.filename ||
                        "instagram-download.mp4"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-[#E6195E] text-white font-black text-lg hover:scale-[1.02] transition-all"
                    >
                      <Download className="w-6 h-6" />
                      {processMutation.data.type === "video"
                        ? "BAIXAR VÍDEO"
                        : "BAIXAR IMAGEM"}
                    </a>

                    <button
                      onClick={() => {
                        processMutation.reset();
                        setUrl("");
                      }}
                      className="mt-4 text-sm text-gray-400 font-bold uppercase"
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