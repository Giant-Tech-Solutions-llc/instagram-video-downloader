import { useState } from "react";
import { useProcessPinterestDownload } from "@/hooks/use-download";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Copy, 
  Download, 
  AlertCircle, 
  Loader2, 
  PlayCircle, 
  Smartphone, 
  Monitor,
  Clock,
  Infinity,
  Zap,
  CheckCircle,
  Image,
  Film,
  FileImage,
  ExternalLink
} from "lucide-react";
import { SiPinterest, SiInstagram, SiTiktok, SiFacebook, SiX } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

function isInstagramUrl(url: string): boolean {
  return url.includes('instagram.com');
}

function isTikTokUrl(url: string): boolean {
  return url.includes('tiktok.com') || url.includes('vm.tiktok.com');
}

function isFacebookUrl(url: string): boolean {
  return url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.com') || url.includes('m.facebook.com');
}

function isTwitterUrl(url: string): boolean {
  return url.includes('twitter.com') || url.includes('x.com') || url.includes('t.co');
}

export default function Pinterest() {
  const [url, setUrl] = useState("");
  const [showOtherPlatformHint, setShowOtherPlatformHint] = useState<'instagram' | 'tiktok' | 'facebook' | 'twitter' | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const processMutation = useProcessPinterestDownload();

  if (typeof document !== 'undefined') {
    document.title = "Baixar Vídeo e Imagem do Pinterest - HD Grátis | Baixar Vídeo";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', "Baixe vídeos, imagens e GIFs do Pinterest em HD grátis. Ferramenta online rápida e segura para salvar pins do Pinterest no celular ou PC.");
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', "Baixar Vídeo e Imagem do Pinterest - HD Grátis");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', "Baixe vídeos, imagens e GIFs do Pinterest em alta qualidade. 100% gratuito, sem login.");
  }

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (isInstagramUrl(value)) {
      setShowOtherPlatformHint('instagram');
    } else if (isTikTokUrl(value)) {
      setShowOtherPlatformHint('tiktok');
    } else if (isFacebookUrl(value)) {
      setShowOtherPlatformHint('facebook');
    } else if (isTwitterUrl(value)) {
      setShowOtherPlatformHint('twitter');
    } else {
      setShowOtherPlatformHint(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    if (isInstagramUrl(url)) {
      setShowOtherPlatformHint('instagram');
      return;
    }
    if (isTikTokUrl(url)) {
      setShowOtherPlatformHint('tiktok');
      return;
    }
    if (isFacebookUrl(url)) {
      setShowOtherPlatformHint('facebook');
      return;
    }
    if (isTwitterUrl(url)) {
      setShowOtherPlatformHint('twitter');
      return;
    }
    processMutation.mutate({ url });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleUrlChange(text);
      toast({
        title: "Link colado!",
        description: "Agora clique em Baixar para processar.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro ao colar",
        description: "Não foi possível acessar a área de transferência.",
      });
    }
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
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-black/5 text-black/60 text-sm font-black uppercase tracking-wider mb-8 border border-black/5">
                <SiPinterest className="w-4 h-4" />
                Vídeos, Imagens e GIFs
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-black text-[#1A1A1A] mb-8 tracking-tighter leading-[0.95]" data-testid="text-pinterest-title">
                Baixar do <br />
                <span className="text-[#E6195E]">Pinterest</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
                Baixe vídeos, imagens e GIFs do Pinterest em qualidade original. <br className="hidden md:block" /> 
                Rápido, gratuito e sem necessidade de login.
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
                      data-testid="input-pinterest-url"
                      placeholder="Insira o link do Pinterest aqui..."
                      className="w-full h-20 pl-10 pr-32 rounded-[1.8rem] bg-[#F8F9FA] border-2 border-transparent focus:bg-white focus:border-[#E6195E]/20 focus:ring-[12px] focus:ring-[#E6195E]/5 transition-all outline-none text-xl font-medium placeholder:text-black/20"
                      value={url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                    />
                    <button
                      type="button"
                      data-testid="button-paste-pinterest"
                      onClick={handlePaste}
                      className="absolute right-4 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-2xl bg-white border border-black/5 flex items-center gap-2 text-sm font-bold text-black/60 hover:text-[#E6195E] hover:border-[#E6195E]/20 transition-all shadow-sm active:scale-95"
                      title="Colar link"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Colar</span>
                    </button>
                  </div>
                  <button
                    type="submit"
                    data-testid="button-download-pinterest"
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
                {showOtherPlatformHint === 'instagram' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-5 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-between gap-3 max-w-4xl mx-auto"
                    data-testid="hint-instagram-redirect"
                  >
                    <div className="flex items-center gap-3">
                      <SiInstagram className="w-5 h-5 flex-shrink-0" />
                      <p className="font-medium">Este link é do Instagram! Use nosso downloader de Instagram.</p>
                    </div>
                    <button
                      onClick={() => navigate("/")}
                      data-testid="button-go-instagram"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E6195E] text-white font-bold text-sm hover:brightness-110 transition-all flex-shrink-0"
                    >
                      Ir para Instagram <ExternalLink className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
                {showOtherPlatformHint === 'tiktok' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-5 rounded-2xl bg-gray-50 text-gray-700 border border-gray-200 flex items-center justify-between gap-3 max-w-4xl mx-auto"
                    data-testid="hint-tiktok-redirect"
                  >
                    <div className="flex items-center gap-3">
                      <SiTiktok className="w-5 h-5 flex-shrink-0" />
                      <p className="font-medium">Este link é do TikTok! Use nosso downloader de TikTok.</p>
                    </div>
                    <button
                      onClick={() => navigate("/tiktok")}
                      data-testid="button-go-tiktok"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E6195E] text-white font-bold text-sm hover:brightness-110 transition-all flex-shrink-0"
                    >
                      Ir para TikTok <ExternalLink className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
                {showOtherPlatformHint === 'facebook' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-between gap-3 max-w-4xl mx-auto"
                    data-testid="hint-facebook-redirect"
                  >
                    <div className="flex items-center gap-3">
                      <SiFacebook className="w-5 h-5 flex-shrink-0" />
                      <p className="font-medium">Este link é do Facebook! Use nosso downloader de Facebook.</p>
                    </div>
                    <button
                      onClick={() => navigate("/facebook")}
                      data-testid="button-go-facebook"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E6195E] text-white font-bold text-sm hover:brightness-110 transition-all flex-shrink-0"
                    >
                      Ir para Facebook <ExternalLink className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
                {showOtherPlatformHint === 'twitter' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-5 rounded-2xl bg-gray-50 text-gray-700 border border-gray-200 flex items-center justify-between gap-3 max-w-4xl mx-auto"
                    data-testid="hint-twitter-redirect"
                  >
                    <div className="flex items-center gap-3">
                      <SiX className="w-5 h-5 flex-shrink-0" />
                      <p className="font-medium">Este link é do Twitter/X! Use nosso downloader de Twitter.</p>
                    </div>
                    <button
                      onClick={() => navigate("/twitter")}
                      data-testid="button-go-twitter"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E6195E] text-white font-bold text-sm hover:brightness-110 transition-all flex-shrink-0"
                    >
                      Ir para Twitter <ExternalLink className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {processMutation.isError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-5 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center gap-3 text-left max-w-4xl mx-auto"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium" data-testid="text-error-pinterest">{processMutation.error.message}</p>
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
                  <span className="text-xs font-bold text-black/30">GIF</span>
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
                >
                  <div className="md:w-1/2 bg-black/5 relative aspect-square md:aspect-auto">
                    {processMutation.data.thumbnail ? (
                      <img 
                        src={processMutation.data.thumbnail} 
                        alt="Preview" 
                        className="w-full h-full object-cover absolute inset-0"
                        data-testid="img-pinterest-preview"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        {processMutation.data.type === 'video' ? (
                          <PlayCircle className="w-16 h-16" />
                        ) : (
                          <Image className="w-16 h-16" />
                        )}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                  
                  <div className="p-12 md:w-1/2 flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold mb-4">
                        <CheckCircle className="w-3 h-3" /> Sucesso
                      </div>
                      <h3 className="text-3xl font-black font-display text-foreground mb-4 leading-tight" data-testid="text-download-ready-pinterest">
                        Download Pronto!
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        Seu {processMutation.data.type === 'video' ? 'vídeo' : 'imagem'} do Pinterest está pronto para baixar.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <a
                        href={`/api/pinterest/download?url=${encodeURIComponent(processMutation.data.url)}&filename=${encodeURIComponent(processMutation.data.filename || 'pinterest-download')}`}
                        data-testid="link-download-pinterest-result"
                        className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-[#E6195E] text-white font-black text-xl shadow-xl shadow-[#E6195E]/20 hover:scale-[1.02] hover:brightness-110 transition-all"
                      >
                        <Download className="w-6 h-6" />
                        BAIXAR {processMutation.data.type === 'video' ? 'VÍDEO' : 'IMAGEM'}
                      </a>
                      
                      <button
                        onClick={() => {
                          processMutation.reset();
                          setUrl("");
                        }}
                        data-testid="button-download-another-pinterest"
                        className="w-full py-4 text-sm font-bold text-black/40 hover:text-black transition-colors uppercase tracking-widest"
                      >
                        Baixar outro conteúdo
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          )}
        </AnimatePresence>

        <section className="py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-20">
              <div className="md:w-1/2 relative">
                <div className="w-full aspect-[4/5] bg-[#E6195E] rounded-[3rem] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
                  <div className="relative z-10 text-center">
                    <SiPinterest className="w-24 h-24 text-white mx-auto mb-6" />
                    <p className="text-white/80 text-xl font-bold">Pinterest Downloader</p>
                    <p className="text-white/50 text-sm mt-2">Vídeos, Imagens e GIFs</p>
                  </div>
                </div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#E6195E]/10 rounded-full blur-3xl -z-10" />
              </div>
              
              <div className="md:w-1/2">
                <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-sm mb-4 block">Processo Simples</span>
                <h2 className="text-5xl md:text-6xl font-display font-black text-[#1A1A1A] mb-12 leading-tight">
                  Como baixar <br />
                  <span className="text-[#E6195E]">do Pinterest</span>
                </h2>
                
                <div className="space-y-10">
                  {[
                    { step: "01", title: "Encontre o Pin", desc: "Abra o Pinterest, encontre o pin com o vídeo, imagem ou GIF desejado e copie o link." },
                    { step: "02", title: "Cole o Link", desc: "Cole o link copiado no campo acima e clique no botão 'BAIXAR' para processar." },
                    { step: "03", title: "Baixe em HD", desc: "O conteúdo será processado em qualidade original. Clique para salvar no seu dispositivo." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="text-4xl font-display font-black text-black/5 group-hover:text-[#E6195E]/10 transition-colors">{item.step}</div>
                      <div>
                        <h3 className="text-xl font-black mb-2 text-[#1A1A1A]">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 bg-[#1A1A1A] text-white rounded-[4rem] mx-4 my-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-24">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-sm mb-4 block">Vantagens</span>
              <h2 className="text-5xl md:text-6xl font-display font-black mb-8 leading-tight">
                Por que usar nosso <span className="text-[#E6195E]">Pinterest Downloader</span>?
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-12">
              {[
                { icon: <Film className="w-8 h-8" />, title: "Vídeos em HD", desc: "Baixe vídeos do Pinterest em MP4 com a melhor qualidade disponível." },
                { icon: <Image className="w-8 h-8" />, title: "Imagens Originais", desc: "Salve imagens na resolução original, sem compressão ou perda de qualidade." },
                { icon: <FileImage className="w-8 h-8" />, title: "GIFs Animados", desc: "Baixe GIFs animados do Pinterest mantendo todas as animações." },
                { icon: <Infinity className="w-8 h-8" />, title: "100% Gratuito", desc: "Downloads ilimitados sem criar conta e sem pagar nada." }
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
                  q: "Como baixar vídeos do Pinterest?",
                  a: "Copie o link do pin com o vídeo no Pinterest, cole no campo acima e clique em 'BAIXAR'. Nosso sistema processa o vídeo e entrega um arquivo MP4 em alta definição pronto para salvar."
                },
                {
                  q: "Posso baixar imagens em alta resolução?",
                  a: "Sim! Nosso downloader extrai a imagem na resolução original do Pinterest, sem nenhuma compressão adicional. Você recebe a melhor qualidade disponível."
                },
                {
                  q: "Funciona com GIFs do Pinterest?",
                  a: "Sim! GIFs animados do Pinterest são baixados mantendo todas as animações e a qualidade original do arquivo."
                },
                {
                  q: "Preciso instalar algum aplicativo?",
                  a: "Não! Nossa ferramenta é 100% online. Funciona diretamente no navegador do seu celular, tablet ou computador, sem necessidade de instalar nenhum app."
                },
                {
                  q: "É gratuito?",
                  a: "Sim, completamente gratuito e ilimitado. Você pode baixar quantos pins quiser sem pagar nada e sem criar conta."
                },
                {
                  q: "Funciona com pins privados?",
                  a: "Não, nossa ferramenta só funciona com pins públicos do Pinterest. Pins de boards privados não podem ser acessados por motivos de privacidade."
                }
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

            <div className="mt-32 space-y-16 border-t border-black/5 pt-32">
              <div className="prose prose-slate max-w-none">
                <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-sm mb-4 block text-center">Guia Completo</span>
                <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] text-center mb-16">Pinterest Downloader</h2>
                
                <div className="grid md:grid-cols-2 gap-16">
                  <div>
                    <h3 className="text-2xl font-black text-[#1A1A1A] mb-4">Baixar Vídeos do Pinterest</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                      O Pinterest é uma plataforma rica em vídeos inspiradores, tutoriais e conteúdo criativo. 
                      Nosso downloader permite que você salve esses vídeos em MP4 HD para assistir offline 
                      ou usar como referência em seus projetos.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-[#1A1A1A] mb-4">Imagens em Qualidade Original</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                      As imagens do Pinterest são conhecidas pela alta qualidade e inspiração visual. 
                      Nosso sistema extrai a versão original da imagem, sem compressão, ideal para 
                      moodboards, referências de design e coleções pessoais.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-[#1A1A1A] mb-4">GIFs Animados</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                      Muitos pins do Pinterest contêm GIFs animados com tutoriais, receitas e conteúdo 
                      divertido. Baixe esses GIFs mantendo a animação completa e a qualidade original 
                      do arquivo.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-[#1A1A1A] mb-4">Compatibilidade Universal</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                      Funciona em qualquer navegador moderno: Chrome, Safari, Firefox, Edge. Compatível 
                      com iPhone, Android, tablets, notebooks e desktops sem instalar nada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
