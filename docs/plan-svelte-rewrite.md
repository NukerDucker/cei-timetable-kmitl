# Execution plan — Svelte rewrite (moonshot)

## Locked decisions
- Stack: Svelte 5 + Vite + TS strict + Tailwind v4 + shadcn-svelte (Bits UI) + tweakcn tokens + lucide-svelte.
- No router/state/CSS libraries; hash URL state (ADR 0004).
- Domain: Course → Section → Session; PlanEntry references a section ID (ADR 0002).
- Plan picker scoped to the selected Year tab + GenEd; Cohort dropdown removed (ADR 0003).
- GenEd: owner 48, 966-only, 6 h cache, stale-while-revalidate, retry, never blank saved entries.
- TA: role on entry; lab sessions only; lecture hidden; exam conflicts skipped; toggle only when lab exists.
- Category colours: core blue, CEI elective purple, GenEd teal; labs inherit; legend in Week + Plan.
- Theme: neutral/zinc surfaces, KMITL orange accent, radius 8, dense type scale.
- Fonts: self-host IBM Plex Sans Thai variable subset.
- Filters: inline rail desktop; shadcn Sheet on mobile.
- Tests: Vitest domain + Testing Library components + Playwright six flows (local/CI, not Netlify build).
- Netlify: `npm run typecheck && npm test && npm run build`, publish `dist`, Node 22, keep `/kmitl/api` proxy; deploy preview before production.
- Offline/PWA: deferred to Phase 8 after cutover.

## Architecture
```
src/
  main.tsx App.svelte
  domain/{types,api,gened,plan,conflicts,filters,timeRange,exportPng,categories}.ts
  state/{terms,gened,plan,route}.svelte.ts
  components/{shell,week,courses,plan}/…
  components/ui/…            shadcn-svelte
  styles/{tokens,grid}.css
tests/unit tests/component tests/e2e
```

## Phases and agents
0. Baseline: LCP/CLS/INP, axe, screenshots 390–1920. [general-purpose audit]
1. Scaffold Svelte/Vite/TS/Tailwind/shadcn, `netlify.toml`, Vite proxy, theme tokens, fonts. [general-purpose]
2. Domain port + unit tests (conflicts, filters, sort, range, migration, GenEd). [builder agents + cavecrew-reviewer]
3. Shell parity: tabs, hash routing, Week/Courses/Exams, theme, status. [builder agents]
4. Plan view: cohort-scoped picker + GenEd, filters/Sort/Sheet, conflicts, TA, persistence, PNG. [builder agents]
5. UX skills pass: ux-audit, ui-ux-pro-max, frontend-design, frontend-design-direction; dense components, icons, states. [design builder + reviewer]
6. A11y + performance gates (ecc:frontend-a11y): axe 0 critical/serious, keyboard, targets; LCP < 2.5 s, CLS < 0.1, INP < 200 ms, JS < 140 KB gz, CSS < 20 KB gz.
7. E2E + parity checklist; remove legacy `index.html`.
8. Post-cutover: PWA/offline, optional named plans, drag-drop only if requested.

## Gates
- typecheck, unit + component tests, build, Playwright, axe, perf budgets, parity checklist.
- Netlify preview verified before production switch.

## Non-goals
Named plans, drag-and-drop, auto-suggestions, sharing backend — not in the parity cutover.
