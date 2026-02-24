export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  publishDate: string;
  updatedDate: string;
  category: string;
  readTime: string;
  content: string;
  faqs: BlogFAQ[];
  relatedSlugs: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "como-baixar-video-instagram-guia-completo",
    title: "Como Baixar Vídeo do Instagram (Guia Completo para Iniciantes)",
    metaTitle: "Como Baixar Vídeo do Instagram – Guia Completo 2026 | Baixar Vídeo Downloader",
    metaDescription: "Aprenda como baixar vídeo do Instagram no celular, PC, sem marca d'água e sem aplicativo. Guia completo e gratuito para iniciantes.",
    excerpt: "Aprenda como baixar vídeo do Instagram no celular, PC, sem marca d'água e sem aplicativo. Guia completo passo a passo para iniciantes.",
    featuredImage: "/images/blog-como-baixar-video-instagram.png",
    author: "Equipe Baixar Vídeo",
    publishDate: "2026-02-24",
    updatedDate: "2026-02-24",
    category: "Tutoriais",
    readTime: "8 min",
    content: "",
    faqs: [
      { question: "Como baixar vídeo do Instagram online grátis?", answer: "Copie o link do vídeo do Instagram, acesse nosso Instagram Video Downloader, cole o link e clique em Baixar." },
      { question: "Preciso instalar algum aplicativo?", answer: "Não. Nosso downloader funciona 100% no navegador, sem necessidade de instalar aplicativos." },
      { question: "Posso baixar vídeo do Instagram no celular?", answer: "Sim. Funciona em Android, iPhone e qualquer dispositivo móvel com navegador." },
      { question: "É possível baixar vídeos sem marca d'água?", answer: "Sim. Nossa ferramenta preserva o vídeo original sem adicionar marca d'água." },
      { question: "Posso baixar vídeos privados do Instagram?", answer: "Apenas se você tiver acesso autorizado à conta privada ou for o dono do conteúdo." }
    ],
    relatedSlugs: []
  },
  {
    slug: "como-baixar-video-instagram-celular",
    title: "Como Baixar Vídeo do Instagram no Celular (Guia para Android & iPhone)",
    metaTitle: "Como Baixar Vídeo do Instagram no Celular – Android & iPhone | Baixar Vídeo",
    metaDescription: "Aprenda como baixar vídeo do Instagram no celular Android e iPhone. Guia passo a passo sem aplicativo, sem marca d'água e em qualidade original.",
    excerpt: "Guia completo para baixar vídeos do Instagram no Android e iPhone sem instalar aplicativos. Método seguro e sem marca d'água.",
    featuredImage: "/images/blog-baixar-video-celular.png",
    author: "Equipe Baixar Vídeo",
    publishDate: "2026-02-24",
    updatedDate: "2026-02-24",
    category: "Tutoriais",
    readTime: "6 min",
    content: "",
    faqs: [],
    relatedSlugs: []
  },
  {
    slug: "como-baixar-video-instagram-reels",
    title: "Como Baixar Vídeo do Instagram Reels (Com Música & Sem Marca d'Água)",
    metaTitle: "Como Baixar Vídeo do Instagram Reels – Com Música & Sem Marca d'Água | Baixar Vídeo",
    metaDescription: "Aprenda como baixar vídeo do Instagram Reels com música e sem marca d'água. Guia completo para Android, iPhone e PC.",
    excerpt: "Guia completo para baixar vídeos do Instagram Reels com música, sem marca d'água, no celular e PC.",
    featuredImage: "/images/blog-baixar-reels-video.png",
    author: "Equipe Baixar Vídeo",
    publishDate: "2026-02-24",
    updatedDate: "2026-02-24",
    category: "Tutoriais",
    readTime: "6 min",
    content: "",
    faqs: [],
    relatedSlugs: []
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(slugs: string[]): BlogPost[] {
  return blogPosts.filter((post) => slugs.includes(post.slug));
}
