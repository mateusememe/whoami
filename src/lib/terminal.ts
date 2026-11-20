/**
 * The `whoami` terminal: a small shell over the portfolio data. Pure, so
 * it is tested without a browser: run() turns one input line into output
 * lines and, at most, one action for the panel to carry out (go to a page,
 * open a link, download the résumé…). complete() does Tab completion.
 *
 * Loaded with the terminal panel chunk, never with the main bundle; its
 * strings live here for the same reason.
 */
import { NAV_ITEMS, type SectionId } from "@/data/navigation";
import { contributions, experiences, profile, projects, socialLinks, talks } from "@/data/portfolio";
import { PROJECT_PAGE_IDS, TALK_PAGE_IDS, type Page } from "@/i18n/routes";
import type { Language } from "@/i18n/translations";
import { formatMonth } from "@/lib/dates";

export interface TerminalLine {
  text: string;
  tone?: "muted" | "signal" | "error" | "input";
}

export type TerminalAction =
  | { type: "page"; page: Page }
  | { type: "section"; id: SectionId }
  | { type: "external"; url: string }
  | { type: "cv" }
  | { type: "copy"; text: string }
  | { type: "theme" }
  | { type: "language"; language: Language }
  | { type: "clear" }
  | { type: "exit" };

export interface TerminalResult {
  lines: TerminalLine[];
  action?: TerminalAction;
}

const TEXT: Record<Language, Record<string, string>> = {
  en: {
    welcome: "whoami terminal. Type help to list the commands; Esc closes.",
    notFound: "command not found: {cmd}. Type help.",
    noSuch: "{cmd}: no such entry: {arg}. Try ls {list}.",
    usage: "usage: {usage}",
    help: "help: this list",
    whoami: "whoami: who I am",
    ls: "ls [projects|talks|experience|sections|pages]: list things",
    cat: "cat <id|about>: show a project, a talk or the summary",
    open: "open <id|section|page|github|linkedin>: go there",
    cv: "cv: download the résumé (PDF)",
    email: "email: copy the email address",
    theme: "theme: switch light and dark",
    lang: "lang <pt|en|es>: switch language",
    clear: "clear: clear the screen",
    exit: "exit: close the terminal",
    copied: "copied to the clipboard",
    downloading: "downloading the résumé…",
    opening: "opening {target}…",
    switching: "switching to {lang}…",
    theme_done: "theme switched",
    lists: "lists: projects, talks, experience, sections, pages",
    tip: "tip: open <id> goes to the page; Tab completes.",
  },
  pt: {
    welcome: "terminal whoami. Digite help para ver os comandos; Esc fecha.",
    notFound: "comando não encontrado: {cmd}. Digite help.",
    noSuch: "{cmd}: nada com o nome {arg}. Tente ls {list}.",
    usage: "uso: {usage}",
    help: "help: esta lista",
    whoami: "whoami: quem sou",
    ls: "ls [projects|talks|experience|sections|pages]: lista itens",
    cat: "cat <id|about>: mostra um projeto, uma palestra ou o resumo",
    open: "open <id|seção|página|github|linkedin>: vai até lá",
    cv: "cv: baixa o currículo (PDF)",
    email: "email: copia o endereço de e-mail",
    theme: "theme: alterna claro e escuro",
    lang: "lang <pt|en|es>: troca o idioma",
    clear: "clear: limpa a tela",
    exit: "exit: fecha o terminal",
    copied: "copiado para a área de transferência",
    downloading: "baixando o currículo…",
    opening: "abrindo {target}…",
    switching: "trocando para {lang}…",
    theme_done: "tema alternado",
    lists: "listas: projects, talks, experience, sections, pages",
    tip: "dica: open <id> abre a página; Tab completa.",
  },
  es: {
    welcome: "terminal whoami. Escribe help para ver los comandos; Esc cierra.",
    notFound: "comando no encontrado: {cmd}. Escribe help.",
    noSuch: "{cmd}: nada con el nombre {arg}. Prueba ls {list}.",
    usage: "uso: {usage}",
    help: "help: esta lista",
    whoami: "whoami: quién soy",
    ls: "ls [projects|talks|experience|sections|pages]: lista elementos",
    cat: "cat <id|about>: muestra un proyecto, una charla o el resumen",
    open: "open <id|sección|página|github|linkedin>: va allí",
    cv: "cv: descarga el currículum (PDF)",
    email: "email: copia la dirección de email",
    theme: "theme: alterna claro y oscuro",
    lang: "lang <pt|en|es>: cambia el idioma",
    clear: "clear: limpia la pantalla",
    exit: "exit: cierra el terminal",
    copied: "copiado al portapapeles",
    downloading: "descargando el currículum…",
    opening: "abriendo {target}…",
    switching: "cambiando a {lang}…",
    theme_done: "tema cambiado",
    lists: "listas: projects, talks, experience, sections, pages",
    tip: "tip: open <id> abre la página; Tab completa.",
  },
};

export const COMMANDS = ["help", "whoami", "ls", "cat", "open", "cv", "email", "theme", "lang", "clear", "exit"] as const;
const LISTS = ["projects", "talks", "experience", "sections", "pages"] as const;
const PAGES = ["now", "uses"] as const;
const LANGUAGE_CODES: Language[] = ["pt", "en", "es"];
const LANGUAGE_NAMES: Record<Language, string> = { pt: "Português", en: "English", es: "Español" };

export interface TerminalContext {
  language: Language;
  /** Localized strings the shell borrows from the site (summary, section names, role labels). */
  t: (key: string) => string;
}

const say = (language: Language, key: string, params: Record<string, string> = {}) =>
  TEXT[language][key].replace(/\{(\w+)\}/g, (match, name: string) => params[name] ?? match);

const plain = (text: string) => text.replace(/`/g, "");
const mail = socialLinks.find((link) => link.href.startsWith("mailto:"));
const profileLink = (name: string) => socialLinks.find((link) => link.label.toLowerCase().includes(name))?.href;

export function welcome(language: Language): TerminalLine[] {
  return [{ text: say(language, "welcome"), tone: "muted" }];
}

/** Runs one input line. */
export function run(input: string, { language, t }: TerminalContext): TerminalResult {
  const [command = "", ...args] = input.trim().split(/\s+/);
  const arg = args.join(" ").toLowerCase();
  const name = command.toLowerCase();

  switch (name) {
    case "":
      return { lines: [] };

    case "help":
      return {
        lines: [...COMMANDS.map((item) => ({ text: say(language, item) })), { text: say(language, "tip"), tone: "muted" }],
      };

    case "whoami": {
      const role = experiences.find((item) => item.period.en.endsWith("Present"));
      return {
        lines: [
          { text: profile.name, tone: "signal" },
          { text: `${t("hero.title")}${role ? ` · ${role.role[language]} @ ${role.company}` : ""}` },
          { text: `${profile.city}, ${profile.region}`, tone: "muted" },
          { text: t("hero.summary") },
        ],
      };
    }

    case "ls":
      switch (arg) {
        case "":
          return { lines: [{ text: LISTS.join("  ") }, { text: say(language, "tip"), tone: "muted" }] };
        case "projects":
          return {
            lines: projects
              .filter((item) => PROJECT_PAGE_IDS.includes(item.id))
              .map((item) => ({ text: `${item.id.padEnd(30)} ${item.year}  ${item.language ?? ""}`.trimEnd() })),
          };
        case "talks":
          return { lines: talks.map((item) => ({ text: `${item.id.padEnd(30)} ${formatMonth(item.date, language)}` })) };
        case "experience":
          return {
            lines: experiences.map((item) => ({ text: `${item.period[language].padEnd(22)} ${item.company} · ${item.role[language]}` })),
          };
        case "sections":
          return { lines: [{ text: NAV_ITEMS.join("  ") }] };
        case "pages":
          return { lines: [{ text: PAGES.join("  ") }] };
        default:
          return { lines: [{ text: say(language, "lists"), tone: "error" }] };
      }

    case "cat": {
      if (!arg) return { lines: [{ text: say(language, "usage", { usage: "cat <id|about>" }), tone: "error" }] };
      if (arg === "about") return { lines: [{ text: t("about.text") }] };
      const project = projects.find((item) => item.id === arg);
      if (project) {
        return {
          lines: [
            { text: project.name, tone: "signal" },
            { text: plain(project.desc[language]) },
            ...(project.tech?.length ? [{ text: project.tech.join(" · "), tone: "muted" as const }] : []),
            ...(project.githubUrl ? [{ text: project.githubUrl, tone: "muted" as const }] : []),
          ],
        };
      }
      const talk = talks.find((item) => item.id === arg);
      if (talk) {
        return {
          lines: [
            { text: talk.title, tone: "signal" },
            { text: `${talk.event[language]} · ${formatMonth(talk.date, language)}`, tone: "muted" },
            { text: talk.desc[language] },
          ],
        };
      }
      const contribution = contributions.find((item) => item.id === arg || item.repo.toLowerCase() === arg);
      if (contribution) {
        return {
          lines: [
            { text: contribution.repo, tone: "signal" },
            { text: plain(contribution.desc[language]) },
            { text: contribution.url, tone: "muted" },
          ],
        };
      }
      return { lines: [{ text: say(language, "noSuch", { cmd: "cat", arg, list: "projects" }), tone: "error" }] };
    }

    case "open": {
      if (!arg) return { lines: [{ text: say(language, "usage", { usage: "open <id|section|page>" }), tone: "error" }] };
      const opening = (target: string) => [{ text: say(language, "opening", { target }), tone: "muted" as const }];
      if (PROJECT_PAGE_IDS.includes(arg)) return { lines: opening(arg), action: { type: "page", page: { kind: "project", id: arg } } };
      if (TALK_PAGE_IDS.includes(arg)) return { lines: opening(arg), action: { type: "page", page: { kind: "talk", id: arg } } };
      if ((NAV_ITEMS as readonly string[]).includes(arg)) return { lines: opening(`#${arg}`), action: { type: "section", id: arg as SectionId } };
      if ((PAGES as readonly string[]).includes(arg)) {
        return { lines: opening(`/${arg}`), action: { type: "page", page: { kind: arg as (typeof PAGES)[number] } } };
      }
      const external = arg === "github" || arg === "linkedin" ? profileLink(arg) : undefined;
      if (external) return { lines: opening(external), action: { type: "external", url: external } };
      const project = projects.find((item) => item.id === arg && (item.githubUrl || item.liveUrl));
      if (project) {
        const url = project.githubUrl ?? project.liveUrl ?? "";
        return { lines: opening(url), action: { type: "external", url } };
      }
      return { lines: [{ text: say(language, "noSuch", { cmd: "open", arg, list: "projects" }), tone: "error" }] };
    }

    case "cv":
      return { lines: [{ text: say(language, "downloading"), tone: "muted" }], action: { type: "cv" } };

    case "email": {
      if (!mail) return { lines: [] };
      const address = mail.href.replace("mailto:", "");
      return {
        lines: [{ text: address, tone: "signal" }, { text: say(language, "copied"), tone: "muted" }],
        action: { type: "copy", text: address },
      };
    }

    case "theme":
      return { lines: [{ text: say(language, "theme_done"), tone: "muted" }], action: { type: "theme" } };

    case "lang": {
      const code = arg as Language;
      if (!LANGUAGE_CODES.includes(code)) return { lines: [{ text: say(language, "usage", { usage: "lang <pt|en|es>" }), tone: "error" }] };
      return {
        lines: [{ text: say(code, "switching", { lang: LANGUAGE_NAMES[code] }), tone: "muted" }],
        action: { type: "language", language: code },
      };
    }

    case "clear":
      return { lines: [], action: { type: "clear" } };

    case "exit":
      return { lines: [], action: { type: "exit" } };

    default:
      return { lines: [{ text: say(language, "notFound", { cmd: command }), tone: "error" }] };
  }
}

/** Completes the last word of `input` (a command, a list name or an id). Returns the input unchanged when ambiguous. */
export function complete(input: string): { value: string; options: string[] } {
  const parts = input.split(/\s+/);
  const word = (parts.at(-1) ?? "").toLowerCase();
  const command = parts[0]?.toLowerCase();
  const candidates: readonly string[] =
    parts.length <= 1
      ? COMMANDS
      : command === "ls"
        ? LISTS
        : command === "lang"
          ? LANGUAGE_CODES
          : command === "cat"
            ? ["about", ...projects.map((item) => item.id), ...talks.map((item) => item.id), ...contributions.map((item) => item.id)]
            : command === "open"
              ? [...PROJECT_PAGE_IDS, ...TALK_PAGE_IDS, ...NAV_ITEMS, ...PAGES, "github", "linkedin"]
              : [];
  const options = candidates.filter((item) => item.startsWith(word));
  if (options.length === 0) return { value: input, options };
  // The longest prefix every option shares.
  const shared = options.reduce((prefix, item) => {
    let length = 0;
    while (length < prefix.length && prefix[length] === item[length]) length++;
    return prefix.slice(0, length);
  });
  const done = options.length === 1 ? `${shared} ` : shared;
  return { value: [...parts.slice(0, -1), done].join(" "), options: options.length === 1 ? [] : options };
}
