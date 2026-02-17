import { useState } from "react";
import { useProcessDownload } from "@/hooks/use-download";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  Camera,
  CheckCircle,
  Clapperboard,
  Clock,
  Copy,
  Download,
  AlertCircle,
  History,
  Infinity,
  Loader2,
  Music,
  PlayCircle,
  Smartphone,
  Tv,
  Video,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { tools } from "@/lib/tools-config";
import { useLanguage } from "@/lib/i18n";

export default function Home() {
  const [url, setUrl] = useState("");
  const { toast } = useToast();
  const processMutation = useProcessDownload();
  const { t } = useLanguage();

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
                {t("badge.free")}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-black text-[#1A1A1A] mb-4 sm:mb-6 md:mb-8 tracking-tighter leading-[0.95]" data-testid="text-page-title">
                {t("home.title1")} <br />
                <span className="text-[#E6195E]">{t("home.title2")}</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 font-medium leading-relaxed px-2">
                {t("home.subtitle")} <br className="hidden md:block" />
                {t("home.subtitle2")}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 md:mb-16 px-2">
                {[
                  { label: t("quick.video"), slug: "/", icon: Video },
                  { label: t("quick.fotos"), slug: "/baixar-fotos-instagram", icon: Camera },
                  { label: t("quick.stories"), slug: "/baixar-stories-instagram", icon: History },
                  { label: t("quick.reels"), slug: "/baixar-reels-instagram", icon: Clapperboard },
                  { label: t("quick.igtv"), slug: "/baixar-igtv-instagram", icon: Tv },
                  { label: t("quick.mp3"), slug: "/extrair-audio-instagram", icon: Music },
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
                      placeholder={t("home.placeholder")}
                      className="w-full h-14 sm:h-16 md:h-20 pl-4 sm:pl-6 md:pl-10 pr-20 sm:pr-28 md:pr-32 rounded-xl sm:rounded-2xl md:rounded-[1.8rem] bg-[#F8F9FA] border-2 border-transparent focus:bg-white focus:border-[#E6195E]/20 focus:ring-4 md:focus:ring-[12px] focus:ring-[#E6195E]/5 transition-all outline-none text-sm sm:text-base md:text-xl font-medium placeholder:text-black/20"
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
                            title: t("toast.pasted"),
                            description: t("toast.pasted.desc"),
                          });
                        } catch {
                          toast({
                            variant: "destructive",
                            title: t("toast.paste.error"),
                            description: t("toast.paste.error.desc"),
                          });
                        }
                      }}
                      className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl md:rounded-2xl bg-white border border-black/5 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-black/60 hover:text-[#E6195E] hover:border-[#E6195E]/20 transition-all shadow-sm active:scale-95"
                      title={t("btn.paste.title")}
                    >
                      <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{t("btn.paste")}</span>
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
                        <span className="text-sm sm:text-base md:text-lg">{t("btn.processing")}</span>
                      </>
                    ) : (
                      t("btn.download")
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
                      <p className="font-bold mb-1 text-sm sm:text-base">{t("error.title")}</p>
                      <p className="font-medium text-xs sm:text-sm text-red-500">{processMutation.error.message}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-black/20">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-black/40">{t("formats.label")}</span>
                <div className="flex gap-2 sm:gap-4 items-center">
                  <span className="text-[10px] sm:text-xs font-bold text-black/30">{t("formats.mp4")}</span>
                  <span className="text-black/10">|</span>
                  <span className="text-[10px] sm:text-xs font-bold text-black/30">{t("formats.jpg")}</span>
                  <span className="text-black/10">|</span>
                  <span className="text-[10px] sm:text-xs font-bold text-black/30">{t("formats.quality")}</span>
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
                        src={processMutation.data.thumbnail}
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
                        <CheckCircle className="w-3 h-3" /> {t("result.success")}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black font-display text-foreground mb-3 sm:mb-4 leading-tight" data-testid="text-download-ready">
                        {t("result.ready")}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                        {t("result.desc")}
                      </p>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <a
                        href={`/api/proxy-download?url=${encodeURIComponent(processMutation.data.url)}&filename=${encodeURIComponent(processMutation.data.filename || "instagram-download.mp4")}`}
                        data-testid="link-download-instagram-result"
                        className="flex items-center justify-center gap-2 sm:gap-3 w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-[#E6195E] text-white font-black text-base sm:text-lg md:text-xl shadow-xl shadow-[#E6195E]/20 hover:scale-[1.02] hover:brightness-110 transition-all"
                      >
                        <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                        {processMutation.data.type === "video" ? t("result.download_video") : t("result.download_image")}
                      </a>

                      <button
                        onClick={() => {
                          processMutation.reset();
                          setUrl("");
                        }}
                        data-testid="button-download-another-instagram"
                        className="w-full py-3 sm:py-4 text-xs sm:text-sm font-bold text-black/40 hover:text-black transition-colors uppercase tracking-widest"
                      >
                        {t("result.another")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          )}
        </AnimatePresence>

        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">{t("section.tools")}</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-[#1A1A1A] leading-tight">
                {t("section.tools.title1")} <span className="text-[#E6195E]">{t("section.tools.title2")}</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-4 sm:mt-6 max-w-2xl mx-auto font-medium px-2">
                {t("section.tools.desc")}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {tools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.slug}
                  data-testid={`home-tool-${tool.id}`}
                  className="group p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] bg-[#F8F9FA] border border-black/5 hover:border-[#E6195E]/20 hover:shadow-lg hover:shadow-[#E6195E]/5 transition-all text-center"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-[#E6195E]/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-[#E6195E] group-hover:scale-110 transition-all duration-300">
                    <tool.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#E6195E] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-[#1A1A1A] mb-1">{tool.shortTitle}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2 hidden sm:block">{tool.subtitle}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 bg-[#F8F9FA]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">{t("section.steps")}</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-[#1A1A1A] leading-tight">
                {t("section.steps.title1")} <span className="text-[#E6195E]">{t("section.steps.title2")}</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[
                { step: "01", title: t("step1.title"), desc: t("step1.desc") },
                { step: "02", title: t("step2.title"), desc: t("step2.desc") },
                { step: "03", title: t("step3.title"), desc: t("step3.desc") },
              ].map((item, i) => (
                <div key={i} className="text-center p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-white border border-black/5">
                  <div className="text-4xl sm:text-5xl font-display font-black text-[#E6195E]/10 mb-3 sm:mb-4">{item.step}</div>
                  <h3 className="text-lg sm:text-xl font-black mb-2 sm:mb-3 text-[#1A1A1A]">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 md:py-32 bg-[#1A1A1A] text-white rounded-2xl sm:rounded-3xl md:rounded-[4rem] mx-2 sm:mx-4 my-4 sm:my-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 md:mb-24">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">{t("section.why")}</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 sm:mb-8 leading-tight">
                {t("section.why.title1")} <span className="text-[#E6195E]">{t("section.why.title2")}</span>?
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
              {[
                { icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />, title: t("feature.quality"), desc: t("feature.quality.desc") },
                { icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8" />, title: t("feature.fast"), desc: t("feature.fast.desc") },
                { icon: <Infinity className="w-6 h-6 sm:w-8 sm:h-8" />, title: t("feature.unlimited"), desc: t("feature.unlimited.desc") },
                { icon: <Smartphone className="w-6 h-6 sm:w-8 sm:h-8" />, title: t("feature.support"), desc: t("feature.support.desc") },
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
          </div>
        </section>

        <section className="py-16 sm:py-24 md:py-32 bg-white" id="faq">
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-10 sm:mb-16 md:mb-20">
              <span className="text-[#E6195E] font-black uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4 block">{t("section.faq")}</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-[#1A1A1A] leading-tight">
                {t("section.faq.title1")} <span className="text-[#E6195E]">{t("section.faq.title2")}</span>
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {[
                { q: t("faq1.q"), a: t("faq1.a") },
                { q: t("faq2.q"), a: t("faq2.a") },
                { q: t("faq3.q"), a: t("faq3.a") },
                { q: t("faq4.q"), a: t("faq4.a") },
                { q: t("faq5.q"), a: t("faq5.a") },
                { q: t("faq6.q"), a: t("faq6.a") },
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
