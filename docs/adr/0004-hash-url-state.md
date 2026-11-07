# ADR 0004 — Hash-based URL state

**Status:** accepted
**Date:** 2026-11-07

## Context

Term, cohort and view live only in radio inputs; reloads reset them and a selection cannot be shared. The rewrite needs deep links without adding a router dependency.

## Decision

Encode UI state in the hash: `#/2569-1/y3/plan` = term, cohort, view. Views: `week`, `courses`, `exams`, `plan`. Tab changes use `history.replaceState`; `popstate` restores state. Unknown/invalid segments fall back to `2569-1/y1/week`. No router library.

## Consequences

- Reload, back/forward and sharing preserve state.
- Plan links open the Plan view for a specific term/cohort.
- Route parsing is a small pure module, unit-tested against malformed hashes.

## Alternatives

- Query string (`?term=…`) — works, but hash avoids Netlify redirect rewrites.
- SvelteKit/router — rejected: one page, no server routes.
