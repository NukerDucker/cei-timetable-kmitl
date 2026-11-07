import { sectionId } from './section'
import type {
  Course,
  CourseColor,
  CourseType,
  Exam,
  GenEdCourse,
  PlanCourse,
  Session,
  StorageLike,
} from './types'

export function makeSession(
  overrides: Partial<Session> & Pick<Session, 'day' | 'start' | 'end'>,
): Session {
  return {
    room: 'ECC-101',
    section: '901',
    ...overrides,
  }
}

export function makeCourse(
  overrides: Partial<Course> & {
    code?: string
    sessions?: Session[]
    exams?: Exam
    type?: CourseType
    color?: CourseColor
  } = {},
): Course {
  const code = overrides.code ?? '01276001'
  const sessions =
    overrides.sessions ??
    [makeSession({ day: 'Mon', start: '09:00', end: '12:00' })]
  const number = overrides.section ?? sessions[0]?.section ?? '901'
  return {
    name: overrides.name ?? `Course ${code}`,
    code,
    credits: overrides.credits ?? '3(3-0-6)',
    color: overrides.color ?? 'blue',
    type: overrides.type ?? 'lecture',
    lecturers: overrides.lecturers ?? [],
    sessions,
    exams: overrides.exams ?? {},
    sections: overrides.sections ?? [
      { id: sectionId('t1', code, number), number, sessions },
    ],
    ...(number ? { section: number } : {}),
    ...(overrides.prereq ? { prereq: overrides.prereq } : {}),
  }
}

export function makePlanCourse(overrides: Partial<PlanCourse> = {}): PlanCourse {
  const base = makeCourse(overrides)
  const section = base.sections[0]
  const number = section?.number ?? base.section ?? '901'
  return {
    ...base,
    key: overrides.key ?? sectionId('t1', base.code, number),
    sectionId: overrides.sectionId ?? sectionId('t1', base.code, number),
    section: number,
    planYear: overrides.planYear ?? '1st Year',
    hasLab: overrides.hasLab ?? base.sessions.some((session) => session.type === 'lab'),
    planRole: overrides.planRole ?? 'take',
  }
}

export function makeGenEdCourse(
  code: string,
  number: string,
  overrides: Partial<GenEdCourse> = {},
): GenEdCourse {
  const sessions =
    overrides.sessions ??
    [makeSession({ day: 'Mon', start: '13:00', end: '16:00', section: number })]
  return {
    name: overrides.name ?? `GenEd ${code}`,
    code,
    credits: '3(3-0-6)',
    color: 'magenta',
    type: 'gened',
    lecturers: [],
    sessions,
    exams: {},
    sections: [{ id: sectionId('t1', code, number), number, sessions }],
    section: number,
    key: `${code}#${number}`,
    planYear: 'Gen Ed',
    ...overrides,
  }
}

export interface MemoryStorage extends StorageLike {
  data: Map<string, string>
}

export function memoryStorage(initial: Record<string, string> = {}): MemoryStorage {
  const data = new Map(Object.entries(initial))
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value)
    },
    removeItem: (key) => {
      data.delete(key)
    },
  }
}
