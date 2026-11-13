// Runs before dev and build hooks; rewrites the generated SEO block in
// index.html (title, descriptions, hreflang, Open Graph, JSON-LD) for English.
// scripts/prerender.ts swaps in the Portuguese and Spanish blocks after build.

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { renderHead, replaceHead } from "../src/seo/head";
import { DEFAULT_SITE_URL } from "../src/seo/site";

const siteUrl = process.env.VITE_SITE_URL || DEFAULT_SITE_URL;
const path = resolve("index.html");
const current = readFileSync(path, "utf8");
const next = replaceHead(current, renderHead("en", siteUrl));

if (next !== current) writeFileSync(path, next);
console.log(`✓ index.html head ${next === current ? "is up to date" : "regenerated"} for base ${siteUrl}`);
