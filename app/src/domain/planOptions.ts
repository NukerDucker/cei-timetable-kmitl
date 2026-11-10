import { courseWarnings } from './conflicts'
import { categoryLabel, courseCategory } from './categories'
import { filterPlanOptions, groupPlanOptions, sortPlanOptions } from './filters'
import type { PlanFilter, PlanOption, SubjectGroup } from './filters'
import { sectionId } from './section'
import type { Category, CohortId, Course, GenEdCourse, PlanCourse, Term } from './types'

export interface PickerOption extends PlanOption<Course> {
  sectionNumber: string
  cohort?: CohortId
}

export interface PickerSection extends PickerOption {
  warnings: string[]
}

export interface PickerSubject extends SubjectGroup<PickerOption> {
  items: PickerSection[]
}

export interface PickerGroup {
  key: string
  label: string
  subjects: PickerSubject[]
}

function optionSearch(option: PickerOption): string {
  return [
    option.course.name,
    option.course.code,
    option.sectionNumber,
    ...option.course.lecturers,
  ]
    .join(' ')
    .toLowerCase()
}

/** Candidate sections for the picker: selected cohort plus GenEd. */
export function buildPickerOptions(
  term: Term | undefined,
  cohort: CohortId,
  genedCourses: readonly GenEdCourse[],
  selectedCodes: ReadonlySet<string>,
  genedGroupLabel: string,
): PickerOption[] {
  if (!term) return []
  const selectedYear = term.years.find((year) => year.id === cohort)
  const out: PickerOption[] = []
  if (selectedYear) {
    for (const course of selectedYear.courses) {
      if (selectedCodes.has(course.code)) continue
      const number = course.section ?? course.sections[0]?.number ?? ''
      out.push({
        course,
        key: sectionId(term.id, course.code, number),
        badge: selectedYear.label,
        group: selectedYear.id,
        groupLabel: selectedYear.label,
        sectionNumber: number,
        cohort: selectedYear.id,
      })
    }
  }
  for (const course of genedCourses) {
    if (selectedCodes.has(course.code)) continue
    const number = course.section || course.sections[0]?.number || ''
    out.push({
      course,
      key: sectionId(term.id, course.code, number),
      badge: 'Gen Ed',
      group: 'gened',
      groupLabel: genedGroupLabel,
      sectionNumber: number,
    })
  }
  return out
}

/** Filter, search, group, sort, and annotate picker options for rendering. */
export function selectPickerGroups(
  options: readonly PickerOption[],
  filter: PlanFilter,
  search: string,
  planCourses: readonly PlanCourse[],
  order: readonly { key: string; label: string }[],
): PickerGroup[] {
  const matched = filterPlanOptions(options, filter, planCourses)
  const needle = search.trim().toLowerCase()
  const filtered = needle
    ? matched.filter((option) => optionSearch(option).includes(needle))
    : matched

  return order
    .map((group) => {
      const groupOptions = filtered.filter((option) => option.group === group.key)
      const subjects = groupPlanOptions(groupOptions)
      const byKey = new Map(subjects.map((subject) => [subject.options[0]?.key ?? '', subject]))
      const cards = sortPlanOptions(
        subjects.map((subject) => subject.options[0]!).filter(Boolean),
        filter.sort,
      )
        .map((option) => byKey.get(option.key))
        .filter((subject): subject is SubjectGroup<PickerOption> => Boolean(subject))
        .map((subject) => ({
          ...subject,
          items: subject.options.map((option) => ({
            ...option,
            warnings: courseWarnings(option.course, planCourses),
          })),
        }))
      return { ...group, subjects: cards }
    })
    .filter((group) => group.subjects.length > 0)
}

const CATEGORY_ORDER: readonly Category[] = ['core', 'elective', 'gened']

/**
 * Split a mixed picker group into Core / Elective / Gen Ed subgroups so the
 * three course types never sit in one undifferentiated list. GenEd-only groups
 * keep their existing label.
 */
export function splitGroupsByCategory(groups: readonly PickerGroup[]): PickerGroup[] {
  const out: PickerGroup[] = []
  for (const group of groups) {
    const byCategory = new Map<Category, PickerSubject[]>()
    for (const subject of group.subjects) {
      const option = subject.items[0]
      if (!option) continue
      const category = courseCategory(option.course)
      const list = byCategory.get(category) ?? []
      list.push(subject)
      byCategory.set(category, list)
    }
    if (byCategory.size <= 1) {
      out.push(group)
      continue
    }
    for (const category of CATEGORY_ORDER) {
      const subjects = byCategory.get(category)
      if (!subjects) continue
      out.push({
        key: `${group.key}:${category}`,
        label: `${group.label} · ${categoryLabel(category)}`,
        subjects,
      })
    }
  }
  return out
}
