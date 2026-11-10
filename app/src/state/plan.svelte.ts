import {
  clearPlanTerm,
  defaultPlanContext,
  persistPlan,
  planCourses,
  readPlan,
  togglePlanEntry,
  togglePlanRole,
  unresolvedCount as domainUnresolvedCount,
  unresolvedPlanEntries as domainUnresolvedPlanEntries,
} from '../domain/plan'
import type { PlanContext } from '../domain/plan'
import { browserStorage } from '../domain/storage'
import type {
  CohortId,
  PlanCourse,
  PlanEntry,
  Role,
  StorageLike,
  TermId,
} from '../domain/types'

export interface PlanStateOptions {
  /** Storage override; `undefined` keeps the browser default. */
  storage?: StorageLike | null
  /** Live context for legacy migration and unresolved counts. */
  context?: () => PlanContext
  /** Test seam: skip storage reads and start from these entries. */
  initialEntries?: readonly PlanEntry[]
}

/**
 * Personal plan store. The v2 envelope is the source of truth; the legacy v1
 * key is read once and immediately written back as v2.
 */
export class PlanState {
  entries = $state<PlanEntry[]>([])
  /** `memory-only` means the last write failed; the plan still works this session. */
  saveStatus = $state<'saved' | 'memory-only'>('saved')

  #storage: StorageLike | null
  #context: () => PlanContext

  constructor(options: PlanStateOptions = {}) {
    this.#storage = options.storage === undefined ? browserStorage() : options.storage
    this.#context = options.context ?? (() => defaultPlanContext(this.#storage))

    if (options.initialEntries) {
      this.entries = [...options.initialEntries]
      return
    }

    this.entries = readPlan(this.#storage, this.#context())
    // Promote a legacy v1 plan (and canonicalize ids) on first load.
    const result = persistPlan(this.entries, this.#storage)
    this.entries = result.entries
    this.saveStatus = result.saved ? 'saved' : 'memory-only'
  }

  entriesFor(term: TermId): PlanEntry[] {
    return this.entries.filter((entry) => entry.term === term)
  }

  has(term: TermId, sectionId: string): boolean {
    return this.entries.some(
      (entry) => entry.term === term && entry.sectionId === sectionId,
    )
  }

  add(term: TermId, sectionId: string, role: Role = 'take', cohort?: CohortId): void {
    if (this.has(term, sectionId)) return
    const entry: PlanEntry = {
      term,
      sectionId,
      role,
      ...(cohort ? { cohort } : {}),
    }
    this.#commit([...this.entries, entry])
  }

  remove(term: TermId, sectionId: string): void {
    this.#commit(
      this.entries.filter(
        (entry) => !(entry.term === term && entry.sectionId === sectionId),
      ),
    )
  }

  toggle(term: TermId, sectionId: string, role: Role = 'take'): void {
    this.#commit(togglePlanEntry(this.entries, term, sectionId, role))
  }

  toggleRole(term: TermId, sectionId: string): void {
    this.#commit(togglePlanRole(this.entries, term, sectionId))
  }

  clear(term: TermId): void {
    this.#commit(clearPlanTerm(this.entries, term))
  }

  courses(term: TermId, context: PlanContext = this.#context()): PlanCourse[] {
    return planCourses(term, this.entries, context)
  }

  unresolved(term: TermId, context: PlanContext = this.#context()): number {
    return domainUnresolvedCount(term, this.entries, context)
  }

  unresolvedEntries(term: TermId, context: PlanContext = this.#context()): PlanEntry[] {
    return domainUnresolvedPlanEntries(term, this.entries, context)
  }

  /** Retry the last failed write without changing entries. */
  retrySave(): void {
    this.#commit(this.entries)
  }

  #commit(next: readonly PlanEntry[]): void {
    const result = persistPlan(next, this.#storage)
    this.entries = result.entries
    this.saveStatus = result.saved ? 'saved' : 'memory-only'
  }
}

export function createPlanState(options: PlanStateOptions = {}): PlanState {
  return new PlanState(options)
}
