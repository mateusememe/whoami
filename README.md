# Mateus Mendonça Monteiro — Portfolio (`whoami`)

<div align="center">

[![CI](https://github.com/mateusememe/whoami/actions/workflows/ci.yml/badge.svg)](https://github.com/mateusememe/whoami/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/mateusememe/whoami/actions/workflows/deploy.yml/badge.svg)](https://github.com/mateusememe/whoami/actions/workflows/deploy.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Personal portfolio of Mateus Mendonça Monteiro — Backend Software Engineer specializing in scalable microservices, cloud systems, and data pipelines.**

[🌐 Live Portfolio](https://mateusememe.github.io/whoami) • [💼 LinkedIn](https://linkedin.com/in/mateus-men) • [🐙 GitHub](https://github.com/mateusememe) • [📧 Email](mailto:matt.mendon@gmail.com)

</div>

---

## ✨ Features

- 🌐 **Trilingual Localization (i18n)**: Instant switching between **Português (PT-BR)**, **English (EN)**, and **Español (ES)**. Each language has its own prerendered URL (`/`, `/pt/`, `/es/`), and the choice persists in `localStorage`.
- 🎬 **A presentation in scenes**: the page answers `whoami` scene by scene (name, statement, trajectory, degrees, stack, work, talks, contact), each with its own layout and its own 3D formation.
- 📄 **A page per project**: each of the 12 featured projects has its own prerendered URL in three languages (`/projects/<id>/`, `/pt/…`, `/es/…`) with the live cover at full width, facts, details and links. Opening a card morphs its cover into the page's cover (View Transitions), and the WebGL layer stays mounted across pages.
- 🎤 **Talks & workshops**: a timeline of the nine workshops given at Infoeste and DevFest Presidente Prudente (2022 to 2026), with links to the code, slides or event page.
- ⌨️ **Command palette (⌘K / Ctrl+K or `/`)**: jump to a section, a project page or a talk, copy the email, switch theme or language, open the profiles.
- 🛰️ **WebGL layer (three.js, custom GLSL)**: a service mesh with message packets, plus a particle field that morphs with the scroll between seven formations: haze, a dot-matrix portrait sampled from the profile photo, terrain, globe, tunnel, a sound wave and galaxy. A thin-lens model turns out-of-focus points into bokeh. Lazy-loaded, with quality tiers, adaptive resolution, a reduced-motion still frame and a 2D canvas fallback.
- 🧮 **Project covers that run the code**: each of the 12 gallery cards plays its own algorithm on a canvas (A* on the 8-puzzle, AVL rotations, Zhang-Suen thinning, Fuzzy C-Means, a nearest-neighbour search...). The other repositories and the merged open-source pull requests follow as rows.
- 🌊 **Motion layer**: Lenis smooth scrolling, scroll-linked CSS variables from one rAF loop, pinned scenes with `position: sticky`, word-by-word text, magnetic buttons, 3D tilt, a cursor ring, marquees and View Transitions for theme and language. Everything renders visible first and stops under `prefers-reduced-motion`.
- 🎨 **Design System**: fluid display type scale, one signal accent, glass surfaces, film grain, and typed primitives. See [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).
- 🌓 **Dark & Light Mode**: Modern glassmorphism UI with theme toggle and preference persistence.
- 📱 **Responsive and accessible**: checked on 20 viewports from 320×568 to 2560×1440, phones in both orientations included. Lighthouse (mobile): performance 93–94, accessibility, best practices and SEO 100.
- ⚡ **Performance**: hydration in a React transition, WebGL started on idle, the project page and the palette as lazy chunks, AVIF/WebP photos.
- 🔍 **SEO**:
  - 39 static pages (home and 12 project pages, in three languages), prerendered at build time and hydrated, each with its own title, description, canonical URL and `hreflang` links. The tab title follows client-side navigation.
  - JSON-LD: `WebSite`, `ProfilePage`, `Person` (talks as `Event`s) and an `ItemList` of `SoftwareSourceCode` on the home page; `SoftwareSourceCode` and `BreadcrumbList` on project pages.
  - `sitemap.xml` with language alternates, a share card per language (1200x630), `rel="me"` links, web manifest.
- 🤖 **Agent-ready (AXO / ARO)**:
  - `llms.txt` (llmstxt.org) with a key-facts list and links to the project pages and talks, `llms-full.txt` and Markdown profiles in PT/EN/ES.
  - JSON Resume (`resume.json`, `resume.pt.json`, `resume.es.json`), with project highlights and talks.
  - WebMCP tools on every page (`get_profile`, `list_projects`, `list_talks`, `get_contact`, `go_to_section`) for browser agents that support `document.modelContext`.
  - Every one of these files is generated from the portfolio data, and the tests fail when they drift.
- 🧪 **Automated Testing**: Vitest + Testing Library suites for context state, internationalization, navigation, section rendering, design-system primitives, WebGL scene generation, hydration, SEO metadata and agent files.
- 🚀 **Full CI/CD Automation**:
  - **CI Workflow**: Automatic typechecking, linting, testing, and production build checks on pull requests and pushes.
  - **Deploy Workflow**: Automated zero-config deployment to **GitHub Pages**.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Build & Tooling** | [Vite 5](https://vitejs.dev/), [SWC](https://swc.rs/), [TSX](https://github.com/privatenumber/tsx) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/), Glassmorphism, [Lucide React Icons](https://lucide.dev/) |
| **3D / Graphics** | [three.js](https://threejs.org/) (WebGL 2, custom GLSL shaders), Canvas 2D sketches |
| **Motion** | [Lenis](https://lenis.darkroom.engineering/), CSS scroll-linked variables, View Transitions API, Web Animations API |
| **Fonts** | Space Grotesk, JetBrains Mono, Instrument Serif (self-hosted via [Fontsource](https://fontsource.org/)) |
| **State & Data** | React Context API (`LanguageContext`), `localStorage` sync |
| **Routing** | [React Router v6](https://reactrouter.com/) |
| **Testing** | [Vitest](https://vitest.dev/), [@testing-library/react](https://testing-library.com/), JSDOM |
| **CI / CD** | [GitHub Actions](https://github.com/features/actions), [GitHub Pages](https://pages.github.com/) |

---

## 📂 Project Architecture

System design (runtime layers, WebGL engine, data flow, performance budget, failure modes): [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

```
whoami/
├── .github/
│   └── workflows/
│       ├── ci.yml               # Automated CI (lint, typecheck, tests, build)
│       └── deploy.yml           # Automated deployment to GitHub Pages
├── public/
│   ├── favicon.ico              # Site favicon
│   ├── llms.txt, llms-full.txt  # Generated: llmstxt.org index and full profile
│   ├── index{,.pt,.es}.md       # Generated: Markdown profile per language
│   ├── resume{,.pt,.es}.json    # Generated: JSON Resume per language
│   ├── site.webmanifest         # Web app manifest
│   ├── robots.txt               # Web crawler instructions
│   └── sitemap.xml              # Generated: three language URLs with alternates
├── scripts/
│   ├── generate-head.ts         # Rewrites the SEO block of index.html
│   ├── generate-sitemap.ts      # Writes public/sitemap.xml
│   ├── generate-llms.ts         # Writes the agent files to public/
│   ├── render-og-image.ts       # Renders the share card per language (npm run og:image)
│   └── prerender.ts             # Renders all 39 pages after the build
├── src/
│   ├── agents/                      # WebMCP tools for browser agents
│   ├── components/
│   │   ├── covers/                  # Project cover sketches and their algorithms
│   │   ├── ds/                      # Design system primitives (Section, Surface, Tag, ...)
│   │   ├── motion/                  # SmoothScroll, ScrubText, Marquee, Magnetic, Tilt, Cursor, ...
│   │   ├── scene/
│   │   │   ├── SceneBackground.tsx  # WebGL / 2D fallback selector
│   │   │   └── WebGLBackground.tsx  # Lazy three.js mount
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx      # Intro & social links
│   │   │   ├── AboutSection.tsx     # Bio & summary
│   │   │   ├── ExperienceSection.tsx# Career timeline & tech tags
│   │   │   ├── EducationSection.tsx # Academic degrees
│   │   │   ├── SkillsSection.tsx    # Core competencies & tech stack
│   │   │   ├── ProjectsSection.tsx  # Gallery, more projects, open-source contributions
│   │   │   ├── TalksSection.tsx     # Talks & workshops timeline
│   │   │   └── ContactFooter.tsx    # Contact channels & footer
│   │   ├── CommandPalette.tsx       # ⌘K listener (the panel is a lazy chunk)
│   │   ├── SiteLayout.tsx           # Shell shared by every page
│   │   ├── BinaryBackground.tsx     # 2D canvas fallback background
│   │   ├── ScrollProgress.tsx       # Header reading-progress bar
│   │   └── Header.tsx               # Nav with scroll spy, theme/lang switchers
│   ├── contexts/
│   │   └── LanguageContext.tsx      # i18n context provider & state
│   ├── data/
│   │   ├── navigation.ts            # Section order (nav + heading indexes)
│   │   ├── portfolio.ts             # Typed data (jobs, projects, talks, skills, socials)
│   │   └── projectPages.ts          # Project page content (lazy)
│   ├── hooks/
│   │   └── useLanguage.ts           # useLanguage consumer hook
│   ├── i18n/
│   │   ├── routes.ts                # Pages and URLs (/, /pt/, /es/, /projects/<id>/)
│   │   └── translations.ts          # PT / EN / ES dictionary
│   ├── motion/                      # rAF ticker, scroll store, progress, scene director
│   ├── lib/
│   │   ├── motion.ts                # damp, scroll progress (DOM + WebGL)
│   │   └── utils.ts                 # ClassName merging utilities (cn)
│   ├── pages/
│   │   ├── Index.tsx                # Home page (the scenes)
│   │   ├── ProjectPage.tsx          # One featured project (lazy chunk)
│   │   └── NotFound.tsx             # 404 error page
│   ├── seo/                         # Head block, JSON-LD, sitemap, llms.txt, JSON Resume
│   ├── test/
│   │   ├── setup.ts                 # Test environment setup & mocks
│   │   ├── Header.test.tsx          # Navigation & controls unit tests
│   │   ├── LanguageContext.test.tsx # i18n & localStorage unit tests
│   │   ├── NotFound.test.tsx        # 404 page test
│   │   └── PortfolioSections.test.tsx# Sections rendering test
│   ├── webgl/
│   │   ├── core/                    # Engine, capabilities, input, governor, palette
│   │   └── scene/                   # Graph and particle buffers, GLSL shaders, MeshScene, ParticleField
│   ├── App.tsx                      # Root application & providers
│   ├── index.css                    # Design tokens, fonts & Tailwind layers
│   └── main.tsx                     # React DOM entry point
├── docs/
│   ├── ARCHITECTURE.md              # System design
│   └── DESIGN_SYSTEM.md             # Tokens, primitives, WebGL art direction
├── eslint.config.js                 # ESLint flat config
├── package.json                     # Project manifest & scripts
├── tailwind.config.ts               # Tailwind CSS theme extension
├── tsconfig.json                    # TypeScript compiler configuration
├── vite.config.ts                   # Vite bundler configuration
└── vitest.config.ts                 # Vitest test runner configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (version **18.x or 20.x+**) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mateusememe/whoami.git
   cd whoami
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the local development server:
```bash
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Regenerates the head block, sitemap and agent files, then starts the Vite development server on port 8080. |
| `npm run build` | Regenerates the same files, builds the client and server bundles into `/dist` and prerenders `/`, `/pt/` and `/es/`. |
| `npm run generate` | Rewrites the SEO block of `index.html`, `public/sitemap.xml` and the agent files from the portfolio data. |
| `npm run og:image` | Renders the share cards (`og-image.png`, `.pt.png`, `.es.png`) in headless Chrome. Run it when the name, role or photo changes. |
| `npm run preview` | Locally serves the production build from `/dist`. |
| `npm test` | Runs the Vitest test suite once. |
| `npm run test:watch`| Runs the Vitest test suite in interactive watch mode. |
| `npm run typecheck` | Validates TypeScript types across the entire project with `tsc --noEmit`. |
| `npm run lint` | Runs ESLint to check code quality and formatting rules. |

---

## 🚢 CI/CD & Deployment

### GitHub Pages (Automated)

This repository includes a continuous deployment workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To enable automated deployment on GitHub:
1. Go to your repository on GitHub: **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Every push to the `main` branch will automatically build and publish the site to:
   ```
   https://mateusememe.github.io/whoami/
   ```

### Custom Domain

To configure a custom domain (e.g. `mateus.dev`):
1. In repository **Settings** → **Pages** → **Custom domain**, enter your domain name.
2. Update `VITE_SITE_URL` in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) or set repository secrets.

---

## ✏️ Customization Guide

- **Resume Data**: Update job roles, dates, company descriptions, skills, and projects in [`src/data/portfolio.ts`](src/data/portfolio.ts).
- **Translations**: Add or adjust strings in [`src/i18n/translations.ts`](src/i18n/translations.ts).
- **Social Links**: Manage URLs and contact info in [`src/data/portfolio.ts`](src/data/portfolio.ts).
- **SEO & Meta Tags**: Titles and descriptions are the `seo.*` keys in [`src/i18n/translations.ts`](src/i18n/translations.ts). The SEO block of [`index.html`](index.html), the sitemap and the files in `public/` are generated: after changing data, bump `profile.updatedAt` in [`src/data/portfolio.ts`](src/data/portfolio.ts) and run `npm run generate`.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Crafted with passion by <a href="https://github.com/mateusememe">Mateus Mendonça Monteiro</a></sub>
</div>
