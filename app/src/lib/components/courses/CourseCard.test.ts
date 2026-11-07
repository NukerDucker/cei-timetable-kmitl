import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import { makeCourse } from '../../../domain/test-utils'
import CourseCard from './CourseCard.svelte'

describe('CourseCard', () => {
  it.each([
    ['core', 'lecture'],
    ['elective', 'elective'],
    ['gened', 'gened'],
  ] as const)('marks the dot as %s for %s courses', (category, type) => {
    const { container } = render(CourseCard, {
      props: { course: makeCourse({ type, name: 'Category Course' }) },
    })
    expect(container.querySelector('.cc-dot')?.getAttribute('data-category')).toBe(category)
  })

  it('lists sessions and the exam line', () => {
    const course = makeCourse({
      name: 'Signals',
      code: '01276001',
      credits: '3(3-0-6)',
      lecturers: ['Ada Lovelace'],
      sessions: [
        { day: 'Mon', start: '09:00', end: '12:00', room: 'ECC-101', section: '901' },
        { day: 'Wed', start: '13:00', end: '15:00', room: 'ECC-202', section: '901', type: 'lab' },
      ],
      exams: { mid: '2026-02-10', midRoom: 'EX-1', final: '2026-03-10' },
    })
    const { container } = render(CourseCard, { props: { course } })
    const text = container.textContent ?? ''
    expect(text).toContain('Signals')
    expect(text).toContain('01276001')
    expect(text).toContain('ECC-101')
    expect(text).toContain('(Lab)')
    expect(text).toContain('Ada Lovelace')
    expect(text).toContain('Mid Tue 10 Feb 2026')
    expect(text).toContain('Final Tue 10 Mar 2026')
  })
})
