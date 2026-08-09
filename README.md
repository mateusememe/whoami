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

- 🌐 **Trilingual Localization (i18n)**: Seamless instant switching between **Português (PT-BR)**, **English (EN)**, and **Español (ES)**, with persistent `localStorage` memory.
- ⚡ **Interactive Binary Matrix Canvas**: Lightweight HTML5 Canvas effect rendering animated binary code streams that automatically adapt to light/dark themes and viewport resizing.
- 🌓 **Dark & Light Mode**: Modern glassmorphism UI with theme toggle and preference persistence.
- 📱 **100% Responsive Design**: Fluid layout tailored for mobile, tablet, and desktop viewports.
- 🔍 **SEO & AI Crawler Optimized**:
  - Semantic HTML5 with structured JSON-LD `Person` metadata.
  - Automated `sitemap.xml` generation on build.
  - `robots.txt` and `llms.txt` crawler context for AI models and search engines.
- 🧪 **Comprehensive Automated Testing**: Full Vitest + Testing Library test suites verifying context state, internationalization, navigation, and section rendering.
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
| **State & Data** | React Context API (`LanguageContext`), `localStorage` sync |
| **Routing** | [React Router v6](https://reactrouter.com/) |
| **Testing** | [Vitest](https://vitest.dev/), [@testing-library/react](https://testing-library.com/), JSDOM |
| **CI / CD** | [GitHub Actions](https://github.com/features/actions), [GitHub Pages](https://pages.github.com/) |

---

## 📂 Project Architecture

```
whoami/
├── .github/
│   └── workflows/
│       ├── ci.yml               # Automated CI (lint, typecheck, tests, build)
│       └── deploy.yml           # Automated deployment to GitHub Pages
├── public/
│   ├── favicon.ico              # Site favicon
│   ├── llms.txt                 # AI agent crawler summary
│   ├── placeholder.svg          # SVG asset
│   ├── robots.txt               # Web crawler instructions
│   └── sitemap.xml              # Generated sitemap
├── scripts/
│   └── generate-sitemap.ts      # Automated sitemap generator script
├── src/
│   ├── components/
│   │   ├── background/
│   │   │   └── BinaryBackground.tsx # Interactive matrix canvas background
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx      # Intro & social links
│   │   │   ├── AboutSection.tsx     # Bio & summary
│   │   │   ├── ExperienceSection.tsx# Career timeline & tech tags
│   │   │   ├── EducationSection.tsx # Academic degrees
│   │   │   ├── SkillsSection.tsx    # Core competencies & tech stack
│   │   │   ├── ProjectsSection.tsx  # Featured projects
│   │   │   └── ContactFooter.tsx    # Contact channels & footer
│   │   ├── ui/                      # Core UI primitives (toast, tooltip, etc.)
│   │   ├── BinaryBackground.tsx
│   │   └── Header.tsx               # Top navigation with theme/lang switchers
│   ├── contexts/
│   │   └── LanguageContext.tsx      # i18n context provider & state
│   ├── data/
│   │   └── portfolio.ts             # Typed resume data (jobs, skills, socials)
│   ├── hooks/
│   │   ├── useLanguage.ts           # useLanguage consumer hook
│   │   └── use-toast.ts             # Toast notification hook
│   ├── i18n/
│   │   └── translations.ts          # PT / EN / ES dictionary
│   ├── lib/
│   │   └── utils.ts                 # ClassName merging utilities (cn)
│   ├── pages/
│   │   ├── Index.tsx                # Main single-page portfolio view
│   │   └── NotFound.tsx             # 404 error page
│   ├── test/
│   │   ├── setup.ts                 # Test environment setup & mocks
│   │   ├── Header.test.tsx          # Navigation & controls unit tests
│   │   ├── LanguageContext.test.tsx # i18n & localStorage unit tests
│   │   ├── NotFound.test.tsx        # 404 page test
│   │   └── PortfolioSections.test.tsx# Sections rendering test
│   ├── App.tsx                      # Root application & providers
│   ├── index.css                    # Design tokens, fonts & Tailwind layers
│   └── main.tsx                     # React DOM entry point
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
| `npm run dev` | Runs predev sitemap generator and starts the Vite development server on port 8080. |
| `npm run build` | Runs prebuild sitemap generator and compiles the production bundle into `/dist`. |
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
- **SEO & Meta Tags**: Customize title and descriptions in [`index.html`](index.html) and [`public/llms.txt`](public/llms.txt).

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Crafted with passion by <a href="https://github.com/mateusememe">Mateus Mendonça Monteiro</a></sub>
</div>
