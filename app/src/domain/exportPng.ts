import { planTimeRange } from './filters'
import { DAYS, SLOT, fmtTime, toMin } from './time'
import type { CourseColor, PlanCourse } from './types'

/**
 * Canvas PNG export, ported from the legacy page.
 *
 * UI coupling is limited to a document getter + download callback so the
 * drawing path can be exercised with a fake canvas later. jsdom has no canvas
 * implementation, so this module is intentionally not unit-tested here.
 */

const DEFAULT_THEME: Record<string, string> = {
  '--bg': '#f6f5f2',
  '--ink': '#232323',
  '--muted': '#5f5f5f',
  '--line': '#e2dfd9',
  '--bar-red': '#c4442c',
  '--bar-green': '#0e7a3b',
  '--bar-blue': '#0f76d6',
  '--bar-magenta': '#a33a6b',
  '--bar-purple': '#6b50f0',
  '--bar-teal': '#0a6e7a',
}

const BAR_TOKENS: Record<CourseColor, string> = {
  red: '--bar-red',
  green: '--bar-green',
  blue: '--bar-blue',
  magenta: '--bar-magenta',
  purple: '--bar-purple',
  teal: '--bar-teal',
}

const SANS = "'IBM Plex Sans Thai', Arial, sans-serif"

export interface PngExportOptions {
  document?: Document
  getComputedStyle?: (element: Element) => CSSStyleDeclaration
  now?: () => Date
  download?: (blob: Blob, filename: string) => void
  scale?: number
}

function resolveDocument(options: PngExportOptions): Document {
  const doc = options.document ?? (typeof document === 'undefined' ? null : document)
  if (!doc) throw new Error('PNG export requires a document')
  return doc
}

function readTokens(doc: Document, options: PngExportOptions): (name: string) => string {
  const style = options.getComputedStyle ?? ((element: Element) => doc.defaultView?.getComputedStyle(element) ?? getComputedStyle(element))
  let declaration: CSSStyleDeclaration | null = null
  try {
    declaration = style(doc.documentElement)
  } catch {
    declaration = null
  }
  return (name: string) => declaration?.getPropertyValue(name).trim() || DEFAULT_THEME[name] || ''
}

function fitText(ctx: CanvasRenderingContext2D, text: string, max: number): string {
  if (ctx.measureText(text).width <= max) return text
  let fitted = text
  while (fitted.length > 1 && ctx.measureText(fitted + '…').width > max) {
    fitted = fitted.slice(0, -1)
  }
  return fitted + '…'
}

export interface DrawnPlan {
  width: number
  height: number
}

/** Draw the plan into an existing canvas. */
export function drawPlanCanvas(
  canvas: HTMLCanvasElement,
  courses: readonly PlanCourse[],
  termLabel: string,
  options: PngExportOptions = {},
): DrawnPlan | null {
  if (!courses.length) return null
  const doc = canvas.ownerDocument ?? resolveDocument(options)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D context unavailable')
  const ctx: CanvasRenderingContext2D = context

  const days = courses.some((course) =>
    course.sessions.some((session) => session.day === 'Sat'),
  )
    ? [...DAYS, 'Sat' as const]
    : [...DAYS]
  const range = planTimeRange(courses)
  const startMin = range.start
  const slotCount = range.slots
  const slotH = 44
  const headH = 46
  const timeW = 68
  const pad = 22
  const footH = 34
  const colW = 190
  const width = pad * 2 + timeW + colW * days.length
  const height = pad * 2 + headH + slotH * slotCount + footH
  const scale = options.scale ?? 2
  canvas.width = width * scale
  canvas.height = height * scale
  ctx.scale(scale, scale)

  const token = readTokens(doc, options)
  const ink = token('--ink')
  const muted = token('--muted')
  const line = token('--line')
  const bars = Object.fromEntries(
    (Object.keys(BAR_TOKENS) as CourseColor[]).map((color) => [color, token(BAR_TOKENS[color])]),
  ) as Record<CourseColor, string>

  ctx.fillStyle = token('--bg')
  ctx.fillRect(0, 0, width, height)
  ctx.textBaseline = 'top'
  ctx.fillStyle = ink
  ctx.font = `600 18px ${SANS}`
  ctx.fillText(`CEI Schedule · Plan ${termLabel}`, pad, pad)

  const gridX = pad + timeW
  const gridY = pad + headH
  ctx.fillStyle = muted
  ctx.font = `500 11px ${SANS}`
  ctx.textAlign = 'center'
  days.forEach((day, index) =>
    ctx.fillText(day.toUpperCase(), gridX + colW * (index + 0.5), pad + headH - 18),
  )
  ctx.textAlign = 'left'

  for (let row = 0; row < slotCount; row++) {
    const y = gridY + row * slotH
    ctx.strokeStyle = line
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(gridX, y)
    ctx.lineTo(width - pad, y)
    ctx.stroke()
    if ((startMin + row * SLOT) % 60 === 0 || row === 0) {
      ctx.fillStyle = muted
      ctx.font = `500 11px ${SANS}`
      ctx.fillText(fmtTime(startMin + row * SLOT), pad, y - 5)
    }
  }
  days.forEach((_day, index) => {
    const x = gridX + colW * index
    ctx.strokeStyle = line
    ctx.beginPath()
    ctx.moveTo(x, gridY)
    ctx.lineTo(x, gridY + slotH * slotCount)
    ctx.stroke()
  })

  days.forEach((day, dayIndex) => {
    const daySessions: Array<{ course: PlanCourse; session: PlanCourse['sessions'][number] }> = []
    courses.forEach((course) =>
      course.sessions.forEach((session) => {
        if (session.day === day) daySessions.push({ course, session })
      }),
    )
    daySessions.sort((a, b) => toMin(a.session.start) - toMin(b.session.start))
    const laneEnds: number[] = []
    const placed = daySessions.map((entry) => {
      let lane = laneEnds.findIndex((end) => end <= toMin(entry.session.start))
      if (lane === -1) {
        lane = laneEnds.length
        laneEnds.push(0)
      }
      laneEnds[lane] = toMin(entry.session.end)
      return { ...entry, lane }
    })
    const lanes = Math.max(1, laneEnds.length)
    placed.forEach(({ course, session, lane }) => {
      const startRow = (toMin(session.start) - startMin) / SLOT
      const span = (toMin(session.end) - toMin(session.start)) / SLOT
      const boxWidth = (colW - 6) / lanes
      const x = gridX + colW * dayIndex + 3 + boxWidth * lane
      const y = gridY + startRow * slotH + 2
      const boxHeight = Math.max(slotH - 4, span * slotH - 4)
      ctx.fillStyle = bars[course.color] || bars.blue
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath()
        ctx.roundRect(x, y, boxWidth, boxHeight, 7)
        ctx.fill()
      } else {
        ctx.fillRect(x, y, boxWidth, boxHeight)
      }
      ctx.fillStyle = '#ffffff'
      ctx.font = `500 10px ${SANS}`
      ctx.fillText(`${session.start}–${session.end}`, x + 8, y + 6)
      ctx.font = `600 11px ${SANS}`
      ctx.fillText(fitText(ctx, course.name, boxWidth - 16), x + 8, y + 20)
      if (session.room && boxHeight > 42) {
        ctx.font = `400 10px ${SANS}`
        ctx.fillText(fitText(ctx, session.room, boxWidth - 16), x + 8, y + 34)
      }
      if (course.planRole === 'TA') {
        ctx.setLineDash([4, 3])
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 1.5
        ctx.strokeRect(x + 2, y + 2, boxWidth - 4, boxHeight - 4)
        ctx.setLineDash([])
      }
    })
  })

  ctx.fillStyle = muted
  ctx.font = `400 11px ${SANS}`
  const now = (options.now ?? (() => new Date()))()
  ctx.fillText(
    `Exported ${now.toLocaleDateString('en-GB')} · plan saved in this browser only`,
    pad,
    height - pad - 12,
  )
  return { width, height }
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve))
}

/** Render the plan and return the PNG blob (null when there is nothing to draw). */
export async function createPlanPng(
  courses: readonly PlanCourse[],
  termLabel: string,
  options: PngExportOptions = {},
): Promise<Blob | null> {
  if (!courses.length) return null
  const doc = resolveDocument(options)
  const canvas = doc.createElement('canvas')
  await (doc.fonts?.ready ?? Promise.resolve()).catch(() => undefined)
  drawPlanCanvas(canvas, courses, termLabel, options)
  return canvasToBlob(canvas)
}

export interface ExportPlanOptions extends PngExportOptions {
  termId: string
}

/** Render + download the plan PNG. Returns false when there is nothing to export. */
export async function exportPlanPng(
  courses: readonly PlanCourse[],
  termLabel: string,
  options: ExportPlanOptions,
): Promise<boolean> {
  const blob = await createPlanPng(courses, termLabel, options)
  if (!blob) return false
  const now = (options.now ?? (() => new Date()))()
  const filename = `cei-plan-${options.termId}-${now.toISOString().slice(0, 10)}.png`
  const download = options.download ?? defaultDownload(resolveDocument(options))
  download(blob, filename)
  return true
}

function defaultDownload(doc: Document): (blob: Blob, filename: string) => void {
  return (blob, filename) => {
    const url = URL.createObjectURL(blob)
    const anchor = doc.createElement('a')
    anchor.href = url
    anchor.download = filename
    doc.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}
