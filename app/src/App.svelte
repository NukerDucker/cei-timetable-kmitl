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
  <header class="mx-auto max-w-[1400px] px-3 pt-3 sm:px-4">
    <div class="grid grid-cols-2 gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
      <div class="col-span-2 rounded-2xl border bg-card p-4 shadow-card md:col-span-1">
        <p class="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          KMITL · Faculty of Engineering
        </p>
        <h1 class="text-[1.8rem] font-bold leading-tight tracking-[-0.02em] sm:text-[2rem]">
          CEI Schedule
        </h1>
        <p class="mt-0.5 text-xs text-muted-foreground">Computer Engineering · International</p>
      </div>
      <div class="rounded-2xl border bg-card p-4 shadow-card">
        <span class="block text-[0.62rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Term</span>
        <span class="mt-1 block text-xl font-semibold leading-tight">{term?.label ?? '—'}</span>
      </div>
      <div class="min-w-0 rounded-2xl border bg-card p-4 shadow-card">
        <span class="block text-[0.62rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Live sync</span>
        <span
          class="mt-1 block truncate text-xs text-muted-foreground"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          title={state.statusText}
        >
          {state.statusText}
        </span>
      </div>
    </div>
  </header>

  <div class="mx-auto flex max-w-[1400px] flex-col gap-3 px-3 pb-12 pt-3 sm:px-4">
    <div class="rounded-2xl border bg-card p-2 shadow-card">
      <ControlBar
        route={route.current}
        onchange={(patch) => route.set(patch)}
        onprefetch={prefetch}
      />
    </div>


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
