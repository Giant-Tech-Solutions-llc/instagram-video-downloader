import { useState } from "react";
import { useProcessDownload, useStats } from "@/hooks/use-download";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  Download, 
  AlertCircle, 
  Loader2, 
  PlayCircle, 
  Smartphone, 
  ShieldCheck, 
  Zap,
  Video,
  Camera,
  Clapperboard,
  History,
  Monitor,
  Heart,
  Clock,
  Infinity,
  CheckCircle,
  Youtube,
  Instagram
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type DownloaderType = 'video' | 'foto' | 'reels' | 'historia' | 'destaques';

export default function Home() {
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState<DownloaderType>('video');
  const { toast } = useToast();
  
  const processMutation = useProcessDownload();
  const { data: stats } = useStats();

  const tabs = [
    { id: 'video' as const, label: 'Vídeo', icon: Video },
    { id: 'foto' as const, label: 'Foto', icon: Camera },
    { id: 'reels' as const, label: 'Reels', icon: Clapperboard },
    { id: 'historia' as const, label: 'História', icon: History },
    { id: 'destaques' as const, label: 'Destaques', icon: Monitor },
  ];

  const getTitle = () => {
    switch (activeTab) {
      case 'foto': return 'Baixar Fotos do Instagram';
      case 'reels': return 'Baixar Reels do Instagram';
      case 'historia': return 'Baixar Stories do Instagram';
      case 'destaques': return 'Baixar Destaques do Instagram';
      default: return 'Baixar Vídeo do Instagram';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    processMutation.mutate({ url });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
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
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-4 overflow-hidden bg-[#F8F9FA]">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap justify-center gap-1 mb-12 max-w-2xl mx-auto p-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-black/5 shadow-sm">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                      activeTab === tab.id 
                        ? "bg-white text-[#E6195E] shadow-md ring-1 ring-black/5" 
                        : "text-black/40 hover:text-black hover:bg-black/5"
                    )}
                  >
                    <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-[#E6195E]" : "text-black/20")} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6195E]/5 text-[#E6195E] text-xs font-black uppercase tracking-wider mb-8 border border-[#E6195E]/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E6195E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E6195E]"></span>
                </span>
                Ferramenta 100% Gratuita
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-black text-[#1A1A1A] mb-8 tracking-tighter leading-[0.95]">
                {getTitle().split(' ')[0]} <br />
                <span className="text-[#E6195E]">{getTitle().split(' ').slice(1).join(' ')}</span>
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
                      placeholder="Insira o link do Instagram aqui..."
                      className="w-full h-20 pl-10 pr-32 rounded-[1.8rem] bg-[#F8F9FA] border-2 border-transparent focus:bg-white focus:border-[#E6195E]/20 focus:ring-[12px] focus:ring-[#E6195E]/5 transition-all outline-none text-xl font-medium placeholder:text-black/20"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <button
                      type="button"
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
                    disabled={processMutation.isPending || !url}
                    className="h-20 px-12 rounded-[1.8rem] bg-[#E6195E] text-white font-black text-2xl shadow-2xl shadow-[#E6195E]/30 hover:scale-[1.03] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 min-w-[220px]"
                  >
                    {processMutation.isPending ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                      "BAIXAR"
                    )}
                  </button>
                </form>
              </div>
              
              {/* Platforms hint */}
              <div className="mt-8 flex items-center justify-center gap-6 text-black/20">
                <span className="text-xs font-bold uppercase tracking-widest text-black/40">Plataformas Suportadas:</span>
                <div className="flex gap-4">
                  <Instagram className="w-5 h-5" />
                  <Youtube className="w-5 h-5" />
                  <Smartphone className="w-5 h-5" />
                  <Monitor className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Result Section */}
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
                      <h3 className="text-3xl font-black font-display text-foreground mb-4 leading-tight">
                        Download Pronto!
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        Seu arquivo foi processado com sucesso e está pronto para baixar.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <a
                        href={`/api/proxy-download?url=${encodeURIComponent(processMutation.data.url)}&filename=${encodeURIComponent(processMutation.data.filename || "instagram-download.mp4")}`}
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

        {/* How to use section - Mockup Style */}
        <section className="py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-20">
              <div className="md:w-1/2 relative">
                <div className="w-full aspect-[4/5] bg-[#E6195E] rounded-[3rem] relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop" 
                    alt="How to use" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#E6195E]/80 to-transparent" />
                </div>
                {/* Decorative blob */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#E6195E]/10 rounded-full blur-3xl -z-10" />
              </div>
              
              <div className="md:w-1/2">
                <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-sm mb-4 block">Processo Simples</span>
                <h2 className="text-5xl md:text-6xl font-display font-black text-[#1A1A1A] mb-12 leading-tight">
                  Como usar o <br />
                  <span className="text-[#E6195E]">InstaSaver</span>
                </h2>
                
                <div className="space-y-10">
                  {[
                    { step: "01", title: "Encontre o Vídeo", desc: "Abra o Instagram e encontre o vídeo, reel ou foto que deseja salvar e copie o link." },
                    { step: "02", title: "Cole o Link", desc: "Cole o link copiado no campo de busca acima e aguarde o processamento rápido." },
                    { step: "03", title: "Baixe Agora", desc: "Clique no botão de download e salve o arquivo em alta qualidade no seu dispositivo." }
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

        {/* Why Choose Section - Mockup Style */}
        <section className="py-32 bg-[#1A1A1A] text-white rounded-[4rem] mx-4 my-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-24">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-sm mb-4 block">Vantagens</span>
              <h2 className="text-5xl md:text-6xl font-display font-black mb-8 leading-tight">
                Por que escolher o <span className="text-[#E6195E]">InstaSaver</span>?
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-12">
              {[
                { icon: <Zap className="w-8 h-8" />, title: "Alta Qualidade", desc: "Baixe vídeos em MP4 HD e fotos em alta resolution original." },
                { icon: <Clock className="w-8 h-8" />, title: "Download Rápido", desc: "Processamento instantâneo sem esperas ou anúncios abusivos." },
                { icon: <Infinity className="w-8 h-8" />, title: "Ilimitado", desc: "Faça quantos downloads desejar sem limites diários." },
                { icon: <Smartphone className="w-8 h-8" />, title: "Suporte Total", desc: "Funciona em todos os dispositivos iOS, Android e PC." }
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

        {/* FAQ Section - Mockup Style */}
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
                  a: "Copie o link do vídeo, cole no campo acima e clique em 'BAIXAR'. O vídeo será processado e o link de download em MP4 aparecerá instantaneamente."
                },
                {
                  q: "Como baixar Fotos do Instagram em alta qualidade?",
                  a: "Basta colar o link da publicação da foto. Nosso sistema extrai a imagem em sua resolução original (HD), permitindo que você salve em JPG sem perda de nitidez."
                },
                {
                  q: "É possível baixar Reels com áudio?",
                  a: "Sim! O InstaSaver baixa Reels completos com áudio e vídeo em alta definição, ideal para assistir offline ou compartilhar."
                },
                {
                  q: "Como baixar Stories e Destaques (Highlights)?",
                  a: "Copie o link do Story ou do Destaque desejado. Lembre-se que Stories expiram em 24h, então baixe-os enquanto ainda estão visíveis no perfil público."
                },
                {
                  q: "O serviço é gratuito e ilimitado?",
                  a: "Com certeza. Você pode realizar downloads ilimitados de vídeos, fotos e reels sem pagar nada e sem precisar criar uma conta."
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

            {/* SEO Content Section */}
            <div className="mt-32 space-y-16 border-t border-black/5 pt-32">
              <div className="prose prose-slate max-w-none">
                <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-sm mb-4 block text-center">Guia Completo</span>
                <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] text-center mb-16">Download Especializado</h2>
                
                <div className="grid md:grid-cols-2 gap-16">
                  <div>
                    <h3 className="text-2xl font-black text-[#1A1A1A] mb-4">Baixar Vídeos do Instagram</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                      Nossa tecnologia de extração de vídeo garante que você receba o arquivo MP4 original sem compressão adicional. 
                      Ideal para criadores de conteúdo e usuários que buscam alta fidelidade visual. O processo de download é 
                      criptografado e direto dos servidores oficiais.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-[#1A1A1A] mb-4">Baixar Fotos em HD</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                      Suportamos download de fotos individuais e posts em carrossel. Basta inserir o link e nosso sistema 
                      identificará todas as imagens disponíveis na publicação, permitindo que você salve cada uma em sua 
                      resolução máxima disponível no Instagram.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-[#1A1A1A] mb-4">Downloader de Reels e Stories</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                      Os Reels e Stories são conteúdos dinâmicos que muitas vezes queremos guardar para referência futura. 
                      O InstaSaver captura o fluxo de vídeo e áudio de forma síncrona, entregando um arquivo pronto para 
                      reprodução em qualquer player de mídia moderno.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-[#1A1A1A] mb-4">Destaques (Highlights)</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                      Para baixar Destaques, basta copiar o link da coleção de destaques ou de um item específico dentro dela. 
                      Nossa ferramenta processará a playlist e fornecerá os links de download para os itens desejados.
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
