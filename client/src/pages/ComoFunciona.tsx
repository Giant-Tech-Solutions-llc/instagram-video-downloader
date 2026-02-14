import Footer from "@/components/layout/Footer";
import { CheckCircle2, Download, Link, Play } from "lucide-react";

export default function ComoFunciona() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="pt-20 pb-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-6">Como Funciona o InstaSaver</h1>
            <p className="text-xl text-muted-foreground">O guia completo para baixar vídeos, fotos e reels do Instagram em segundos.</p>
          </div>
        </section>

        <section className="py-20">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Link className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Copie o Link</h3>
                <p className="text-muted-foreground">Abra o Instagram e copie a URL do conteúdo que deseja baixar.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Play className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Cole no Site</h3>
                <p className="text-muted-foreground">Cole o link no campo de busca do InstaSaver e clique em "Baixar".</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Download className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Salve o Arquivo</h3>
                <p className="text-muted-foreground">Escolha a qualidade e salve o arquivo diretamente no seu dispositivo.</p>
              </div>
            </div>

            <hr className="my-20" />

            <div className="space-y-16">
              <article>
                <h2 className="text-3xl font-display font-bold mb-6">Baixar Vídeos do Instagram</h2>
                <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                  O nosso downloader de vídeos do Instagram foi projetado para oferecer a melhor qualidade possível (Full HD, 4K) em formato MP4. Seja um vídeo curto ou uma produção mais longa, o processo é otimizado para ser ultra-rápido.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="text-green-500 w-5 h-5" /> Sem perda de qualidade</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="text-green-500 w-5 h-5" /> Compatível com todos os navegadores</li>
                </ul>
              </article>

              <article>
                <h2 className="text-3xl font-display font-bold mb-6">Baixar Fotos do Instagram</h2>
                <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                  Extraia fotos de posts individuais ou carrosséis em alta resolução. O InstaSaver permite que você salve imagens em formato JPG de forma instantânea, mantendo os detalhes originais da publicação.
                </p>
              </article>

              <article>
                <h2 className="text-3xl font-display font-bold mb-6">Downloader de Reels</h2>
                <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                  Os Reels são a maior tendência do Instagram. Com o InstaSaver, você pode baixar Reels com áudio em alta definição para assistir offline ou compartilhar em outras redes sociais.
                </p>
              </article>

              <article>
                <h2 className="text-3xl font-display font-bold mb-6">Download de Stories e Destaques</h2>
                <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                  Quer salvar aquele Story importante antes que ele desapareça em 24 horas? Nossa ferramenta de download de Stories e Destaques (Highlights) permite capturar esses momentos de forma anônima e segura.
                </p>
              </article>
            </div>

            <div className="mt-20 pt-20 border-t">
              <h2 className="text-3xl font-display font-bold mb-12 text-center">Perguntas Frequentes por Categoria</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2"><Play className="w-5 h-5 text-primary" /> Vídeo & Reels</h3>
                  <div className="space-y-4 text-sm">
                    <p><strong>Qual o formato dos vídeos?</strong> Todos os vídeos são salvos em MP4, garantindo compatibilidade universal.</p>
                    <p><strong>Posso escolher a qualidade?</strong> Nosso sistema sempre busca a maior resolução disponível (até 4K).</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Fotos</h3>
                  <div className="space-y-4 text-sm">
                    <p><strong>Como baixar carrosséis?</strong> Ao colar o link de um carrossel, você poderá salvar cada foto individualmente.</p>
                    <p><strong>As fotos perdem qualidade?</strong> Não, extraímos o link direto do CDN do Instagram em HD.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2"><Download className="w-5 h-5 text-primary" /> Stories & Destaques</h3>
                  <div className="space-y-4 text-sm">
                    <p><strong>O dono do perfil saberá que baixei?</strong> Não, o download através do InstaSaver é totalmente anônimo.</p>
                    <p><strong>Consigo baixar destaques antigos?</strong> Sim, desde que o perfil seja público e o destaque ainda esteja ativo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
