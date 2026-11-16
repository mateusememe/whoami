import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { HTML_LANG, LANGUAGES, pagePath, parseRoute } from "@/i18n/routes";
import { pageMeta } from "@/seo/meta";
import { DEFAULT_SITE_URL, siteHref } from "@/seo/site";

const SITE_URL = import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL;

function setAttribute(selector: string, attribute: string, value: string): void {
  document.head.querySelector(selector)?.setAttribute(attribute, value);
}

/**
 * Keeps the document head in step with client-side navigation: title,
 * description, canonical URL, hreflang alternates and the share tags. Each
 * URL is also prerendered with the same values (src/seo/head.ts), so this
 * only matters after the first page, for the tab title, history entries
 * and the share sheet.
 */
export function useDocumentHead(): void {
  const { language } = useLanguage();
  const { pathname } = useLocation();

  useEffect(() => {
    const { page } = parseRoute(pathname);
    if (!page) return;
    const meta = pageMeta(page, language);
    const url = siteHref(SITE_URL, meta.path);

    document.title = meta.title;
    setAttribute('meta[name="description"]', "content", meta.description);
    setAttribute('link[rel="canonical"]', "href", url);
    for (const code of LANGUAGES) {
      setAttribute(`link[rel="alternate"][hreflang="${HTML_LANG[code]}"]`, "href", siteHref(SITE_URL, pagePath(code, page)));
    }
    setAttribute('link[rel="alternate"][hreflang="x-default"]', "href", siteHref(SITE_URL, pagePath("en", page)));
    setAttribute('meta[property="og:title"]', "content", meta.title);
    setAttribute('meta[property="og:description"]', "content", meta.description);
    setAttribute('meta[property="og:url"]', "content", url);
    setAttribute('meta[name="twitter:title"]', "content", meta.title);
    setAttribute('meta[name="twitter:description"]', "content", meta.description);
  }, [language, pathname]);
}
