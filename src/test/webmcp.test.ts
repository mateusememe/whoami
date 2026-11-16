import { describe, it, expect, vi, afterEach } from "vitest";
import { createAgentTools, registerAgentTools } from "@/agents/webmcp";
import { NAV_ITEMS } from "@/data/navigation";
import { contributions, projects } from "@/data/portfolio";
import { PROJECT_PAGE_IDS } from "@/i18n/routes";

const options = { language: "en" as const, siteUrl: "https://example.test/whoami", goToSection: vi.fn() };
const run = async (name: string, input: Record<string, unknown> = {}) => {
  const tool = createAgentTools(options).find((item) => item.name === name);
  const result = (await tool!.execute(input)) as { content: Array<{ type: string; text: string }> };
  return result.content[0].text;
};

describe("WebMCP tools", () => {
  afterEach(() => {
    options.goToSection.mockClear();
    delete (document as unknown as { modelContext?: unknown }).modelContext;
  });

  it("describes four tools with JSON Schema inputs", () => {
    const tools = createAgentTools(options);
    expect(tools.map((tool) => tool.name)).toEqual(["get_profile", "list_projects", "get_contact", "go_to_section"]);
    for (const tool of tools) {
      expect(tool.description.length).toBeGreaterThan(20);
      expect(tool.inputSchema.type).toBe("object");
    }
  });

  it("get_profile returns Markdown by default and JSON Resume on request, in the asked language", async () => {
    expect(await run("get_profile")).toContain("## Experience");
    expect(await run("get_profile", { language: "pt" })).toContain("## Experiência");
    const resume = JSON.parse(await run("get_profile", { format: "json" }));
    expect(resume.basics.name).toBe("Mateus Mendonça Monteiro");
    expect(resume.work[0].startDate).toMatch(/^\d{4}-\d{2}$/);
  });

  it("list_projects returns every project and contribution", async () => {
    const data = JSON.parse(await run("list_projects"));
    expect(data.projects).toHaveLength(projects.length);
    expect(data.contributions).toHaveLength(contributions.length);
    expect(data.projects.find((project: { name: string }) => project.name === "lime.stability.imputation").repository).toBeNull();
    const withPage = data.projects.filter((project: { page: string | null }) => project.page);
    expect(withPage).toHaveLength(PROJECT_PAGE_IDS.length);
    expect(withPage[0].page).toBe(`https://example.test/whoami/projects/${PROJECT_PAGE_IDS[0]}/`);
    expect(withPage[0].details.length).toBeGreaterThan(0);
    const inPortuguese = JSON.parse(await run("list_projects", { language: "pt" }));
    expect(inPortuguese.projects.find((project: { page: string | null }) => project.page).page).toContain("/pt/projects/");
  });

  it("get_contact gives the email and no phone number", async () => {
    const text = await run("get_contact");
    const data = JSON.parse(text);
    expect(data.email).toBe("matt.mendon@gmail.com");
    expect(data.location.city).toBe("São Paulo");
    expect(text).not.toMatch(/\+55|phone|telephone/i);
  });

  it("go_to_section scrolls to known sections and rejects unknown ones", async () => {
    expect(await run("go_to_section", { section: "projects" })).toContain("projects");
    expect(options.goToSection).toHaveBeenCalledWith("projects");
    options.goToSection.mockClear();
    expect(await run("go_to_section", { section: "nope" })).toContain(NAV_ITEMS.join(", "));
    expect(options.goToSection).not.toHaveBeenCalled();
  });

  it("does nothing where the browser has no WebMCP", () => {
    expect(() => registerAgentTools(options)()).not.toThrow();
  });

  it("registers with document.modelContext and unregisters through an AbortSignal", () => {
    const signals: AbortSignal[] = [];
    const registerTool = vi.fn((_tool: unknown, init?: { signal?: AbortSignal }) => {
      if (init?.signal) signals.push(init.signal);
      return Promise.resolve();
    });
    (document as unknown as { modelContext: unknown }).modelContext = { registerTool };

    const unregister = registerAgentTools(options);
    expect(registerTool).toHaveBeenCalledTimes(4);
    expect(signals.every((signal) => !signal.aborted)).toBe(true);
    unregister();
    expect(signals.every((signal) => signal.aborted)).toBe(true);
  });

  it("survives a browser that rejects the registration", () => {
    (document as unknown as { modelContext: unknown }).modelContext = {
      registerTool: () => {
        throw new Error("unsupported shape");
      },
    };
    expect(() => registerAgentTools(options)).not.toThrow();
  });
});
