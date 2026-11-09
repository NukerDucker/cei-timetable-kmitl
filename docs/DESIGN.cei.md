# CEI Schedule — Design System

Governing visual language for the Svelte app in `app/`. The legacy root `index.html` is frozen and excluded; it will be removed at cutover (rewrite plan, phase 7).

Source of truth lives in code:

| Layer | Location |
|---|---|
| Tokens (light + dark) | `app/src/app.css` — `:root`, `.dark`, `@theme inline` |
| Primitives | `app/src/lib/components/ui/` |
| Domain components | `app/src/lib/components/{shell,week,courses,exams,plan}/` |
| Category mapping | `app/src/domain/categories.ts` |

Rule: components consume tokens and primitives. Raw hex values belong only in `app.css`.

---

## 1. Visual theme & atmosphere

A dense, iOS-flavoured timetable console. Light mode is warm paper (`#e9e6e1`) carrying white bento cards with a hairline border and a soft, wide shadow. Dark mode drops to true black (`#09090b`) with charcoal cards (`#18181b`), never gray-blue.

The mood is calm utility: one brand accent (KMITL orange), category colour reserved exclusively for course bars, everything else neutral. Type is compact and tight; layout is a fixed bento shell that fits one viewport on desktop. Controls read as a segmented iOS picker; schedule blocks read as saturated colour chips with white text.

Principles:

1. **Colour carries category, not decoration.** Blue = core, purple = elective, teal = GenEd. Orange is brand and primary action only.
2. **Density over air.** 15px body, 10–13px metadata, 44px touch targets, 12px gutters.
3. **Two surface levels.** Page canvas + raised card. A third level (popover) appears only above content.
4. **One scale.** Radius, spacing, type, focus, and elevation come from tokens — no per-component invention.

---

## 2. Colour

### 2.1 Semantic tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `--background` | `#e9e6e1` | `#09090b` | Page canvas |
| `--foreground` | `#1c1c1e` | `#ffffff` | Primary text |
| `--card` | `#ffffff` | `#18181b` | Raised surface |
| `--card-foreground` | `#1c1c1e` | `#ffffff` | Text on card |
| `--popover` | `#ffffff` | `#1c1c1e` | Floating surface |
| `--primary` | `#c94e17` | `#c94e17` | KMITL orange: brand, primary action |
| `--primary-foreground` | `#ffffff` | `#ffffff` | Text on orange |
| `--secondary` | `#e5e5ea` | `#2c2c2e` | Neutral fill |
| `--muted` | `#f1efeb` | `#242427` | Recessed fill (segmented track) |
| `--muted-foreground` | `#636366` | `#98989f` | Secondary text |
| `--accent` | `#e5e5ea` | `#2c2c2e` | Hover / highlight fill |
| `--destructive` | `#c4442c` | `#ff6b5c` | Errors, conflicts, destructive action |
| `--border` | `#ddd8d1` | `#2c2c30` | Hairlines, card edge |
| `--input` | `#d1d1d6` | `#38383a` | Form control border |
| `--ring` | `#007aff` | `#0a84ff` | Focus ring |

Contrast (WCAG 2.1, computed from the tokens above):

| Pair | Ratio | Requirement |
|---|---|---|
| foreground / background (light) | 13.67 | AA pass |
| foreground / card (light) | 17.01 | AA pass |
| muted-foreground / card (light) | 5.99 | AA pass |
| muted-foreground / background (light) | 4.81 | AA pass |
| white / primary | 4.58 | AA pass (normal text, at the floor) |
| foreground / background (dark) | 19.90 | AA pass |
| muted-foreground / card (dark) | 6.18 | AA pass |

Do not lighten `--muted-foreground`, `--primary`, or any category colour without re-running these pairs. White text on category bars is mandatory.

### 2.2 Category palette

Each category has a base colour and four deterministic shades. A course keeps one shade forever, hashed from its code (`courseShade`), so returning users navigate by colour.

| Category | Base | Shades | White-text contrast |
|---|---|---|---|
| Core | `#0f76d6` | `#0f76d6` · `#0c63b4` · `#0a559c` · `#0e6cc4` | 4.58 – 7.52 |
| CEI Elective | `#6b50f0` | `#6b50f0` · `#5a3ed6` · `#4b32b8` · `#6346e0` | 5.21 – 8.58 |
| Gen Ed | `#0a6e7a` | `#0a6e7a` · `#085c66` · `#0b7e8c` · `#064e56` | 4.80 – 9.41 |

Tokens: `--cat-core`, `--cat-core-1…4`, `--cat-elective…`, `--cat-gened…`. Tailwind utilities `bg-cat-core`, `bg-cat-core-1…4`, etc. are mapped in `@theme`. Bars receive their shade through an inline custom property (`--block-color`) computed from `courseColorToken(course)`.

Rules:

- Bars: category shade background, white text, radius 12px (`calc(var(--radius) - 4px)`).
- Never use category colours for UI chrome, buttons, or status.
- Never use orange for a course category or status.
- Labs inherit their parent course's category colour.

### 2.3 Semantic mapping cheatsheet

| Meaning | Token |
|---|---|
| Brand / primary action | `primary` |
| Course category | `cat-core` / `cat-elective` / `cat-gened` |
| Secondary text, metadata | `muted-foreground` |
| Selected tab, active surface | `card` on `muted` track |
| Conflict, destructive, error | `destructive` |
| Hairline border | `border` |
| Focus | `ring` |

---

## 3. Typography

Family stack (`--font-sans`):

```
-apple-system, BlinkMacSystemFont, "SF Pro Text", "IBM Plex Sans Thai", "Helvetica Neue", sans-serif
```

IBM Plex Sans Thai 400/500/600/700 is self-hosted and subset (Thai + Latin). It is the Thai fallback and the brand face where system SF is unavailable.

Base body: **15px / 1.47, tracking −0.01em, antialiased** (`--text-body`).

| Token | Size | Line height | Use |
|---|---|---|---|
| `--text-display` | 32px (2rem) | 1.1 | Page title `CEI Schedule`, tracking −0.02em |
| `text-xl` | 20px | 1.4 | Term value in the header |
| `text-base` | 16px | 1.5 | Plan heading |
| `--text-body` | 15px | 1.47 | Default body |
| `text-sm` | 14px | 1.4 | Inputs, large captions |
| `--text-dense` | 13px | 1.45 | Course metadata, notes |
| `text-xs` | 12px | 1.33 | Secondary metadata |
| `--text-eyebrow` | 10.88px (0.68rem) | 1.2 | Section labels, uppercase, tracking 0.08em |
| `--text-micro` | 10px | 1.2 | Dense micro-labels only |

Weight: 400 body, 500 controls, 600 labels and headings, 700 page title. Never italic.

Rules:

- Uppercase eyebrows: `font-semibold uppercase tracking-[0.08em]` (or `tracking-eyebrow`). Colour them `muted-foreground` unless they label a coloured surface.
- Times and numeric columns use `tabular-nums`.
- Nothing renders below 10px. Prefer the scale tokens over arbitrary `text-[…]` values in new work.
- Headings alone may use negative tracking; body stays at −0.01em.

---

## 4. Layout, spacing, shape

### Shell

- Max content width **1400px** (`--container-page` / `max-w-page`), centred, gutters 12px (`px-3`) on mobile and 16px (`sm:px-4`) above 640px.
- Page sits directly on `--background`; no outer frame.
- Bento gaps: **12px** (`gap-3`).
- Header grid: single column on mobile; `2fr / 1fr / 1.2fr` from 768px.
- Plan view splits `1fr / 360px` from 901px; filters collapse to a Sheet below that.
- Courses grid: 1 column, 2 from 760px, 3 from 1000px.

### Spacing

4px base scale via Tailwind. Card padding 12px (`p-3`) for content panels, 16px (`p-4`) for header/stat cards, 8px (`p-2`) for the control strip. Row gap inside cards 6–12px.

### Radius

`--radius: 1rem` drives the scale:

| Utility | Value | Use |
|---|---|---|
| `rounded-md` | 14px | Buttons, inputs in dense toolbars |
| `rounded-lg` | 16px | Inputs, segmented items, plan rows |
| `rounded-2xl` | 16px | Cards and panels |
| `rounded-xl` | 20px | Segmented track, icon button |
| `rounded-full` | pill | Badges, conflict count |
| bar radius | 12px | Week/plan course blocks |

### Elevation

| Token | Value |
|---|---|
| `--elevation-card` (light) | `0 1px 2px rgb(0 0 0 / .04), 0 14px 40px rgb(0 0 0 / .08)` |
| `--elevation-card` (dark) | `0 1px 2px rgb(0 0 0 / .5), 0 16px 44px rgb(0 0 0 / .5)` |
| `--elevation-popover` (light) | `0 12px 32px rgb(0 0 0 / .14)` |
| `--elevation-popover` (dark) | `0 12px 32px rgb(0 0 0 / .6)` |

`--material-bar` is a translucent card fill for sticky/floating bars: `color-mix(card 82%, transparent)` plus `backdrop-filter: blur(18px) saturate(160%)` via `.material-bar`.

### Scroll budget

Invariant: Week and Exams fit one viewport at 1440×900, 768×1024, and 390×844. Courses stays under 1.6 viewports on mobile. Verify with `document.documentElement.scrollHeight`.

---

## 5. Components

All primitives live under `app/src/lib/components/ui/`, follow the shadcn-svelte pattern (cva variants + `cn` merge + `class` passthrough), and accept native attributes.

### Card — `ui/card`

The raised surface. Base: `rounded-2xl bg-card text-card-foreground`.

| Prop | Values | Notes |
|---|---|---|
| `variant` | `default`, `borderless` | `default` adds `border shadow-card`; `borderless` keeps shadow only (content panels, main timetable shell) |
| `as` | any tag | Use `section` when the card carries `aria-label` |
| `class` | string | Padding and layout belong to the caller |

Recipes: header/stat card `class="p-4"`; control strip `class="p-2"`; content panel `variant="borderless" class="p-3 sm:p-4"`; full-height panel `variant="borderless" class="flex min-h-0 flex-col overflow-hidden p-3 sm:p-4"`.

### Button — `ui/button`

Variants: `default` (orange), `outline` (card + border), `ghost`, `destructive`.
Sizes: `default` 32px, `sm` 28px, `icon` 32px square.

Touch rule: below 901px interactive controls must be ≥44px. Existing pattern:

```svelte
<Button size="sm" class="min-h-11 min-[901px]:min-h-8" />
```

Focus: 2px `ring` outline, 2px offset. Disabled: `opacity-50`, pointer events off.

### Badge — `ui/badge`

Neutral variants: `default`, `secondary`, `destructive`, `outline`.
Contextual variants are **only** valid inside a coloured week bar: `block`, `room`, `tag` (lectures), `lab`, `ta`, `conflict`. They assume the bar's coloured background; do not use them on cards.

### Segmented — `ui/segmented`

A `role="group"` of `aria-pressed` buttons on a muted 20px-radius track. Used for Term, Year, and View.

| Prop | Type | Notes |
|---|---|---|
| `items` | `readonly { id: T; label: string }[]` | Generic over the id union |
| `value` | `T` | Selected id |
| `label` | string | Accessible group name (`Term`, `Year`, `View`) |
| `onchange` | `(id: T) => void` | Selection change |
| `onprefetch` | `(id: T) => void` | Optional warm-up on hover, focus, or touch |

Item height 44px mobile → 32px desktop; selected item lifts to `bg-card shadow-card`.

### Input — `ui/input`

Hairline border, 16px radius, `bg-background` (default) or `bg-card` (dense toolbars), 44px → 40px height, 14px text. Supports `bind:value`.

### EmptyState — `ui/empty-state`

One-line muted status (`role="status"`), 14px, 16px vertical padding. Copy states what is empty and why, e.g. "No courses match that search."

### Domain components

`WeekGrid`, `Legend`, `CourseCard`, `CourseList`, `ExamTable`, `PlanView`, `ControlBar` are domain compositions, not primitives. They may use primitives but their props are domain-shaped. Week bars keep their existing block vocabulary: time, course name, room, category tag, `Lab`, `TA`, `Conflict` badges.

---

## 6. Interaction, states, motion

- **Hover:** colour only, `hover:bg-muted/60` or `hover:text-foreground`. Never move, scale, or shadow-shift on hover.
- **Focus:** global `:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px }`. Never `outline: none` without a replacement. Radio-style controls draw focus on their labels.
- **Active / selected:** segmented items lift to `bg-card shadow-card`; block colours never change on selection.
- **Disabled:** `opacity-50`, no pointer events.
- **Motion:** 150ms colour transitions only. No entrance animations. `prefers-reduced-motion` collapses all transitions and animations globally in `app.css`.
- **Theme:** `.dark` on `<html>`, persisted to `localStorage` key `timetable-theme`, default from `prefers-color-scheme`. Tokens flip; component classes do not.
- **Touch:** minimum target 44×44px below 901px; dense desktop controls may be 32px.
- **Print:** controls and notes hidden, block colours preserved (`print-color-adjust: exact`).

---

## 7. Accessibility contract

- Every text/background pair meets WCAG AA: 4.5:1 normal, 3:1 large. Current token pairs are listed in §2.1.
- White text on category bars is mandatory; all 15 category colours pass AA against white (lowest 4.58).
- Category is never encoded by colour alone: bars also carry a text type tag (`Core`, `Elective`, `Gen Ed`, `Lab`, `TA`).
- Control groups expose `role="group"` + `aria-label`; toggle buttons expose `aria-pressed`.
- Status text uses `role="status"` + `aria-live="polite"`.
- Keyboard: every control reachable in DOM order with a visible focus ring; year group, view group, theme toggle, search, notes summary are the required stops.
- Verification: axe-core, zero critical/serious violations, all views in both themes.

---

## 8. Governance

- New token → add to `:root` and `.dark` (if themed) and map it in `@theme` when a utility is needed. Update this document in the same change.
- New primitive → `app/src/lib/components/ui/<name>/` with cva variants, `index.ts`, and a test. Reuse before inventing.
- No raw hex outside `app.css`. No arbitrary text sizes when the scale covers the need. No new shadows or radii.
- Category palette and the orange accent are fixed; changing them requires re-running contrast, axe, and the scroll budget.
- Run before merging: `npm run typecheck && npm test && npm run build`, then a visual pass at 1440 / 768 / 390 in both themes.

---

## 9. Copy-paste generation block

Use this when generating a new screen or component:

```
Surfaces: bg-background canvas; bg-card + border + shadow-card raised; borderless cards keep shadow only.
Text: foreground primary; muted-foreground secondary; body 15px/1.47; dense 13px; eyebrows 10.88px 600 uppercase 0.08em.
Accent: primary #c94e17 only for brand and primary actions; white text on it.
Category: core #0f76d6, elective #6b50f0, gened #0a6e7a (shades 1-4); bars use white text; never chrome.
Radius: cards/panels 16px, buttons 14px, segmented track 20px, pills full, bars 12px.
Space: max width 1400, gutters 12/16, gaps 12, card padding 12/16, control strip 8.
Touch: 44px min below 901px, 32px desktop density.
Focus: 2px ring #007aff (light) / #0a84ff (dark), 2px offset.
Motion: 150ms colour transitions only; honour prefers-reduced-motion.
Primitives: Card(variant default|borderless, as), Button(default|outline|ghost|destructive; default|sm|icon), Badge(neutral or in-bar variants), Segmented(items,value,label,onchange,onprefetch), Input(default|card, bind:value), EmptyState(role=status).
Theme: .dark class on html; persisted in localStorage timetable-theme; tokens flip, classes do not.
```
