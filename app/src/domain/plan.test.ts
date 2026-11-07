import { describe, expect, it } from 'vitest'
import { curatedTerms } from './api'
import {
  PLAN_KEY,
  PLAN_KEY_V2,
  clearPlanTerm,
  planCourses,
  readPlan,
  resolveLegacyKey,
  togglePlanEntry,
  togglePlanRole,
  unresolvedCount,
  writePlan,
} from './plan'
import type { PlanContext } from './plan'
import { makeGenEdCourse, memoryStorage } from './test-utils'

const terms = curatedTerms()

function context(genedReady = true): PlanContext {
  return {
    terms,
    ...(genedReady
      ? {
          gened: {
            t1: {
              status: 'ready' as const,
              courses: [makeGenEdCourse('96649999', '901')],
            },
          },
        }
      : {}),
  }
}

describe('legacy plan migration', () => {
  it('normalizes plain code to the first cohort section', () => {
    expect(resolveLegacyKey('t1', '01276111', context())).toBe('t1/01276111/905')
  })

  it('normalizes code@cohort to that cohort section', () => {
    expect(resolveLegacyKey('t1', '01276222@y2', context())).toBe('t1/01276222/902')
  })

  it('normalizes code@section deterministically', () => {
    expect(resolveLegacyKey('t1', '96641007#777', context())).toBe('t1/96641007/777')
  })

  it('keeps unresolvable codes as unresolved section IDs', () => {
    expect(resolveLegacyKey('t1', '99999999', context())).toBe('t1/99999999/')
  })

  it('reads and dedupes v1 entries after normalization', () => {
    const storage = memoryStorage({
      [PLAN_KEY]: JSON.stringify([
        { term: 't1', key: '01276111', role: 'take' },
        { term: 't1', key: '01276111@y1', role: 'take' },
        { term: 't1', key: '01276111#905', role: 'ta' },
        { term: 't2', key: '96641007#905', role: 'take' },
        { term: 't3', key: '01276111', role: 'take' },
        { term: 't1', key: '01276111', role: 'professor' },
      ]),
    })
    const entries = readPlan(storage, context())
    expect(entries).toEqual([
      { term: 't1', sectionId: 't1/01276111/905', role: 'take' },
      { term: 't2', sectionId: 't2/96641007/905', role: 'take' },
    ])
  })

  it('migrates the legacy year/code shape', () => {
    const storage = memoryStorage({
      [PLAN_KEY]: JSON.stringify([{ term: 't1', code: '01276222', year: 'y2', role: 'ta' }]),
    })
    expect(readPlan(storage, context())).toEqual([
      { term: 't1', sectionId: 't1/01276222/902', role: 'ta', cohort: 'y2' },
    ])
  })
})

describe('plan v2 storage', () => {
  it('writes v2 under cei-plan-v2 and dedupes by section', () => {
    const storage = memoryStorage()
    const written = writePlan(
      [
        { term: 't1', sectionId: 't1/01276111/905', role: 'take' },
        { term: 't1', sectionId: 't1/01276111/905', role: 'ta' },
      ],
      storage,
    )
    expect(written).toEqual([
      { term: 't1', sectionId: 't1/01276111/905', role: 'take' },
    ])
    const raw = JSON.parse(storage.getItem(PLAN_KEY_V2) ?? 'null') as unknown
    expect(raw).toEqual({ v: 2, entries: written })
    expect(readPlan(storage, context())).toEqual(written)
  })

  it('prefers an existing v2 plan even when empty', () => {
    const storage = memoryStorage({
      [PLAN_KEY]: JSON.stringify([{ term: 't1', key: '01276111', role: 'take' }]),
      [PLAN_KEY_V2]: JSON.stringify({ v: 2, entries: [] }),
    })
    expect(readPlan(storage, context())).toEqual([])
  })

  it('drops malformed v2 entries', () => {
    const storage = memoryStorage({
      [PLAN_KEY_V2]: JSON.stringify({
        v: 2,
        entries: [
          { term: 't1', sectionId: 'bad-id', role: 'take' },
          { term: 't1', sectionId: 't1/01276111/905', role: 'take' },
        ],
      }),
    })
    expect(readPlan(storage, context())).toEqual([
      { term: 't1', sectionId: 't1/01276111/905', role: 'take' },
    ])
  })
})

describe('plan resolution', () => {
  const entries = [
    { term: 't1', sectionId: 't1/01276111/905', role: 'take' as const },
  ]

  it('resolves CEI entries and keeps full sessions for take', () => {
    const [course] = planCourses('t1', entries, context())
    expect(course?.code).toBe('01276111')
    expect(course?.planYear).toBe('1st Year')
    expect(course?.section).toBe('905')
    expect(course?.hasLab).toBe(true)
    expect(course?.planRole).toBe('take')
    expect(course?.sessions).toHaveLength(2)
  })

  it('keeps only lab sessions for a TA entry on a lab course', () => {
    const [course] = planCourses(
      't1',
      [{ term: 't1', sectionId: 't1/01276111/905', role: 'ta' }],
      context(),
    )
    expect(course?.planRole).toBe('TA')
    expect(course?.sessions).toHaveLength(1)
    expect(course?.sessions[0]?.type).toBe('lab')
  })

  it('downgrades a TA entry when the section has no lab', () => {
    const noLabTerms = [
      {
        id: 't1',
        label: '1/2569',
        years: [
          {
            id: 'y1' as const,
            label: '1st Year',
            notes: [],
            courses: [
              {
                ...makeGenEdCourse('01276000', '901'),
                type: 'lecture' as const,
                key: undefined,
                planYear: undefined,
              },
            ],
          },
        ],
      },
    ]
    const [course] = planCourses(
      't1',
      [{ term: 't1', sectionId: 't1/01276000/901', role: 'ta' }],
      { terms: noLabTerms },
    )
    expect(course?.hasLab).toBe(false)
    expect(course?.planRole).toBe('take')
  })

  it('resolves GenEd entries by code + section', () => {
    const [course] = planCourses(
      't1',
      [{ term: 't1', sectionId: 't1/96649999/901', role: 'take' }],
      context(),
    )
    expect(course?.planYear).toBe('Gen Ed')
    expect(course?.type).toBe('gened')
    expect(course?.key).toBe('t1/96649999/901')
  })

  it('resolves the same code against the entry cohort', () => {
    const [y3] = planCourses(
      't2',
      [{ term: 't2', sectionId: 't2/01276722/901', role: 'take', cohort: 'y3' }],
      context(),
    )
    const [y4] = planCourses(
      't2',
      [{ term: 't2', sectionId: 't2/01276722/901', role: 'take', cohort: 'y4' }],
      context(),
    )
    expect(y3?.planYear).toBe('3rd Year')
    expect(y4?.planYear).toBe('4th Year')
  })

  it('does not resolve an empty section number', () => {
    const entries = [{ term: 't1', sectionId: 't1/01276111/', role: 'take' as const }]
    expect(planCourses('t1', entries, context())).toHaveLength(0)
    expect(unresolvedCount('t1', entries, context(true))).toBe(1)
  })

  it('uses only the first entry per course code', () => {
    const resolved = planCourses(
      't1',
      [
        { term: 't1', sectionId: 't1/01276111/905', role: 'take' },
        { term: 't1', sectionId: 't1/01276111/905', role: 'ta' },
      ],
      context(),
    )
    expect(resolved).toHaveLength(1)
  })

  it('counts unresolved entries only once GenEd is ready', () => {
    const unresolved = [
      { term: 't1', sectionId: 't1/99999999/', role: 'take' as const },
    ]
    expect(unresolvedCount('t1', unresolved, context(true))).toBe(1)
    expect(unresolvedCount('t1', unresolved, context(false))).toBe(0)
  })
})

describe('plan entry helpers', () => {
  it('toggles add/remove and roles without mutating input', () => {
    const start = [
      { term: 't1', sectionId: 't1/01276111/905', role: 'take' as const },
    ]
    const added = togglePlanEntry(start, 't1', 't1/01276222/902')
    expect(added).toHaveLength(2)
    expect(start).toHaveLength(1)
    expect(togglePlanEntry(added, 't1', 't1/01276111/905')).toHaveLength(1)
    expect(togglePlanRole(added, 't1', 't1/01276111/905')[0]?.role).toBe('ta')
    expect(clearPlanTerm(added, 't1')).toEqual([])
  })
})
