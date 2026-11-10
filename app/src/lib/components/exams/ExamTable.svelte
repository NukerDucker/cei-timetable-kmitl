<script lang="ts">
  import { examTime } from '../../../domain/exams'
  import { fmtDate } from '../../../domain/time'
  import type { Course } from '../../../domain/types'

  interface Props {
    courses: Course[]
  }

  let { courses }: Props = $props()

  function dateValue(value: string | undefined): number {
    if (!value) return Number.POSITIVE_INFINITY
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed
  }

  /** Final date when published, otherwise the midterm date (legacy sort). */
  function primaryKey(course: Course): number {
    const final = dateValue(course.exams.final)
    return final === Number.POSITIVE_INFINITY ? dateValue(course.exams.mid) : final
  }

  const rows = $derived(
    [...courses].sort((a, b) => {
      const primaryA = primaryKey(a)
      const primaryB = primaryKey(b)
      if (primaryA !== primaryB) return primaryA < primaryB ? -1 : 1
      const midA = dateValue(a.exams.mid)
      const midB = dateValue(b.exams.mid)
      if (midA !== midB) return midA < midB ? -1 : 1
      return a.name.localeCompare(b.name)
    }),
  )

  function displayTime(course: Course): string {
    const mid = examTime(course.exams, 'mid')
    const final = examTime(course.exams, 'final')
    if (mid && final) return mid === final ? mid : `Mid ${mid} · Final ${final}`
    const parts: string[] = []
    if (course.exams.mid) parts.push(mid ? `Mid ${mid}` : 'Mid time TBA')
    if (course.exams.final) parts.push(final ? `Final ${final}` : 'Final time TBA')
    if (parts.length) return parts.join(' · ')
    return (
      course.exams.midNote ||
      course.exams.finalNote ||
      'Not set'
    )
  }
</script>

<div class="exam-wrap">
  <table class="exam-table">
    <caption class="sr-only">Exam schedule</caption>
    <thead>
      <tr>
        <th scope="col">Course</th>
        <th scope="col">Midterm</th>
        <th scope="col">Final</th>
        <th scope="col">Time</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as course (course.code)}
        <tr>
          <td class="exam-course" data-label="Course">{course.name}</td>
          <td data-label="Midterm">
            {#if course.exams.mid}
              {fmtDate(course.exams.mid)}
              {#if course.exams.midRoom}
                <span class="exam-room">{course.exams.midRoom}</span>
              {/if}
            {:else}
              <span class="note">{course.exams.midNote || 'By instructor'}</span>
            {/if}
          </td>
          <td data-label="Final">
            {#if course.exams.final}
              {fmtDate(course.exams.final)}
              {#if course.exams.finalRoom}
                <span class="exam-room">{course.exams.finalRoom}</span>
              {/if}
            {:else}
              <span class="note">{course.exams.finalNote || 'By instructor'}</span>
            {/if}
          </td>
          <td data-label="Time">{displayTime(course)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .exam-wrap {
    overflow-x: auto;
  }

  .exam-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .exam-table th {
    padding: 0 12px 8px;
    font-size: 0.72rem;
    font-weight: 600;
    text-align: left;
    color: var(--muted-foreground);
  }

  .exam-table td {
    padding: 10px 12px;
    border-top: 1px solid var(--border);
    vertical-align: top;
  }

  .exam-course {
    font-weight: 500;
  }

  .note {
    color: var(--muted-foreground);
    font-style: italic;
  }

  .exam-room {
    display: block;
    font-size: 0.72rem;
    color: var(--muted-foreground);
  }

  @media (max-width: 640px) {
    .exam-table thead {
      display: none;
    }

    .exam-table,
    .exam-table tbody,
    .exam-table tr,
    .exam-table td {
      display: block;
      width: 100%;
    }

    .exam-table tr {
      padding: 8px 0;
      border-top: 1px solid var(--border);
    }

    .exam-table tr:first-child {
      border-top: 0;
    }

    .exam-table td {
      padding: 3px 0;
      border: 0;
    }

    .exam-table td::before {
      content: attr(data-label) ': ';
      font-weight: 600;
      color: var(--muted-foreground);
    }
  }
</style>
