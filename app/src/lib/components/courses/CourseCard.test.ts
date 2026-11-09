import { render, screen } from '@testing-library/svelte'
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
    expect(container.querySelector('.cc-status-dot')?.getAttribute('data-category')).toBe(category)
  })

  it('shows time, location, owner and Lab tag', () => {
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

    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(container.textContent).toContain('Mon 09:00–12:00')
    expect(container.textContent).toContain('+1')
    expect(container.textContent).toContain('ECC-101 · ECC-202')
    expect(container.textContent).toContain('Ada Lovelace')
    expect(container.querySelector('.cc-avatar')?.textContent).toBe('AL')
    expect(container.textContent).toContain('Lab')
    expect(container.textContent).toContain('01276001')
    expect(container.textContent).toContain('Mid Tue 10 Feb 2026')
    expect(container.textContent).toContain('Final Tue 10 Mar 2026')
  })

  it('summarises multiple owners and keeps the full list in a title', () => {
    const course = makeCourse({ lecturers: ['Ada Lovelace', 'Grace Hopper', 'Katherine Johnson'] })
    const { container } = render(CourseCard, { props: { course } })

    const owner = container.querySelector('.cc-avatar')?.nextElementSibling
    expect(owner?.textContent).toBe('Ada Lovelace +2')
    expect(owner?.getAttribute('title')).toBe('Ada Lovelace · Grace Hopper · Katherine Johnson')
  })

  it('omits the owner row when there are no lecturers', () => {
    const course = makeCourse({ lecturers: [] })
    const { container } = render(CourseCard, { props: { course } })
    expect(container.querySelector('.cc-avatar')).toBeNull()
  })
})
