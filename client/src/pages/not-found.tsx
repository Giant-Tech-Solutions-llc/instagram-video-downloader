import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-xl shadow-black/5 border border-border">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">
          Página não encontrada
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Ops! A página que você está procurando não existe ou foi movida.
        </p>

        <Link href="/" className="inline-flex w-full items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-primary-foreground bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
}
