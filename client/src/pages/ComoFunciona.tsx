import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, Download, Link, Play } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function ComoFunciona() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="pt-12 sm:pt-16 md:pt-20 pb-10 sm:pb-12 md:pb-16 bg-[#F8F9FA]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-4 sm:mb-6 text-[#1A1A1A] tracking-tighter">
              {t("howit.title1")} <span className="text-[#E6195E]">{t("howit.title2")}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium">{t("howit.desc")}</p>
          </div>
        </section>

        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-[#E6195E]/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Link className="text-[#E6195E] w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-black mb-2 text-[#1A1A1A]">{t("howit.step1")}</h3>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">{t("howit.step1.desc")}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-[#E6195E]/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Play className="text-[#E6195E] w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-black mb-2 text-[#1A1A1A]">{t("howit.step2")}</h3>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">{t("howit.step2.desc")}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-[#E6195E]/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Download className="text-[#E6195E] w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-black mb-2 text-[#1A1A1A]">{t("howit.step3")}</h3>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">{t("howit.step3.desc")}</p>
              </div>
            </div>

            <hr className="my-12 sm:my-16 md:my-20 border-black/5" />

            <div className="space-y-10 sm:space-y-12 md:space-y-16">
              <article>
                <h2 className="text-2xl sm:text-3xl font-display font-black mb-4 sm:mb-6 text-[#1A1A1A]">{t("howit.videos.title")}</h2>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground font-medium mb-4">
                  {t("howit.videos.desc")}
                </p>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex items-center gap-2"><CheckCircle2 className="text-green-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> {t("howit.videos.check1")}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="text-green-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> {t("howit.videos.check2")}</li>
                </ul>
              </article>

              <article>
                <h2 className="text-2xl sm:text-3xl font-display font-black mb-4 sm:mb-6 text-[#1A1A1A]">{t("howit.photos.title")}</h2>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground font-medium mb-4">
                  {t("howit.photos.desc")}
                </p>
              </article>

              <article>
                <h2 className="text-2xl sm:text-3xl font-display font-black mb-4 sm:mb-6 text-[#1A1A1A]">{t("howit.reels.title")}</h2>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground font-medium mb-4">
                  {t("howit.reels.desc")}
                </p>
              </article>

              <article>
                <h2 className="text-2xl sm:text-3xl font-display font-black mb-4 sm:mb-6 text-[#1A1A1A]">{t("howit.stories.title")}</h2>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground font-medium mb-4">
                  {t("howit.stories.desc")}
                </p>
              </article>
            </div>

            <div className="mt-12 sm:mt-16 md:mt-20 pt-12 sm:pt-16 md:pt-20 border-t border-black/5">
              <h2 className="text-2xl sm:text-3xl font-display font-black mb-8 sm:mb-12 text-center text-[#1A1A1A]">{t("howit.faq.title")}</h2>
              
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-black flex items-center gap-2 text-[#1A1A1A]"><Play className="w-4 h-4 sm:w-5 sm:h-5 text-[#E6195E]" /> {t("howit.faq.video")}</h3>
                  <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-muted-foreground">
                    <p><strong className="text-[#1A1A1A]">{t("howit.faq.video.q1")}</strong> {t("howit.faq.video.a1")}</p>
                    <p><strong className="text-[#1A1A1A]">{t("howit.faq.video.q2")}</strong> {t("howit.faq.video.a2")}</p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-black flex items-center gap-2 text-[#1A1A1A]"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#E6195E]" /> {t("howit.faq.photos")}</h3>
                  <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-muted-foreground">
                    <p><strong className="text-[#1A1A1A]">{t("howit.faq.photos.q1")}</strong> {t("howit.faq.photos.a1")}</p>
                    <p><strong className="text-[#1A1A1A]">{t("howit.faq.photos.q2")}</strong> {t("howit.faq.photos.a2")}</p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-black flex items-center gap-2 text-[#1A1A1A]"><Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#E6195E]" /> {t("howit.faq.stories")}</h3>
                  <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-muted-foreground">
                    <p><strong className="text-[#1A1A1A]">{t("howit.faq.stories.q1")}</strong> {t("howit.faq.stories.a1")}</p>
                    <p><strong className="text-[#1A1A1A]">{t("howit.faq.stories.q2")}</strong> {t("howit.faq.stories.a2")}</p>
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
