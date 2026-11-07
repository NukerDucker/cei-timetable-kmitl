<script lang="ts">
  import { onDestroy } from 'svelte'
  import CourseList from './lib/components/courses/CourseList.svelte'
  import ExamTable from './lib/components/exams/ExamTable.svelte'
  import ControlBar from './lib/components/shell/ControlBar.svelte'
  import Legend from './lib/components/week/Legend.svelte'
  import WeekGrid from './lib/components/week/WeekGrid.svelte'
  import { COHORT_LABELS, RouteState } from './state/route.svelte'
  import { createTermsState } from './state/terms.svelte'
  import type { TermsState } from './state/terms.svelte'

  interface Props {
    /** Injected in tests; production creates the cache-first live store. */
    state?: TermsState
  }

  let { state = createTermsState() }: Props = $props()

  const route = new RouteState()
  onDestroy(() => route.dispose())

  const term = $derived(state.termById(route.current.term))
  const cohort = $derived(term?.years.find((year) => year.id === route.current.cohort))
  const cohortLabel = $derived(COHORT_LABELS[route.current.cohort])
  const panelLabel = $derived(term ? `${term.label} · ${cohortLabel}` : cohortLabel)
</script>

<div class="min-h-dvh bg-background text-foreground">
  <header class="material-bar sticky top-0 z-20 border-b">
    <div class="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3">
      <div class="min-w-0">
        <p class="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          KMITL · Faculty of Engineering
        </p>
        <h1 class="text-[1.6rem] font-bold leading-tight tracking-[-0.02em] sm:text-[1.75rem]">
          CEI Schedule
        </h1>
      </div>
      <span class="ml-auto shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
        {term?.label ?? '—'}
      </span>
    </div>
  </header>

  <div class="mx-auto flex max-w-[1400px] flex-col gap-3 px-3 pb-12 pt-3 sm:px-4">
    <ControlBar route={route.current} onchange={(patch) => route.set(patch)} />

    <p
      class="min-h-[1.25rem] text-[0.72rem] text-muted-foreground"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {state.statusText}
    </p>

    <main>
      {#if !term}
        <section class="rounded-2xl bg-card p-4 shadow-card">
          <p class="text-sm text-muted-foreground">This timetable is unavailable.</p>
        </section>
      {:else if !cohort}
        <section class="rounded-2xl bg-card p-4 shadow-card">
          <p class="text-sm text-muted-foreground">
            No {COHORT_LABELS[route.current.cohort].toLowerCase()} timetable published for {term.label}.
          </p>
        </section>
      {:else}
        <section class="rounded-2xl bg-card p-3 shadow-card sm:p-4" aria-label={panelLabel}>
          {#if route.current.view === 'week'}
            <Legend />
            <WeekGrid courses={cohort.courses} />
          {:else if route.current.view === 'courses'}
            <CourseList courses={cohort.courses} label={panelLabel} />
          {:else if route.current.view === 'exams'}
            <ExamTable courses={cohort.courses} />
          {:else}
            <div
              class="flex min-h-48 flex-col items-center justify-center gap-1 rounded-xl border border-dashed p-6 text-center"
            >
              <p class="text-sm font-semibold">Plan coming</p>
              <p class="max-w-sm text-xs text-muted-foreground">
                The cohort planner arrives in the next phase. Week, Courses and Exams are live.
              </p>
            </div>
          {/if}

          {#if cohort.notes.length > 0}
            <details class="mt-3 border-t pt-2.5 text-[0.8125rem] text-muted-foreground">
              <summary class="flex min-h-11 cursor-pointer items-center font-medium text-foreground sm:min-h-8">
                Notes on credits and exam arrangements
              </summary>
              <ul class="mt-1.5 ml-4 list-disc space-y-0.5">
                {#each cohort.notes as note, index (index)}
                  <li>{note}</li>
                {/each}
              </ul>
            </details>
          {/if}
        </section>
      {/if}
    </main>
  </div>
</div>
