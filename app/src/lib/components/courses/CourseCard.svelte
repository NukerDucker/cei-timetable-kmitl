<script lang="ts">
  import { courseCategory } from '../../../domain/categories'
  import type { Course } from '../../../domain/types'
  import { courseTypeLabel, examDateOrNote } from '$lib/labels'

  interface Props {
    course: Course
  }

  let { course }: Props = $props()

  const category = $derived(courseCategory(course))

  const examLine = $derived.by(() => {
    const { mid, final, midNote, finalNote } = course.exams
    if (mid || final) {
      return `Mid ${examDateOrNote(mid, midNote)} · Final ${examDateOrNote(final, finalNote)}`
    }
    return `Exams: ${midNote || 'By instructor'}`
  })
</script>

<article class="course-card">
  <div class="flex items-start justify-between gap-2">
    <h2 class="min-w-0 text-[0.9375rem] font-semibold leading-tight">
      <span class="cc-dot" data-category={category} aria-hidden="true"></span>
      {course.name}
    </h2>
    {#if course.type !== 'lecture'}
      <span class="shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
        {courseTypeLabel(course.type)}
      </span>
    {/if}
  </div>

  <p class="mt-0.5 text-xs text-muted-foreground">
    {course.code} · {course.credits}
  </p>

  <ul class="mt-1.5 space-y-0.5">
    {#each course.sessions as session, index (index)}
      <li class="flex flex-wrap gap-x-2 text-[0.8125rem]">
        <span class="min-w-8 font-semibold">{session.day}</span>
        <span class="tabular-nums">{session.start}–{session.end}</span>
        {#if session.room}
          <span class="text-muted-foreground">{session.room}</span>
        {/if}
        {#if session.type === 'lab'}
          <span class="text-muted-foreground">({courseTypeLabel(session.type)})</span>
        {/if}
      </li>
    {/each}
  </ul>

  {#if course.lecturers.length > 0}
    <p class="mt-1.5 text-[0.8125rem]">{course.lecturers.join(' · ')}</p>
  {/if}

  {#if course.prereq}
    <p class="mt-1 text-xs text-muted-foreground">
      Prerequisite: {course.prereq.title} — {course.prereq.met ? 'passed' : 'not yet passed'}
    </p>
  {/if}

  <p class="mt-1.5 border-t pt-1.5 text-xs text-muted-foreground">{examLine}</p>
</article>

<style>
  .course-card {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--card);
    padding: 12px 14px;
    color: var(--card-foreground);
  }

  .cc-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 7px;
    border-radius: 3px;
    vertical-align: 1px;
    background: var(--cat-core);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--foreground) 12%, transparent);
  }

  .cc-dot[data-category='elective'] {
    background: var(--cat-elective);
  }

  .cc-dot[data-category='gened'] {
    background: var(--cat-gened);
  }
</style>
