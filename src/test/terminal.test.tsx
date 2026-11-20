import { describe, it, expect, vi, afterEach } from "vitest";
import { act, fireEvent, screen, waitFor, within } from "@testing-library/react";
import CommandPalette from "@/components/CommandPalette";
import Terminal from "@/components/Terminal";
import { experiences, profile, projects, talks } from "@/data/portfolio";
import { translations } from "@/i18n/translations";
import { complete, run } from "@/lib/terminal";
import { renderWithProviders } from "@/test/render";

const context = (language: "pt" | "en" | "es" = "en") => ({
  language,
  t: (key: string) => translations[key]?.[language] ?? key,
});

describe("terminal commands", () => {
  it("answer whoami, ls and cat from the portfolio data", () => {
    const whoami = run("whoami", context()).lines.map((line) => line.text);
    expect(whoami[0]).toBe(profile.name);
    expect(whoami[1]).toContain(experiences[0].company);

    const ls = run("ls talks", context("pt")).lines.map((line) => line.text);
    expect(ls).toHaveLength(talks.length);
    expect(ls[0]).toContain(talks[0].id);

    const cat = run("cat rinha-backend-2026-c", context("es")).lines.map((line) => line.text);
    expect(cat[1]).toBe(projects[0].desc.es.replace(/`/g, ""));
  });

  it("turn open, cv, email, theme, lang, clear and exit into actions", () => {
    expect(run("open find-the-fight", context()).action).toEqual({ type: "page", page: { kind: "project", id: "find-the-fight" } });
    expect(run("open git-infoeste-2022", context()).action).toEqual({ type: "page", page: { kind: "talk", id: "git-infoeste-2022" } });
    expect(run("open talks", context()).action).toEqual({ type: "section", id: "talks" });
    expect(run("open uses", context()).action).toEqual({ type: "page", page: { kind: "uses" } });
    expect(run("open github", context()).action).toEqual({ type: "external", url: "https://github.com/mateusememe" });
    expect(run("cv", context()).action).toEqual({ type: "cv" });
    expect(run("email", context()).action).toEqual({ type: "copy", text: "matt.mendon@gmail.com" });
    expect(run("THEME", context()).action).toEqual({ type: "theme" });
    expect(run("lang es", context()).action).toEqual({ type: "language", language: "es" });
    expect(run("clear", context()).action).toEqual({ type: "clear" });
    expect(run("exit", context()).action).toEqual({ type: "exit" });
  });

  it("explain errors in the page language", () => {
    expect(run("sudo rm -rf /", context("pt")).lines[0]).toEqual({ text: "comando não encontrado: sudo. Digite help.", tone: "error" });
    expect(run("open nowhere", context()).lines[0].tone).toBe("error");
    expect(run("lang fr", context("es")).lines[0].text).toBe("uso: lang <pt|en|es>");
  });

  it("complete commands, lists and ids with Tab", () => {
    expect(complete("wh")).toEqual({ value: "whoami ", options: [] });
    expect(complete("ls ta")).toEqual({ value: "ls talks ", options: [] });
    expect(complete("open rinha")).toEqual({ value: "open rinha-backend-2026-c ", options: [] });
    const many = complete("c");
    expect(many.options).toEqual(["cat", "cv", "clear"]);
    expect(many.value).toBe("c");
  });
});

describe("terminal panel", () => {
  afterEach(() => vi.restoreAllMocks());

  it("opens with Ctrl+`, runs commands with history and closes with Escape", async () => {
    renderWithProviders(<Terminal />, "en");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: "`", code: "Backquote", ctrlKey: true });
    const dialog = await screen.findByRole("dialog", { name: "Terminal" });
    const input = within(dialog).getByRole("textbox", { name: "Command" });
    await waitFor(() => expect(document.activeElement).toBe(input));

    fireEvent.change(input, { target: { value: "whoami" } });
    await act(async () => {
      fireEvent.submit(input.closest("form")!);
    });
    const log = within(dialog).getByRole("log");
    expect(log).toHaveTextContent("$ whoami");
    expect(log).toHaveTextContent(profile.name);

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input).toHaveValue("whoami");
    fireEvent.change(input, { target: { value: "ls pro" } });
    fireEvent.keyDown(input, { key: "Tab" });
    expect(input).toHaveValue("ls projects ");

    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens from the command palette", async () => {
    renderWithProviders(
      <>
        <CommandPalette />
        <Terminal />
      </>,
      "en",
    );
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const palette = await screen.findByRole("dialog", { name: "Command palette" });
    fireEvent.change(within(palette).getByRole("combobox"), { target: { value: "whoami" } });
    await act(async () => {
      fireEvent.keyDown(within(palette).getByRole("combobox"), { key: "Enter" });
    });
    expect(await screen.findByRole("dialog", { name: "Terminal" })).toBeInTheDocument();
  });
});
