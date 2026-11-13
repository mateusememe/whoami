// Runs before dev and build hooks; writes public/sitemap.xml.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { renderSitemap } from "../src/seo/sitemap";
import { DEFAULT_SITE_URL } from "../src/seo/site";

const siteUrl = process.env.VITE_SITE_URL || DEFAULT_SITE_URL;
writeFileSync(resolve("public/sitemap.xml"), renderSitemap(siteUrl));
console.log(`✓ sitemap.xml written (3 language URLs) for base ${siteUrl}`);
