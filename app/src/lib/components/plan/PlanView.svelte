<script lang="ts">
  import { onDestroy, onMount, tick, untrack } from 'svelte'
  import { Dialog } from 'bits-ui'
  import { Plus, TriangleAlert, X } from 'lucide-svelte'
  import { courseWarnings, planConflictDetails, planConflicts } from '../../../domain/conflicts'
  import { exportPlanPng } from '../../../domain/exportPng'
  import {
    DEFAULT_PLAN_FILTER,
    creditValues as domainCreditValues,
    filterPlanOptions,
    groupPlanOptions,
    planTimeRange,
    sortPlanOptions,
  } from '../../../domain/filters'
  import type { PlanFilter, PlanOption, SubjectGroup } from '../../../domain/filters'
  import { planCourses } from '../../../domain/plan'
  import type { PlanContext } from '../../../domain/plan'
  import { sectionId } from '../../../domain/section'
  import type { CohortId, Course, PlanCourse, Term, TermId } from '../../../domain/types'
  import { COHORT_TABS } from '../../../state/route.svelte'
import type { GenedStateStore } from '../../../state/gened.svelte'
  import type { PlanState } from '../../../state/plan.svelte'
  import { cn } from '$lib/utils'
  import Badge from '$lib/components/ui/badge/badge.svelte'
  import Button from '../ui/button/button.svelte'
  import WeekGrid from '../week/WeekGrid.svelte'
  import PlanFilterControls from './PlanFilterControls.svelte'

  interface Props {
    terms: Term[]
    termId: TermId
    cohort: CohortId
    plan: PlanState
    gened: GenedStateStore
    onCohortChange?: (cohort: CohortId) => void
  }

  interface PickerOption extends PlanOption<Course> {
    sectionNumber: string
    cohort?: CohortId
  }

  interface PickerSection extends PickerOption {
    warnings: string[]
  }

  interface PickerSubject extends SubjectGroup<PickerOption> {
    items: PickerSection[]
  }

  interface PickerGroup {
    key: string
    label: string
    subjects: PickerSubject[]
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
  const genedState = $derived(gened.stateFor(termId))
  const genedCourses = $derived(gened.coursesFor(termId))
  const genedGroupLabel = $derived(
    genedState?.status === 'ready'
      ? `Gen Ed (${new Set(genedCourses.map((course) => course.code)).size})`
      : 'Gen Ed',
  )
  const inPlanCodes = $derived(new Set(courses.map((course) => course.code)))

  let search = $state('')
  let filter = $state<PlanFilter>({ ...DEFAULT_PLAN_FILTER, days: [] })
  let isMobile = $state(false)
  let mobileFiltersOpen = $state(false)
  let clearArmed = $state(false)
  let exporting = $state(false)
  let announcement = $state('')
  let searchInput = $state<HTMLInputElement | null>(null)
  let filtersAnchor = $state<HTMLDivElement | null>(null)
  let calendarEl = $state<HTMLDivElement | null>(null)
  let railMax = $state(0)
  let clearTimer: ReturnType<typeof setTimeout> | null = null

  $effect(() => {
    const id = termId
    untrack(() => {
      void gened.ensure(id)
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

  function optionSearch(option: PickerOption): string {
    return [
      option.course.name,
      option.course.code,
      option.sectionNumber,
      ...option.course.lecturers,
    ]
      .join(' ')
      .toLowerCase()
  }

  const baseOptions = $derived.by<PickerOption[]>(() => {
    if (!term) return []
    const out: PickerOption[] = []
    if (selectedYear) {
      for (const course of selectedYear.courses) {
        if (inPlanCodes.has(course.code)) continue
        const number = course.section ?? course.sections[0]?.number ?? ''
        out.push({
          course,
          key: sectionId(termId, course.code, number),
          badge: selectedYear.label,
          group: selectedYear.id,
          groupLabel: selectedYear.label,
          sectionNumber: number,
          cohort: selectedYear.id,
        })
      }
    }
    for (const course of genedCourses) {
      if (inPlanCodes.has(course.code)) continue
      const number = course.section || course.sections[0]?.number || ''
      out.push({
        course,
        key: sectionId(termId, course.code, number),
        badge: 'Gen Ed',
        group: 'gened',
        groupLabel: genedGroupLabel,
        sectionNumber: number,
      })
    }
    return out
  })

  const creditValues = $derived(domainCreditValues(baseOptions))

  const filteredOptions = $derived.by(() => {
    const matched = filterPlanOptions(baseOptions, filter, courses)
    const needle = search.trim().toLowerCase()
    if (!needle) return matched
    return matched.filter((option) => optionSearch(option).includes(needle))
  })

  const groups = $derived.by<PickerGroup[]>(() => {
    const order = [
      ...(selectedYear ? [{ key: selectedYear.id, label: selectedYear.label }] : []),
      { key: 'gened', label: genedGroupLabel },
    ]
    return order
      .map((group) => {
        const options = filteredOptions.filter((option) => option.group === group.key)
        const subjects = groupPlanOptions(options)
        const byKey = new Map(subjects.map((subject) => [subject.options[0]?.key ?? '', subject]))
        const cards = sortPlanOptions(
          subjects.map((subject) => subject.options[0]!).filter(Boolean),
          filter.sort,
        )
          .map((option) => byKey.get(option.key))
          .filter((subject): subject is SubjectGroup<PickerOption> => Boolean(subject))
          .map((subject) => ({
            ...subject,
            items: subject.options.map((option) => ({
              ...option,
              warnings: courseWarnings(option.course, courses),
            })),
          }))
        return { ...group, subjects: cards }
      })
      .filter((group) => group.subjects.length > 0)
  })

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
    announcement =
      `Plan updated: ${list.length} ${list.length === 1 ? 'course' : 'courses'}, ` +
      `${conflicts.length} ${conflicts.length === 1 ? 'conflict' : 'conflicts'}.${suffix}`
  }

  async function addOption(option: PickerOption): Promise<void> {
    plan.add(termId, option.key, 'take', option.cohort)
    announce()
    await tick()
    searchInput?.focus()
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
    if (!clearArmed) {
      clearArmed = true
      if (clearTimer) clearTimeout(clearTimer)
      clearTimer = setTimeout(() => {
        clearArmed = false
        clearTimer = null
      }, 5000)
      return
    }
    if (clearTimer) clearTimeout(clearTimer)
    clearTimer = null
    clearArmed = false
    plan.clear(termId)
    announce()
    await tick()
    searchInput?.focus()
  }

  async function downloadPng(): Promise<void> {
    if (courses.length === 0) return
    exporting = true
    try {
      await exportPlanPng(courses, term?.label ?? '', { termId })
    } catch (error) {
      announcement = `PNG export failed: ${error instanceof Error ? error.message : String(error)}`
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
          {#if conflictLabels.length > 0}
            <span
              class="rounded-full bg-destructive px-2 py-0.5 text-[0.65rem] font-semibold text-destructive-foreground"
              title={conflictLabels.join(' · ')}
            >
              {conflictLabels.length} {conflictLabels.length === 1 ? 'conflict' : 'conflicts'}
            </span>
            <span class="sr-only">{conflictLabels.join('. ')}</span>
          {:else}
            <span>0 conflicts</span>
          {/if}
        </p>
      </div>
      <div class="ml-auto flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" class="min-h-11 min-[901px]:min-h-8" disabled={courses.length === 0 || exporting} onclick={downloadPng}>Download PNG</Button>
        <Button type="button" variant={clearArmed ? 'destructive' : 'outline'} size="sm" class="min-h-11 min-[901px]:min-h-8" aria-pressed={clearArmed} onclick={clearPlan}>{clearArmed ? 'Click again to clear' : 'Clear term'}</Button>
      </div>
    </header>

    <div class="grid min-h-0 flex-1 gap-4 min-[901px]:grid-cols-[minmax(0,1fr)_360px] min-[901px]:items-stretch">
      <div class="min-h-0 min-w-0" bind:this={calendarEl}>
        <WeekGrid
          {courses}
          range={range}
          conflictKeys={conflictKeys}
          taKeys={taKeys}
          fill
        />
      </div>

      <aside
        class="min-w-0 space-y-4 min-[901px]:sticky min-[901px]:top-4 min-[901px]:overflow-y-auto min-[901px]:rounded-xl min-[901px]:border min-[901px]:bg-card min-[901px]:p-3"
        style={!isMobile && railMax > 0 ? `max-height: ${railMax}px` : undefined}
        aria-label="Plan courses"
      >
        <div class="flex items-center justify-between gap-2">
          <label for="plan-year" class="text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Year</label>
          <select
            id="plan-year"
            class="min-h-11 rounded-lg border bg-background px-2 text-sm text-foreground min-[901px]:min-h-8"
            value={cohort}
            onchange={(event) => onCohortChange?.(event.currentTarget.value as CohortId)}
          >
            {#each COHORT_TABS as tab (tab.id)}
              <option value={tab.id}>{tab.label}</option>
            {/each}
          </select>
        </div>

        <section aria-label="In this plan">
          <h3 class="text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            In this plan
          </h3>
          {#if courses.length === 0}
            <p class="mt-1 text-sm text-muted-foreground">No courses yet. Add one from the list.</p>
          {:else}
            <ul class="mt-1">
              {#each courses as course (course.sectionId)}
                <li class="flex items-center gap-2 border-t py-2" data-plan-entry={course.sectionId}>
                  <span
                    class="shrink-0 rounded border px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
                  >
                    {course.planYear}
                  </span>
                  <span class="min-w-0 flex-1 truncate text-sm font-semibold">
                    {course.name}
                    <span class="text-xs font-normal text-muted-foreground">
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
          {#if unresolved > 0}
            <p class="mt-2 text-xs text-muted-foreground">
              {unresolved} saved {unresolved === 1 ? 'course is' : 'courses are'} not offered in this
              Gen Ed list.
            </p>
          {/if}
        </section>

        <section aria-label="Add a course" class="border-t pt-3">
          <h3 class="text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            Add a course
          </h3>
          <p class="mt-1 text-xs text-muted-foreground" aria-live="polite">
            {gened.statusText(termId)}
          </p>
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

          <input
            type="search"
            bind:value={search}
            bind:this={searchInput}
            placeholder="Search course, code, lecturer, section"
            aria-label={`Search ${term.label} plan courses to add`}
            class="mt-2 min-h-11 w-full rounded-lg border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground min-[901px]:min-h-9"
          />

          {#if isMobile}
            <div class="mt-2" bind:this={filtersAnchor}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                class="min-h-11 w-full"
                onclick={() => (mobileFiltersOpen = true)}
              >
                Filters
              </Button>
            </div>

            <Dialog.Root bind:open={mobileFiltersOpen} onOpenChangeComplete={closeFilters}>
              <Dialog.Portal>
                <Dialog.Overlay class="fixed inset-0 z-40 bg-foreground/40" />
                <Dialog.Content
                  class="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-2xl border bg-card p-4 text-card-foreground shadow-popover"
                >
                  <div class="flex items-center justify-between gap-3">
                    <Dialog.Title class="text-sm font-semibold">Filters</Dialog.Title>
                    <Dialog.Close
                      class="min-h-11 rounded-md border bg-card px-3 text-xs font-medium text-foreground"
                    >
                      Done
                    </Dialog.Close>
                  </div>
                  <Dialog.Description class="mt-1 text-xs text-muted-foreground">
                    Narrow the course list by day, credits, conflicts, or sort order.
                  </Dialog.Description>
                  <div class="mt-3">
                    <PlanFilterControls
                      {filter}
                      {creditValues}
                      onchange={changeFilter}
                      onclear={clearFilters}
                    />
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          {:else}
            <div class="mt-2">
              <PlanFilterControls
                {filter}
                {creditValues}
                onchange={changeFilter}
                onclear={clearFilters}
              />
            </div>
          {/if}

          {#if filteredOptions.length === 0}
            <p class="mt-3 text-sm text-muted-foreground">No courses match the filters.</p>
          {:else}
            {#each groups as group (group.key)}
              <h4
                class="mt-3 text-[0.66rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
              >
                {group.label}
              </h4>
              <ul class="mt-1">
                {#each group.subjects as subject (subject.code)}
                  <li class="border-t py-3">
                    <div class="flex min-w-0 items-center gap-2">
                      <Badge variant="secondary" class="shrink-0 text-[0.6rem]">
                        {subject.items[0]?.badge}
                      </Badge>
                      <span class="truncate text-sm font-semibold">{subject.name}</span>
                      <span class="ml-auto shrink-0 text-xs text-muted-foreground">
                        {subject.code}{subject.items[0]?.course.credits
                          ? ` · ${subject.items[0].course.credits}`
                          : ''}
                      </span>
                    </div>
                    <div class="mt-2 space-y-1">
                      {#each subject.items as option (option.key)}
                        <div
                          class={cn(
                            'relative rounded-lg border-l-[3px] bg-muted/40 p-2 pr-12',
                            option.warnings.length > 0
                              ? 'border-l-destructive'
                              : 'border-l-transparent',
                          )}
                          data-plan-option={option.key}
                        >
                          <div class="flex min-w-0 items-center gap-2">
                            <Badge variant="outline" class="shrink-0 text-[0.6rem]">
                              S{option.sectionNumber}
                            </Badge>
                            <span class="truncate text-xs text-muted-foreground">
                              {option.course.sessions
                                .map(
                                  (session) =>
                                    `${session.day} ${session.start}–${session.end}${session.room ? ` · ${session.room}` : ''}`,
                                )
                                .join(' / ')}
                            </span>
                          </div>
                          {#if option.course.lecturers.length > 0}
                            <p class="mt-0.5 truncate text-xs text-muted-foreground">
                              {option.course.lecturers.join(' · ')}
                            </p>
                          {/if}
                          <div class="min-h-4">
                            {#if option.warnings.length > 0}
                              <p
                                class="flex min-w-0 items-center gap-1 text-xs text-destructive"
                                title={option.warnings.join(' · ')}
                              >
                                <TriangleAlert class="size-3 shrink-0" aria-hidden="true" />
                                <span class="truncate">
                                  {option.warnings[0]}{option.warnings.length > 1
                                    ? ` (+${option.warnings.length - 1} more)`
                                    : ''}
                                </span>
                              </p>
                            {/if}
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            class="absolute right-1 top-1/2 size-9 -translate-y-1/2"
                            aria-label={`Add ${subject.name} section ${option.sectionNumber} to plan${option.warnings.length > 0 ? ', conflicts with the current plan' : ''}`}
                            onclick={() => addOption(option)}
                          >
                            <Plus class="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                      {/each}
                    </div>
                  </li>
                {/each}
              </ul>
            {/each}
          {/if}
        </section>
      </aside>
    </div>
  </div>
{/if}
