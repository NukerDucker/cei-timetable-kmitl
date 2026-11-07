/** Shared domain types for the timetable and planner. */

export type CohortId = 'y1' | 'y2' | 'y3' | 'y4'

/**
 * Term identity used by the planner and caches (`t1`, `t2`).
 *
 * TODO: hash-route term keys use `2569-1`; section IDs currently use this
 * config id. Unify the canonical term key if routes and plan IDs must match.
 */
export type TermId = string

export type Role = 'take' | 'ta'
export type Category = 'core' | 'elective' | 'gened'
export type CourseType = 'lecture' | 'lab' | 'elective' | 'gened'
export type CourseColor = 'red' | 'green' | 'blue' | 'purple' | 'magenta' | 'teal'
export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'
export type FetchState = 'idle' | 'loading' | 'ready' | 'error'

export interface Session {
  day: Day
  start: string
  end: string
  room: string | null
  section: string
  /** Only present for lab meetings. */
  type?: 'lab'
}

export interface Exam {
  mid?: string
  final?: string
  midNote?: string
  finalNote?: string
  midRoom?: string
  finalRoom?: string
  time?: string
}

export interface Prereq {
  title: string
  met: boolean
}

/**
 * A numbered class of a course. `id` is the stable section identity
 * `${termId}/${courseCode}/${number}` and never derives from API row ids.
 */
export interface Section {
  id: string
  number: string
  sessions: Session[]
  /** Cohort the section is anchored to; absent for GenEd sections. */
  cohort?: CohortId
}

/**
 * A subject offering.
 *
 * `sections` is the authoritative offering list. `sessions` mirrors the
 * currently selected/default section for parity with the legacy renderer;
 * plan resolution replaces it with the chosen section's sessions.
 */
export interface Course {
  name: string
  code: string
  credits: string
  color: CourseColor
  type: CourseType
  lecturers: string[]
  sessions: Session[]
  exams: Exam
  prereq?: Prereq
  sections: Section[]
  /** Number of the default/anchored section. */
  section?: string
  /** GenEd legacy key: `code#section`. */
  key?: string
  /** Picker group label, e.g. `1st Year` or `Gen Ed`. */
  planYear?: string
}

export interface Cohort {
  id: CohortId
  label: string
  courses: Course[]
  notes: string[]
}

export interface Term {
  id: TermId
  label: string
  years: Cohort[]
}

/** A plan row: a course resolved to one section, plus role projection. */
export interface PlanCourse extends Course {
  /** Stable section ID, also used as the plan toggle key. */
  key: string
  sectionId: string
  section: string
  planYear: string
  hasLab: boolean
  /** `TA` when the stored role is `ta` and the section has a lab. */
  planRole: 'TA' | 'take'
}

/** The subset of a course needed for conflict and filter math. */
export interface ScheduledCourse {
  name: string
  code: string
  credits: string
  sessions: Session[]
  exams: Exam
  planRole?: 'TA' | 'take'
  key?: string
}

export interface PlanEntry {
  term: TermId
  /** `${term}/${courseCode}/${sectionNumber}` */
  sectionId: string
  role: Role
  /** Cohort picked under; disambiguates the same code offered to several cohorts. */
  cohort?: CohortId
}

export interface StoredPlan {
  v: 2
  entries: PlanEntry[]
}

export interface GenEdCourse extends Course {
  /** Legacy-compatible key: `code#section`. */
  key: string
  section: string
  planYear: 'Gen Ed'
  type: 'gened'
}

export interface GenEdState {
  status: FetchState
  courses: GenEdCourse[]
  savedAt?: number
  refreshing?: boolean
  error?: string
}

interface ConflictBase {
  a: PlanCourse
  b: PlanCourse
  label: string
}

export type ConflictDetail =
  | (ConflictBase & {
      kind: 'time'
      day: Day
      start: string
      end: string
    })
  | (ConflictBase & {
      kind: 'exam'
      examKind: 'mid' | 'final'
      date: string
    })

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem?(key: string): void
}

export interface TermConfig {
  id: TermId
  year: string
  semester: string
  label: string
}
