import { describe, expect, it, vi } from 'vitest'
import type { FetchJsonFn, FlattenedRow } from './api'
import {
  GENED_CACHE_KEY,
  GENED_TTL,
  genedCoursesFromRows,
  genedFetchAction,
  genedUrl,
  loadGened,
  readGenedCache,
  startGenedLoad,
  writeGenedCache,
} from './gened'
import { memoryStorage } from './test-utils'
import type { GenEdState, TermConfig } from './types'

const config: TermConfig = { id: 't1', year: '2569', semester: '1', label: '1/2569' }

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

describe('genedUrl', () => {
  it('uses owner 48 and the term config', () => {
    const url = genedUrl(config)
    const params = new URLSearchParams(url.slice(url.indexOf('?') + 1))
    expect(params.get('mode')).toBe('by_subject_owner_id')
    expect(params.get('selected_subject_owner_id')).toBe('48')
    expect(params.get('selected_year')).toBe('2569')
    expect(params.get('selected_semester')).toBe('1')
  })
})

describe('genedCoursesFromRows', () => {
  it('keeps 966 subjects only and groups by subject + anchor section', () => {
    const courses = genedCoursesFromRows(
      [
        row(),
        row({ section: '1905', sec_pair: '905', lect_or_prac: 'ป', teach_day: '3' }),
        row({ subject_id: '01276111', subject_name_en: 'CIRCUITS' }),
        row({ teach_time: '00:00:00' }),
      ],
      { termId: 't1' },
    )
    expect(courses).toHaveLength(1)
    expect(courses[0]?.code).toBe('96641007')
    expect(courses[0]?.key).toBe('96641007#905')
    expect(courses[0]?.section).toBe('905')
    expect(courses[0]?.type).toBe('gened')
    expect(courses[0]?.planYear).toBe('Gen Ed')
    expect(courses[0]?.sessions).toHaveLength(2)
    expect(courses[0]?.sections[0]?.id).toBe('t1/96641007/905')
  })

  it('splits different anchors and sorts by name', () => {
    const courses = genedCoursesFromRows(
      [
        row({ subject_id: '96641009', subject_name_en: 'BETA COURSE', section: '901' }),
        row({ subject_id: '96641008', subject_name_en: 'ALPHA COURSE', section: '905' }),
      ],
      { termId: 't1' },
    )
    expect(courses.map((course) => course.name)).toEqual(['Alpha Course', 'Beta Course'])
    expect(courses.map((course) => course.key)).toEqual([
      '96641008#905',
      '96641009#901',
    ])
  })
})

describe('GenEd cache', () => {
  it('writes the legacy v1 structure with per-term savedAt', () => {
    const storage = memoryStorage()
    const [course] = genedCoursesFromRows([row()], { termId: 't1' })
    expect(course).toBeDefined()
    expect(
      writeGenedCache(storage, {
        t1: { status: 'ready', courses: course ? [course] : [], savedAt: 123 },
      }),
    ).toBe(true)
    const raw = JSON.parse(storage.getItem(GENED_CACHE_KEY) ?? 'null') as {
      v?: number
      terms?: Record<string, { savedAt?: number; courses?: unknown[] }>
    }
    expect(raw.v).toBe(1)
    expect(raw.terms?.t1?.savedAt).toBe(123)
    expect(raw.terms?.t1?.courses).toHaveLength(1)
  })

  it('preserves other terms when writing one term', () => {
    const storage = memoryStorage()
    const first = genedCoursesFromRows([row()], { termId: 't1' })[0]
    const second = genedCoursesFromRows(
      [row({ subject_id: '96641008', section: '901' })],
      { termId: 't2' },
    )[0]
    writeGenedCache(storage, {
      t1: { status: 'ready', courses: first ? [first] : [], savedAt: 1 },
    })
    writeGenedCache(storage, {
      t2: { status: 'ready', courses: second ? [second] : [], savedAt: 2 },
    })
    const restored = readGenedCache(storage)
    expect(restored.t1?.savedAt).toBe(1)
    expect(restored.t2?.savedAt).toBe(2)
  })

  it('reads legacy flat cached courses and ignores empty entries', () => {
    const storage = memoryStorage({
      [GENED_CACHE_KEY]: JSON.stringify({
        v: 1,
        terms: {
          t1: {
            savedAt: 999,
            courses: [
              {
                name: 'Legacy GenEd',
                code: '96641007',
                credits: '3(3-0-6)',
                color: 'magenta',
                type: 'gened',
                lecturers: [],
                sessions: [{ day: 'Mon', start: '13:00', end: '16:00', room: null, section: '905' }],
                exams: {},
                key: '96641007#905',
                section: '905',
                planYear: 'Gen Ed',
              },
            ],
          },
          t2: { savedAt: 1, courses: [] },
        },
      }),
    })
    const restored = readGenedCache(storage)
    expect(restored.t1?.status).toBe('ready')
    expect(restored.t1?.courses[0]?.key).toBe('96641007#905')
    expect(restored.t1?.courses[0]?.sections[0]?.number).toBe('905')
    expect(restored.t2).toBeUndefined()
  })

  it('rejects a cache with the wrong version', () => {
    const storage = memoryStorage({
      [GENED_CACHE_KEY]: JSON.stringify({ v: 2, terms: {} }),
    })
    expect(readGenedCache(storage)).toEqual({})
  })
})

describe('stale-while-revalidate', () => {
  const now = 100_000
  const ready: GenEdState = {
    status: 'ready',
    courses: [],
    savedAt: now - GENED_TTL - 1,
  }

  it('decides when to load, skip, or revalidate', () => {
    expect(genedFetchAction(undefined, now)).toBe('load')
    expect(genedFetchAction({ status: 'loading', courses: [] }, now)).toBe('skip')
    expect(genedFetchAction({ status: 'error', courses: [] }, now)).toBe('load')
    expect(genedFetchAction({ ...ready, savedAt: now - 1 }, now)).toBe('skip')
    expect(genedFetchAction(ready, now)).toBe('revalidate')
  })

  it('returns fresh cache without fetching', () => {
    const storage = memoryStorage()
    const [course] = genedCoursesFromRows([row()], { termId: 't1' })
    writeGenedCache(storage, {
      t1: { status: 'ready', courses: course ? [course] : [], savedAt: now - 1 },
    })
    const fetchJson = vi.fn()
    const result = startGenedLoad('t1', config, {
      storage,
      now: () => now,
      fetchJson: mockFetch(fetchJson),
    })
    expect(result.refresh).toBeNull()
    expect(result.state.status).toBe('ready')
    expect(fetchJson).not.toHaveBeenCalled()
  })

  it('serves stale courses while revalidating, then replaces them', async () => {
    const storage = memoryStorage()
    const [oldCourse] = genedCoursesFromRows([row()], { termId: 't1' })
    writeGenedCache(storage, {
      t1: { status: 'ready', courses: oldCourse ? [oldCourse] : [], savedAt: now - GENED_TTL - 1 },
    })
    const newCourse = genedCoursesFromRows(
      [row({ subject_id: '96641008', subject_name_en: 'NEW COURSE', section: '901' })],
      { termId: 't1' },
    )[0]
    const fetchJson = vi.fn(async () => payload(newCourse ? [row({
      subject_id: '96641008',
      subject_name_en: 'NEW COURSE',
      section: '901',
    })] : []))
    const result = startGenedLoad('t1', config, {
      storage,
      now: () => now,
      fetchJson: mockFetch(fetchJson),
    })
    expect(result.state.status).toBe('ready')
    expect(result.state.refreshing).toBe(true)
    expect(result.state.courses.map((course) => course.code)).toEqual(['96641007'])
    expect(result.refresh).not.toBeNull()
    const final = await result.refresh!
    expect(fetchJson).toHaveBeenCalledWith(genedUrl(config), { timeoutMs: 30000 })
    expect(final.status).toBe('ready')
    expect(final.refreshing).toBeUndefined()
    expect(final.savedAt).toBe(now)
    expect(final.courses.map((course) => course.code)).toEqual(['96641008'])
    expect(readGenedCache(storage).t1?.savedAt).toBe(now)
  })

  it('keeps stale courses when revalidation fails', async () => {
    const storage = memoryStorage()
    const [oldCourse] = genedCoursesFromRows([row()], { termId: 't1' })
    writeGenedCache(storage, {
      t1: { status: 'ready', courses: oldCourse ? [oldCourse] : [], savedAt: now - GENED_TTL - 1 },
    })
    const result = startGenedLoad('t1', config, {
      storage,
      now: () => now,
      fetchJson: mockFetch(async () => {
        throw new Error('offline')
      }),
    })
    expect(result.state.refreshing).toBe(true)
    const final = await result.refresh!
    expect(final.status).toBe('ready')
    expect(final.refreshing).toBe(false)
    expect(final.courses.map((course) => course.code)).toEqual(['96641007'])
  })

  it('reports error when there is no stale data', async () => {
    const storage = memoryStorage()
    const result = startGenedLoad('t1', config, {
      storage,
      now: () => now,
      fetchJson: mockFetch(async () => {
        throw new Error('offline')
      }),
    })
    expect(result.state.status).toBe('loading')
    const final = await result.refresh!
    expect(final.status).toBe('error')
    expect(final.courses).toEqual([])
    expect(final.error).toBe('offline')
  })

  it('loads through the convenience wrapper', async () => {
    const storage = memoryStorage()
    const final = await loadGened('t1', config, {
      storage,
      now: () => now,
      fetchJson: mockFetch(async () => payload([row()])),
    })
    expect(final.status).toBe('ready')
    expect(final.courses).toHaveLength(1)
  })
})
