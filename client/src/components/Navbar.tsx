import { Link } from "wouter";

import Baixar_V_deo_downloader_Logo from "@assets/Baixar Vídeo downloader Logo.png";

export function Navbar() {
  return (
    <nav className="border-b border-border/40 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          <Link href="/" className="flex items-center flex-shrink-0">
            <img src={Baixar_V_deo_downloader_Logo} alt="Baixar Video Downloader" className="h-9" data-testid="img-logo" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
