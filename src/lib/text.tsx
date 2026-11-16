import type { ReactNode } from "react";

/** Renders `code` spans written with backticks in the data as <code>. */
export const withCode = (text: string): ReactNode =>
  text.split("`").map((part, index) =>
    index % 2 === 1 ? (
      <code key={index} className="font-mono text-[0.92em] text-foreground">
        {part}
      </code>
    ) : (
      part
    ),
  );

const MONTHS: Record<string, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  pt: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
};

/**
 * `2026-10` → `Oct 2026`, `2026-10-31` → `Oct 2026`, `2023` → `2023`. A fixed
 * table instead of Intl, so the server and the browser always print the same text.
 */
export function formatMonth(month: string, language: string): string {
  const [year, index] = month.split("-").map(Number);
  if (!index) return String(year);
  return `${(MONTHS[language] ?? MONTHS.en)[index - 1]} ${year}`;
}
