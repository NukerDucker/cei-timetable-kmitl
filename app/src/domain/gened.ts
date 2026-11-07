import {
  API_PATH,
  fetchJson,
  flattenRows,
  makeCourse,
  normalizeStoredCourse,
  schedulable,
} from './api'
import type { FetchJsonFn, FlattenedRow } from './api'
import { browserStorage, readStorageJson, writeStorageJson } from './storage'
import type { GenEdCourse, GenEdState, StorageLike, TermConfig, TermId } from './types'

export const GENED_CACHE_KEY = 'cei-gened-cache-v2'
export const GENED_TTL = 6 * 60 * 60 * 1000
export const GENED_TERM_IDS: readonly TermId[] = ['t1', 't2']
export const GENED_OWNER_ID = '48'

function asString(value: unknown): string {
  return typeof value === 'string' ? value : value == null ? '' : String(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function genedUrl(config: TermConfig): string {
  const params = new URLSearchParams({
    function: 'get-teach-table-show',
    level_id: '1',
    mode: 'by_subject_owner_id',
    selected_year: config.year,
    selected_semester: config.semester,
    selected_faculty: '01',
    search_all_faculty: 'false',
    selected_subject_owner_id: GENED_OWNER_ID,
    search_all_department: 'true',
    search_all_curriculum: 'true',
    search_all_branch: 'true',
    search_all_class_year: 'true',
  })
  return API_PATH + '?' + params.toString()
}

export interface GenedRowsContext {
  termId: TermId
}

/**
 * Group GenEd rows by subject + anchor section (`code#section`), keeping only
 * 966 subjects. Each group becomes one picker entry.
 */
export function genedCoursesFromRows(
  rows: readonly FlattenedRow[],
  context: GenedRowsContext,
): GenEdCourse[] {
  const groups = new Map<string, FlattenedRow[]>()
  for (const row of rows) {
    const subject = asString(row.subject_id)
    if (!subject.startsWith('966')) continue
    if (!schedulable(row)) continue
    const section = asString(row.section)
    const pair = row.sec_pair
      ? [section, asString(row.sec_pair)].sort(
          (a, b) => Number(a) - Number(b) || a.localeCompare(b),
        )
      : [section]
    const anchor = pair[0]
    if (!anchor) continue
    const key = `${subject}#${anchor}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)?.push(row)
  }
  return [...groups.entries()]
    .map(([key, groupRows]) => {
      const code = asString(groupRows[0]?.subject_id)
      const anchor = key.slice(key.indexOf('#') + 1)
      const course = makeCourse(code, groupRows, null, {
        termId: context.termId,
        sectionNumber: anchor,
      })
      if (!course.sessions.length) return null
      return {
        ...course,
        key,
        section: anchor,
        type: 'gened' as const,
        planYear: 'Gen Ed' as const,
      }
    })
    .filter((course): course is GenEdCourse => course !== null)
    .sort((a, b) => a.name.localeCompare(b.name))
}

function normalizeGenedCourse(value: unknown, termId: TermId): GenEdCourse | null {
  const course = normalizeStoredCourse(value, termId)
  if (!course || !isRecord(value)) return null
  const rawSection = asString(value.section)
  const rawKey = asString(value.key)
  const keySection = rawKey.includes('#') ? rawKey.slice(rawKey.indexOf('#') + 1) : ''
  const section =
    rawSection ||
    keySection ||
    course.section ||
    course.sections[0]?.number ||
    ''
  if (!section) return null
  return {
    ...course,
    key: rawKey && rawKey.startsWith(course.code + '#') ? rawKey : `${course.code}#${section}`,
    section,
    type: 'gened',
    planYear: 'Gen Ed',
  }
}

export type GenedCache = Partial<Record<TermId, GenEdState>>

/** Read the per-term ready states from `cei-gened-cache-v2`. */
export function readGenedCache(storage: StorageLike | null = browserStorage()): GenedCache {
  const raw = readStorageJson(storage, GENED_CACHE_KEY)
  if (!isRecord(raw) || raw.v !== 1 || !isRecord(raw.terms)) return {}
  const out: GenedCache = {}
  for (const termId of GENED_TERM_IDS) {
    const entry = raw.terms[termId]
    if (!isRecord(entry) || !Array.isArray(entry.courses) || !entry.courses.length) continue
    const courses = entry.courses
      .map((course) => normalizeGenedCourse(course, termId))
      .filter((course): course is GenEdCourse => course !== null)
    if (!courses.length) continue
    out[termId] = {
      status: 'ready',
      courses,
      savedAt: typeof entry.savedAt === 'number' ? entry.savedAt : 0,
    }
  }
  return out
}

/** Write ready states, preserving other terms already in the cache. */
export function writeGenedCache(
  storage: StorageLike | null = browserStorage(),
  states: GenedCache = {},
): boolean {
  const raw = readStorageJson(storage, GENED_CACHE_KEY)
  const terms: Record<string, unknown> =
    isRecord(raw) && isRecord(raw.terms) ? { ...raw.terms } : {}
  for (const [termId, state] of Object.entries(states)) {
    if (!state || state.status !== 'ready' || !state.savedAt) continue
    terms[termId] = { savedAt: state.savedAt, courses: state.courses }
  }
  if (!Object.keys(terms).length) return false
  return writeStorageJson(storage, GENED_CACHE_KEY, { v: 1, terms })
}

export type GenedFetchAction = 'skip' | 'revalidate' | 'load'

/**
 * Stale-while-revalidate decision:
 * - loading, or a ready entry still inside the TTL, skips;
 * - a ready stale entry revalidates while keeping its courses visible;
 * - everything else loads from idle/error.
 */
export function genedFetchAction(
  state: GenEdState | undefined,
  now: number,
  ttl = GENED_TTL,
): GenedFetchAction {
  if (state?.status === 'loading') return 'skip'
  if (state?.status === 'ready' && (state.refreshing || (state.savedAt && now - state.savedAt < ttl))) {
    return 'skip'
  }
  if (state?.status === 'ready') return 'revalidate'
  return 'load'
}

export interface GenedDeps {
  fetchJson?: FetchJsonFn
  storage?: StorageLike | null
  now?: () => number
}

export interface GenedLoadOptions extends GenedDeps {
  previous?: GenEdState
}

export interface GenedLoadResult {
  state: GenEdState
  /** Completes with the post-fetch state; null when no fetch was needed. */
  refresh: Promise<GenEdState> | null
}

async function fetchGened(
  termId: TermId,
  config: TermConfig,
  previous: GenEdState,
  deps: GenedDeps,
): Promise<GenEdState> {
  const storage = deps.storage === undefined ? browserStorage() : deps.storage
  const now = deps.now ?? (() => Date.now())
  const request = deps.fetchJson ?? fetchJson
  const hadData = previous.status === 'ready' && previous.courses.length > 0
  try {
    const payload = await request(genedUrl(config), { timeoutMs: 30000 })
    const courses = genedCoursesFromRows(flattenRows(payload, false), { termId })
    const next: GenEdState = { status: 'ready', courses, savedAt: now() }
    writeGenedCache(storage, { [termId]: next })
    return next
  } catch (error) {
    if (hadData) return { ...previous, refreshing: false }
    return {
      status: 'error',
      courses: [],
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Start a GenEd load. Returns the visible state immediately (stale courses
 * stay visible while `refresh` runs) and the background refresh promise.
 */
export function startGenedLoad(
  termId: TermId,
  config: TermConfig,
  options: GenedLoadOptions = {},
): GenedLoadResult {
  const storage = options.storage === undefined ? browserStorage() : options.storage
  const now = options.now ?? (() => Date.now())
  const cached = options.previous ?? readGenedCache(storage)[termId] ?? { status: 'idle', courses: [] }
  const action = genedFetchAction(cached, now())

  if (action === 'skip') return { state: cached, refresh: null }

  const visible: GenEdState =
    action === 'revalidate'
      ? { ...cached, refreshing: true }
      : { status: 'loading', courses: [] }

  const refresh = fetchGened(termId, config, cached, {
    ...options,
    storage,
    now,
  })
  return { state: visible, refresh }
}

/** Convenience: wait for the refresh (or return the visible state when fresh). */
export async function loadGened(
  termId: TermId,
  config: TermConfig,
  options: GenedLoadOptions = {},
): Promise<GenEdState> {
  const result = startGenedLoad(termId, config, options)
  return result.refresh ? result.refresh : result.state
}

/** Helper for consumers that only need the flat course list. */
export function genedCourseList(state: GenEdState | undefined): GenEdCourse[] {
  return state?.status === 'ready' ? state.courses : []
}
