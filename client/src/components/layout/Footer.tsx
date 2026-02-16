import { Link } from "wouter";
import { tools } from "@/lib/tools-config";

export default function Footer() {
  return (
    <footer className="mt-20 py-16 border-t bg-[#1A1A1A] text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 flex-wrap">
          <div className="md:col-span-1">
            <h3 className="font-black text-lg mb-4 font-display">Baixar Vídeo Downloader</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              A ferramenta mais rápida e segura para baixar conteúdo do Instagram. 100% gratuita e sem cadastro.
            </p>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-black text-sm uppercase tracking-widest mb-6 text-[#E6195E]">Ferramentas</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {tools.map((t) => (
                <Link
                  key={t.id}
                  href={t.slug}
                  data-testid={`footer-link-${t.id}`}
                  className="flex items-center gap-2 text-sm text-white/50 hover:text-[#E6195E] transition-colors py-1"
                >
                  <t.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{t.shortTitle}</span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-6 text-[#E6195E]">Links Úteis</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/como-funciona" data-testid="footer-link-como-funciona" className="text-white/50 hover:text-[#E6195E] transition-colors">Como Funciona</Link></li>
              <li><Link href="/termos" data-testid="footer-link-termos" className="text-white/50 hover:text-[#E6195E] transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacidade" data-testid="footer-link-privacidade" className="text-white/50 hover:text-[#E6195E] transition-colors">Política de Privacidade</Link></li>
              <li><Link href="/contato" data-testid="footer-link-contato" className="text-white/50 hover:text-[#E6195E] transition-colors">Contato</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-white/30">
          &copy; {new Date().getFullYear()} Baixar Vídeo Downloader. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
