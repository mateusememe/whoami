import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, it, expect } from "vitest";
import { experiences, socialLinks } from "@/data/portfolio";
import { PROFILE_FILES } from "@/seo/llms";
import { DEFAULT_SITE_URL, siteHref } from "@/seo/site";

const html = readFileSync(resolve("index.html"), "utf8");
const doc = new DOMParser().parseFromString(html, "text/html");

const meta = (key: string) =>
  doc.querySelector(`meta[property="${key}"], meta[name="${key}"]`)?.getAttribute("content");

describe("index.html metadata", () => {
  const home = siteHref(DEFAULT_SITE_URL);

  it("uses absolute canonical and Open Graph URLs", () => {
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(home);
    expect(meta("og:url")).toBe(home);
  });

  it("points og:image and twitter:image at a 1200x630 PNG that exists", () => {
    const image = siteHref(DEFAULT_SITE_URL, "og-image.png");
    expect(meta("og:image")).toBe(image);
    expect(meta("twitter:image")).toBe(image);

    const png = readFileSync(resolve("public/og-image.png"));
    expect(png.readUInt32BE(16)).toBe(Number(meta("og:image:width")));
    expect(png.readUInt32BE(20)).toBe(Number(meta("og:image:height")));
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  });

  it("advertises llms.txt and the Markdown profiles", () => {
    expect(doc.querySelector('link[rel="describedby"]')?.getAttribute("href")).toBe(
      siteHref(DEFAULT_SITE_URL, "llms.txt"),
    );
    const markdown = [...doc.querySelectorAll('link[rel="alternate"][type="text/markdown"]')].map((link) =>
      link.getAttribute("href"),
    );
    expect(markdown.sort()).toEqual(Object.values(PROFILE_FILES).map((file) => siteHref(DEFAULT_SITE_URL, file)).sort());
  });

  it("applies the saved theme before first paint", () => {
    const inline = [...doc.querySelectorAll("head script:not([type])")].map((s) => s.textContent ?? "");
    expect(inline.some((code) => code.includes("portfolio_theme") && code.includes('classList.add("dark")'))).toBe(true);
  });
});

describe("JSON-LD Person", () => {
  const person = JSON.parse(doc.querySelector('script[type="application/ld+json"]')?.textContent ?? "{}");

  it("matches the site URL and current employer", () => {
    expect(person["@type"]).toBe("Person");
    expect(person.url).toBe(siteHref(DEFAULT_SITE_URL));
    const current = experiences.find((exp) => exp.period.en.endsWith("Present"));
    expect(person.worksFor.name).toBe(current?.company);
  });

  it("lists every public profile in sameAs and the email from socialLinks", () => {
    const profiles = socialLinks.filter((link) => !link.href.startsWith("mailto:")).map((link) => link.href);
    expect([...person.sameAs].sort()).toEqual([...profiles].sort());
    expect(person.email).toBe(socialLinks.find((link) => link.href.startsWith("mailto:"))?.href);
  });
});
