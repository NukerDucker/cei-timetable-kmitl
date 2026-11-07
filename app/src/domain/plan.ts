import { curatedTerms } from './api'
import { readGenedCache } from './gened'
import { parseSectionId, sectionId } from './section'
import { browserStorage, readStorageJson, writeStorageJson } from './storage'
import type {
  CohortId,
  Course,
  GenEdState,
  PlanCourse,
  PlanEntry,
  Role,
  Section,
  StorageLike,
  Term,
  TermId,
} from './types'

/** Legacy key (read-only fallback). */
export const PLAN_KEY = 'cei-plan-v1'
/**
 * v2 key. Assumption: "write v2" means a new key + `{v:2, entries}` envelope.
 * TODO: confirm the cutover contract before shipping; if v2 must reuse
 * `cei-plan-v1`, change this constant and the reader together.
 */
export const PLAN_KEY_V2 = 'cei-plan-v2'
export const LEGACY_TERM_IDS: readonly string[] = ['t1', 't2']

export interface PlanContext {
  terms: Term[]
  gened?: Partial<Record<TermId, GenEdState>>
}

export function defaultPlanContext(storage: StorageLike | null = browserStorage()): PlanContext {
  return { terms: curatedTerms(), gened: readGenedCache(storage) }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : value == null ? '' : String(value)
}

function isRole(value: unknown): value is Role {
  return value === 'take' || value === 'ta'
}

function defaultSection(course: Course): Section | null {
  return (
    course.sections[0] ??
    (course.section
      ? {
          id: sectionId('', course.code, course.section),
          number: course.section,
          sessions: course.sessions,
        }
      : null)
  )
}

function findSection(course: Course, number: string): Section | null {
  if (!number) return defaultSection(course)
  return (
    course.sections.find((section) => section.number === number) ??
    (course.section === number
      ? {
          id: sectionId('', course.code, number),
          number,
          sessions: course.sessions,
        }
      : null)
  )
}

interface FoundCourse {
  course: Course
  section: Section
  planYear: string
}

function findCeiCourse(
  term: Term,
  code: string,
  number?: string,
  cohort?: string,
): FoundCourse | null {
  for (const year of term.years) {
    if (cohort && year.id !== cohort) continue
    for (const course of year.courses) {
      if (course.code !== code) continue
      const section = findSection(course, number ?? '')
      if (section) return { course, section, planYear: year.label }
    }
  }
  return null
}

function findGenedCourse(
  gened: GenEdState | undefined,
  code: string,
  number?: string,
): FoundCourse | null {
  if (gened?.status !== 'ready') return null
  for (const course of gened.courses) {
    if (course.code !== code) continue
    const section = findSection(course, number ?? '')
    if (section) return { course, section, planYear: 'Gen Ed' }
  }
  return null
}

function findCourse(
  term: Term,
  gened: GenEdState | undefined,
  code: string,
  number?: string,
  cohort?: string,
): FoundCourse | null {
  return findCeiCourse(term, code, number, cohort) ?? findGenedCourse(gened, code, number)
}

/**
 * Normalize a legacy v1 plan key (`code`, `code@cohort`, `code#section`) to a
 * stable section ID. Keys that cannot be resolved keep an empty section
 * number, which never resolves and is counted as unresolved.
 */
export function resolveLegacyKey(
  termId: TermId,
  rawKey: string,
  context: PlanContext,
): string {
  if (parseSectionId(rawKey)) return rawKey
  const term = context.terms.find((candidate) => candidate.id === termId)
  const gened = context.gened?.[termId]

  if (rawKey.includes('#')) {
    const index = rawKey.indexOf('#')
    const code = rawKey.slice(0, index)
    const number = rawKey.slice(index + 1)
    return sectionId(termId, code, number)
  }

  if (rawKey.includes('@')) {
    const index = rawKey.indexOf('@')
    const code = rawKey.slice(0, index)
    const cohortId = rawKey.slice(index + 1)
    const year = term?.years.find((candidate) => candidate.id === cohortId)
    const course = year?.courses.find((candidate) => candidate.code === code)
    const section = course ? defaultSection(course) : null
    return sectionId(termId, code, section?.number ?? '')
  }

  if (!term) return sectionId(termId, rawKey, '')
  const found = findCourse(term, gened, rawKey)
  return sectionId(termId, rawKey, found?.section.number ?? '')
}

interface LegacyEntry {
  term: TermId
  key: string
  role: Role
  cohort?: CohortId
}

function parseLegacyEntries(raw: unknown): LegacyEntry[] {
  if (!Array.isArray(raw)) return []
  const out: LegacyEntry[] = []
  const seen = new Set<string>()
  for (const value of raw) {
    if (!isRecord(value)) continue
    const term = value.term
    if (typeof term !== 'string' || !LEGACY_TERM_IDS.includes(term)) continue
    if (!isRole(value.role)) continue
    const rawKey = typeof value.key === 'string' ? value.key : null
    const code = typeof value.code === 'string' ? value.code : null
    if (!rawKey && !code) continue
    const candidate =
      rawKey && rawKey.length
        ? rawKey
        : (code ?? '') + (typeof value.year === 'string' ? '@' + value.year : '')
    if (!candidate) continue
    const at = candidate.indexOf('@')
    const rawCohort = at >= 0 ? candidate.slice(at + 1) : value.year
    const cohort =
      rawCohort === 'y1' || rawCohort === 'y2' || rawCohort === 'y3' || rawCohort === 'y4'
        ? (rawCohort as CohortId)
        : undefined
    const seenKey = term + ':' + candidate
    if (seen.has(seenKey)) continue
    seen.add(seenKey)
    out.push({ term, key: candidate, role: value.role, ...(cohort ? { cohort } : {}) })
  }
  return out
}

function normalizeLegacyEntries(raw: unknown, context: PlanContext): PlanEntry[] {
  const seen = new Set<string>()
  const entries: PlanEntry[] = []
  for (const legacy of parseLegacyEntries(raw)) {
    const id = resolveLegacyKey(legacy.term, legacy.key, context)
    const seenKey = legacy.term + ':' + id
    if (seen.has(seenKey)) continue
    seen.add(seenKey)
    entries.push({
      term: legacy.term,
      sectionId: id,
      role: legacy.role,
      ...(legacy.cohort ? { cohort: legacy.cohort } : {}),
    })
  }
  return entries
}

function parseV2(raw: unknown): PlanEntry[] | null {
  if (!isRecord(raw) || raw.v !== 2 || !Array.isArray(raw.entries)) return null
  const seen = new Set<string>()
  const entries: PlanEntry[] = []
  for (const value of raw.entries) {
    if (!isRecord(value)) continue
    const term = asString(value.term)
    const id = asString(value.sectionId)
    if (!term || !id || !parseSectionId(id) || !isRole(value.role)) continue
    const seenKey = term + ':' + id
    if (seen.has(seenKey)) continue
    seen.add(seenKey)
    const rawCohort = value.cohort
    const cohort =
      rawCohort === 'y1' || rawCohort === 'y2' || rawCohort === 'y3' || rawCohort === 'y4'
        ? (rawCohort as CohortId)
        : undefined
    entries.push({ term, sectionId: id, role: value.role, ...(cohort ? { cohort } : {}) })
  }
  return entries
}

function dedupe(entries: readonly PlanEntry[]): PlanEntry[] {
  const seen = new Set<string>()
  return entries.filter((entry) => {
    const key = entry.term + ':' + entry.sectionId
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * Read the planner. v2 (`cei-plan-v2`) wins when present, even when empty;
 * otherwise legacy `cei-plan-v1` entries are migrated and deduped.
 */
export function readPlan(
  storage: StorageLike | null = browserStorage(),
  context: PlanContext = defaultPlanContext(storage),
): PlanEntry[] {
  const v2 = parseV2(readStorageJson(storage, PLAN_KEY_V2))
  if (v2) return v2
  return normalizeLegacyEntries(readStorageJson(storage, PLAN_KEY), context)
}

/** Persist the v2 plan. Returns the deduped entries that were written. */
export function writePlan(
  entries: readonly PlanEntry[],
  storage: StorageLike | null = browserStorage(),
): PlanEntry[] {
  const deduped = dedupe(entries)
  writeStorageJson(storage, PLAN_KEY_V2, { v: 2, entries: deduped })
  return deduped
}

/** Legacy name retained for parity. */
export function savePlan(
  entries: readonly PlanEntry[],
  storage: StorageLike | null = browserStorage(),
): PlanEntry[] {
  return writePlan(entries, storage)
}

export function togglePlanEntry(
  entries: readonly PlanEntry[],
  term: TermId,
  id: string,
  role: Role = 'take',
): PlanEntry[] {
  const exists = entries.some((entry) => entry.term === term && entry.sectionId === id)
  return exists
    ? entries.filter((entry) => !(entry.term === term && entry.sectionId === id))
    : [...entries, { term, sectionId: id, role }]
}

export function togglePlanRole(
  entries: readonly PlanEntry[],
  term: TermId,
  id: string,
): PlanEntry[] {
  return entries.map((entry) =>
    entry.term === term && entry.sectionId === id
      ? { ...entry, role: entry.role === 'ta' ? 'take' : 'ta' }
      : entry,
  )
}

export function clearPlanTerm(entries: readonly PlanEntry[], term: TermId): PlanEntry[] {
  return entries.filter((entry) => entry.term !== term)
}

export interface ResolvedPlanEntry {
  entry: PlanEntry
  course: Course
  section: Section
  planYear: string
}

export function resolvePlanEntry(
  term: Term,
  entry: PlanEntry,
  gened?: GenEdState,
): ResolvedPlanEntry | null {
  const parsed = parseSectionId(entry.sectionId)
  if (!parsed || !parsed.number) return null
  const found = findCourse(term, gened, parsed.code, parsed.number, entry.cohort)
  if (!found) return null
  return { entry, course: found.course, section: found.section, planYear: found.planYear }
}

/**
 * Resolve plan entries for one term into renderable plan rows.
 *
 * Preserves legacy semantics: first entry per course code wins, and `ta` keeps
 * its role only when the section has a lab; TA rows expose lab sessions only.
 */
export function planCourses(
  termId: TermId,
  entries: readonly PlanEntry[],
  context: PlanContext,
): PlanCourse[] {
  const term = context.terms.find((candidate) => candidate.id === termId)
  if (!term) return []
  const gened = context.gened?.[termId]
  const out: PlanCourse[] = []
  const seenCodes = new Set<string>()
  for (const entry of entries) {
    if (entry.term !== termId) continue
    const resolved = resolvePlanEntry(term, entry, gened)
    if (!resolved) continue
    const { course, section } = resolved
    if (seenCodes.has(course.code)) continue
    seenCodes.add(course.code)
    const labSessions = section.sessions.filter(
      (session) => session.type === 'lab' || (!session.type && course.type === 'lab'),
    )
    const hasLab = labSessions.length > 0
    const isTa = entry.role === 'ta' && hasLab
    out.push({
      ...course,
      key: entry.sectionId,
      sectionId: entry.sectionId,
      section: section.number,
      planYear: resolved.planYear,
      hasLab,
      planRole: isTa ? 'TA' : 'take',
      sessions: isTa ? labSessions : section.sessions,
    })
  }
  return out
}

/**
 * Legacy showed the unresolved note only once the GenEd list had loaded; keep
 * that gate so a pending GenEd fetch never inflates the count.
 *
 * TODO: legacy compared entries against the code-deduped plan list; v2 counts
 * entries whose section identity does not resolve. A second section of the
 * same course is therefore not flagged as unresolved. Confirm at cutover.
 */
export function unresolvedPlanEntries(
  termId: TermId,
  entries: readonly PlanEntry[],
  context: PlanContext,
): PlanEntry[] {
  const gened = context.gened?.[termId]
  if (gened?.status !== 'ready') return []
  const term = context.terms.find((candidate) => candidate.id === termId)
  if (!term) return []
  return entries.filter(
    (entry) => entry.term === termId && !resolvePlanEntry(term, entry, gened),
  )
}

export function unresolvedCount(
  termId: TermId,
  entries: readonly PlanEntry[],
  context: PlanContext,
): number {
  return unresolvedPlanEntries(termId, entries, context).length
}

