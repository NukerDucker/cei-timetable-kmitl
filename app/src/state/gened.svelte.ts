import { TERM_CONFIG } from '../domain/api'
import type { FetchJsonFn } from '../domain/api'
import { genedFetchAction, readGenedCache, startGenedLoad } from '../domain/gened'
import type { GenedCache } from '../domain/gened'
import { browserStorage } from '../domain/storage'
import type { GenEdCourse, GenEdState, StorageLike, TermId } from '../domain/types'
import { stampTime } from './terms.svelte'

export interface GenedStateOptions {
  /** Storage override; `undefined` keeps the browser default. */
  storage?: StorageLike | null
  now?: () => number
  fetchJson?: FetchJsonFn
  /** Test seam: start from these per-term states without reading storage. */
  initial?: GenedCache
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

/**
 * Lazy GenEd loader shared by the Plan view.
 *
 * - `ensure` is safe to call from hover/focus/open handlers: a request that is
 *   already in flight is reused, and fresh cache is never refetched.
 * - Stale cache stays visible while it revalidates.
 * - Failures surface as `error` state with a retry path.
 */
export class GenedStateStore {
  states = $state<GenedCache>({})

  #storage: StorageLike | null
  #now: () => number
  #fetchJson: FetchJsonFn | undefined
  #inflight = new Map<TermId, Promise<void>>()

  constructor(options: GenedStateOptions = {}) {
    this.#storage = options.storage === undefined ? browserStorage() : options.storage
    this.#now = options.now ?? (() => Date.now())
    this.#fetchJson = options.fetchJson
    this.states = options.initial ?? readGenedCache(this.#storage)
  }

  stateFor(term: TermId): GenEdState | undefined {
    return this.states[term]
  }

  coursesFor(term: TermId): GenEdCourse[] {
    const state = this.states[term]
    return state?.status === 'ready' ? state.courses : []
  }

  isLoading(term: TermId): boolean {
    return this.#inflight.has(term) || this.states[term]?.status === 'loading'
  }

  hasError(term: TermId): boolean {
    const state = this.states[term]
    return state?.status === 'error' || (state?.status === 'ready' && Boolean(state.error))
  }

  statusText(term: TermId): string {
    const state = this.states[term]
    if (!state || state.status === 'idle') return 'Gen Ed courses load with the plan.'
    if (state.status === 'loading') return 'Loading Gen Ed courses…'
    if (state.status === 'error') return 'Gen Ed courses unavailable.'
    if (state.error) {
      return `Gen Ed · ${state.courses.length} courses · refresh failed, showing saved data`
    }
    if (state.refreshing) {
      return `Gen Ed · ${state.courses.length} courses · refreshing…`
    }
    if (state.savedAt) {
      return `Gen Ed · ${state.courses.length} courses · saved ${stampTime(state.savedAt)}`
    }
    return `Gen Ed · ${state.courses.length} courses`
  }

  /** Load (or revalidate) one term. Repeated calls while in flight share it. */
  ensure(term: TermId): Promise<void> {
    const existing = this.#inflight.get(term)
    if (existing) return existing

    const config = TERM_CONFIG.find((candidate) => candidate.id === term)
    if (!config) return Promise.resolve()

    const previous = this.states[term]
    if (genedFetchAction(previous, this.#now()) === 'skip') return Promise.resolve()

    const result = startGenedLoad(term, config, {
      storage: this.#storage,
      now: this.#now,
      ...(this.#fetchJson ? { fetchJson: this.#fetchJson } : {}),
      ...(previous ? { previous } : {}),
    })
    this.#set(term, result.state)

    if (!result.refresh) return Promise.resolve()

    const task = result.refresh
      .then((next) => {
        this.#set(term, next)
      })
      .catch((error: unknown) => {
        this.#set(term, { status: 'error', courses: [], error: errorMessage(error) })
      })
      .finally(() => {
        this.#inflight.delete(term)
      })

    this.#inflight.set(term, task)
    return task
  }

  /** Force a refresh after an error (or an explicit user retry). */
  retry(term: TermId): Promise<void> {
    const state = this.states[term]
    if (state?.status === 'ready') {
      const next: GenEdState = { ...state, savedAt: 0, refreshing: false }
      delete next.error
      this.#set(term, next)
    }
    return this.ensure(term)
  }

  #set(term: TermId, state: GenEdState): void {
    this.states = { ...this.states, [term]: state }
  }
}

export function createGenedState(options: GenedStateOptions = {}): GenedStateStore {
  return new GenedStateStore(options)
}
