import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";

export default function Contact() {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t("contact.toast.title"),
      description: t("contact.toast.desc"),
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="pt-12 sm:pt-16 md:pt-20 pb-10 sm:pb-12 md:pb-16 bg-[#F8F9FA]">
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-4 text-[#1A1A1A] tracking-tighter">
              {t("contact.title")}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-medium">
              {t("contact.desc")}
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-12 md:py-16">
          <div className="max-w-xl mx-auto px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white p-5 sm:p-6 md:p-8 rounded-2xl border border-black/5 shadow-sm" data-testid="form-contact">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-bold text-[#1A1A1A]">{t("contact.name")}</label>
                <Input placeholder={t("contact.name.placeholder")} required data-testid="input-contact-name" className="h-11 sm:h-12 text-sm sm:text-base" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-bold text-[#1A1A1A]">{t("contact.email")}</label>
                <Input type="email" placeholder={t("contact.email.placeholder")} required data-testid="input-contact-email" className="h-11 sm:h-12 text-sm sm:text-base" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-bold text-[#1A1A1A]">{t("contact.message")}</label>
                <Textarea placeholder={t("contact.message.placeholder")} className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base" required data-testid="input-contact-message" />
              </div>
              <Button type="submit" className="w-full h-11 sm:h-12 text-sm sm:text-base font-bold bg-[#E6195E] hover:bg-[#E6195E]/90" data-testid="button-send-contact">
                {t("contact.send")}
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
