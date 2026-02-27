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
  History,
  Infinity,
  Loader2,
  Lock,
  Music,
  PlayCircle,
  Shield,
  Smartphone,
  Video,
  X,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getToolById, tools } from "@/lib/tools-config";

export default function StoriesDownloader() {
  const tool = getToolById("stories")!;
  const [url, setUrl] = useState("");
  const { toast } = useToast();
  const processMutation = useProcessDownload();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    processMutation.mutate({ url, toolType: tool.id });
  };

  const hasMultipleItems = processMutation.isSuccess && processMutation.data?.items && processMutation.data.items.length > 1;

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />
      <main className="flex-grow">
        <section className="relative pt-12 sm:pt-16 md:pt-24 pb-16 sm:pb-24 md:pb-32 px-4 overflow-hidden bg-[#F8F9FA]">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#E6195E]/5 text-[#E6195E] text-[10px] sm:text-xs font-black uppercase tracking-wider mb-4 sm:mb-8 border border-[#E6195E]/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E6195E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E6195E]"></span>
                </span>
                Baixar Story do Instagram Online Grátis
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-black text-[#1A1A1A] mb-4 sm:mb-6 md:mb-8 tracking-tighter leading-[0.95]"
                data-testid="text-page-title"
              >
                {tool.heroTitle} <br />
                <span className="text-[#E6195E]">{tool.heroHighlight}</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2 sm:mb-3 font-bold leading-relaxed px-2">
                Baixador de Story do Instagram Grátis – Cole o Link do Story e Salve Instantaneamente
              </p>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 font-medium leading-relaxed px-2">
                {tool.subtitle}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 md:mb-16 px-2">
                {[
                  { label: "Vídeo", slug: "/", id: "video", icon: Video },
                  { label: "Fotos", slug: "/baixar-fotos-instagram", id: "foto", icon: Camera },
                  { label: "Stories", slug: "/baixar-stories-instagram", id: "stories", icon: History },
                  { label: "Reels", slug: "/baixar-reels-instagram", id: "reels", icon: Clapperboard },
                  { label: "MP3", slug: "/extrair-audio-instagram", id: "audio", icon: Music },
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={item.slug}
                    data-testid={`quick-tool-${item.label.toLowerCase()}`}
                    className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 ${
                      item.id === tool.id
                        ? "bg-[#E6195E] text-white border-[#E6195E] shadow-lg shadow-[#E6195E]/20"
                        : "bg-white border-black/5 text-[#1A1A1A]/70 hover:text-[#E6195E] hover:border-[#E6195E]/20 hover:shadow-md hover:shadow-[#E6195E]/5"
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white p-2.5 sm:p-3 md:p-4 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] shadow-2xl shadow-black/5 border border-black/5 relative">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4">
                  <div className="relative flex-grow">
                    <input
                      type="url"
                      data-testid={`input-${tool.id}-url`}
                      placeholder={tool.placeholder}
                      className="w-full h-14 sm:h-16 md:h-20 pl-4 sm:pl-6 md:pl-10 pr-16 sm:pr-32 md:pr-36 rounded-xl sm:rounded-2xl md:rounded-[1.8rem] bg-[#F8F9FA] border-2 border-transparent focus:bg-white focus:border-[#E6195E]/20 focus:ring-4 md:focus:ring-[12px] focus:ring-[#E6195E]/5 transition-all outline-none text-sm sm:text-base md:text-xl font-medium placeholder:text-black/20 text-ellipsis"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <button
                      type="button"
                      data-testid={`button-paste-${tool.id}`}
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          setUrl(text);
                          toast({ title: "Link colado!", description: "Agora clique em Baixar para processar." });
                        } catch {
                          toast({ variant: "destructive", title: "Erro ao colar", description: "Não foi possível acessar a área de transferência." });
                        }
                      }}
                      className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl md:rounded-2xl bg-white border border-black/5 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-black/60 hover:text-[#E6195E] hover:border-[#E6195E]/20 transition-all shadow-sm active:scale-95"
                      title="Colar link"
                    >
                      <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Colar</span>
                    </button>
                  </div>
                  <button
                    type="submit"
                    data-testid={`button-download-${tool.id}`}
                    disabled={processMutation.isPending || !url}
                    className="h-14 sm:h-16 md:h-20 px-8 sm:px-10 md:px-12 rounded-xl sm:rounded-2xl md:rounded-[1.8rem] bg-[#E6195E] text-white font-black text-lg sm:text-xl md:text-2xl shadow-2xl shadow-[#E6195E]/30 hover:scale-[1.03] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 sm:gap-3 sm:min-w-[180px] md:min-w-[220px]"
                  >
                    {processMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 animate-spin" />
                        <span className="text-sm sm:text-base md:text-lg">Processando...</span>
                      </>
                    ) : (
                      "BAIXAR"
                    )}
                  </button>
                </form>
              </div>

              <AnimatePresence>
                {processMutation.isError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-start gap-3 text-left max-w-4xl mx-auto"
                    data-testid={`text-error-${tool.id}`}
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold mb-1 text-sm sm:text-base">Erro ao processar</p>
                      <p className="font-medium text-xs sm:text-sm text-red-500">{processMutation.error.message}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-black/20">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-black/40">Formatos:</span>
                <div className="flex gap-2 sm:gap-4 items-center">
                  <span className="text-[10px] sm:text-xs font-bold text-black/30">Sem login</span>
                  <span className="text-black/10">|</span>
                  <span className="text-[10px] sm:text-xs font-bold text-black/30">Sem instalação de aplicativo</span>
                  <span className="text-black/10">|</span>
                  <span className="text-[10px] sm:text-xs font-bold text-black/30">Funciona em Android, iPhone e PC</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <AnimatePresence>
          {processMutation.isSuccess && processMutation.data && (
            <section className="py-8 sm:py-12 bg-white border-b border-border/40">
              <div className="max-w-4xl mx-auto px-4">
                {hasMultipleItems ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    data-testid="section-download-result"
                  >
                    <div className="text-center mb-6 sm:mb-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold mb-3 sm:mb-4">
                        <CheckCircle className="w-3 h-3" /> {processMutation.data.items!.length} itens encontrados
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black font-display text-foreground leading-tight" data-testid="text-download-ready">
                        Stories Prontos!
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base md:text-lg mt-2">Baixe cada item individualmente abaixo.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      {processMutation.data.items!.map((item, index) => (
                        <div key={index} className="bg-card rounded-xl sm:rounded-2xl border border-border/60 shadow-lg overflow-hidden">
                          <div className="aspect-square bg-black/5 relative">
                            {item.thumbnail ? (
                              <img src={item.thumbnail} alt={`Item ${index + 1}`} className="w-full h-full object-cover" />
                            ) : item.type === 'image' ? (
                              <img src={item.url} alt={`Item ${index + 1}`} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <PlayCircle className="w-8 h-8 sm:w-12 sm:h-12" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/60 text-white text-[10px] sm:text-xs font-bold">
                              {item.type === 'video' ? 'MP4' : 'JPG'}
                            </div>
                          </div>
                          <div className="p-2 sm:p-3">
                            <a
                              href={`/api/proxy-download?url=${encodeURIComponent(item.url)}&filename=${encodeURIComponent(item.filename || `instagram-story-${index + 1}.${item.type === 'video' ? 'mp4' : 'jpg'}`)}`}
                              data-testid={`link-download-item-${index}`}
                              className="flex items-center justify-center gap-1.5 sm:gap-2 w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#E6195E] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#E6195E]/20 hover:brightness-110 active:scale-95 transition-all"
                            >
                              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              Baixar {index + 1}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-4 sm:mt-6">
                      <button onClick={() => { processMutation.reset(); setUrl(""); }} data-testid={`button-download-another-${tool.id}`} className="py-3 sm:py-4 text-xs sm:text-sm font-bold text-black/40 hover:text-black transition-colors uppercase tracking-widest">
                        Baixar outro arquivo
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border border-border/60 shadow-2xl shadow-black/5 overflow-hidden flex flex-col md:flex-row"
                    data-testid="section-download-result"
                  >
                    <div className="md:w-1/2 bg-black/5 relative aspect-video md:aspect-auto min-h-[200px]">
                      {processMutation.data.thumbnail ? (
                        <img src={`/api/proxy-image?url=${encodeURIComponent(processMutation.data.thumbnail)}`} alt="Preview" className="w-full h-full object-cover absolute inset-0" data-testid="img-download-preview" />
                      ) : processMutation.data.type === 'image' ? (
                        <img src={`/api/proxy-image?url=${encodeURIComponent(processMutation.data.url)}`} alt="Preview" className="w-full h-full object-cover absolute inset-0" data-testid="img-download-preview" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <PlayCircle className="w-12 h-12 sm:w-16 sm:h-16" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                    <div className="p-6 sm:p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                      <div className="mb-6 sm:mb-8 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold mb-3 sm:mb-4">
                          <CheckCircle className="w-3 h-3" /> Sucesso
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black font-display text-foreground mb-3 sm:mb-4 leading-tight" data-testid="text-download-ready">
                          Download Pronto!
                        </h3>
                        <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                          Seu arquivo foi processado com sucesso e está pronto para baixar.
                        </p>
                        {processMutation.data.warning === 'video_not_found' && (
                          <p className="text-amber-600 text-xs sm:text-sm mt-2 bg-amber-50 px-3 py-2 rounded-lg" data-testid="text-video-warning">
                            Não foi possível extrair o vídeo. A imagem de capa foi baixada.
                          </p>
                        )}
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <a
                          href={`/api/proxy-download?url=${encodeURIComponent(processMutation.data.url)}&filename=${encodeURIComponent(processMutation.data.filename || "instagram-story.mp4")}`}
                          data-testid={`link-download-${tool.id}-result`}
                          className="flex items-center justify-center gap-2 sm:gap-3 w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-[#E6195E] text-white font-black text-base sm:text-lg md:text-xl shadow-xl shadow-[#E6195E]/20 hover:scale-[1.02] hover:brightness-110 transition-all"
                        >
                          <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                          {processMutation.data.type === "video" ? "BAIXAR VÍDEO" : "BAIXAR IMAGEM"}
                        </a>
                        <button onClick={() => { processMutation.reset(); setUrl(""); }} data-testid={`button-download-another-${tool.id}`} className="w-full py-3 sm:py-4 text-xs sm:text-sm font-bold text-black/40 hover:text-black transition-colors uppercase tracking-widest">
                          Baixar outro arquivo
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </section>
          )}
        </AnimatePresence>

        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">Procurando Outras Ferramentas?</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#1A1A1A] leading-tight mb-4 sm:mb-6">
                Procurando Outras Ferramentas para Baixar <span className="text-[#E6195E]">Conteúdo do Instagram?</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-3xl mx-auto">
                Oferecemos uma plataforma completa para baixar conteúdo do Instagram, desenvolvida para ajudar você a baixar, salvar, extrair e converter todos os tipos de mídia do Instagram.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground font-medium mt-3">
                Explore nossas outras ferramentas:
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {tools.filter(t => t.id !== "stories" && t.slug !== "/").map((t) => (
                <Link key={t.id} href={t.slug} data-testid={`crosslink-tool-${t.id}`} className="group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#F8F9FA] border border-black/5 hover:border-[#E6195E]/20 hover:shadow-lg hover:shadow-[#E6195E]/5 transition-all text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#E6195E]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#E6195E] group-hover:scale-110 transition-all duration-300">
                    <t.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#E6195E] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-[#1A1A1A]">{t.shortTitle}</h3>
                </Link>
              ))}
            </div>
            <p className="text-center text-sm sm:text-base text-muted-foreground font-medium mt-6 sm:mt-8">
              Tudo funciona diretamente no seu navegador — sem extensões, sem software.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 bg-[#F8F9FA]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#1A1A1A] leading-tight mb-4 sm:mb-6">
                Baixar Stories do Instagram <span className="text-[#E6195E]">Antes Que Desapareçam</span>
              </h2>
            </div>
            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-muted-foreground font-medium leading-relaxed text-center">
              <p>
                Os Stories do Instagram são publicações temporárias que desaparecem após 24 horas. Seja uma memória pessoal, conteúdo de influenciador, promoção de negócio ou atualização em alta, muitos usuários desejam baixar stories do Instagram para mantê-los permanentemente.
              </p>
              <p>
                No entanto, o Instagram não oferece uma opção nativa para baixar o Story de outra pessoa diretamente.
              </p>
              <p className="font-bold text-[#1A1A1A]">
                Nosso Baixador de Story do Instagram funciona como uma poderosa ferramenta de story saver e download de status, permitindo que você:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-6 sm:my-8 max-w-2xl mx-auto">
                {[
                  "Baixar story do Instagram online",
                  "Baixar stories do Instagram em qualidade HD",
                  "Salvar story do Instagram na galeria",
                  "Baixar story do Instagram sem marca d'água",
                  "Baixar story do Instagram privado (acesso autorizado)",
                  "Baixar story com música",
                  "Baixar status do Instagram",
                  "Baixar story pelo link",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 sm:p-4 rounded-xl bg-white border border-black/5 text-left">
                    <CheckCircle className="w-4 h-4 text-[#E6195E] flex-shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-[#1A1A1A]">{item}</span>
                  </div>
                ))}
              </div>
              <p>
                Se você pesquisou por "story saver", "Instagram story downloader" ou "save Insta story", esta página oferece exatamente a ferramenta que você precisa.
              </p>
              <p className="font-bold text-[#1A1A1A]">
                Basta copiar a URL do Story, colar aqui e baixar instantaneamente.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">Mais do Que um Baixador de Story</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#1A1A1A] leading-tight">
                Plataforma Completa para Baixar <span className="text-[#E6195E]">Conteúdo do Instagram</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mt-4 sm:mt-6 max-w-3xl mx-auto font-medium">
                Nossa plataforma não é apenas um simples story saver online. É uma ferramenta completa para baixar conteúdo do Instagram, cobrindo todos os principais formatos:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: "Baixador de Reels do Instagram", desc: "Baixe Reels do Instagram em HD ou 4K sem marca d'água.", slug: "/baixar-reels-instagram" },
                { title: "Baixador de Vídeos do Instagram", desc: "Baixe vídeos padrão do Instagram usando o link direto da publicação.", slug: "/" },
                { title: "Baixador de Foto de Perfil do Instagram", desc: "Visualize e baixe fotos de perfil em tamanho completo e alta resolução.", slug: "/baixar-foto-perfil-instagram" },
                { title: "Baixador de Fotos do Instagram", desc: "Baixe publicações com fotos individuais ou coleções de imagens.", slug: "/baixar-fotos-instagram" },
                { title: "Conversor de Vídeo do Instagram para MP3", desc: "Extraia áudio de vídeos e Reels do Instagram instantaneamente.", slug: "/extrair-audio-instagram" },
              ].map((item, i) => (
                <Link key={i} href={item.slug} className="group p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-[#F8F9FA] border border-black/5 hover:border-[#E6195E]/20 hover:shadow-lg hover:shadow-[#E6195E]/5 transition-all">
                  <h3 className="text-sm sm:text-base font-black text-[#1A1A1A] mb-2 group-hover:text-[#E6195E] transition-colors">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                </Link>
              ))}
            </div>

            <p className="text-center text-muted-foreground text-sm sm:text-base font-medium mt-8 max-w-3xl mx-auto">
              Isso torna nosso site uma solução completa para baixar story do Instagram e todos os outros tipos de conteúdo do Instagram em uma única plataforma segura.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 bg-[#F8F9FA]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">Guia Passo a Passo</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-[#1A1A1A] leading-tight">
                Como Baixar Story <span className="text-[#E6195E]">do Instagram</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-2xl mx-auto font-medium">
                Se você está se perguntando como baixar story do Instagram online, siga estes passos simples:
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
              {[
                { step: "01", title: "Copie o Link do Story", desc: "Abra o Instagram e acesse o perfil onde o story foi publicado. Toque nos três pontos e selecione \"Copiar link\"." },
                { step: "02", title: "Cole o Link no Baixador de Story", desc: "Volte para nossa ferramenta de story saver do Instagram e cole a URL do perfil no campo de download." },
                { step: "03", title: "Clique em Baixar", desc: "Seu vídeo ou foto do Story será processado instantaneamente e estará pronto para salvar." },
              ].map((item, i) => (
                <div key={i} className="text-center p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-white border border-black/5">
                  <div className="text-4xl sm:text-5xl font-display font-black text-[#E6195E]/10 mb-3 sm:mb-4">{item.step}</div>
                  <h3 className="text-lg sm:text-xl font-black mb-2 sm:mb-3 text-[#1A1A1A]">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
              {[
                "Salvar stories na galeria",
                "Baixar story no PC",
                "Armazenar Stories no Android ou iPhone",
                "Reutilizar Stories para edição",
                "Arquivar Stories permanentemente",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-4 rounded-xl bg-white border border-black/5 whitespace-nowrap">
                  <CheckCircle className="w-4 h-4 text-[#E6195E] flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-[#1A1A1A]">{item}</span>
                </div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto bg-white rounded-2xl sm:rounded-[2rem] border border-black/5 p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-black text-[#1A1A1A] mb-4">
                Como Baixar Stories do Instagram no Celular (Android & iPhone)
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground font-medium mb-4">
                Para baixar stories do Instagram no celular sem instalar aplicativo:
              </p>
              <div className="space-y-2.5">
                {[
                  "Abra o aplicativo do Instagram.",
                  "Vá até o Story.",
                  "Abra o perfil onde o story foi compartilhado.",
                  "Toque nos três pontos.",
                  "Toque em Copiar URL do Perfil.",
                  "Abra o navegador.",
                  "Cole o link em nosso story saver.",
                  "Clique em baixar.",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#E6195E]/10 text-[#E6195E] text-xs font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span className="text-sm sm:text-base text-[#1A1A1A] font-medium">{step}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm sm:text-base text-muted-foreground font-medium mt-4">
                Compatível com Android, iPhone, tablets e navegadores de desktop.
              </p>
              <p className="text-sm text-muted-foreground font-bold mt-4 pt-4 border-t border-black/5">
                Sem aplicativo. Sem extensão. Sem marca d'água. Sem necessidade de login.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-2">
                Funciona como um Instagram story downloader baseado em navegador — simples e seguro.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 md:py-32 bg-[#1A1A1A] text-white rounded-2xl sm:rounded-3xl md:rounded-[4rem] mx-2 sm:mx-4 my-4 sm:my-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 md:mb-24">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">POR QUE ESCOLHER NOSSA FERRAMENTA</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4 sm:mb-6 leading-tight">
                Por Que Nosso Baixador de Story <span className="text-[#E6195E]">do Instagram é Melhor</span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg font-medium max-w-3xl mx-auto mt-4">
                Existem muitos sites de story saver disponíveis. Veja por que os usuários confiam no nosso:
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
              {[
                { icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Processamento Rápido", desc: "Servidores otimizados garantem downloads instantâneos." },
                { icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Baixar Stories em HD", desc: "Mantenha a resolução e qualidade originais." },
                { icon: <Lock className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Seguro e Privado", desc: "Não armazenamos URLs de Story, dados pessoais ou credenciais." },
                { icon: <Music className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Baixar Story com Música", desc: "Preserve a música e o áudio original ao baixar Stories do Instagram." },
                { icon: <History className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Baixar Stories Privados", desc: "Compatível com contas privadas (com acesso autorizado)." },
                { icon: <Smartphone className="w-6 h-6 sm:w-8 sm:h-8" />, title: "100% Compatível com Celular", desc: "Baixe stories no Android, iPhone ou desktop — sem aplicativo." },
                { icon: <Infinity className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Story Saver Online Grátis", desc: "Downloads ilimitados, sem assinatura ou taxas ocultas." },
              ].map((feature, i) => (
                <div key={i} className="text-center group">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl md:rounded-[2rem] bg-white/5 flex items-center justify-center mx-auto mb-4 sm:mb-6 md:mb-8 border border-white/5 group-hover:bg-[#E6195E] group-hover:scale-110 transition-all duration-500">
                    <div className="text-[#E6195E] group-hover:text-white transition-colors">{feature.icon}</div>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-xl font-black mb-2 sm:mb-4">{feature.title}</h3>
                  <p className="text-white/40 leading-relaxed text-xs sm:text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-white/50 text-sm sm:text-base font-medium mt-12 max-w-3xl mx-auto">
              Se você está procurando o melhor site para baixar stories do Instagram, esta ferramenta oferece velocidade, qualidade e privacidade em um único lugar.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">Comparação com Outras Ferramentas</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#1A1A1A] leading-tight">
                Compare Nosso Baixador de Story <span className="text-[#E6195E]">com Outras Ferramentas</span>
              </h2>
            </div>

            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full min-w-[500px] border-collapse" data-testid="comparison-table-stories">
                <thead>
                  <tr>
                    <th className="text-left p-3 sm:p-4 text-sm sm:text-base font-black text-[#1A1A1A] bg-[#F8F9FA] rounded-tl-xl border-b border-black/5">Recurso</th>
                    <th className="p-3 sm:p-4 text-sm sm:text-base font-black text-white bg-[#E6195E] border-b border-[#E6195E]">Nossa Ferramenta</th>
                    <th className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-[#1A1A1A]/60 bg-[#F8F9FA] rounded-tr-xl border-b border-black/5">Story Saver Típico</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Baixar Stories do Instagram", us: "HD / Rápido", them: "Básico" },
                    { feature: "Baixar Stories Sem Marca d'Água", us: "Sim", them: "Às vezes" },
                    { feature: "Baixar Story com Música", us: "Sim", them: "Limitado" },
                    { feature: "Baixar Story Privado do Instagram", us: "Acesso Autorizado", them: "Raro" },
                    { feature: "Baixar Story pelo Link", us: "Sim", them: "Sim" },
                    { feature: "Story Saver Online", us: "Sim", them: "Sim" },
                    { feature: "Sem Necessidade de Login", us: "Sim", them: "Sim" },
                    { feature: "Compatível com Celular e PC", us: "Sim", them: "Sim" },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F8F9FA]/50"}>
                      <td className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-[#1A1A1A] border-b border-black/5">{row.feature}</td>
                      <td className="p-3 sm:p-4 text-center border-b border-black/5 bg-[#E6195E]/5">
                        <div className="flex items-center justify-center gap-1.5">
                          <Check className="w-4 h-4 text-[#E6195E]" />
                          <span className="text-xs sm:text-sm font-bold text-[#E6195E]">{row.us}</span>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 text-center border-b border-black/5">
                        {row.them === "Sim" ? (
                          <span className="text-xs sm:text-sm font-medium text-[#1A1A1A]/50">{row.them}</span>
                        ) : row.them === "Básico" ? (
                          <span className="text-xs sm:text-sm font-medium text-[#1A1A1A]/50">{row.them}</span>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <X className="w-4 h-4 text-red-300" />
                            <span className="text-xs sm:text-sm font-medium text-[#1A1A1A]/40">{row.them}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-center text-muted-foreground text-sm sm:text-base font-medium mt-8 max-w-3xl mx-auto">
              Diferente de muitas ferramentas, nosso baixador de story do Instagram suporta downloads em HD, preservação de música, acesso a Stories privados, salvamento sem marca d'água e processamento seguro via navegador.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-24 md:py-32 bg-[#F8F9FA]" id="faq">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10 sm:mb-16 md:mb-20">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">Perguntas Frequentes</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-[#1A1A1A] leading-tight">
                Perguntas Frequentes Sobre Baixar <span className="text-[#E6195E]">Stories do Instagram</span>
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {tool.faqs.map((item, i) => (
                <div key={i} className="bg-white rounded-xl sm:rounded-2xl md:rounded-[2rem] border border-black/5 overflow-hidden">
                  <details className="group">
                    <summary className="flex justify-between items-center gap-4 font-black cursor-pointer list-none p-4 sm:p-6 md:p-8 text-sm sm:text-base md:text-xl text-[#1A1A1A] hover:text-[#E6195E] transition-colors">
                      <span>{item.q}</span>
                      <span className="transition group-open:rotate-180 p-1.5 sm:p-2 bg-[#F8F9FA] rounded-full shadow-sm border border-black/5 flex-shrink-0">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-90" />
                      </span>
                    </summary>
                    <div className="text-muted-foreground px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 pt-0 leading-relaxed font-medium text-sm sm:text-base md:text-lg">
                      {item.a}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 bg-[#1A1A1A] text-white rounded-2xl sm:rounded-3xl md:rounded-[4rem] mx-2 sm:mx-4 my-4 sm:my-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">Todas as Ferramentas</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black leading-tight">
                Explore nossas <span className="text-[#E6195E]">ferramentas</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {tools.filter(otherTool => otherTool.id !== tool.id).map((otherTool) => (
                <Link
                  key={otherTool.id}
                  href={otherTool.slug}
                  data-testid={`link-tool-${otherTool.id}`}
                  className="group p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 hover:bg-[#E6195E]/10 hover:border-[#E6195E]/20 transition-all text-center"
                >
                  <otherTool.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#E6195E] mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-xs sm:text-sm font-bold text-white/80 group-hover:text-white transition-colors">{otherTool.shortTitle}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
