import { useParams, Link, Redirect } from "wouter";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { Seo } from "@/components/Seo";
import { useLanguage } from "@/lib/i18n";
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/blog-config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowRight, Calendar, Clock, RefreshCw, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPost() {
  const { t, lang } = useLanguage();
  const dateLocale: Record<string, string> = { pt: "pt-BR", en: "en-US", es: "es-ES", fr: "fr-FR", hi: "hi-IN" };
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return <Redirect to="/blog" />;
  }

  const relatedPosts = getRelatedPosts(post.relatedSlugs);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription,
    "image": post.featuredImage,
    "author": {
      "@type": "Person",
      "name": post.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Baixar Vídeo Instagram",
    },
    "datePublished": post.publishDate,
    "dateModified": post.updatedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${window.location.origin}/blog/${post.slug}`,
    },
  };

  const faqSchema = post.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": post.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Início", "item": window.location.origin },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${window.location.origin}/blog` },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `${window.location.origin}/blog/${post.slug}` },
    ],
  };

  const jsonLdSchemas = [articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={post.metaTitle}
        description={post.metaDescription}
        canonical={`/blog/${post.slug}`}
        ogImage={post.featuredImage}
        ogType="article"
        article={{
          author: post.author,
          publishDate: post.publishDate,
          updatedDate: post.updatedDate,
          category: post.category,
        }}
        jsonLd={jsonLdSchemas}
      />
      <Navbar />
      <main className="flex-grow">
        <article>
          <section className="pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8 bg-[#F8F9FA]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <Breadcrumb className="mb-6 sm:mb-8" data-testid="blog-breadcrumb">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/">{t("nav.home")}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/blog">Blog</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{post.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#E6195E] bg-[#E6195E]/5 px-2.5 py-1 rounded-full">
                  {t(`blog.cat.${post.category.toLowerCase()}`)}
                </span>
                <span className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground font-medium">
                  <Clock className="w-3 h-3" />
                  {post.readTime} {t("blog.readtime")}
                </span>
              </div>

              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-display font-black text-[#1A1A1A] tracking-tighter leading-[1.1] mb-6"
                data-testid="text-blog-post-title"
              >
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <time dateTime={post.publishDate}>
                    {new Date(post.publishDate).toLocaleDateString(dateLocale[lang] || "pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t("blog.updated")}{" "}
                  <time dateTime={post.updatedDate}>
                    {new Date(post.updatedDate).toLocaleDateString(dateLocale[lang] || "pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </span>
              </div>
            </div>
          </section>

          <section className="py-2 sm:py-4">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-2xl"
                loading="eager"
                data-testid="img-blog-featured"
              />
            </div>
          </section>

          <section className="py-8 sm:py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <div
                className="prose prose-slate max-w-none
                  prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight prose-headings:text-[#1A1A1A]
                  prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:md:text-3xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:sm:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-[15px] prose-p:sm:text-base prose-p:md:text-lg prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:font-medium prose-p:mb-4
                  prose-li:text-[15px] prose-li:sm:text-base prose-li:md:text-lg prose-li:text-muted-foreground prose-li:font-medium prose-li:leading-relaxed
                  prose-strong:text-[#1A1A1A]
                  prose-a:text-[#E6195E] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                  prose-ul:my-4 prose-ul:space-y-1
                "
                data-testid="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-10 sm:mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#E6195E] to-[#c01650] text-white text-center" data-testid="blog-cta">
                <h3 className="text-xl sm:text-2xl font-display font-black mb-3 tracking-tight">
                  {t("blog.cta.title")}
                </h3>
                <p className="text-sm sm:text-base text-white/80 font-medium mb-5 max-w-md mx-auto">
                  {t("blog.cta.desc")}
                </p>
                <Link href="/">
                  <Button
                    className="bg-white text-[#E6195E] hover:bg-white/90 font-bold text-sm sm:text-base px-6"
                    data-testid="button-blog-cta"
                  >
                    {t("blog.cta.button")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {post.faqs.length > 0 && (
                <div className="mt-10 sm:mt-14" data-testid="blog-faq">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-[#1A1A1A] mb-6 tracking-tight">
                    {t("blog.faq.title")}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {post.faqs.map((faq, i) => (
                      <AccordionItem
                        key={i}
                        value={`faq-${i}`}
                        className="border border-black/5 rounded-xl px-5 sm:px-6 data-[state=open]:bg-[#F8F9FA]"
                      >
                        <AccordionTrigger
                          className="text-sm sm:text-base font-bold text-[#1A1A1A] text-left py-4"
                          data-testid={`blog-faq-q-${i}`}
                        >
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {relatedPosts.length > 0 && (
                <div className="mt-10 sm:mt-14 pt-10 sm:pt-14 border-t border-black/5" data-testid="blog-related">
                  <h2 className="text-xl sm:text-2xl font-display font-black text-[#1A1A1A] mb-6 tracking-tight">
                    {t("blog.related")}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/blog/${related.slug}`}
                        data-testid={`related-${related.slug}`}
                      >
                        <div className="group bg-white rounded-xl border border-black/5 overflow-hidden hover:shadow-md hover:border-[#E6195E]/20 transition-all">
                          <img
                            src={related.featuredImage}
                            alt={related.title}
                            className="w-full h-36 sm:h-40 object-cover"
                            loading="lazy"
                          />
                          <div className="p-4 sm:p-5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#E6195E]">
                              {t(`blog.cat.${related.category.toLowerCase()}`)}
                            </span>
                            <h3 className="text-sm sm:text-base font-black text-[#1A1A1A] mt-1.5 leading-snug group-hover:text-[#E6195E] transition-colors line-clamp-2">
                              {related.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </article>

        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-50" data-testid="blog-sticky-cta">
          <Link href="/">
            <Button className="w-full bg-[#E6195E] hover:bg-[#E6195E]/90 font-bold text-base shadow-lg shadow-[#E6195E]/25">
              {t("blog.sticky.cta")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
