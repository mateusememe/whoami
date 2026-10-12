// Runs before dev and build hooks; writes llms.txt, llms-full.txt and the
// Markdown profiles (index.md, index.pt.md, index.es.md) to public/.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { renderAgentFiles } from "../src/seo/llms";
import { DEFAULT_SITE_URL } from "../src/seo/site";

const siteUrl = process.env.VITE_SITE_URL || DEFAULT_SITE_URL;
const files = renderAgentFiles(siteUrl);

for (const [name, content] of Object.entries(files)) {
  writeFileSync(resolve("public", name), content);
}

console.log(`✓ agent files written (${Object.keys(files).join(", ")}) for base ${siteUrl}`);
