import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteNavigation } from "@/hooks/useSiteNavigation";
import { useTheme } from "@/hooks/useTheme";
import { usePageText } from "@/i18n/pageText";
import { pagePath } from "@/i18n/routes";
import { complete, run, welcome, type TerminalAction, type TerminalLine } from "@/lib/terminal";
import { setScrollLocked } from "@/motion/scroll";
import { CV_FILES } from "@/seo/files";

export interface TerminalPanelProps {
  /** Closes the panel; `restoreFocus` gives focus back to where it was before opening. */
  onClose: (restoreFocus: boolean) => void;
}

const TONES: Record<NonNullable<TerminalLine["tone"]> | "plain", string> = {
  plain: "text-foreground",
  muted: "text-muted-foreground",
  signal: "text-signal",
  // Errors keep full contrast; the "!" marks them (the red tokens fall below 4.5:1 here).
  error: "text-foreground",
  input: "text-muted-foreground",
};

/**
 * The terminal itself: an output log and one input line. Commands come
 * from src/lib/terminal.ts; this component only carries out their actions.
 * Full screen on phones, a window on larger screens.
 */
const TerminalPanel = ({ onClose }: TerminalPanelProps) => {
  const { language, setLanguage } = useLanguage();
  const t = usePageText();
  const { goToSection } = useSiteNavigation();
  const { toggle } = useTheme();
  const navigate = useNavigate();
  const [lines, setLines] = useState<TerminalLine[]>(() => welcome(language));
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  useEffect(() => {
    setScrollLocked(true);
    inputRef.current?.focus();
    return () => setScrollLocked(false);
  }, []);

  // Keep the newest line in view.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [lines]);

  const leaveTo = (go: () => void) => {
    // Unlock first: restarting Lenis on unmount would cancel a scroll already under way.
    setScrollLocked(false);
    onClose(false);
    go();
  };

  const act = (action: TerminalAction) => {
    switch (action.type) {
      case "page":
        return leaveTo(() => navigate(pagePath(language, action.page)));
      case "section":
        return leaveTo(() => goToSection(action.id));
      case "external":
        window.open(action.url, "_blank", "noopener,noreferrer");
        return;
      case "cv": {
        const link = document.createElement("a");
        link.href = `${import.meta.env.BASE_URL}${CV_FILES[language]}`;
        link.download = CV_FILES[language].split("/").pop() ?? "";
        link.click();
        return;
      }
      case "copy":
        navigator.clipboard?.writeText(action.text).catch(() => undefined);
        return;
      case "theme":
        return toggle();
      case "language":
        return setLanguage(action.language);
      case "clear":
        return setLines([]);
      case "exit":
        return onClose(true);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const input = value;
    setValue("");
    if (input.trim()) history.current.unshift(input);
    cursor.current = -1;
    const result = run(input, { language, t });
    setLines((current) => [...current, { text: `$ ${input}`, tone: "input" }, ...result.lines]);
    if (result.action) act(result.action);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose(true);
    } else if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      const { value: next, options } = complete(value);
      setValue(next);
      if (options.length > 1) setLines((current) => [...current, { text: options.join("  "), tone: "muted" }]);
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const step = event.key === "ArrowUp" ? 1 : -1;
      cursor.current = Math.max(-1, Math.min(history.current.length - 1, cursor.current + step));
      setValue(cursor.current === -1 ? "" : history.current[cursor.current]);
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-stretch justify-center sm:items-center sm:p-6" data-lenis-prevent>
      <div aria-hidden="true" className="palette-backdrop absolute inset-0 bg-background/70 backdrop-blur-md" onClick={() => onClose(true)} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("terminal.title")}
        className="palette-panel relative flex h-full w-full flex-col overflow-hidden bg-card shadow-2xl sm:h-[min(70vh,40rem)] sm:max-w-3xl sm:rounded-[1.25rem] sm:border sm:border-border"
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/70 pl-4 pr-1.5">
          <p className="font-mono text-xs text-muted-foreground">mateus@whoami: ~</p>
          <button
            type="button"
            onClick={() => onClose(true)}
            aria-label={t("terminal.close")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors duration-base hover:text-foreground"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label={t("terminal.output")}
          className="flex-1 overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, index) => (
            <p key={index} className={`whitespace-pre-wrap [overflow-wrap:anywhere] ${TONES[line.tone ?? "plain"]}`}>
              {line.tone === "error" ? `! ${line.text}` : line.text}
            </p>
          ))}
        </div>

        <form onSubmit={submit} className="flex h-14 shrink-0 items-center gap-2.5 border-t border-border/70 px-4">
          <label htmlFor={inputId} className="sr-only">
            {t("terminal.command")}
          </label>
          <span aria-hidden="true" className="font-mono text-signal">
            $
          </span>
          <input
            ref={inputRef}
            id={inputId}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            className="h-10 min-w-0 flex-1 bg-transparent font-mono text-base text-foreground outline-none placeholder:text-muted-foreground sm:text-sm"
            placeholder="help"
          />
        </form>
      </div>
    </div>
  );
};

export default TerminalPanel;
