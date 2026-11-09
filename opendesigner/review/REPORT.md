# Review report: Week review

Made 2026-11-09 · http://localhost:5174 · 382 probe run(s) · system: CEI Schedule

## Verdict: FAIL

8 error(s) found in what was checked.

8 errors · 17 warnings · 37 notes · coverage 18/76 cells done

## What was not checked

**Not done** (58)
- `#/2569-1/y1/courses|390x844|light`
- `#/2569-1/y1/courses|390x844|dark`
- `#/2569-1/y1/courses|768x1024|light`
- `#/2569-1/y1/courses|768x1024|dark`
- `#/2569-1/y1/courses|1440x900|light`
- `#/2569-1/y1/courses|1440x900|dark`
- `#/2569-1/y1/exams|390x844|light`
- `#/2569-1/y1/exams|390x844|dark`
- `#/2569-1/y1/exams|768x1024|light`
- `#/2569-1/y1/exams|768x1024|dark`
- `#/2569-1/y1/exams|1440x900|light`
- `#/2569-1/y1/exams|1440x900|dark`
- `#/2569-1/y1/plan|390x844|light`
- `#/2569-1/y1/plan|390x844|dark`
- `#/2569-1/y1/plan|768x1024|light`
- `#/2569-1/y1/plan|768x1024|dark`
- `#/2569-1/y1/plan|1440x900|light`
- `#/2569-1/y1/plan|1440x900|dark`
- `task:#/2569-1/y1/week|states-and-data`
- `task:#/2569-1/y1/courses|scroll-walk`
- `task:#/2569-1/y1/courses|focus-walk`
- `task:#/2569-1/y1/courses|hover-and-press`
- `task:#/2569-1/y1/courses|states-and-data`
- `task:#/2569-1/y1/courses|motion`
- `task:#/2569-1/y1/courses|stress-text`
- `task:#/2569-1/y1/courses|reduced-motion`
- `task:#/2569-1/y1/courses|forced-colors`
- `task:#/2569-1/y1/courses|console-and-network`
- `task:#/2569-1/y1/courses|letter-reveals`
- `task:#/2569-1/y1/courses|text-pixels`
- `task:#/2569-1/y1/courses|floating-bars`
- `task:#/2569-1/y1/courses|toggles`
- `task:#/2569-1/y1/exams|scroll-walk`
- `task:#/2569-1/y1/exams|focus-walk`
- `task:#/2569-1/y1/exams|hover-and-press`
- `task:#/2569-1/y1/exams|states-and-data`
- `task:#/2569-1/y1/exams|motion`
- `task:#/2569-1/y1/exams|stress-text`
- `task:#/2569-1/y1/exams|reduced-motion`
- `task:#/2569-1/y1/exams|forced-colors`
- `task:#/2569-1/y1/exams|console-and-network`
- `task:#/2569-1/y1/exams|letter-reveals`
- `task:#/2569-1/y1/exams|text-pixels`
- `task:#/2569-1/y1/exams|floating-bars`
- `task:#/2569-1/y1/exams|toggles`
- `task:#/2569-1/y1/plan|scroll-walk`
- `task:#/2569-1/y1/plan|focus-walk`
- `task:#/2569-1/y1/plan|hover-and-press`
- `task:#/2569-1/y1/plan|states-and-data`
- `task:#/2569-1/y1/plan|motion`
- `task:#/2569-1/y1/plan|stress-text`
- `task:#/2569-1/y1/plan|reduced-motion`
- `task:#/2569-1/y1/plan|forced-colors`
- `task:#/2569-1/y1/plan|console-and-network`
- `task:#/2569-1/y1/plan|letter-reveals`
- `task:#/2569-1/y1/plan|text-pixels`
- `task:#/2569-1/y1/plan|floating-bars`
- `task:#/2569-1/y1/plan|toggles`

## Errors (8)

### Capitals with negative tracking
`M-MS17-2649` · MS-17 Tracking and kerning that break words · **measured** · preflight 5
- Where: /#/2569-1/y1/courses · 1440x900 · dark; /#/2569-1/y1/courses · 1440x900 · dark · reduced motion; /#/2569-1/y1/courses · 1440x900 · light; /#/2569-1/y1/courses · 1440x900 · light · reduced motion; /#/2569-1/y1/courses · 390x844 · dark; /#/2569-1/y1/courses · 390x844 · dark · reduced motion (+6 more)
- Measured: ul.mt-1\.5.space-y-0\.5 > li.flex.flex-wrap:nth-of-type(1) > span.text-muted-foreground.svelte-1nzqkb4:nth-of-type(3) "ECC-608" at -0.012em, 13 px; ul.mt-1\.5.space-y-0\.5 > li.flex.flex-wrap:nth-of-type(2) > span.text-muted-foreground.svelte-1nzqkb4:nth-of-type(3) "502 (ECC)" at -0.012em, 13 px; ul.mt-1\.5.space-y-0\.5 > li.flex.flex-wrap:nth-of-type(1) > span.text-muted-foreground.svelte-1nzqkb4:nth-of-type(3) "706 (ECC)" at -0.012em, 13 px; ul.mt-1\.5.space-y-0\.5 > li.flex.flex-wrap:nth-of-type(2) > span.text-muted-foreground.svelte-1nzqkb4:nth-of-type(3) "706 (ECC)" at -0.012em, 13 px
- Expected: capitals tracked open (about +0.02 to +0.08em), never tight: capital shapes have no side bearings to spare, so negative tracking makes them collide (preflight 5)
- Evidence: `ul.mt-1\.5.space-y-0\.5 > li.flex.flex-wrap:nth-of-type(1) > span.text-muted-foreground.svelte-1nzqkb4:nth-of-type(3)`, `ul.mt-1\.5.space-y-0\.5 > li.flex.flex-wrap:nth-of-type(2) > span.text-muted-foreground.svelte-1nzqkb4:nth-of-type(3)`
- Fix: set letter-spacing on uppercase text to a positive caps token, for example 0.04em

### Text is clipped and cannot be read under pseudoloc
`M-ST04-2896` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4 / 1.4.12
- Where: /#/2569-1/y1/week · 768x1024 · dark · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · dark · stress: text200; /#/2569-1/y1/week · 768x1024 · light · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · light · stress: text200
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(21) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-name.svelte-jj2ihp:nth-of-: content 110x45 px in a 110x30 px box
- Expected: no content lost when text grows
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(21) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-name.svelte-jj2ihp:nth-of-`
- Fix: let the box grow (min-height, not height; overflow: visible) or wrap the text

### Text is clipped and cannot be read under pseudoloc
`M-ST04-2896` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4 / 1.4.12
- Where: /#/2569-1/y1/week · 768x1024 · dark · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · dark · stress: text200; /#/2569-1/y1/week · 768x1024 · dark · stress: textSpacing; /#/2569-1/y1/week · 768x1024 · light · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · light · stress: text200; /#/2569-1/y1/week · 768x1024 · light · stress: textSpacing
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(21) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-name.svelte-jj2ihp:nth-of-: content 110x45 px in a 110x30 px box
- Expected: no content lost when text grows
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(21) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-name.svelte-jj2ihp:nth-of-`
- Fix: let the box grow (min-height, not height; overflow: visible) or wrap the text

### Text is clipped and cannot be read under pseudoloc
`M-ST04-2896` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4 / 1.4.12
- Where: /#/2569-1/y1/week · 768x1024 · dark · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · dark · stress: text200; /#/2569-1/y1/week · 768x1024 · light · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · light · stress: text200
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(22) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-name.svelte-jj2ihp:nth-of-: content 110x45 px in a 110x30 px box
- Expected: no content lost when text grows
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(22) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-name.svelte-jj2ihp:nth-of-`
- Fix: let the box grow (min-height, not height; overflow: visible) or wrap the text

### Text is clipped and cannot be read under pseudoloc
`M-ST04-2896` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4 / 1.4.12
- Where: /#/2569-1/y1/week · 768x1024 · dark · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · dark · stress: text200; /#/2569-1/y1/week · 768x1024 · light · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · light · stress: text200
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(23) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-name.svelte-jj2ihp:nth-of-: content 110x45 px in a 110x30 px box
- Expected: no content lost when text grows
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(23) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-name.svelte-jj2ihp:nth-of-`
- Fix: let the box grow (min-height, not height; overflow: visible) or wrap the text

### Text is clipped and cannot be read under pseudoloc
`M-ST04-2896` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4 / 1.4.12
- Where: /#/2569-1/y1/week · 768x1024 · dark · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · dark · stress: text200; /#/2569-1/y1/week · 768x1024 · light · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · light · stress: text200
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(25) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-name.svelte-jj2ihp:nth-of-: content 110x45 px in a 110x30 px box
- Expected: no content lost when text grows
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(25) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-name.svelte-jj2ihp:nth-of-`
- Fix: let the box grow (min-height, not height; overflow: visible) or wrap the text

### Text is clipped and cannot be read under text200
`M-ST04-0969` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4 / 1.4.12
- Where: /#/2569-1/y1/week · 768x1024 · dark · stress: text200; /#/2569-1/y1/week · 768x1024 · light · stress: text200
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(22) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-name.svelte-jj2ihp:nth-of-: content 77x120 px in a 77x60 px box
- Expected: no content lost when text grows
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(22) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-name.svelte-jj2ihp:nth-of-`
- Fix: let the box grow (min-height, not height; overflow: visible) or wrap the text

### Text is clipped and cannot be read under text200
`M-ST04-0969` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4 / 1.4.12
- Where: /#/2569-1/y1/week · 768x1024 · dark · stress: text200; /#/2569-1/y1/week · 768x1024 · light · stress: text200
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(23) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-name.svelte-jj2ihp:nth-of-: content 77x90 px in a 77x60 px box
- Expected: no content lost when text grows
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(23) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-name.svelte-jj2ihp:nth-of-`
- Fix: let the box grow (min-height, not height; overflow: visible) or wrap the text

## Warnings (17)

### The page scrolls sideways under longWords
`M-CV05-2002` · CV-05 Sideways scroll, and overflow that is hidden · **measured** · WCAG 1.4.10
- Where: /#/2569-1/y1/courses · 390x844 · dark · stress: longWords; /#/2569-1/y1/courses · 390x844 · light · stress: longWords; /#/2569-1/y1/courses · 768x1024 · dark · stress: longWords; /#/2569-1/y1/courses · 768x1024 · light · stress: longWords; /#/2569-1/y1/exams · 390x844 · dark · stress: longWords; /#/2569-1/y1/exams · 390x844 · light · stress: longWords (+10 more)
- Measured: 536 px wider than the viewport (390 px)
- Expected: no horizontal scroll (WCAG 1.4.10 at 320 px)
- Fix: find the widest element listed and let it wrap, shrink (min-width: 0, max-width: 100%) or scroll inside its own box

### Spacing off the ladder (3 value(s), 41 of 176 uses)
`M-MS01-4517` · MS-01 Spacing judged by eye · **measured** · tokens
- Where: /#/2569-1/y1/courses · 1440x900 · dark; /#/2569-1/y1/courses · 1440x900 · dark · reduced motion; /#/2569-1/y1/courses · 1440x900 · light; /#/2569-1/y1/courses · 1440x900 · light · reduced motion; /#/2569-1/y1/courses · 390x844 · dark; /#/2569-1/y1/courses · 390x844 · dark · reduced motion (+42 more)
- Measured: 10px x23 (nearest 8); 14px x12 (nearest 12); 7px x6 (nearest 6)
- Expected: steps: 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
- Evidence: `div.flex.w-max > div.flex.shrink-0:nth-of-type(1) > button.inline-flex.min-h-11:nth-of-type(1)`, `section.rounded-2xl.bg-card > div.course-list.svelte-15p0nqm:nth-of-type(2) > article.course-card.svelte-1nzqkb4:nth-of-`, `div.flex.items-start > h2.min-w-0.text-\[0\.9375rem\] > span.cc-dot.svelte-1nzqkb4`, `main.flex.min-h-0 > section.rounded-2xl.bg-card > div.course-list.svelte-15p0nqm:nth-of-type(2)`, `tbody.svelte-1ji1yre > tr.svelte-1ji1yre:nth-of-type(1) > td.exam-course.svelte-1ji1yre:nth-of-type(1)`, `main.flex.min-h-0 > section.rounded-2xl.bg-card > details.mt-3.border-t`
- Fix: use the spacing tokens; 1-2 px values are usually borders or browser defaults

### 10 font sizes
`M-MS02-0726` · MS-02 Type scale drift · **measured** · preflight 7
- Where: /#/2569-1/y1/plan · 1440x900 · dark; /#/2569-1/y1/plan · 1440x900 · dark · reduced motion; /#/2569-1/y1/plan · 1440x900 · light; /#/2569-1/y1/plan · 1440x900 · light · reduced motion; /#/2569-1/y1/plan · 390x844 · dark; /#/2569-1/y1/plan · 390x844 · dark · reduced motion (+6 more)
- Measured: 9.5, 10, 10.5, 11, 11.5, 12, 14, 16, 20, 32; within 10% of each other: 9.5/10, 10/10.5, 10.5/11, 11/11.5
- Expected: about 8 sizes at most, all from one scale, none within 10% of another (preflight 7)
- Fix: map each size to the nearest step of one scale

### 4 font weights on one page
`M-MS02-1826` · MS-02 Type scale drift · **measured** · DC-L19-24
- Where: /#/2569-1/y1/courses · 1440x900 · dark; /#/2569-1/y1/courses · 1440x900 · dark · reduced motion; /#/2569-1/y1/courses · 1440x900 · light; /#/2569-1/y1/courses · 1440x900 · light · reduced motion; /#/2569-1/y1/courses · 390x844 · dark; /#/2569-1/y1/courses · 390x844 · dark · reduced motion (+42 more)
- Measured: 400 on 40 element(s), 500 on 11 element(s), 600 on 20 element(s), 700 on 1 element(s); 400 and 500 are one step apart, which can read as a mistake rather than a level; 500 and 600 are one step apart, which can read as a mistake rather than a level
- Expected: three weights at most in a system, and two in any one view, clearly apart, such as 400 and 600 (DC-L19-24; it marks two neighbouring weights reading as a mistake as inferred)
- Evidence: `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > p.mt-0\.5.text-xs:nth-of-type(2)`, `div.flex.w-max > div.flex.shrink-0:nth-of-type(1) > button.inline-flex.min-h-11:nth-of-type(1)`, `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > p.text-\[0\.68rem\].font-semibold:nth-of-type(1)`, `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > h1.text-\[1\.8rem\].font-bold`, `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > p.text-eyebrow.font-semibold:nth-of-type(1)`
- Fix: give each weight a job (body, labels, headings) and merge the near ones; try size or space before a third weight

### Font sizes between whole pixels
`M-MS02-5955` · MS-02 Type scale drift · **measured** · preflight 7
- Where: /#/2569-1/y1/courses · 1440x900 · dark; /#/2569-1/y1/courses · 1440x900 · dark · reduced motion; /#/2569-1/y1/courses · 1440x900 · light; /#/2569-1/y1/courses · 1440x900 · light · reduced motion; /#/2569-1/y1/courses · 390x844 · dark; /#/2569-1/y1/courses · 390x844 · dark · reduced motion (+34 more)
- Measured: 9.9 px x4; 10.9 px x1
- Expected: whole-pixel sizes from the scale: a fluid size (clamp, vw) or an rem step that does not land on a pixel gives a different size at every width, so nothing matches (preflight 7)
- Evidence: `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(2) > span.block.text-\[0\.62rem\]:nth-of-type(1)`, `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > p.text-\[0\.68rem\].font-semibold:nth-of-type(1)`, `div.flex.w-max > div.flex.shrink-0:nth-of-type(1) > button.inline-flex.min-h-11:nth-of-type(1)`, `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > h1.text-\[1\.8rem\].font-bold`, `thead.svelte-1ji1yre > tr.svelte-1ji1yre > th.svelte-1ji1yre:nth-of-type(1)`, `div.week-scroll.overflow-x-auto > div.week-grid.svelte-jj2ihp > div.time.svelte-jj2ihp:nth-of-type(7)`
- Fix: step the size at breakpoints instead of a fluid clamp, or round the scale to whole pixels; 13.33 px on a button is the browser default

### Font sizes off the type scale (5 value(s), 32 of 72 text elements)
`M-MS02-6019` · MS-02 Type scale drift · **measured** · tokens
- Where: /#/2569-1/y1/courses · 1440x900 · dark; /#/2569-1/y1/courses · 1440x900 · dark · reduced motion; /#/2569-1/y1/courses · 1440x900 · light; /#/2569-1/y1/courses · 1440x900 · light · reduced motion; /#/2569-1/y1/courses · 390x844 · dark; /#/2569-1/y1/courses · 390x844 · dark · reduced motion (+42 more)
- Measured: 12px x25 (nearest 13); 9.9px x4 (nearest 13); 20px x1 (nearest 18); 32px x1 (nearest 31); 10.9px x1 (nearest 13)
- Expected: sizes from the scale: 13, 15, 18, 22, 26, 31, 37
- Evidence: `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > p.mt-0\.5.text-xs:nth-of-type(2)`, `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(2) > span.block.text-\[0\.62rem\]:nth-of-type(1)`, `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(2) > span.mt-1.block:nth-of-type(2)`, `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > h1.text-\[1\.8rem\].font-bold`, `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > p.text-\[0\.68rem\].font-semibold:nth-of-type(1)`, `div.exam-wrap.svelte-1ji1yre > table.exam-table.svelte-1ji1yre > caption.sr-only.svelte-1ji1yre`
- Fix: use a text style; a browser default (buttons 13.33 px, h3 18.72 px) means the element does not inherit

### Text smaller than 12 px
`M-MS02-1083` · MS-02 Type scale drift · **measured**
- Where: /#/2569-1/y1/courses · 1440x900 · dark · forced colors; /#/2569-1/y1/courses · 1440x900 · dark; /#/2569-1/y1/courses · 1440x900 · dark · reduced motion; /#/2569-1/y1/courses · 1440x900 · dark · stress: longWords; /#/2569-1/y1/courses · 1440x900 · dark · stress: pseudoloc; /#/2569-1/y1/courses · 1440x900 · dark · stress: rtl (+162 more)
- Measured: 9.9 px: 'Term' in div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(2) > span.block.text-\[0\.62rem\]:nth-of-type(1)
- Expected: at least 12 px (the system's minimum)
- Evidence: `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(2) > span.block.text-\[0\.62rem\]:nth-of-type(1)`, `div.week-scroll.overflow-x-auto > div.week-grid.svelte-jj2ihp > div.lunch.svelte-jj2ihp:nth-of-type(20)`, `li.border-t.py-3:nth-of-type(1) > div.flex.min-w-0:nth-of-type(1) > span.inline-flex.items-center:nth-of-type(1)`, `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > p.text-eyebrow.font-semibold:nth-of-type(1)`
- Fix: raise it to a text style

### Mixed alignment under one heading
`M-MS05-2745` · MS-05 Alignment and grid · **measured**
- Where: /#/2569-1/y1/courses · 1440x900 · dark; /#/2569-1/y1/courses · 1440x900 · dark · reduced motion; /#/2569-1/y1/courses · 1440x900 · light; /#/2569-1/y1/courses · 1440x900 · light · reduced motion; /#/2569-1/y1/courses · 390x844 · dark; /#/2569-1/y1/courses · 390x844 · dark · reduced motion (+6 more)
- Measured: "Circuits & Electronics" is right-aligned; div.course-list.svelte-15p0nqm:nth-of-type(2) > article.course-card.svelte-1nzqkb4:nth-of-type(1) > p.mt-0\.5.text-xs:nt is left; article.course-card.svelte-1nzqkb4:nth-of-type(1) > ul.mt-1\.5.space-y-0\.5 > li.flex.flex-wrap:nth-of-type(1) is left; article.course-card.svelte-1nzqkb4:nth-of-type(1) > ul.mt-1\.5.space-y-0\.5 > li.flex.flex-wrap:nth-of-type(2) is left
- Expected: a heading and the lede, list and buttons under it share one alignment (owner review 2026-11-04 rows 28 to 32: centre headings, lists aligned to them)
- Evidence: `section.rounded-2xl.bg-card > div.course-list.svelte-15p0nqm:nth-of-type(2) > article.course-card.svelte-1nzqkb4:nth-of-`, `div.course-list.svelte-15p0nqm:nth-of-type(2) > article.course-card.svelte-1nzqkb4:nth-of-type(1) > p.mt-0\.5.text-xs:nt`, `article.course-card.svelte-1nzqkb4:nth-of-type(1) > ul.mt-1\.5.space-y-0\.5 > li.flex.flex-wrap:nth-of-type(1)`, `article.course-card.svelte-1nzqkb4:nth-of-type(1) > ul.mt-1\.5.space-y-0\.5 > li.flex.flex-wrap:nth-of-type(2)`, `div.course-list.svelte-15p0nqm:nth-of-type(2) > article.course-card.svelte-1nzqkb4:nth-of-type(3) > p.mt-0\.5.text-xs:nt`, `article.course-card.svelte-1nzqkb4:nth-of-type(3) > ul.mt-1\.5.space-y-0\.5 > li.flex.flex-wrap`
- Fix: align the items with their heading: text-align and the row's justify-content together

### Mixed alignment under one heading
`M-MS05-2745` · MS-05 Alignment and grid · **measured**
- Where: /#/2569-1/y1/plan · 390x844 · dark; /#/2569-1/y1/plan · 390x844 · dark · reduced motion; /#/2569-1/y1/plan · 390x844 · light; /#/2569-1/y1/plan · 390x844 · light · reduced motion; /#/2569-1/y1/plan · 768x1024 · dark; /#/2569-1/y1/plan · 768x1024 · dark · reduced motion (+2 more)
- Measured: "Add a course" is left-aligned; aside.min-w-0.space-y-4 > section.border-t.pt-3:nth-of-type(2) > div.mt-2 is center
- Expected: a heading and the lede, list and buttons under it share one alignment (owner review 2026-11-04 rows 28 to 32: centre headings, lists aligned to them)
- Evidence: `div.grid.min-h-0 > aside.min-w-0.space-y-4 > section.border-t.pt-3:nth-of-type(2)`, `aside.min-w-0.space-y-4 > section.border-t.pt-3:nth-of-type(2) > div.mt-2`
- Fix: align the items with their heading: text-align and the row's justify-content together

### Bg colors that are not in the palette (4)
`M-MS08-0151` · MS-08 Color drift from the tokens · **measured** · tokens
- Where: /#/2569-1/y1/courses · 1440x900 · dark; /#/2569-1/y1/courses · 1440x900 · dark · reduced motion; /#/2569-1/y1/courses · 1440x900 · light; /#/2569-1/y1/courses · 1440x900 · light · reduced motion; /#/2569-1/y1/courses · 390x844 · dark; /#/2569-1/y1/courses · 390x844 · dark · reduced motion (+30 more)
- Measured: #0c63b4 x2 (closest token --ds-color-info-light-10); #0f76d6 x2 (closest token --ds-color-info-dark-9); #0e6cc4 x1 (closest token --ds-color-info-light-9); #085c66 x1 (closest token --ds-color-info-dark-7)
- Expected: colors from the tokens
- Evidence: `div.flex.items-start > h2.min-w-0.text-\[0\.9375rem\] > span.cc-dot.svelte-1nzqkb4`, `li.border-t.py-3:nth-of-type(1) > div.mt-2.space-y-1:nth-of-type(2) > div.relative.rounded-lg`, `div.week-scroll.overflow-x-auto > div.week-grid.svelte-jj2ihp > div.day-grid.svelte-jj2ihp:nth-of-type(21)`, `div.legend.svelte-1tbn9vw:nth-of-type(1) > span.legend-item.svelte-1tbn9vw:nth-of-type(1) > i.legend-swatch.svelte-1tbn9`, `div.week-grid.svelte-jj2ihp > div.day-grid.svelte-jj2ihp:nth-of-type(21) > div.block.svelte-jj2ihp:nth-of-type(1)`, `div.legend.svelte-1tbn9vw:nth-of-type(1) > span.legend-item.svelte-1tbn9vw:nth-of-type(2) > i.legend-swatch.svelte-1tbn9`
- Fix: use a color token; check dark mode too

### Corner radii off the system's
`M-MS09-0932` · MS-09 Radius, shadow, border and icon size · **measured** · tokens
- Where: /#/2569-1/y1/courses · 1440x900 · dark; /#/2569-1/y1/courses · 1440x900 · dark · reduced motion; /#/2569-1/y1/courses · 1440x900 · light; /#/2569-1/y1/courses · 1440x900 · light · reduced motion; /#/2569-1/y1/courses · 390x844 · dark; /#/2569-1/y1/courses · 390x844 · dark · reduced motion (+18 more)
- Measured: 3px x6 (nearest 2)
- Expected: radii: 0, 2, 4, 6, 8, 12, 16, 20, 24, 28, 32
- Evidence: `div.flex.items-start > h2.min-w-0.text-\[0\.9375rem\] > span.cc-dot.svelte-1nzqkb4`, `header.flex.shrink-0 > div.ml-auto.flex:nth-of-type(2) > button.inline-flex.items-center:nth-of-type(1)`
- Fix: use the radius tokens

### 7 letter-spacing values
`M-MS17-1983` · MS-17 Tracking and kerning that break words · **measured** · preflight 5
- Where: /#/2569-1/y1/courses · 1440x900 · dark; /#/2569-1/y1/courses · 1440x900 · dark · reduced motion; /#/2569-1/y1/courses · 1440x900 · light; /#/2569-1/y1/courses · 1440x900 · light · reduced motion; /#/2569-1/y1/courses · 390x844 · dark; /#/2569-1/y1/courses · 390x844 · dark · reduced motion (+42 more)
- Measured: -0.02em, -0.012em, -0.01em, -0.007em, 0.06em, 0.08em, 0.09em
- Expected: about 4: one for body, one or two for display sizes, one for capitals; each comes with its text style [inferred]
- Fix: fold letter-spacing into the type tokens and remove the per-element values

### Tracking gets looser as text gets bigger
`M-MS17-7580` · MS-17 Tracking and kerning that break words · **measured** · preflight 5
- Where: /#/2569-1/y1/plan · 1440x900 · dark; /#/2569-1/y1/plan · 1440x900 · dark · reduced motion; /#/2569-1/y1/plan · 1440x900 · light; /#/2569-1/y1/plan · 1440x900 · light · reduced motion; /#/2569-1/y1/plan · 390x844 · dark; /#/2569-1/y1/plan · 390x844 · dark · reduced motion (+18 more)
- Measured: 16 px is tracked -0.009em but 9.6 px is tracked -0.016em (1 pair(s) like this)
- Expected: tracking tightens as size grows: body near 0, display text slightly negative, only capitals and tiny labels open (preflight 5; the system's tracking per size)
- Evidence: `header.flex.shrink-0 > div.min-w-0:nth-of-type(1) > h2.text-base.font-semibold`, `li.border-t.py-3:nth-of-type(1) > div.flex.min-w-0:nth-of-type(1) > span.inline-flex.items-center:nth-of-type(1)`, `div.block.svelte-jj2ihp:nth-of-type(2) > div.gb-badges.svelte-jj2ihp > span.inline-flex.items-center:nth-of-type(1)`, `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > p.mt-0\.5.text-xs:nth-of-type(2)`
- Fix: give the large sizes the tighter value; set tracking with each text style, not per element

### Art or an image is drawn through text
`M-MS20-2024` · MS-20 Art drawn through text · **measured**
- Where: /#/2569-1/y1/plan · 1440x900 · light; /#/2569-1/y1/plan · 390x844 · dark
- Measured: "Mon 09:00–12:00 · ECC-608 / Tue 13:00–16": 0.6% of its line box is crossed
- Expected: no line art, chart or picture runs through a line of text: hidden text, then a screenshot, shows nothing sharp inside any line box (owner review 2026-11-05 row 6)
- Evidence: `div.relative.rounded-lg > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-xs:nth-of-type(2)`, `div.mt-2.space-y-1:nth-of-type(2) > div.relative.rounded-lg > p.mt-0\.5.truncate`, `div.mt-2.space-y-1:nth-of-type(2) > div.relative.rounded-lg:nth-of-type(1) > p.mt-0\.5.truncate`, `div.mt-2.space-y-1:nth-of-type(2) > div.relative.rounded-lg:nth-of-type(2) > p.mt-0\.5.truncate`
- Fix: move the art into its own box clear of the text, or give the text a solid backing

### Text is clipped and cannot be read under pseudoloc
`M-ST04-2896` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4 / 1.4.12
- Where: /#/2569-1/y1/week · 768x1024 · dark · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · light · stress: pseudoloc
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(25) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-name.svelte-jj2ihp:nth-of-: content 110x45 px in a 110x30 px box
- Expected: no content lost when text grows
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(25) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-name.svelte-jj2ihp:nth-of-`
- Fix: let the box grow (min-height, not height; overflow: visible) or wrap the text

### A box changes height when a toggle changes
`M-ST10-9920` · ST-10 A box changes height between states · **operated**
- Where: /#/2569-1/y1/courses · 390x844 · dark; /#/2569-1/y1/courses · 390x844 · light; /#/2569-1/y1/courses · 768x1024 · dark; /#/2569-1/y1/courses · 768x1024 · light; /#/2569-1/y1/exams · 390x844 · dark; /#/2569-1/y1/exams · 390x844 · light (+10 more)
- Measured: div#app > div.flex.h-dvh > div.mx-auto.flex is 1203.03 / 1414.33 px across segmented (1/2569, 2/2569)
- Expected: one footprint for every state: the box is as tall as its tallest state, so nothing below it jumps (owner review 2026-11-03 row 22)
- Evidence: `div#app > div.flex.h-dvh > div.mx-auto.flex`, `div.flex.w-max > div.flex.shrink-0:nth-of-type(1) > button.inline-flex.min-h-11:nth-of-type(1)`, `div.flex.w-max > div.flex.shrink-0:nth-of-type(2) > button.inline-flex.min-h-11:nth-of-type(1)`, `div.flex.w-max > div.flex.shrink-0:nth-of-type(3) > button.inline-flex.min-h-11:nth-of-type(1)`
- Fix: put every state in the same grid cell (grid-area: 1 / 1, visibility instead of display), or give the box the tallest state's height

### A control that changes nothing
`M-ST11-4250` · ST-11 A control that changes nothing · **operated**
- Where: /#/2569-1/y1/plan · 1440x900 · light
- Measured: segmented (Mon, Tue, Wed, Thu): no option changed anything in div.grid.min-h-0 > aside.min-w-0.space-y-4 > section.border-t.pt-3:nth-of-type(2) (layout, colour and text compared)
- Expected: every option visibly changes what it says it changes
- Evidence: `div.space-y-2 > div.flex.flex-wrap:nth-of-type(2) > button.inline-flex.items-center:nth-of-type(1)`, `div.space-y-2 > div.flex.flex-wrap:nth-of-type(2) > button.inline-flex.items-center:nth-of-type(2)`, `div.space-y-2 > div.flex.flex-wrap:nth-of-type(2) > button.inline-flex.items-center:nth-of-type(3)`
- Fix: wire the control up, or remove it

## Notes (37)

### Before launch: share image, favicon or indexing
`M-EN08-7888` · EN-08 Fonts downloaded but not used · **measured**
- Where: /#/2569-1/y1/courses · 1440x900 · dark; /#/2569-1/y1/courses · 1440x900 · dark · reduced motion; /#/2569-1/y1/courses · 1440x900 · light; /#/2569-1/y1/courses · 1440x900 · light · reduced motion; /#/2569-1/y1/courses · 390x844 · dark; /#/2569-1/y1/courses · 390x844 · dark · reduced motion (+42 more)
- Measured: missing a share image (og:image)
- Expected: a public page has a share image, a favicon and a description; noindex only on drafts

### Controls placed outside the page box
`M-IN08-2014` · IN-08 In the DOM is not the same as seen or reachable · **measured**
- Where: /#/2569-1/y1/courses · 1440x900 · dark · stress: longWords; /#/2569-1/y1/courses · 1440x900 · light · stress: longWords; /#/2569-1/y1/courses · 390x844 · dark · forced colors; /#/2569-1/y1/courses · 390x844 · dark; /#/2569-1/y1/courses · 390x844 · dark · reduced motion; /#/2569-1/y1/courses · 390x844 · dark · stress: longWords (+90 more)
- Measured: div.flex.w-max > div.flex.shrink-0:nth-of-type(2) > button.inline-flex.min-h-11:nth-of-type(3); div.flex.w-max > div.flex.shrink-0:nth-of-type(2) > button.inline-flex.min-h-11:nth-of-type(4); div.flex.w-max > div.flex.shrink-0:nth-of-type(3) > button.inline-flex.min-h-11:nth-of-type(1)
- Expected: a skip link that appears on focus is fine; anything else is off-canvas content
- Evidence: `div.flex.w-max > div.flex.shrink-0:nth-of-type(2) > button.inline-flex.min-h-11:nth-of-type(3)`, `div.flex.w-max > div.flex.shrink-0:nth-of-type(2) > button.inline-flex.min-h-11:nth-of-type(4)`, `div.flex.w-max > div.flex.shrink-0:nth-of-type(3) > button.inline-flex.min-h-11:nth-of-type(1)`, `div.flex.w-max > div.flex.shrink-0:nth-of-type(3) > button.inline-flex.min-h-11:nth-of-type(2)`, `div.flex.w-max > div.flex.shrink-0:nth-of-type(2) > button.inline-flex.min-h-11:nth-of-type(2)`, `div.flex.w-max > div.flex.shrink-0:nth-of-type(1) > button.inline-flex.min-h-11:nth-of-type(1)`
- Fix: Tab to it and confirm it appears

### Font weights outside the system's
`M-MS02-2927` · MS-02 Type scale drift · **measured**
- Where: /#/2569-1/y1/courses · 1440x900 · dark; /#/2569-1/y1/courses · 1440x900 · dark · reduced motion; /#/2569-1/y1/courses · 1440x900 · light; /#/2569-1/y1/courses · 1440x900 · light · reduced motion; /#/2569-1/y1/courses · 390x844 · dark; /#/2569-1/y1/courses · 390x844 · dark · reduced motion (+42 more)
- Measured: weight 600 on 20 element(s); the system uses [400, 500, 650]
- Expected: the system's weights
- Evidence: `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > p.text-\[0\.68rem\].font-semibold:nth-of-type(1)`, `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > p.text-eyebrow.font-semibold:nth-of-type(1)`

### Wrapped text with tight line height
`M-MS07-6394` · MS-07 Line length and line height · **measured** · WCAG 1.4.12
- Where: /#/2569-1/y1/courses · 1440x900 · dark · stress: longWords; /#/2569-1/y1/courses · 1440x900 · light · stress: longWords; /#/2569-1/y1/courses · 390x844 · dark · stress: longWords; /#/2569-1/y1/courses · 390x844 · dark · stress: pseudoloc; /#/2569-1/y1/courses · 390x844 · light · stress: longWords; /#/2569-1/y1/courses · 390x844 · light · stress: pseudoloc (+26 more)
- Measured: div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > h1.text-\[1\.8rem\].font-bold: line height 1.25x its size over several lines
- Expected: at least 1.3x for body text; 1.5x survives WCAG 1.4.12
- Evidence: `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > h1.text-\[1\.8rem\].font-bold`, `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(2) > span.mt-1.block:nth-of-type(2)`, `article.course-card.svelte-1nzqkb4:nth-of-type(1) > div.flex.items-start > h2.min-w-0.text-\[0\.9375rem\]`, `article.course-card.svelte-1nzqkb4:nth-of-type(2) > div.flex.items-start > h2.min-w-0.text-\[0\.9375rem\]`, `header.flex.shrink-0 > div.min-w-0:nth-of-type(1) > h2.text-base.font-semibold`, `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(1) > p.text-eyebrow.font-semibold:nth-of-type(1)`

### 3 color families on one page
`M-MS08-1758` · MS-08 Color drift from the tokens · **measured** · DC-L01-08
- Where: /#/2569-1/y1/week · 1440x900 · dark; /#/2569-1/y1/week · 1440x900 · dark · reduced motion; /#/2569-1/y1/week · 1440x900 · light; /#/2569-1/y1/week · 1440x900 · light · reduced motion; /#/2569-1/y1/week · 390x844 · dark; /#/2569-1/y1/week · 390x844 · dark · reduced motion (+6 more)
- Measured: blue (#0f76d6, #0c63b4, #0e6cc4) x8; teal (#0a6e7a, #085c66) x2; purple (#6b50f0) x1
- Expected: grays, one accent with one job, and status colors (DC-L01-08), with the danger color only on the part that is going wrong (making.md section 12: "More visual" means more information, not more colour)
- Evidence: `div.legend.svelte-1tbn9vw:nth-of-type(1) > span.legend-item.svelte-1tbn9vw:nth-of-type(1) > i.legend-swatch.svelte-1tbn9`, `div.legend.svelte-1tbn9vw:nth-of-type(1) > span.legend-item.svelte-1tbn9vw:nth-of-type(3) > i.legend-swatch.svelte-1tbn9`, `div.legend.svelte-1tbn9vw:nth-of-type(1) > span.legend-item.svelte-1tbn9vw:nth-of-type(2) > i.legend-swatch.svelte-1tbn9`
- Fix: pick the one accent; turn decorative colors gray; keep status colors for status, and red only on the part that is going wrong

### Border colors that are not in the palette (1)
`M-MS08-8825` · MS-08 Color drift from the tokens · **measured** · tokens
- Where: /#/2569-1/y1/week · 1440x900 · light; /#/2569-1/y1/week · 1440x900 · light · reduced motion; /#/2569-1/y1/week · 390x844 · light; /#/2569-1/y1/week · 390x844 · light · reduced motion; /#/2569-1/y1/week · 768x1024 · light; /#/2569-1/y1/week · 768x1024 · light · reduced motion
- Measured: #191921 x3 (closest token --ds-color-text-primary)
- Expected: colors from the tokens
- Evidence: `div.legend.svelte-1tbn9vw:nth-of-type(1) > span.legend-item.svelte-1tbn9vw:nth-of-type(1) > i.legend-swatch.svelte-1tbn9`
- Fix: use a color token; check dark mode too

### Negative margins in use
`M-MS11-5224` · MS-11 Overlaps, clipping and stacking · **measured**
- Where: /#/2569-1/y1/courses · 1440x900 · dark · forced colors; /#/2569-1/y1/courses · 1440x900 · dark; /#/2569-1/y1/courses · 1440x900 · dark · reduced motion; /#/2569-1/y1/courses · 1440x900 · dark · stress: longWords; /#/2569-1/y1/courses · 1440x900 · dark · stress: pseudoloc; /#/2569-1/y1/courses · 1440x900 · dark · stress: rtl (+186 more)
- Measured: div.rounded-2xl.bg-card > nav.flex.items-center > div.tab-scroll.-mx-1 marginRight -4 px
- Expected: usually a workaround that overlaps neighbours
- Evidence: `div.rounded-2xl.bg-card > nav.flex.items-center > div.tab-scroll.-mx-1`

### Hovering most sampled controls changes nothing you can see
`M-ST01-4049` · ST-01 Hover, focus, pressed and disabled never appeared · **operated**
- Where: /#/2569-1/y1/courses · 1440x900 · dark; /#/2569-1/y1/courses · 1440x900 · light; /#/2569-1/y1/courses · 768x1024 · dark; /#/2569-1/y1/courses · 768x1024 · light; /#/2569-1/y1/exams · 1440x900 · dark; /#/2569-1/y1/exams · 1440x900 · light (+6 more)
- Measured: 2 of 2: div.flex.w-max > div.flex.shrink-0:nth-of-type(1) > button.inline-flex.min-h-11:nth-of-type(1); section.rounded-2xl.bg-card > details.mt-3.border-t > summary.flex.min-h-11
- Expected: a hover cue on pointer devices
- Evidence: `div.flex.w-max > div.flex.shrink-0:nth-of-type(1) > button.inline-flex.min-h-11:nth-of-type(1)`, `section.rounded-2xl.bg-card > details.mt-3.border-t > summary.flex.min-h-11`, `div.flex.flex-wrap:nth-of-type(1) > label.inline-flex.min-h-11:nth-of-type(3) > input.size-4.accent-primary`
- Fix: confirm with a screenshot while hovering; touch-only products can skip this

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/courses · 1440x900 · dark · stress: longWords; /#/2569-1/y1/courses · 1440x900 · light · stress: longWords; /#/2569-1/y1/courses · 390x844 · dark; /#/2569-1/y1/courses · 390x844 · dark · stress: longWords; /#/2569-1/y1/courses · 390x844 · dark · stress: pseudoloc; /#/2569-1/y1/courses · 390x844 · dark · stress: rtl (+80 more)
- Measured: div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(3) > span.mt-1.block:nth-of-type(2): 'Live · updated 9 Nov, 20:56 Supercalifra' needs 534 px, has 350 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.grid.grid-cols-2 > div.rounded-2xl.bg-card:nth-of-type(3) > span.mt-1.block:nth-of-type(2)`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 1440x900 · dark · forced colors; /#/2569-1/y1/plan · 1440x900 · dark; /#/2569-1/y1/plan · 1440x900 · dark · reduced motion; /#/2569-1/y1/plan · 1440x900 · dark · stress: longWords; /#/2569-1/y1/plan · 1440x900 · dark · stress: pseudoloc; /#/2569-1/y1/plan · 1440x900 · dark · stress: rtl (+28 more)
- Measured: div.relative.rounded-lg > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-xs:nth-of-type(2): 'Mon 09:00–12:00 · ECC-608 / Tue 13:00–16' needs 330 px, has 224 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.relative.rounded-lg > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-xs:nth-of-type(2)`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 1440x900 · dark · forced colors; /#/2569-1/y1/plan · 1440x900 · dark; /#/2569-1/y1/plan · 1440x900 · dark · reduced motion; /#/2569-1/y1/plan · 1440x900 · dark · stress: longWords; /#/2569-1/y1/plan · 1440x900 · dark · stress: pseudoloc; /#/2569-1/y1/plan · 1440x900 · dark · stress: rtl (+22 more)
- Measured: li.border-t.py-3:nth-of-type(2) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2): 'Computer Programming' needs 159 px, has 151 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `li.border-t.py-3:nth-of-type(2) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2)`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 1440x900 · dark · forced colors; /#/2569-1/y1/plan · 1440x900 · dark; /#/2569-1/y1/plan · 1440x900 · dark · reduced motion; /#/2569-1/y1/plan · 1440x900 · dark · stress: longWords; /#/2569-1/y1/plan · 1440x900 · dark · stress: pseudoloc; /#/2569-1/y1/plan · 1440x900 · dark · stress: rtl (+24 more)
- Measured: li.border-t.py-3:nth-of-type(5) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2): 'General Physics Laboratory 1' needs 192 px, has 149 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `li.border-t.py-3:nth-of-type(5) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2)`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 1440x900 · dark · forced colors; /#/2569-1/y1/plan · 1440x900 · dark; /#/2569-1/y1/plan · 1440x900 · dark · reduced motion; /#/2569-1/y1/plan · 1440x900 · dark · stress: longWords; /#/2569-1/y1/plan · 1440x900 · dark · stress: pseudoloc; /#/2569-1/y1/plan · 1440x900 · dark · stress: rtl (+14 more)
- Measured: li.border-t.py-3:nth-of-type(6) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2): 'Introduction to Calculus' needs 158 px, has 149 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `li.border-t.py-3:nth-of-type(6) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2)`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 1440x900 · dark · forced colors; /#/2569-1/y1/plan · 1440x900 · dark · reduced motion; /#/2569-1/y1/plan · 1440x900 · dark · stress: longWords; /#/2569-1/y1/plan · 1440x900 · dark · stress: pseudoloc; /#/2569-1/y1/plan · 1440x900 · dark · stress: rtl; /#/2569-1/y1/plan · 1440x900 · dark · stress: textSpacing (+20 more)
- Measured: li.border-t.py-3:nth-of-type(3) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2): 'Chinese For Communication' needs 186 px, has 148 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `li.border-t.py-3:nth-of-type(3) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2)`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 1440x900 · dark · forced colors; /#/2569-1/y1/plan · 1440x900 · dark · reduced motion; /#/2569-1/y1/plan · 1440x900 · dark · stress: longWords; /#/2569-1/y1/plan · 1440x900 · dark · stress: pseudoloc; /#/2569-1/y1/plan · 1440x900 · dark · stress: rtl; /#/2569-1/y1/plan · 1440x900 · dark · stress: textSpacing (+20 more)
- Measured: li.border-t.py-3:nth-of-type(4) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2): 'Contemporary Marketing' needs 166 px, has 150 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `li.border-t.py-3:nth-of-type(4) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2)`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 1440x900 · dark · forced colors; /#/2569-1/y1/plan · 1440x900 · dark · reduced motion; /#/2569-1/y1/plan · 1440x900 · dark · stress: longWords; /#/2569-1/y1/plan · 1440x900 · dark · stress: pseudoloc; /#/2569-1/y1/plan · 1440x900 · dark · stress: rtl; /#/2569-1/y1/plan · 1440x900 · dark · stress: text200 (+24 more)
- Measured: div.mt-2.space-y-1:nth-of-type(2) > div.relative.rounded-lg > p.mt-0\.5.truncate: 'Lecturer Sirapakaporn Khooratchawanich ·' needs 386 px, has 275 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.mt-2.space-y-1:nth-of-type(2) > div.relative.rounded-lg > p.mt-0\.5.truncate`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 1440x900 · dark · forced colors; /#/2569-1/y1/plan · 1440x900 · dark · reduced motion; /#/2569-1/y1/plan · 1440x900 · dark · stress: longWords; /#/2569-1/y1/plan · 1440x900 · dark · stress: rtl; /#/2569-1/y1/plan · 1440x900 · dark · stress: text200; /#/2569-1/y1/plan · 1440x900 · dark · stress: textSpacing (+20 more)
- Measured: div.mt-2.space-y-1:nth-of-type(2) > div.relative.rounded-lg:nth-of-type(1) > p.mt-0\.5.truncate: 'Lecturer Digit Wannissorn · Mr. Ravipat ' needs 302 px, has 275 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.mt-2.space-y-1:nth-of-type(2) > div.relative.rounded-lg:nth-of-type(1) > p.mt-0\.5.truncate`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 1440x900 · dark · forced colors; /#/2569-1/y1/plan · 1440x900 · dark · reduced motion; /#/2569-1/y1/plan · 1440x900 · dark · stress: longWords; /#/2569-1/y1/plan · 1440x900 · dark · stress: rtl; /#/2569-1/y1/plan · 1440x900 · dark · stress: text200; /#/2569-1/y1/plan · 1440x900 · dark · stress: textSpacing (+18 more)
- Measured: div.mt-2.space-y-1:nth-of-type(2) > div.relative.rounded-lg:nth-of-type(2) > p.mt-0\.5.truncate: 'Lecturer Digit Wannissorn · Mr. Ravipat ' needs 302 px, has 275 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.mt-2.space-y-1:nth-of-type(2) > div.relative.rounded-lg:nth-of-type(2) > p.mt-0\.5.truncate`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 1440x900 · dark · stress: pseudoloc; /#/2569-1/y1/plan · 1440x900 · dark · stress: textSpacing; /#/2569-1/y1/plan · 1440x900 · light · stress: pseudoloc; /#/2569-1/y1/plan · 1440x900 · light · stress: textSpacing; /#/2569-1/y1/plan · 390x844 · dark · stress: pseudoloc; /#/2569-1/y1/plan · 390x844 · dark · stress: textSpacing (+2 more)
- Measured: li.border-t.py-3:nth-of-type(1) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2): '[Cïrcüïts & Éléctrônïcs Cïrcüïts ]' needs 210 px, has 64 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `li.border-t.py-3:nth-of-type(1) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2)`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 1440x900 · dark · stress: pseudoloc; /#/2569-1/y1/plan · 1440x900 · dark · stress: text200; /#/2569-1/y1/plan · 1440x900 · light · stress: pseudoloc; /#/2569-1/y1/plan · 1440x900 · light · stress: text200; /#/2569-1/y1/plan · 390x844 · dark · stress: text200; /#/2569-1/y1/plan · 390x844 · light · stress: text200
- Measured: div.relative.rounded-lg:nth-of-type(1) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-xs:nth-of-type(2): '[Thü 09:00–12:00 · HM-304 Thü 09:00–]' needs 229 px, has 205 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.relative.rounded-lg:nth-of-type(1) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-xs:nth-of-type(2)`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 1440x900 · dark · stress: text200; /#/2569-1/y1/plan · 1440x900 · light · stress: text200
- Measured: div.relative.rounded-lg:nth-of-type(2) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-xs:nth-of-type(2): 'Thu 13:00–16:00 · HM-304' needs 281 px, has 101 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.relative.rounded-lg:nth-of-type(2) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-xs:nth-of-type(2)`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 390x844 · dark · forced colors; /#/2569-1/y1/plan · 390x844 · dark · reduced motion; /#/2569-1/y1/plan · 390x844 · dark · stress: longWords; /#/2569-1/y1/plan · 390x844 · dark · stress: rtl; /#/2569-1/y1/plan · 390x844 · light · forced colors; /#/2569-1/y1/plan · 390x844 · light · reduced motion (+4 more)
- Measured: li.border-t.py-3:nth-of-type(13) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2): 'Meditation For Life Development' needs 215 px, has 158 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `li.border-t.py-3:nth-of-type(13) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2)`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 390x844 · dark · forced colors; /#/2569-1/y1/plan · 390x844 · dark · reduced motion; /#/2569-1/y1/plan · 390x844 · dark · stress: longWords; /#/2569-1/y1/plan · 390x844 · dark · stress: rtl; /#/2569-1/y1/plan · 390x844 · light · forced colors; /#/2569-1/y1/plan · 390x844 · light · reduced motion (+4 more)
- Measured: li.border-t.py-3:nth-of-type(14) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2): 'Professional Ethics And Laws' needs 193 px, has 158 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `li.border-t.py-3:nth-of-type(14) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2)`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 390x844 · dark · forced colors; /#/2569-1/y1/plan · 390x844 · dark · reduced motion; /#/2569-1/y1/plan · 390x844 · dark · stress: longWords; /#/2569-1/y1/plan · 390x844 · dark · stress: rtl; /#/2569-1/y1/plan · 390x844 · light · forced colors; /#/2569-1/y1/plan · 390x844 · light · reduced motion (+2 more)
- Measured: li.border-t.py-3:nth-of-type(15) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2): 'Psychology In Communication' needs 199 px, has 158 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `li.border-t.py-3:nth-of-type(15) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2)`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/plan · 390x844 · dark · forced colors; /#/2569-1/y1/plan · 390x844 · dark · reduced motion; /#/2569-1/y1/plan · 390x844 · light · forced colors; /#/2569-1/y1/plan · 390x844 · light · reduced motion; /#/2569-1/y1/plan · 768x1024 · dark · stress: pseudoloc; /#/2569-1/y1/plan · 768x1024 · dark · stress: textSpacing (+2 more)
- Measured: li.border-t.py-3:nth-of-type(16) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2): 'Public Administration And Public Policy ' needs 391 px, has 156 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `li.border-t.py-3:nth-of-type(16) > div.flex.min-w-0:nth-of-type(1) > span.truncate.text-sm:nth-of-type(2)`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/week · 390x844 · dark · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · dark · stress: textSpacing; /#/2569-1/y1/week · 390x844 · light · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · light · stress: textSpacing; /#/2569-1/y1/week · 768x1024 · dark · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · dark · stress: text200 (+2 more)
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(21) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-time.svelte-jj2ihp:nth-of-: '[09:00–12:00 09:00]' needs 121 px, has 86 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(21) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-time.svelte-jj2ihp:nth-of-`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/week · 390x844 · dark · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · dark · stress: textSpacing; /#/2569-1/y1/week · 390x844 · light · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · light · stress: textSpacing; /#/2569-1/y1/week · 768x1024 · dark · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · dark · stress: text200 (+2 more)
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(21) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-time.svelte-jj2ihp:nth-of-: '[13:00–16:00 13:00]' needs 121 px, has 86 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(21) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-time.svelte-jj2ihp:nth-of-`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/week · 390x844 · dark · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · dark · stress: text200; /#/2569-1/y1/week · 390x844 · dark · stress: textSpacing; /#/2569-1/y1/week · 390x844 · light · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · light · stress: text200; /#/2569-1/y1/week · 390x844 · light · stress: textSpacing
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(21) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-name.svelte-jj2ihp:nth-of-: '[Généràl Physïcs Làbôràtôry 1 Généràl Ph' needs 274 px, has 228 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(21) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-name.svelte-jj2ihp:nth-of-`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/week · 390x844 · dark · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · dark · stress: textSpacing; /#/2569-1/y1/week · 390x844 · light · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · light · stress: textSpacing; /#/2569-1/y1/week · 768x1024 · dark · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · dark · stress: text200 (+2 more)
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(22) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-time.svelte-jj2ihp:nth-of-: '[08:45–12:00 08:45]' needs 121 px, has 86 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(22) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-time.svelte-jj2ihp:nth-of-`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/week · 390x844 · dark · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · dark · stress: textSpacing; /#/2569-1/y1/week · 390x844 · light · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · light · stress: textSpacing; /#/2569-1/y1/week · 768x1024 · dark · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · dark · stress: text200 (+2 more)
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(22) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-time.svelte-jj2ihp:nth-of-: '[13:00–16:00 13:00]' needs 121 px, has 86 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(22) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-time.svelte-jj2ihp:nth-of-`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/week · 390x844 · dark · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · dark · stress: textSpacing; /#/2569-1/y1/week · 390x844 · light · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · light · stress: textSpacing; /#/2569-1/y1/week · 768x1024 · dark · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · dark · stress: text200 (+2 more)
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(23) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-time.svelte-jj2ihp:nth-of-: '[08:45–12:00 08:45]' needs 121 px, has 86 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(23) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-time.svelte-jj2ihp:nth-of-`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/week · 390x844 · dark · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · dark · stress: textSpacing; /#/2569-1/y1/week · 390x844 · light · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · light · stress: textSpacing; /#/2569-1/y1/week · 768x1024 · dark · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · dark · stress: text200 (+2 more)
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(23) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-time.svelte-jj2ihp:nth-of-: '[13:00–16:00 13:00]' needs 121 px, has 86 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(23) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-time.svelte-jj2ihp:nth-of-`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/week · 390x844 · dark · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · dark · stress: textSpacing; /#/2569-1/y1/week · 390x844 · light · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · light · stress: textSpacing; /#/2569-1/y1/week · 768x1024 · dark · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · dark · stress: text200 (+2 more)
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(25) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-time.svelte-jj2ihp:nth-of-: '[09:00–12:00 09:00]' needs 121 px, has 86 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(25) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-time.svelte-jj2ihp:nth-of-`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/week · 390x844 · dark · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · dark · stress: textSpacing; /#/2569-1/y1/week · 390x844 · light · stress: pseudoloc; /#/2569-1/y1/week · 390x844 · light · stress: textSpacing; /#/2569-1/y1/week · 768x1024 · dark · stress: pseudoloc; /#/2569-1/y1/week · 768x1024 · light · stress: pseudoloc
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(25) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-time.svelte-jj2ihp:nth-of-: '[13:00–16:00 13:00]' needs 121 px, has 86 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(25) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-time.svelte-jj2ihp:nth-of-`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/week · 390x844 · dark · stress: text200; /#/2569-1/y1/week · 390x844 · light · stress: text200
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(23) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-name.svelte-jj2ihp:nth-of-: 'Introduction to Calculus' needs 275 px, has 254 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(23) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-name.svelte-jj2ihp:nth-of-`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/week · 390x844 · dark · stress: text200; /#/2569-1/y1/week · 390x844 · light · stress: text200
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(25) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-name.svelte-jj2ihp:nth-of-: 'Computer Programming' needs 278 px, has 254 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(25) > div.block.svelte-jj2ihp:nth-of-type(1) > span.gb-name.svelte-jj2ihp:nth-of-`
- Fix: confirm the full value can be read elsewhere

### Text is cut with an ellipsis
`M-ST04-1894` · ST-04 Long text and long unbroken strings · **measured** · WCAG 1.4.4
- Where: /#/2569-1/y1/week · 390x844 · dark · stress: text200; /#/2569-1/y1/week · 390x844 · light · stress: text200
- Measured: div.day-grid.svelte-jj2ihp:nth-of-type(25) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-name.svelte-jj2ihp:nth-of-: 'Computer Programming' needs 278 px, has 254 px
- Expected: intentional, with the full text reachable (title, tooltip, expand)
- Evidence: `div.day-grid.svelte-jj2ihp:nth-of-type(25) > div.block.svelte-jj2ihp:nth-of-type(2) > span.gb-name.svelte-jj2ihp:nth-of-`
- Fix: confirm the full value can be read elsewhere

## Coverage

| Cell | Status | Evidence |
|---|---|---|
| `#/2569-1/y1/week|390x844|light` | done | opendesigner/review/bars/2569-1-y1-week-390x844-light.json, opendesigner/review/console/2569-1-y1-week-390x844-light.json, opendesigner/review/focus/2569-1-y1-week-390x844-light.json |
| `#/2569-1/y1/week|390x844|dark` | done | opendesigner/review/bars/2569-1-y1-week-390x844-dark.json, opendesigner/review/console/2569-1-y1-week-390x844-dark.json, opendesigner/review/focus/2569-1-y1-week-390x844-dark.json |
| `#/2569-1/y1/week|768x1024|light` | done | opendesigner/review/bars/2569-1-y1-week-768x1024-light.json, opendesigner/review/console/2569-1-y1-week-768x1024-light.json, opendesigner/review/focus/2569-1-y1-week-768x1024-light.json |
| `#/2569-1/y1/week|768x1024|dark` | done | opendesigner/review/bars/2569-1-y1-week-768x1024-dark.json, opendesigner/review/console/2569-1-y1-week-768x1024-dark.json, opendesigner/review/focus/2569-1-y1-week-768x1024-dark.json |
| `#/2569-1/y1/week|1440x900|light` | done | opendesigner/review/bars/2569-1-y1-week-1440x900-light.json, opendesigner/review/console/2569-1-y1-week-1440x900-light.json, opendesigner/review/focus/2569-1-y1-week-1440x900-light.json |
| `#/2569-1/y1/week|1440x900|dark` | done | opendesigner/review/bars/2569-1-y1-week-1440x900-dark.json, opendesigner/review/console/2569-1-y1-week-1440x900-dark.json, opendesigner/review/focus/2569-1-y1-week-1440x900-dark.json |
| `#/2569-1/y1/courses|390x844|light` | todo |  |
| `#/2569-1/y1/courses|390x844|dark` | todo |  |
| `#/2569-1/y1/courses|768x1024|light` | todo |  |
| `#/2569-1/y1/courses|768x1024|dark` | todo |  |
| `#/2569-1/y1/courses|1440x900|light` | todo |  |
| `#/2569-1/y1/courses|1440x900|dark` | todo |  |
| `#/2569-1/y1/exams|390x844|light` | todo |  |
| `#/2569-1/y1/exams|390x844|dark` | todo |  |
| `#/2569-1/y1/exams|768x1024|light` | todo |  |
| `#/2569-1/y1/exams|768x1024|dark` | todo |  |
| `#/2569-1/y1/exams|1440x900|light` | todo |  |
| `#/2569-1/y1/exams|1440x900|dark` | todo |  |
| `#/2569-1/y1/plan|390x844|light` | todo |  |
| `#/2569-1/y1/plan|390x844|dark` | todo |  |
| `#/2569-1/y1/plan|768x1024|light` | todo |  |
| `#/2569-1/y1/plan|768x1024|dark` | todo |  |
| `#/2569-1/y1/plan|1440x900|light` | todo |  |
| `#/2569-1/y1/plan|1440x900|dark` | todo |  |
| `task:#/2569-1/y1/week|scroll-walk` | done | run by capture.py |
| `task:#/2569-1/y1/week|focus-walk` | done | run by capture.py |
| `task:#/2569-1/y1/week|hover-and-press` | done | run by capture.py |
| `task:#/2569-1/y1/week|states-and-data` | todo |  |
| `task:#/2569-1/y1/week|motion` | done | run by capture.py (frames only when the page has animations) |
| `task:#/2569-1/y1/week|stress-text` | done | run by capture.py |
| `task:#/2569-1/y1/week|reduced-motion` | done | run by capture.py |
| `task:#/2569-1/y1/week|forced-colors` | done | run by capture.py |
| `task:#/2569-1/y1/week|console-and-network` | done | run by capture.py |
| `task:#/2569-1/y1/week|letter-reveals` | done | run by capture.py |
| `task:#/2569-1/y1/week|text-pixels` | done | run by capture.py |
| `task:#/2569-1/y1/week|floating-bars` | done | run by capture.py |
| `task:#/2569-1/y1/week|toggles` | done | run by capture.py |
| `task:#/2569-1/y1/courses|scroll-walk` | todo |  |
| `task:#/2569-1/y1/courses|focus-walk` | todo |  |
| `task:#/2569-1/y1/courses|hover-and-press` | todo |  |
| `task:#/2569-1/y1/courses|states-and-data` | todo |  |
| `task:#/2569-1/y1/courses|motion` | todo |  |
| `task:#/2569-1/y1/courses|stress-text` | todo |  |
| `task:#/2569-1/y1/courses|reduced-motion` | todo |  |
| `task:#/2569-1/y1/courses|forced-colors` | todo |  |
| `task:#/2569-1/y1/courses|console-and-network` | todo |  |
| `task:#/2569-1/y1/courses|letter-reveals` | todo |  |
| `task:#/2569-1/y1/courses|text-pixels` | todo |  |
| `task:#/2569-1/y1/courses|floating-bars` | todo |  |
| `task:#/2569-1/y1/courses|toggles` | todo |  |
| `task:#/2569-1/y1/exams|scroll-walk` | todo |  |
| `task:#/2569-1/y1/exams|focus-walk` | todo |  |
| `task:#/2569-1/y1/exams|hover-and-press` | todo |  |
| `task:#/2569-1/y1/exams|states-and-data` | todo |  |
| `task:#/2569-1/y1/exams|motion` | todo |  |
| `task:#/2569-1/y1/exams|stress-text` | todo |  |
| `task:#/2569-1/y1/exams|reduced-motion` | todo |  |
| `task:#/2569-1/y1/exams|forced-colors` | todo |  |
| `task:#/2569-1/y1/exams|console-and-network` | todo |  |
| `task:#/2569-1/y1/exams|letter-reveals` | todo |  |
| `task:#/2569-1/y1/exams|text-pixels` | todo |  |
| `task:#/2569-1/y1/exams|floating-bars` | todo |  |
| `task:#/2569-1/y1/exams|toggles` | todo |  |
| `task:#/2569-1/y1/plan|scroll-walk` | todo |  |
| `task:#/2569-1/y1/plan|focus-walk` | todo |  |
| `task:#/2569-1/y1/plan|hover-and-press` | todo |  |
| `task:#/2569-1/y1/plan|states-and-data` | todo |  |
| `task:#/2569-1/y1/plan|motion` | todo |  |
| `task:#/2569-1/y1/plan|stress-text` | todo |  |
| `task:#/2569-1/y1/plan|reduced-motion` | todo |  |
| `task:#/2569-1/y1/plan|forced-colors` | todo |  |
| `task:#/2569-1/y1/plan|console-and-network` | todo |  |
| `task:#/2569-1/y1/plan|letter-reveals` | todo |  |
| `task:#/2569-1/y1/plan|text-pixels` | todo |  |
| `task:#/2569-1/y1/plan|floating-bars` | todo |  |
| `task:#/2569-1/y1/plan|toggles` | todo |  |

## Re-run

Fix, then run the same cells again and `review.py check` on the new probe files: it prints what was resolved and what is new. Do not mark a cell done from memory.
