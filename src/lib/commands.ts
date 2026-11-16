/** Event that opens the command palette from anywhere (header button, mobile menu). */
export const PALETTE_EVENT = "whoami:palette";

export function openCommandPalette(): void {
  window.dispatchEvent(new CustomEvent(PALETTE_EVENT));
}

interface Searchable {
  label: string;
  hint?: string;
  /** Extra words that match the search but are not shown. */
  keywords?: string;
}

/** Lowercase, without accents, so "educacao" finds "Educação". */
const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/**
 * Ranks commands for a query: every word must appear in the label, hint or
 * keywords. Matches at the start of the label rank first.
 */
export function filterCommands<T extends Searchable>(commands: T[], query: string): T[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return commands;
  const scored = commands
    .map((command, order) => {
      const label = fold(command.label);
      const haystack = `${label} ${fold(command.hint ?? "")} ${fold(command.keywords ?? "")}`;
      if (!words.every((word) => haystack.includes(word))) return null;
      const score = (label.startsWith(words[0]) ? 0 : label.includes(words[0]) ? 1 : 2) * 1000 + order;
      return { command, score };
    })
    .filter((entry): entry is { command: T; score: number } => entry !== null);
  return scored.sort((a, b) => a.score - b.score).map((entry) => entry.command);
}

