# AGENTS.md — Development Guidelines & Workspace Rules

This document outlines the core architecture, writing standards, Git conventions, and operational workflows for AI agents and developers working on the `whoami` repository.

---

## 1. Project Overview & Architecture

`whoami` is the personal portfolio and interactive resume of **Mateus Mendonça Monteiro** (Backend Software Engineer). It is built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**, deployed to **GitHub Pages**.

### Key Architectural Tenets:
- **Clean & Decoupled**: Independent from vendor frameworks (e.g., Lovable).
- **Data-Driven**: All career experiences, education, skills, projects, open-source contributions, languages, certifications and social profiles live in [`src/data/portfolio.ts`](src/data/portfolio.ts). The page, the `<head>`, JSON-LD, the sitemap and the agent files are all derived from it.
- **Trilingual Dictionary**: All user-facing UI labels and text live in [`src/i18n/translations.ts`](src/i18n/translations.ts) supporting Portuguese (`pt`), English (`en`), and Spanish (`es`).
- **Language State**: Managed via [`src/contexts/LanguageContext.tsx`](src/contexts/LanguageContext.tsx). The URL (`/`, `/pt/`, `/es/`) sets the language; at `/` a saved `localStorage` choice applies after mount.
- **Dynamic Assets**: Favicons dynamically switch color (black on light theme, white on dark theme) via [`src/components/Header.tsx`](src/components/Header.tsx).
- **Scenes, not cards**: Each section in [`src/components/sections/`](src/components/sections/) is a scene with its own layout and its own particle formation (`data-scene`). See [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) §5.
- **Design System**: Primitives in [`src/components/ds/`](src/components/ds/), tokens in [`src/index.css`](src/index.css) and [`tailwind.config.ts`](tailwind.config.ts). Size type with the `text-display-*` scale, build headings with `SectionHeading`, tags with `TagList`.
- **Motion Layer**: [`src/motion/`](src/motion/) holds one rAF ticker, the scroll store (with Lenis on mouse devices) and per-element scroll progress as CSS variables. Motion components live in [`src/components/motion/`](src/components/motion/). Per-frame values never go through React state.
- **Server-safe motion**: Render the final, visible state first and add motion in an effect. The page is prerendered and hydrated, so the first render must not read browser state.
- **WebGL Background**: [`src/webgl/`](src/webgl/) holds a three.js engine with two layers: the service mesh and a particle field that morphs between six formations by scroll (one is a dot-matrix portrait sampled from the profile photo). It loads as a lazy chunk and falls back to the 2D canvas without WebGL 2. Keep `three` imports inside `Engine.ts`, `MeshScene.ts`, `ParticleField.ts` and `WebGLBackground.tsx`. System design in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
- **Project Covers**: [`src/components/covers/`](src/components/covers/) draws each project's algorithm on a canvas. A project with `featured: true` appears in the gallery and needs a sketch under the same id; the others are listed as rows.

---

## 2. Prose & Writing Rules (Stop-Slop / No-Slop)

All content across Portuguese, English, and Spanish must strictly adhere to the anti-AI writing rules from [`hardikpandya/stop-slop`](https://github.com/hardikpandya/stop-slop) and [`Byk3y/no-slop`](https://github.com/Byk3y/no-slop) (based on Wikipedia's *Signs of AI Writing*).

### Banned Vocabulary
Never use these overrepresented AI words and phrases:
- **English**: `delve`, `tapestry`, `pivotal`, `vibrant`, `meticulous`, `landscape`, `testament`, `underscore`, `intricate`, `interplay`, `garner`, `bolster`, `foster`, `showcase`, `emphasize`, `enduring`, `crucial`, `enhance`, `highlighting`, `renowned`, `groundbreaking`, `profound`, `comprehensive`, `multifaceted`, `leverage`, `utilize`, `facilitate`, `seamlessly`, `spearhead`, `passionate about`, `with a focus on`, `real business impact`.
- **Portuguese / Spanish**: `apaixonado por`, `ecossistema vibrante`, `alavancar`, `orquestrar com maestria`, `excelência técnica`, `impacto real de negócio`, `transformar a experiência`, `robusto`.

### Structural Rules:
1. **No "Rule of Three"**: Do not list three adjectives or three parallel phrases as a rhetorical device. Use two or four items instead.
2. **No "Not just X, but Y"**: State facts directly. Do not use contrastive setups or negation-then-assertion formulas.
3. **No Present-Participle Chains**: Avoid trailing `-ing` filler (`highlighting`, `emphasizing`, `ensuring`).
4. **Simple Copulas & Active Voice**: Use simple verbs (`is`, `build`, `write`, `maintain`, `deploy`) instead of promotional copulas (`serves as`, `stands as`, `boasts`, `features`).
5. **No Conversational / Collaborative AI Clichés**: Avoid `Let's talk`, `Let's connect`, `What if`, `As we can see`. Use direct technical labels (e.g., `Contact channels`).
6. **Factual Engineer Voice**: State what was built, what stack was used, and exact metrics (e.g., *10% memory reduction*, *20% SEO gain*).

---

## 3. Privacy & Security Constraints

- **Zero PII**: **NEVER** add phone numbers, personal physical addresses, or confidential tokens to any code, data file, or commit.
- **Git Hygiene**: If sensitive data is ever exposed, it must be permanently purged from all Git objects and reflogs (`git gc --prune=now --aggressive`).

---

## 4. Git & Commit Guidelines

- **Format**: Conventional Commits combined with **Gitmoji** in **English**:
  - `✨ feat(...)`: New feature or section
  - `🐛 fix(...)`: Bug fix (e.g., routing, styling)
  - `📝 style(i18n)(...)` / `📝 docs(...)`: Text rewrites, translations, documentation
  - `🎨 style(...)`: Visual adjustments, SVGs, CSS tokens
  - `🔧 chore(...)`: Configuration, dependencies, scripts
  - `👷 ci(...)`: GitHub Actions workflows
  - `✅ test(...)`: Test suites and mocks
- **Atomic Commits**: Keep each commit focused on a single logical change.

---

## 5. GitHub Pages & Routing Architecture

- **Public URL**: `https://mateusememe.github.io/whoami/`
- **Subpath Handling**: 
  - `vite.config.ts`: `base: process.env.VITE_BASE_PATH || "/"`
  - `App.tsx`: `<BrowserRouter basename={import.meta.env.BASE_URL}>`
- **Pages and URLs**: `/` (English), `/pt/` and `/es/` render the home page; with the same prefixes, `/projects/<id>/` renders a featured project, `/talks/<id>/` a talk, `/now/` and `/uses/` their pages, and `/notes/` plus `/notes/<slug>/` the notes once one is published (`src/i18n/routes.ts`). The URL sets the language; changing the language replaces the URL with the same page. `SiteLayout` keeps the WebGL layer, header, command palette and terminal mounted across pages.
- **Lazy parts**: every page but the home page, its content (`projectPages.ts`, `talkPages.ts`, `uses.ts`, the note bodies), the page-only strings (`src/i18n/pageText.ts`) and the palette and terminal panels are separate chunks (`src/lib/lazy.ts`). Keep them out of the main bundle (`npm run check:bundle`, 120 kB gzip): `main.tsx` loads a page's chunk before hydrating its URL, and `entry-server` `prepare()` loads them all before the prerender.
- **Prerender & SPA Fallback**: `postbuild` runs `scripts/prerender.ts`, which writes the empty shell to `dist/404.html` (unknown paths render client-side) and 72 prerendered pages (home, 12 projects, 9 talks, /now and /uses in three languages), then prints the résumé PDFs (`scripts/render-cv.ts`) and reads them back as an ATS would (`scripts/check-cv.ts`).
- **Generated Files**: the block between the `seo:start` and `seo:end` markers in `index.html`, plus `sitemap.xml`, `llms.txt`, `llms-full.txt`, `index{,.pt,.es}.md`, `resume{,.pt,.es}.json` and (with a published note) `feed{,.pt,.es}.xml` in `public/`, and `packages/card/card.json`, come from portfolio data. Never edit them by hand: change the data, bump `profile.updatedAt` in `src/data/portfolio.ts`, run `npm run generate` and commit the result. Tests fail when they drift. `src/data/github-{stars,repos}.ts` come from `npm run github:sync`.
- **Agent Tools**: `src/agents/webmcp.ts` registers WebMCP tools (`get_profile` with markdown, json or pdf, `list_projects`, `list_talks`, `get_contact`, `go_to_section`) when the browser has `document.modelContext`.
- **Accessibility**: text stays at 4.5:1 in every animated state (effects change color or position, not opacity, below the `--scrub-floor`), targets are 24 px or larger, and an `aria-label` must contain the control's visible text.
- **Workflows**: `.github/workflows/ci.yml` runs typecheck, lint, unit tests, the build (with the CV check), the bundle budget, Playwright and Lighthouse CI, and uploads the reports. `.github/workflows/deploy.yml` runs on push to `main` and every Monday with Node 22 LTS, `pages: write`, and `id-token: write` permissions; it syncs the GitHub snapshot first and reads the repository variables `SITE_URL`, `BASE_PATH` and `GOATCOUNTER_URL`.

---

## 6. Verification Commands

Always run the full validation suite before creating commits or pushing:

```bash
# Typecheck
npm run typecheck

# Linting
npm run lint

# Unit tests (217 tests)
npm test

# Generated files + production build + prerender (72 pages) + 404 SPA fallback + résumé PDFs
npm run build

# Initial bundle budget, end-to-end checks (hydration, layout at 9 widths, flows), Lighthouse
npm run check:bundle
npm run test:e2e
npm run lighthouse
```
