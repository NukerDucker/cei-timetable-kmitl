import { minutes } from './time'
import type { Course, Day, Session } from './types'

export interface PlacedSession<C extends Course = Course> {
  course: C
  session: Session
  order: number
  lane: number
  overlaps: number
}

export interface DayLayout<C extends Course> {
  items: PlacedSession<C>[]
  laneCount: number
}

/**
 * Lane placement shared by the week grid and PNG export.
 * Stable order: sessions sorted by start, ties keep course/session order.
 * Half-open overlap semantics: touching sessions do not overlap.
 */
export function placeDaySessions<C extends Course>(
  courses: readonly C[],
  day: Day,
): DayLayout<C> {
  const entries: { course: C; session: Session; order: number }[] = []
  for (const course of courses) {
    course.sessions.forEach((session, order) => {
      if (session.day === day) entries.push({ course, session, order })
    })
  }
  entries.sort((a, b) => minutes(a.session.start) - minutes(b.session.start))

  const laneEnds: number[] = []
  const placed = entries.map((entry) => {
    const start = minutes(entry.session.start)
    const end = minutes(entry.session.end)
    let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start)
    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(0)
    }
    laneEnds[lane] = end
    return { ...entry, start, end, lane }
  })

  return {
    items: placed.map((item) => ({
      course: item.course,
      session: item.session,
      order: item.order,
      lane: item.lane,
      overlaps: placed.filter((other) => other.start < item.end && item.start < other.end).length,
    })),
    laneCount: laneEnds.length,
  }
}
