import type { TermId } from './types'

/**
 * Stable section identity. Derived from term + subject code + section number,
 * never from transient API row ids.
 */
export function sectionId(termId: TermId, code: string, number: string): string {
  return `${termId}/${code}/${number}`
}

export interface ParsedSectionId {
  termId: TermId
  code: string
  number: string
}

/**
 * Parse a section ID. An empty section number is allowed for legacy entries
 * that could not be resolved at migration time; they stay persisted but never
 * resolve to a course. TODO: expose an explicit unresolved marker instead.
 */
export function parseSectionId(id: string): ParsedSectionId | null {
  const parts = id.split('/')
  if (parts.length !== 3) return null
  const [termId, code, number = ''] = parts
  if (!termId || !code) return null
  return { termId, code, number }
}
