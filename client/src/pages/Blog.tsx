import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { Seo } from "@/components/Seo";
import { blogPosts as staticBlogPosts } from "@/lib/blog-config";
import { ArrowRight, Calendar, Clock, Loader2 } from "lucide-react";

interface BlogPostData {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  readTime: string | null;
  publishedAt: string | null;
  categoryName: string;
  categorySlug: string;
  authorName: string;
}

export default function Blog() {
  const { data, isLoading } = useQuery<{ posts: BlogPostData[]; total: number }>({
    queryKey: ["/api/blog/posts"],
  });

  const posts = data?.posts;
  const hasPosts = posts && posts.length > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog - Baixar Vídeo Instagram",
    "description": "Dicas, tutoriais e guias sobre como baixar vídeos, fotos e reels do Instagram. Conteúdo atualizado para 2026.",
    "url": `${window.location.origin}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": "Baixar Vídeo Instagram"
    }
  };

  const renderPost = (post: { slug: string; title: string; featuredImage: string | null; category: string; readTime: string | null; excerpt: string | null; publishDate: string | null }) => (
    <Link
      key={post.slug}
      href={`/blog/${post.slug}`}
      data-testid={`blog-card-${post.slug}`}
    >
      <article className="group bg-white rounded-2xl border border-black/5 overflow-hidden hover:shadow-lg hover:shadow-[#E6195E]/5 hover:border-[#E6195E]/20 transition-all">
        <div className="sm:flex">
          <div className="sm:w-72 md:w-80 flex-shrink-0">
            {post.featuredImage && (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-48 sm:h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
          <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#E6195E] bg-[#E6195E]/5 px-2.5 py-1 rounded-full">
                {post.category}
              </span>
              {post.readTime && (
                <span className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground font-medium">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-display font-black text-[#1A1A1A] mb-2 sm:mb-3 group-hover:text-[#E6195E] transition-colors leading-tight">
              {post.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed mb-4 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between gap-4">
              {post.publishDate && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <time dateTime={post.publishDate}>
                    {new Date(post.publishDate).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
              )}
              <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#E6195E] group-hover:gap-2 transition-all">
                Ler artigo
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title="Blog - Baixar Vídeo Instagram | Dicas e Tutoriais"
        description="Dicas, tutoriais e guias sobre como baixar vídeos, fotos e reels do Instagram. Conteúdo atualizado para 2026."
        canonical="/blog"
        ogType="website"
        jsonLd={jsonLd}
      />
      <Navbar />
      <main className="flex-grow">
        <section className="pt-12 sm:pt-16 md:pt-20 pb-10 sm:pb-12 md:pb-16 bg-[#F8F9FA]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-4 sm:mb-6 text-[#1A1A1A] tracking-tighter"
              data-testid="text-blog-title"
            >
              Blog
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Dicas, tutoriais e guias atualizados sobre como baixar conteúdo do Instagram de forma rápida e segura.
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-14 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#E6195E]" />
              </div>
            ) : (
              <div className="grid gap-6 sm:gap-8">
                {hasPosts
                  ? posts.map((post) =>
                      renderPost({
                        slug: post.slug,
                        title: post.title,
                        featuredImage: post.featuredImage,
                        category: post.categoryName,
                        readTime: post.readTime,
                        excerpt: post.excerpt,
                        publishDate: post.publishedAt,
                      })
                    )
                  : staticBlogPosts.map((post) =>
                      renderPost({
                        slug: post.slug,
                        title: post.title,
                        featuredImage: post.featuredImage,
                        category: post.category,
                        readTime: post.readTime,
                        excerpt: post.excerpt,
                        publishDate: post.publishDate,
                      })
                    )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
