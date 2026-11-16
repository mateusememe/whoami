/**
 * schema.org graph per page and language. The home page describes the site,
 * the page (a ProfilePage), the person (with the talks as events) and the
 * project list; a project page describes the project as SoftwareSourceCode
 * with a breadcrumb. Built from the same data as the page, so structured
 * data cannot drift from what is shown.
 */
import {
  certifications,
  education,
  experiences,
  profile,
  projects,
  socialLinks,
  spokenLanguages,
  publications,
  talkUrl,
  talks,
  techStack,
  topSkills,
} from "@/data/portfolio";
import { HOME, HTML_LANG, LANGUAGE_PATHS, LANGUAGES, PROJECT_PAGE_IDS, pagePath, type Page } from "@/i18n/routes";
import { translations, type Language } from "@/i18n/translations";
import { projectPages } from "@/data/projectPages";
import { OG_IMAGE_FILES } from "@/seo/files";
import { currentRole, pageMeta, projectById, seoDescription, tr } from "@/seo/meta";
import { parsePeriod, siteHref } from "@/seo/site";

export { currentRole, seoDescription };

const SPDX = (id: string) => `https://spdx.org/licenses/${id}.html`;

/** A talk as a schema.org Event. Dates are as precise as the record: `2022-10-28`, `2026-10` or `2023`. */
function talkEvent(language: Language, talk: (typeof talks)[number], personId: string) {
  const [city, region] = talk.city.split(", ");
  return {
    "@type": "Event",
    name: `${talk.title} — ${talk.event[language]}`,
    description: talk.desc[language],
    startDate: talk.date,
    ...(talk.online
      ? {
          eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
          location: { "@type": "VirtualLocation", url: talkUrl(talk) },
        }
      : {
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: {
            "@type": "Place",
            name: talk.organizer,
            address: { "@type": "PostalAddress", addressLocality: city, addressRegion: region, addressCountry: "BR" },
          },
        }),
    organizer: { "@type": "Organization", name: talk.organizer },
    performer: [{ "@id": personId }, ...(talk.coSpeakers ?? []).map((name) => ({ "@type": "Person", name }))],
    ...(talkUrl(talk) ? { url: talkUrl(talk) } : {}),
    inLanguage: "pt-BR",
  };
}

/** A publication as a schema.org ScholarlyArticle. Pass `about` to link the project it comes from. */
function article(item: (typeof publications)[number], personId: string, about?: string) {
  return {
    "@type": "ScholarlyArticle",
    "@id": `${personId.replace("#person", "")}#${item.id}`,
    headline: item.title,
    inLanguage: "pt-BR",
    author: item.authors.map((name, index) => (index === 0 ? { "@id": personId } : { "@type": "Person", name })),
    datePublished: String(item.year),
    ...(item.pages ? { pagination: item.pages } : {}),
    ...(item.kind === "abstract" ? { genre: "abstract" } : {}),
    isPartOf: {
      "@type": "PublicationIssue",
      name: `Anais do ${item.venue.split(" — ")[0]} ${item.year}${item.section ? ` (${item.section})` : ""}`,
      locationCreated: item.city,
      ...(item.url ? { url: item.url } : {}),
    },
    publisher: { "@type": "Organization", name: item.publisher },
    ...(item.url ? { url: item.url } : {}),
    ...(about ? { about: { "@id": about } } : {}),
  };
}

export function buildJsonLd(language: Language, siteUrl: string, target: Page = HOME): Record<string, unknown> {
  if (target.kind === "project") return buildProjectJsonLd(language, siteUrl, target.id);
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
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: siteHref(siteUrl, OG_IMAGE_FILES[language]),
          width: 1200,
          height: 630,
        },
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
        performerIn: talks.map((talk) => talkEvent(language, talk, personId)),
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
            ...(PROJECT_PAGE_IDS.includes(project.id)
              ? { url: siteHref(siteUrl, pagePath(language, { kind: "project", id: project.id })) }
              : project.liveUrl || project.githubUrl
                ? { url: project.liveUrl ?? project.githubUrl }
                : {}),
            dateCreated: String(project.year),
            ...(project.tech?.length ? { keywords: project.tech.join(", ") } : {}),
            author: { "@id": personId },
          },
        })),
      },
      // The first author is Mateus (the Person node); co-authors are named.
      ...publications.map((item) => article(item, personId)),
    ],
  };
}

function buildProjectJsonLd(language: Language, siteUrl: string, id: string): Record<string, unknown> {
  const project = projectById(id);
  if (!project) throw new Error(`Unknown project: ${id}`);
  const home = siteHref(siteUrl);
  const meta = pageMeta({ kind: "project", id }, language);
  const url = siteHref(siteUrl, meta.path);
  const personId = `${home}#person`;
  const websiteId = `${home}#website`;
  const codeId = `${url}#code`;
  const homeUrl = siteHref(siteUrl, LANGUAGE_PATHS[language]);
  const publication = publications.find((item) => item.projectId === id);

  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": websiteId, url: home, name: profile.name, publisher: { "@id": personId } },
      { "@type": "Person", "@id": personId, name: profile.name, url: home },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: meta.title,
        description: meta.description,
        inLanguage: HTML_LANG[language],
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": codeId },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        dateModified: profile.updatedAt,
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: siteHref(siteUrl, OG_IMAGE_FILES[language]),
          width: 1200,
          height: 630,
        },
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": codeId,
        name: project.name,
        description: project.desc[language],
        url,
        ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
        ...(project.language ? { programmingLanguage: project.language } : {}),
        ...(project.license ? { license: SPDX(project.license) } : {}),
        ...(project.tech?.length ? { keywords: project.tech.join(", ") } : {}),
        dateCreated: String(project.year),
        author: [{ "@id": personId }, ...(project.coAuthors ?? []).map((name) => ({ "@type": "Person", name }))],
        ...(projectPages[id] ? { abstract: projectPages[id].highlights[language].join(" ").replace(/`/g, "") } : {}),
        ...(publication ? { subjectOf: article(publication, personId, codeId) } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: profile.name, item: homeUrl },
          { "@type": "ListItem", position: 2, name: tr(language, "projects.title"), item: `${homeUrl}#projects` },
          { "@type": "ListItem", position: 3, name: project.name, item: url },
        ],
      },
    ],
  };
}
