#!/usr/bin/env node
// Business card of Mateus Mendonça Monteiro, for the terminal:
//   npx mateusememe          (language from LANG, else English)
//   npx mateusememe --pt     (or --en, --es)
// No dependencies. Honors NO_COLOR and plain output when piped.

import { readFileSync } from "node:fs";

const cards = JSON.parse(readFileSync(new URL("./card.json", import.meta.url), "utf8"));

const flag = process.argv.slice(2).find((arg) => /^--(en|pt|es)$/.test(arg));
const fromEnv = (process.env.LC_ALL || process.env.LANG || "").slice(0, 2).toLowerCase();
const language = flag ? flag.slice(2) : ["pt", "es"].includes(fromEnv) ? fromEnv : "en";
const card = cards[language];

const color = process.stdout.isTTY && !("NO_COLOR" in process.env);
const paint = (code, text) => (color ? `\u001b[${code}m${text}\u001b[0m` : text);
const bold = (text) => paint("1", text);
const teal = (text) => paint("36", text);
const dim = (text) => paint("2", text);

/** Splits text into lines of at most `width` characters, on spaces. */
function wrap(text, width) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && (line + " " + word).length > width) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Widest content line: the card fits an 80-column terminal. */
const MAX = 74;
const labelWidth = Math.max(...card.links.map((link) => link.label.length));
const links = card.links.flatMap((link) =>
  labelWidth + 2 + link.value.length <= MAX
    ? [{ text: `${link.label.padEnd(labelWidth)}  ${link.value}`, label: link.label }]
    : // Too long for one line: the label, then the value on its own line.
      [{ text: link.label, style: dim }, { text: link.value }],
);
const rows = [
  { text: card.name, style: bold },
  { text: card.headline, style: teal },
  { text: "" },
  ...wrap(card.summary, 60).map((text) => ({ text })),
  { text: "" },
  ...links,
  { text: "" },
  { text: card.hint, style: dim },
];
const inner = Math.max(...rows.map((row) => row.text.length)) + 4;
const pad = (row) => {
  const space = " ".repeat(inner - 4 - row.text.length);
  if (row.label) return `${dim(row.label.padEnd(labelWidth))}  ${row.text.slice(labelWidth + 2)}${space}`;
  return `${row.style ? row.style(row.text) : row.text}${space}`;
};

const out = [
  dim(`╭${"─".repeat(inner)}╮`),
  ...rows.map((row) => `${dim("│")}  ${pad(row)}  ${dim("│")}`),
  dim(`╰${"─".repeat(inner)}╯`),
];
console.log(`\n${out.join("\n")}\n`);
