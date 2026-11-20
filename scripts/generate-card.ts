// Writes packages/card/card.json, the data of the `npx mateusememe` card,
// from src/data/portfolio.ts. Part of `npm run generate`; a test fails when
// the committed file drifts.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { renderCardData } from "../src/seo/card";
import { DEFAULT_SITE_URL } from "../src/seo/site";

const siteUrl = process.env.VITE_SITE_URL || DEFAULT_SITE_URL;
writeFileSync(resolve("packages/card/card.json"), renderCardData(siteUrl));
console.log(`✓ packages/card/card.json written for base ${siteUrl}`);
