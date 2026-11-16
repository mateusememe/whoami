import { profile } from "@/data/portfolio";
import { HTML_LANG, LANGUAGES, PAGES, pagePath } from "@/i18n/routes";
import { siteHref } from "@/seo/site";

/**
 * XML sitemap: every page in every language, each URL listing its other
 * languages as hreflang alternates. `lastmod` is the date of the last
 * content update (profile.updatedAt), so the file only changes when the
 * content does.
 */
export function renderSitemap(siteUrl: string): string {
  const urls = PAGES.flatMap((page) => {
    const alternates = [
      ...LANGUAGES.map(
        (code) => `    <xhtml:link rel="alternate" hreflang="${HTML_LANG[code]}" href="${siteHref(siteUrl, pagePath(code, page))}" />`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteHref(siteUrl, pagePath("en", page))}" />`,
    ].join("\n");

    return LANGUAGES.map((code) =>
      [
        "  <url>",
        `    <loc>${siteHref(siteUrl, pagePath(code, page))}</loc>`,
        `    <lastmod>${profile.updatedAt}</lastmod>`,
        `    <changefreq>${page.kind === "home" ? "monthly" : "yearly"}</changefreq>`,
        `    <priority>${page.kind === "home" ? (code === "en" ? "1.0" : "0.9") : "0.7"}</priority>`,
        alternates,
        "  </url>",
      ].join("\n"),
    );
  });

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}
