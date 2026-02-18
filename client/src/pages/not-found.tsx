import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA] p-4">
      <div className="text-center max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-black/5 border border-black/5">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#E6195E]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-[#E6195E]" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] mb-3 sm:mb-4" data-testid="text-404-title">
          {t("notfound.title")}
        </h1>
        
        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 font-medium" data-testid="text-404-desc">
          {t("notfound.desc")}
        </p>

        <Link href="/" className="inline-flex w-full items-center justify-center px-6 py-3 sm:py-4 text-sm sm:text-base font-black rounded-xl sm:rounded-2xl text-white bg-[#E6195E] hover:brightness-110 transition-all shadow-lg shadow-[#E6195E]/20" data-testid="link-go-home">
          {t("notfound.back")}
        </Link>
      </div>
    </div>
  );
}
