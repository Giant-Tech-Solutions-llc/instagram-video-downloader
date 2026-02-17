import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import { tools } from "@/lib/tools-config";
import { cn } from "@/lib/utils";
import { useLanguage, type Lang } from "@/lib/i18n";
import { getToolTranslation } from "@/lib/tools-i18n";

import Baixar_V_deo_downloader_Logo from "@assets/Baixar Vídeo downloader Logo.png";

const languages: { code: Lang; label: string; abbr: string }[] = [
  { code: "pt", label: "Português", abbr: "PT" },
  { code: "en", label: "English", abbr: "EN" },
  { code: "es", label: "Español", abbr: "ES" },
  { code: "fr", label: "Français", abbr: "FR" },
  { code: "hi", label: "हिन्दी", abbr: "HI" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [location] = useLocation();
  const { lang, setLang, t } = useLanguage();

  const activeLang = languages.find((l) => l.code === lang) || languages[0];

  return (
    <nav className="border-b border-border/40 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-4">
          <Link href="/" className="flex items-center flex-shrink-0">
            <img src={Baixar_V_deo_downloader_Logo} alt="Baixar Video Downloader" className="h-7 sm:h-9" data-testid="img-logo" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                data-testid="button-tools-dropdown"
                className={cn(
                  "flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition-colors",
                  toolsOpen ? "text-[#E6195E] bg-[#E6195E]/5" : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                )}
              >
                {t("nav.tools")}
                <ChevronDown className={cn("w-4 h-4 transition-transform", toolsOpen && "rotate-180")} />
              </button>

              <div
                className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200",
                  toolsOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                )}
              >
                <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-black/5 p-3 w-[420px] grid grid-cols-2 gap-1">
                  {tools.map((tool) => {
                    const toolTr = getToolTranslation(tool.id, lang);
                    return (
                      <Link
                        key={tool.id}
                        href={tool.slug}
                        data-testid={`nav-link-${tool.id}`}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                          location === tool.slug
                            ? "text-[#E6195E] bg-[#E6195E]/5"
                            : "text-[#1A1A1A]/70 hover:text-[#E6195E] hover:bg-[#F8F9FA]"
                        )}
                      >
                        <tool.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{toolTr?.shortTitle || tool.shortTitle}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <Link
              href="/como-funciona"
              data-testid="nav-link-como-funciona"
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-colors",
                location === "/como-funciona" ? "text-[#E6195E]" : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
              )}
            >
              {t("nav.how")}
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setLangOpen(true)}
              onMouseLeave={() => setLangOpen(false)}
            >
              <button
                data-testid="button-lang-dropdown"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors",
                  langOpen ? "text-[#E6195E] bg-[#E6195E]/5" : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                )}
              >
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-black tracking-wider bg-[#E6195E]/10 text-[#E6195E] rounded px-1.5 py-0.5 leading-none">{activeLang.abbr}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", langOpen && "rotate-180")} />
              </button>

              <div
                className={cn(
                  "absolute top-full right-0 pt-2 transition-all duration-200",
                  langOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                )}
              >
                <div className="bg-white rounded-xl shadow-2xl shadow-black/10 border border-black/5 p-1.5 min-w-[160px]">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      data-testid={`lang-option-${l.code}`}
                      onClick={() => {
                        setLang(l.code);
                        setLangOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                        lang === l.code
                          ? "text-[#E6195E] bg-[#E6195E]/5"
                          : "text-[#1A1A1A]/70 hover:text-[#E6195E] hover:bg-[#F8F9FA]"
                      )}
                    >
                      <span className="text-[10px] font-black tracking-wider bg-[#E6195E]/10 text-[#E6195E] rounded px-1.5 py-0.5 leading-none">{l.abbr}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            data-testid="button-mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-[#1A1A1A]/60 active:scale-95 transition-transform"
          >
            {mobileOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

        <div
          className={cn(
            "md:hidden overflow-y-auto transition-all duration-300",
            mobileOpen ? "max-h-[70vh] pb-4 sm:pb-6" : "max-h-0"
          )}
        >
          <div className="pt-3 sm:pt-4 border-t border-black/5">
            <p className="px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-black/30">{t("nav.tools")}</p>
            <div className="grid grid-cols-2 gap-1">
              {tools.map((tool) => {
                const toolTr = getToolTranslation(tool.id, lang);
                return (
                  <Link
                    key={tool.id}
                    href={tool.slug}
                    data-testid={`mobile-nav-link-${tool.id}`}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-colors",
                      location === tool.slug
                        ? "text-[#E6195E] bg-[#E6195E]/5"
                        : "text-[#1A1A1A]/70 hover:text-[#E6195E] hover:bg-[#F8F9FA]"
                    )}
                  >
                    <tool.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{toolTr?.shortTitle || tool.shortTitle}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-black/5">
              <Link
                href="/como-funciona"
                data-testid="mobile-nav-como-funciona"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold text-[#1A1A1A]/70 hover:text-[#E6195E]"
              >
                {t("nav.how")}
              </Link>
            </div>

            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-black/5">
              <p className="px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-black/30">{t("nav.lang")}</p>
              <div className="flex flex-wrap gap-1.5 px-2">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    data-testid={`mobile-lang-${l.code}`}
                    onClick={() => setLang(l.code)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors",
                      lang === l.code
                        ? "text-[#E6195E] bg-[#E6195E]/5 border border-[#E6195E]/20"
                        : "text-[#1A1A1A]/70 hover:text-[#E6195E] border border-black/5"
                    )}
                  >
                    <span className="text-[10px] font-black tracking-wider bg-[#E6195E]/10 text-[#E6195E] rounded px-1.5 py-0.5 leading-none">{l.abbr}</span>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
