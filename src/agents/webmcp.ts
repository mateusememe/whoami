/**
 * WebMCP tools: functions an in-browser AI agent can call instead of
 * scraping the page (https://github.com/webmachinelearning/webmcp).
 *
 * The API is experimental. In Chrome it is `document.modelContext` behind a
 * flag or origin trial; older drafts used `navigator.modelContext`. Both are
 * feature-detected, and every call is guarded, so the page behaves the same
 * where the API does not exist.
 *
 * The tools return the same content as the static agent files (llms.txt,
 * the Markdown profiles, JSON Resume), from the same data module.
 */
import { NAV_ITEMS, type SectionId } from "@/data/navigation";
import { contributions, projects, profile, socialLinks, spokenLanguages } from "@/data/portfolio";
import type { Language } from "@/i18n/translations";

interface AgentTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: Record<string, unknown>) => unknown | Promise<unknown>;
}

interface ModelContext {
  registerTool: (tool: AgentTool, options?: { signal?: AbortSignal }) => unknown;
}

export interface AgentToolsOptions {
  /** Language the page is showing; the default for tools that take one. */
  language: Language;
  /** Absolute URL of the site root, without a trailing slash. */
  siteUrl: string;
  /** Scrolls the page to a section. */
  goToSection: (id: SectionId) => void;
}

const LANGUAGE_CODES: Language[] = ["en", "pt", "es"];

function modelContext(): ModelContext | null {
  if (typeof document === "undefined") return null;
  const candidates = [
    (document as unknown as { modelContext?: ModelContext }).modelContext,
    (navigator as unknown as { modelContext?: ModelContext }).modelContext,
  ];
  return candidates.find((candidate) => candidate && typeof candidate.registerTool === "function") ?? null;
}

/** MCP-style result: one block of text. */
const text = (value: string) => ({ content: [{ type: "text", text: value }] });

const pickLanguage = (input: Record<string, unknown>, fallback: Language): Language =>
  LANGUAGE_CODES.includes(input.language as Language) ? (input.language as Language) : fallback;

/** The tools, as plain data. Exported so tests can call `execute` directly. */
export function createAgentTools({ language, siteUrl, goToSection }: AgentToolsOptions): AgentTool[] {
  const languageProperty = {
    type: "string",
    enum: LANGUAGE_CODES,
    description: "Language of the answer. Defaults to the language the page is showing.",
  };

  return [
    {
      name: "get_profile",
      description: `Returns the full professional profile of ${profile.name}: summary, experience, education, skills, projects, open-source contributions and contact. Use format "markdown" to read it or "json" for JSON Resume (jsonresume.org) with ISO dates.`,
      inputSchema: {
        type: "object",
        properties: {
          language: languageProperty,
          format: { type: "string", enum: ["markdown", "json"], description: 'Defaults to "markdown".' },
        },
      },
      annotations: { readOnlyHint: true },
      execute: async (input) => {
        const chosen = pickLanguage(input, language);
        if (input.format === "json") {
          const { buildResume } = await import("@/seo/resume");
          return text(JSON.stringify(buildResume(chosen, siteUrl), null, 2));
        }
        const { renderProfileMarkdown } = await import("@/seo/llms");
        return text(renderProfileMarkdown(chosen, siteUrl));
      },
    },
    {
      name: "list_projects",
      description: `Lists the software projects of ${profile.name} and the pull requests merged into other people's repositories, with descriptions, technologies, GitHub stars and URLs.`,
      inputSchema: { type: "object", properties: { language: languageProperty } },
      annotations: { readOnlyHint: true },
      execute: (input) => {
        const chosen = pickLanguage(input, language);
        return text(
          JSON.stringify(
            {
              projects: projects.map((project) => ({
                name: project.name,
                description: project.desc[chosen],
                technologies: project.tech ?? [],
                language: project.language,
                stars: project.stars ?? 0,
                repository: project.githubUrl ?? null,
                website: project.liveUrl ?? null,
              })),
              contributions: contributions.map((item) => ({
                repository: item.repo,
                description: item.desc[chosen],
                technologies: item.tech,
                merged: item.merged,
                url: item.url,
              })),
            },
            null,
            2,
          ),
        );
      },
    },
    {
      name: "get_contact",
      description: `Returns how to reach ${profile.name}: email, professional profiles, location and spoken languages. Email is the preferred channel for professional contact.`,
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true },
      execute: () => {
        const mail = socialLinks.find((link) => link.href.startsWith("mailto:"));
        return text(
          JSON.stringify(
            {
              name: profile.name,
              email: mail?.href.replace("mailto:", "") ?? null,
              location: { city: profile.city, region: profile.region, countryCode: profile.countryCode },
              spokenLanguages: spokenLanguages.map((item) => ({ code: item.code, level: item.level.en })),
              profiles: socialLinks
                .filter((link) => !link.href.startsWith("mailto:"))
                .map((link) => ({ network: link.label, url: link.href })),
            },
            null,
            2,
          ),
        );
      },
    },
    {
      name: "go_to_section",
      description: "Scrolls the page to one of its sections, so the user sees it.",
      inputSchema: {
        type: "object",
        properties: { section: { type: "string", enum: [...NAV_ITEMS], description: "Section to show." } },
        required: ["section"],
      },
      execute: (input) => {
        const section = input.section as SectionId;
        if (!NAV_ITEMS.includes(section)) return text(`Unknown section. Use one of: ${NAV_ITEMS.join(", ")}.`);
        goToSection(section);
        return text(`Scrolled to the ${section} section.`);
      },
    },
  ];
}

/**
 * Registers the tools with the browser, when it has WebMCP. Returns a
 * function that unregisters them (used before registering again with a new
 * language, since tool names must be unique).
 */
export function registerAgentTools(options: AgentToolsOptions): () => void {
  const context = modelContext();
  if (!context) return () => undefined;

  const controller = new AbortController();
  for (const tool of createAgentTools(options)) {
    try {
      // Returns a promise in current Chrome; a rejection (e.g. duplicate name) is not fatal.
      Promise.resolve(context.registerTool(tool, { signal: controller.signal })).catch(() => undefined);
    } catch {
      // Older or newer drafts of the API may reject this shape. The page works without tools.
    }
  }
  return () => controller.abort();
}
