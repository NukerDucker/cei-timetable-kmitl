import { parseTimeMinutes } from './time'
import type { Exam } from './types'

export type ExamKind = 'mid' | 'final'

/**
 * Timing for one exam kind.
 * - a per-kind string overrides the legacy shared `time`;
 * - a missing per-kind field falls back to legacy `time`;
 * - explicit `null` means "newly known unknown" and suppresses the fallback.
 */
export function examTime(exam: Exam, kind: ExamKind): string | undefined {
  const perKind = kind === 'mid' ? exam.midTime : exam.finalTime
  if (perKind !== undefined) return perKind ?? undefined
  return exam.time
}

export interface ExamTimeRange {
  start: number
  end: number
}

/** Parse `HH:mm–HH:mm` (`–` or `-`); `24:00` allowed only as the end. */
export function parseExamRange(value: string): ExamTimeRange | null {
  const [startText = '', endText = ''] = value.split(/[–-]/).map((part) => part.trim())
  const start = parseTimeMinutes(startText)
  const end = endText === '24:00' ? 24 * 60 : parseTimeMinutes(endText)
  if (start === null || end === null || end <= start) return null
  return { start, end }
}

/**
 * Half-open interval overlap for one exam kind.
 * Conservative: unknown or malformed timing counts as overlapping, matching
 * the legacy same-date warning.
 */
export function examTimesOverlap(a: Exam, b: Exam, kind: ExamKind): boolean {
  const aTime = examTime(a, kind)
  const bTime = examTime(b, kind)
  if (!aTime || !bTime) return true
  const aRange = parseExamRange(aTime)
  const bRange = parseExamRange(bTime)
  if (!aRange || !bRange) return true
  return aRange.start < bRange.end && bRange.start < aRange.end
}
