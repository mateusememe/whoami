/**
 * schema.org graph for a language version of the home page: the site, the
 * page (a ProfilePage), the person and the project list. Built from the same
 * data as the page, so structured data cannot drift from what is shown.
 */
import {
  certifications,
  education,
  experiences,
  profile,
  projects,
  socialLinks,
  spokenLanguages,
  techStack,
  topSkills,
} from "@/data/portfolio";
import { HTML_LANG, LANGUAGE_PATHS, LANGUAGES } from "@/i18n/routes";
import { translations, type Language } from "@/i18n/translations";
import { parsePeriod, siteHref } from "@/seo/site";

const tr = (language: Language, key: string) => translations[key]?.[language] ?? key;

export function currentRole() {
  return experiences.find((experience) => experience.period.en.endsWith("Present"));
}

export function seoDescription(language: Language): string {
  return tr(language, "seo.description").replace("{company}", currentRole()?.company ?? "");
}

export function buildJsonLd(language: Language, siteUrl: string): Record<string, unknown> {
  const home = siteHref(siteUrl);
  const page = siteHref(siteUrl, LANGUAGE_PATHS[language]);
  const personId = `${home}#person`;
  const websiteId = `${home}#website`;
  const role = currentRole();
  const mail = socialLinks.find((link) => link.href.startsWith("mailto:"));
  const school = (item: (typeof education)[number]) => ({
    "@type": "CollegeOrUniversity",
    name: item.fullName ?? item.school,
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: home,
        name: profile.name,
        description: seoDescription(language),
        inLanguage: LANGUAGES.map((code) => HTML_LANG[code]),
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${page}#profile`,
        url: page,
        name: tr(language, "seo.title"),
        inLanguage: HTML_LANG[language],
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        dateModified: profile.updatedAt,
        primaryImageOfPage: { "@type": "ImageObject", url: siteHref(siteUrl, "og-image.png"), width: 1200, height: 630 },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        givenName: profile.givenName,
        familyName: profile.familyName,
        url: home,
        image: siteHref(siteUrl, "images/profile-avatar.jpg"),
        jobTitle: tr(language, "hero.title"),
        description: tr(language, "hero.summary"),
        ...(mail ? { email: mail.href } : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: profile.city,
          addressRegion: profile.region,
          addressCountry: profile.countryCode,
        },
        ...(role
          ? {
              worksFor: { "@type": "Organization", name: role.company },
              hasOccupation: {
                "@type": "Occupation",
                name: role.role[language],
                skills: techStack.join(", "),
                occupationLocation: { "@type": "City", name: profile.city },
              },
            }
          : {}),
        affiliation: education.filter((item) => item.current).map(school),
        alumniOf: education.filter((item) => !item.current).map(school),
        knowsAbout: topSkills.map((skill) => skill[language]),
        knowsLanguage: spokenLanguages.map((item) => item.code),
        hasCredential: [
          ...education.map((item) => ({
            "@type": "EducationalOccupationalCredential",
            name: tr(language, item.degreeKey),
            credentialCategory: "degree",
            recognizedBy: school(item),
            ...(item.current ? {} : { dateCreated: parsePeriod(item.period.en).endDate }),
          })),
          ...certifications.map((item) => ({
            "@type": "EducationalOccupationalCredential",
            name: `${item.name} (${item.detail[language]})`,
            credentialCategory: "certificate",
            recognizedBy: { "@type": "Organization", name: item.issuer },
          })),
        ],
        award: tr(language, "skills.scholarship"),
        sameAs: socialLinks.filter((link) => !link.href.startsWith("mailto:")).map((link) => link.href),
        ...(mail
          ? {
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "professional inquiries",
                email: mail.href.replace("mailto:", ""),
                availableLanguage: spokenLanguages.map((item) => item.code),
              },
            }
          : {}),
      },
      {
        "@type": "ItemList",
        "@id": `${home}#projects`,
        name: tr(language, "projects.title"),
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "SoftwareSourceCode",
            name: project.name,
            description: project.desc[language],
            ...(project.language ? { programmingLanguage: project.language } : {}),
            ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
            ...(project.liveUrl || project.githubUrl ? { url: project.liveUrl ?? project.githubUrl } : {}),
            ...(project.tech?.length ? { keywords: project.tech.join(", ") } : {}),
            author: { "@id": personId },
          },
        })),
      },
    ],
  };
}
