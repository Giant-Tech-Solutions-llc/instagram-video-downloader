import {
  Video,
  Camera,
  Clapperboard,
  History,
  UserCircle,
  Music,
  type LucideIcon,
} from "lucide-react";

export interface ToolConfig {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  heroTitle: string;
  heroHighlight: string;
  subtitle: string;
  icon: LucideIcon;
  placeholder: string;
  seoTitle: string;
  seoDescription: string;
  features: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  seoContent: { title: string; text: string }[];
}

export const tools: ToolConfig[] = [
  {
    id: "video",
    slug: "/",
    title: "Baixar Vídeo do Instagram",
    shortTitle: "Vídeo",
    heroTitle: "Baixar Vídeo",
    heroHighlight: "do Instagram",
    subtitle: "Cole o link e faça baixar vídeo do Instagram gratis instantaneamente em alta qualidade.",
    icon: Video,
    placeholder: "Cole o link do vídeo do Instagram aqui...",
    seoTitle: "Baixar Vídeo do Instagram Online Grátis | Baixar Vídeo Downloader",
    seoDescription: "Baixe vídeos do Instagram em MP4 HD grátis. Ferramenta rápida e segura para salvar vídeos do Instagram no seu dispositivo.",
    features: [
      { title: "MP4 em Alta Qualidade", desc: "Baixe vídeos na resolução original sem perda de qualidade." },
      { title: "Download Instantâneo", desc: "Processamento rápido sem filas de espera." },
      { title: "100% Gratuito", desc: "Sem limites de downloads e sem necessidade de cadastro." },
      { title: "Compatível com Todos", desc: "Funciona em celular, tablet e computador." },
    ],
    faqs: [
      { q: "Como baixar vídeos do Instagram?", a: "Copie o link do vídeo do Instagram, cole no campo acima e clique em 'BAIXAR'. O vídeo será processado e o link de download aparecerá instantaneamente." },
      { q: "Os vídeos são baixados em HD?", a: "Sim! Nosso sistema baixa os vídeos na resolução original disponível no Instagram, geralmente em HD ou Full HD." },
      { q: "Preciso instalar algum aplicativo?", a: "Não! Nossa ferramenta funciona diretamente no navegador, sem necessidade de instalar nenhum app ou extensão." },
      { q: "Posso baixar vídeos de perfis privados?", a: "Não, nossa ferramenta só consegue acessar conteúdos de perfis públicos do Instagram." },
    ],
    seoContent: [
      { title: "Como Funciona o Download de Vídeos", text: "Nossa tecnologia de extração de vídeo garante que você receba o arquivo MP4 original sem compressão adicional. Ideal para criadores de conteúdo e usuários que buscam alta fidelidade visual." },
      { title: "Segurança e Privacidade", text: "Não armazenamos seus dados pessoais nem os vídeos baixados. Todo o processamento é feito de forma segura e os links são temporários." },
    ],
  },
  {
    id: "reels",
    slug: "/baixar-reels-instagram",
    title: "Baixar Reels do Instagram Online Grátis",
    shortTitle: "Reels",
    heroTitle: "Baixar Reels do Instagram",
    heroHighlight: "em HD Sem Marca d'Água",
    subtitle: "Baixe vídeos do Instagram Reels diretamente de qualquer URL pública. Cole o link do Reel abaixo e salve os Reels no seu dispositivo em formato MP4 — alta qualidade, processamento rápido e sem marca d'água.",
    icon: Clapperboard,
    placeholder: "Cole o link do Reel do Instagram aqui...",
    seoTitle: "Baixar Reels do Instagram Online Grátis em HD | Baixar Vídeo Downloader",
    seoDescription: "Baixador de Reels do Instagram Grátis – Cole o Link e Baixe Instantaneamente. Baixe Reels em HD, sem marca d'água, sem login.",
    features: [
      { title: "Velocidade de Download", desc: "Servidores otimizados garantem processamento imediato." },
      { title: "Baixar Reels em HD & 4K", desc: "Mantenha a qualidade e resolução originais." },
      { title: "Seguro e Privado", desc: "Não armazenamos URLs nem dados de usuários." },
      { title: "Baixar Reels com Áudio", desc: "Extraia áudio dos Reels ou converta para MP3 facilmente." },
      { title: "Interface Simples", desc: "Sem anúncios agressivos ou botões enganosos." },
      { title: "100% Grátis e Online", desc: "Downloads ilimitados, sem assinatura." },
    ],
    faqs: [
      { q: "1. Como posso baixar Reels do Instagram online grátis?", a: "Copie o link do Reel, cole no nosso site e clique em baixar." },
      { q: "2. Posso baixar Reels sem marca d'água?", a: "Sim. Nosso site permite baixar Reels sem marca d'água." },
      { q: "3. Posso salvar Reels na galeria?", a: "Sim. O vídeo pode ser salvo diretamente na galeria do celular." },
      { q: "4. Posso baixar Reels em HD ou 4K?", a: "Sim, oferecemos suporte para alta qualidade." },
      { q: "5. Posso baixar Reels com áudio?", a: "Sim. Você pode baixar com áudio original ou converter para MP3." },
      { q: "6. Preciso instalar aplicativo?", a: "Não. É um baixador de Reels online." },
      { q: "7. Posso baixar Reels privados?", a: "Apenas se você tiver acesso autorizado." },
      { q: "8. Funciona no PC e no celular?", a: "Sim. Funciona em Android, iPhone, tablet e desktop." },
    ],
    seoContent: [
      { title: "Download de Reels em Alta Qualidade", text: "Os Reels são o formato de conteúdo mais popular do Instagram. Com nossa ferramenta, você pode salvar qualquer Reel público em MP4 HD com áudio perfeito para assistir offline." },
      { title: "Compatibilidade Universal", text: "Os arquivos MP4 baixados funcionam em qualquer dispositivo e player de mídia, incluindo iPhone, Android, Windows e Mac." },
    ],
  },
  {
    id: "stories",
    slug: "/baixar-stories-instagram",
    title: "Baixar Story do Instagram Online Grátis",
    shortTitle: "Stories",
    heroTitle: "Baixador de Story em HD",
    heroHighlight: "Sem Marca d'Água",
    subtitle: "Baixe Stories do Instagram diretamente de qualquer URL pública de Story. Cole o link do Story do Instagram abaixo e salve os stories no seu dispositivo em formato MP4 ou imagem — alta resolução, processamento rápido e sem marca d'água.",
    icon: History,
    placeholder: "Cole o link do Story do Instagram aqui...",
    seoTitle: "Baixar Story do Instagram Online Grátis em HD | Baixar Vídeo Downloader",
    seoDescription: "Baixador de Story do Instagram Grátis – Cole o Link do Story e Salve Instantaneamente. Baixe Stories em HD, sem marca d'água, sem login.",
    features: [
      { title: "Processamento Rápido", desc: "Servidores otimizados garantem downloads instantâneos." },
      { title: "Baixar Stories em HD", desc: "Mantenha a resolução e qualidade originais." },
      { title: "Seguro e Privado", desc: "Não armazenamos URLs de Story, dados pessoais ou credenciais." },
      { title: "Baixar Story com Música", desc: "Preserve a música e o áudio original ao baixar Stories do Instagram." },
      { title: "Baixar Stories Privados", desc: "Compatível com contas privadas (com acesso autorizado)." },
      { title: "100% Compatível com Celular", desc: "Baixe stories no Android, iPhone ou desktop — sem aplicativo." },
      { title: "Story Saver Online Grátis", desc: "Downloads ilimitados, sem assinatura ou taxas ocultas." },
    ],
    faqs: [
      { q: "1. Como posso baixar story do Instagram online grátis?", a: "Copie o link da conta do Story, cole na nossa ferramenta de story saver e clique em baixar." },
      { q: "2. Posso baixar stories do Instagram sem marca d'água?", a: "Sim. Nosso Instagram Story downloader remove sobreposições adicionais de marca d'água." },
      { q: "3. Posso salvar story do Instagram na galeria?", a: "Sim. Os Stories podem ser salvos diretamente na galeria do celular ou na pasta de downloads." },
      { q: "4. Posso baixar stories privados do Instagram?", a: "Sim, mas apenas se você tiver acesso autorizado à conta privada." },
      { q: "5. Posso baixar story do Instagram com música?", a: "Sim. O áudio original e a música de fundo são preservados." },
      { q: "6. Preciso instalar aplicativo?", a: "Não. Este é um story saver online baseado em navegador." },
      { q: "7. Funciona para status do Instagram?", a: "Sim. Status do Instagram é outro termo para Stories e você pode baixá-los aqui." },
      { q: "8. Este Instagram Story downloader é gratuito?", a: "Sim. Downloads ilimitados e gratuitos, sem necessidade de cadastro." },
    ],
    seoContent: [
      { title: "Salve Stories Importantes", text: "Stories do Instagram desaparecem após 24 horas. Com nossa ferramenta, você pode salvar aqueles momentos importantes antes que sejam perdidos para sempre." },
      { title: "Download Anônimo e Seguro", text: "Todo o processamento é feito pelos nossos servidores, garantindo que o download seja anônimo e que seus dados permaneçam seguros." },
    ],
  },
  {
    id: "foto",
    slug: "/baixar-fotos-instagram",
    title: "Baixar Foto do Instagram Online Grátis",
    shortTitle: "Fotos",
    heroTitle: "Baixador de Foto do Instagram",
    heroHighlight: "em HD",
    subtitle: "Baixe fotos do Instagram diretamente de qualquer URL pública de publicação. Cole o link da foto do Instagram abaixo e salve as imagens no seu dispositivo em resolução original. Compatível com HD, JPG e formatos de imagem em alta qualidade.",
    icon: Camera,
    placeholder: "Cole o link da foto do Instagram aqui...",
    seoTitle: "Baixar Foto do Instagram Online Grátis em HD | Baixar Vídeo Downloader",
    seoDescription: "Baixador de Foto do Instagram Grátis – Cole o Link da Foto e Baixe Instantaneamente. Baixe fotos em HD, resolução original, sem login.",
    features: [
      { title: "Processamento Rápido", desc: "Servidores otimizados garantem downloads instantâneos." },
      { title: "Fotos em Alta Qualidade & HD", desc: "Baixe fotos do Instagram em resolução original, sem compressão." },
      { title: "Seguro e Privado", desc: "Não armazenamos URLs de fotos, dados pessoais ou credenciais de conta." },
      { title: "Compatível com PC & Celular", desc: "Baixe fotos do Instagram no PC, desktop, Android ou iPhone." },
      { title: "Baixar Foto Pelo Link", desc: "Basta colar o link da publicação e baixar instantaneamente." },
      { title: "Suporte a JPG & Formatos de Imagem", desc: "Extraia e baixe imagens do Instagram em formatos de alta qualidade." },
      { title: "100% Grátis", desc: "Downloads ilimitados sem necessidade de cadastro ou assinatura." },
    ],
    faqs: [
      { q: "1. Como posso baixar foto do Instagram online grátis?", a: "Copie o link da publicação do Instagram, cole no nosso baixador de foto do Instagram e clique em baixar." },
      { q: "2. Posso baixar fotos do Instagram em HD?", a: "Sim. Nossa ferramenta permite baixar fotos do Instagram em resolução original." },
      { q: "3. Posso baixar fotos do Instagram no PC?", a: "Sim. Você pode baixar imagens do Instagram no Windows, Mac ou qualquer navegador desktop." },
      { q: "4. Posso baixar fotos privadas do Instagram?", a: "Sim, mas apenas se você tiver acesso autorizado à conta privada." },
      { q: "5. Preciso instalar aplicativo?", a: "Não. Este é um baixador de foto do Instagram online baseado em navegador." },
      { q: "6. Posso baixar foto de perfil do Instagram?", a: "Sim. Use nosso baixador de foto de perfil do Instagram para visualizar e salvar fotos em tamanho completo." },
      { q: "7. Este baixador de foto do Instagram é gratuito?", a: "Sim. Downloads ilimitados e gratuitos, sem necessidade de cadastro." },
      { q: "8. Posso salvar fotos do Instagram diretamente na galeria?", a: "Sim. As fotos podem ser salvas diretamente na galeria do celular ou na pasta de downloads do desktop." },
    ],
    seoContent: [
      { title: "Fotos em Qualidade Máxima", text: "O Instagram comprime as fotos para exibição na plataforma. Nossa ferramenta extrai a versão de maior resolução disponível, garantindo fotos nítidas e detalhadas." },
      { title: "Ideal para Inspiração", text: "Perfeito para designers, fotógrafos e criadores de conteúdo que precisam salvar referências visuais do Instagram." },
    ],
  },
  {
    id: "profile-picture",
    slug: "/baixar-foto-perfil-instagram",
    title: "Baixar Foto de Perfil do Instagram Online Grátis",
    shortTitle: "Foto de Perfil",
    heroTitle: "Visualizador Insta DP em HD",
    heroHighlight: "e Tamanho Completo",
    subtitle: "Baixe foto de perfil do Instagram em tamanho completo de qualquer conta pública. Insira o nome de usuário do Instagram ou cole o link do perfil abaixo para visualizar, ampliar (zoom) e baixar a foto de perfil em resolução HD.",
    icon: UserCircle,
    placeholder: "Cole o link do perfil do Instagram aqui...",
    seoTitle: "Baixar Foto de Perfil do Instagram Online Grátis em HD | Baixar Vídeo Downloader",
    seoDescription: "Baixador de Foto de Perfil do Instagram Grátis – Visualize, Dê Zoom e Baixe Instantaneamente. Insta DP em HD, sem login.",
    features: [
      { title: "Carregamento Instantâneo", desc: "Servidores otimizados garantem visualização imediata em tamanho completo." },
      { title: "Ver Foto de Perfil Grande", desc: "Abra, amplie e inspecione imagens de perfil em alta resolução." },
      { title: "HD e Resolução Original", desc: "Baixe foto de perfil do Instagram em HD sem compressão ou redimensionamento." },
      { title: "Seguro e Privado", desc: "Não armazenamos nomes de usuário, links de perfil ou dados de conta." },
      { title: "Funciona em Todos os Dispositivos", desc: "Baixe Insta DP no Android, iPhone, tablet ou navegador desktop." },
      { title: "Suporte a Nome de Usuário e Link", desc: "Baixe foto de perfil usando nome de usuário ou URL do perfil." },
      { title: "100% Grátis", desc: "Downloads ilimitados sem necessidade de cadastro." },
    ],
    faqs: [
      { q: "1. Como posso baixar foto de perfil do Instagram online grátis?", a: "Cole o link do perfil no nosso baixador de foto de perfil do Instagram e clique em baixar." },
      { q: "2. Posso ver foto de perfil do Instagram em tamanho completo?", a: "Sim. Nosso visualizador Insta DP permite ver foto de perfil do Instagram grande e dar zoom." },
      { q: "3. Posso baixar foto de perfil do Instagram em HD?", a: "Sim. Suportamos downloads em HD e resolução original." },
      { q: "4. O que significa Insta DP?", a: "Insta DP significa Display Picture do Instagram, também conhecida como foto de perfil." },
      { q: "5. O que é Instagram PFP?", a: "PFP significa Profile Picture (foto de perfil)." },
      { q: "6. Posso baixar foto de perfil privada do Instagram?", a: "Sim, mas apenas se você tiver acesso autorizado à conta privada." },
      { q: "7. Preciso instalar aplicativo?", a: "Não. Esta é uma ferramenta online baseada em navegador." },
      { q: "8. Este baixador de Insta DP é gratuito?", a: "Sim. Downloads ilimitados e gratuitos sem necessidade de cadastro." },
    ],
    seoContent: [
      { title: "Amplie Fotos de Perfil", text: "No Instagram, as fotos de perfil aparecem em tamanho reduzido. Nossa ferramenta permite visualizar e baixar a versão em tamanho completo." },
      { title: "Uso Simples e Rápido", text: "Basta colar o link do perfil e em segundos você terá acesso à foto de perfil em alta resolução." },
    ],
  },
  {
    id: "audio",
    slug: "/extrair-audio-instagram",
    title: "Converter Vídeo do Instagram para MP3",
    shortTitle: "Áudio/MP3",
    heroTitle: "Converter Vídeo do Instagram",
    heroHighlight: "para MP3",
    subtitle: "Baixe áudio de vídeos, Reels, Stories e publicações compatíveis do Instagram instantaneamente. Cole o URL do vídeo do Instagram abaixo e extraia áudio MP3 em alta qualidade em poucos segundos — conversão rápida, sem marca d'água e sem necessidade de login.",
    icon: Music,
    placeholder: "Cole o link do vídeo/Reel do Instagram aqui...",
    seoTitle: "Baixar Áudio do Instagram Online Grátis em MP3 | Baixar Vídeo Downloader",
    seoDescription: "Baixador de Áudio do Instagram Grátis – Extraia MP3 de Qualquer Link do Instagram. Conversão rápida, sem login.",
    features: [
      { title: "Conversão Instantânea de Áudio", desc: "Servidores otimizados convertem vídeos do Instagram para MP3 em segundos." },
      { title: "MP3 em Alta Qualidade", desc: "Baixe áudio do Instagram com som claro e preservação de qualidade." },
      { title: "Seguro e Privado", desc: "Não armazenamos URLs do Instagram, nomes de usuário ou dados de conta." },
      { title: "Compatível com Todos os Dispositivos", desc: "Baixe áudio do Instagram no Android, iPhone, PC ou Mac." },
      { title: "Extração por Link", desc: "Basta colar o link do Instagram para extrair o áudio instantaneamente." },
      { title: "100% Grátis", desc: "Downloads ilimitados sem assinatura." },
    ],
    faqs: [
      { q: "1. Como posso baixar áudio do Instagram?", a: "Copie o link do vídeo do Instagram, cole na ferramenta e clique em extrair." },
      { q: "2. Posso converter vídeo do Instagram para MP3?", a: "Sim. Nossa ferramenta converte vídeos do Instagram para MP3 instantaneamente." },
      { q: "3. Posso baixar áudio de Reels do Instagram?", a: "Sim. É possível extrair e baixar áudio de Reels." },
      { q: "4. Posso baixar áudio de Story do Instagram?", a: "Sim, para links compatíveis de Stories." },
      { q: "5. Funciona para áudio do Instagram Direct?", a: "Sim, para links acessíveis do Direct." },
      { q: "6. Posso baixar áudio do Instagram sem marca d'água?", a: "Sim. O arquivo MP3 é limpo e sem marca d'água." },
      { q: "7. Preciso instalar aplicativo?", a: "Não. É um extrator de áudio do Instagram totalmente online." },
      { q: "8. É gratuito?", a: "Sim. Downloads ilimitados e gratuitos." },
    ],
    seoContent: [
      { title: "Salve Músicas e Sons", text: "Encontrou uma música incrível em um Reel? Com nossa ferramenta de extração de áudio, você pode salvar o áudio de qualquer vídeo do Instagram." },
      { title: "Uso Pessoal", text: "Ideal para salvar áudios para uso pessoal, como músicas de fundo, podcasts e efeitos sonoros interessantes." },
    ],
  },
];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return tools.find(t => t.slug === slug);
}

export function getToolById(id: string): ToolConfig | undefined {
  return tools.find(t => t.id === id);
}

export const toolsExceptMain = tools.filter(t => t.slug !== "/");
