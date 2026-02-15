import { Link, useLocation } from "wouter";
import logoPath from "@assets/Baixar_Vídeo_downloader_Logo_1771170363989.png";
import { SiTiktok, SiYoutube, SiInstagram } from "react-icons/si";
import { cn } from "@/lib/utils";

import Baixar_V_deo_downloader_Logo from "@assets/Baixar Vídeo downloader Logo.png";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="border-b border-border/40 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          <Link href="/" className="flex items-center flex-shrink-0">
            <img src={Baixar_V_deo_downloader_Logo} alt="Baixar Vídeo Downloader" className="h-9" data-testid="img-logo" />
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/"
              data-testid="link-nav-instagram"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-colors",
                location === "/"
                  ? "text-[#E6195E] bg-[#E6195E]/5"
                  : "text-black/50 hover:text-black"
              )}
            >
              <SiInstagram className="w-4 h-4" />
              <span className="hidden sm:inline">Instagram</span>
            </Link>
            <Link
              href="/tiktok"
              data-testid="link-nav-tiktok"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-colors",
                location === "/tiktok"
                  ? "text-[#E6195E] bg-[#E6195E]/5"
                  : "text-black/50 hover:text-black"
              )}
            >
              <SiTiktok className="w-4 h-4" />
              <span className="hidden sm:inline">TikTok</span>
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold text-black/20 cursor-default" data-testid="text-nav-youtube-soon">
              <SiYoutube className="w-4 h-4" />
              <span className="hidden sm:inline">Em breve</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
