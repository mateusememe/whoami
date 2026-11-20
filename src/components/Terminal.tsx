import { useCallback, useEffect, useRef, useState } from "react";
import { TERMINAL_EVENT } from "@/lib/commands";
import { lazyParts, loadTerminal } from "@/lib/lazy";
import { trackEvent } from "@/lib/analytics";

/**
 * Opens the whoami terminal with Ctrl+` (or ⌃` on a Mac) and from the
 * command palette. Only the listener is in the main bundle; the panel is a
 * lazy chunk, and nothing renders until it opens, so the prerendered HTML
 * and the first client render agree.
 */
const Terminal = () => {
  const [open, setOpen] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);

  const show = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    trackEvent("terminal-open");
    loadTerminal().then(() => setOpen(true));
  }, []);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) returnFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && (event.key === "`" || event.code === "Backquote")) {
        event.preventDefault();
        if (open) close(true);
        else show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(TERMINAL_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(TERMINAL_EVENT, show);
    };
  }, [open, show, close]);

  return open && lazyParts.terminalPanel ? <lazyParts.terminalPanel onClose={close} /> : null;
};

export default Terminal;
