import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PLAN_FILTER,
  courseClashesWithPlan,
  courseCredits,
  courseHasDay,
  creditValues,
  earliestMinute,
  filterActive,
  filterPlanOptions,
  groupPlanOptions,
  planTimeRange,
  sortPlanOptions,
} from './filters'
import type { PlanOption } from './filters'
import { makeCourse, makePlanCourse, makeSession } from './test-utils'

function option(
  code: string,
  name: string,
  credits: string,
  sessions = [makeSession({ day: 'Mon', start: '09:00', end: '10:00' })],
  group = 'y1',
): PlanOption {
  const course = makeCourse({ code, name, credits, sessions })
  return { course, key: `${code}@${group}`, group, badge: group }
}

describe('credits and days', () => {
  it('parses leading credits', () => {
    expect(courseCredits({ credits: '4(3-3-8)' })).toBe(4)
    expect(courseCredits({ credits: '0(4-0-8)' })).toBe(0)
    expect(courseCredits({ credits: 'TBD' })).toBeNull()
  })

  it('matches day filters', () => {
    const course = makeCourse({
      sessions: [makeSession({ day: 'Wed', start: '09:00', end: '10:00' })],
    })
    expect(courseHasDay(course, [])).toBe(true)
    expect(courseHasDay(course, ['Wed'])).toBe(true)
    expect(courseHasDay(course, ['Mon'])).toBe(false)
  })

  it('detects clashes with planned sessions', () => {
    const candidate = makeCourse({
      sessions: [makeSession({ day: 'Mon', start: '09:30', end: '11:00' })],
    })
    const planned = makePlanCourse({
      sessions: [makeSession({ day: 'Mon', start: '10:00', end: '12:00' })],
    })
    expect(courseClashesWithPlan(candidate, [planned])).toBe(true)
    expect(
      courseClashesWithPlan(candidate, [
        makePlanCourse({ sessions: [makeSession({ day: 'Tue', start: '10:00', end: '12:00' })] }),
      ]),
    ).toBe(false)
  })
})

describe('sortPlanOptions', () => {
  const alpha = option('01276010', 'Alpha', '3(3-0-6)', [
    makeSession({ day: 'Tue', start: '09:00', end: '10:00' }),
  ])
  const beta = option('01276002', 'Beta', '4(3-3-8)', [
    makeSession({ day: 'Mon', start: '13:00', end: '14:00' }),
  ])
  const gamma = option('01276001', 'Gamma', 'TBD', [
    makeSession({ day: 'Mon', start: '08:00', end: '09:00' }),
  ])

  it('sorts by name', () => {
    expect(sortPlanOptions([beta, alpha, gamma], 'name').map((item) => item.course.name)).toEqual([
      'Alpha',
      'Beta',
      'Gamma',
    ])
  })

  it('sorts codes numerically', () => {
    expect(sortPlanOptions([alpha, beta, gamma], 'code').map((item) => item.course.code)).toEqual([
      '01276001',
      '01276002',
      '01276010',
    ])
  })

  it('sorts by earliest day/time', () => {
    expect(sortPlanOptions([alpha, beta, gamma], 'time').map((item) => item.course.name)).toEqual([
      'Gamma',
      'Beta',
      'Alpha',
    ])
    expect(earliestMinute(beta.course)).toBe(13 * 60)
  })

  it('sorts credits ascending with unknown last', () => {
    expect(sortPlanOptions([alpha, beta, gamma], 'credits').map((item) => item.course.name)).toEqual([
      'Alpha',
      'Beta',
      'Gamma',
    ])
  })
})

describe('filterPlanOptions', () => {
  const options = [
    option('A', 'Alpha', '3(3-0-6)', [makeSession({ day: 'Mon', start: '09:00', end: '10:00' })], 'y1'),
    option('B', 'Beta', '4(3-3-8)', [makeSession({ day: 'Tue', start: '09:00', end: '10:00' })], 'y2'),
  ]
  const planned = [
    makePlanCourse({
      sessions: [makeSession({ day: 'Mon', start: '09:30', end: '11:00' })],
    }),
  ]

  it('filters by cohort, credits and day', () => {
    expect(
      filterPlanOptions(options, { ...DEFAULT_PLAN_FILTER, cohort: 'y2' }, []).map(
        (item) => item.course.name,
      ),
    ).toEqual(['Beta'])
    expect(
      filterPlanOptions(options, { ...DEFAULT_PLAN_FILTER, credit: '4' }, []).map(
        (item) => item.course.name,
      ),
    ).toEqual(['Beta'])
    expect(
      filterPlanOptions(options, { ...DEFAULT_PLAN_FILTER, days: ['Mon'] }, []).map(
        (item) => item.course.name,
      ),
    ).toEqual(['Alpha'])
  })

  it('hides conflicting options', () => {
    expect(
      filterPlanOptions(options, { ...DEFAULT_PLAN_FILTER, hideConflicts: true }, planned).map(
        (item) => item.course.name,
      ),
    ).toEqual(['Beta'])
  })

  it('reports active filters and credit values', () => {
    expect(filterActive(DEFAULT_PLAN_FILTER)).toBe(false)
    expect(filterActive({ ...DEFAULT_PLAN_FILTER, days: ['Mon'] })).toBe(true)
    expect(creditValues(options)).toEqual([3, 4])
  })
})

describe('planTimeRange', () => {
  it('snaps to 30-minute slots', () => {
    const courses = [
      makeCourse({ sessions: [makeSession({ day: 'Mon', start: '08:45', end: '12:30' })] }),
    ]
    expect(planTimeRange(courses)).toEqual({ start: 8 * 60 + 30, slots: 8 })
  })

  it('falls back to the full legacy grid when empty', () => {
    expect(planTimeRange([])).toEqual({ start: 7 * 60, slots: 26 })
  })

  it('uses the plan extremes across courses', () => {
    const courses = [
      makeCourse({ sessions: [makeSession({ day: 'Mon', start: '07:10', end: '08:00' })] }),
      makeCourse({ sessions: [makeSession({ day: 'Fri', start: '19:45', end: '21:10' })] }),
    ]
    expect(planTimeRange(courses)).toEqual({ start: 7 * 60, slots: 29 })
  })
})

describe('groupPlanOptions', () => {
  it('groups sections of one code and keeps single-section subjects', () => {
    const base = {
      badge: '1st Year',
      group: 'y1',
      groupLabel: '1st Year',
      course: {} as never,
    }
    const option = (key: string, code: string, sectionNumber: string) => ({
      ...base,
      key,
      sectionNumber,
      course: { code, name: code, type: 'lecture' as const, sessions: [] } as never,
    })
    const grouped = groupPlanOptions([
      option('k2', 'A', '102'),
      option('k1', 'A', '101'),
      option('k3', 'B', '901'),
    ])
    expect(grouped).toHaveLength(2)
    expect(grouped[0]?.options.map((item) => item.sectionNumber)).toEqual(['101', '102'])
    expect(grouped[1]?.options).toHaveLength(1)
  })
})
