/**
 * Public site identity shared by build scripts (sitemap, llms.txt, head,
 * prerender) and tests. The deploy workflow can override the URL with
 * VITE_SITE_URL.
 */
export const DEFAULT_SITE_URL = "https://mateusememe.github.io/whoami";

export const SITE_NAME = "Mateus Mendonça Monteiro";

export const SOURCE_REPO_URL = "https://github.com/mateusememe/whoami";

/** Joins the site URL and a path without doubling or dropping slashes. */
export function siteHref(siteUrl: string, path = ""): string {
  return `${siteUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

const MONTHS: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

/**
 * Turns an English period such as "May 2026 – Present" into ISO months.
 * An open period ("Present") has no end date.
 */
export function parsePeriod(period: string): { startDate: string; endDate?: string } {
  const [start, end] = [...period.matchAll(/([A-Z][a-z]{2}) (\d{4})/g)].map(([, month, year]) => `${year}-${MONTHS[month]}`);
  if (!start) throw new Error(`Unreadable period: ${period}`);
  return end ? { startDate: start, endDate: end } : { startDate: start };
}
