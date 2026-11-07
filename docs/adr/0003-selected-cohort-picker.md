# ADR 0003 — Plan picker scoped to the selected cohort

**Status:** accepted
**Date:** 2026-11-07

## Context

The Plan picker listed every cohort at once (1st–4th Year plus GenEd). Four groups of ~20 courses each made the list long, and a Cohort dropdown duplicated the Year tabs already present in the control bar.

## Decision

The picker follows the global **Year tab**: it lists that cohort's CEI courses plus a **GenEd** group. The Cohort dropdown is removed. Existing plan entries from other cohorts remain visible — retakes and cross-cohort planning still work; only the browse list is scoped.

Filters retained: day, credits, hide conflicting. Sorting applies within each of the two groups.

## Consequences

- Shorter list, one source of truth for cohort selection (the Year tabs).
- GenEd is always reachable without changing the Year tab.
- Cross-cohort browsing requires switching the Year tab, which is one click.

## Alternatives

- Cohort dropdown defaulting to the selected year — duplicates the Year tabs.
- Selected year only, GenEd behind the dropdown — hides GenEd unnecessarily.
