import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="pt-12 sm:pt-16 md:pt-20 pb-10 sm:pb-12 md:pb-16 bg-[#F8F9FA]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#1A1A1A] tracking-tighter">Termos de Uso</h1>
          </div>
        </section>

        <section className="py-8 sm:py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="prose prose-slate max-w-none text-sm sm:text-base md:text-lg">
              <p className="text-muted-foreground leading-relaxed font-medium">Bem-vindo ao Baixar Vídeo Instagram. Ao acessar nosso site, você concorda com os seguintes termos:</p>
              
              <h2 className="text-lg sm:text-xl font-black mt-6 sm:mt-8 mb-3 sm:mb-4 text-[#1A1A1A]">1. Uso do Serviço</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">Nosso serviço deve ser utilizado apenas para fins pessoais e não comerciais. Você é responsável por garantir que tem o direito de baixar o conteúdo.</p>
              
              <h2 className="text-lg sm:text-xl font-black mt-6 sm:mt-8 mb-3 sm:mb-4 text-[#1A1A1A]">2. Propriedade Intelectual</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">O conteúdo baixado pertence aos seus respectivos proprietários. Respeite os direitos autorais.</p>
              
              <h2 className="text-lg sm:text-xl font-black mt-6 sm:mt-8 mb-3 sm:mb-4 text-[#1A1A1A]">3. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">Não nos responsabilizamos pelo uso indevido do conteúdo baixado através de nossa ferramenta.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
