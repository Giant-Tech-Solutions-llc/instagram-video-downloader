import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  article?: {
    author: string;
    publishDate: string;
    updatedDate: string;
    category: string;
  };
  jsonLd?: object | object[];
}

export function Seo({ title, description, canonical, ogImage, ogType = "website", article, jsonLd }: SeoProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);

    const baseUrl = window.location.origin;
    const canonicalUrl = canonical ? `${baseUrl}${canonical}` : `${baseUrl}${window.location.pathname}`;

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", canonicalUrl);

    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", ogType, true);
    setMeta("og:url", canonicalUrl, true);
    if (ogImage) setMeta("og:image", ogImage, true);
    setMeta("og:locale", "pt_BR", true);
    setMeta("og:site_name", "Baixar Vídeo Instagram", true);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (ogImage) setMeta("twitter:image", ogImage);

    if (article) {
      setMeta("article:author", article.author, true);
      setMeta("article:published_time", article.publishDate, true);
      setMeta("article:modified_time", article.updatedDate, true);
      setMeta("article:section", article.category, true);
    }

    const existingLd = document.querySelectorAll('script[data-seo-jsonld]');
    existingLd.forEach((el) => {
      if (el.parentNode) el.parentNode.removeChild(el);
    });

    const addedScripts: HTMLScriptElement[] = [];
    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-jsonld", "true");
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
        addedScripts.push(script);
      });
    }

    return () => {
      addedScripts.forEach((el) => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    };
  }, [title, description, canonical, ogImage, ogType, article, jsonLd]);

  return null;
}
