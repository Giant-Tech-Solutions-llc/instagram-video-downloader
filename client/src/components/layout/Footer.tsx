import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="mt-20 py-10 border-t bg-muted/30">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left flex-wrap">
          <div>
            <h3 className="font-bold mb-4">Baixar Vídeo Downloader</h3>
            <p className="text-sm text-muted-foreground">
              A ferramenta mais rápida e segura para baixar conteúdo do Instagram e TikTok.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Ferramentas</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:underline">Baixar Vídeo Instagram</Link></li>
              <li><Link href="/tiktok" className="hover:underline">Baixar Vídeo TikTok</Link></li>
              <li><Link href="/como-funciona" className="hover:underline">Como Funciona</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/termos" className="hover:underline">Termos de Uso</Link></li>
              <li><Link href="/privacidade" className="hover:underline">Política de Privacidade</Link></li>
              <li><Link href="/contato" className="hover:underline">Contato</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Baixar Vídeo Downloader. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
