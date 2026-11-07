# ADR 0002 — Course / Section / Session identity

**Status:** accepted
**Date:** 2026-11-07

## Context

The current page conflates levels: CEI entries are keyed `code@cohort` (an anchored lecture/lab pair), GenEd entries are keyed `code#section` (each section treated as its own course), and a plan entry stores that string. This makes retakes, section choice, and migration fragile.

## Decision

Model three levels explicitly:

- **Course** — subject offering in a term (subject code, credits, category, lecturers).
- **Section** — numbered class of a course (901, 1901, 801…); the unit a student registers for.
- **Session** — meeting (day, start, end, room, lab marker).

A **PlanEntry** references a stable Section identity plus a role, not a display string or API row id. Identity survives live-data refresh (derived from subject code + section number, never from `teach_table_id`).

Picker granularity stays as today: one row per cohort course for CEI (its anchored lecture/lab pair), one row per GenEd section.

## Consequences

- Retakes and GenEd sections resolve unambiguously; multi-section support later needs no schema change.
- Local plan storage migrates from `code@cohort` / `code#section` keys to section IDs; legacy entries must keep resolving.
- Live refresh cannot orphan entries as long as code + section exist.

## Alternatives

- Keep flat course objects — simplest port, but perpetuates the GenEd/CEI identity split.
- Reference raw API rows — rejected: ids change between fetches.
