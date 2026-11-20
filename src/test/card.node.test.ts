// @vitest-environment node
import { execFileSync } from "child_process";
import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, it, expect } from "vitest";
import { profile } from "@/data/portfolio";
import { renderCardData } from "@/seo/card";
import { DEFAULT_SITE_URL } from "@/seo/site";

const run = (...args: string[]) =>
  execFileSync(process.execPath, [resolve("packages/card/index.js"), ...args], {
    env: { ...process.env, NO_COLOR: "1", LANG: "en_US.UTF-8" },
  }).toString();

describe("npx card", () => {
  it("ships the same data as the site (run `npm run generate` to refresh)", () => {
    expect(readFileSync(resolve("packages/card/card.json"), "utf8")).toBe(renderCardData(DEFAULT_SITE_URL));
  });

  it("prints in the requested language, within 80 columns, without colors under NO_COLOR", () => {
    for (const [flag, word] of [
      ["--en", "Résumé"],
      ["--pt", "Currículo"],
      ["--es", "Currículum"],
    ]) {
      const output = run(flag);
      expect(output).toContain(profile.name);
      expect(output).toContain(word);
      expect(output).not.toContain("\u001b[");
      for (const line of output.split("\n")) expect([...line].length, line).toBeLessThanOrEqual(80);
    }
  });

  it("falls back to LANG, then English", () => {
    expect(run()).toContain("Other languages");
  });

  it("publishes only the script and its data", () => {
    const manifest = JSON.parse(readFileSync(resolve("packages/card/package.json"), "utf8"));
    expect(manifest.bin).toEqual({ mateusememe: "index.js" });
    expect(manifest.files).toEqual(["index.js", "card.json", "README.md"]);
    expect(manifest.dependencies).toBeUndefined();
  });
});
