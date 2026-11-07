import { fmtDate } from '../domain/time'
import type { CourseType } from '../domain/types'

export const COURSE_TYPE_LABELS: Record<CourseType, string> = {
  lecture: 'Lecture',
  lab: 'Lab',
  elective: 'Elective',
  gened: 'Gen Ed',
}

export function courseTypeLabel(type: CourseType): string {
  return COURSE_TYPE_LABELS[type]
}

/** Exam date when published, otherwise its note, otherwise the legacy fallback. */
export function examDateOrNote(date: string | undefined, note: string | undefined): string {
  if (date) return fmtDate(date)
  return note || 'By instructor'
}
