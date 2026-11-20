# Design System

Visual language for `whoami`. Tokens live in [`src/index.css`](../src/index.css) and [`tailwind.config.ts`](../tailwind.config.ts). Primitives live in [`src/components/ds/`](../src/components/ds/), motion components in [`src/components/motion/`](../src/components/motion/). The WebGL scene reads the same tokens, so the DOM and the canvas always agree. Runtime and engine details are in [ARCHITECTURE.md](ARCHITECTURE.md).

## 1. Principles

1. **A presentation, in scenes.** The page answers `whoami` one scene at a time: name, statement, trajectory, degrees, stack, work, contact. Each scene has its own layout and its own formation in the 3D layer. Cards stacked in a column read as a résumé; scenes read as a person.
2. **Grayscale base, one signal hue.** Everything is neutral gray except `signal`, which marks live state: the current role, the active nav item, packets moving through the mesh, focus. If everything is teal, nothing is.
3. **Type carries the page.** Display sizes scale with the viewport. Space Grotesk sets names and titles, JetBrains Mono sets data, and Instrument Serif italic marks roles, degrees and numerals.
4. **Real materials.** Glass surfaces blur what is behind them and catch a highlight on their top edge. The particle field has a focal plane, so points off it turn into soft bokeh. Film grain sits over everything.
5. **Motion has a job.** Motion either shows state (reveal on enter, active nav, reading progress) or ties the scroll to the scene (words lighting up, formations morphing). With `prefers-reduced-motion`, all of it stops and the content stays.

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

- Use it for: section indexes (`01`), the active nav pill, the current-role marker and date, the reading progress bar, active pagination dots, focus outlines, text selection, the cursor ring, the moving part of each project cover, WebGL gateways, backbone links and packets.
- Tints: `/10` fill with `/25` border for a badge, `/30` for a hover border, `/80` for a bar.
- Never use it for paragraphs or for more than one element per card.

### 2.2 Typography

Fonts are self-hosted through Fontsource (no third-party request). The latin subset of the display font is preloaded from the built HTML.

| Token | Size | Use |
| :--- | :--- | :--- |
| `text-display-2xl` | `clamp(3.1rem, min(12vw, 16.5svh), 13rem)` | Hero name, closing band, 404 |
| `text-display-xl` | `clamp(2.6rem, 8vw, 8rem)` | Section titles, stat numbers, skill bands |
| `text-display-lg` | `clamp(1.9rem, 5.2vw, 4.75rem)` | Titles that share a row (Experience, Projects) |
| `text-display-md` | `clamp(1.6rem, 3.4vw, 3.1rem)` | Company and school names |
| `text-display-sm` | `clamp(1.2rem, 2vw, 1.75rem)` | Stack items, contact rows |
| `text-body-lg` | `clamp(1.0625rem, 1.2vw, 1.25rem)` | Paragraphs |
| `.label` | 11 px mono, uppercase, 0.18em tracking | Kickers, metadata, captions |

| Family | Class | Carries |
| :--- | :--- | :--- |
| Space Grotesk Variable | `font-display` / `font-body` | Names, titles, sentences |
| JetBrains Mono Variable | `font-mono` | Dates, tech names, repo names, indexes, labels |
| Instrument Serif Italic | `font-serif italic` | Role and degree lines, project numerals, the seal figure |

The hero size also depends on viewport height (`svh`), so the name, the photo and the summary fit one screen on a short laptop.

### 2.3 Layout and spacing

| Token | Value | Use |
| :--- | :--- | :--- |
| `.shell` | max `--shell-max` (1480 px), inline padding `--gutter` | Every section's content box |
| `--gutter` | `clamp(1.25rem, 4.2vw, 4rem)` | Side padding; also `px-gutter` |
| `--section-y` | `clamp(5.5rem, 14vh, 11rem)` | Vertical rhythm: `py-section`, `my-section` |
| Grid | 12 columns from `lg` | Split layouts (5/7 in Experience, 7/5 in About) |
| `--header-h` | 4.25 rem | `scroll-padding-top` for native anchor jumps |

### 2.4 Radius

| Token | Value | Use |
| :--- | :--- | :--- |
| `rounded-[2rem]` | 32 px | Photo card, award card |
| `rounded-[1.75rem]` | 28 px | Project cards |
| `rounded-full` | | Header pills, icon buttons, tags, dots |
| `rounded-md` | 10 px | Box tags |

### 2.5 Surfaces and layers

| Layer | z-index | Content |
| :--- | :--- | :--- |
| Background | `z-0` | WebGL canvas or 2D fallback, `pointer-events: none` |
| Content | `z-10` | Sections |
| Mobile menu | `z-40` | Full-screen dialog |
| Header | `z-50` | Floating pills and the reading progress hairline |
| Grain | `z-[60]` | Film grain, `pointer-events: none` |
| Cursor | `z-[70]` | Pointer ring |

`.glass-card` = `--glass-bg` fill + `backdrop-filter: blur(var(--surface-blur)) saturate(1.2)` + 1 px border + an inset top highlight (`--glass-highlight`) + a soft drop shadow. The 3D layer shows through as blurred light, which is the point.

`.grain` is one oversized SVG noise tile, shifted in six steps on the compositor. `--grain-opacity` is 0.055 light, 0.075 dark.

### 2.6 Motion

| Token | Value | Tailwind | Use |
| :--- | :--- | :--- | :--- |
| `--ease-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | `ease-expo` | Default: fast start, long settle |
| `--ease-quint` | `cubic-bezier(0.22, 1, 0.36, 1)` | `ease-quint` | View transitions |
| `--ease-in-out` | `cubic-bezier(0.76, 0, 0.24, 1)` | `ease-swift` | Loops (scroll cue), menu exit |
| `--duration-fast` | 150 ms | `duration-fast` | Color on hover |
| `--duration-base` | 300 ms | `duration-base` | Pills, dots, cursor ring |
| `--duration-slow` | 700 ms | `duration-slow` | Reveals, row hovers, header hide |
| `--duration-slower` | 1100 ms | `duration-slower` | Mask reveals, photo wipe |

Motion by what drives it:

| Kind | Driver | Examples |
| :--- | :--- | :--- |
| Entrance | CSS keyframes on first paint | Hero letters rise line by line, photo unclips, rule draws |
| Reveal | `IntersectionObserver`, once | Titles rise out of a mask, rows stagger in, counters run |
| Scroll-linked | `--progress` from the shared ticker | Hero recedes, About words light up, year marker, role focus, project track |
| Pointer | pointer position, damped | Cursor ring, magnetic buttons, 3D tilt and glare, particle push |
| Ambient | time | Marquee bands, seal rotation, grain, project covers, the 3D scene |

Under `prefers-reduced-motion: reduce`: animations and transitions take 0.01 ms, smooth scrolling and Lenis are off, the cursor ring, magnets and tilt do nothing, scrubbed text is fully lit and focused roles do not shift, carousels and marquees stand still, the project gallery becomes a plain scroll strip, covers draw one frame, and the WebGL engine renders one dimmed still.

## 3. Primitives

Import from `@/components/ds`.

### `Section` and `SectionHeading`

Section shell: anchor id, `.shell`, display heading, and the particle formation for the scene.

```tsx
<Section id="education" index={sectionIndex("education")} title={t("edu.title")} scene={3}>
  ...
</Section>

// Custom layouts compose the heading directly:
<SectionHeading id="experience-title" index={2} title={t("exp.title")} description={lead} size="lg" />
```

| Prop | Type | Notes |
| :--- | :--- | :--- |
| `id` | string | Anchor target; heading gets `${id}-title` |
| `index` | number | Use `sectionIndex()` from `data/navigation.ts`, never a literal |
| `title`, `description` | string | Already translated |
| `actions` | ReactNode | Right side of the heading row |
| `size` | `"xl" \| "lg"` | `lg` when the heading shares a row or sits in a narrow column |
| `scene` | number | Formation index written to `data-scene` (see §5) |
| `as` | `"section" \| "footer"` | |

The index sits small, in signal mono, at the cap line of the title. The title is a flex row, so the index never wraps onto a line of its own.

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

Use `interactive` on cards that respond to hover. Leave it off on plain containers.

### `Tag` / `TagList`

```tsx
<TagList items={exp.tech} label="Tecnologias utilizadas" />
<TagList items={p.tech} label="Tecnologias do projeto" tone="subtle" shape="box" />
<Tag tone="signal">Live</Tag>
```

| Prop | Values | Default |
| :--- | :--- | :--- |
| `tone` | `solid` · `subtle` · `signal` · `outline` | `solid` |
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

`tone="inverse"` for dots over photos. Each button is a 24 × 24 px target (WCAG 2.5.8) around the 6 px dot; the active one is 32 px wide around a 24 px bar. A row of 11 dots is about 270 px, so on phones it takes its own line.

### `Reveal`

Animates content in the first time it enters the viewport. It renders visible (prerendered HTML reads without JavaScript); after mount it hides only content that starts below the fold. It writes `data-visible` on the DOM node directly, so nothing re-renders. Other props pass through to the element.

```tsx
<Reveal variant="mask"><h3>...</h3></Reveal>
<Reveal as="ul" variant="stagger" aria-label="...">{rows}</Reveal>
```

| Variant | Effect |
| :--- | :--- |
| `up` (default) | Fade and rise 36 px |
| `fade` · `scale` | Opacity only · fade and grow from 94% |
| `mask` | The wrapper clips, its first child rises into it (headings) |
| `line` · `clip` | Hairline draws from the left · image wipes in from the top |
| `stagger` | Direct children enter 70 ms apart |

## 4. Motion components

Import from `@/components/motion/*`. All of them render their final state on the server and do nothing without the browser feature they need.

| Component | Does | Notes |
| :--- | :--- | :--- |
| `SmoothScroll` | Starts per-frame scroll sampling; Lenis inertia on mouse devices | One per page |
| `ScrubText` | Splits a paragraph into words that light up as an ancestor's `--scrub` goes 0→1 | Pure CSS after render |
| `Marquee` | Endless band; speeds up with scroll velocity | Renders content once; the loop copy is added when it enters the viewport |
| `Counter` | Counts up to a number on first view | Renders the final value |
| `Magnetic` | Pulls its child toward the pointer | Mouse only |
| `Tilt` | 3D tilt toward the pointer, with a `.tilt-glare` child | Mouse only |
| `Scramble` | Decodes its text when the nearest link is hovered (nav links, the GitHub button) | Mouse only |
| `Cursor` | Ring that trails the pointer; grows on links; shows `data-cursor-label` | The native cursor stays |
| `Grain` | Film grain overlay | |

Hooks: `useProgress(ref, { mode })` writes `--progress` on an element; `useFocusItems(ref)` writes `--focus` on each child of a list; `useSceneDirector()` feeds the WebGL engine.

## 5. Scenes

Each section sets `data-scene` to the formation the particle field should hold while that section is on screen. Between sections the particles flow from one formation to the next.

| # | Section | DOM composition | Particle formation |
| :--- | :--- | :--- | :--- |
| 0 | Hero | Name in three lines of `display-2xl`, capped at 20.5 % of its column (a container query) so "Mendonça" never breaks; tilting photo card, rule with the scroll cue, role, summary, social links | Sparse haze of bokeh points around the service mesh |
| 1 | About | Pinned for 230 svh: the statement lights up word by word beside the portrait stage; four counters follow | Dot-matrix portrait sampled from the profile photo |
| 2 | Experience | Sticky heading and year scale on the left; roles scroll on the right. The one near mid-screen is in focus: its company name turns signal, its top rule lights up, the others sit 0.75 rem to the right. Focus never dims text | Rows of dots rolling like terrain under a horizon |
| 3 | Education, Skills | Full-width degree rows, then languages and certifications as two definition lists, then publications (year and kind, title, summary, the ABNT reference with the proceedings address as a link, buttons for the project page and the proceedings PDF); award card with a rotating seal; two skill bands; stack as a spec sheet | Globe of latitude rings and meridians, rising from the lower right (from the bottom edge on phones) so the text above stays clear |
| 4 | Projects | Pinned gallery of the featured projects: vertical scroll moves the cards sideways; each cover runs its algorithm. Below it, the other repositories and the merged pull requests as rows | Tunnel around the screen edges that the scroll travels through |
| 5 | Talks | A timeline: year in display type and month as a label on the left; kind, event, title, summary, organizer and co-speakers in the middle; code, slides, notebook, event page and project links as chips on the right | A bundle of seven sine waves low in the frame, swelling in bursts like a voice, at 17 % so it never competes with the text |
| 6 | Contact | Email as the headline, channels as rows, the name as an outlined band | Spiral disc lying under the content; the service mesh returns |
| 4 | Project page | Breadcrumb, `NN / 12` index, the name in `display-xl`, facts as a `<dl>` (year, language, stars, last push, license, co-authors); the live cover at full width (21:9 on desktop) with its controls and a `fig.` caption; summary, repository button, the talk it was built for; numbered details; the repository's languages as a bar; stack; previous and next projects | The projects tunnel, so the field holds still when a card opens |
| 5 | Talk page | Breadcrumb, `NN / 09 · kind · event`, the title in `display-lg` (with its `lang`), facts as a `<dl>` (date, place, organizer, length, co-speakers); summary, code button and material chips, the project page; numbered topics; prerequisites and stack; previous and next talks | The talks' sound wave |
| 2, 0 | /now, /uses | `InnerPageHeader` (breadcrumb, `display-xl` title, lead); /now: one row per area (label in signal on the left, title, meta, one sentence, chips to the pages); /uses: groups as rows, tools as a two-column grid of name (linked) and note | Terrain for /now, haze for /uses and the notes |

**Service mesh** (hero and contact): gateways are services (signal dots with a pulsing ring), pods are instances, backbone links connect gateways, packets are messages in flight. Binary digits fall behind every scene.

**Portrait.** The engine samples the profile photo into one dot per particle (132 × 132 on the high tier). Dot size and opacity follow brightness on dark and darkness on light, so both themes show a positive image. It sits wherever the `[data-portrait-stage]` element is. Without WebGL, or with reduced motion, that element shows the photo through a CSS dot mask (`.halftone`).

**Lens.** Points at the focal plane are small and sharp. Points in front of or behind it grow into flat discs with a brighter rim and lose brightness in proportion. Formations behind reading text are drawn at 17 to 55% so text stays the brightest thing on screen.

**Project covers.** Each gallery card (`featured: true` in the data) has a canvas sketch of the project's own algorithm, drawn in foreground gray with signal for the moving part. The whole card opens the project page (the title is the keyboard target, the cover the pointer target); the GitHub icon on the card links the repository. Opening a card runs a View Transition in which the card's cover grows into the page's cover (`view-transition-name: project-cover`). A private repository gets a lock label on its cover:

| Project | Cover |
| :--- | :--- |
| 8-puzzle | A* solving a scrambled board, with g, h and f |
| git-github-in-action | Branches, commits and merges drawing left to right |
| codecash | A request taking the cache-miss path, then the cache-hit path |
| rinha-backend-2026-c | A query point finding its 5 nearest neighbours in a grid of labelled vectors |
| megabrain-context-protocol | A coding agent and an MCP server exchanging `initialize`, `tools/list` and a tool call |
| syntroph | A hexagonal core passing events between adapters, with the saga journal growing beside it |
| fuzzymeans-ai | Fuzzy C-Means: centroids moving while each point takes the color of its memberships |
| AlgorithmForest | AVL insertions; rotations show as nodes changing place |
| zhang-suen-thinning | A shape eroding pass by pass to a one-pixel skeleton |
| transaction.ledger | Events crossing API, table, stream and queue; duplicates rejected with 409 |
| lime.stability.imputation | A local linear surrogate re-fitted over resampled perturbations |
| find-the-fight | Two pose skeletons close in and fight; the dashed line is the distance between their centroids, a strip of 10 frames feeds the classifier, a bar shows the sigmoid output against 0.5 |

**Rows.** Repositories outside the gallery and open-source contributions use the `row-link` pattern from Education and Contact: name on the left, one description in the middle, stack and arrow on the right, stacked on phones. On hover the row gets a signal wash and the arrow slides into place; on touch screens the arrow sits in place from the start. Text between backticks in a description renders as `<code>` in the mono font.

**Results.** A role whose text states a figure shows it under the description as a `<dl>`: the figure in `display-sm` signal, its meaning in mono below. Only figures the text states; a test enforces it.

**Inner pages.** `InnerPageHeader` and `PageFooter` frame every page but the home page. The footer carries the links to /now, /uses, the notes (once published) and the résumé PDF (`SiteLinks`, also in the contact section), the email and a back link to the section or page the page belongs to.

**Résumé button.** A pill with a file icon, the label in the page language and a muted `PDF`: in the hero under the social links, and beside the email in the contact section. It downloads the PDF in the page language.

**Cover controls.** Under a project page cover: round 40 px buttons for play/pause, half a second back and forward, restart, a speed pill (0.5×, 1×, 2×), a slider in the signal accent over 30 seconds and a mono time readout. Icons carry visually hidden labels; the slider has a label and `aria-valuetext`.

**Language bar.** A 10 px rounded bar of the repository's languages: the first in signal, the next ones in foreground at falling opacity, the rest grouped as "Other"; the bar is decorative and the `<dl>` legend below carries the names and shares.

**Notes body.** `.note-body` styles the Markdown: muted body text at 17 px with 1.75 line height, foreground headings in the display font, links underlined in signal, code in the mono font, blocks in a card with a border, tables that scroll sideways on phones. 70 ch measure.

**Recommendations.** Glass cards under the roles: the quote in body-lg foreground with its `lang`, then the name, role, company and date, how they worked together, a "translated" mark when it applies and the link to the source. Hidden while there is none.

**Terminal.** Ctrl+` or the palette opens it: a window (`max-w-3xl`, 70 vh) over the blurred backdrop on larger screens, the whole screen on phones, on the opaque card color. Title bar (`mateus@whoami: ~`, close), the output in 13 px mono (input lines muted, names in signal, errors in foreground with a `!`), and the prompt line with a 16 px input on phones so iOS does not zoom.

**Command palette.** ⌘K / Ctrl+K or `/` opens it, as does the `⌘` button in the header (sm and up) and the last item of the mobile menu. A glass panel at 12 svh from the top over a blurred backdrop: a `$` prompt field, then groups (sections, projects, talks, actions, links) with an icon, a label and a mono hint per row. The active row has a soft foreground wash, a signal icon and a return-key glyph. The panel enters with a short drop and scale (`palette-in`); confirmations such as "Email copied" appear as a pill at the bottom of the screen.

## 6. Accessibility checklist

- [ ] Text meets 4.5 : 1 against its background (see §2.1). Effects that change text contrast have a floor: unlit About words never go below `--scrub-floor` (0.56 opacity on dark, 0.68 on light); focus effects change color and position, never opacity. Lighthouse accessibility is 100 on the home and project pages.
- [ ] Touch targets are at least 24 × 24 px (pagination dots, breadcrumb and footer links included); text is at least 11 px.
- [ ] A control whose name differs from its visible text includes that text (WCAG 2.5.3): `PT, switch to Português`, `MM, home page`, the palette button with its shortcut. Brand marks are SVG, not letters.
- [ ] Icon-only controls have `aria-label` (`IconButton` requires it).
- [ ] Focus is visible: global `:focus-visible` uses a 2 px signal outline.
- [ ] Decorative elements (split hero letters, `$ whoami`, the closing band, canvases, the cursor ring) are `aria-hidden`; the hero keeps the full name in a visually hidden span.
- [ ] Everything works without motion: content is visible before any animation runs, and every animation stops under `prefers-reduced-motion`.
- [ ] Lists of things are real lists (`TagList`, social links, channels, stack as `<dl>`).
- [ ] The pinned gallery follows keyboard focus and has previous/next buttons and tabs.
- [ ] The mobile menu is a dialog, closes on Escape and locks page scroll while open.
- [ ] The command palette is a modal dialog with a combobox and a listbox (`aria-activedescendant`), works with arrows, Home, End, Enter and Escape, keeps focus in the field and returns it on close. Enter runs the best match.
- [ ] The terminal is a modal dialog with a labelled input and its output in a polite `role="log"`; Escape closes it and returns focus.
- [ ] Text in a language other than the page's carries `lang` (talk titles, quotes).
- [ ] Every page kind passes the layout checker (`e2e/support.ts`) at nine widths, and the CI keeps Lighthouse accessibility at 100.
- [ ] Every page has a breadcrumb or a heading structure that starts at `h1`; project pages label their navigation landmarks (breadcrumb, other projects).

## 7. Do and don't

| Do | Don't |
| :--- | :--- |
| Size type with the `text-display-*` scale | Hard-code a `text-[...]` for a title |
| Take section numbers from `sectionIndex()` | Hard-code `01` |
| Use signal for one live element per block | Color headings or paragraphs with signal |
| Use the motion tokens (`duration-slow ease-expo`) | Use ad-hoc `duration-500` |
| Render the final state first, then animate in an effect | Read `window` or `localStorage` during render |
| Keep formations behind text dim | Let the 3D layer compete with reading content |
| Add new copy to `translations.ts` in pt, en and es (`pageText.ts` when only a lazy page uses it) | Ship a string in one language |
| Use the foreground or signal for text in a panel | Use the `destructive` red for text: it falls below 4.5:1 on the card |
