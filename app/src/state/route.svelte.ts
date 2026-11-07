import { TERM_CONFIG } from '../domain/api'
import type { CohortId, TermConfig, TermId } from '../domain/types'

export const ROUTE_VIEWS = ['week', 'courses', 'exams', 'plan'] as const
export type RouteView = (typeof ROUTE_VIEWS)[number]

export interface Route {
  term: TermId
  cohort: CohortId
  view: RouteView
}

export const DEFAULT_ROUTE: Route = { term: 't1', cohort: 'y1', view: 'week' }

export interface TermTab {
  id: TermId
  key: string
  label: string
}

export interface CohortTab {
  id: CohortId
  label: string
}

export const COHORT_LABELS: Record<CohortId, string> = {
  y1: '1st Year',
  y2: '2nd Year',
  y3: '3rd Year',
  y4: '4th Year',
}

export const COHORT_TABS: readonly CohortTab[] = (['y1', 'y2', 'y3', 'y4'] as const).map((id) => ({
  id,
  label: COHORT_LABELS[id],
}))

/** Hash term key (`2569-1`) derived from the domain config. */
export function termKey(config: TermConfig): string {
  return `${config.year}-${config.semester}`
}

export const TERM_TABS: readonly TermTab[] = TERM_CONFIG.map((config) => ({
  id: config.id,
  key: termKey(config),
  label: config.label,
}))

export function termConfigForKey(key: string): TermConfig | null {
  return TERM_CONFIG.find((config) => termKey(config) === key) ?? null
}

export function termConfigById(id: TermId): TermConfig | null {
  return TERM_CONFIG.find((config) => config.id === id) ?? null
}

export function routeHash(route: Route): string {
  const config = termConfigById(route.term) ?? TERM_CONFIG[0]
  const key = config ? termKey(config) : '2569-1'
  return `#/${key}/${route.cohort}/${route.view}`
}

function isRouteView(value: string): value is RouteView {
  return (ROUTE_VIEWS as readonly string[]).includes(value)
}

function isCohortId(value: string): value is CohortId {
  return value === 'y1' || value === 'y2' || value === 'y3' || value === 'y4'
}

/**
 * Parse `#/2569-1/y3/plan`. Any malformed or unknown segment falls back to
 * the default `2569-1/y1/week` route (ADR 0004).
 */
export function parseRoute(hash: string): Route {
  const clean = hash.trim().replace(/^#/, '').replace(/^\/+|\/+$/g, '')
  if (!clean) return { ...DEFAULT_ROUTE }

  const segments = clean.split('/')
  if (segments.length !== 3) return { ...DEFAULT_ROUTE }

  const [termKeySegment = '', cohortSegment = '', viewSegment = ''] = segments
  const config = termConfigForKey(termKeySegment)
  if (!config || !isCohortId(cohortSegment) || !isRouteView(viewSegment)) {
    return { ...DEFAULT_ROUTE }
  }

  return { term: config.id, cohort: cohortSegment, view: viewSegment }
}

type Listener = () => void

/**
 * Rune-backed route store. The hash is the single source of truth: tab
 * changes replace the current history entry, and popstate restores it.
 */
export class RouteState {
  current = $state<Route>({ ...DEFAULT_ROUTE })
  #window: Window | null
  #listener: Listener | null = null

  constructor(win: Window | null = typeof window === 'undefined' ? null : window) {
    this.#window = win
    if (!win) return
    this.current = parseRoute(win.location.hash)
    this.#listener = () => {
      this.current = parseRoute(win.location.hash)
    }
    win.addEventListener('popstate', this.#listener)
  }

  set(patch: Partial<Route>): void {
    const next: Route = { ...this.current, ...patch }
    this.current = next
    this.#window?.history.replaceState(null, '', routeHash(next))
  }

  dispose(): void {
    if (this.#window && this.#listener) {
      this.#window.removeEventListener('popstate', this.#listener)
    }
    this.#listener = null
  }
}
