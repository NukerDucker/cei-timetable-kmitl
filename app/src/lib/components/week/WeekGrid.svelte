<script lang="ts">
  import { courseCategory, courseCategoryLabel, courseColorToken } from '../../../domain/categories'
  import type { TimeRange } from '../../../domain/filters'
  import { DAYS, DAY_START, SLOT, SLOTS, WEEKDAYS, fmtTime, minutes } from '../../../domain/time'
  import { MapPin, Tag, User } from 'lucide-svelte'
  import Badge from '$lib/components/ui/badge/badge.svelte'
  import type { Category, Course, Day, Session } from '../../../domain/types'

  interface Props {
    courses: Course[]
    /** Deterministic highlight for tests; omit to use the browser's weekday. */
    today?: Day | null
    /** Dynamic visible window; defaults to the published 08:30–20:00 week. */
    range?: TimeRange
    /** Section IDs (`PlanCourse.key`) that take part in a conflict. */
    conflictKeys?: readonly string[]
    /** Section IDs rendered as TA (lab-only, dashed outline). */
    taKeys?: readonly string[]
    /** Stretch rows to the container height (Plan view). Desktop only. */
    fill?: boolean
  }

  interface WeekBlock {
    key: string
    course: Course
    session: Session
    lane: number
    overlaps: number
    row: number
    span: number
    category: Category
    tag: string
    isTa: boolean
    isConflict: boolean
  }

  interface DayColumn {
    day: Day
    blocks: WeekBlock[]
    laneCount: number
  }

  let { courses, today, range, conflictKeys = [], taKeys = [], fill = false }: Props = $props()

  const activeRange = $derived<TimeRange>(range ?? { start: DAY_START, slots: SLOTS })
  const taSet = $derived(new Set(taKeys))
  const conflictSet = $derived(new Set(conflictKeys))

  function planKey(course: Course): string | null {
    const key = (course as { key?: unknown }).key
    return typeof key === 'string' ? key : null
  }

  const TIME_LABELS = $derived(
    Array.from({ length: activeRange.slots }, (_, index) => ({
      index,
      minute: activeRange.start + index * SLOT,
    })).filter(({ index, minute }) => index === 0 || minute % 60 === 0),
  )

  const LUNCH_ROW = $derived((12 * 60 - activeRange.start) / SLOT + 2)

  function currentWeekday(): Day | null {
    const name = WEEKDAYS[new Date().getDay()]
    return name && name !== 'Sun' ? name : null
  }

  const activeToday = $derived(today === undefined ? currentWeekday() : today)

  function buildDay(day: Day, source: Course[], window: TimeRange): DayColumn {
    const items: { course: Course; session: Session; order: number }[] = []
    for (const course of source) {
      course.sessions.forEach((session, order) => {
        if (session.day === day) items.push({ course, session, order })
      })
    }
    items.sort((a, b) => minutes(a.session.start) - minutes(b.session.start))

    const laneEnds: number[] = []
    const placed = items.map((item) => {
      const start = minutes(item.session.start)
      const end = minutes(item.session.end)
      let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start)
      if (lane === -1) {
        lane = laneEnds.length
        laneEnds.push(0)
      }
      laneEnds[lane] = end
      return { ...item, lane, start, end }
    })

    const blocks = placed.map((item) => {
      const overlaps = placed.filter(
        (other) => other.start < item.end && item.start < other.end,
      ).length
      const snapped = window.start + Math.floor((item.start - window.start) / SLOT) * SLOT
      const row = (snapped - window.start) / SLOT + 1
      const span = Math.max(1, Math.round((item.end - snapped) / SLOT))
      const key = planKey(item.course)
      return {
        key: `${item.course.code}/${day}/${item.session.start}/${item.session.section}/${item.order}`,
        course: item.course,
        session: item.session,
        lane: item.lane,
        overlaps,
        row,
        span,
        category: courseCategory(item.course),
        tag: courseCategoryLabel(item.course),
        isTa: key !== null && taSet.has(key),
        isConflict: key !== null && conflictSet.has(key),
      } satisfies WeekBlock
    })

    return { day, blocks, laneCount: laneEnds.length }
  }

  const week = $derived.by(() => {
    const hasSat = courses.some((course) =>
      course.sessions.some((session) => session.day === 'Sat'),
    )
    const days: Day[] = hasSat ? [...DAYS, 'Sat'] : [...DAYS]
    return {
      days,
      columns: days.map((day) => buildDay(day, courses, activeRange)),
    }
  })

  function dayStyle(column: DayColumn, index: number): string {
    const styles = [`grid-column: ${index + 2}`]
    if (column.laneCount > 1) {
      styles.push(`grid-template-columns: repeat(${column.laneCount}, minmax(0, 1fr))`)
    }
    return styles.join('; ')
  }

  function blockStyle(block: WeekBlock, laneCount: number, start: number): string {
    const styles = [`grid-row: ${block.row} / span ${block.span}`]
    if (laneCount > 1) {
      styles.push(
        block.overlaps > 1 ? `grid-column: ${block.lane + 1}` : 'grid-column: 1 / -1',
      )
    }
    return styles.join('; ')
  }

  const gridStyle = $derived(
    `grid-template-columns: 4rem repeat(${week.days.length}, minmax(0, 1fr)); ` +
      (fill
        ? `grid-template-rows: 2.75rem repeat(${activeRange.slots}, minmax(0, 1fr)); height: 100%;`
        : `grid-template-rows: 2.75rem repeat(${activeRange.slots}, var(--week-row-h))`),
  )
</script>

<div class="week-scroll overflow-x-auto" class:fill>
  <div
    class="week-grid"
    role="group"
    style={gridStyle}
    aria-label="Weekly timetable"
  >
    <div class="corner">Time</div>
    {#each week.days as day (day)}
      <div class="day-head" class:is-today={day === activeToday}>{day}</div>
    {/each}

    {#each TIME_LABELS as label (label.index)}
      <div class="time" class:time-first={label.index === 0} style="grid-row: {label.index + 2}">
        {fmtTime(label.minute)}
      </div>
    {/each}

    {#if LUNCH_ROW >= 2 && LUNCH_ROW + 1 <= activeRange.slots + 1}
      <div class="lunch" style="grid-row: {LUNCH_ROW} / {LUNCH_ROW + 2}">Lunch</div>
    {/if}

    {#each week.columns as column, index (column.day)}
      <div
        class="day-grid"
        class:is-today={column.day === activeToday}
        class:is-empty={column.blocks.length === 0}
        data-day={column.day}
        style={dayStyle(column, index)}
      >
        {#each column.blocks as block (block.key)}
          <div
            class="block"
            class:is-tight={block.span <= 2}
            class:is-ta={block.isTa}
            class:is-conflict={block.isConflict}
            data-category={block.category}
            style={`${blockStyle(block, column.laneCount, activeRange.start)}; --block-color: var(--${courseColorToken(block.course)})`}
            title={`${block.course.name} · ${block.session.start}–${block.session.end}`}
          >
            <span class="gb-time">{block.session.start}–{block.session.end}</span>
            <span class="gb-name">{block.course.name}</span>
            <div class="gb-tags">
              <span class="gb-category">
                <Tag class="size-3 shrink-0" aria-hidden="true" />
                {block.tag}
              </span>
              {#if block.session.type === 'lab'}
                <Badge variant="lab">Lab</Badge>
              {/if}
              {#if block.isTa}
                <Badge variant="ta">TA</Badge>
              {/if}
              {#if block.isConflict}
                <Badge variant="conflict">Conflict</Badge>
              {/if}
            </div>
            {#if block.session.room}
              <span class="gb-location">
                <MapPin class="size-3 shrink-0" aria-hidden="true" />
                <span class="gb-location-text">{block.session.room}</span>
              </span>
            {/if}
            {#each block.course.lecturers as lecturer, lecturerIndex (lecturerIndex)}
              <span class="gb-owner" title={lecturer}>
                <User class="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                <span class="gb-owner-text">{lecturer}</span>
              </span>
            {/each}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .week-grid {
    --week-row-h: clamp(0.875em, calc((100dvh - 23.75em) / 26), 1.875em);
    display: grid;
    min-width: 720px;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .corner,
  .day-head {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
    color: var(--muted-foreground);
  }

  .corner {
    grid-row: 1;
    grid-column: 1;
    padding-left: 0.125rem;
  }

  .day-head {
    grid-row: 1;
    justify-content: center;
  }

  .day-head.is-today {
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-thickness: 2px;
  }

  .time {
    grid-column: 1;
    padding-right: 0.5rem;
    font-size: 0.75rem;
    color: var(--muted-foreground);
    text-align: right;
    font-variant-numeric: tabular-nums;
    transform: translateY(-7px);
  }

  .time-first {
    transform: none;
  }

  .day-grid {
    grid-row: 2 / -1;
    display: grid;
    grid-template-rows: subgrid;
    grid-template-columns: minmax(0, 1fr);
    border-left: 1px solid var(--border);
    background-image: linear-gradient(to bottom, var(--border) 1px, transparent 1px);
    background-size: 100% calc(var(--week-row-h) * 2);
  }

  .day-grid.is-today {
    background-color: color-mix(in srgb, var(--foreground) 4%, transparent);
  }

  .lunch {
    position: relative;
    z-index: 1;
    grid-column: 2 / -1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    font-size: 0.6875rem;
    letter-spacing: 0;
    text-transform: none;
    color: var(--muted-foreground);
  }

  .block {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 0.1875rem;
    margin: 0 0.0625rem 0.0625rem 0;
    padding: 0.375rem 0.625rem;
    overflow: hidden;
    border-radius: 0.25rem;
    color: var(--primary-foreground);
    background: var(--block-color, var(--cat-core));
  }

  .block.is-ta {
    outline: 2px dashed var(--primary-foreground);
    outline-offset: -4px;
  }

  .block.is-conflict {
    outline: 3px solid var(--primary-foreground);
    outline-offset: -3px;
  }

  .block > span {
    flex-shrink: 0;
  }

  .gb-time {
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-variant-numeric: tabular-nums;
  }

  .gb-name {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    overflow: hidden;
    overflow-wrap: anywhere;
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.15;
  }

  .gb-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.125rem 0.25rem;
    margin-top: 0;
  }

  .gb-category {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.6875rem;
    font-weight: 500;
    line-height: 1.2;
    white-space: nowrap;
  }

  .gb-location,
  .gb-owner {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 0.25rem;
    overflow: hidden;
    font-size: 0.6875rem;
    font-weight: 500;
    line-height: 1.2;
    white-space: nowrap;
    opacity: 0.9;
  }

  .gb-location-text,
  .gb-owner-text {
    display: block;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .gb-owner {
    align-items: flex-start;
  }

  .block.is-tight {
    padding: 0.25rem 0.5rem;
    gap: 0;
  }

  .block.is-tight .gb-time {
    line-height: 1.2;
  }

  .block.is-tight .gb-name {
    line-clamp: 2;
    -webkit-line-clamp: 2;
  }

  .block.is-tight .gb-tags {
    display: none;
  }

  .block.is-tight .gb-location,
  .block.is-tight .gb-owner {
    display: none;
  }
  .week-scroll.fill {
    height: 100%;
  }

  .week-scroll.fill .week-grid {
    height: 100%;
  }

  @media (max-width: 901px) {
    .week-scroll.fill,
    .week-scroll.fill .week-grid {
      height: auto;
    }
  }

  @media (max-width: 640px) {
    .week-scroll {
      overflow: visible;
    }

    .week-grid {
      display: block;
      min-width: 0;
      border: 0;
    }

    .corner,
    .day-head,
    .time,
    .lunch {
      display: none;
    }

    .day-grid {
      display: flex;
      flex-direction: column;
      gap: 0.0625rem;
      grid-row: auto;
      grid-column: auto;
      border-left: 0;
      background-image: none;
      padding: 0.25rem 0 0.5rem;
    }

    .day-grid::before {
      content: attr(data-day);
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 0.125rem 0 0.25rem;
    }

    .day-grid.is-empty::after {
      content: 'No classes';
      font-size: 0.8125rem;
      color: var(--muted-foreground);
      padding: 0.125rem 0 0.5rem;
    }

    .block {
      grid-row: auto !important;
      grid-column: auto !important;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.25rem 0.5rem;
      min-height: 44px;
      margin: 0 0 0.0625rem;
      padding: 0.5rem 0.625rem;
    }

    .block.is-tight .gb-tags,
    .block.is-tight .gb-location,
    .block.is-tight .gb-owner {
      display: flex;
    }

    .gb-tags {
      flex: 0 1 auto;
    }
    .gb-time {
      flex: 0 0 5.375rem;
    }

    .gb-name {
      flex: 1 1 7.5rem;
      min-width: 0;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .gb-owner {
      flex: 1 1 100%;
    }
  }
</style>
