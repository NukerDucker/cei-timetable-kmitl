import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import { makeCourse } from '../../../domain/test-utils'
import ExamTable from './ExamTable.svelte'

function rowNames(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('tbody tr')).map(
    (row) => row.querySelector('td')?.textContent?.trim() ?? '',
  )
}

describe('ExamTable', () => {
  it('sorts by final date, falling back to the midterm date', () => {
    const courses = [
      makeCourse({ code: 'F3', name: 'Final March', exams: { final: '2026-03-10' } }),
      makeCourse({ code: 'M1', name: 'Mid January', exams: { mid: '2026-01-05' } }),
      makeCourse({ code: 'F2', name: 'Final February', exams: { final: '2026-02-01' } }),
    ]
    const { container } = render(ExamTable, { props: { courses } })
    expect(rowNames(container)).toEqual(['Mid January', 'Final February', 'Final March'])
  })

  it('renders notes for unset exams and rooms for published ones', () => {
    const courses = [
      makeCourse({
        code: 'N1',
        name: 'No Dates',
        exams: { midNote: 'TBA by instructor' },
      }),
      makeCourse({
        code: 'R1',
        name: 'With Rooms',
        exams: {
          mid: '2026-02-10',
          midRoom: 'EX-101',
          final: '2026-03-10',
          finalRoom: 'EX-202',
        },
      }),
    ]
    const { container } = render(ExamTable, { props: { courses } })
    const text = container.textContent ?? ''
    expect(text).toContain('TBA by instructor')
    expect(text).toContain('EX-101')
    expect(text).toContain('EX-202')
    expect(text).toContain('Tue 10 Feb 2026')
    expect(text).toContain('Tue 10 Mar 2026')
  })
})
