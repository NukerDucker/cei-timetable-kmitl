import type { Day } from './types'

export const DAYS: readonly Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
export const DAY_ORDER: readonly Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

export const DAY_START = 7 * 60
export const SLOT = 30
export const SLOTS = 26

export const PALETTE = ['red', 'green', 'blue', 'purple', 'magenta', 'teal'] as const

export function toMin(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return (hours ?? 0) * 60 + (minutes ?? 0)
}

/** Legacy `hhmm`: take the `HH:mm` prefix of an API time. */
export function hhmm(value: string | null | undefined): string {
  return (value ?? '').slice(0, 5)
}

export function minutes(time: string): number {
  return toMin(time)
}

export function fmtTime(minutesValue: number): string {
  return (
    String(Math.floor(minutesValue / 60)).padStart(2, '0') +
    ':' +
    String(minutesValue % 60).padStart(2, '0')
  )
}

export function fmtDate(iso: string): string {
  const date = new Date(iso + 'T00:00:00')
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

export function dayName(value: string | number | null | undefined): Day | null {
  const day = WEEKDAYS[Number(value) - 1]
  return day && day !== 'Sun' ? day : null
}

export function titleCase(value: string | null | undefined): string {
  return (value ?? '').toLowerCase().replace(/(^|[\s./(])([a-z])/g, (_match, prefix: string, char: string) => prefix + char.toUpperCase())
}

export function stableColor(code: string): (typeof PALETTE)[number] {
  let hash = 0
  for (let index = 0; index < code.length; index++) {
    hash = (hash * 31 + code.charCodeAt(index)) >>> 0
  }
  return PALETTE[hash % PALETTE.length] ?? 'blue'
}
