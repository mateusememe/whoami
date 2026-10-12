// @vitest-environment node
import { describe, it, expect } from "vitest";
import { render } from "@/entry-server";
import { experiences, projects } from "@/data/portfolio";

// Runs without window/document/localStorage, like the build-time prerender.
describe("prerender (entry-server, Node)", () => {
  const html = render("/");

  it("renders the full page content to HTML", () => {
    expect(html).toContain("Mateus Mendonça Monteiro");
    for (const exp of experiences) expect(html).toContain(exp.company);
    for (const project of projects) expect(html).toContain(project.name);
  });

  it("renders in the default language (English) with visible sections", () => {
    expect(html).toContain("About Me");
    expect(html).not.toContain('data-visible="false"');
  });

  it("leaves the browser-only background out of the static HTML", () => {
    expect(html).not.toContain("<canvas");
    expect(html).not.toContain("webgl-background");
  });
});
