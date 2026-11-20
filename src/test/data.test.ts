import { describe, it, expect } from "vitest";
import * as portfolio from "@/data/portfolio";
import { projectPages } from "@/data/projectPages";
import { translations } from "@/i18n/translations";

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

describe("Spanish copy", () => {
  it("has no Portuguese words or letters left over from translation", () => {
    const strings = [
      ...spanishStrings(portfolio, "portfolio"),
      ...spanishStrings(projectPages, "projectPages"),
      ...spanishStrings(translations, "translations"),
    ];
    expect(strings.length).toBeGreaterThan(100);
    const leftovers = strings.filter(([, text]) => PORTUGUESE.test(text.replace(PROPER_NOUNS, "")));
    expect(leftovers.map(([path, text]) => `${path}: ${text.slice(0, 80)}`)).toEqual([]);
  });
});
