<script lang="ts">
  import { MapPin } from 'lucide-svelte'
  import { Badge } from '$lib/components/ui/badge'
  import { Card } from '$lib/components/ui/card'
  import { categoryLabel, courseCategory, courseColorToken } from '../../../domain/categories'
  import type { Course } from '../../../domain/types'
  import { examDateOrNote } from '$lib/labels'

  interface Props {
    course: Course
  }

  let { course }: Props = $props()

  const category = $derived(courseCategory(course))
  const firstSession = $derived(course.sessions[0])
  const extraSessions = $derived(course.sessions.slice(1))
  const rooms = $derived([...new Set(course.sessions.map((session) => session.room).filter((room): room is string => !!room))])
  const hasLab = $derived(course.type === 'lab' || course.sessions.some((session) => session.type === 'lab'))
  const ownerSummary = $derived.by(() => {
    const [first, ...rest] = course.lecturers
    if (!first) return ''
    return rest.length > 0 ? `${first} +${rest.length}` : first
  })
  const ownerTitle = $derived(course.lecturers.join(' · '))
  const initials = $derived.by(() => {
    const first = course.lecturers[0]
    if (!first) return ''
    const parts = first.split(/\s+/).filter(Boolean)
    return `${parts[0]?.[0] ?? ''}${parts.length > 1 ? parts[parts.length - 1][0] : ''}`.toUpperCase()
  })
  const examLine = $derived.by(() => {
    const { mid, final, midNote, finalNote } = course.exams
    if (mid || final) {
      return `Mid ${examDateOrNote(mid, midNote)} · Final ${examDateOrNote(final, finalNote)}`
    }
    return `Exams: ${midNote || 'By instructor'}`
  })
</script>

<Card as="article" class="flex flex-col gap-1 p-2.5 sm:gap-1.5 sm:p-4">
  <header class="flex items-start justify-between gap-3">
    <p class="flex items-baseline gap-1.5 text-xs text-muted-foreground tabular-nums">
      {#if firstSession}
        <span>{firstSession.day} {firstSession.start}–{firstSession.end}</span>
        {#if extraSessions.length > 0}
          <span class="text-muted-foreground/70">+{extraSessions.length}</span>
        {/if}
      {:else}
        <span>Time TBA</span>
      {/if}
    </p>
    <span class="inline-flex shrink-0 items-center gap-1.5 text-eyebrow font-medium text-muted-foreground">
      <span
        class="cc-status-dot size-1.5 rounded-full"
        data-category={category}
        style={`background: var(--${courseColorToken(course)})`}
        aria-hidden="true"
      ></span>
      {categoryLabel(category)}
    </span>
  </header>

  <div>
    <h2 class="text-body font-semibold leading-tight tracking-[-0.01em]">{course.name}</h2>
    <p class="mt-0.5 text-xs text-muted-foreground">{course.code} · {course.credits}</p>
  </div>

  <p class="flex min-w-0 items-center gap-1.5 text-dense text-muted-foreground">
    <MapPin class="size-3.5 shrink-0" aria-hidden="true" />
    <span class="truncate" title={rooms.join(' · ')}>{rooms.join(' · ') || 'Room TBA'}</span>
  </p>

  {#if extraSessions.length > 0}
    <ul class="space-y-0.5 text-xs text-muted-foreground">
      {#each extraSessions as session, index (index)}
        <li class="flex flex-wrap gap-x-2 tabular-nums">
          <span>{session.day} {session.start}–{session.end}</span>
          {#if session.room}<span>{session.room}</span>{/if}
          {#if session.type === 'lab'}<span>Lab</span>{/if}
        </li>
      {/each}
    </ul>
  {/if}

  {#if course.lecturers.length > 0 || hasLab}
    <div class="flex min-w-0 items-center justify-between gap-2">
      {#if course.lecturers.length > 0}
        <div class="flex min-w-0 items-center gap-2">
          <span
            class="cc-avatar grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground"
            title={ownerTitle}
            aria-hidden="true"
          >{initials}</span>
          <span class="truncate text-dense" title={ownerTitle}>{ownerSummary}</span>
        </div>
      {/if}
      {#if hasLab}
        <Badge variant="secondary" class="shrink-0">Lab</Badge>
      {/if}
    </div>
  {/if}

  {#if course.prereq}
    <p class="text-xs text-muted-foreground">
      Prerequisite: {course.prereq.title} — {course.prereq.met ? 'passed' : 'not yet passed'}
    </p>
  {/if}

  <p class="hidden border-t pt-1.5 text-xs text-muted-foreground sm:block">{examLine}</p>
</Card>

<style>
  .cc-status-dot {
    display: inline-block;
    flex: none;
  }
</style>
