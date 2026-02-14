import { Link } from "wouter";
import { Instagram, Download } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform duration-200">
              <Instagram className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Insta<span className="text-primary">Saver</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link 
              href="#faq" 
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Como Funciona
            </Link>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/90 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Instalar App</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
