import { describe, expect, it } from 'vitest'
import {
  categoryColorToken,
  categoryLabel,
  courseCategory,
  courseCategoryColorToken,
  courseCategoryLabel,
  courseColorToken,
  courseShade,
} from './categories'
import { makeCourse } from './test-utils'

describe('category mapping', () => {
  it('maps gened courses to gened', () => {
    const course = makeCourse({ type: 'gened' })
    expect(courseCategory(course)).toBe('gened')
    expect(courseCategoryLabel(course)).toBe('Gen Ed')
    expect(courseCategoryColorToken(course)).toBe('cat-gened')
  })

  it('maps elective courses to elective', () => {
    const course = makeCourse({ type: 'elective' })
    expect(courseCategory(course)).toBe('elective')
    expect(categoryLabel('elective')).toBe('Elective')
    expect(categoryColorToken('elective')).toBe('cat-elective')
  })

  it('maps lecture and lab courses to core (labs inherit)', () => {
    expect(courseCategory(makeCourse({ type: 'lecture' }))).toBe('core')
    expect(courseCategory(makeCourse({ type: 'lab' }))).toBe('core')
    expect(categoryLabel('core')).toBe('Core')
    expect(categoryColorToken('core')).toBe('cat-core')
  })

  it('keeps deterministic category shades by code hash', () => {
    expect(courseShade({ code: '01006001' })).toBe(0)
    expect(courseShade({ code: '01006002' })).toBe(1)
    expect(courseShade({ code: 'GEN101' })).toBe(2)
    expect(courseColorToken({ code: '01006002', type: 'lecture' })).toBe('cat-core-2')
    expect(courseColorToken({ code: 'GEN101', type: 'gened' })).toBe('cat-gened-3')
  })
})
