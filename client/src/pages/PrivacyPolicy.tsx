import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/lib/i18n";

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="pt-12 sm:pt-16 md:pt-20 pb-10 sm:pb-12 md:pb-16 bg-[#F8F9FA]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#1A1A1A] tracking-tighter">{t("privacy.title")}</h1>
          </div>
        </section>

        <section className="py-8 sm:py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="prose prose-slate max-w-none text-sm sm:text-base md:text-lg">
              <p className="text-muted-foreground leading-relaxed font-medium">{t("privacy.intro")}</p>
              
              <h2 className="text-lg sm:text-xl font-black mt-6 sm:mt-8 mb-3 sm:mb-4 text-[#1A1A1A]">{t("privacy.s1.title")}</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">{t("privacy.s1.text")}</p>
              
              <h2 className="text-lg sm:text-xl font-black mt-6 sm:mt-8 mb-3 sm:mb-4 text-[#1A1A1A]">{t("privacy.s2.title")}</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">{t("privacy.s2.text")}</p>
              
              <h2 className="text-lg sm:text-xl font-black mt-6 sm:mt-8 mb-3 sm:mb-4 text-[#1A1A1A]">{t("privacy.s3.title")}</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">{t("privacy.s3.text")}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
