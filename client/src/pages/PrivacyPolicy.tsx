import Footer from "@/components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>Sua privacidade é importante para nós. Esta política explica como lidamos com seus dados:</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4">1. Coleta de Dados</h2>
          <p>Não coletamos informações pessoais identificáveis. Registramos apenas metadados anônimos para fins estatísticos e de melhoria do serviço.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4">2. Cookies</h2>
          <p>Podemos usar cookies básicos para melhorar sua experiência de navegação.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4">3. Segurança</h2>
          <p>Implementamos medidas de segurança para proteger nosso site contra acessos não autorizados.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
