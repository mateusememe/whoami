# CLAUDE.md

This file provides key commands, architectural guidelines, and writing constraints for Claude Code when working in the `whoami` repository.

## Commands

```bash
# Development
npm run dev               # Start dev server with predev sitemap generation (port 8080)
npm run build             # Build production bundle with sitemap + 404.html SPA fallback
npm run preview           # Preview production build locally

# Validation
npm run typecheck         # TypeScript check (tsc --noEmit)
npm run lint              # ESLint check
npm test                  # Run Vitest test suite once
npm run test:watch        # Run Vitest in watch mode
```

## Architecture & File Structure

- **Data Layer**: [`src/data/portfolio.ts`](src/data/portfolio.ts) — Single source of truth for experiences, projects, skills, education, and social links.
- **i18n Layer**: [`src/i18n/translations.ts`](src/i18n/translations.ts) — Trilingual dictionary (`pt`, `en`, `es`).
- **State**: [`src/contexts/LanguageContext.tsx`](src/contexts/LanguageContext.tsx) — Language provider with `localStorage` sync.
- **Sections**: [`src/components/sections/`](src/components/sections/) — Modular sections (`HeroSection`, `AboutSection`, `ExperienceSection`, `EducationSection`, `SkillsSection`, `ProjectsSection`, `ContactFooter`).
- **Interactive Components**: [`src/components/ProfileCarousel.tsx`](src/components/ProfileCarousel.tsx) — Photo carousel with auto-play and pause on hover.
- **Dynamic Favicon**: [`src/components/Header.tsx`](src/components/Header.tsx) switches between `favicon-light.svg` (black) and `favicon-dark.svg` (white).
- **Tests**: [`src/test/`](src/test/) — Vitest + `@testing-library/react`. Canvas is mocked in [`src/test/setup.ts`](src/test/setup.ts).

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
- **SPA Fallback**: Handled via `postbuild: "cp dist/index.html dist/404.html"`.
