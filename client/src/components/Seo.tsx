import { useEffect, useRef } from "react";

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

function safeRemove(el: Element) {
  try {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  } catch (_e) {}
}

export function Seo({ title, description, canonical, ogImage, ogType = "website", article, jsonLd }: SeoProps) {
  const scriptsRef = useRef<HTMLScriptElement[]>([]);

  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, isProperty = false) => {
      try {
        const attr = isProperty ? "property" : "name";
        let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
        if (!el) {
          el = document.createElement("meta");
          el.setAttribute(attr, name);
          document.head.appendChild(el);
        }
        el.setAttribute("content", content);
      } catch (_e) {}
    };

    setMeta("description", description);

    const baseUrl = window.location.origin;
    const canonicalUrl = canonical ? `${baseUrl}${canonical}` : `${baseUrl}${window.location.pathname}`;

    try {
      let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalEl) {
        canonicalEl = document.createElement("link");
        canonicalEl.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.setAttribute("href", canonicalUrl);
    } catch (_e) {}

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

    scriptsRef.current.forEach(safeRemove);
    scriptsRef.current = [];

    const existingLd = document.querySelectorAll('script[data-seo-jsonld]');
    existingLd.forEach(safeRemove);

    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema) => {
        try {
          const script = document.createElement("script");
          script.type = "application/ld+json";
          script.setAttribute("data-seo-jsonld", "true");
          script.textContent = JSON.stringify(schema);
          document.head.appendChild(script);
          scriptsRef.current.push(script);
        } catch (_e) {}
      });
    }

    return () => {
      scriptsRef.current.forEach(safeRemove);
      scriptsRef.current = [];
    };
  }, [title, description, canonical, ogImage, ogType, article, jsonLd]);

  return null;
}
