import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  ArrowUp,
  ArrowUpRight,
  Braces,
  FileDown,
  Bot,
  Code2,
  Copy,
  CornerDownLeft,
  FolderGit2,
  Hash,
  Languages,
  Moon,
  Presentation,
  Search,
  type LucideIcon,
} from "lucide-react";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { NAV_ITEMS } from "@/data/navigation";
import { projects, socialLinks, talks } from "@/data/portfolio";
import { useSiteNavigation } from "@/hooks/useSiteNavigation";
import { useTheme } from "@/hooks/useTheme";
import { LANGUAGES, PROJECT_PAGE_IDS, pagePath } from "@/i18n/routes";
import { CV_FILES, RESUME_FILES } from "@/seo/files";
import { SOURCE_REPO_URL } from "@/seo/site";
import { scrollToTarget, setScrollLocked } from "@/motion/scroll";
import { runViewTransition } from "@/motion/viewTransition";
import { filterCommands } from "@/lib/commands";
import { cn } from "@/lib/utils";

type Group = "sections" | "projects" | "talks" | "actions" | "links";

const GROUPS: Array<{ id: Group; key: string }> = [
  { id: "sections", key: "palette.groupSections" },
  { id: "projects", key: "palette.groupProjects" },
  { id: "talks", key: "palette.groupTalks" },
  { id: "actions", key: "palette.groupActions" },
  { id: "links", key: "palette.groupLinks" },
];

interface Command {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  /** Extra words that match the search but are not shown. */
  keywords?: string;
  icon: LucideIcon;
  external?: boolean;
  run: () => void;
}

const LANGUAGE_NAMES: Record<Language, string> = { pt: "Português", en: "English", es: "Español" };

const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

export interface CommandPalettePanelProps {
  /** Closes the panel; `restoreFocus` gives focus back to where it was before opening. */
  onClose: (restoreFocus: boolean) => void;
  /** Shows a short confirmation after the panel closes. */
  onToast: (message: string) => void;
}

/**
 * The open command palette: search field, grouped commands, keyboard
 * navigation. A lazy chunk, loaded the first time the palette opens
 * (CommandPalette.tsx holds the shortcut and the open state).
 */
const CommandPalettePanel = ({ onClose, onToast }: CommandPalettePanelProps) => {
  const { language, setLanguage, t } = useLanguage();
  const { goToSection, openProject, onHome, homePath } = useSiteNavigation();
  const { toggle } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  useEffect(() => {
    setScrollLocked(true);
    inputRef.current?.focus();
    return () => setScrollLocked(false);
  }, []);

  const commands = useMemo<Command[]>(() => {
    const mail = socialLinks.find((link) => link.href.startsWith("mailto:"));
    const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
    const list: Command[] = [
      {
        id: "top",
        group: "sections",
        label: t("palette.top"),
        hint: "~/whoami",
        icon: ArrowUp,
        run: () => (onHome ? scrollToTarget(0) : navigate(homePath)),
      },
      ...NAV_ITEMS.map(
        (id): Command => ({
          id: `section-${id}`,
          group: "sections",
          label: t(`nav.${id}`),
          hint: `#${id}`,
          keywords: id,
          icon: Hash,
          run: () => goToSection(id),
        }),
      ),
      ...projects
        .filter((project) => PROJECT_PAGE_IDS.includes(project.id))
        .map(
          (project): Command => ({
            id: `project-${project.id}`,
            group: "projects",
            label: project.name,
            hint: [project.language, project.year].filter(Boolean).join(" · "),
            keywords: (project.tech ?? []).join(" "),
            icon: FolderGit2,
            run: () => openProject(project.id),
          }),
        ),
      ...projects
        .filter((project) => !PROJECT_PAGE_IDS.includes(project.id) && (project.githubUrl || project.liveUrl))
        .map(
          (project): Command => ({
            id: `repo-${project.id}`,
            group: "projects",
            label: project.name,
            hint: "GitHub",
            keywords: (project.tech ?? []).join(" "),
            icon: ArrowUpRight,
            external: true,
            run: () => openExternal(project.githubUrl ?? project.liveUrl ?? ""),
          }),
        ),
      ...talks.map(
        (talk): Command => ({
          id: `talk-${talk.id}`,
          group: "talks",
          label: talk.title,
          hint: talk.event[language],
          keywords: `${talk.tech.join(" ")} ${t(`talks.${talk.kind}`)}`,
          icon: Presentation,
          run: () => navigate(pagePath(language, { kind: "talk", id: talk.id })),
        }),
      ),
      ...(mail
        ? [
            {
              id: "copy-email",
              group: "actions" as const,
              label: t("palette.copyEmail"),
              hint: mail.displayText,
              keywords: "email mail contato contact",
              icon: Copy,
              run: () => {
                navigator.clipboard
                  ?.writeText(mail.displayText ?? mail.href.replace("mailto:", ""))
                  .then(() => onToast(t("palette.copied")))
                  .catch(() => (window.location.href = mail.href));
              },
            },
          ]
        : []),
      {
        id: "theme",
        group: "actions",
        label: t("palette.theme"),
        keywords: "dark light escuro claro oscuro",
        icon: Moon,
        run: () => toggle(),
      },
      ...LANGUAGES.filter((code) => code !== language).map(
        (code): Command => ({
          id: `lang-${code}`,
          group: "actions",
          label: t("palette.language", { lang: LANGUAGE_NAMES[code] }),
          hint: code.toUpperCase(),
          keywords: "idioma language lenguaje",
          icon: Languages,
          run: () => runViewTransition(() => flushSync(() => setLanguage(code))),
        }),
      ),
      {
        id: "cv",
        group: "actions",
        label: t("palette.cv"),
        hint: "PDF",
        keywords: "cv resume curriculo curriculum pdf download baixar descargar",
        icon: FileDown,
        external: true,
        run: () => openExternal(`${base}${CV_FILES[language]}`),
      },
      {
        id: "resume",
        group: "actions",
        label: t("palette.resume"),
        hint: RESUME_FILES[language],
        keywords: "cv resume curriculo json",
        icon: Braces,
        external: true,
        run: () => openExternal(`${base}${RESUME_FILES[language]}`),
      },
      {
        id: "llms",
        group: "actions",
        label: t("palette.llms"),
        hint: "llms.txt",
        keywords: "ai agent llm",
        icon: Bot,
        external: true,
        run: () => openExternal(`${base}llms.txt`),
      },
      {
        id: "source",
        group: "actions",
        label: t("palette.source"),
        hint: "GitHub",
        keywords: "source codigo code",
        icon: Code2,
        external: true,
        run: () => openExternal(SOURCE_REPO_URL),
      },
      ...socialLinks
        .filter((link) => !link.href.startsWith("mailto:"))
        .map(
          (link): Command => ({
            id: `link-${link.iconName}`,
            group: "links",
            label: link.label,
            hint: link.displayText,
            icon: ArrowUpRight,
            external: true,
            run: () => openExternal(link.href),
          }),
        ),
    ];
    return list;
  }, [t, language, onHome, homePath, navigate, goToSection, openProject, toggle, setLanguage, onToast]);

  const results = useMemo(() => filterCommands(commands, query), [commands, query]);
  const ordered = useMemo(() => GROUPS.flatMap((group) => results.filter((command) => command.group === group.id)), [results]);
  const activeCommand = ordered[Math.min(active, ordered.length - 1)];

  useEffect(() => setActive(0), [query]);

  // Keep the active option in view.
  useEffect(() => {
    if (!activeCommand) return;
    const option = listRef.current?.querySelector<HTMLElement>(`[data-command="${activeCommand.id}"]`);
    option?.scrollIntoView?.({ block: "nearest" });
  }, [activeCommand]);

  const runCommand = (command: Command) => {
    // External links keep the page where it was, so focus goes back to the opener.
    onClose(!!command.external);
    // Unlock before running: restarting Lenis later (on unmount) would cancel a scroll already under way.
    setScrollLocked(false);
    command.run();
  };

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (ordered.length ? (index + 1) % ordered.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (ordered.length ? (index - 1 + ordered.length) % ordered.length : 0));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(Math.max(ordered.length - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeCommand) runCommand(activeCommand);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose(true);
    } else if (event.key === "Tab") {
      // Single focus stop: the input. The list is driven by the arrow keys.
      event.preventDefault();
    }
  };

  const optionId = (command: Command) => `${baseId}-${command.id}`;
  const listId = `${baseId}-list`;

  return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center px-3 pt-[12svh] sm:px-6" data-lenis-prevent>
          <div aria-hidden="true" className="palette-backdrop absolute inset-0 bg-background/70 backdrop-blur-md" onClick={() => onClose(true)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("palette.title")}
            className="palette-panel glass-card relative flex max-h-[min(34rem,76svh)] w-full max-w-xl flex-col overflow-hidden rounded-[1.5rem]"
            style={{ "--surface-blur": "24px" } as CSSProperties}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-border/60 px-4 sm:px-5">
              <span aria-hidden="true" className="font-mono text-sm text-signal">
                $
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("palette.placeholder")}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={activeCommand ? optionId(activeCommand) : undefined}
                aria-autocomplete="list"
                aria-label={t("palette.title")}
                autoComplete="off"
                spellCheck={false}
                className="h-14 min-w-0 flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
              />
              <Search size={15} aria-hidden="true" className="shrink-0 text-muted-foreground" />
            </div>

            <div ref={listRef} id={listId} role="listbox" aria-label={t("palette.title")} className="flex-1 overflow-y-auto overscroll-contain p-2">
              {ordered.length === 0 && (
                <p className="px-3 py-8 text-center font-mono text-xs text-muted-foreground">
                  {t("palette.empty", { query })}
                </p>
              )}
              {GROUPS.map((group) => {
                const items = ordered.filter((command) => command.group === group.id);
                if (items.length === 0) return null;
                const headingId = `${baseId}-${group.id}`;
                return (
                  <div key={group.id} role="group" aria-labelledby={headingId} className="pb-1">
                    <p id={headingId} className="label px-3 pb-1.5 pt-3">
                      {t(group.key)}
                    </p>
                    {items.map((command) => {
                      const selected = command === activeCommand;
                      const Icon = command.icon;
                      return (
                        <div
                          key={command.id}
                          id={optionId(command)}
                          data-command={command.id}
                          role="option"
                          aria-selected={selected}
                          onMouseMove={() => !selected && setActive(ordered.indexOf(command))}
                          onClick={() => runCommand(command)}
                          className={cn(
                            "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-fast",
                            selected ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground",
                          )}
                        >
                          <Icon size={15} aria-hidden="true" className={cn("shrink-0", selected && "text-signal")} />
                          <span className="min-w-0 flex-1 truncate text-sm">{command.label}</span>
                          {command.hint && (
                            <span className="hidden max-w-[45%] truncate font-mono text-[11px] text-muted-foreground sm:block">
                              {command.hint}
                            </span>
                          )}
                          {selected && <CornerDownLeft size={13} aria-hidden="true" className="shrink-0 text-muted-foreground" />}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <p className="hidden border-t border-border/60 px-5 py-2.5 font-mono text-[11px] text-muted-foreground sm:block">
              {t("palette.hint")}
            </p>
          </div>
        </div>
  );
};

export default CommandPalettePanel;
