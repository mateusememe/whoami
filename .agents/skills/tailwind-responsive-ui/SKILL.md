---
name: tailwind-responsive-ui
description: Responsive UI transformation patterns for Tailwind CSS applications. Use when making interfaces responsive, refactoring layouts for multiple screen sizes, or auditing responsive Tailwind code.
metadata:
  trigger: Responsive design, Tailwind CSS layouts, mobile-first refactoring, breakpoints audit
  author: pproenca
---

# Tailwind Responsive UI — Patterns & Guidelines

This skill provides practical rules, patterns, and checklists for building and auditing responsive user interfaces with Tailwind CSS.

---

## 1. Mobile-First Breakpoint Strategy

Tailwind is mobile-first by default. Unprefixed utilities apply to all screen sizes (mobile up), while prefixed utilities apply at that breakpoint and above.

| Prefix | Min Width | Target Devices | Typical Layout Usage |
|:---|:---|:---|:---|
| *(default)* | `< 640px` | Phones (portrait) | Single-column, stacked layout, full-width cards, compact padding |
| `sm:` | `640px` | Large phones, phablets | 2-column grids, horizontal controls |
| `md:` | `768px` | Tablets (portrait) | Multi-column, desktop navigation bar, expanded typography |
| `lg:` | `1024px` | Laptops, tablets (landscape) | 3-column grids, sidebars, expanded spacing |
| `xl:` | `1280px` | Desktops | Maximum content width constraint (`max-w-6xl` or `container`) |
| `2xl:` | `1536px` | Ultra-wide displays | Centered container with generous margin |

### Rules:
- **Never override mobile with desktop defaults**: Define base styles for mobile, then add `sm:`, `md:`, `lg:` as layout expands.
- **Avoid arbitrary breakpoints**: Stick to standard Tailwind breakpoints (`sm`, `md`, `lg`, `xl`) for predictability.

---

## 2. Spacing, Padding & Margins

- **Fluid / Responsive Spacing**: Use smaller padding on mobile and expand on larger viewports:
  - Section vertical padding: `py-16 sm:py-20 md:py-24`
  - Container horizontal padding: `px-4 sm:px-6 md:px-8`
  - Grid / Flex gaps: `gap-3 sm:gap-4 md:gap-6`
  - Card internal padding: `p-4 sm:p-6 md:p-8`

---

## 3. Typography & Heading Hierarchy

- **Responsive Font Sizes**:
  - Main H1 / Hero: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight`
  - Section Headings H2: `text-xl sm:text-2xl md:text-3xl font-bold`
  - Subheadings / Badges: `text-xs sm:text-sm font-mono`
  - Body Text: `text-sm sm:text-base leading-relaxed`
- **Line Length**: Constrain paragraphs with `max-w-prose` or `max-w-xl` / `max-w-2xl` to maintain readable line lengths (45–75 characters per line).

---

## 4. Layouts, Grids & Flexbox

- **Grid Column Progression**:
  - `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6`
- **Flex Direction Switching**:
  - `flex flex-col sm:flex-row items-center justify-between gap-4`
- **Overflow & Scrolling**:
  - Prevent horizontal scrollbars: ensure no element exceeds `100vw` or has unconstrained fixed widths.
  - For horizontally scrollable elements (e.g. badge lists, tables), use `overflow-x-auto scrollbar-none` with edge padding.

---

## 5. Touch Targets & Interactivity

- **Minimum Hit Areas**: Ensure all interactive buttons, links, and switches have at least `44x44px` touch target on mobile (`min-h-[44px] min-w-[44px]` or adequate padding `p-2.5 sm:p-2`).
- **Touch vs Hover**:
  - Always pair `:hover` states with `:focus-visible` and active touch states.
  - Do not hide critical actions behind hover-only triggers on mobile (`group-hover:opacity-100` must have a mobile-accessible alternative or tap reveal).

---

## 6. Mobile Navigation & Headers

- Fixed headers must have high `z-index` (`z-50`) and backdrop blur (`backdrop-blur-md`).
- Navigation links on desktop (`hidden md:flex`) should collapse gracefully into accessible mobile menus or compact bottom navigation bars on small screens.

---

## 7. Verification & Audit Checklist

1. [ ] **320px (Small Mobile)**: No horizontal overflow, readable font sizes, buttons easily tappable.
2. [ ] **375px–414px (Standard Mobile)**: Balanced spacing, cards stack vertically with proper gap.
3. [ ] **768px (Tablet)**: Navigation visible, grids switch to 2 columns, hero photo and text balanced.
4. [ ] **1024px+ (Desktop)**: Max container width constrained (`container mx-auto`), multi-column grids aligned.
5. [ ] **Theme Transitions**: Dark/light mode colors have proper contrast on every viewport.
