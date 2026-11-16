import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Command, Menu, Moon, Sun, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { IconButton } from "@/components/ds";
import { Magnetic } from "@/components/motion/Magnetic";
import { Scramble } from "@/components/motion/Scramble";
import ScrollProgress from "@/components/ScrollProgress";
import { openCommandPalette } from "@/lib/commands";
import { loadCommandPalette } from "@/lib/lazy";
import { NAV_ITEMS } from "@/data/navigation";
import { socialLinks } from "@/data/portfolio";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useSiteNavigation } from "@/hooks/useSiteNavigation";
import { useTheme } from "@/hooks/useTheme";
import { scrollState, setScrollLocked } from "@/motion/scroll";
import { addTick, TICK } from "@/motion/ticker";
import { runViewTransition } from "@/motion/viewTransition";
import { cn } from "@/lib/utils";

const LANGUAGES: Language[] = ["pt", "en", "es"];
const langNames: Record<Language, string> = { pt: "Português", en: "English", es: "Español" };

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { dark, toggle } = useTheme();
  const { onHome, homePath, sectionHref, onSectionClick } = useSiteNavigation();
  const sectionInView = useActiveSection(NAV_ITEMS);
  const activeSection = onHome ? sectionInView : null;
  const [menu, setMenu] = useState<"closed" | "open" | "closing">("closed");
  const [shortcut, setShortcut] = useState("Ctrl K");

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) setShortcut("⌘K");
  }, []);

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Hide while scrolling down, return on the first scroll up.
  useEffect(() => {
    let anchor = 0;
    let hidden = false;
    return addTick(() => {
      const header = headerRef.current;
      if (!header) return;
      const y = scrollState.y;
      if (y < 160) {
        hidden = false;
        anchor = y;
      } else if (!hidden && y - anchor > 90) {
        hidden = true;
      } else if (hidden && anchor - y > 24) {
        hidden = false;
      }
      // `anchor` trails the turning point of the scroll direction.
      if ((hidden && y > anchor) || (!hidden && y < anchor)) anchor = y;
      const next = String(hidden && menu === "closed");
      if (header.dataset.hidden !== next) header.dataset.hidden = next;
    }, TICK.ui);
  }, [menu]);

  // Sliding highlight behind the active nav link.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const link = activeSection ? nav.querySelector<HTMLElement>(`[data-nav="${activeSection}"]`) : null;
    nav.style.setProperty("--pill-o", link ? "1" : "0");
    if (link) {
      nav.style.setProperty("--pill-x", `${link.offsetLeft}px`);
      nav.style.setProperty("--pill-w", `${link.offsetWidth}px`);
    }
  }, [activeSection, language]);

  const closeMenu = useCallback(() => {
    setMenu((state) => (state === "open" ? "closing" : state));
    window.setTimeout(() => setMenu("closed"), 280);
  }, []);

  useEffect(() => {
    if (menu === "closed") return;
    setScrollLocked(true);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu, closeMenu]);

  const switchLanguage = (next: Language) => {
    if (next === language) return;
    runViewTransition(() => flushSync(() => setLanguage(next)));
  };

  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 transition-transform duration-slow ease-expo data-[hidden=true]:-translate-y-[130%]"
      >
        <ScrollProgress />
        <div className="shell flex items-center justify-between gap-3 pt-3 sm:pt-4">
          <Magnetic>
            {onHome ? (
              <a
                href="#top"
                aria-label={t("a11y.monogram")}
                className="glass-card flex h-11 w-11 items-center justify-center rounded-full font-mono text-sm font-semibold tracking-wider text-foreground"
              >
                MM
              </a>
            ) : (
              <Link
                to={homePath}
                aria-label={t("a11y.monogram")}
                className="glass-card flex h-11 w-11 items-center justify-center rounded-full font-mono text-sm font-semibold tracking-wider text-foreground"
              >
                MM
              </Link>
            )}
          </Magnetic>

          <nav ref={navRef} aria-label={t("a11y.mainNav")} className="nav-pill glass-card hidden lg:flex">
            <span aria-hidden="true" className="nav-indicator" />
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item;
              return (
                <a
                  key={item}
                  href={sectionHref(item)}
                  onClick={onSectionClick(item)}
                  data-nav={item}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-base",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Scramble text={t(`nav.${item}`)} />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div
              role="group"
              aria-label={t("a11y.languageSelect")}
              className="glass-card flex h-11 items-center rounded-full p-1"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => switchLanguage(lang)}
                  aria-label={t("a11y.switchLanguage", { code: lang.toUpperCase(), lang: langNames[lang] })}
                  aria-pressed={language === lang}
                  className={cn(
                    "h-9 min-w-9 rounded-full px-2 font-mono text-[11px] uppercase tracking-wider transition-colors duration-base",
                    language === lang
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span aria-hidden="true">{lang}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={openCommandPalette}
              onPointerEnter={() => void loadCommandPalette()}
              onFocus={() => void loadCommandPalette()}
              // The visible shortcut is part of the name (WCAG 2.5.3).
              aria-label={`${t("palette.open")} ${shortcut}`}
              aria-keyshortcuts="Meta+K Control+K"
              className="glass-card hidden h-11 items-center gap-2 min-w-11 justify-center rounded-full px-3 text-muted-foreground transition-colors duration-base hover:text-foreground sm:inline-flex"
            >
              <Command size={15} aria-hidden="true" className="xl:hidden" />
              <kbd aria-hidden="true" className="hidden font-mono text-[11px] tracking-wider xl:inline">
                {shortcut}
              </kbd>
            </button>

            <IconButton
              tone="ghost"
              onClick={toggleTheme}
              aria-label={t(dark ? "a11y.enableLightMode" : "a11y.enableDarkMode")}
              className="glass-card h-11 w-11 rounded-full"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </IconButton>

            <IconButton
              tone="ghost"
              onClick={() => (menu === "open" ? closeMenu() : setMenu("open"))}
              aria-label={t(menu === "open" ? "a11y.closeMenu" : "a11y.openMenu")}
              aria-expanded={menu === "open"}
              aria-controls="site-menu"
              className="glass-card h-11 w-11 rounded-full lg:hidden"
            >
              {menu === "open" ? <X size={16} /> : <Menu size={16} />}
            </IconButton>
          </div>
        </div>
      </header>

      {menu !== "closed" && (
        <div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t("a11y.mainNav")}
          data-closing={menu === "closing"}
          data-lenis-prevent
          className="menu-panel fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background/92 backdrop-blur-2xl lg:hidden"
        >
          <ul className="shell flex flex-1 flex-col justify-center gap-1 pt-24">
            {NAV_ITEMS.map((item, index) => (
              <li key={item} className="menu-item" style={{ "--i": index } as CSSProperties}>
                <a
                  href={sectionHref(item)}
                  onClick={(event) => {
                    onSectionClick(item)(event);
                    closeMenu();
                  }}
                  className="group flex items-baseline gap-4 border-b border-border/60 py-4 font-display text-4xl font-semibold tracking-tight text-foreground"
                >
                  <span className="font-mono text-xs font-medium text-signal">{String(index + 1).padStart(2, "0")}</span>
                  {t(`nav.${item}`)}
                </a>
              </li>
            ))}
          </ul>
          <div className="shell menu-item pt-6" style={{ "--i": NAV_ITEMS.length } as CSSProperties}>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                window.setTimeout(openCommandPalette, 300);
              }}
              className="glass-card inline-flex h-11 items-center gap-2.5 rounded-full px-5 font-mono text-xs text-foreground"
            >
              <Command size={14} aria-hidden="true" />
              {t("palette.title")}
            </button>
          </div>
          <ul className="shell menu-item flex flex-wrap gap-x-5 gap-y-2 pb-10 pt-8" style={{ "--i": NAV_ITEMS.length + 1 } as CSSProperties}>
            {socialLinks.slice(0, 4).map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label link-underline text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
