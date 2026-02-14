import Footer from "@/components/layout/Footer";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>Bem-vindo ao Baixar Vídeo Instagram. Ao acessar nosso site, você concorda com os seguintes termos:</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4">1. Uso do Serviço</h2>
          <p>Nosso serviço deve ser utilizado apenas para fins pessoais e não comerciais. Você é responsável por garantir que tem o direito de baixar o conteúdo.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4">2. Propriedade Intelectual</h2>
          <p>O conteúdo baixado pertence aos seus respectivos proprietários. Respeite os direitos autorais.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4">3. Limitação de Responsabilidade</h2>
          <p>Não nos responsabilizamos pelo uso indevido do conteúdo baixado através de nossa ferramenta.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
