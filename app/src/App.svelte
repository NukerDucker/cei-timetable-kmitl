<script lang="ts">
  import { onDestroy } from 'svelte'
  import CourseList from './lib/components/courses/CourseList.svelte'
  import ExamTable from './lib/components/exams/ExamTable.svelte'
  import PlanView from './lib/components/plan/PlanView.svelte'
  import ControlBar from './lib/components/shell/ControlBar.svelte'
  import Legend from './lib/components/week/Legend.svelte'
  import WeekGrid from './lib/components/week/WeekGrid.svelte'
  import { createGenedState } from './state/gened.svelte'
  import type { GenedStateStore } from './state/gened.svelte'
  import { createPlanState } from './state/plan.svelte'
  import type { PlanState } from './state/plan.svelte'
  import { COHORT_LABELS, RouteState } from './state/route.svelte'
  import type { RouteView } from './state/route.svelte'
  import { createTermsState } from './state/terms.svelte'
  import type { TermsState } from './state/terms.svelte'

  interface Props {
    /** Injected in tests; production creates the cache-first live store. */
    state?: TermsState
    planState?: PlanState
    genedState?: GenedStateStore
  }

  let { state = createTermsState(), planState, genedState }: Props = $props()

  const fallbackGened = createGenedState()
  const gened = $derived(genedState ?? fallbackGened)
  const fallbackPlan = createPlanState({
    context: () => ({ terms: state.terms, gened: gened.states }),
  })
  const plan = $derived(planState ?? fallbackPlan)

  const route = new RouteState()
  onDestroy(() => route.dispose())

  const term = $derived(state.termById(route.current.term))
  const cohort = $derived(term?.years.find((year) => year.id === route.current.cohort))
  const cohortLabel = $derived(COHORT_LABELS[route.current.cohort])
  const panelLabel = $derived(term ? `${term.label} · ${cohortLabel}` : cohortLabel)
  const planLabel = $derived(term ? `Plan · ${term.label}` : 'Plan')

  function prefetch(view: RouteView): void {
    if (view !== 'plan') return
    void gened.ensure(route.current.term)
  }
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
    <ControlBar
      route={route.current}
      onchange={(patch) => route.set(patch)}
      onprefetch={prefetch}
    />

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
      {:else if route.current.view === 'plan'}
        <section class="rounded-2xl bg-card p-3 shadow-card sm:p-4" aria-label={planLabel}>
          <PlanView
            terms={state.terms}
            termId={route.current.term}
            cohort={route.current.cohort}
            plan={plan}
            gened={gened}
            onCohortChange={(next) => route.set({ cohort: next })}
          />
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
