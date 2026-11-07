import { fmtDate, toMin } from './time'
import type { ConflictDetail, PlanCourse, ScheduledCourse } from './types'

const EXAM_KINDS = ['mid', 'final'] as const

function overlaps(a: { day: string; start: string; end: string }, b: { day: string; start: string; end: string }): boolean {
  return a.day === b.day && toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end)
}

/**
 * Time and exam conflicts between resolved plan courses.
 * TA entries skip exam conflicts; time conflicts still count.
 */
export function planConflictDetails(courses: readonly PlanCourse[]): ConflictDetail[] {
  const out: ConflictDetail[] = []
  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      const a = courses[i]
      const b = courses[j]
      if (!a || !b) continue
      for (const session of a.sessions) {
        for (const other of b.sessions) {
          if (session.day !== other.day) continue
          if (toMin(session.start) < toMin(other.end) && toMin(other.start) < toMin(session.end)) {
            out.push({
              kind: 'time',
              a,
              b,
              day: session.day,
              start: session.start,
              end: session.end,
              label: `${a.name} ↔ ${b.name} · ${session.day} ${session.start}–${session.end}`,
            })
          }
        }
      }
      for (const kind of EXAM_KINDS) {
        if (a.planRole === 'TA' || b.planRole === 'TA') break
        const day = a.exams[kind]
        if (!day || day !== b.exams[kind]) continue
        if (a.exams.time && b.exams.time && a.exams.time !== b.exams.time) continue
        out.push({
          kind: 'exam',
          a,
          b,
          examKind: kind,
          date: day,
          label: `${a.name} ↔ ${b.name} · ${kind} exam ${fmtDate(day)}`,
        })
      }
    }
  }
  return out
}

export function planConflicts(courses: readonly PlanCourse[]): string[] {
  return [...new Set(planConflictDetails(courses).map((detail) => detail.label))]
}

/**
 * Warnings for a candidate course against the current plan: overlapping
 * sessions and shared exam dates (TA entries skip exam warnings).
 */
export function courseWarnings(
  course: ScheduledCourse,
  planList: readonly ScheduledCourse[],
): string[] {
  const warnings: string[] = []
  const seen = new Set<string>()
  for (const other of planList) {
    for (const session of course.sessions) {
      for (const meeting of other.sessions) {
        if (!overlaps(session, meeting)) continue
        const key = `${other.key ?? other.code}|${session.day}|${session.start}|${session.end}`
        if (seen.has(key)) continue
        seen.add(key)
        warnings.push(`${session.day} ${session.start}–${session.end} with ${other.name}`)
      }
    }
    for (const kind of EXAM_KINDS) {
      if (course.planRole === 'TA' || other.planRole === 'TA') break
      const day = course.exams[kind]
      if (!day || !other.exams[kind] || day !== other.exams[kind]) continue
      if (course.exams.time && other.exams.time && course.exams.time !== other.exams.time) continue
      warnings.push(`${kind} exam ${fmtDate(day)} with ${other.name}`)
    }
  }
  return [...new Set(warnings)]
}
