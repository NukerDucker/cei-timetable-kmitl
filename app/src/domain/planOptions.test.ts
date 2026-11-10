import { describe, expect, it } from 'vitest'
import { DEFAULT_PLAN_FILTER } from './filters'
import { buildPickerOptions, selectPickerGroups, splitGroupsByCategory } from './planOptions'
import { makeCourse, makeGenEdCourse, makePlanCourse, makeSession } from './test-utils'
import type { Term } from './types'

function fixtureTerm(): Term {
  return {
    id: 't1',
    label: '1/2569',
    years: [
      {
        id: 'y1',
        label: '1st Year',
        notes: [],
        courses: [
          makeCourse({ code: 'A101', name: 'Alpha', section: '901' }),
          makeCourse({ code: 'A102', name: 'Beta', section: '902' }),
        ],
      },
      { id: 'y2', label: '2nd Year', notes: [], courses: [makeCourse({ code: 'B201' })] },
    ],
  }
}

describe('buildPickerOptions', () => {
  it('builds selected-cohort plus GenEd options and skips selected codes', () => {
    const options = buildPickerOptions(
      fixtureTerm(),
      'y1',
      [makeGenEdCourse('G101', '901')],
      new Set(['A102']),
      'Gen Ed (1)',
    )
    expect(options.map((option) => option.key)).toEqual([
      't1/A101/901',
      't1/G101/901',
    ])
    expect(options[0]).toMatchObject({ group: 'y1', badge: '1st Year', cohort: 'y1' })
    expect(options[1]).toMatchObject({ group: 'gened', badge: 'Gen Ed', groupLabel: 'Gen Ed (1)' })
  })

  it('returns nothing without a term', () => {
    expect(buildPickerOptions(undefined, 'y1', [], new Set(), 'Gen Ed')).toEqual([])
  })
})

describe('selectPickerGroups', () => {
  const order = [
    { key: 'y1', label: '1st Year' },
    { key: 'gened', label: 'Gen Ed' },
  ]

  it('filters by search and keeps numeric section order', () => {
    const term = fixtureTerm()
    term.years[0]!.courses.push(makeCourse({ code: 'A101', name: 'Alpha', section: '902' }))
    const options = buildPickerOptions(term, 'y1', [], new Set(), 'Gen Ed')
    const groups = selectPickerGroups(options, DEFAULT_PLAN_FILTER, 'alpha', [], order)
    expect(groups).toHaveLength(1)
    expect(groups[0]?.subjects).toHaveLength(1)
    expect(groups[0]?.subjects[0]?.items.map((item) => item.sectionNumber)).toEqual(['901', '902'])
  })

  it('annotates warnings against the current plan without mutating input', () => {
    const options = buildPickerOptions(fixtureTerm(), 'y1', [], new Set(), 'Gen Ed')
    const plan = [
      makePlanCourse({
        code: 'P100',
        name: 'Planned',
        sessions: [makeSession({ day: 'Mon', start: '10:00', end: '11:00' })],
      }),
    ]
    const groups = selectPickerGroups(options, DEFAULT_PLAN_FILTER, '', plan, order)
    const alpha = groups[0]?.subjects.find((subject) => subject.code === 'A101')
    expect(alpha?.items[0]?.warnings[0]).toContain('with Planned')
    expect(options[0]).not.toHaveProperty('warnings')
  })

  it('applies the cohort filter and hides empty groups', () => {
    const options = buildPickerOptions(fixtureTerm(), 'y1', [], new Set(), 'Gen Ed')
    const groups = selectPickerGroups(
      options,
      { ...DEFAULT_PLAN_FILTER, cohort: 'y2' },
      '',
      [],
      order,
    )
    expect(groups).toEqual([])
  })
})

describe('splitGroupsByCategory', () => {
  it('separates core and elective subjects inside one cohort group', () => {
    const term = fixtureTerm()
    term.years[0]!.courses.push(
      makeCourse({ code: 'E201', name: 'Elective', type: 'elective' }),
    )
    const options = buildPickerOptions(term, 'y1', [], new Set(), 'Gen Ed')
    const groups = selectPickerGroups(options, DEFAULT_PLAN_FILTER, '', [], [
      { key: 'y1', label: '1st Year' },
    ])
    const split = splitGroupsByCategory(groups)
    expect(split.map((group) => group.label)).toEqual([
      '1st Year · Core',
      '1st Year · Elective',
    ])
    expect(split[0]?.subjects.map((subject) => subject.code)).not.toContain('E201')
    expect(split[1]?.subjects.map((subject) => subject.code)).toEqual(['E201'])
  })

  it('keeps a single-category group unchanged', () => {
    const options = buildPickerOptions(fixtureTerm(), 'y1', [], new Set(), 'Gen Ed')
    const groups = selectPickerGroups(options, DEFAULT_PLAN_FILTER, '', [], [
      { key: 'y1', label: '1st Year' },
    ])
    expect(splitGroupsByCategory(groups)).toEqual(groups)
  })
})
