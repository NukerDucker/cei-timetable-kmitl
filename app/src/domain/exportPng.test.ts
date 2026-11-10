import { describe, expect, it } from 'vitest'
import { drawPlanCanvas } from './exportPng'
import { makePlanCourse, makeSession } from './test-utils'
import type { PlanCourse } from './types'

interface RectCall {
  x: number
  y: number
  width: number
  height: number
}

function fakeCanvas(): { canvas: HTMLCanvasElement; rects: RectCall[] } {
  const rects: RectCall[] = []
  const ctx = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    font: '',
    textAlign: 'left',
    textBaseline: 'top',
    scale: () => undefined,
    fillRect: (x: number, y: number, width: number, height: number) => {
      rects.push({ x, y, width, height })
    },
    fillText: () => undefined,
    strokeText: () => undefined,
    measureText: (text: string) => ({ width: text.length * 6 }),
    beginPath: () => undefined,
    moveTo: () => undefined,
    lineTo: () => undefined,
    stroke: () => undefined,
    fill: () => undefined,
    strokeRect: () => undefined,
    setLineDash: () => undefined,
  }
  const canvas = {
    width: 0,
    height: 0,
    ownerDocument: undefined,
    getContext: () => ctx,
  } as unknown as HTMLCanvasElement
  return { canvas, rects }
}

const style = (() => ({
  getPropertyValue: () => '',
})) as unknown as (element: Element) => CSSStyleDeclaration

describe('drawPlanCanvas', () => {
  it('gives an isolated session the full column width after earlier overlaps', () => {
    const courses: PlanCourse[] = [
      makePlanCourse({
        code: 'A100',
        sessions: [makeSession({ day: 'Mon', start: '09:00', end: '10:00' })],
      }),
      makePlanCourse({
        code: 'B100',
        sessions: [makeSession({ day: 'Mon', start: '09:30', end: '10:30' })],
      }),
      makePlanCourse({
        code: 'C100',
        sessions: [makeSession({ day: 'Mon', start: '12:00', end: '13:00' })],
      }),
    ]
    const { canvas, rects } = fakeCanvas()
    const drawn = drawPlanCanvas(canvas, courses, '1/2569', {
      document: { defaultView: null } as unknown as Document,
      getComputedStyle: style,
      scale: 1,
      now: () => new Date('2026-11-09T00:00:00Z'),
    })

    expect(drawn).not.toBeNull()
    const blocks = rects.filter(
      (rect) => rect.width < (canvas.width || Number.POSITIVE_INFINITY) && rect.height > 10,
    )
    const widths = [...new Set(blocks.map((rect) => rect.width))].sort((a, b) => a - b)
    expect(widths).toContain(184)
    expect(widths).toContain(92)
  })

  it('returns null when there is nothing to draw', () => {
    const { canvas } = fakeCanvas()
    expect(drawPlanCanvas(canvas, [], '1/2569')).toBeNull()
  })
})
