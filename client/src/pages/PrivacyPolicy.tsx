import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="pt-12 sm:pt-16 md:pt-20 pb-10 sm:pb-12 md:pb-16 bg-[#F8F9FA]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#1A1A1A] tracking-tighter">Política de Privacidade</h1>
          </div>
        </section>

        <section className="py-8 sm:py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="prose prose-slate max-w-none text-sm sm:text-base md:text-lg">
              <p className="text-muted-foreground leading-relaxed font-medium">Sua privacidade é importante para nós. Esta política explica como lidamos com seus dados:</p>
              
              <h2 className="text-lg sm:text-xl font-black mt-6 sm:mt-8 mb-3 sm:mb-4 text-[#1A1A1A]">1. Coleta de Dados</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">Não coletamos informações pessoais identificáveis. Registramos apenas metadados anônimos para fins estatísticos e de melhoria do serviço.</p>
              
              <h2 className="text-lg sm:text-xl font-black mt-6 sm:mt-8 mb-3 sm:mb-4 text-[#1A1A1A]">2. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">Podemos usar cookies básicos para melhorar sua experiência de navegação.</p>
              
              <h2 className="text-lg sm:text-xl font-black mt-6 sm:mt-8 mb-3 sm:mb-4 text-[#1A1A1A]">3. Segurança</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">Implementamos medidas de segurança para proteger nosso site contra acessos não autorizados.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
