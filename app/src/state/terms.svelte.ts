import {
  CACHE_TTL,
  curatedTerms,
  loadTerms,
  readTermCache,
} from '../domain/api'
import type { LoadTermsOptions, LoadTermsResult, TermsLoadStatus } from '../domain/api'
import type { StorageLike, Term, TermId } from '../domain/types'

export type TermsStatus = TermsLoadStatus | 'loading' | 'error'

export interface TermsStateOptions {
  /** Storage override; `undefined` keeps the browser default. */
  storage?: StorageLike | null
  /** Skip the initial load (tests render the curated snapshot). */
  auto?: boolean
  loadTerms?: (options: LoadTermsOptions) => Promise<LoadTermsResult>
  now?: () => number
}

const stampFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

/** Legacy `stamp`: `7 Nov, 14:05`-style cache/live timestamp. */
export function stampTime(ms: number): string {
  return stampFormat.format(new Date(ms))
}

/**
 * Cache-first terms store. Renders the cached (or curated) snapshot
 * synchronously, then swaps in the result of `loadTerms`.
 */
export class TermsState {
  terms = $state<Term[]>([])
  status = $state<TermsStatus>('loading')
  savedAt = $state(0)
  updatedAt = $state(0)
  loading = $state(false)
  error = $state<string | null>(null)

  #storage: StorageLike | null | undefined
  #now: () => number
  #load: (options: LoadTermsOptions) => Promise<LoadTermsResult>

  constructor(options: TermsStateOptions = {}) {
    this.#storage = options.storage
    this.#now = options.now ?? (() => Date.now())
    this.#load = options.loadTerms ?? loadTerms

    const cache = readTermCache(this.#storage)
    this.terms = cache ? cache.terms : curatedTerms()
    this.savedAt = cache?.savedAt ?? 0
    this.status = cache ? 'fresh-cache' : 'loading'

    if (options.auto !== false) void this.refresh()
  }

  get statusText(): string {
    switch (this.status) {
      case 'fresh-cache':
        return `Live · saved ${stampTime(this.savedAt)}`
      case 'live':
        return `Live · updated ${stampTime(this.updatedAt || this.savedAt)}`
      case 'partial':
        return `Live · partial update ${stampTime(this.updatedAt || this.savedAt)}`
      case 'offline-cache':
        return `Saved copy · ${stampTime(this.savedAt)}`
      case 'offline-snapshot':
        return 'Offline snapshot · KMITL unavailable'
      case 'error':
        return 'Offline snapshot · KMITL unavailable'
      case 'loading':
        if (!this.savedAt) return 'Loading live schedule…'
        return this.#now() - this.savedAt < CACHE_TTL
          ? `Live · saved ${stampTime(this.savedAt)}`
          : 'Checking for updates…'
    }
  }

  termById(id: TermId): Term | undefined {
    return this.terms.find((term) => term.id === id)
  }

  async refresh(): Promise<void> {
    if (this.loading) return
    this.loading = true
    this.error = null
    this.status = 'loading'
    try {
      const result = await this.#load({ storage: this.#storage, now: this.#now })
      this.terms = result.terms
      this.savedAt = result.savedAt
      if (result.status === 'live' || result.status === 'partial') {
        this.updatedAt = this.#now()
      }
      this.status = result.status
    } catch (cause) {
      this.error = cause instanceof Error ? cause.message : String(cause)
      this.status = 'error'
    } finally {
      this.loading = false
    }
  }
}

export function createTermsState(options: TermsStateOptions = {}): TermsState {
  return new TermsState(options)
}
