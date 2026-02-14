import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato o mais breve possível.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container max-w-xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8 text-center">Contato</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg border shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input placeholder="Seu nome" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">E-mail</label>
            <Input type="email" placeholder="seu@email.com" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mensagem</label>
            <Textarea placeholder="Como podemos ajudar?" className="min-h-[120px]" required />
          </div>
          <Button type="submit" className="w-full">Enviar Mensagem</Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
