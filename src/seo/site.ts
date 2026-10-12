/**
 * Public site identity shared by build scripts (sitemap, llms.txt, prerender)
 * and tests. The deploy workflow can override the URL with VITE_SITE_URL.
 */
export const DEFAULT_SITE_URL = "https://mateusememe.github.io/whoami";

export const SITE_NAME = "Mateus Mendonça Monteiro";

export const SOURCE_REPO_URL = "https://github.com/mateusememe/whoami";

/** Joins the site URL and a path without doubling or dropping slashes. */
export function siteHref(siteUrl: string, path = ""): string {
  return `${siteUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
