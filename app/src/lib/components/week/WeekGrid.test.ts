import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import { makeCourse, makeSession } from '../../../domain/test-utils'
import WeekGrid from './WeekGrid.svelte'

function fixture() {
  return [
    makeCourse({
      code: 'A001',
      name: 'Alpha',
      type: 'lecture',
      sessions: [makeSession({ day: 'Mon', start: '09:00', end: '10:30' })],
    }),
    makeCourse({
      code: 'B002',
      name: 'Beta',
      type: 'elective',
      sessions: [makeSession({ day: 'Tue', start: '13:00', end: '15:00' })],
    }),
    makeCourse({
      code: 'C003',
      name: 'Gamma',
      type: 'gened',
      sessions: [makeSession({ day: 'Wed', start: '08:00', end: '09:00' })],
    }),
  ]
}

describe('WeekGrid', () => {
  it('renders one block per session in the fixture', () => {
    const { container } = render(WeekGrid, { props: { courses: fixture(), today: 'Mon' } })
    expect(container.querySelectorAll('.block')).toHaveLength(3)
    expect(container.querySelectorAll('.gb-name')).toHaveLength(3)
  })

  it('tags each block with its course category', () => {
    const { container } = render(WeekGrid, { props: { courses: fixture(), today: 'Mon' } })
    expect(container.querySelectorAll('.block[data-category="core"]')).toHaveLength(1)
    expect(container.querySelectorAll('.block[data-category="elective"]')).toHaveLength(1)
    expect(container.querySelectorAll('.block[data-category="gened"]')).toHaveLength(1)
  })

  it('gives labs their course category', () => {
    const courses = [
      makeCourse({
        code: 'L004',
        name: 'Lab Course',
        type: 'lab',
        sessions: [makeSession({ day: 'Thu', start: '10:00', end: '12:00', type: 'lab' })],
      }),
    ]
    const { container } = render(WeekGrid, { props: { courses, today: 'Mon' } })
    expect(container.querySelector('.block')?.getAttribute('data-category')).toBe('core')
  })

  it('adds Saturday only when a session needs it', () => {
    const weekdayOnly = render(WeekGrid, { props: { courses: fixture(), today: 'Mon' } })
    expect(weekdayOnly.container.querySelectorAll('.day-head')).toHaveLength(5)
    weekdayOnly.unmount()

    const courses = [
      ...fixture(),
      makeCourse({
        code: 'S005',
        name: 'Saturday Class',
        sessions: [makeSession({ day: 'Sat', start: '09:00', end: '11:00' })],
      }),
    ]
    const withSaturday = render(WeekGrid, { props: { courses, today: 'Mon' } })
    expect(withSaturday.container.querySelectorAll('.day-head')).toHaveLength(6)
    expect(withSaturday.container.textContent).toContain('Sat')
  })

  it('places overlapping sessions in separate lanes', () => {
    const courses = [
      makeCourse({
        code: 'O001',
        name: 'Overlap One',
        sessions: [makeSession({ day: 'Mon', start: '09:00', end: '11:00' })],
      }),
      makeCourse({
        code: 'O002',
        name: 'Overlap Two',
        sessions: [makeSession({ day: 'Mon', start: '10:00', end: '12:00' })],
      }),
    ]
    const { container } = render(WeekGrid, { props: { courses, today: 'Mon' } })
    const blocks = Array.from(container.querySelectorAll('.block'))
    // jsdom serialises grid-row/grid-column as the grid-area shorthand.
    expect(blocks[0]?.getAttribute('style')).toMatch(/grid-(area: \d+ \/ 1|column: 1)/)
    expect(blocks[1]?.getAttribute('style')).toMatch(/grid-(area: \d+ \/ 2|column: 2)/)
    expect(
      container.querySelector('.day-grid[data-day="Mon"]')?.getAttribute('style'),
    ).toContain('repeat(2')
  })

  it('underlines today', () => {
    const { container } = render(WeekGrid, { props: { courses: fixture(), today: 'Tue' } })
    const today = container.querySelector('.day-head.is-today')
    expect(today?.textContent?.trim()).toBe('Tue')
  })

  it('supports a dynamic range and marks TA and conflict blocks', () => {
    const alpha = Object.assign(
      makeCourse({
        code: 'A001',
        name: 'Alpha',
        sessions: [makeSession({ day: 'Mon', start: '09:45', end: '11:15' })],
      }),
      { key: 'k-alpha' },
    )
    const beta = Object.assign(
      makeCourse({
        code: 'B002',
        name: 'Beta',
        sessions: [makeSession({ day: 'Mon', start: '10:00', end: '11:00' })],
      }),
      { key: 'k-beta' },
    )
    const { container } = render(WeekGrid, {
      props: {
        courses: [alpha, beta],
        today: 'Mon',
        range: { start: 9 * 60 + 30, slots: 10 },
        taKeys: ['k-alpha'],
        conflictKeys: ['k-beta'],
      },
    })

    expect(container.querySelector('.week-grid')?.getAttribute('style')).toContain(
      'repeat(10, var(--week-row-h))',
    )
    expect(container.querySelector('.time')?.textContent?.trim()).toBe('09:30')

    const blocks = Array.from(container.querySelectorAll('.block'))
    const alphaBlock = blocks.find((block) => block.textContent?.includes('Alpha'))
    const betaBlock = blocks.find((block) => block.textContent?.includes('Beta'))
    expect(alphaBlock).toHaveClass('is-ta')
    expect(alphaBlock).toHaveTextContent('TA')
    expect(alphaBlock?.querySelectorAll('.gb-tags > span').length).toBeGreaterThan(0)
    expect(alphaBlock?.querySelector('.gb-tags')?.textContent).toContain('TA')
    expect(betaBlock).toHaveClass('is-conflict')
    expect(betaBlock).toHaveTextContent('Conflict')
  })
})
