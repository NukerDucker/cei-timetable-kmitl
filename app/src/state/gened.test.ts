import { describe, expect, it, vi } from 'vitest'
import type { FetchJsonFn, FlattenedRow } from '../domain/api'
import { GENED_TTL } from '../domain/gened'
import type { GenEdState } from '../domain/types'
import { memoryStorage } from '../domain/test-utils'
import { createGenedState } from './gened.svelte'

function row(overrides: Partial<FlattenedRow> = {}): FlattenedRow {
  return {
    subject_id: '96641007',
    subject_name_en: 'DIGITAL CITIZEN',
    section: '905',
    sec_pair: null,
    teach_day: '2',
    teach_time: '13:00:00',
    teach_time2: '16:00:00',
    teachtime_str: '',
    room_name: 'E12-504',
    lect_or_prac: '',
    teacher_list_en: 'Ms. Example',
    credit_str: '3(3-0-6)',
    closed: '0',
    classYear: '1',
    ...overrides,
  }
}

function payload(rows: FlattenedRow[]): unknown {
  return [{ curriculum2_id: '127', class: '1', teachtable: [{ data: rows }] }]
}

function mockFetch(impl: (url: string) => Promise<unknown>): FetchJsonFn {
  return impl as unknown as FetchJsonFn
}

describe('GenedStateStore', () => {
  it('skips the request when the cached term is fresh', async () => {
    const now = 1_000
    const fetchJson = vi.fn()
    const store = createGenedState({
      storage: memoryStorage(),
      now: () => now,
      fetchJson: mockFetch(fetchJson),
      initial: {
        t1: { status: 'ready', courses: [], savedAt: now - 1 },
      },
    })

    await store.ensure('t1')

    expect(fetchJson).not.toHaveBeenCalled()
    expect(store.stateFor('t1')?.status).toBe('ready')
  })

  it('shares an in-flight request and reports loading', async () => {
    let resolveFetch: (value: unknown) => void = () => {
      throw new Error('fetch has not started')
    }
    const fetchJson = vi.fn(
      () =>
        new Promise<unknown>((resolve) => {
          resolveFetch = resolve
        }),
    )
    const store = createGenedState({
      storage: memoryStorage(),
      now: () => 1_000_000,
      fetchJson: mockFetch(fetchJson),
    })

    const first = store.ensure('t1')
    const second = store.ensure('t1')
    expect(fetchJson).toHaveBeenCalledTimes(1)
    expect(store.statusText('t1')).toBe('Loading Gen Ed courses…')

    resolveFetch(payload([row()]))
    await Promise.all([first, second])

    expect(store.stateFor('t1')?.status).toBe('ready')
    expect(store.coursesFor('t1')).toHaveLength(1)
    expect(store.statusText('t1')).toContain('Gen Ed · 1 courses')
  })

  it('keeps stale courses visible while revalidating', async () => {
    const now = 100_000
    const stale: GenEdState = {
      status: 'ready',
      courses: [],
      savedAt: now - GENED_TTL - 1,
    }
    let resolveFetch: (value: unknown) => void = () => {
      throw new Error('fetch has not started')
    }
    const fetchJson = vi.fn(
      () =>
        new Promise<unknown>((resolve) => {
          resolveFetch = resolve
        }),
    )
    const store = createGenedState({
      storage: memoryStorage(),
      now: () => now,
      fetchJson: mockFetch(fetchJson),
      initial: { t1: stale },
    })

    const task = store.ensure('t1')
    expect(store.stateFor('t1')?.status).toBe('ready')
    expect(store.stateFor('t1')?.refreshing).toBe(true)
    expect(store.statusText('t1')).toContain('refreshing')

    resolveFetch(
      payload([row({ subject_id: '96641008', subject_name_en: 'NEW COURSE', section: '901' })]),
    )
    await task

    expect(store.stateFor('t1')?.refreshing).toBeUndefined()
    expect(store.coursesFor('t1').map((course) => course.code)).toEqual(['96641008'])
  })

  it('surfaces failures and retries them', async () => {
    const fetchJson = vi
      .fn()
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce(payload([row()]))
    const store = createGenedState({
      storage: memoryStorage(),
      now: () => 1_000_000,
      fetchJson: mockFetch(fetchJson),
    })

    await store.ensure('t1')
    expect(store.hasError('t1')).toBe(true)
    expect(store.statusText('t1')).toBe('Gen Ed courses unavailable.')
    expect(fetchJson).toHaveBeenCalledTimes(1)

    await store.retry('t1')
    expect(store.hasError('t1')).toBe(false)
    expect(store.coursesFor('t1')).toHaveLength(1)
    expect(fetchJson).toHaveBeenCalledTimes(2)
  })
})
