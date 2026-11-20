/**
 * Data of the terminal business card (`npx mateusememe`, packages/card):
 * the same facts as the site, per language. The package prints it with no
 * dependencies; this module only decides what goes on it.
 */
import { experiences, profile, socialLinks } from "@/data/portfolio";
import { LANGUAGE_PATHS, LANGUAGES } from "@/i18n/routes";
import { translations, type Language } from "@/i18n/translations";
import { CV_FILES } from "@/seo/files";
import { siteHref } from "@/seo/site";

const LABELS: Record<Language, { site: string; cv: string; hint: string }> = {
  en: { site: "Site", cv: "Résumé", hint: "Other languages: npx mateusememe --pt | --es" },
  pt: { site: "Site", cv: "Currículo", hint: "Outros idiomas: npx mateusememe --en | --es" },
  es: { site: "Sitio", cv: "Currículum", hint: "Otros idiomas: npx mateusememe --en | --pt" },
};

const display = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/^mailto:/, "").replace(/\/$/, "");

export interface CardData {
  name: string;
  headline: string;
  summary: string;
  links: Array<{ label: string; value: string }>;
  hint: string;
}

export function cardData(language: Language, siteUrl: string): CardData {
  const role = experiences.find((item) => item.period.en.endsWith("Present"));
  const link = (icon: string) => socialLinks.find((item) => item.iconName === icon);
  const labels = LABELS[language];
  return {
    name: profile.name,
    headline: `${translations["hero.title"][language]}${role ? ` · ${role.company}` : ""}`,
    summary: translations["hero.summary"][language],
    links: [
      { label: labels.site, value: display(siteHref(siteUrl, LANGUAGE_PATHS[language])) },
      ...(["Github", "Linkedin", "Mail"] as const).flatMap((icon) => {
        const item = link(icon);
        return item ? [{ label: icon === "Mail" ? "Email" : item.label, value: display(item.href) }] : [];
      }),
      { label: labels.cv, value: display(siteHref(siteUrl, CV_FILES[language])) },
    ],
    hint: labels.hint,
  };
}

export function renderCardData(siteUrl: string): string {
  return `${JSON.stringify(Object.fromEntries(LANGUAGES.map((language) => [language, cardData(language, siteUrl)])), null, 2)}\n`;
}
