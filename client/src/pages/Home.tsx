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
  Monitor
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
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-4 overflow-hidden bg-gradient-brand">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-2xl mx-auto p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                      activeTab === tab.id 
                        ? "bg-white text-primary shadow-lg" 
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Ferramenta Online Gratuita
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-secondary mb-6 tracking-tight">
                {getTitle().split(' ')[0]} <span className="text-gradient">{getTitle().split(' ').slice(1).join(' ')}</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Rápido, fácil e 100% grátis. Salve vídeos, reels e fotos do Instagram em alta qualidade.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white p-2 rounded-2xl shadow-xl shadow-primary/5 border border-border/60">
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="url"
                      placeholder="Inserir link"
                      className="w-full h-14 pl-6 pr-24 rounded-xl bg-muted/30 border-2 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-lg placeholder:text-muted-foreground/60"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handlePaste}
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-muted border border-border flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                      title="Colar link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Colar</span>
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={processMutation.isPending || !url}
                    className="h-14 px-8 rounded-xl bg-[#E6195E] text-white font-bold text-lg shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 min-w-[160px]"
                  >
                    {processMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>...</span>
                      </>
                    ) : (
                      <>
                        <span>BAIXAR</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {processMutation.isError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center gap-3 text-left"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium">{processMutation.error.message}</p>
                  </motion.div>
                )}
              </AnimatePresence>
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
                  className="bg-card rounded-2xl border border-border/60 shadow-2xl shadow-black/5 overflow-hidden flex flex-col md:flex-row"
                >
                  <div className="md:w-1/2 bg-black/5 relative aspect-square md:aspect-auto">
                     {/* Use thumbnail if available, or placeholder */}
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
                  
                  <div className="p-8 md:w-1/2 flex flex-col justify-center">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold font-display text-foreground mb-2">
                        Download Pronto!
                      </h3>
                      <p className="text-muted-foreground">
                        Seu arquivo foi processado com sucesso e está pronto para baixar.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <a
                        href={processMutation.data.url}
                        download={processMutation.data.filename || "instagram-download"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
                      >
                        <Download className="w-5 h-5" />
                        Fazer Download {processMutation.data.type === 'video' ? 'do Vídeo' : 'da Imagem'}
                      </a>
                      
                      <button
                        onClick={() => {
                          processMutation.reset();
                          setUrl("");
                        }}
                        className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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

        {/* Stats Section */}
        {stats && (
          <section className="py-12 border-b border-border/40 bg-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Confiado por milhares
              </p>
              <div className="text-4xl font-display font-bold text-secondary">
                {stats.totalDownloads.toLocaleString('pt-BR')} Downloads Realizados
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-24 bg-white" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Por que usar o InstaSaver?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Desenvolvemos a melhor tecnologia para você baixar conteúdo do Instagram com segurança.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-8 h-8 text-yellow-500" />,
                  title: "Ultra Rápido",
                  desc: "Nossos servidores processam seu vídeo em segundos para um download instantâneo."
                },
                {
                  icon: <ShieldCheck className="w-8 h-8 text-primary" />,
                  title: "Seguro e Anônimo",
                  desc: "Não armazenamos seus dados. O download é feito de forma segura e privada."
                },
                {
                  icon: <Smartphone className="w-8 h-8 text-blue-500" />,
                  title: "Compatível com Tudo",
                  desc: "Funciona perfeitamente no celular, tablet ou computador. iOS e Android."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-background border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-border/50 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-muted/30 border-t border-border/40" id="faq">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-center mb-12">Perguntas Frequentes</h2>
            
            <div className="space-y-4">
              {[
                {
                  q: "Como baixar vídeos do Instagram?",
                  a: "Copie o link do vídeo ou reel no aplicativo do Instagram, cole no campo acima e clique em 'Baixar'. O vídeo será processado e o botão de download aparecerá."
                },
                {
                  q: "É gratuito usar o InstaSaver?",
                  a: "Sim! Nossa ferramenta é 100% gratuita e ilimitada. Você pode baixar quantos vídeos quiser."
                },
                {
                  q: "Posso baixar vídeos de contas privadas?",
                  a: "Não. Por questões de privacidade e segurança, nossa ferramenta só permite baixar conteúdo de perfis públicos."
                },
                {
                  q: "Onde os vídeos são salvos?",
                  a: "Os vídeos são salvos na pasta 'Downloads' do seu dispositivo, ou na galeria caso esteja usando um celular."
                }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-border/50 overflow-hidden">
                  <details className="group">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg text-foreground hover:text-primary transition-colors">
                      <span>{item.q}</span>
                      <span className="transition group-open:rotate-180">
                        <ArrowRight className="w-5 h-5 rotate-90" />
                      </span>
                    </summary>
                    <div className="text-muted-foreground px-6 pb-6 pt-0 leading-relaxed">
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
