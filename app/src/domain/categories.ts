import type { Category, Course } from './types'

export const CATEGORY_LABELS: Record<Category, string> = {
  core: 'Core',
  elective: 'Elective',
  gened: 'Gen Ed',
}

/** CSS token names used by the UI (`subject-cat-core`, etc.). */
export const CATEGORY_COLOR_TOKENS: Record<Category, string> = {
  core: 'cat-core',
  elective: 'cat-elective',
  gened: 'cat-gened',
}

/** Category is a colour/semantic class; labs inherit their course's category. */
export function courseCategory(course: Pick<Course, 'type'>): Category {
  if (course.type === 'gened') return 'gened'
  if (course.type === 'elective') return 'elective'
  return 'core'
}

export function categoryLabel(category: Category): string {
  return CATEGORY_LABELS[category]
}

export function categoryColorToken(category: Category): string {
  return CATEGORY_COLOR_TOKENS[category]
}

export function courseCategoryLabel(course: Pick<Course, 'type'>): string {
  return categoryLabel(courseCategory(course))
}

export function courseCategoryColorToken(course: Pick<Course, 'type'>): string {
  return categoryColorToken(courseCategory(course))
}


/** Four deterministic shades per category; same course always keeps its shade. */
export const CATEGORY_SHADE_TOKENS: Record<Category, readonly string[]> = {
  core: ['cat-core-1', 'cat-core-2', 'cat-core-3', 'cat-core-4'],
  elective: ['cat-elective-1', 'cat-elective-2', 'cat-elective-3', 'cat-elective-4'],
  gened: ['cat-gened-1', 'cat-gened-2', 'cat-gened-3', 'cat-gened-4'],
}

export function courseShade(course: Pick<Course, 'code'>): number {
  let hash = 0
  for (let index = 0; index < course.code.length; index += 1) {
    hash = (hash * 31 + course.code.charCodeAt(index)) >>> 0
  }
  return hash % CATEGORY_SHADE_TOKENS.core.length
}

export function courseColorToken(course: Pick<Course, 'code' | 'type'>): string {
  return CATEGORY_SHADE_TOKENS[courseCategory(course)][courseShade(course)]
}
