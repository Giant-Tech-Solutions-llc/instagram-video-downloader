import { Link } from "wouter";
import { tools } from "@/lib/tools-config";
import { useLanguage } from "@/lib/i18n";
import { getToolTranslation } from "@/lib/tools-i18n";

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="mt-12 sm:mt-16 md:mt-20 py-10 sm:py-12 md:py-16 border-t bg-[#1A1A1A] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-black text-base sm:text-lg mb-3 sm:mb-4 font-display">Baixar Vídeo Downloader</h3>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
              {t("footer.desc")}
            </p>
          </div>
          <div className="sm:col-span-2 lg:col-span-2">
            <h4 className="font-black text-xs sm:text-sm uppercase tracking-widest mb-4 sm:mb-6 text-[#E6195E]">{t("footer.tools")}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-1.5 sm:gap-y-2">
              {tools.map((tool) => {
                const toolTr = getToolTranslation(tool.id, lang);
                return (
                  <Link
                    key={tool.id}
                    href={tool.slug}
                    data-testid={`footer-link-${tool.id}`}
                    className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/50 hover:text-[#E6195E] transition-colors py-1"
                  >
                    <tool.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                    <span className="truncate">{toolTr?.shortTitle || tool.shortTitle}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div>
            <h4 className="font-black text-xs sm:text-sm uppercase tracking-widest mb-4 sm:mb-6 text-[#E6195E]">{t("footer.links")}</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link href="/como-funciona" data-testid="footer-link-como-funciona" className="text-white/50 hover:text-[#E6195E] transition-colors">{t("footer.how")}</Link></li>
              <li><Link href="/blog" data-testid="footer-link-blog" className="text-white/50 hover:text-[#E6195E] transition-colors">Blog</Link></li>
              <li><Link href="/termos" data-testid="footer-link-termos" className="text-white/50 hover:text-[#E6195E] transition-colors">{t("footer.terms")}</Link></li>
              <li><Link href="/privacidade" data-testid="footer-link-privacidade" className="text-white/50 hover:text-[#E6195E] transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link href="/contato" data-testid="footer-link-contato" className="text-white/50 hover:text-[#E6195E] transition-colors">{t("footer.contact")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-white/10 text-center text-[10px] sm:text-xs text-white/30">
          &copy; {new Date().getFullYear()} Baixar V&iacute;deo Downloader. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
