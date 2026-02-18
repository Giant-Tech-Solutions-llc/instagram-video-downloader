import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { Seo } from "@/components/Seo";
import { blogPosts } from "@/lib/blog-config";
import { useLanguage } from "@/lib/i18n";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export default function Blog() {
  const { t, lang } = useLanguage();
  const dateLocale: Record<string, string> = { pt: "pt-BR", en: "en-US", es: "es-ES", fr: "fr-FR", hi: "hi-IN" };
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
              {t("blog.list.desc")}
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-14 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid gap-6 sm:gap-8">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  data-testid={`blog-card-${post.slug}`}
                >
                  <article className="group bg-white rounded-2xl border border-black/5 overflow-hidden hover:shadow-lg hover:shadow-[#E6195E]/5 hover:border-[#E6195E]/20 transition-all">
                    <div className="sm:flex">
                      <div className="sm:w-72 md:w-80 flex-shrink-0">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-48 sm:h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#E6195E] bg-[#E6195E]/5 px-2.5 py-1 rounded-full">
                            {t(`blog.cat.${post.category.toLowerCase()}`)}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground font-medium">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-display font-black text-[#1A1A1A] mb-2 sm:mb-3 group-hover:text-[#E6195E] transition-colors leading-tight">
                          {post.title}
                        </h2>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <time dateTime={post.publishDate}>
                              {new Date(post.publishDate).toLocaleDateString(dateLocale[lang] || "pt-BR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </time>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#E6195E] group-hover:gap-2 transition-all">
                            {t("blog.readmore")}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
