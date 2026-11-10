import { describe, expect, it } from 'vitest'
import { makeCourse, makeSession } from './test-utils'
import { placeDaySessions } from './weekLayout'

describe('placeDaySessions', () => {
  it('places overlapping sessions in separate lanes and counts overlaps', () => {
    const a = makeCourse({
      code: 'A',
      sessions: [makeSession({ day: 'Mon', start: '09:00', end: '11:00' })],
    })
    const b = makeCourse({
      code: 'B',
      sessions: [makeSession({ day: 'Mon', start: '10:00', end: '12:00' })],
    })
    const layout = placeDaySessions([a, b], 'Mon')
    expect(layout.laneCount).toBe(2)
    expect(layout.items.map((item) => item.course.code)).toEqual(['A', 'B'])
    expect(layout.items.map((item) => item.lane)).toEqual([0, 1])
    expect(layout.items.map((item) => item.overlaps)).toEqual([2, 2])
  })

  it('reuses a lane for back-to-back sessions', () => {
    const a = makeCourse({
      code: 'A',
      sessions: [makeSession({ day: 'Mon', start: '09:00', end: '10:00' })],
    })
    const b = makeCourse({
      code: 'B',
      sessions: [makeSession({ day: 'Mon', start: '10:00', end: '11:00' })],
    })
    const layout = placeDaySessions([a, b], 'Mon')
    expect(layout.laneCount).toBe(1)
    expect(layout.items.map((item) => item.lane)).toEqual([0, 0])
    expect(layout.items.map((item) => item.overlaps)).toEqual([1, 1])
  })

  it('keeps stable start order and session order for ties', () => {
    const a = makeCourse({
      code: 'A',
      sessions: [
        makeSession({ day: 'Mon', start: '09:00', end: '10:00' }),
        makeSession({ day: 'Mon', start: '09:00', end: '10:00' }),
      ],
    })
    const b = makeCourse({
      code: 'B',
      sessions: [makeSession({ day: 'Mon', start: '08:30', end: '09:30' })],
    })
    const layout = placeDaySessions([a, b], 'Mon')
    expect(layout.items.map((item) => item.course.code)).toEqual(['B', 'A', 'A'])
    expect(layout.items.map((item) => item.order)).toEqual([0, 0, 1])
  })

  it('ignores other days and does not mutate inputs', () => {
    const a = makeCourse({
      code: 'A',
      sessions: [
        makeSession({ day: 'Mon', start: '09:00', end: '10:00' }),
        makeSession({ day: 'Tue', start: '09:00', end: '10:00' }),
      ],
    })
    const before = JSON.stringify(a)
    const layout = placeDaySessions([a], 'Mon')
    expect(layout.items).toHaveLength(1)
    expect(JSON.stringify(a)).toBe(before)
  })
})
