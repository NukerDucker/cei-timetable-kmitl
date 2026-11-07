import { describe, expect, it, vi } from 'vitest'
import { curatedTerms, writeTermCache } from '../domain/api'
import { memoryStorage } from '../domain/test-utils'
import { createTermsState, stampTime } from './terms.svelte'

describe('TermsState', () => {
  it('renders the cached snapshot immediately', () => {
    const storage = memoryStorage()
    writeTermCache(curatedTerms(), storage, 1_700_000_000_000)
    const state = createTermsState({ auto: false, storage })

    expect(state.terms.length).toBeGreaterThan(0)
    expect(state.savedAt).toBe(1_700_000_000_000)
    expect(state.statusText).toBe(`Live · saved ${stampTime(1_700_000_000_000)}`)
  })

  it('swaps in the loaded terms and reports the live timestamp', async () => {
    const storage = memoryStorage()
    const terms = curatedTerms()
    const loadTerms = vi.fn(async () => ({
      terms,
      status: 'live' as const,
      savedAt: 1_700_000_000_000,
      updated: 2,
    }))
    const state = createTermsState({
      auto: false,
      storage,
      loadTerms,
      now: () => 1_700_000_060_000,
    })

    await state.refresh()

    expect(loadTerms).toHaveBeenCalledTimes(1)
    expect(state.terms).toEqual(terms)
    expect(state.status).toBe('live')
    expect(state.loading).toBe(false)
    expect(state.statusText).toBe(`Live · updated ${stampTime(1_700_000_060_000)}`)
  })

  it('surfaces load failures as the offline snapshot', async () => {
    const state = createTermsState({
      auto: false,
      storage: memoryStorage(),
      loadTerms: async () => {
        throw new Error('network down')
      },
    })

    await state.refresh()

    expect(state.status).toBe('error')
    expect(state.error).toBe('network down')
    expect(state.statusText).toBe('Offline snapshot · KMITL unavailable')
  })
})
