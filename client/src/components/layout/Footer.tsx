import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="mt-20 py-10 border-t bg-muted/30">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-bold mb-4">Baixar Vídeo Instagram</h3>
            <p className="text-sm text-muted-foreground">
              A ferramenta mais rápida e segura para baixar conteúdo do Instagram.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/termos" className="hover:underline">Termos de Uso</Link></li>
              <li><Link href="/privacidade" className="hover:underline">Política de Privacidade</Link></li>
              <li><Link href="/contato" className="hover:underline">Contato</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <p className="text-xs text-muted-foreground">
              Não somos afiliados ao Instagram ou Meta. Respeite os direitos autorais dos criadores.
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Baixar Vídeo Instagram. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
