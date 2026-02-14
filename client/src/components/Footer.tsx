import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border/50 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display font-bold text-lg mb-4">InstaSaver</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              A melhor ferramenta online para baixar vídeos, reels e fotos do Instagram. 
              Simples, rápido e 100% gratuito para todos os usuários.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Ferramentas</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Baixar Vídeos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Baixar Reels</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Baixar Stories</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} InstaSaver. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Feito com <Heart className="w-4 h-4 text-red-500 fill-current" /> para o Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}
