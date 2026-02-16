import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, Download, Link, Play } from "lucide-react";

export default function ComoFunciona() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="pt-12 sm:pt-16 md:pt-20 pb-10 sm:pb-12 md:pb-16 bg-[#F8F9FA]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-4 sm:mb-6 text-[#1A1A1A] tracking-tighter">
              Como Funciona o <span className="text-[#E6195E]">Downloader</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium">O guia completo para baixar vídeos, fotos e reels do Instagram em segundos.</p>
          </div>
        </section>

        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-[#E6195E]/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Link className="text-[#E6195E] w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-black mb-2 text-[#1A1A1A]">1. Copie o Link</h3>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">Abra o Instagram e copie a URL do conteúdo que deseja baixar.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-[#E6195E]/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Play className="text-[#E6195E] w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-black mb-2 text-[#1A1A1A]">2. Cole no Site</h3>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">Cole o link no campo de busca e clique em "Baixar".</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-[#E6195E]/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Download className="text-[#E6195E] w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-black mb-2 text-[#1A1A1A]">3. Salve o Arquivo</h3>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">Escolha a qualidade e salve o arquivo diretamente no seu dispositivo.</p>
              </div>
            </div>

            <hr className="my-12 sm:my-16 md:my-20 border-black/5" />

            <div className="space-y-10 sm:space-y-12 md:space-y-16">
              <article>
                <h2 className="text-2xl sm:text-3xl font-display font-black mb-4 sm:mb-6 text-[#1A1A1A]">Baixar Vídeos do Instagram</h2>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground font-medium mb-4">
                  O nosso downloader de vídeos do Instagram foi projetado para oferecer a melhor qualidade possível (Full HD, 4K) em formato MP4. Seja um vídeo curto ou uma produção mais longa, o processo é otimizado para ser ultra-rápido.
                </p>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex items-center gap-2"><CheckCircle2 className="text-green-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> Sem perda de qualidade</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="text-green-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> Compatível com todos os navegadores</li>
                </ul>
              </article>

              <article>
                <h2 className="text-2xl sm:text-3xl font-display font-black mb-4 sm:mb-6 text-[#1A1A1A]">Baixar Fotos do Instagram</h2>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground font-medium mb-4">
                  Extraia fotos de posts individuais ou carrosséis em alta resolução. Permite que você salve imagens em formato JPG de forma instantânea, mantendo os detalhes originais da publicação.
                </p>
              </article>

              <article>
                <h2 className="text-2xl sm:text-3xl font-display font-black mb-4 sm:mb-6 text-[#1A1A1A]">Downloader de Reels</h2>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground font-medium mb-4">
                  Os Reels são a maior tendência do Instagram. Com nossa ferramenta, você pode baixar Reels com áudio em alta definição para assistir offline ou compartilhar em outras redes sociais.
                </p>
              </article>

              <article>
                <h2 className="text-2xl sm:text-3xl font-display font-black mb-4 sm:mb-6 text-[#1A1A1A]">Download de Stories e Destaques</h2>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground font-medium mb-4">
                  Quer salvar aquele Story importante antes que ele desapareça em 24 horas? Nossa ferramenta de download de Stories e Destaques (Highlights) permite capturar esses momentos de forma anônima e segura.
                </p>
              </article>
            </div>

            <div className="mt-12 sm:mt-16 md:mt-20 pt-12 sm:pt-16 md:pt-20 border-t border-black/5">
              <h2 className="text-2xl sm:text-3xl font-display font-black mb-8 sm:mb-12 text-center text-[#1A1A1A]">Perguntas Frequentes por Categoria</h2>
              
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-black flex items-center gap-2 text-[#1A1A1A]"><Play className="w-4 h-4 sm:w-5 sm:h-5 text-[#E6195E]" /> Vídeo & Reels</h3>
                  <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-muted-foreground">
                    <p><strong className="text-[#1A1A1A]">Qual o formato dos vídeos?</strong> Todos os vídeos são salvos em MP4, garantindo compatibilidade universal.</p>
                    <p><strong className="text-[#1A1A1A]">Posso escolher a qualidade?</strong> Nosso sistema sempre busca a maior resolução disponível (até 4K).</p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-black flex items-center gap-2 text-[#1A1A1A]"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#E6195E]" /> Fotos</h3>
                  <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-muted-foreground">
                    <p><strong className="text-[#1A1A1A]">Como baixar carrosséis?</strong> Ao colar o link de um carrossel, você poderá salvar cada foto individualmente.</p>
                    <p><strong className="text-[#1A1A1A]">As fotos perdem qualidade?</strong> Não, extraímos o link direto do CDN do Instagram em HD.</p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-black flex items-center gap-2 text-[#1A1A1A]"><Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#E6195E]" /> Stories & Destaques</h3>
                  <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-muted-foreground">
                    <p><strong className="text-[#1A1A1A]">O dono do perfil saberá que baixei?</strong> Não, o download é totalmente anônimo.</p>
                    <p><strong className="text-[#1A1A1A]">Consigo baixar destaques antigos?</strong> Sim, desde que o perfil seja público e o destaque ainda esteja ativo.</p>
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
