# CLAUDE.md

This file provides key commands, architectural guidelines, and writing constraints for Claude Code when working in the `whoami` repository.

## Commands

```bash
# Development
npm run dev               # Regenerate head/sitemap/agent files, then start the dev server (port 8080)
npm run build             # Regenerate, client + SSR build, prerender /, /pt/, /es/, 404.html shell
npm run generate          # Rewrite the SEO block of index.html, sitemap.xml and the agent files
npm run og:image          # Re-render public/og-image.png (manual, needs Chrome)
npm run preview           # Preview production build locally

# Validation
npm run typecheck         # TypeScript check (app + node tsconfigs)
npm run lint              # ESLint check
npm test                  # Run Vitest test suite once
npm run test:watch        # Run Vitest in watch mode
```

## Architecture & File Structure

- **Data Layer**: [`src/data/portfolio.ts`](src/data/portfolio.ts) — Single source of truth for `profile`, experiences, projects (`featured` ones form the gallery, the rest are rows), open-source `contributions`, skills, education, languages, certifications and social links. Private repositories have no `githubUrl`. Bump `profile.updatedAt` when the content changes.
- **i18n Layer**: [`src/i18n/translations.ts`](src/i18n/translations.ts) — Trilingual dictionary (`pt`, `en`, `es`).
- **State**: [`src/contexts/LanguageContext.tsx`](src/contexts/LanguageContext.tsx) — Language provider with `localStorage` sync.
- **Sections**: [`src/components/sections/`](src/components/sections/) — One scene per section (`HeroSection`, `AboutSection`, `ExperienceSection`, `EducationSection`, `SkillsSection`, `ProjectsSection`, `ContactFooter`). Each sets `data-scene` to the particle formation behind it.
- **Design System**: [`src/components/ds/`](src/components/ds/) — `Section`/`SectionHeading`, `Surface`, `Tag`/`TagList`, `IconButton`, `PaginationDots`, `Reveal`. Tokens (fluid `text-display-*` scale, the single `--signal` accent, motion tokens, glass, grain) in [`src/index.css`](src/index.css) and [`tailwind.config.ts`](tailwind.config.ts). Rules: [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).
- **Motion Layer**: [`src/motion/`](src/motion/) — one rAF ticker, `scrollState` + Lenis, per-element scroll progress written to CSS variables, the DOM → WebGL bridge (`sceneState`, `useSceneDirector`), View Transitions. Components in [`src/components/motion/`](src/components/motion/) (`SmoothScroll`, `ScrubText`, `Marquee`, `Counter`, `Magnetic`, `Tilt`, `Scramble`, `Cursor`, `Grain`). No React state per frame.
- **Project Covers**: [`src/components/covers/`](src/components/covers/) — canvas sketches that run each project's algorithm (`algorithms.ts` is pure and tested; `sketches.ts` is a lazy chunk). Every `featured` project id needs a sketch.
- **Section Order**: [`src/data/navigation.ts`](src/data/navigation.ts) — `NAV_ITEMS` drives nav order and the `01`..`06` heading indexes. Headline numbers come from `portfolioStats` in [`src/data/portfolio.ts`](src/data/portfolio.ts).
- **Theme**: [`src/hooks/useTheme.ts`](src/hooks/useTheme.ts) — dark/light state, storage, favicon swap, circular View Transition.
- **WebGL Layer**: [`src/webgl/`](src/webgl/) — vanilla three.js engine: the service mesh (`MeshScene`) plus a particle field (`ParticleField`) that morphs between six formations by scroll, including a dot-matrix portrait sampled from the profile photo. Lazy-loaded by [`src/components/scene/SceneBackground.tsx`](src/components/scene/SceneBackground.tsx), which falls back to the 2D `BinaryBackground` without WebGL 2 or on any error. Only `Engine.ts`, `MeshScene.ts`, `ParticleField.ts` and `WebGLBackground.tsx` may import `three`. System design: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
- **Server-safe motion**: every component renders its final, visible state; effects add motion after mount. Never read `window`, `localStorage`, `matchMedia` or the clock during the first render (the page is prerendered and hydrated).
- **Tests**: [`src/test/`](src/test/) — Vitest + `@testing-library/react`. Canvas 2D is mocked in [`src/test/setup.ts`](src/test/setup.ts); jsdom has no WebGL and no `IntersectionObserver`, so components run their static path there. Test geometry, algorithms and scroll math through the pure modules (`graph.ts`, `particles.ts`, `covers/algorithms.ts`, `motion/progress.ts`, `motion/sceneState.ts`).

## Prose & Writing Rules (No-Slop)

Follow strict anti-AI writing rules from `Byk3y/no-slop` and `hardikpandya/stop-slop`:
- **Banned Words**: Never use `delve`, `tapestry`, `pivotal`, `vibrant`, `meticulous`, `landscape`, `testament`, `underscore`, `intricate`, `interplay`, `garner`, `bolster`, `foster`, `showcase`, `emphasize`, `enduring`, `crucial`, `enhance`, `highlighting`, `renowned`, `groundbreaking`, `profound`, `comprehensive`, `multifaceted`, `leverage`, `utilize`, `facilitate`, `seamlessly`, `spearhead`, `passionate about`.
- **No Rule of Three**: Do not use 3-item adjective or phrase lists as a rhetorical device (use 2 or 4).
- **No Contrastive Rhetoric**: Avoid "not just X, but Y" or "not only... but also".
- **No Participle Chains**: Avoid trailing `-ing` commentary (`highlighting`, `ensuring`).
- **Voice**: Factual engineer voice, active voice, simple copulas (`is`, `build`, `deploy`), exact metrics.
- **Trilingual Parity**: Always maintain all three languages (`pt`, `en`, `es`) in parallel.

## Privacy & Security

- **Zero PII**: Do NOT commit phone numbers, personal home addresses, or secret API keys to this public repository.

## Git & Commit Conventions

Use **Conventional Commits + Gitmoji** in **English**:
- `✨ feat(...)`: New feature or section
- `🐛 fix(...)`: Bug fix
- `📝 style(i18n)(...)` / `📝 docs(...)`: Copy revisions, translations, docs
- `🎨 style(...)`: Visual refinements, SVGs, CSS tokens
- `🔧 chore(...)`: Config, dependencies, scripts
- `👷 ci(...)`: Workflows
- `✅ test(...)`: Test suites

## Deployment & Routing

- **Host**: GitHub Pages (`https://mateusememe.github.io/whoami/`)
- **Router**: `<BrowserRouter basename={import.meta.env.BASE_URL}>` in [`src/App.tsx`](src/App.tsx).
- **Language URLs**: `/` (en), `/pt/`, `/es/` render the same `Index` ([`src/i18n/routes.ts`](src/i18n/routes.ts)). The URL sets the language; `LanguageRouteSync` in [`src/App.tsx`](src/App.tsx) replaces the URL when the language changes. Server and client must render the same tree.
- **Prerender & SPA Fallback**: `postbuild` runs `scripts/prerender.ts`: `dist/index.html`, `dist/pt/index.html` and `dist/es/index.html` get the rendered home page with their own `<html lang>` and head block, `dist/404.html` stays the empty shell. Components must not read browser state during their first render (see `docs/ARCHITECTURE.md` §9).
- **Generated Files**: the `seo:start`..`seo:end` block of `index.html` ([`src/seo/head.ts`](src/seo/head.ts), JSON-LD in [`src/seo/jsonld.ts`](src/seo/jsonld.ts)), `public/sitemap.xml`, `public/llms.txt`, `llms-full.txt`, `index{,.pt,.es}.md` and `resume{,.pt,.es}.json` are generated from `src/data/portfolio.ts` (predev/prebuild, or `npm run generate`). Do not edit them by hand. They are committed, and `seo.test.ts` / `llms.test.ts` fail when they drift, so after a data change bump `profile.updatedAt`, run `npm run generate` and commit the output.
- **Agent Tools**: [`src/agents/webmcp.ts`](src/agents/webmcp.ts) registers WebMCP tools on `document.modelContext` when the browser has it. Keep their output derived from the same data as the files.
