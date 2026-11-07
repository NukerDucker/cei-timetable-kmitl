import { fireEvent, render, screen, waitFor, within } from '@testing-library/svelte'
import { tick } from 'svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { FetchJsonFn } from '../../../domain/api'
import { PLAN_KEY_V2 } from '../../../domain/plan'
import { sectionId } from '../../../domain/section'
import { makeCourse, makeGenEdCourse, makeSession, memoryStorage } from '../../../domain/test-utils'
import type { Cohort, Course, GenEdCourse, PlanEntry, Term } from '../../../domain/types'
import { createGenedState } from '../../../state/gened.svelte'
import { createPlanState } from '../../../state/plan.svelte'
import PlanView from './PlanView.svelte'

function labSessions() {
  return [
    makeSession({ day: 'Wed', start: '09:00', end: '10:00', section: '901' }),
    makeSession({ day: 'Thu', start: '10:00', end: '12:00', section: '901', type: 'lab' }),
  ]
}

function courses(): Course[] {
  const sessions = labSessions()
  return [
    makeCourse({
      code: 'A101',
      name: 'Zulu Circuits',
      credits: '3(3-0-6)',
      lecturers: ['Ada Lovelace'],
      sessions: [makeSession({ day: 'Mon', start: '09:00', end: '11:00' })],
    }),
    makeCourse({
      code: 'B102',
      name: 'Alpha Systems',
      credits: '4(3-2-7)',
      lecturers: ['Grace Hopper'],
      sessions: [makeSession({ day: 'Tue', start: '13:00', end: '15:00' })],
    }),
    makeCourse({
      code: 'C104',
      name: 'Clash Course',
      sessions: [makeSession({ day: 'Mon', start: '10:00', end: '12:00' })],
    }),
    makeCourse({
      code: 'L103',
      name: 'Lab Systems',
      credits: '4(3-2-7)',
      sessions,
      sections: [{ id: sectionId('t1', 'L103', '901'), number: '901', sessions }],
      section: '901',
      exams: { mid: '2026-08-17', time: '09:30–12:30' },
    }),
    makeCourse({
      code: 'O105',
      name: 'Exam Course',
      sessions: [makeSession({ day: 'Fri', start: '09:00', end: '10:00' })],
      exams: { mid: '2026-08-17', time: '09:30–12:30' },
    }),
  ]
}

function fixtureTerm(): Term {
  const firstYear: Cohort = {
    id: 'y1',
    label: '1st Year',
    courses: courses(),
    notes: [],
  }
  const secondYear: Cohort = {
    id: 'y2',
    label: '2nd Year',
    courses: [
      makeCourse({
        code: 'G201',
        name: 'Gamma Networks',
        sessions: [makeSession({ day: 'Mon', start: '15:00', end: '17:00' })],
      }),
    ],
    notes: [],
  }
  return { id: 't1', label: '1/2569', years: [firstYear, secondYear] }
}

function genedCourse(): GenEdCourse {
  return makeGenEdCourse('96641007', '905', {
    name: 'GenEd Ethics',
    sessions: [makeSession({ day: 'Fri', start: '13:00', end: '14:00', section: '905' })],
  })
}

interface SetupOptions {
  initialEntries?: PlanEntry[]
  genedCourses?: GenEdCourse[]
}

function setup(options: SetupOptions = {}) {
  const terms = [fixtureTerm()]
  const fetchJson = vi.fn() as unknown as FetchJsonFn
  const gened = createGenedState({
    storage: memoryStorage(),
    now: () => 1,
    fetchJson,
    initial: {
      t1: {
        status: 'ready',
        courses: options.genedCourses ?? [genedCourse()],
        savedAt: 1,
      },
    },
  })
  const storage = memoryStorage()
  const plan = createPlanState({
    storage,
    context: () => ({ terms, gened: gened.states }),
    initialEntries: options.initialEntries,
  })
  const result = render(PlanView, {
    props: { terms, termId: 't1', cohort: 'y1', plan, gened },
  })
  return { ...result, plan, gened, storage, fetchJson }
}

function entriesRegion(): HTMLElement {
  return screen.getByRole('region', { name: 'In this plan' })
}

function optionKeys(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('[data-plan-option]')).flatMap((element) => {
    const key = element.getAttribute('data-plan-option')
    return key ? [key] : []
  })
}

function firstYearKeys(container: HTMLElement): string[] {
  return optionKeys(container).filter((key) => !key.includes('96641007'))
}

function rowFor(container: HTMLElement, key: string): HTMLElement {
  const row = container.querySelector(`[data-plan-option="${key}"]`)
  if (!(row instanceof HTMLElement)) throw new Error(`Missing picker row ${key}`)
  return row
}

async function addOption(container: HTMLElement, key: string): Promise<void> {
  await fireEvent.click(within(rowFor(container, key)).getByRole('button', { name: /^Add / }))
}

describe('PlanView', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('scopes the picker to the selected cohort plus Gen Ed', () => {
    const { container, fetchJson } = setup()

    const keys = optionKeys(container)
    expect(keys).toContain('t1/A101/901')
    expect(keys).toContain('t1/96641007/905')
    expect(keys).not.toContain('t1/G201/901')
    expect(screen.getByText('Gen Ed (1)')).toBeInTheDocument()
    expect(screen.queryByLabelText('Cohort')).toBeNull()
    // Fresh cache: opening the Plan must not fetch again.
    expect(fetchJson).not.toHaveBeenCalled()
  })

  it('adds an option, persists it, announces, and removes it', async () => {
    const { container, plan, storage } = setup()

    await addOption(container, 't1/A101/901')
    expect(plan.entries).toEqual([
      { term: 't1', sectionId: 't1/A101/901', role: 'take', cohort: 'y1' },
    ])
    expect(entriesRegion()).toHaveTextContent('Zulu Circuits')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Plan updated: 1 course, 0 conflicts.',
    )
    const written = JSON.parse(storage.getItem(PLAN_KEY_V2) ?? 'null') as {
      v: number
      entries: PlanEntry[]
    }
    expect(written.entries).toEqual(plan.entries)

    await tick()
    expect(screen.getByRole('searchbox')).toHaveFocus()

    const entry = container.querySelector('[data-plan-entry="t1/A101/901"]')
    if (!(entry instanceof HTMLElement)) throw new Error('Missing plan entry')
    await fireEvent.click(within(entry).getByRole('button', { name: /Remove Zulu Circuits/ }))

    expect(plan.entries).toEqual([])
    expect(entriesRegion()).toHaveTextContent('No courses yet')
    expect(
      (JSON.parse(storage.getItem(PLAN_KEY_V2) ?? 'null') as { entries: PlanEntry[] }).entries,
    ).toEqual([])
  })

  it('shows TA only for labs, renders lab-only sessions, and skips TA exam conflicts', async () => {
    const { container, plan } = setup()

    await addOption(container, 't1/L103/901')
    await addOption(container, 't1/O105/901')
    expect(screen.getByRole('heading', { name: 'Conflicts (1)' })).toBeInTheDocument()

    const entry = container.querySelector('[data-plan-entry="t1/L103/901"]')
    if (!(entry instanceof HTMLElement)) throw new Error('Missing lab entry')
    const ta = within(entry).getByRole('button', { name: /Assist the lab \(TA\)/ })
    await fireEvent.click(ta)

    expect(plan.entries.find((item) => item.sectionId === 't1/L103/901')?.role).toBe('ta')
    expect(ta).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: 'Conflicts (0)' })).toBeInTheDocument()

    const blocks = Array.from(container.querySelectorAll('.block'))
    const labBlock = blocks.find((block) => block.textContent?.includes('Lab Systems'))
    expect(labBlock).toHaveClass('is-ta')
    expect(labBlock).toHaveTextContent('10:00–12:00')
    expect(labBlock).not.toHaveTextContent('09:00–10:00')
    expect(labBlock).toHaveTextContent('TA')

    await addOption(container, 't1/B102/901')
    const noLabEntry = container.querySelector('[data-plan-entry="t1/B102/901"]')
    if (!(noLabEntry instanceof HTMLElement)) throw new Error('Missing non-lab entry')
    expect(within(noLabEntry).queryByRole('button', { name: /Assist the lab/ })).toBeNull()
  })

  it('warns on picker rows and marks conflicting grid blocks', async () => {
    const { container } = setup()

    await addOption(container, 't1/A101/901')
    const clashing = rowFor(container, 't1/C104/901')
    expect(clashing).toHaveTextContent('Mon 10:00–12:00 with Zulu Circuits')
    expect(clashing.querySelector('svg')).not.toBeNull()
    expect(clashing.className).toContain('border-l-destructive')

    await fireEvent.click(within(clashing).getByRole('button', { name: /^Add / }))

    expect(screen.getByRole('heading', { name: 'Conflicts (1)' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Plan conflicts' })).toHaveTextContent(
      'Zulu Circuits ↔ Clash Course · Mon 09:00–11:00',
    )
    expect(container.querySelectorAll('.block.is-conflict')).toHaveLength(2)
    expect(screen.getAllByText('Conflict')).toHaveLength(2)
  })

  it('applies search, day, credits, hide-conflicting, and per-group sorting', async () => {
    const { container } = setup()
    const search = screen.getByRole('searchbox')

    expect(firstYearKeys(container)).toEqual([
      't1/B102/901',
      't1/C104/901',
      't1/O105/901',
      't1/L103/901',
      't1/A101/901',
    ])

    await fireEvent.change(screen.getByLabelText('Sort plan courses'), {
      target: { value: 'code' },
    })
    expect(firstYearKeys(container)).toEqual([
      't1/A101/901',
      't1/B102/901',
      't1/C104/901',
      't1/L103/901',
      't1/O105/901',
    ])

    await fireEvent.input(search, { target: { value: 'grace' } })
    expect(firstYearKeys(container)).toEqual(['t1/B102/901'])

    await fireEvent.input(search, { target: { value: '905' } })
    expect(optionKeys(container)).toContain('t1/96641007/905')

    await fireEvent.input(search, { target: { value: '' } })
    const tuesday = screen.getByRole('button', { name: 'Tue' })
    await fireEvent.click(tuesday)
    expect(tuesday).toHaveAttribute('aria-pressed', 'true')
    expect(firstYearKeys(container)).toEqual(['t1/B102/901'])

    await fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(firstYearKeys(container)).toHaveLength(5)

    await fireEvent.change(screen.getByLabelText('Credits'), { target: { value: '4' } })
    expect(firstYearKeys(container)).toEqual(['t1/B102/901', 't1/L103/901'])
  })

  it('hides conflicting candidates', async () => {
    const { container } = setup()
    await addOption(container, 't1/A101/901')

    expect(rowFor(container, 't1/C104/901')).toBeInTheDocument()
    await fireEvent.click(screen.getByLabelText('Hide conflicting'))

    expect(container.querySelector('[data-plan-option="t1/C104/901"]')).toBeNull()
    expect(rowFor(container, 't1/B102/901')).toBeInTheDocument()
  })

  it('notes saved entries that no longer resolve', () => {
    const { container } = setup({
      initialEntries: [{ term: 't1', sectionId: 't1/NOPE/901', role: 'take' }],
    })

    expect(entriesRegion()).toHaveTextContent(
      '1 saved course is not offered in this Gen Ed list.',
    )
    expect(container.querySelector('[data-plan-option="t1/A101/901"]')).not.toBeNull()
  })

  it('disables PNG export until the plan has a course', async () => {
    const { container } = setup()
    const button = screen.getByRole('button', { name: 'Download PNG' })
    expect(button).toBeDisabled()

    await addOption(container, 't1/A101/901')
    expect(screen.getByRole('button', { name: 'Download PNG' })).toBeEnabled()
  })

  it('arms Clear before clearing the term', async () => {
    const { container, plan } = setup()
    await addOption(container, 't1/A101/901')

    await fireEvent.click(screen.getByRole('button', { name: 'Clear term' }))
    expect(screen.getByRole('button', { name: 'Click again to clear' })).toBeInTheDocument()
    expect(plan.entries).toHaveLength(1)

    await fireEvent.click(screen.getByRole('button', { name: 'Click again to clear' }))
    expect(plan.entries).toEqual([])
    expect(entriesRegion()).toHaveTextContent('No courses yet')
  })

  it('keeps search visible and moves filters into a mobile sheet', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: true,
        media: '(max-width: 900px)',
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    )
    setup()

    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    const filtersButton = screen.getByRole('button', { name: 'Filters' })
    await fireEvent.click(filtersButton)

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByLabelText('Sort plan courses')).toBeInTheDocument()
    expect(within(dialog).getByLabelText('Credits')).toBeInTheDocument()
    expect(within(dialog).getByRole('group', { name: 'Filter by day' })).toBeInTheDocument()

    await fireEvent.click(within(dialog).getByRole('button', { name: 'Done' }))
    await tick()
    await waitFor(() => expect(filtersButton).toHaveFocus())
  })
})
