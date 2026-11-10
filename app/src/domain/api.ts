import { CURATED_TERMS } from './curated'
import type { CuratedCourse, CuratedSession, CuratedTerm } from './curated'
import { sectionId } from './section'
import { browserStorage, readStorageJson, writeStorageJson } from './storage'
import { DAY_ORDER, PALETTE, dayName, hhmm, minutes, stableColor, titleCase } from './time'
import type {
  Cohort,
  CohortId,
  Course,
  CourseColor,
  CourseType,
  Day,
  Exam,
  Section,
  Session,
  StorageLike,
  Term,
  TermConfig,
} from './types'

export const TERM_CONFIG: readonly TermConfig[] = [
  { id: 't1', year: '2569', semester: '1', label: '1/2569' },
  { id: 't2', year: '2569', semester: '2', label: '2/2569' },
]

export const API_PATH = '/kmitl/api'
export const CACHE_KEY = 'cei-live-v3-2569'
export const CACHE_TTL = 6 * 60 * 60 * 1000

export type ApiMode = 'by_class' | 'by_subject_id'

/** Loosely typed KMITL teach-table row; only consumed fields are declared. */
export interface ApiRow {
  [key: string]: unknown
  teach_table_id?: string | number
  subject_id?: string | number
  subject_name_en?: string
  section?: string | number
  sec_pair?: string | number | null
  teach_day?: string | number
  teach_time?: string
  teach_time2?: string
  teachtime_str?: string
  room_name?: string | null
  lect_or_prac?: string
  teacher_list_en?: string
  credit_str?: string
  closed?: string | number
  midterm_start_date_time?: string | null
  midterm_end_date_time?: string | null
  final_start_date_time?: string | null
  final_end_date_time?: string | null
}

export type FlattenedRow = ApiRow & { classYear: string }

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

export interface FetchJsonOptions {
  timeoutMs?: number
  /** Total attempts, matching the legacy two-attempt retry. */
  attempts?: number
  fetchFn?: FetchLike
  sleep?: (ms: number) => Promise<void>
}

export type FetchJsonFn = <T = unknown>(url: string, options?: FetchJsonOptions) => Promise<T>

export class HttpError extends Error {
  readonly status: number
  readonly fatal: boolean

  constructor(status: number) {
    super('HTTP ' + status)
    this.name = 'HttpError'
    this.status = status
    this.fatal = status < 500
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchJson<T = unknown>(url: string, options: FetchJsonOptions = {}): Promise<T> {
  const timeoutMs = options.timeoutMs ?? 10000
  const attempts = options.attempts ?? 2
  const fetchFn: FetchLike =
    options.fetchFn ?? ((input, init) => fetch(input, init))
  const wait = options.sleep ?? sleep

  let lastError: unknown
  for (let attempt = 0; attempt < attempts; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetchFn(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new HttpError(response.status)
      const data = (await response.json()) as T
      clearTimeout(timer)
      return data
    } catch (error) {
      clearTimeout(timer)
      lastError = error
      if (error instanceof HttpError && error.fatal) break
      if (attempt === 0) await wait(600)
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}

export function apiUrl(config: TermConfig, mode: ApiMode, code = ''): string {
  const params = new URLSearchParams({
    function: 'get-teach-table-show',
    level_id: '1',
    mode,
    selected_year: config.year,
    selected_semester: config.semester,
  })
  if (mode === 'by_class') {
    params.set('selected_faculty', '01')
    params.set('selected_department', '05')
    params.set('selected_curriculum', '127')
    params.set('selected_class_year', '0')
    params.set('search_all_faculty', '0')
    params.set('search_all_department', '0')
    params.set('search_all_curriculum', '0')
    params.set('search_all_branch', '0')
    params.set('search_all_class_year', '1')
  } else {
    params.set('selected_subject_id', code)
    params.set('search_all_faculty', '1')
    params.set('search_all_department', '1')
    params.set('search_all_curriculum', '1')
    params.set('search_all_branch', '1')
    params.set('search_all_class_year', '1')
  }
  return API_PATH + '?' + params.toString()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : value == null ? '' : String(value)
}

function asNullableString(value: unknown): string | null {
  return value == null || value === '' ? null : asString(value)
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

export function flattenRows(payload: unknown, onlyCei: boolean): FlattenedRow[] {
  const rows: FlattenedRow[] = []
  if (!Array.isArray(payload)) return rows
  for (const program of payload) {
    if (!isRecord(program)) continue
    if (onlyCei && asString(program.curriculum2_id) !== '127') continue
    const classYear = asString(program.class)
    const teachtable = Array.isArray(program.teachtable) ? program.teachtable : []
    for (const group of teachtable) {
      if (!isRecord(group)) continue
      const data = Array.isArray(group.data) ? group.data : []
      for (const row of data) {
        if (!isRecord(row)) continue
        if (asString(row.closed) !== '0') continue
        rows.push({ ...(row as ApiRow), classYear })
      }
    }
  }
  const seen = new Set<string>()
  return rows.filter((row) => {
    const key = row.teach_table_id
      ? asString(row.teach_table_id)
      : [row.subject_id, row.section, row.teach_day, row.teach_time].map(asString).join('|')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function schedulable(row: Pick<ApiRow, 'teach_day' | 'teach_time' | 'teach_time2'>): boolean {
  const day = Number(row.teach_day)
  return (
    day >= 2 &&
    day <= 7 &&
    Boolean(row.teach_time) &&
    row.teach_time !== '00:00:00' &&
    Boolean(row.teach_time2) &&
    row.teach_time2 !== '00:00:00'
  )
}

export interface ExtraMeeting {
  day: Day
  start: string
  end: string
}

export function parseExtraMeetings(text: string | null | undefined): ExtraMeeting[] {
  const out: ExtraMeeting[] = []
  for (const match of (text ?? '').matchAll(/(\d)x(\d\d:\d\d)-(\d\d:\d\d)/g)) {
    const day = dayName(match[1])
    if (day) out.push({ day, start: match[2] ?? '', end: match[3] ?? '' })
  }
  return out
}

function sectionNumber(row: ApiRow): string {
  return asString(row.section)
}

export function chooseSection(rows: readonly ApiRow[]): string | null {
  const lectures = rows.filter((row) => row.lect_or_prac !== 'ป' && sectionNumber(row))
  const pool = lectures.length ? lectures : rows
  return (
    pool
      .map(sectionNumber)
      .filter(Boolean)
      .sort((a, b) => Number(a) - Number(b) || a.localeCompare(b))[0] ?? null
  )
}

export function selectCuratedRows(
  rows: readonly FlattenedRow[],
  course: Pick<Course, 'code' | 'sessions'>,
  classYear: string | number,
): FlattenedRow[] | null {
  const inClass = rows.filter((row) => row.classYear === String(classYear))
  const pool = inClass.length
    ? inClass
    : rows.filter((row) => !['1', '2', '3', '4'].includes(row.classYear))
  const valid = pool.filter(schedulable)
  if (!valid.length) return null
  const wanted = new Set(course.sessions.map((session) => session.section).filter(Boolean))
  let anchor: string | null = null
  if (wanted.size) {
    const exact = valid.filter((row) => wanted.has(sectionNumber(row)))
    anchor =
      sectionNumber(exact.find((row) => row.lect_or_prac !== 'ป') ?? exact[0] ?? {}) || null
    if (!anchor) {
      if (!course.code.startsWith('01276')) return null
      anchor = chooseSection(valid)
    }
  } else {
    anchor = chooseSection(valid)
  }
  if (!anchor) return null
  const keep = new Set([anchor])
  for (const row of valid.filter((item) => sectionNumber(item) === anchor)) {
    if (row.sec_pair) keep.add(asString(row.sec_pair))
    const partner = valid.find((item) => asString(item.sec_pair) === asString(row.section))
    if (partner) keep.add(sectionNumber(partner))
  }
  return valid.filter((row) => keep.has(sectionNumber(row)))
}

export function sessionsFromRows(rows: readonly ApiRow[]): Session[] {
  const raw: Session[] = []
  for (const row of rows) {
    const day = dayName(row.teach_day)
    if (!day) continue
    const type = row.lect_or_prac === 'ป' ? 'lab' : undefined
    const room = asNullableString(row.room_name)
    const section = sectionNumber(row)
    raw.push({
      day,
      start: hhmm(row.teach_time),
      end: hhmm(row.teach_time2),
      room,
      section,
      ...(type ? { type } : {}),
    })
    for (const extra of parseExtraMeetings(row.teachtime_str)) {
      raw.push({
        day: extra.day,
        start: extra.start,
        end: extra.end,
        room,
        section,
        ...(type ? { type } : {}),
      })
    }
  }
  const seen = new Set<string>()
  const unique = raw.filter((session) => {
    if (!validTimeRange(session.start, session.end)) return false
    const key = [
      session.day,
      session.start,
      session.end,
      session.room,
      session.section,
      session.type,
    ].join('|')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  const sorted = unique.sort(
    (a, b) =>
      DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day) ||
      minutes(a.start) - minutes(b.start),
  )
  const merged: Session[] = []
  for (const session of sorted) {
    const previous = merged[merged.length - 1]
    const contiguous =
      previous &&
      previous.day === session.day &&
      previous.room === session.room &&
      previous.section === session.section &&
      previous.type === session.type &&
      minutes(session.start) - minutes(previous.end) >= 0 &&
      minutes(session.start) - minutes(previous.end) <= 15
    if (contiguous && previous) {
      if (minutes(session.end) > minutes(previous.end)) previous.end = session.end
    } else {
      merged.push({ ...session })
    }
  }
  return merged.map((session) => ({
    day: session.day,
    start: session.start,
    end: session.end,
    room: session.room,
    section: session.section,
    ...(session.type ? { type: session.type } : {}),
  }))
}

export function teacherNames(rows: readonly ApiRow[]): string[] {
  const names: string[] = []
  for (const row of rows) {
    for (const part of asString(row.teacher_list_en).split(/<\/div>/)) {
      const name = part.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      if (name) names.push(titleCase(name))
    }
  }
  return [...new Set(names)]
}

export function apiDate(value: unknown): string | null {
  const text = asString(value)
  return text && !text.startsWith('0000-00-00') ? text : null
}

export function examPatch(rows: readonly ApiRow[], curated: Exam = {}): Exam {
  const lectures = rows.filter((row) => row.lect_or_prac !== 'ป')
  const row =
    lectures.find((item) => apiDate(item.midterm_start_date_time) || apiDate(item.final_start_date_time)) ??
    rows.find((item) => apiDate(item.midterm_start_date_time) || apiDate(item.final_start_date_time))
  const exams: Exam = { ...curated }
  const legacyTime = exams.time
  if (!row) return exams
  const mid = apiDate(row.midterm_start_date_time)
  const final = apiDate(row.final_start_date_time)
  const midEnd = apiDate(row.midterm_end_date_time)
  const finalEnd = apiDate(row.final_end_date_time)
  if (mid) {
    exams.mid = mid.slice(0, 10)
    delete exams.midNote
    exams.midTime = midEnd ? hhmm(mid.slice(11)) + '–' + hhmm(midEnd.slice(11)) : null
  }
  if (final) {
    exams.final = final.slice(0, 10)
    delete exams.finalNote
    exams.finalTime = finalEnd ? hhmm(final.slice(11)) + '–' + hhmm(finalEnd.slice(11)) : null
  }
  const start = final ?? mid
  const end = final ? finalEnd : midEnd
  if (start && end) exams.time = hhmm(start.slice(11)) + '–' + hhmm(end.slice(11))
  // A partial update must not leak the new shared time into the other kind.
  if (exams.time !== legacyTime) {
    if (exams.mid && exams.midTime === undefined) exams.midTime = legacyTime ?? null
    if (exams.final && exams.finalTime === undefined) exams.finalTime = legacyTime ?? null
  }
  return exams
}

export function courseType(
  code: string,
  rows: readonly ApiRow[],
  curatedType: CourseType | null | undefined,
): CourseType {
  if (curatedType) return curatedType
  if (rows.length && rows.every((row) => row.lect_or_prac === 'ป')) return 'lab'
  if (code.startsWith('9664')) return 'gened'
  return 'lecture'
}

export interface MakeCourseContext {
  termId: string
  cohort?: CohortId
  sectionNumber?: string
}

export function makeCourse(
  code: string,
  rows: readonly FlattenedRow[],
  curated: Course | null,
  context: MakeCourseContext,
): Course {
  const first = rows[0]
  if (!first) throw new Error(`makeCourse requires rows for ${code}`)
  const sessions = sessionsFromRows(rows)
  const number = context.sectionNumber ?? chooseSection(rows) ?? sessions[0]?.section ?? ''
  const section: Section = {
    id: sectionId(context.termId, code, number),
    number,
    sessions,
    ...(context.cohort ? { cohort: context.cohort } : {}),
  }
  return {
    name: curated ? curated.name : titleCase(asString(first.subject_name_en)),
    code,
    credits: asString(first.credit_str) || curated?.credits || '',
    color: curated ? curated.color : stableColor(code),
    type: courseType(code, rows, curated?.type),
    lecturers: teacherNames(rows).length ? teacherNames(rows) : (curated?.lecturers ?? []),
    sessions,
    exams: examPatch(rows, curated?.exams ?? {}),
    ...(curated?.prereq ? { prereq: curated.prereq } : {}),
    sections: [section],
    section: number,
  }
}

export function mergeCourse(curated: Course, rows: readonly FlattenedRow[], termId: string): Course {
  const apiSessions = sessionsFromRows(rows)
  if (!apiSessions.length) return curated
  const sessions = apiSessions.map((session) => {
    if (session.room) return session
    const match =
      curated.sessions.find(
        (candidate) => candidate.day === session.day && candidate.start === session.start,
      ) ??
      curated.sessions.find(
        (candidate) => candidate.day === session.day && candidate.section === session.section,
      )
    return match?.room ? { ...session, room: match.room } : session
  })
  const number = curated.section ?? chooseSection(rows) ?? sessions[0]?.section ?? ''
  const previous = curated.sections.find((section) => section.number === number)
  const section: Section = {
    id: sectionId(termId, curated.code, number),
    number,
    sessions,
    ...(previous?.cohort ? { cohort: previous.cohort } : {}),
  }
  return {
    ...curated,
    credits: asString(rows[0]?.credit_str) || curated.credits,
    lecturers: teacherNames(rows).length ? teacherNames(rows) : curated.lecturers,
    sessions,
    sections: [section],
    section: number,
    exams: examPatch(rows, curated.exams),
  }
}

export function mergeTerm(term: Term, rows: readonly FlattenedRow[]): Term {
  const byCode = new Map<string, FlattenedRow[]>()
  for (const row of rows) {
    const code = asString(row.subject_id)
    if (!byCode.has(code)) byCode.set(code, [])
    byCode.get(code)?.push(row)
  }
  const seenCodes = new Set(term.years.flatMap((year) => year.courses.map((course) => course.code)))
  const years: Cohort[] = term.years.map((year) => {
    const cohortNumber = Number(year.id.slice(1))
    const known = new Set(year.courses.map((course) => course.code))
    const courses = year.courses.map((course) => {
      const candidates = byCode.get(course.code) ?? []
      const selected = selectCuratedRows(candidates, course, cohortNumber)
      return selected ? mergeCourse(course, selected, term.id) : course
    })
    for (const [code, candidates] of byCode) {
      if (!code.startsWith('01276') || known.has(code) || seenCodes.has(code)) continue
      const inClass = candidates.filter(
        (row) => row.classYear === String(cohortNumber) && schedulable(row),
      )
      if (!inClass.length) continue
      const anchor = chooseSection(inClass)
      const selected = inClass.filter(
        (row) => sectionNumber(row) === anchor || asString(row.sec_pair) === anchor,
      )
      const course = selected.length
        ? makeCourse(code, selected, null, {
            termId: term.id,
            cohort: year.id,
            ...(anchor ? { sectionNumber: anchor } : {}),
          })
        : null
      if (course && course.sessions.length) {
        courses.push(course)
        known.add(code)
        seenCodes.add(code)
      }
    }
    return { ...year, courses }
  })
  return { ...term, years }
}

export interface FetchTermOptions {
  fetchJson?: FetchJsonFn
}

export async function fetchTerm(
  config: TermConfig,
  options: FetchTermOptions = {},
): Promise<FlattenedRow[]> {
  const request = options.fetchJson ?? fetchJson
  const primary = flattenRows(await request(apiUrl(config, 'by_class')), true)
  if (!primary.length) throw new Error('Empty timetable for ' + config.label)
  const found = new Set(primary.map((row) => asString(row.subject_id)))
  const curatedTerm = CURATED_TERMS.find((term) => term.label === config.label)
  const missing = [
    ...new Set(
      (curatedTerm?.years ?? []).flatMap((year) => year.courses.map((course) => course.code)),
    ),
  ]
    .filter((code) => !found.has(code))
    .slice(0, 12)
  const extras = await Promise.allSettled(
    missing.map((code) => request(apiUrl(config, 'by_subject_id', code))),
  )
  const extraRows = extras.flatMap((result) =>
    result.status === 'fulfilled' ? flattenRows(result.value, false) : [],
  )
  return primary.concat(extraRows)
}

export interface TermCache {
  v: 3
  savedAt: number
  terms: Term[]
}

function isCourseColor(value: string): value is CourseColor {
  return (PALETTE as readonly string[]).includes(value)
}

function isCourseType(value: string): value is CourseType {
  return value === 'lecture' || value === 'lab' || value === 'elective' || value === 'gened'
}

function isDay(value: string): value is Day {
  return (DAY_ORDER as readonly string[]).includes(value)
}

/** `HH:mm`; `24:00` is valid only as an interval end. */
export function isClock(value: string, allowEnd = false): boolean {
  if (allowEnd && value === '24:00') return true
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

/** Reject malformed or backwards session times at API and cache boundaries. */
export function validTimeRange(start: string, end: string): boolean {
  return isClock(start) && isClock(end, true) && minutes(end) > minutes(start)
}

function isCohortId(value: string): value is CohortId {
  return value === 'y1' || value === 'y2' || value === 'y3' || value === 'y4'
}

function normalizeSession(value: unknown): Session | null {
  if (!isRecord(value)) return null
  const day = asString(value.day)
  if (!isDay(day)) return null
  const start = asString(value.start)
  const end = asString(value.end)
  if (!validTimeRange(start, end)) return null
  return {
    day,
    start,
    end,
    room: asNullableString(value.room),
    section: asString(value.section),
    ...(value.type === 'lab' ? { type: 'lab' as const } : {}),
  }
}

function normalizeExam(value: unknown): Exam {
  if (!isRecord(value)) return {}
  const exam: Exam = {}
  if (typeof value.mid === 'string') exam.mid = value.mid
  if (typeof value.final === 'string') exam.final = value.final
  if (typeof value.midNote === 'string') exam.midNote = value.midNote
  if (typeof value.finalNote === 'string') exam.finalNote = value.finalNote
  if (typeof value.midRoom === 'string') exam.midRoom = value.midRoom
  if (typeof value.finalRoom === 'string') exam.finalRoom = value.finalRoom
  if (typeof value.time === 'string') exam.time = value.time
  if ('midTime' in value) {
    exam.midTime = typeof value.midTime === 'string' ? value.midTime : null
  }
  if ('finalTime' in value) {
    exam.finalTime = typeof value.finalTime === 'string' ? value.finalTime : null
  }
  return exam
}

function normalizeSection(
  value: unknown,
  termId: string,
  code: string,
  fallbackNumber: string,
  fallbackCohort?: CohortId,
): Section | null {
  if (!isRecord(value)) return null
  const number = asString(value.number) || fallbackNumber
  const sessions = Array.isArray(value.sessions)
    ? value.sessions.map(normalizeSession).filter((session): session is Session => session !== null)
    : []
  const cohort = asString(value.cohort)
  return {
    id: asString(value.id) || sectionId(termId, code, number),
    number,
    sessions,
    ...(isCohortId(cohort) ? { cohort } : fallbackCohort ? { cohort: fallbackCohort } : {}),
  }
}

function normalizeCourse(
  value: unknown,
  termId: string,
  cohort?: CohortId,
): Course | null {
  if (!isRecord(value)) return null
  const code = asString(value.code)
  if (!code) return null
  const color = asString(value.color)
  const type = asString(value.type)
  const sessions = Array.isArray(value.sessions)
    ? value.sessions.map(normalizeSession).filter((session): session is Session => session !== null)
    : []
  const rawSections = Array.isArray(value.sections) ? value.sections : []
  const fallbackNumber =
    asString(value.section) ||
    sessions.find((session) => session.type !== 'lab' && session.section)?.section ||
    sessions[0]?.section ||
    ''
  const sections = rawSections.length
    ? rawSections
        .map((section) => normalizeSection(section, termId, code, fallbackNumber, cohort))
        .filter((section): section is Section => section !== null)
    : fallbackNumber
      ? [
          {
            id: sectionId(termId, code, fallbackNumber),
            number: fallbackNumber,
            sessions,
            cohort,
          },
        ]
      : []
  return {
    name: asString(value.name) || code,
    code,
    credits: asString(value.credits),
    color: isCourseColor(color) ? color : stableColor(code),
    type: isCourseType(type) ? type : 'lecture',
    lecturers: asStringArray(value.lecturers),
    sessions,
    exams: normalizeExam(value.exams),
    ...(isRecord(value.prereq) &&
    typeof value.prereq.title === 'string' &&
    typeof value.prereq.met === 'boolean'
      ? { prereq: { title: value.prereq.title, met: value.prereq.met } }
      : {}),
    sections,
    ...(fallbackNumber ? { section: fallbackNumber } : {}),
  }
}

/** Normalize a stored course from either the legacy flat shape or this model. */
export function normalizeStoredCourse(
  value: unknown,
  termId: string,
  cohort?: CohortId,
): Course | null {
  return normalizeCourse(value, termId, cohort)
}

function normalizeCachedTerm(value: unknown): Term | null {
  if (!isRecord(value)) return null
  const id = asString(value.id)
  const label = asString(value.label)
  if (!id || !label || !Array.isArray(value.years)) return null
  const years: Cohort[] = []
  for (const rawYear of value.years) {
    if (!isRecord(rawYear)) return null
    const cohortId = asString(rawYear.id)
    if (!isCohortId(cohortId)) return null
    const courses: Course[] = []
    for (const rawCourse of Array.isArray(rawYear.courses) ? rawYear.courses : []) {
      const course = normalizeCourse(rawCourse, id, cohortId)
      if (course) courses.push(course)
    }
    years.push({
      id: cohortId,
      label: asString(rawYear.label) || cohortId,
      courses,
      notes: asStringArray(rawYear.notes),
    })
  }
  return { id, label, years }
}

export function readTermCache(storage: StorageLike | null = browserStorage()): TermCache | null {
  const raw = readStorageJson(storage, CACHE_KEY)
  if (!isRecord(raw) || raw.v !== 3 || !Array.isArray(raw.terms)) return null
  if (raw.terms.length !== CURATED_TERMS.length) return null
  const expectedIds = new Set(TERM_CONFIG.map((config) => config.id))
  const seen = new Set<string>()
  const terms: Term[] = []
  for (const rawTerm of raw.terms) {
    const term = normalizeCachedTerm(rawTerm)
    if (!term) return null
    if (!expectedIds.has(term.id) || seen.has(term.id)) return null
    seen.add(term.id)
    terms.push(term)
  }
  const savedAt = Number.isFinite(raw.savedAt) ? (raw.savedAt as number) : 0
  return { v: 3, savedAt, terms }
}

export function writeTermCache(
  terms: readonly Term[],
  storage: StorageLike | null = browserStorage(),
  savedAt = Date.now(),
): boolean {
  return writeStorageJson(storage, CACHE_KEY, { v: 3, savedAt, terms })
}

function curatedSession(value: CuratedSession): Session | null {
  const day = value.day
  if (!isDay(day)) return null
  return {
    day,
    start: value.start,
    end: value.end,
    room: value.room ?? null,
    section: value.section ?? '',
    ...(value.type === 'lab' ? { type: 'lab' as const } : {}),
  }
}

function curatedCourse(value: CuratedCourse, termId: string, cohort: CohortId): Course {
  const sessions = value.sessions
    .map(curatedSession)
    .filter((session): session is Session => session !== null)
  const number =
    sessions.find((session) => session.type !== 'lab' && session.section)?.section ??
    sessions[0]?.section ??
    ''
  const color = value.color
  const type = value.type
  return {
    name: value.name,
    code: value.code,
    credits: value.credits,
    color: isCourseColor(color) ? color : stableColor(value.code),
    type: isCourseType(type) ? type : 'lecture',
    lecturers: value.lecturers,
    sessions,
    exams: { ...value.exams },
    ...(value.prereq ? { prereq: value.prereq } : {}),
    sections: number
      ? [{ id: sectionId(termId, value.code, number), number, sessions, cohort }]
      : [],
    ...(number ? { section: number } : {}),
  }
}

export function curatedTermToTerm(term: CuratedTerm): Term {
  return {
    id: term.id,
    label: term.label,
    years: term.years.map((year) => {
      const cohort = isCohortId(year.id) ? year.id : 'y1'
      return {
        id: cohort,
        label: year.label,
        courses: year.courses.map((course) => curatedCourse(course, term.id, cohort)),
        notes: [...year.notes],
      }
    }),
  }
}

/** Fresh curated fallback terms; never share mutable objects with live data. */
export function curatedTerms(): Term[] {
  return CURATED_TERMS.map(curatedTermToTerm)
}

export type TermsLoadStatus =
  | 'fresh-cache'
  | 'live'
  | 'partial'
  | 'offline-cache'
  | 'offline-snapshot'

export interface LoadTermsResult {
  terms: Term[]
  status: TermsLoadStatus
  savedAt: number
  updated: number
}

export interface LoadTermsOptions {
  storage?: StorageLike | null
  fetchJson?: FetchJsonFn
  now?: () => number
}

/**
 * Cache-first load matching the legacy flow: serve a fresh cache immediately,
 * otherwise fetch both terms, merge over cache or curated fallback, and write
 * the cache only when every term updated.
 */
export async function loadTerms(options: LoadTermsOptions = {}): Promise<LoadTermsResult> {
  const storage = options.storage === undefined ? browserStorage() : options.storage
  const now = options.now ?? (() => Date.now())
  const cached = readTermCache(storage)

  if (cached && now() - cached.savedAt < CACHE_TTL) {
    return { terms: cached.terms, status: 'fresh-cache', savedAt: cached.savedAt, updated: 0 }
  }

  const results = await Promise.allSettled(
    TERM_CONFIG.map(async (config) => ({
      config,
      rows: await fetchTerm(config, options.fetchJson ? { fetchJson: options.fetchJson } : {}),
    })),
  )
  let updated = 0
  const baseTerms = cached ? cached.terms : curatedTerms()
  const liveTerms = baseTerms.map((term) => {
    const hit = results.find(
      (result) =>
        result.status === 'fulfilled' && result.value.config.label === term.label,
    )
    if (!hit || hit.status !== 'fulfilled') return term
    updated++
    return mergeTerm(term, hit.value.rows)
  })

  if (!updated) {
    return {
      terms: baseTerms,
      status: cached ? 'offline-cache' : 'offline-snapshot',
      savedAt: cached?.savedAt ?? 0,
      updated: 0,
    }
  }

  const savedAt = updated === TERM_CONFIG.length ? now() : (cached?.savedAt ?? 0)
  if (updated === TERM_CONFIG.length) writeTermCache(liveTerms, storage, savedAt)
  return {
    terms: liveTerms,
    status: updated === TERM_CONFIG.length ? 'live' : 'partial',
    savedAt,
    updated,
  }
}
