# AGENTS.md — Development Guidelines & Workspace Rules

This document outlines the core architecture, writing standards, Git conventions, and operational workflows for AI agents and developers working on the `whoami` repository.

---

## 1. Project Overview & Architecture

`whoami` is the personal portfolio and interactive resume of **Mateus Mendonça Monteiro** (Backend Software Engineer). It is built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**, deployed to **GitHub Pages**.

### Key Architectural Tenets:
- **Clean & Decoupled**: Independent from vendor frameworks (e.g., Lovable).
- **Data-Driven**: All career experiences, education, skills, projects, and social profiles live in [`src/data/portfolio.ts`](src/data/portfolio.ts).
- **Trilingual Dictionary**: All user-facing UI labels and text live in [`src/i18n/translations.ts`](src/i18n/translations.ts) supporting Portuguese (`pt`), English (`en`), and Spanish (`es`).
- **Language State**: Managed via [`src/contexts/LanguageContext.tsx`](src/contexts/LanguageContext.tsx) with automatic `localStorage` synchronization and browser language fallback.
- **Dynamic Assets**: Favicons dynamically switch color (black on light theme, white on dark theme) via [`src/components/Header.tsx`](src/components/Header.tsx).
- **Hero Carousel**: [`src/components/ProfileCarousel.tsx`](src/components/ProfileCarousel.tsx) handles photo cycling with smooth cross-fade, auto-play, and pause-on-hover.
- **Design System**: Primitives in [`src/components/ds/`](src/components/ds/), tokens in [`src/index.css`](src/index.css). Build cards with `Surface`, sections with `Section`, tags with `TagList`. Full rules in [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).
- **WebGL Background**: [`src/webgl/`](src/webgl/) holds a three.js engine that renders a service-mesh constellation over a 3D binary field. It loads as a lazy chunk and falls back to the 2D canvas without WebGL 2. Keep `three` imports inside `Engine.ts`, `MeshScene.ts` and `WebGLBackground.tsx`. System design in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

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
- **Prerender & SPA Fallback**: `postbuild` runs `scripts/prerender.ts`, which writes the empty shell to `dist/404.html` (unknown paths render client-side) and the prerendered home page to `dist/index.html`.
- **Agent Files**: `llms.txt`, `llms-full.txt` and `index{,.pt,.es}.md` in `public/` are generated from portfolio data; never edit them by hand.
- **Workflows**: `.github/workflows/deploy.yml` runs on push to `main` with Node 22 LTS, `pages: write`, and `id-token: write` permissions.

---

## 6. Verification Commands

Always run the full validation suite before creating commits or pushing:

```bash
# Typecheck
npm run typecheck

# Linting
npm run lint

# Unit tests (73 tests)
npm test

# Production build + sitemap + 404 SPA fallback
npm run build
```
