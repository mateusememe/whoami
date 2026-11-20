import type { Page } from "@playwright/test";
import { LANGUAGES, PAGES, pagePath, type Page as SitePage } from "../src/i18n/routes";

/** Every prerendered URL, relative to the preview server root. */
export const ALL_URLS: string[] = PAGES.flatMap((page) => LANGUAGES.map((language) => pagePath(language, page)));

/** One URL per kind of page (English), for the checks that are too slow to run on all of them. */
export const SAMPLE_URLS: string[] = [
  ...new Map(PAGES.map((page): [SitePage["kind"], string] => [page.kind, pagePath("en", page)])).values(),
  pagePath("pt", PAGES[0]),
];

/** The widths the layout must hold at, from a small phone to a large desktop. */
export const VIEWPORTS = [
  { width: 320, height: 640 },
  { width: 375, height: 812 },
  { width: 414, height: 896 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
];

/** Console errors and uncaught exceptions, including React's hydration errors (#418, #423, #425). */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

/** Waits until the page is hydrated and the idle-time work (WebGL, preloads) has started. */
export async function settle(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(300);
}

/**
 * Layout problems on the current page:
 * - the page scrolls sideways;
 * - visible text runs past the left or right edge of the viewport (text
 *   inside a container that clips or scrolls is measured by its visible part);
 * - visible text smaller than 11 px;
 * - visible interactive targets smaller than 24 × 24 px (links inside a
 *   line of text are exempt, as in WCAG 2.5.8).
 * Elements under aria-hidden, inert or [data-overflow-ok] are decorative and skipped.
 */
export function layoutIssues(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const viewport = document.documentElement.clientWidth;
    const issues = new Set<string>();
    const shell = document.getElementById("root")?.firstElementChild ?? null;

    const name = (element: Element) => {
      const classes = typeof element.className === "string" ? element.className.trim().split(/\s+/).slice(0, 3) : [];
      return `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${classes.length ? `.${classes.join(".")}` : ""}`;
    };
    const decorative = (element: Element) => element.closest('[aria-hidden="true"], [inert], [hidden], [data-overflow-ok]') !== null;
    const shown = (element: Element) => {
      for (let node: Element | null = element; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
      }
      return true;
    };
    /** The part of a box left visible by the clipping ancestors below the site shell. */
    const visiblePart = (rect: DOMRect, from: Element) => {
      let { left, right, top, bottom } = rect;
      for (let node: Element | null = from; node && node !== shell; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (style.overflowX !== "visible" || style.overflowY !== "visible" || style.clipPath !== "none") {
          const box = node.getBoundingClientRect();
          left = Math.max(left, box.left);
          right = Math.min(right, box.right);
          top = Math.max(top, box.top);
          bottom = Math.min(bottom, box.bottom);
        }
      }
      return { left, right, width: right - left, height: bottom - top };
    };

    if (document.documentElement.scrollWidth > viewport + 1) {
      issues.add(`page scrolls sideways: ${document.documentElement.scrollWidth}px wide in ${viewport}px`);
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      if (!parent || !node.textContent?.trim() || decorative(parent) || !shown(parent)) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        const part = visiblePart(rect, parent);
        if (part.width <= 1 || part.height <= 1) continue;
        if (part.right > viewport + 1 || part.left < -1) {
          issues.add(`text past the edge (${Math.round(part.left)}–${Math.round(part.right)} of ${viewport}): ${name(parent)} "${node.textContent.trim().slice(0, 40)}"`);
        }
        const size = parseFloat(getComputedStyle(parent).fontSize);
        if (size < 11) issues.add(`text at ${size}px: ${name(parent)} "${node.textContent.trim().slice(0, 40)}"`);
      }
    }

    const targets = document.querySelectorAll(
      'a[href], button, input, select, textarea, summary, [role="button"], [role="link"], [role="tab"], [tabindex]:not([tabindex="-1"])',
    );
    for (const element of targets) {
      if (decorative(element) || !shown(element)) continue;
      const rect = element.getBoundingClientRect();
      const part = visiblePart(rect, element);
      if (part.width <= 1 || part.height <= 1) continue;
      if (element.tagName === "A" && getComputedStyle(element).display === "inline") continue;
      if (rect.width < 23.5 || rect.height < 23.5) {
        issues.add(`target ${Math.round(rect.width)}×${Math.round(rect.height)}px: ${name(element)} "${(element.textContent ?? "").trim().slice(0, 30)}"`);
      }
    }
    return [...issues];
  });
}
