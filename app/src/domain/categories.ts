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
