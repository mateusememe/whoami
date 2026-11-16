import { useCallback, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { HOME, pagePath, parseRoute } from "@/i18n/routes";
import { scrollToTarget } from "@/motion/scroll";
import { runViewTransition } from "@/motion/viewTransition";
import { loadProjectPage } from "@/lib/lazy";

/** True for clicks the browser should handle itself (new tab, new window, download). */
export function isModifiedClick(event: MouseEvent): boolean {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

/**
 * Moves between the pages of the site. Section links work from any page: on
 * the home page they scroll, elsewhere they go home and land on the section
 * (useRouteScroll reads the hash).
 */
export function useSiteNavigation() {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = parseRoute(location.pathname).page?.kind === "home";
  const homePath = pagePath(language, HOME);
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

  /** href for a section, valid with JavaScript off too. */
  const sectionHref = useCallback(
    (id: string) => (onHome ? `#${id}` : `${base}${homePath}#${id}`),
    [onHome, base, homePath],
  );

  const goToSection = useCallback(
    (id: string) => {
      if (onHome) {
        const element = document.getElementById(id);
        if (element) scrollToTarget(element);
        return;
      }
      navigate({ pathname: homePath, hash: `#${id}` });
    },
    [onHome, homePath, navigate],
  );

  /** Click handler for section links rendered as <a href={sectionHref(id)}>. */
  const onSectionClick = useCallback(
    (id: string) => (event: MouseEvent) => {
      if (onHome || isModifiedClick(event)) return;
      event.preventDefault();
      goToSection(id);
    },
    [onHome, goToSection],
  );

  const projectHref = useCallback((id: string) => `${base}${pagePath(language, { kind: "project", id })}`, [base, language]);

  /**
   * Opens a project page. When `cover` is given, it morphs into the page's
   * cover through a View Transition (where the browser has the API).
   */
  const openProject = useCallback(
    (id: string, cover?: HTMLElement | null) => {
      const path = pagePath(language, { kind: "project", id });
      // The page chunk is usually loaded already (idle preload); wait for it so
      // the transition's "after" snapshot shows the page, not a placeholder.
      loadProjectPage().then(() => {
        if (cover) cover.style.viewTransitionName = "project-cover";
        runViewTransition(() =>
          flushSync(() => {
            if (cover) cover.style.viewTransitionName = "";
            navigate(path);
          }),
        );
      });
    },
    [language, navigate],
  );

  return { onHome, homePath, sectionHref, goToSection, onSectionClick, projectHref, openProject };
}
