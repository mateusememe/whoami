import type { Language } from "@/i18n/translations";

/** Markdown profile per language, published next to the page. */
export const PROFILE_FILES: Record<Language, string> = {
  en: "index.md",
  pt: "index.pt.md",
  es: "index.es.md",
};

/** JSON Resume (https://jsonresume.org/schema) per language. */
export const RESUME_FILES: Record<Language, string> = {
  en: "resume.json",
  pt: "resume.pt.json",
  es: "resume.es.json",
};

/** Share card (1200x630) per language, rendered by scripts/render-og-image.ts. */
export const OG_IMAGE_FILES: Record<Language, string> = {
  en: "og-image.png",
  pt: "og-image.pt.png",
  es: "og-image.es.png",
};
