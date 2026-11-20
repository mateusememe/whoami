import { useCallback, useEffect, useRef, useState } from "react";
import { PALETTE_EVENT } from "@/lib/commands";
import { lazyParts, loadCommandPalette } from "@/lib/lazy";
import { trackEvent } from "@/lib/analytics";

/**
 * Keyboard-first navigation, in the voice of the `$ whoami` prompt. Opens
 * with ⌘K / Ctrl+K or "/", and from the header button. Lists the sections,
 * the project pages, the talks, a few actions (copy the email, switch theme
 * or language) and the public profiles.
 *
 * This part is in the main bundle and only listens; the panel is a lazy
 * chunk. Nothing but the status region renders until the palette opens, so
 * the prerendered HTML and the first client render agree.
 */
const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const show = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    trackEvent("palette-open");
    loadCommandPalette().then(() => setOpen(true));
  }, []);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) returnFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) close(true);
        else show();
      } else if (event.key === "/" && !typing && !open) {
        event.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_EVENT, show);
    };
  }, [open, show, close]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <>
      {open && lazyParts.palettePanel && <lazyParts.palettePanel onClose={close} onToast={setToast} />}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[61] flex justify-center px-4">
        {toast && <p className="palette-toast glass-card rounded-full px-5 py-2.5 font-mono text-xs text-foreground">{toast}</p>}
      </div>
    </>
  );
};

export default CommandPalette;
