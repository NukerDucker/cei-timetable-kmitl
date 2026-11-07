<script lang="ts">
  import { courseCategory, courseCategoryLabel } from '../../../domain/categories'
  import { DAYS, DAY_START, SLOT, SLOTS, WEEKDAYS, fmtTime, minutes } from '../../../domain/time'
  import type { Category, Course, Day, Session } from '../../../domain/types'

  interface Props {
    courses: Course[]
    /** Deterministic highlight for tests; omit to use the browser's weekday. */
    today?: Day | null
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
  }

  interface DayColumn {
    day: Day
    blocks: WeekBlock[]
    laneCount: number
  }

  let { courses, today }: Props = $props()

  const TIME_LABELS = Array.from({ length: SLOTS }, (_, index) => ({
    index,
    minute: DAY_START + index * SLOT,
  })).filter(({ index, minute }) => index === 0 || minute % 60 === 0)

  const LUNCH_ROW = (12 * 60 - DAY_START) / SLOT + 2

  function currentWeekday(): Day | null {
    const name = WEEKDAYS[new Date().getDay()]
    return name && name !== 'Sun' ? name : null
  }

  const activeToday = $derived(today === undefined ? currentWeekday() : today)

  function buildDay(day: Day, source: Course[]): DayColumn {
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
      const snapped = DAY_START + Math.floor((item.start - DAY_START) / SLOT) * SLOT
      const row = (snapped - DAY_START) / SLOT + 1
      const span = Math.max(1, Math.round((item.end - snapped) / SLOT))
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
      columns: days.map((day) => buildDay(day, courses)),
    }
  })

  function dayStyle(column: DayColumn, index: number): string {
    const styles = [`grid-column: ${index + 2}`]
    if (column.laneCount > 1) {
      styles.push(`grid-template-columns: repeat(${column.laneCount}, minmax(0, 1fr))`)
    }
    return styles.join('; ')
  }

  function blockStyle(block: WeekBlock, laneCount: number): string {
    const styles = [`grid-row: ${block.row} / span ${block.span}`]
    if (laneCount > 1) {
      styles.push(
        block.overlaps > 1 ? `grid-column: ${block.lane + 1}` : 'grid-column: 1 / -1',
      )
    }
    return styles.join('; ')
  }
</script>

<div class="overflow-x-auto">
  <div
    class="week-grid"
    role="group"
    style="grid-template-columns: 4rem repeat({week.days.length}, minmax(0, 1fr))"
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

    {#if LUNCH_ROW >= 2 && LUNCH_ROW + 1 <= SLOTS + 1}
      <div class="lunch" style="grid-row: {LUNCH_ROW} / {LUNCH_ROW + 2}">Lunch</div>
    {/if}

    {#each week.columns as column, index (column.day)}
      <div
        class="day-grid"
        class:is-today={column.day === activeToday}
        data-day={column.day}
        style={dayStyle(column, index)}
      >
        {#each column.blocks as block (block.key)}
          <div
            class="block"
            class:is-tight={block.span <= 2}
            data-category={block.category}
            style={blockStyle(block, column.laneCount)}
            title={`${block.course.name} · ${block.session.start}–${block.session.end}`}
          >
            <span class="gb-time">{block.session.start}–{block.session.end}</span>
            <span class="gb-name">{block.course.name}</span>
            {#if block.session.room}
              <span class="gb-room">{block.session.room}</span>
            {/if}
            <span class="gb-tag">{block.tag}</span>
            {#if block.session.type === 'lab'}
              <span class="gb-tag">Lab</span>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .week-grid {
    --week-row-h: clamp(20px, 2.6vh, 30px);
    display: grid;
    grid-template-rows: 2.75rem repeat(26, var(--week-row-h));
    min-width: 720px;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .corner,
  .day-head {
    display: flex;
    align-items: center;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
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
    font-size: 0.72rem;
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
    border-left: 1px dashed var(--border);
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
    border-top: 1px dashed var(--border);
    border-bottom: 1px dashed var(--border);
    font-size: 0.6rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted-foreground);
  }

  .block {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 2px;
    padding: 6px 8px;
    overflow: hidden;
    border-radius: calc(var(--radius) - 4px);
    color: var(--primary-foreground);
    background: var(--cat-core);
  }

  .block[data-category='elective'] {
    background: var(--cat-elective);
  }

  .block[data-category='gened'] {
    background: var(--cat-gened);
  }

  .block > span {
    flex-shrink: 0;
  }

  .gb-time {
    font-size: 0.72rem;
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

  .gb-room {
    font-size: 0.72rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 0.9;
  }

  .gb-tag {
    align-self: flex-start;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.85;
  }

  .block.is-tight {
    padding: 3px 6px;
    gap: 0;
  }

  .block.is-tight .gb-time {
    line-height: 1.2;
  }

  .block.is-tight .gb-name {
    line-clamp: 1;
    -webkit-line-clamp: 1;
  }

  .block.is-tight .gb-room,
  .block.is-tight .gb-tag {
    display: none;
  }
</style>
