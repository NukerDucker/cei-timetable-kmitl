import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import { makeCourse, makeSession } from '../../../domain/test-utils'
import CourseList from './CourseList.svelte'

function fixture() {
  return [
    makeCourse({
      code: 'A001',
      name: 'Digital Circuits',
      credits: '3(3-0-6)',
      lecturers: ['Ada Lovelace'],
      sessions: [makeSession({ day: 'Mon', start: '09:00', end: '12:00', room: 'ECC-101' })],
    }),
    makeCourse({
      code: 'B002',
      name: 'Embedded Systems',
      credits: '4(3-2-7)',
      lecturers: ['Grace Hopper'],
      sessions: [makeSession({ day: 'Tue', start: '13:00', end: '16:00', room: 'LAB-9' })],
    }),
    makeCourse({
      code: 'C003',
      name: 'Probability',
      credits: '3(3-0-6)',
      lecturers: ['Katherine Johnson'],
      sessions: [makeSession({ day: 'Wed', start: '08:00', end: '11:00', room: 'ECC-303' })],
    }),
  ]
}

function countText(): string {
  return (screen.getByText(/\d+ courses?/).textContent ?? '').replace(/\s+/g, ' ').trim()
}

describe('CourseList', () => {
  it('shows every course before searching', () => {
    render(CourseList, { props: { courses: fixture(), label: '1/2569 · 3rd Year' } })
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(countText()).toBe('3 courses')
  })

  it('filters by name, code, lecturer, room and sessions', async () => {
    render(CourseList, { props: { courses: fixture(), label: '1/2569 · 3rd Year' } })
    const input = screen.getByRole('searchbox')

    await fireEvent.input(input, { target: { value: 'grace' } })
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByText(/Embedded Systems/)).toBeInTheDocument()
    expect(countText()).toBe('1 course')

    await fireEvent.input(input, { target: { value: 'ecc-303' } })
    expect(screen.getByText(/Probability/)).toBeInTheDocument()

    await fireEvent.input(input, { target: { value: 'tue 13:00' } })
    expect(screen.getByText(/Embedded Systems/)).toBeInTheDocument()

    await fireEvent.input(input, { target: { value: 'b002' } })
    expect(screen.getByText(/Embedded Systems/)).toBeInTheDocument()

    await fireEvent.input(input, { target: { value: 'probability' } })
    expect(screen.getByText(/Probability/)).toBeInTheDocument()

    await fireEvent.input(input, { target: { value: '4(3-2-7)' } })
    expect(screen.getByText(/Embedded Systems/)).toBeInTheDocument()
  })

  it('shows the empty state when nothing matches', async () => {
    render(CourseList, { props: { courses: fixture(), label: '1/2569 · 3rd Year' } })
    await fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'zzzz' } })
    expect(screen.queryAllByRole('article')).toHaveLength(0)
    expect(screen.getByText('No courses match that search.')).toBeInTheDocument()
    expect(countText()).toBe('0 courses')
  })
})
