# CEI Schedule

Svelte 5 + TypeScript + Vite + Tailwind 4 app for KMITL Computer Engineering timetables.

## Commands

```sh
npm run dev        # Vite on :5174, /kmitl/api proxied to the registrar
npm run test       # vitest
npm run check      # svelte-check (alias: typecheck)
npm run build      # production build to dist/
```

## Layout

- `src/App.svelte` — shell, header, view switch.
- `src/lib/components/` — `week`, `courses`, `exams`, `plan`, `shell`, and `ui` primitives.
- `src/domain/` — pure data, filtering, conflict, export, and time logic with colocated tests.
- `src/state/` — Svelte 5 rune stores: terms, route, plan, gened.
- `src/app.css` — runtime design tokens (light/dark) and Tailwind theme.

## Data

Live data comes from `/kmitl/api` (Netlify rewrite; Vite proxy locally) and is cached for 6 hours under `cei-live-v3-2569`. `domain/curated.ts` is the offline snapshot used when both live fetch and cache fail. Plan selections persist under `cei-plan-v2`; GenEd under `cei-gened-cache-v2`; theme under `timetable-theme`.

Design system: `../DESIGN.md`. Deployment: `../netlify.toml`.
