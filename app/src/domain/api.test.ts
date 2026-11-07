import { describe, expect, it } from 'vitest'
import {
  CACHE_KEY,
  curatedTerms,
  flattenRows,
  loadTerms,
  readTermCache,
  schedulable,
  sessionsFromRows,
  writeTermCache,
} from './api'
import type { ApiRow, FlattenedRow } from './api'
import { memoryStorage } from './test-utils'

function row(overrides: Partial<ApiRow> = {}): ApiRow {
  return {
    teach_table_id: 'tt-1',
    subject_id: '01276111',
    subject_name_en: 'CIRCUITS & ELECTRONICS',
    section: '905',
    sec_pair: '1905',
    teach_day: '2',
    teach_time: '09:00:00',
    teach_time2: '12:00:00',
    teachtime_str: '',
    room_name: 'ECC-608',
    lect_or_prac: '',
    teacher_list_en: '<div>Mr. Amnach Khawne</div>',
    credit_str: '4(3-3-8)',
    closed: '0',
    ...overrides,
  }
}

function payload(rows: ApiRow[], overrides: Record<string, unknown> = {}): unknown {
  return [{ curriculum2_id: '127', class: '1', teachtable: [{ data: rows }], ...overrides }]
}

describe('flattenRows', () => {
  it('keeps open CEI rows, adds classYear, and dedupes', () => {
    const rows = flattenRows(
      payload([
        row(),
        row({ teach_table_id: 'tt-1' }),
        row({ teach_table_id: 'tt-2', closed: '1' }),
      ]),
      true,
    )
    expect(rows).toHaveLength(1)
    expect(rows[0]?.classYear).toBe('1')
  })

  it('drops non-127 programs when onlyCei is set', () => {
    const rows = flattenRows(payload([row()], { curriculum2_id: '999' }), true)
    expect(rows).toEqual([])
    expect(flattenRows(payload([row()], { curriculum2_id: '999' }), false)).toHaveLength(1)
  })

  it('returns an empty list for malformed payloads', () => {
    expect(flattenRows(null, true)).toEqual([])
    expect(flattenRows({}, true)).toEqual([])
  })
})

describe('schedulable and session building', () => {
  it('requires weekday 2..7 and non-zero times', () => {
    expect(schedulable(row())).toBe(true)
    expect(schedulable(row({ teach_day: '1' }))).toBe(false)
    expect(schedulable(row({ teach_day: '8' }))).toBe(false)
    expect(schedulable(row({ teach_time: '00:00:00' }))).toBe(false)
    expect(schedulable(row({ teach_time2: '00:00:00' }))).toBe(false)
  })

  it('builds, dedupes, and merges contiguous sessions', () => {
    const flat = flattenRows(
      payload([
        row({ teach_time: '09:00:00', teach_time2: '10:00:00' }),
        row({ teach_time: '10:15:00', teach_time2: '12:00:00', teach_table_id: 'tt-2' }),
        row({ teach_table_id: 'tt-3', teach_day: '1' }),
      ]),
      true,
    )
    const sessions = sessionsFromRows(flat)
    expect(sessions).toHaveLength(1)
    expect(sessions[0]).toMatchObject({
      day: 'Mon',
      start: '09:00',
      end: '12:00',
      room: 'ECC-608',
      section: '905',
    })
  })

  it('marks lab rows and parses extra meetings', () => {
    const flat: FlattenedRow[] = [
      { ...row({ lect_or_prac: 'ป', teachtime_str: '3x13:00-16:00' }), classYear: '1' },
    ]
    const sessions = sessionsFromRows(flat)
    expect(sessions.map((session) => `${session.day}:${session.type ?? 'lecture'}`)).toEqual([
      'Mon:lab',
      'Tue:lab',
    ])
  })
})

describe('term cache', () => {
  it('normalizes legacy flat cached courses', () => {
    const storage = memoryStorage({
      [CACHE_KEY]: JSON.stringify({
        v: 3,
        savedAt: 10,
        terms: [
          {
            id: 't1',
            label: '1/2569',
            years: [
              {
                id: 'y1',
                label: '1st Year',
                notes: [],
                courses: [
                  {
                    name: 'Legacy Circuits',
                    code: '01276111',
                    credits: '4(3-3-8)',
                    color: 'red',
                    type: 'lecture',
                    lecturers: [],
                    sessions: [
                      { day: 'Mon', start: '09:00', end: '12:00', room: 'ECC-608', section: '905' },
                    ],
                    exams: {},
                  },
                ],
              },
            ],
          },
          { id: 't2', label: '2/2569', years: [] },
        ],
      }),
    })
    const cached = readTermCache(storage)
    expect(cached?.savedAt).toBe(10)
    expect(cached?.terms[0]?.years[0]?.courses[0]?.sections[0]?.id).toBe('t1/01276111/905')
  })

  it('rejects caches with the wrong term count', () => {
    const storage = memoryStorage({ [CACHE_KEY]: JSON.stringify({ v: 3, terms: [] }) })
    expect(readTermCache(storage)).toBeNull()
  })

  it('serves a fresh cache without fetching', async () => {
    const now = 1_000_000
    const storage = memoryStorage()
    writeTermCache(curatedTerms(), storage, now - 1)
    let called = false
    const result = await loadTerms({
      storage,
      now: () => now,
      fetchJson: async () => {
        called = true
        throw new Error('should not fetch')
      },
    })
    expect(called).toBe(false)
    expect(result.status).toBe('fresh-cache')
    expect(result.terms).toHaveLength(2)
  })

  it('falls back to the curated snapshot when offline', async () => {
    const result = await loadTerms({
      storage: memoryStorage(),
      now: () => 1_000_000,
      fetchJson: async () => {
        throw new Error('offline')
      },
    })
    expect(result.status).toBe('offline-snapshot')
    expect(result.updated).toBe(0)
    expect(result.terms).toHaveLength(2)
    expect(result.terms[0]?.years[0]?.courses.length).toBeGreaterThan(0)
  })
})
