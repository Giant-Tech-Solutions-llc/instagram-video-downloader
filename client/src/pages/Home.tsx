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
  Clock,
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
    processMutation.mutate({ url, toolType: 'video' });
  };

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
                {"100% Grátis"}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-black text-[#1A1A1A] mb-4 sm:mb-6 md:mb-8 tracking-tighter leading-[0.95]" data-testid="text-page-title">
                {"Baixar Vídeo do Instagram"} <br />
                <span className="text-[#E6195E]">{"Grátis em HD"}</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 font-medium leading-relaxed px-2">
                {"Faça baixar vídeo do Instagram em alta qualidade instantaneamente."} <br className="hidden md:block" />
                {"Cole o link do vídeo abaixo e baixar videos do Instagram direto para o seu dispositivo — rápido, seguro e sem marca d'água."}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 md:mb-16 px-2">
                {[
                  { label: "Vídeo", slug: "/", icon: Video },
                  { label: "Fotos", slug: "/baixar-fotos-instagram", icon: Camera },
                  { label: "Stories", slug: "/baixar-stories-instagram", icon: History },
                  { label: "Reels", slug: "/baixar-reels-instagram", icon: Clapperboard },
                  { label: "MP3", slug: "/extrair-audio-instagram", icon: Music },
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={item.slug}
                    data-testid={`quick-tool-${item.label.toLowerCase()}`}
                    className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 ${
                      item.slug === "/"
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
                      data-testid="input-instagram-url"
                      placeholder={"Insira o link do Instagram aqui..."}
                      className="w-full h-14 sm:h-16 md:h-20 pl-4 sm:pl-6 md:pl-10 pr-16 sm:pr-32 md:pr-36 rounded-xl sm:rounded-2xl md:rounded-[1.8rem] bg-[#F8F9FA] border-2 border-transparent focus:bg-white focus:border-[#E6195E]/20 focus:ring-4 md:focus:ring-[12px] focus:ring-[#E6195E]/5 transition-all outline-none text-sm sm:text-base md:text-xl font-medium placeholder:text-black/20 text-ellipsis"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <button
                      type="button"
                      data-testid="button-paste-instagram"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          setUrl(text);
                          toast({
                            title: "Link colado!",
                            description: "Agora clique em Baixar para processar.",
                          });
                        } catch {
                          toast({
                            variant: "destructive",
                            title: "Erro ao colar",
                            description: "Não foi possível acessar a área de transferência.",
                          });
                        }
                      }}
                      className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl md:rounded-2xl bg-white border border-black/5 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-black/60 hover:text-[#E6195E] hover:border-[#E6195E]/20 transition-all shadow-sm active:scale-95"
                      title={"Colar link"}
                    >
                      <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{"Colar"}</span>
                    </button>
                  </div>
                  <button
                    type="submit"
                    data-testid="button-download-instagram"
                    disabled={processMutation.isPending || !url}
                    className="h-14 sm:h-16 md:h-20 px-8 sm:px-10 md:px-12 rounded-xl sm:rounded-2xl md:rounded-[1.8rem] bg-[#E6195E] text-white font-black text-lg sm:text-xl md:text-2xl shadow-2xl shadow-[#E6195E]/30 hover:scale-[1.03] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 sm:gap-3 sm:min-w-[180px] md:min-w-[220px]"
                  >
                    {processMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 animate-spin" />
                        <span className="text-sm sm:text-base md:text-lg">{"Processando..."}</span>
                      </>
                    ) : (
                      "BAIXAR AGORA"
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
                    data-testid="text-error-instagram"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold mb-1 text-sm sm:text-base">{"Erro ao processar"}</p>
                      <p className="font-medium text-xs sm:text-sm text-red-500">{processMutation.error.message}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-black/20">
                <div className="flex gap-2 sm:gap-4 items-center">
                  <span className="text-[10px] sm:text-xs font-bold text-black/40">{"Sem aplicativo."}</span>
                  <span className="text-black/10">|</span>
                  <span className="text-[10px] sm:text-xs font-bold text-black/40">{"Sem login."}</span>
                  <span className="text-black/10">|</span>
                  <span className="text-[10px] sm:text-xs font-bold text-black/40">{"100% grátis."}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <AnimatePresence>
          {processMutation.isSuccess && processMutation.data && (
            <section className="py-8 sm:py-12 bg-white border-b border-border/40">
              <div className="max-w-4xl mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border border-border/60 shadow-2xl shadow-black/5 overflow-hidden flex flex-col md:flex-row"
                  data-testid="section-download-result"
                >
                  <div className="md:w-1/2 bg-black/5 relative aspect-video md:aspect-auto min-h-[200px]">
                    {processMutation.data.thumbnail ? (
                      <img
                        src={`/api/proxy-image?url=${encodeURIComponent(processMutation.data.thumbnail)}`}
                        alt="Preview"
                        className="w-full h-full object-cover absolute inset-0"
                        data-testid="img-download-preview"
                      />
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
                        <CheckCircle className="w-3 h-3" /> {"Sucesso"}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black font-display text-foreground mb-3 sm:mb-4 leading-tight" data-testid="text-download-ready">
                        {"Download Pronto!"}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                        {"Seu arquivo foi processado com sucesso e está pronto para baixar."}
                      </p>
                      {processMutation.data.warning === 'video_not_found' && (
                        <p className="text-amber-600 text-xs sm:text-sm mt-2 bg-amber-50 px-3 py-2 rounded-lg" data-testid="text-video-warning">
                          {"Não foi possível extrair o vídeo. A imagem de capa foi baixada."}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <a
                        href={`/api/proxy-download?url=${encodeURIComponent(processMutation.data.url)}&filename=${encodeURIComponent(processMutation.data.filename || "instagram-download.mp4")}`}
                        data-testid="link-download-instagram-result"
                        className="flex items-center justify-center gap-2 sm:gap-3 w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-[#E6195E] text-white font-black text-base sm:text-lg md:text-xl shadow-xl shadow-[#E6195E]/20 hover:scale-[1.02] hover:brightness-110 transition-all"
                      >
                        <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                        {processMutation.data.type === "video" ? "BAIXAR VÍDEO" : "BAIXAR IMAGEM"}
                      </a>

                      <button
                        onClick={() => {
                          processMutation.reset();
                          setUrl("");
                        }}
                        data-testid="button-download-another-instagram"
                        className="w-full py-3 sm:py-4 text-xs sm:text-sm font-bold text-black/40 hover:text-black transition-colors uppercase tracking-widest"
                      >
                        {"Baixar outro arquivo"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          )}
        </AnimatePresence>

        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#1A1A1A] leading-tight mb-4 sm:mb-6">
                {"Baixar Vídeo Instagram Online"} <span className="text-[#E6195E]">{"de Forma Rápida e Segura"}</span>
              </h2>
            </div>
            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-muted-foreground font-medium leading-relaxed text-center">
              <p>
                {"O Instagram está cheio de conteúdos envolventes: Reels, vídeos curtos, publicações longas e muito mais. Embora o aplicativo permita salvar alguns conteúdos, ele não oferece a opção de baixar vídeo do Instagram diretamente para o seu dispositivo."}
              </p>
              <p>
                {"Nosso baixador de vídeo do Instagram permite que você faça baixar vídeo Instagram online em poucos segundos."}
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 my-6 sm:my-8">
                {[
                  "Assistir offline",
                  "Repostar conteúdo",
                  "Editar vídeos",
                  "Fazer backup",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-5 py-4 sm:px-6 sm:py-5 rounded-xl bg-[#F8F9FA] border border-black/5">
                    <CheckCircle className="w-5 h-5 text-[#E6195E] flex-shrink-0" />
                    <span className="text-base sm:text-lg font-bold text-[#1A1A1A] whitespace-nowrap">{item}</span>
                  </div>
                ))}
              </div>
              <p>
                {"Nosso site para baixar video do Instagram torna o processo simples e seguro. Com suporte para publicações públicas, download em alta qualidade e processamento rápido, você pode baixar vídeo do Instagram grátis sem instalar nenhum aplicativo."}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 bg-[#F8F9FA]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">{"Ferramentas Gratuitas, Online e Sem Aplicativo"}</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-[#1A1A1A] leading-tight">
                {"Todas as Ferramentas para Baixar"} <br className="hidden sm:block" /> <span className="text-[#E6195E]">{"Conteúdo do Instagram"}</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-4 sm:mt-6 max-w-3xl mx-auto font-medium px-2">
                {"Escolha a Ferramenta Ideal para Qualquer Tipo de Conteúdo. Oferecemos um conjunto completo de ferramentas para baixar conteúdo do Instagram, desenvolvidas para ajudar você a baixar, salvar, converter, copiar e extrair vídeos e outros conteúdos de forma rápida e segura."}
              </p>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-3 max-w-3xl mx-auto font-medium px-2">
                {"Se você deseja baixar Stories do Instagram, salvar Reels em HD, converter vídeos do Instagram para MP3, baixar vídeos do Instagram sem marca d'água ou usar um site confiável para baixar vídeo do Instagram pelo link, basta escolher a ferramenta ideal abaixo."}
              </p>
              <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-3xl mx-auto font-medium px-2">
                {"Todas as ferramentas são gratuitas, funcionam 100% online e não exigem a instalação de nenhum aplicativo."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
              {tools.filter(t => t.slug !== "/").slice(0, 3).map((tool) => {
                return (
                  <Link
                    key={tool.id}
                    href={tool.slug}
                    data-testid={`home-tool-${tool.id}`}
                    className="group p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] bg-white border border-black/5 hover:border-[#E6195E]/20 hover:shadow-lg hover:shadow-[#E6195E]/5 transition-all text-center"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-[#E6195E]/10 flex items-center justify-center mx-auto mb-4 sm:mb-5 group-hover:bg-[#E6195E] group-hover:scale-110 transition-all duration-300">
                      <tool.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#E6195E] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-black text-[#1A1A1A] mb-2">{tool.title}</h3>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium leading-relaxed">{tool.subtitle}</p>
                  </Link>
                );
              })}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 max-w-4xl mx-auto mt-4 sm:mt-5 md:mt-6">
              {tools.filter(t => t.slug !== "/").slice(3).map((tool) => {
                return (
                  <Link
                    key={tool.id}
                    href={tool.slug}
                    data-testid={`home-tool-${tool.id}`}
                    className="group p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] bg-white border border-black/5 hover:border-[#E6195E]/20 hover:shadow-lg hover:shadow-[#E6195E]/5 transition-all text-center"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-[#E6195E]/10 flex items-center justify-center mx-auto mb-4 sm:mb-5 group-hover:bg-[#E6195E] group-hover:scale-110 transition-all duration-300">
                      <tool.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#E6195E] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-black text-[#1A1A1A] mb-2">{tool.title}</h3>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium leading-relaxed">{tool.subtitle}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">{"3 Passos Simples"}</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-[#1A1A1A] leading-tight">
                {"Como Baixar Video"} <span className="text-[#E6195E]">{"do Instagram"}</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-2xl mx-auto font-medium">
                {"Se você quer saber como baixar video do Instagram, siga estes passos:"}
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
              {[
                { step: "01", title: "Copie o Link", desc: "Abra o Instagram, toque nos três pontos (…) e selecione \"Copiar link\"." },
                { step: "02", title: "Cole o Link", desc: "Volte ao nosso baixador de vídeo do Instagram e cole o link." },
                { step: "03", title: "Clique em Baixar", desc: "Seu vídeo estará pronto em segundos." },
              ].map((item, i) => (
                <div key={i} className="text-center p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-[#F8F9FA] border border-black/5">
                  <div className="text-4xl sm:text-5xl font-display font-black text-[#E6195E]/10 mb-3 sm:mb-4">{item.step}</div>
                  <h3 className="text-lg sm:text-xl font-black mb-2 sm:mb-3 text-[#1A1A1A]">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto bg-[#F8F9FA] rounded-2xl sm:rounded-[2rem] border border-black/5 p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-black text-[#1A1A1A] mb-4">
                {"Como Baixar Vídeo do Instagram no Celular"}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground font-medium mb-4">
                {"Se você estiver usando um dispositivo móvel e não encontrar a opção de link:"}
              </p>
              <div className="space-y-2.5">
                {[
                  "Toque em compartilhar",
                  "Copie o link",
                  "Abra o navegador",
                  "Cole o link em nosso programa online para baixar conteúdo do Instagram",
                  "Clique em baixar",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#E6195E]/10 text-[#E6195E] text-xs font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span className="text-sm sm:text-base text-[#1A1A1A] font-medium">{step}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-bold mt-4 pt-4 border-t border-black/5">
                {"Sem extensões. Sem aplicativos. Sem complicação."}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 md:py-32 bg-[#1A1A1A] text-white rounded-2xl sm:rounded-3xl md:rounded-[4rem] mx-2 sm:mx-4 my-4 sm:my-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 md:mb-24">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">{"Vantagens"}</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4 sm:mb-6 leading-tight">
                {"Por Que Escolher Nosso"} <span className="text-[#E6195E]">{"Baixador de Vídeo do Instagram"}</span>
              </h2>
              <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto font-medium">
                {"Existem muitos sites, mas veja por que somos a melhor escolha para baixar vídeo do Instagram:"}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
              {[
                { icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Processamento Rápido", desc: "Baixe vídeos em segundos." },
                { icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Seguro e Privado", desc: "Não armazenamos seus dados." },
                { icon: <Eye className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Interface Simples", desc: "Sem anúncios confusos." },
                { icon: <Smartphone className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Compatível com Celular", desc: "Funciona em Android e iPhone." },
                { icon: <Monitor className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Alta Qualidade", desc: "Faça baixar video Instagram HD sem marca d'água." },
                { icon: <Infinity className="w-6 h-6 sm:w-8 sm:h-8" />, title: "100% Online", desc: "Sem instalação." },
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

            <p className="text-center text-white/50 text-sm sm:text-base font-medium mt-10 sm:mt-16 max-w-2xl mx-auto">
              {"Se você procura um site para baixar video do Instagram confiável, esta é a solução ideal."}
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">{"Comparação com Outras Ferramentas"}</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#1A1A1A] leading-tight">
                {"Como Nosso Baixador"} <span className="text-[#E6195E]">{"se Compara"}</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-2xl mx-auto font-medium">
                {"Veja como nosso baixador de vídeo do Instagram se destaca em velocidade, qualidade, recursos e segurança."}
              </p>
            </div>

            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full min-w-[700px] border-collapse" data-testid="comparison-table">
                <thead>
                  <tr>
                    <th className="text-left p-3 sm:p-4 text-sm sm:text-base font-black text-[#1A1A1A] bg-[#F8F9FA] rounded-tl-xl border-b border-black/5">{"Recursos"}</th>
                    <th className="p-3 sm:p-4 text-sm sm:text-base font-black text-white bg-[#E6195E] border-b border-[#E6195E]">{"Nossa Ferramenta"}</th>
                    <th className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-[#1A1A1A]/60 bg-[#F8F9FA] border-b border-black/5">{"SSSInstagram"}</th>
                    <th className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-[#1A1A1A]/60 bg-[#F8F9FA] border-b border-black/5">{"SnapInsta"}</th>
                    <th className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-[#1A1A1A]/60 bg-[#F8F9FA] rounded-tr-xl border-b border-black/5">{"SaveClip.app"}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Baixar Vídeos do Instagram", us: "Alta velocidade, HD, sem login", sss: "Downloads rápidos", snap: "Sim", save: "Sim" },
                    { feature: "Baixar Reels do Instagram", us: "Sim – HD", sss: "Sim", snap: "Sim", save: "Sim" },
                    { feature: "Baixar Stories do Instagram", us: "Sim", sss: "Sim", snap: null, save: "Sim" },
                    { feature: "Baixar Fotos do Instagram", us: "Sim", sss: "Sim", snap: "Sim", save: "Sim" },
                    { feature: "Extrair Áudio / Converter para MP3", us: "Sim", sss: null, snap: null, save: null },
                    { feature: "Baixar Foto de Perfil", us: "Sim", sss: null, snap: null, save: null },
                    { feature: "Sem Necessidade de Login", us: "Sim", sss: "Sim", snap: "Sim", save: "Sim" },
                    { feature: "Sem Necessidade de Instalar Aplicativo", us: "Sim", sss: null, snap: "Sim", save: null },
                    { feature: "Download Sem Marca d'Água", us: "Sim", sss: null, snap: "Sim", save: null },
                    { feature: "Compatível com Celular e Computador", us: "Sim", sss: "Sim", snap: "Sim", save: "Sim" },
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
                        {row.sss ? (
                          <span className="text-xs sm:text-sm font-medium text-[#1A1A1A]/50">{row.sss}</span>
                        ) : (
                          <X className="w-4 h-4 text-red-300 mx-auto" />
                        )}
                      </td>
                      <td className="p-3 sm:p-4 text-center border-b border-black/5">
                        {row.snap ? (
                          <span className="text-xs sm:text-sm font-medium text-[#1A1A1A]/50">{row.snap}</span>
                        ) : (
                          <X className="w-4 h-4 text-red-300 mx-auto" />
                        )}
                      </td>
                      <td className="p-3 sm:p-4 text-center border-b border-black/5">
                        {row.save ? (
                          <span className="text-xs sm:text-sm font-medium text-[#1A1A1A]/50">{row.save}</span>
                        ) : (
                          <X className="w-4 h-4 text-red-300 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-center text-muted-foreground text-sm sm:text-base font-medium mt-8 max-w-3xl mx-auto">
              {"Enquanto muitos sites oferecem apenas downloads básicos, nossa plataforma permite baixar vídeo do Instagram, Reels, Stories, fotos, foto de perfil e extrair áudio, tudo em um único lugar."}
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 bg-[#F8F9FA]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">{"BLOG"}</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#1A1A1A] leading-tight">
                {"Nosso"} <span className="text-[#E6195E]">{"Blog"}</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {blogPostsData.slice(0, 3).map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} data-testid={`home-blog-${post.slug}`}>
                  <div className="group bg-white rounded-2xl border border-black/5 overflow-hidden hover:shadow-lg hover:shadow-[#E6195E]/5 hover:border-[#E6195E]/20 transition-all h-full">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-40 sm:h-44 object-cover" loading="lazy" />
                    <div className="p-4 sm:p-5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#E6195E]">{post.category}</span>
                      <h3 className="text-sm sm:text-base font-black text-[#1A1A1A] mt-1.5 mb-2 leading-snug group-hover:text-[#E6195E] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium line-clamp-2">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/blog" data-testid="home-blog-viewall">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-[#E6195E] hover:underline">
                  {"Ver todos os artigos"}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 md:py-32 bg-white" id="faq">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10 sm:mb-16 md:mb-20">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">{"Perguntas Frequentes"}</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-[#1A1A1A] leading-tight">
                {"Perguntas"} <span className="text-[#E6195E]">{"Frequentes"}</span>
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {[
                { q: "1. É grátis baixar vídeo do Instagram?", a: "Sim, nosso site permite baixar vídeo do Instagram gratis sem limites." },
                { q: "2. Posso baixar vídeo do Instagram sem aplicativo?", a: "Sim. Você pode baixar vídeo Instagram online direto no navegador." },
                { q: "3. Preciso fazer login?", a: "Não." },
                { q: "4. Posso baixar vídeo Instagram HD?", a: "Sim, oferecemos baixar video Instagram HD sempre que disponível." },
                { q: "5. Remove marca d'água?", a: "Sim." },
                { q: "6. Posso baixar vídeos privados?", a: "Apenas com acesso autorizado." },
                { q: "7. É seguro usar o site?", a: "Sim, não armazenamos dados." },
                { q: "8. Funciona no celular?", a: "Sim, Android, iPhone, tablet e PC." },
                { q: "9. Como baixar vídeo do Instagram online grátis?", a: "Copie o link, cole no site e clique em baixar." },
                { q: "10. Funciona em qualquer dispositivo?", a: "Sim, sem precisar instalar aplicativo." },
              ].map((item, i) => (
                <div key={i} className="bg-[#F8F9FA] rounded-xl sm:rounded-2xl md:rounded-[2rem] border border-black/5 overflow-hidden">
                  <details className="group">
                    <summary className="flex justify-between items-center gap-4 font-black cursor-pointer list-none p-4 sm:p-6 md:p-8 text-sm sm:text-base md:text-xl text-[#1A1A1A] hover:text-[#E6195E] transition-colors">
                      <span>{item.q}</span>
                      <span className="transition group-open:rotate-180 p-1.5 sm:p-2 bg-white rounded-full shadow-sm border border-black/5 flex-shrink-0">
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
      </main>

      <Footer />
    </div>
  );
}
