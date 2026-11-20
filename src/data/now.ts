/**
 * The /now page, built from the rest of the data so it never goes stale on
 * its own: the current role, the degree in progress and its research
 * project, the newest projects, the latest talk and the latest merged
 * contribution. `nowNotes` holds anything the data does not say; it is
 * empty until there is something to add.
 */
import { contributions, education, experiences, projects, talks, type LocalizedString } from "@/data/portfolio";
import type { LocalizedList } from "@/data/projectPages";
import { PROJECT_PAGE_IDS, type Page } from "@/i18n/routes";
import type { Language } from "@/i18n/translations";

/** The MSc research project (src/data/portfolio.ts). */
export const MSC_PROJECT_ID = "lime-stability";

/** Free notes for /now, written by hand. Rendered only when there are any. */
export const nowNotes: LocalizedList = { pt: [], en: [], es: [] };

export interface NowLink {
  label: string;
  /** A page of the site, or an external address. */
  page?: Page;
  href?: string;
}

export interface NowItem {
  id: "work" | "study" | "build" | "talk" | "contribute";
  /** Main line: the role, the degree, the talk… */
  title: string;
  /** Where or since when. */
  meta?: string;
  /** One sentence of context. */
  detail?: string;
  links: NowLink[];
}

const firstSentence = (text: string) => text.replace(/`/g, "").split(/(?<=\.)\s+(?=[A-ZÀ-Ý])/)[0];

/** The period's start, as written ("Mai 2026 – Presente" → "Mai 2026"). */
const startOf = (period: LocalizedString, language: Language) => period[language].split(" – ")[0];

/** Words the items need from the translations, passed in so this module stays free of them. */
export interface NowLabels {
  degree: (key: string) => string;
  /** "4 projects in 2026". */
  building: (count: number, year: number) => string;
}

export function nowItems(language: Language, labels: NowLabels): NowItem[] {
  const items: NowItem[] = [];

  const role = experiences.find((item) => item.period.en.endsWith("Present"));
  if (role) {
    items.push({
      id: "work",
      title: `${role.role[language]} · ${role.company}`,
      meta: startOf(role.period, language),
      detail: firstSentence(role.desc[language]),
      links: [],
    });
  }

  const degree = education.find((item) => item.current);
  const research = projects.find((item) => item.id === MSC_PROJECT_ID);
  if (degree) {
    items.push({
      id: "study",
      title: `${labels.degree(degree.degreeKey)} · ${degree.fullName ?? degree.school}`,
      meta: degree.period[language],
      detail: research ? firstSentence(research.desc[language]) : undefined,
      links: research && PROJECT_PAGE_IDS.includes(research.id) ? [{ label: research.name, page: { kind: "project", id: research.id } }] : [],
    });
  }

  const newest = Math.max(...projects.filter((item) => item.featured).map((item) => item.year));
  const building = projects.filter((item) => item.featured && item.year === newest && item.id !== MSC_PROJECT_ID);
  if (building.length) {
    items.push({
      id: "build",
      title: labels.building(building.length, newest),
      links: building.map((item) => ({ label: item.name, page: { kind: "project", id: item.id } })),
    });
  }

  const talk = talks[0];
  if (talk) {
    items.push({
      id: "talk",
      title: talk.title,
      meta: talk.event[language],
      detail: firstSentence(talk.desc[language]),
      links: [{ label: talk.title, page: { kind: "talk", id: talk.id } }],
    });
  }

  const contribution = [...contributions].sort((a, b) => b.merged.localeCompare(a.merged))[0];
  if (contribution) {
    items.push({
      id: "contribute",
      title: contribution.repo,
      meta: contribution.merged,
      detail: firstSentence(contribution.desc[language]),
      links: [{ label: contribution.repo, href: contribution.url }],
    });
  }

  return items;
}
