import { describe, expect, it } from 'vitest'
import { PLAN_KEY, PLAN_KEY_V2 } from '../domain/plan'
import { sectionId } from '../domain/section'
import { makeCourse, memoryStorage } from '../domain/test-utils'
import type { Cohort, PlanEntry, Term } from '../domain/types'
import { createPlanState } from './plan.svelte'

function fixtureTerm(): Term {
  const course = makeCourse({ code: 'A101', name: 'Alpha' })
  const year: Cohort = {
    id: 'y1',
    label: '1st Year',
    courses: [course],
    notes: [],
  }
  return { id: 't1', label: '1/2569', years: [year] }
}

describe('PlanState', () => {
  it('adds, dedupes, removes, and persists each mutation', () => {
    const storage = memoryStorage()
    const state = createPlanState({ storage, context: () => ({ terms: [] }) })

    state.add('t1', 't1/A101/901', 'take', 'y1')
    const expected: PlanEntry = {
      term: 't1',
      sectionId: 't1/A101/901',
      role: 'take',
      cohort: 'y1',
    }
    expect(state.entries).toEqual([expected])
    expect(JSON.parse(storage.getItem(PLAN_KEY_V2) ?? 'null')).toEqual({
      v: 2,
      entries: [expected],
    })

    state.add('t1', 't1/A101/901')
    expect(state.entries).toHaveLength(1)

    state.remove('t1', 't1/A101/901')
    expect(state.entries).toEqual([])
    expect(JSON.parse(storage.getItem(PLAN_KEY_V2) ?? 'null')).toEqual({
      v: 2,
      entries: [],
    })
  })

  it('toggles the role and scopes entries per term', () => {
    const storage = memoryStorage()
    const state = createPlanState({ storage, context: () => ({ terms: [] }) })
    state.add('t1', 't1/A101/901')
    state.add('t2', 't2/B102/901')

    state.toggleRole('t1', 't1/A101/901')
    expect(state.entriesFor('t1')).toEqual([
      { term: 't1', sectionId: 't1/A101/901', role: 'ta' },
    ])
    expect(state.entriesFor('t2')).toHaveLength(1)

    state.clear('t1')
    expect(state.entriesFor('t1')).toEqual([])
    expect(state.entriesFor('t2')).toHaveLength(1)
  })

  it('migrates a legacy v1 plan and writes the v2 envelope', () => {
    const storage = memoryStorage({
      [PLAN_KEY]: JSON.stringify([{ term: 't1', key: 'A101#901', role: 'take' }]),
    })
    const state = createPlanState({ storage, context: () => ({ terms: [] }) })

    expect(state.entries).toEqual([
      { term: 't1', sectionId: 't1/A101/901', role: 'take' },
    ])
    expect(JSON.parse(storage.getItem(PLAN_KEY_V2) ?? 'null')).toEqual({
      v: 2,
      entries: [{ term: 't1', sectionId: 't1/A101/901', role: 'take' }],
    })
  })

  it('counts saved entries that no longer resolve', () => {
    const terms = [fixtureTerm()]
    const state = createPlanState({
      storage: memoryStorage(),
      context: () => ({
        terms,
        gened: { t1: { status: 'ready', courses: [] } },
      }),
      initialEntries: [
        { term: 't1', sectionId: sectionId('t1', 'A101', '901'), role: 'take' },
        { term: 't1', sectionId: sectionId('t1', 'NOPE', '901'), role: 'take' },
      ],
    })

    expect(state.unresolved('t1', {
      terms,
      gened: { t1: { status: 'ready', courses: [] } },
    })).toBe(1)
    expect(state.courses('t1', {
      terms,
      gened: { t1: { status: 'ready', courses: [] } },
    })).toHaveLength(1)
  })
})

describe('save status', () => {
  it('reports memory-only when writes fail and clears on retry', () => {
    let fail = true
    const data = new Map<string, string>()
    const storage = {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => {
        if (fail) throw new Error('quota')
        data.set(key, value)
      },
      removeItem: (key: string) => {
        data.delete(key)
      },
    }
    const state = createPlanState({ storage, context: () => ({ terms: [] }) })
    expect(state.saveStatus).toBe('memory-only')

    state.add('t1', 't1/A101/901')
    expect(state.entries).toHaveLength(1)
    expect(state.saveStatus).toBe('memory-only')

    fail = false
    state.retrySave()
    expect(state.saveStatus).toBe('saved')
    expect(JSON.parse(data.get('cei-plan-v2') ?? 'null')).toEqual({
      v: 2,
      entries: [{ term: 't1', sectionId: 't1/A101/901', role: 'take' }],
    })
  })
})
