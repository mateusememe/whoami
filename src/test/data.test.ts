import { describe, it, expect } from "vitest";
import * as portfolio from "@/data/portfolio";
import { projectPages } from "@/data/projectPages";
import { translations } from "@/i18n/translations";
import { pageTranslations } from "@/i18n/pageText";
import { githubStars } from "@/data/github-stars";
import { githubRepos } from "@/data/github-repos";

/** Every `es` string (or list of strings) under a value, with its path. */
function spanishStrings(value: unknown, path: string, out: Array<[string, string]> = []): Array<[string, string]> {
  if (Array.isArray(value)) value.forEach((item, index) => spanishStrings(item, `${path}[${index}]`, out));
  else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (key === "es") {
        for (const text of Array.isArray(item) ? item : [item]) if (typeof text === "string") out.push([`${path}.es`, text]);
      } else spanishStrings(item, `${path}.${key}`, out);
    }
  }
  return out;
}

// Names keep their Portuguese spelling in every language.
const PROPER_NOUNS = /São Paulo|Mendonça|França|Florianópolis|Ciências? [^,.;]*|Computação|DETECÇÃO[^.]*|Detecção[^.]*/g;
// Letters Spanish does not use, and short Portuguese words with no Spanish homograph.
const PORTUGUESE = /[ãõçêôâ]|\b(com|não|você|em|uma|seu|sua|também|então|isso|esse|essa|pelo|pela|nos|ao|aos|até|onde)\b/i;

describe("Experience results", () => {
  it("only show figures the description states, in every language", () => {
    const withResults = portfolio.experiences.filter((item) => item.results?.length);
    expect(withResults.length).toBeGreaterThan(3);
    for (const experience of withResults) {
      for (const result of experience.results!) {
        for (const language of ["pt", "en", "es"] as const) {
          // "−20%" → "20%", "200+" → "200", "2,600" → "2,600": the digits as the text writes them.
          const figure = result.value[language].replace(/^[−+-]/, "").replace(/\+$/, "");
          expect(experience.desc[language], `${experience.company}: ${figure}`).toContain(figure);
          expect(result.label[language].length).toBeGreaterThan(3);
        }
      }
    }
  });
});

describe("Spanish copy", () => {
  it("has no Portuguese words or letters left over from translation", () => {
    const strings = [
      ...spanishStrings(portfolio, "portfolio"),
      ...spanishStrings(projectPages, "projectPages"),
      ...spanishStrings(translations, "translations"),
      ...spanishStrings(pageTranslations, "pageTranslations"),
    ];
    expect(strings.length).toBeGreaterThan(100);
    const leftovers = strings.filter(([, text]) => PORTUGUESE.test(text.replace(PROPER_NOUNS, "")));
    expect(leftovers.map(([path, text]) => `${path}: ${text.slice(0, 80)}`)).toEqual([]);
  });
});

describe("Page strings", () => {
  it("live in one dictionary only, with the three languages", () => {
    for (const key of Object.keys(pageTranslations)) {
      expect(translations[key], key).toBeUndefined();
      expect(Object.keys(pageTranslations[key]).sort(), key).toEqual(["en", "es", "pt"]);
    }
  });
});

describe("GitHub snapshot", () => {
  const stars = githubStars;
  const repos = githubRepos;
  const repoOf = (url?: string) => url?.match(/^https:\/\/github\.com\/([^/]+\/[^/?#]+)/)?.[1];

  it("covers every public repository the site links, and fills the star counts", () => {
    for (const project of portfolio.projects) {
      const repo = repoOf(project.githubUrl);
      if (!repo) continue;
      expect(stars, repo).toHaveProperty([repo]);
      expect(project.stars).toBe(stars[repo] || undefined);
      expect(repos[repo].pushedAt, repo).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    for (const item of portfolio.contributions) expect(item.stars).toBe(stars[item.repo] || undefined);
    expect(portfolio.portfolioStats.stars).toBe(portfolio.projects.reduce((sum, project) => sum + (project.stars ?? 0), 0));
  });
});
