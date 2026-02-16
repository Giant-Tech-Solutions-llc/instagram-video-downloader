import { useState } from "react";
import { useProcessDownload } from "@/hooks/use-download";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  Copy,
  Download,
  AlertCircle,
  Loader2,
  PlayCircle,
  Smartphone,
  Zap,
  Clock,
  Infinity,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { tools } from "@/lib/tools-config";

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
        <section className="relative pt-24 pb-32 px-4 overflow-hidden bg-[#F8F9FA]">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6195E]/5 text-[#E6195E] text-xs font-black uppercase tracking-wider mb-8 border border-[#E6195E]/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E6195E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E6195E]"></span>
                </span>
                Ferramenta 100% Gratuita
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-black text-[#1A1A1A] mb-8 tracking-tighter leading-[0.95]" data-testid="text-page-title">
                Baixar Vídeo <br />
                <span className="text-[#E6195E]">do Instagram</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
                A solução definitiva para salvar conteúdos do Instagram. <br className="hidden md:block" />
                Rápido, seguro e em alta qualidade com apenas um clique.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-black/5 relative">
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <input
                      type="url"
                      data-testid="input-instagram-url"
                      placeholder="Insira o link do Instagram aqui..."
                      className="w-full h-20 pl-10 pr-32 rounded-[1.8rem] bg-[#F8F9FA] border-2 border-transparent focus:bg-white focus:border-[#E6195E]/20 focus:ring-[12px] focus:ring-[#E6195E]/5 transition-all outline-none text-xl font-medium placeholder:text-black/20"
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-2xl bg-white border border-black/5 flex items-center gap-2 text-sm font-bold text-black/60 hover:text-[#E6195E] hover:border-[#E6195E]/20 transition-all shadow-sm active:scale-95"
                      title="Colar link"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Colar</span>
                    </button>
                  </div>
                  <button
                    type="submit"
                    data-testid="button-download-instagram"
                    disabled={processMutation.isPending || !url}
                    className="h-20 px-12 rounded-[1.8rem] bg-[#E6195E] text-white font-black text-2xl shadow-2xl shadow-[#E6195E]/30 hover:scale-[1.03] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 min-w-[220px]"
                  >
                    {processMutation.isPending ? (
                      <>
                        <Loader2 className="w-7 h-7 animate-spin" />
                        <span className="text-lg">Processando...</span>
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
                    className="mt-6 p-5 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-start gap-3 text-left max-w-4xl mx-auto"
                    data-testid="text-error-instagram"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold mb-1">Erro ao processar</p>
                      <p className="font-medium text-sm text-red-500">{processMutation.error.message}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-center gap-6 text-black/20">
                <span className="text-xs font-bold uppercase tracking-widest text-black/40">Formatos:</span>
                <div className="flex gap-4 items-center">
                  <span className="text-xs font-bold text-black/30">MP4 HD</span>
                  <span className="text-black/10">|</span>
                  <span className="text-xs font-bold text-black/30">JPG Original</span>
                  <span className="text-black/10">|</span>
                  <span className="text-xs font-bold text-black/30">Alta Qualidade</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <AnimatePresence>
          {processMutation.isSuccess && processMutation.data && (
            <section className="py-12 bg-white border-b border-border/40">
              <div className="max-w-4xl mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card rounded-[2.5rem] border border-border/60 shadow-2xl shadow-black/5 overflow-hidden flex flex-col md:flex-row"
                  data-testid="section-download-result"
                >
                  <div className="md:w-1/2 bg-black/5 relative aspect-square md:aspect-auto">
                    {processMutation.data.thumbnail ? (
                      <img
                        src={processMutation.data.thumbnail}
                        alt="Preview"
                        className="w-full h-full object-cover absolute inset-0"
                        data-testid="img-download-preview"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <PlayCircle className="w-16 h-16" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10" />
                  </div>

                  <div className="p-12 md:w-1/2 flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold mb-4">
                        <CheckCircle className="w-3 h-3" /> Sucesso
                      </div>
                      <h3 className="text-3xl font-black font-display text-foreground mb-4 leading-tight" data-testid="text-download-ready">
                        Download Pronto!
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        Seu arquivo foi processado com sucesso e está pronto para baixar.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <a
                        href={`/api/proxy-download?url=${encodeURIComponent(processMutation.data.url)}&filename=${encodeURIComponent(processMutation.data.filename || "instagram-download.mp4")}`}
                        data-testid="link-download-instagram-result"
                        className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-[#E6195E] text-white font-black text-xl shadow-xl shadow-[#E6195E]/20 hover:scale-[1.02] hover:brightness-110 transition-all"
                      >
                        <Download className="w-6 h-6" />
                        BAIXAR {processMutation.data.type === "video" ? "VÍDEO" : "IMAGEM"}
                      </a>

                      <button
                        onClick={() => {
                          processMutation.reset();
                          setUrl("");
                        }}
                        data-testid="button-download-another-instagram"
                        className="w-full py-4 text-sm font-bold text-black/40 hover:text-black transition-colors uppercase tracking-widest"
                      >
                        Baixar outro arquivo
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          )}
        </AnimatePresence>

        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-sm mb-4 block">Nossas Ferramentas</span>
              <h2 className="text-5xl md:text-6xl font-display font-black text-[#1A1A1A] leading-tight">
                Todas as Ferramentas <span className="text-[#E6195E]">Instagram</span>
              </h2>
              <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto font-medium">
                Escolha a ferramenta ideal para o tipo de conteúdo que deseja baixar.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tools.map((t) => (
                <Link
                  key={t.id}
                  href={t.slug}
                  data-testid={`home-tool-${t.id}`}
                  className="group p-6 rounded-[1.5rem] bg-[#F8F9FA] border border-black/5 hover:border-[#E6195E]/20 hover:shadow-lg hover:shadow-[#E6195E]/5 transition-all text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#E6195E]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#E6195E] group-hover:scale-110 transition-all duration-300">
                    <t.icon className="w-6 h-6 text-[#E6195E] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-sm font-black text-[#1A1A1A] mb-1">{t.shortTitle}</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">{t.subtitle}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#F8F9FA]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-sm mb-4 block">Processo Simples</span>
              <h2 className="text-5xl md:text-6xl font-display font-black text-[#1A1A1A] leading-tight">
                Como usar o <span className="text-[#E6195E]">Downloader</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Encontre o Conteúdo", desc: "Abra o Instagram e encontre o vídeo, reel, foto ou story que deseja salvar e copie o link." },
                { step: "02", title: "Cole o Link", desc: "Cole o link copiado no campo de busca acima e aguarde o processamento rápido." },
                { step: "03", title: "Baixe Agora", desc: "Clique no botão de download e salve o arquivo em alta qualidade no seu dispositivo." },
              ].map((item, i) => (
                <div key={i} className="text-center p-8 rounded-[2rem] bg-white border border-black/5">
                  <div className="text-5xl font-display font-black text-[#E6195E]/10 mb-4">{item.step}</div>
                  <h3 className="text-xl font-black mb-3 text-[#1A1A1A]">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-[#1A1A1A] text-white rounded-[4rem] mx-4 my-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-24">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-sm mb-4 block">Vantagens</span>
              <h2 className="text-5xl md:text-6xl font-display font-black mb-8 leading-tight">
                Por que escolher o <span className="text-[#E6195E]">Baixar Vídeo</span>?
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-12">
              {[
                { icon: <Zap className="w-8 h-8" />, title: "Alta Qualidade", desc: "Baixe vídeos em MP4 HD e fotos em resolução original." },
                { icon: <Clock className="w-8 h-8" />, title: "Download Rápido", desc: "Processamento instantâneo sem esperas ou anúncios abusivos." },
                { icon: <Infinity className="w-8 h-8" />, title: "Ilimitado", desc: "Faça quantos downloads desejar sem limites diários." },
                { icon: <Smartphone className="w-8 h-8" />, title: "Suporte Total", desc: "Funciona em todos os dispositivos iOS, Android e PC." },
              ].map((feature, i) => (
                <div key={i} className="text-center group">
                  <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/5 group-hover:bg-[#E6195E] group-hover:scale-110 transition-all duration-500">
                    <div className="text-[#E6195E] group-hover:text-white transition-colors">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-black mb-4">{feature.title}</h3>
                  <p className="text-white/40 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-white" id="faq">
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-20">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-sm mb-4 block">Suporte</span>
              <h2 className="text-5xl md:text-6xl font-display font-black text-[#1A1A1A] leading-tight">
                Perguntas <span className="text-[#E6195E]">Frequentes</span>
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "Como baixar vídeos do Instagram?",
                  a: "Copie o link do vídeo, cole no campo acima e clique em 'BAIXAR'. O vídeo será processado e o link de download em MP4 aparecerá instantaneamente.",
                },
                {
                  q: "Como baixar Fotos do Instagram em alta qualidade?",
                  a: "Basta colar o link da publicação da foto. Nosso sistema extrai a imagem em sua resolução original (HD), permitindo que você salve em JPG sem perda de nitidez.",
                },
                {
                  q: "É possível baixar Reels com áudio?",
                  a: "Sim! Nosso downloader baixa Reels completos com áudio e vídeo em alta definição, ideal para assistir offline ou compartilhar.",
                },
                {
                  q: "Como baixar Stories e Destaques (Highlights)?",
                  a: "Copie o link do Story ou do Destaque desejado. Lembre-se que Stories expiram em 24h, então baixe-os enquanto ainda estão visíveis no perfil público.",
                },
                {
                  q: "O serviço é gratuito e ilimitado?",
                  a: "Com certeza. Você pode realizar downloads ilimitados de vídeos, fotos e reels sem pagar nada e sem precisar criar uma conta.",
                },
                {
                  q: "Quais ferramentas estão disponíveis?",
                  a: "Oferecemos 12 ferramentas especializadas: Vídeo, Reels, Stories, Fotos, Foto de Perfil, Áudio/MP3, Destaques, Carrossel, Conteúdo Privado, HD/4K, Sem Marca d'Água e Live.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-[#F8F9FA] rounded-[2rem] border border-black/5 overflow-hidden">
                  <details className="group">
                    <summary className="flex justify-between items-center font-black cursor-pointer list-none p-8 text-xl text-[#1A1A1A] hover:text-[#E6195E] transition-colors">
                      <span>{item.q}</span>
                      <span className="transition group-open:rotate-180 p-2 bg-white rounded-full shadow-sm border border-black/5">
                        <ArrowRight className="w-5 h-5 rotate-90" />
                      </span>
                    </summary>
                    <div className="text-muted-foreground px-8 pb-8 pt-0 leading-relaxed font-medium text-lg">
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
