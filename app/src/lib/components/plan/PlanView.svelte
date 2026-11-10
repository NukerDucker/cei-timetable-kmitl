<script lang="ts">
  import { onDestroy, onMount, tick, untrack } from 'svelte'
  import { Dialog } from 'bits-ui'
  import { X } from 'lucide-svelte'
  import { planConflictDetails, planConflicts } from '../../../domain/conflicts'
  import { exportPlanPng } from '../../../domain/exportPng'
  import {
    DEFAULT_PLAN_FILTER,
    courseCredits,
    creditValues as domainCreditValues,
    filterActive,
    planTimeRange,
  } from '../../../domain/filters'
  import type { PlanFilter } from '../../../domain/filters'
  import { planCourses } from '../../../domain/plan'
  import type { PlanContext } from '../../../domain/plan'
  import { buildPickerOptions, selectPickerGroups, splitGroupsByCategory } from '../../../domain/planOptions'
  import type { PickerOption } from '../../../domain/planOptions'
  import { parseSectionId } from '../../../domain/section'
  import type { CohortId, PlanCourse, Term, TermId } from '../../../domain/types'
  import type { GenedStateStore } from '../../../state/gened.svelte'
  import type { PlanState } from '../../../state/plan.svelte'
  import { Input } from '$lib/components/ui/input'
  import Badge from '$lib/components/ui/badge/badge.svelte'
  import Button from '../ui/button/button.svelte'
  import Legend from '../week/Legend.svelte'
  import WeekGrid from '../week/WeekGrid.svelte'
  import PlanFilterControls from './PlanFilterControls.svelte'
  import PlanPickerResults from './PlanPickerResults.svelte'

  interface Props {
    terms: Term[]
    termId: TermId
    cohort: CohortId
    plan: PlanState
    gened: GenedStateStore
    onCohortChange?: (cohort: CohortId) => void
  }

  let { terms, termId, cohort, plan, gened, onCohortChange }: Props = $props()

  const term = $derived(terms.find((candidate) => candidate.id === termId))
  const selectedYear = $derived(term?.years.find((year) => year.id === cohort))
  const context = $derived<PlanContext>({ terms, gened: gened.states })
  const courses = $derived(planCourses(termId, plan.entries, context))
  const details = $derived(planConflictDetails(courses))
  const conflictLabels = $derived([...new Set(details.map((detail) => detail.label))])
  const conflictKeys = $derived([
    ...new Set(details.flatMap((detail) => [detail.a.key, detail.b.key])),
  ])
  const taKeys = $derived(
    courses.filter((course) => course.planRole === 'TA').map((course) => course.key),
  )
  const range = $derived(planTimeRange(courses))
  const unresolved = $derived(plan.unresolved(termId, context))
  const unresolvedEntries = $derived(plan.unresolvedEntries(termId, context))
  const genedState = $derived(gened.stateFor(termId))
  const genedCourses = $derived(gened.coursesFor(termId))
  const genedGroupLabel = $derived(
    genedState?.status === 'ready'
      ? `Gen Ed (${new Set(genedCourses.map((course) => course.code)).size})`
      : 'Gen Ed',
  )
  const inPlanCodes = $derived(new Set(courses.map((course) => course.code)))
  const CREDIT_LIMIT = 22
  const creditTotal = $derived(
    courses.reduce(
      (sum, course) => (course.planRole === 'TA' ? sum : sum + (courseCredits(course) ?? 0)),
      0,
    ),
  )
  const overCredit = $derived(creditTotal > CREDIT_LIMIT)

  let search = $state('')
  let filter = $state<PlanFilter>({ ...DEFAULT_PLAN_FILTER, days: [] })
  let isMobile = $state(false)
  let filtersOpen = $state(false)
  let clearTerm = $state<TermId | null>(null)
  let exporting = $state(false)
  let exportError = $state('')
  let conflictsOpen = $state(false)
  let announcement = $state('')
  let searchInput = $state<HTMLInputElement | null>(null)
  let resultsEl = $state<HTMLDivElement | null>(null)
  let filtersAnchor = $state<HTMLDivElement | null>(null)
  let calendarEl = $state<HTMLDivElement | null>(null)
  let railMax = $state(0)
  let clearTimer: ReturnType<typeof setTimeout> | null = null
  const clearArmed = $derived(clearTerm === termId)

  $effect(() => {
    const id = termId
    untrack(() => {
      void gened.ensure(id)
      clearTerm = null
      if (clearTimer) clearTimeout(clearTimer)
      clearTimer = null
    })
  })

  onMount(() => {
    const cleanups: Array<() => void> = []
    if (typeof window.matchMedia === 'function') {
      const query = window.matchMedia('(max-width: 900px)')
      const update = () => {
        isMobile = query.matches
      }
      update()
      query.addEventListener('change', update)
      cleanups.push(() => query.removeEventListener('change', update))
    }
    const target = calendarEl
    if (target && typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (entry) railMax = Math.round(entry.contentRect.height)
      })
      observer.observe(target)
      cleanups.push(() => observer.disconnect())
    }
    return () => cleanups.forEach((cleanup) => cleanup())
  })

  onDestroy(() => {
    if (clearTimer) clearTimeout(clearTimer)
  })

  const baseOptions = $derived(buildPickerOptions(term, cohort, genedCourses, inPlanCodes, genedGroupLabel))

  const creditValues = $derived(domainCreditValues(baseOptions))

  const groups = $derived(
    selectPickerGroups(
      baseOptions,
      filter,
      search,
      courses,
      [
        ...(selectedYear ? [{ key: selectedYear.id, label: selectedYear.label }] : []),
        { key: 'gened', label: genedGroupLabel },
      ],
    ),
  )

  const displayGroups = $derived(splitGroupsByCategory(groups))

  function announce(): void {
    const list = planCourses(termId, plan.entries, context)
    const conflicts = planConflicts(list)
    const state = gened.stateFor(termId)
    const suffix =
      state?.status === 'loading'
        ? ' Loading Gen Ed courses.'
        : state?.status === 'error'
          ? ' Gen Ed courses unavailable.'
          : ''
    const saveSuffix =
      plan.saveStatus === 'memory-only' ? ' Changes are not saved to this browser.' : ''
    const creditSuffix = creditTotal > CREDIT_LIMIT
      ? ` Credits exceed the ${CREDIT_LIMIT}-credit limit: ${creditTotal} credits.`
      : ''
    announcement =
      `Plan updated: ${list.length} ${list.length === 1 ? 'course' : 'courses'}, ` +
      `${conflicts.length} ${conflicts.length === 1 ? 'conflict' : 'conflicts'}.${suffix}${saveSuffix}${creditSuffix}`
  }

  async function focusNextAdd(): Promise<void> {
    await tick()
    const first = resultsEl?.querySelector<HTMLButtonElement>('button[aria-label^="Add "]')
    if (first) {
      if (typeof first.scrollIntoView === 'function') {
        first.scrollIntoView({ block: 'nearest' })
      }
      first.focus()
      return
    }
    searchInput?.focus()
  }

  async function addOption(option: PickerOption): Promise<void> {
    plan.add(termId, option.key, 'take', option.cohort)
    announce()
    await focusNextAdd()
  }

  async function removeCourse(course: PlanCourse): Promise<void> {
    plan.remove(termId, course.sectionId)
    announce()
    await tick()
    searchInput?.focus()
  }

  function toggleTa(course: PlanCourse): void {
    plan.toggleRole(termId, course.sectionId)
    announce()
  }

  async function changeFilter(patch: Partial<PlanFilter>, focus: HTMLElement | null): Promise<void> {
    filter = { ...filter, ...patch }
    await tick()
    focus?.focus()
  }

  async function clearFilters(): Promise<void> {
    filter = { ...DEFAULT_PLAN_FILTER, sort: filter.sort }
    search = ''
    await tick()
    searchInput?.focus()
  }

  async function retryGened(): Promise<void> {
    await gened.retry(termId)
    await tick()
    if (!gened.hasError(termId)) searchInput?.focus()
  }

  async function clearPlan(): Promise<void> {
    if (clearTerm !== termId) {
      clearTerm = termId
      if (clearTimer) clearTimeout(clearTimer)
      clearTimer = setTimeout(() => {
        clearTerm = null
        clearTimer = null
      }, 5000)
      return
    }
    if (clearTimer) clearTimeout(clearTimer)
    clearTimer = null
    clearTerm = null
    plan.clear(termId)
    announce()
    await tick()
    searchInput?.focus()
  }

  async function removeUnresolved(entry: { sectionId: string }): Promise<void> {
    plan.remove(termId, entry.sectionId)
    announce()
  }

  async function downloadPng(): Promise<void> {
    if (courses.length === 0) return
    exporting = true
    exportError = ''
    try {
      await exportPlanPng(courses, term?.label ?? '', { termId })
      announcement = 'Plan PNG downloaded.'
    } catch (error) {
      exportError = `PNG export failed: ${error instanceof Error ? error.message : String(error)}`
      announcement = exportError
    } finally {
      exporting = false
    }
  }

  function closeFilters(open: boolean): void {
    if (!open) filtersAnchor?.querySelector<HTMLButtonElement>('button')?.focus()
  }
</script>

{#if !term}
  <p class="text-sm text-muted-foreground">This term is unavailable.</p>
{:else}
  <div class="flex min-h-0 flex-1 flex-col gap-3">
    <p class="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>

    <header class="flex shrink-0 flex-wrap items-end gap-x-4 gap-y-2">
      <div class="min-w-0">
        <h2 class="text-base font-semibold leading-tight">My plan · {term.label}</h2>
        <p class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{courses.length} {courses.length === 1 ? 'course' : 'courses'}</span>
          <span aria-live="polite">
            {creditTotal} / {CREDIT_LIMIT} credits
          </span>
          {#if overCredit}
            <Badge variant="destructive">Credit overflow</Badge>
          {/if}
          {#if conflictLabels.length > 0}
            <button
              type="button"
              class="rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-destructive-foreground"
              aria-expanded={conflictsOpen}
              onclick={() => (conflictsOpen = !conflictsOpen)}
            >
              {conflictLabels.length} {conflictLabels.length === 1 ? 'conflict' : 'conflicts'}
            </button>
          {:else}
            <span>0 conflicts</span>
          {/if}
        </p>
      </div>
      <div class="ml-auto flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" class="min-h-11 min-[901px]:min-h-8" disabled={courses.length === 0 || exporting} onclick={downloadPng}>{exporting ? 'Exporting…' : 'Download PNG'}</Button>
        <Button type="button" variant={clearArmed ? 'destructive' : 'outline'} size="sm" class="min-h-11 min-[901px]:min-h-8" aria-pressed={clearArmed} onclick={clearPlan}>{clearArmed ? 'Click again to clear' : 'Clear term'}</Button>
      </div>
    </header>

    {#if exportError}
      <p class="text-xs text-destructive" role="alert">{exportError}</p>
    {/if}

    {#if plan.saveStatus === 'memory-only'}
      <div class="flex flex-wrap items-center gap-2 text-xs text-destructive" role="alert">
        <span>Plan changes are not saved to this browser.</span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          class="min-h-11 min-[901px]:min-h-8"
          onclick={() => plan.retrySave()}
        >
          Retry save
        </Button>
      </div>
    {/if}

    {#if conflictsOpen && conflictLabels.length > 0}
      <ul class="shrink-0 space-y-0.5 text-xs text-destructive">
        {#each conflictLabels as label (label)}
          <li>{label}</li>
        {/each}
      </ul>
    {/if}

    <div class="grid min-h-0 flex-1 gap-4 min-[901px]:grid-cols-[minmax(0,1fr)_400px] min-[901px]:items-stretch">
      <div class="flex min-h-0 min-w-0 flex-col">
        <Legend />
        <div class="min-h-0 flex-1" bind:this={calendarEl}>
          <WeekGrid
            {courses}
            {range}
            {conflictKeys}
            {taKeys}
            fill
          />
        </div>
      </div>

      <aside
        class="min-w-0 space-y-2 min-[901px]:sticky min-[901px]:top-4 min-[901px]:overflow-y-auto min-[901px]:rounded-xl min-[901px]:border min-[901px]:bg-card min-[901px]:p-3"
        style={!isMobile && railMax > 0 ? `max-height: ${railMax}px` : undefined}
        aria-label="Plan courses"
      >
        <section aria-label="In this plan">
          <h3 class="text-eyebrow font-semibold uppercase tracking-eyebrow text-muted-foreground">
            In this plan
          </h3>
          {#if courses.length === 0}
            <p class="mt-1 text-sm text-muted-foreground">No courses yet. Add one from the list.</p>
          {:else}
            <ul class="mt-1">
              {#each courses as course (course.sectionId)}
                <li class="flex items-center gap-2 border-t py-1.5" data-plan-entry={course.sectionId}>
                  <span class="min-w-0 flex-1 truncate text-xs font-semibold">
                    {course.name}
                    <span class="font-normal text-muted-foreground">
                      · {course.code}{#if course.section} · Sec {course.section}{/if}
                    </span>
                  </span>
                  {#if course.hasLab}
                    <Button
                      type="button"
                      size="sm"
                      variant={course.planRole === 'TA' ? 'default' : 'outline'}
                      class="min-h-11 shrink-0 min-[901px]:min-h-7"
                      aria-pressed={course.planRole === 'TA'}
                      aria-label={`Assist the lab (TA) for ${course.name}`}
                      onclick={() => toggleTa(course)}
                    >
                      TA
                    </Button>
                  {/if}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    class="size-11 shrink-0 min-[901px]:size-8"
                    aria-label={`Remove ${course.name} from plan`}
                    onclick={() => removeCourse(course)}
                  >
                    <X class="size-4" aria-hidden="true" />
                  </Button>
                </li>
              {/each}
            </ul>
          {/if}
          {#if unresolvedEntries.length > 0}
            <p class="mt-2 text-xs text-muted-foreground">
              {unresolved} saved {unresolved === 1 ? 'course is' : 'courses are'} not offered in this
              Gen Ed list.
            </p>
            <ul class="mt-1">
              {#each unresolvedEntries as entry (entry.sectionId)}
                {@const parsed = parseSectionId(entry.sectionId)}
                <li class="flex items-center gap-2 border-t py-1.5 text-xs text-muted-foreground">
                  <span class="min-w-0 flex-1 truncate">
                    {parsed?.code ?? entry.sectionId}{parsed?.number ? ` · Sec ${parsed.number}` : ''}
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    class="size-11 shrink-0 min-[901px]:size-8"
                    aria-label={`Remove ${parsed?.code ?? entry.sectionId} from plan`}
                    onclick={() => removeUnresolved(entry)}
                  >
                    <X class="size-4" aria-hidden="true" />
                  </Button>
                </li>
              {/each}
            </ul>
          {/if}
        </section>

        <section aria-label="Add a course" class="border-t pt-2">
          <h3 class="text-eyebrow font-semibold uppercase tracking-eyebrow text-muted-foreground">
            Add a course
          </h3>
          {#if genedState?.status !== 'ready' || genedState?.refreshing || gened.hasError(termId)}
            <p class="mt-1 text-xs text-muted-foreground" aria-live="polite">
              {gened.statusText(termId)}
            </p>
          {/if}
          {#if gened.hasError(termId)}
            <Button
              type="button"
              size="sm"
              variant="outline"
              class="mt-1 min-h-11 min-[901px]:min-h-8"
              onclick={retryGened}
            >
              Retry
            </Button>
          {/if}

          <div class="mt-2 flex gap-2">
            <Input
              type="search"
              bind:value={search}
              bind:ref={searchInput}
              placeholder="Search course, code, lecturer, section"
              aria-label={`Search ${term.label} plan courses to add`}
              class="min-w-0 flex-1"
            />
            <div class="shrink-0" bind:this={filtersAnchor}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                class="min-h-11 whitespace-nowrap min-[901px]:min-h-10"
                aria-haspopup="dialog"
                onclick={() => (filtersOpen = true)}
              >
                Filters{filterActive(filter) ? ' · active' : ''}
              </Button>
            </div>
          </div>

          <Dialog.Root bind:open={filtersOpen} onOpenChangeComplete={closeFilters}>
            <Dialog.Portal>
              <Dialog.Overlay class="fixed inset-0 z-40 bg-foreground/40" />
              <Dialog.Content
                class="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-2xl border bg-card p-4 text-card-foreground shadow-popover min-[901px]:inset-x-auto min-[901px]:bottom-auto min-[901px]:left-1/2 min-[901px]:top-1/2 min-[901px]:w-[26rem] min-[901px]:-translate-x-1/2 min-[901px]:-translate-y-1/2 min-[901px]:rounded-2xl"
              >
                <div class="flex items-center justify-between gap-3">
                  <Dialog.Title class="text-sm font-semibold">Filters</Dialog.Title>
                  <Dialog.Close
                    class="min-h-11 rounded-md border border-control-border bg-card px-3 text-xs font-medium text-foreground"
                  >
                    Done
                  </Dialog.Close>
                </div>
                <Dialog.Description class="mt-1 text-xs text-muted-foreground">
                  Narrow the course list by year, day, credits, conflicts, or sort order.
                </Dialog.Description>
                <div class="mt-3">
                  <PlanFilterControls
                    {filter}
                    {creditValues}
                    {cohort}
                    onchange={changeFilter}
                    onclear={clearFilters}
                    onCohortChange={(next) => onCohortChange?.(next)}
                  />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          {#if groups.length === 0}
            <p class="mt-3 text-sm text-muted-foreground">No courses match the filters.</p>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              class="mt-1 min-h-11 min-[901px]:min-h-8"
              onclick={clearFilters}
            >
              Clear search and filters
            </Button>
          {:else}
            <div bind:this={resultsEl}>
              <PlanPickerResults groups={displayGroups} onadd={addOption} />
            </div>
          {/if}
        </section>
      </aside>
    </div>
  </div>
{/if}
