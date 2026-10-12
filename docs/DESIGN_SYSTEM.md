# Design System

Visual language for `whoami`. Tokens live in [`src/index.css`](../src/index.css) and [`tailwind.config.ts`](../tailwind.config.ts). Primitives live in [`src/components/ds/`](../src/components/ds/). The WebGL scene reads the same tokens, so the DOM and the canvas always agree. Runtime and engine details are in [ARCHITECTURE.md](ARCHITECTURE.md).

## 1. Principles

1. **Grayscale base, one signal hue.** Everything is neutral gray except `signal`, which marks live state: the current role, the active nav item, packets moving through the mesh, focus. If everything is teal, nothing is.
2. **Mono for data, sans for prose.** Dates, tech names, repo names and indexes use JetBrains Mono. Sentences use Space Grotesk.
3. **Glass over depth.** Content sits on blurred glass surfaces above a 3D scene. The scene gives depth; the surfaces keep text readable.
4. **Motion has a job.** Motion shows state (reveal on enter, active nav, reading progress, current role pulse) or gives the background life. With `prefers-reduced-motion`, all of it stops.

## 2. Tokens

### 2.1 Color

HSL triples without `hsl()`, shadcn style, so Tailwind can apply alpha (`bg-signal/10`).

| Token | Light | Dark | Use |
| :--- | :--- | :--- | :--- |
| `--background` | `0 0% 94%` | `0 0% 8%` | Page |
| `--foreground` | `0 0% 13%` | `0 0% 85%` | Headings, primary text, WebGL nodes |
| `--muted-foreground` | `0 0% 40%` | `0 0% 55%` | Body copy, metadata |
| `--accent` | `0 0% 85%` | `0 0% 18%` | Tag fill, hover fill |
| `--border` | `0 0% 85%` | `0 0% 18%` | Hairlines, used at /30 to /70 |
| `--glass-bg` | `0 0% 96% / 0.6` | `0 0% 12% / 0.6` | Surface fill |
| `--signal` | `174 78% 26%` (`#0f766c`) | `172 66% 52%` (`#34d5c0`) | Live state, see rules below |
| `--signal-foreground` | `0 0% 98%` | `0 0% 8%` | Text on a solid signal fill |

Contrast against `--background` (WCAG 2.x):

| Pair | Light | Dark |
| :--- | ---: | ---: |
| foreground | 14.1 : 1 | 13.0 : 1 |
| muted-foreground | 5.0 : 1 | 5.5 : 1 |
| signal | 4.8 : 1 | 10.0 : 1 |

All pass AA for body text. `--muted-foreground` in light mode moved from 45% to 40% lightness to get there (it was 4.2 : 1).

**Signal rules**

- Use it for: section indexes (`01`), the active nav underline, the current-role timeline node and date, the header progress bar, active pagination dots, focus outlines, text selection, WebGL gateways, backbone links and packets.
- Tints: `/10` fill with `/25` border for a badge, `/30` for a hover border, `/80` for a bar.
- Never use it for paragraphs or for more than one element per card.

### 2.2 Typography

| Role | Family | Size (mobile → sm) | Weight | Classes |
| :--- | :--- | :--- | :--- | :--- |
| Display (h1) | Space Grotesk | 30 → 36 → 48 px | 700 | `text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight` |
| Section title (h2) | Space Grotesk | 20 → 24 px | 700 | via `SectionHeading` |
| Card title (h3) | Space Grotesk | 16 → 18 px | 600 | `font-display font-semibold text-base sm:text-lg` |
| Body | Space Grotesk | 12 → 14 px | 400 | `text-xs sm:text-sm leading-relaxed text-muted-foreground` |
| Overline | JetBrains Mono | 12 px | 400 | `font-mono text-xs uppercase tracking-wider` |
| Data (dates, tags, repos) | JetBrains Mono | 10 → 12 px | 500 | `font-mono text-[10px] sm:text-[11px]` |
| Index | JetBrains Mono | 12 px | 500 | `font-mono text-xs tabular-nums text-signal` |

### 2.3 Layout and spacing

| Token | Value |
| :--- | :--- |
| Reading column | `container max-w-3xl` (768 px) |
| Section padding | `py-8 sm:py-10 md:py-12 px-4 sm:px-6` (inside `Section`) |
| Heading to content | `mb-4 sm:mb-6` |
| Card stack gap | `space-y-3.5 sm:space-y-4` |
| Scroll offset for anchors | `scroll-padding-top: 4.5rem` (clears the fixed header) |

### 2.4 Radius

| Token | Value | Use |
| :--- | :--- | :--- |
| `rounded-2xl` | 16 px | Surfaces |
| `rounded-xl` | 12 px | Large icon buttons, link chips |
| `rounded-lg` | `--radius` 12 px | Small icon buttons |
| `rounded-md` | 10 px | Box tags |
| `rounded-full` | | Pill tags, dots, timeline nodes |

### 2.5 Surfaces and layers

| Layer | z-index | Content |
| :--- | :--- | :--- |
| Background | `z-0` | WebGL canvas or 2D fallback, `pointer-events: none` |
| Content | `z-10` | Sections |
| Header | `z-50` | Fixed glass bar with progress hairline |

`.glass-card` = `--glass-bg` fill + `backdrop-filter: blur(var(--surface-blur))` (16 px) + 1 px border. Always use it through `Surface`.

### 2.6 Motion

| Token | Value | Tailwind | Use |
| :--- | :--- | :--- | :--- |
| `--ease-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | `ease-expo` | Default easing: fast start, long settle |
| `--duration-fast` | 150 ms | `duration-fast` | Color changes on hover |
| `--duration-base` | 300 ms | `duration-base` | Underlines, dots, spotlight |
| `--duration-slow` | 700 ms | `duration-slow` | Section reveal, canvas fade-in |

Keyframes: `signal-pulse` (current-role node, 2.4 s), `caret-blink` (hero prompt, 1.1 s, stepped).

Under `prefers-reduced-motion: reduce`, `index.css` sets every animation and transition to 0.01 ms and disables smooth scroll, both carousels stop autoplay (`usePrefersReducedMotion`), and the WebGL engine renders one still frame.

## 3. Primitives

Import from `@/components/ds`.

### `Section`

Page section shell: anchor id, reading column, numbered heading, reveal on enter.

```tsx
<Section id="skills" index={sectionIndex("skills")} title={t("skills.title")}>
  ...
</Section>

<Section
  as="footer"
  id="contact"
  index={sectionIndex("contact")}
  title={t("contact.title")}
  description={t("contact.cta")}
  align="center"
>
```

| Prop | Type | Notes |
| :--- | :--- | :--- |
| `id` | string | Anchor target; heading gets `${id}-title` |
| `index` | number | Use `sectionIndex()` from `data/navigation.ts`, never a literal |
| `title`, `description` | string | Already translated |
| `actions` | ReactNode | Right side of the heading row (carousel arrows) |
| `align` | `"start" \| "center"` | |
| `as` | `"section" \| "footer"` | |

### `Surface`

Glass card.

```tsx
<Surface as="article" padding="lg" interactive>...</Surface>
```

| Prop | Values | Default |
| :--- | :--- | :--- |
| `as` | any element | `div` |
| `padding` | `sm` (16→20) · `md` (20→24) · `lg` (20→24→32) | `md` |
| `interactive` | adds hover border and a signal spotlight that follows the pointer | `false` |

Use `interactive` on cards that respond to hover (experience, projects, education). Leave it off on containers (tag groups).

### `Tag` / `TagList`

```tsx
<TagList items={exp.tech} label="Tecnologias utilizadas" />
<TagList items={p.tech} label="Tecnologias do projeto" tone="subtle" shape="box" />
<Tag tone="signal">Live</Tag>
```

| Prop | Values | Default |
| :--- | :--- | :--- |
| `tone` | `solid` · `subtle` · `signal` | `solid` |
| `size` | `xs` (mono, tech names) · `sm` (sans, skills) | `xs` |
| `shape` | `pill` · `box` | `pill` |

`TagList` renders a labelled `<ul>`, so screen readers announce the count.

### `IconButton`

```tsx
<IconButton onClick={handleNext} aria-label="Próximo projeto"><ChevronRight size={16} /></IconButton>

<IconButton asChild tone="outline" size="lg" aria-label="GitHub">
  <a href="https://github.com/mateusememe">...</a>
</IconButton>
```

| Prop | Values | Default |
| :--- | :--- | :--- |
| `tone` | `soft` · `outline` · `ghost` | `soft` |
| `size` | `sm` (32) · `md` (36→32) · `lg` (40→44) | `sm` |
| `asChild` | style a child `<a>` instead of rendering `<button>` | `false` |
| `aria-label` | required by the type | |

### `PaginationDots`

```tsx
<PaginationDots
  count={projects.length}
  active={activeIndex}
  onSelect={scrollToIndex}
  label="Navegação dos projetos"
  getItemLabel={(i) => `Ir para projeto ${i + 1}: ${projects[i].name}`}
/>
```

`tone="inverse"` for dots over photos. The hit area extends 10 px above and below the 6 px dot.

### `Reveal`

Fades and lifts children 14 px the first time they enter the viewport. It renders visible (prerendered HTML reads without JavaScript); after mount it hides only content that starts below the fold. `Section` already wraps its content in one; use it directly only outside sections.

## 4. Patterns

| Pattern | Where | Composition |
| :--- | :--- | :--- |
| Numbered sections | All sections | `Section` + `NAV_ITEMS` order |
| Scroll spy | Header | `useActiveSection(NAV_ITEMS)` → `aria-current` + signal underline |
| Reading progress | Header | `ScrollProgress`, 1 px signal bar |
| Timeline | Experience | `<ol>` with a gradient rail; signal pulsing node and date for the role whose period ends in "Present" |
| Carousel | Projects, hero photo | Scroll-snap track + `IconButton` arrows + `PaginationDots`, pauses on hover, focus and touch |
| Prompt line | Hero | `$ whoami` in mono with a blinking block caret, `aria-hidden` |

## 5. WebGL art direction

The background renders the owner's field: a distributed system.

| Element | Meaning | Look |
| :--- | :--- | :--- |
| Gateway node | A service | Large soft dot in signal color with a pulsing ring |
| Pod node | An instance | Small soft dot in foreground color, slow pulse |
| Backbone edge | Service-to-service link | Hairline tinted toward signal |
| Local edge | Pod-to-gateway link | Fainter foreground hairline |
| Packet | A message in flight | Bright signal dot moving along an edge, fading at both ends |
| Binary field | The original binary rain, now in 3D | Falling `0`/`1` sprites behind the mesh, static while the mesh spins (parallax) |

**Choreography by scroll** (0 = top, 1 = bottom):

- Mesh turns 1.1 π around y over the page and tilts 0.25 rad.
- Camera descends 1.5 units and dollies in up to 3.5 units at mid page, then back out by the contact section.
- Mesh opacity eases from 100% to 60% over the first 12% of the scroll, so it sits behind reading content without competing.
- Pointer adds parallax on desktop only (touch input is ignored).

**Per-theme opacity** (`LAYER_OPACITY` in `MeshScene.ts`):

| Layer | Dark | Light |
| :--- | ---: | ---: |
| Nodes | 0.90 | 0.70 |
| Edges | 0.20 | 0.18 |
| Packets | 1.00 | 0.90 |
| Glyphs | 0.17 | 0.13 |

Dark mode uses additive blending for nodes and packets (glow). Light mode uses normal blending.

**Portrait screens** (aspect < 0.8): the layout turns 90° so the wide constellation runs vertically.

## 6. Accessibility checklist

- [ ] Text meets 4.5 : 1 against its background (see §2.1).
- [ ] Icon-only controls have `aria-label` (`IconButton` requires it).
- [ ] Focus is visible: global `:focus-visible` uses a 2 px signal outline.
- [ ] Decorative elements (`$ whoami`, timeline nodes, canvases) are `aria-hidden`.
- [ ] Every animation stops under `prefers-reduced-motion`.
- [ ] Lists of things are real lists (`TagList`, social links, timeline).

## 7. Do and don't

| Do | Don't |
| :--- | :--- |
| Build cards with `Surface` | Re-type `glass-card rounded-2xl border ...` |
| Take section numbers from `sectionIndex()` | Hard-code `01` |
| Use signal for one live element per card | Color headings or paragraphs with signal |
| Use the motion tokens (`duration-base ease-expo`) | Use ad-hoc `duration-500` |
| Add new copy to `translations.ts` in pt, en and es | Ship a string in one language |
