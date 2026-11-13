import { profile } from "@/data/portfolio";
import { HTML_LANG, LANGUAGE_PATHS, LANGUAGES } from "@/i18n/routes";
import { siteHref } from "@/seo/site";

/**
 * XML sitemap: one entry per language URL, each listing the others as
 * hreflang alternates. `lastmod` is the date of the last content update
 * (profile.updatedAt), so the file only changes when the content does.
 */
export function renderSitemap(siteUrl: string): string {
  const alternates = [
    ...LANGUAGES.map(
      (code) =>
        `    <xhtml:link rel="alternate" hreflang="${HTML_LANG[code]}" href="${siteHref(siteUrl, LANGUAGE_PATHS[code])}" />`,
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteHref(siteUrl)}" />`,
  ].join("\n");

  const urls = LANGUAGES.map((code) =>
    [
      "  <url>",
      `    <loc>${siteHref(siteUrl, LANGUAGE_PATHS[code])}</loc>`,
      `    <lastmod>${profile.updatedAt}</lastmod>`,
      "    <changefreq>monthly</changefreq>",
      `    <priority>${code === "en" ? "1.0" : "0.9"}</priority>`,
      alternates,
      "  </url>",
    ].join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}
