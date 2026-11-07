<script lang="ts">
  import CourseCard from './CourseCard.svelte'
  import type { Course } from '../../../domain/types'

  interface Props {
    courses: Course[]
    /** Accessible label for the search input, e.g. `1/2569 · 3rd Year`. */
    label?: string
  }

  let { courses, label = 'Courses' }: Props = $props()

  let query = $state('')

  function searchText(course: Course): string {
    return [
      course.name,
      course.code,
      course.credits,
      course.lecturers.join(' '),
      course.sessions
        .map((session) => `${session.day} ${session.start} ${session.end} ${session.room ?? ''} ${session.type ?? ''}`)
        .join(' '),
    ]
      .join(' ')
      .toLowerCase()
  }

  function filterCourses(source: Course[], value: string): Course[] {
    const needle = value.trim().toLowerCase()
    if (!needle) return source
    return source.filter((course) => searchText(course).includes(needle))
  }

  const filtered = $derived(filterCourses(courses, query))
</script>

<div class="course-tools">
  <input
    type="search"
    class="course-search"
    placeholder="Search course, code, lecturer, room"
    aria-label={`Search courses for ${label}`}
    bind:value={query}
  />
  <span class="count" aria-live="polite">
    {filtered.length}
    {filtered.length === 1 ? 'course' : 'courses'}
  </span>
</div>

{#if filtered.length === 0}
  <p class="empty" role="status">No courses match that search.</p>
{:else}
  <div class="course-list">
    {#each filtered as course (course.code)}
      <CourseCard {course} />
    {/each}
  </div>
{/if}

<style>
  .course-tools {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 2px 0 12px;
  }

  .course-search {
    flex: 1;
    min-width: 0;
    min-height: 44px;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--background);
    color: var(--foreground);
    font: inherit;
    font-size: 0.875rem;
  }

  @media (min-width: 640px) {
    .course-search {
      min-height: 40px;
    }
  }

  .count {
    flex: none;
    font-size: 0.75rem;
    color: var(--muted-foreground);
    white-space: nowrap;
  }

  .course-list {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }

  @media (min-width: 760px) {
    .course-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 1000px) {
    .course-list {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .empty {
    padding: 16px 0;
    font-size: 0.875rem;
    color: var(--muted-foreground);
  }
</style>
