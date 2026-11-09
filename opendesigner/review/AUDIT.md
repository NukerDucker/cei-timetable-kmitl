# CEI Schedule — design audit

Audited: `app/` Svelte build, 4 routes × 390×844 / 768×1024 / 1440×900 × light/dark, Chrome 153 headless via Playwright, plus declared-value scan of `app/src`. Legacy root `index.html` excluded.

Verdict: **FAIL** on accessibility floors in the input boundary and on Week text under 200% / pseudo-localized text. The visual system is coherent (one accent, category palette, AA text pairs); the defects are boundary contrast, sub-12px labels, and stress clipping.

Top three by value for effort:
1. Input boundary fails 3:1 in both themes (1.22:1 light, 1.70:1 dark).
2. Week badges break inside words and course names clip under 200% text at 768px.
3. Labels below 12px (9.9px term/live-sync) and 10 font sizes / 7 tracking values.

| # | Where | Before | After | Why (source) |
|---|---|---|---|---|
| 1 | `app/src/app.css` `--input`; Week/Courses inputs | `#d1d1d6` on `#e9e6e1` = **1.22:1**; dark `#38383a` on `#09090b` = 1.70:1 | `#757575` light (3.70:1); `#808080` dark (5.04:1) | Control boundary needs 3:1 (WCAG 2.2 SC 1.4.11). Applied in OpenDesigner state; app.css change pending rollout. |
| 2 | `WeekGrid.svelte` `.gb-badges`, Badge | Badge labels break inside words under 200% text at 768px: "ECC-608 Core" on 2 lines (8 errors) | `whitespace-nowrap` on Badge base; row wraps, label does not | Labels stay on one line (preflight 40; MS-15) |
| 3 | `WeekGrid.svelte` `.gb-name` in tight blocks | Course name content 110×45px in a 110×30px box under pseudo-localization; 97×90 in 97×60 at 200% (8 errors) | Pending: allow two lines / visible overflow without covering adjacent bars, or record the spatial-grid exception | No text lost when text grows (WCAG 1.4.4; ST-04) |
| 4 | `App.svelte` Term / Live sync labels | 9.9px uppercase labels (`text-[0.62rem]`) | `text-eyebrow` = 11px, tracking 0.08em | 11px is the floor for short labels; 12px for read text (preflight 9) |
| 5 | `App.svelte`, `WeekGrid.svelte`, `Legend.svelte` | 10 font sizes; 5 off the scale; 9.9/10.9/11.52px; 7 tracking values | 11 / 12 / 13 / 14 / 15 / 16 / 20 / 32px; tracking 0.08em for caps, -0.01em body, -0.02em display | About 8 sizes, whole pixels, about 4 tracking values (MS-02, MS-17) |
| 6 | `WeekGrid.svelte`, `Legend.svelte` scoped CSS | Spacing in px (2, 3, 6, 8, 10px) → 41 of 176 gaps off ladder; does not scale | Convert padding/gap/margin to rem; map to 4px steps where safe | Spacing scales with text size (STD-accessibility-motion-13); one 4px scale (preflight 12) |
| 7 | Week shell | 4 weights (400/500/600/700); 500 and 600 one step apart | Keep 400 body, 600 labels/headings; merge 500 into one of them | Two weights per view, clearly apart (DC-L19-24) |
| 8 | Week bars | Category shades `#0f76d6`, `#0c63b4`, `#0e6cc4`, `#085c66` reported "not in palette" | Recorded as the CEI extension in `DESIGN.md`; no change | Category palette is an app extension (keep block; project standard) |
| 9 | All routes, longWords stress | Page 536px wider than a 390px viewport | Pending: find widest element; add `min-width: 0` / wrap / inner scroll | Layout safety under long words (CV-05; ST-04) |
| 10 | Courses/Plan/Exams | Term toggle changes shell height 1203→1414px; capitals with negative tracking; art through text in Plan; hover on selected segmented does nothing | Deferred to rollout after Week approval | ST-10, MS-17, MS-20, ST-01 |

Measured sources: `opendesigner/review-before/` (probes, shots, focus/hover/console), `opendesigner/references/cei-app-declared.json`, source check `/tmp/od-review.json` (156 findings; Week 34).

## Final result after Week pass

- Source check: **108 findings project-wide, 0 in `week/`** (`engine.py review --project app/src`).
- Rendered Week: **normal-state cells pass** the floors (contrast, targets, focus, names). Remaining **7 errors are stress-only**: 5 pseudo-localized names (110×45 in a 110×30 box) and 2 at 200% text (77×120 in 77×60) at 768×1024. The bar keeps a `title` with the full name, and the Courses view is the readable alternate.
- One non-Week error remains from the pre-fix Courses probes: capitals (room codes) at -0.012em. Deferred to rollout with the input-boundary fix.
- Preflight on `app/dist/index.html`: **0 errors, 1 warning** (15px body not on OpenDesigner's generated scale; intentional dense scale).
- Typecheck 0 errors; 126 tests pass; build succeeds (CSS 17.54 kB gz, JS 70.05 kB gz).

Accepted limitation: a fixed-row spatial grid cannot show 3 lines of a course name in a 30px row without overlapping neighbouring classes. Fixing it needs a non-grid fallback at large text, which is a redesign, not a token change.

