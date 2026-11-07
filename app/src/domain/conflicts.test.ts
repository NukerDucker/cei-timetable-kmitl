import { describe, expect, it } from 'vitest'
import { courseWarnings, planConflictDetails, planConflicts } from './conflicts'
import { makePlanCourse, makeSession } from './test-utils'

describe('planConflictDetails', () => {
  it('reports overlapping sessions on the same day', () => {
    const a = makePlanCourse({
      code: 'A',
      name: 'Alpha',
      sessions: [makeSession({ day: 'Mon', start: '09:00', end: '11:00' })],
    })
    const b = makePlanCourse({
      code: 'B',
      name: 'Beta',
      sessions: [makeSession({ day: 'Mon', start: '10:00', end: '12:00' })],
    })
    const details = planConflictDetails([a, b])
    expect(details).toHaveLength(1)
    const first = details[0]
    expect(first?.kind).toBe('time')
    if (first?.kind === 'time') {
      expect(first.day).toBe('Mon')
      expect(first.start).toBe('09:00')
      expect(first.end).toBe('11:00')
    }
    expect(first?.label).toBe('Alpha ↔ Beta · Mon 09:00–11:00')
    expect(planConflicts([a, b])).toEqual(['Alpha ↔ Beta · Mon 09:00–11:00'])
  })

  it('does not report back-to-back sessions', () => {
    const a = makePlanCourse({
      sessions: [makeSession({ day: 'Mon', start: '09:00', end: '10:00' })],
    })
    const b = makePlanCourse({
      sessions: [makeSession({ day: 'Mon', start: '10:00', end: '11:00' })],
    })
    expect(planConflictDetails([a, b])).toEqual([])
  })

  it('reports a shared exam date and time', () => {
    const exam = { mid: '2026-08-17', time: '09:30–12:30' }
    const a = makePlanCourse({
      code: 'A',
      name: 'Alpha',
      exams: exam,
      sessions: [makeSession({ day: 'Mon', start: '09:00', end: '10:00' })],
    })
    const b = makePlanCourse({
      code: 'B',
      name: 'Beta',
      exams: exam,
      sessions: [makeSession({ day: 'Tue', start: '09:00', end: '10:00' })],
    })
    const details = planConflictDetails([a, b])
    expect(details).toHaveLength(1)
    expect(details[0]?.kind).toBe('exam')
    if (details[0]?.kind === 'exam') {
      expect(details[0].examKind).toBe('mid')
      expect(details[0].date).toBe('2026-08-17')
    }
  })

  it('ignores shared exam dates when the times differ', () => {
    const a = makePlanCourse({
      exams: { mid: '2026-08-17', time: '09:30–12:30' },
      sessions: [makeSession({ day: 'Mon', start: '09:00', end: '10:00' })],
    })
    const b = makePlanCourse({
      exams: { mid: '2026-08-17', time: '13:30–16:30' },
      sessions: [makeSession({ day: 'Tue', start: '09:00', end: '10:00' })],
    })
    expect(planConflictDetails([a, b])).toEqual([])
  })

  it('skips exam conflicts for TA entries but keeps time conflicts', () => {
    const exam = { mid: '2026-08-17' }
    const a = makePlanCourse({
      code: 'A',
      name: 'Alpha',
      exams: exam,
      planRole: 'TA',
      sessions: [makeSession({ day: 'Mon', start: '09:00', end: '10:00' })],
    })
    const b = makePlanCourse({
      code: 'B',
      name: 'Beta',
      exams: exam,
      sessions: [makeSession({ day: 'Mon', start: '09:30', end: '11:00' })],
    })
    const details = planConflictDetails([a, b])
    expect(details.map((detail) => detail.kind)).toEqual(['time'])
  })
})

describe('courseWarnings', () => {
  it('warns about overlapping plan sessions', () => {
    const candidate = makePlanCourse({
      code: 'C',
      name: 'Candidate',
      sessions: [makeSession({ day: 'Tue', start: '13:00', end: '16:00' })],
    })
    const planned = makePlanCourse({
      code: 'P',
      name: 'Planned',
      sessions: [makeSession({ day: 'Tue', start: '14:00', end: '15:00' })],
    })
    expect(courseWarnings(candidate, [planned])).toEqual([
      'Tue 13:00–16:00 with Planned',
    ])
  })

  it('dedupes repeated warnings for the same meeting', () => {
    const session = makeSession({ day: 'Tue', start: '13:00', end: '16:00' })
    const candidate = makePlanCourse({ sessions: [session] })
    const planned = makePlanCourse({
      code: 'P',
      name: 'Planned',
      sessions: [session, { ...session }],
    })
    expect(courseWarnings(candidate, [planned])).toHaveLength(1)
  })

  it('warns about shared exams unless either entry is TA', () => {
    const exam = { final: '2026-11-02', time: '13:30–16:30' }
    const candidate = makePlanCourse({
      code: 'C',
      name: 'Candidate',
      exams: exam,
      sessions: [makeSession({ day: 'Mon', start: '09:00', end: '10:00' })],
    })
    const planned = makePlanCourse({
      code: 'P',
      name: 'Planned',
      exams: exam,
      sessions: [makeSession({ day: 'Tue', start: '09:00', end: '10:00' })],
    })
    expect(courseWarnings(candidate, [planned])).toEqual([
      'final exam Mon 2 Nov 2026 with Planned',
    ])
    expect(courseWarnings({ ...candidate, planRole: 'TA' }, [planned])).toEqual([])
  })
})
