/**
 * The profile as JSON Resume (https://jsonresume.org/schema), one file per
 * language. Agents and tools that already read that schema get the whole
 * career as structured data, with ISO dates, from the same source as the page.
 */
import {
  certifications,
  education,
  experiences,
  profile,
  projects,
  socialLinks,
  spokenLanguages,
  techGroups,
} from "@/data/portfolio";
import { LANGUAGE_PATHS } from "@/i18n/routes";
import { translations, type Language } from "@/i18n/translations";
import { RESUME_FILES } from "@/seo/files";
import { parsePeriod, siteHref } from "@/seo/site";

/** Separator between degree type and field in the degree names ("Master's in Computer Science"). */
const DEGREE_SEPARATOR: Record<Language, string> = { en: " in ", pt: " em ", es: " en " };

const tr = (language: Language, key: string) => translations[key]?.[language] ?? key;

export function buildResume(language: Language, siteUrl: string): Record<string, unknown> {
  const mail = socialLinks.find((link) => link.href.startsWith("mailto:"));

  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: profile.name,
      label: tr(language, "hero.title"),
      image: siteHref(siteUrl, "images/profile-avatar.jpg"),
      ...(mail ? { email: mail.href.replace("mailto:", "") } : {}),
      url: siteHref(siteUrl, LANGUAGE_PATHS[language]),
      summary: tr(language, "about.text"),
      location: { city: profile.city, region: profile.region, countryCode: profile.countryCode },
      profiles: socialLinks
        .filter((link) => !link.href.startsWith("mailto:"))
        .map((link) => ({ network: link.label, username: link.displayText ?? link.label, url: link.href })),
    },
    work: experiences.map((experience) => ({
      name: experience.company,
      position: experience.role[language],
      location: experience.location,
      ...parsePeriod(experience.period.en),
      summary: experience.desc[language],
      highlights: [experience.tech.join(", ")],
    })),
    education: education.map((item) => {
      const [studyType, area] = tr(language, item.degreeKey).split(DEGREE_SEPARATOR[language]);
      return {
        institution: item.fullName ?? item.school,
        studyType,
        area: area ?? studyType,
        ...parsePeriod(item.period.en),
      };
    }),
    awards: [
      {
        title: tr(language, "skills.scholarship"),
        awarder: "ProUni",
        summary: tr(language, "skills.scholarshipDesc"),
      },
    ],
    certificates: certifications.map((item) => ({
      name: `${item.name} (${item.detail[language]})`,
      issuer: item.issuer,
    })),
    skills: techGroups.map((group) => ({ name: tr(language, group.labelKey), keywords: group.items })),
    languages: spokenLanguages.map((item) => ({ language: item.name[language], fluency: item.level[language] })),
    projects: projects.map((project) => ({
      name: project.name,
      description: project.desc[language],
      keywords: project.tech ?? [],
      ...(project.githubUrl || project.liveUrl ? { url: project.githubUrl ?? project.liveUrl } : {}),
    })),
    meta: {
      canonical: siteHref(siteUrl, RESUME_FILES[language]),
      version: "v1.0.0",
      lastModified: `${profile.updatedAt}T00:00:00Z`,
    },
  };
}
