import { describe, expect, it } from 'vitest'
import { examTime, examTimesOverlap, parseExamRange } from './exams'

describe('examTime', () => {
  it('prefers per-kind timing over the legacy shared time', () => {
    const exam = { mid: '2026-10-01', time: '09:00–12:00', midTime: '13:00–16:00' }
    expect(examTime(exam, 'mid')).toBe('13:00–16:00')
    expect(examTime(exam, 'final')).toBe('09:00–12:00')
  })

  it('falls back to legacy time when the per-kind field is missing', () => {
    expect(examTime({ time: '09:00–12:00' }, 'mid')).toBe('09:00–12:00')
  })

  it('treats explicit null as newly known unknown', () => {
    expect(examTime({ time: '09:00–12:00', midTime: null }, 'mid')).toBeUndefined()
  })
})

describe('parseExamRange', () => {
  it('parses both dash styles and 24:00 as an end', () => {
    expect(parseExamRange('09:00–12:00')).toEqual({ start: 540, end: 720 })
    expect(parseExamRange('09:00-12:00')).toEqual({ start: 540, end: 720 })
    expect(parseExamRange('22:00–24:00')).toEqual({ start: 1320, end: 1440 })
  })

  it('rejects malformed or backwards ranges', () => {
    expect(parseExamRange('9:00–12:00')).toBeNull()
    expect(parseExamRange('12:00–09:00')).toBeNull()
    expect(parseExamRange('09:00')).toBeNull()
  })
})

describe('examTimesOverlap', () => {
  it('detects overlapping, equal, and disjoint ranges per kind', () => {
    const a = { midTime: '09:00–12:00' }
    expect(examTimesOverlap(a, { midTime: '11:00–14:00' }, 'mid')).toBe(true)
    expect(examTimesOverlap(a, { midTime: '09:00–12:00' }, 'mid')).toBe(true)
    expect(examTimesOverlap(a, { midTime: '13:00–16:00' }, 'mid')).toBe(false)
    expect(examTimesOverlap(a, { midTime: '12:00–15:00' }, 'mid')).toBe(false)
  })

  it('uses different per-kind times independently', () => {
    const a = { midTime: '09:00–12:00', finalTime: '13:00–16:00' }
    const b = { midTime: '13:00–16:00', finalTime: '13:30–16:30' }
    expect(examTimesOverlap(a, b, 'mid')).toBe(false)
    expect(examTimesOverlap(a, b, 'final')).toBe(true)
  })

  it('stays conservative when timing is unknown or malformed', () => {
    expect(examTimesOverlap({}, {}, 'mid')).toBe(true)
    expect(examTimesOverlap({ midTime: 'bad' }, { midTime: '09:00–12:00' }, 'mid')).toBe(true)
    expect(examTimesOverlap({ time: '09:00–12:00' }, {}, 'mid')).toBe(true)
  })
})
