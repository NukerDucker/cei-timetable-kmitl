import { DAY_ORDER, DAY_START, SLOT, SLOTS, toMin } from './time'
import type { Course, ScheduledCourse, Session } from './types'

export type SortKey = 'name' | 'code' | 'time' | 'credits'

export interface PlanFilter {
  cohort: string
  credit: string
  days: string[]
  hideConflicts: boolean
  sort: SortKey
}

export const DEFAULT_PLAN_FILTER: PlanFilter = {
  cohort: 'all',
  credit: '',
  days: [],
  hideConflicts: false,
  sort: 'name',
}

export interface PlanOption<C extends ScheduledCourse = ScheduledCourse> {
  course: C
  key: string
  badge?: string
  group?: string
  groupLabel?: string
}

export function courseCredits(course: Pick<Course, 'credits'>): number | null {
  const credits = parseInt(course.credits, 10)
  return Number.isFinite(credits) ? credits : null
}

export function courseHasDay(
  course: Pick<Course, 'sessions'>,
  days: readonly string[],
): boolean {
  return !days.length || course.sessions.some((session) => days.includes(session.day))
}

export function courseClashesWithPlan(
  course: Pick<Course, 'sessions'>,
  planList: readonly Pick<Course, 'sessions'>[],
): boolean {
  return course.sessions.some((session) =>
    planList.some((other) =>
      other.sessions.some(
        (meeting) =>
          meeting.day === session.day &&
          toMin(session.start) < toMin(meeting.end) &&
          toMin(meeting.start) < toMin(session.end),
      ),
    ),
  )
}

export function earliestMinute(course: Pick<Course, 'sessions'>): number {
  const values = course.sessions
    .map((session) => DAY_ORDER.indexOf(session.day) * 1440 + toMin(session.start))
    .filter((value) => value >= 0)
  return values.length ? Math.min(...values) : Infinity
}

export function sortPlanOptions<T extends PlanOption>(items: readonly T[], sort: SortKey): T[] {
  return items.slice().sort((a, b) => {
    if (sort === 'code') {
      return a.course.code.localeCompare(b.course.code, undefined, { numeric: true })
    }
    if (sort === 'time') {
      return earliestMinute(a.course) - earliestMinute(b.course) ||
        a.course.name.localeCompare(b.course.name)
    }
    if (sort === 'credits') {
      const creditsA = courseCredits(a.course)
      const creditsB = courseCredits(b.course)
      return (creditsA === null ? 99 : creditsA) - (creditsB === null ? 99 : creditsB) ||
        a.course.name.localeCompare(b.course.name)
    }
    return a.course.name.localeCompare(b.course.name)
  })
}

export function filterPlanOptions<T extends PlanOption>(
  options: readonly T[],
  filter: PlanFilter,
  planList: readonly Pick<Course, 'sessions'>[],
): T[] {
  return options.filter((option) => {
    if (filter.cohort !== 'all' && option.group !== filter.cohort) return false
    if (filter.credit !== '' && courseCredits(option.course) !== Number(filter.credit)) return false
    if (!courseHasDay(option.course, filter.days)) return false
    if (filter.hideConflicts && courseClashesWithPlan(option.course, planList)) return false
    return true
  })
}

export function filterActive(filter: PlanFilter): boolean {
  return (
    filter.cohort !== 'all' ||
    filter.credit !== '' ||
    filter.days.length > 0 ||
    filter.hideConflicts
  )
}

export function creditValues(options: readonly PlanOption[]): number[] {
  return [...new Set(
    options
      .map((option) => courseCredits(option.course))
      .filter((credits): credits is number => credits !== null),
  )].sort((a, b) => a - b)
}

export interface TimeRange {
  start: number
  slots: number
}

/** Snap the plan's sessions to the 30-minute grid, clamped to one day. */
export function planTimeRange(
  courses: readonly { sessions: readonly Session[] }[],
): TimeRange {
  let min = Infinity
  let max = -Infinity
  for (const course of courses) {
    for (const session of course.sessions) {
      const start = toMin(session.start)
      const end = toMin(session.end)
      if (start < min) min = start
      if (end > max) max = end
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { start: DAY_START, slots: SLOTS }
  }
  const start = Math.max(0, Math.floor(min / SLOT) * SLOT)
  const end = Math.min(24 * 60, Math.ceil(max / SLOT) * SLOT)
  return { start, slots: Math.max(2, Math.ceil((end - start) / SLOT)) }
}
