# ADR 0001 — Svelte 5 + Vite + TypeScript + shadcn-svelte

**Status:** accepted
**Date:** 2026-11-07

## Context

The site is a single static page (~97 KB) with growing client state: plan entries, filters, conflict checks, GenEd cache, PNG export. Hand-written DOM rendering and inline CSS have reached the point where readability and regression risk dominate.

## Decision

Rewrite as a Vite + Svelte 5 + TypeScript single-page app, styled with Tailwind CSS v4, shadcn-svelte components (Bits UI primitives), a tweakcn-derived token theme, and `lucide-svelte` icons. Static Netlify deploy from `dist/`. No router or state library; hash-based routing and rune state.

## Consequences

- Component model with typed domain modules and testable pure logic.
- Smaller runtime than React/Next; Next rejected because the app has no server rendering, API routes, or SEO needs.
- New build step and `netlify.toml`; legacy `index.html` retained until parity.
- Custom CSS limited to timetable geometry, category colours, and print.

## Alternatives

- Stay vanilla, extract modules — cheaper, but keeps manual DOM and untyped state.
- React + Vite — viable, larger runtime; chosen only if contributor familiarity outweighs bundle size.
- Next.js — rejected: unused SSR/server features.
