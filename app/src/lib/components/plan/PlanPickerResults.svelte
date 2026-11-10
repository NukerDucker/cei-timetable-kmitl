<script lang="ts">
  import { Plus, User } from 'lucide-svelte'
  import { cn } from '$lib/utils'
  import Badge from '$lib/components/ui/badge/badge.svelte'
  import Button from '../ui/button/button.svelte'
  import type { PickerGroup, PickerOption, PickerSection } from '../../../domain/planOptions'

  interface Props {
    groups: readonly PickerGroup[]
    onadd: (option: PickerOption) => void
  }

  let { groups, onadd }: Props = $props()

  function sectionSessions(option: PickerOption) {
    const section = option.course.sections.find(
      (candidate) => candidate.number === option.sectionNumber,
    )
    return section?.sessions ?? option.course.sessions
  }

  function isLabSection(option: PickerOption): boolean {
    const sessions = sectionSessions(option)
    if (option.course.type === 'lab') return true
    return sessions.length > 0 && sessions.every((session) => session.type === 'lab')
  }

  function sectionGroups(subjectItems: readonly PickerSection[]) {
    return [
      { key: 'theory', label: 'Theory', items: subjectItems.filter((item) => !isLabSection(item)) },
      { key: 'lab', label: 'Lab', items: subjectItems.filter((item) => isLabSection(item)) },
    ].filter((group) => group.items.length > 0)
  }
</script>

{#each groups as group (group.key)}
  <h4 class="mt-2 text-[0.66rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
    {group.label}
  </h4>
  <ul class="mt-1.5 space-y-1.5">
    {#each group.subjects as subject (subject.code)}
      {@const lecturers = [...new Set(subject.items.flatMap((item) => item.course.lecturers))]}
      {@const kinds = sectionGroups(subject.items)}
      <li class="rounded-xl border border-control-border/60 bg-background/50 p-2">
        <div class="flex min-w-0 items-center gap-2">
          <span class="truncate text-sm font-semibold">{subject.name}</span>
          <span class="ml-auto shrink-0 text-xs text-muted-foreground">
            {subject.code}{subject.items[0]?.course.credits
              ? ` · ${subject.items[0].course.credits}`
              : ''}
          </span>
        </div>
        {#if lecturers.length > 0}
          <p
            class="mt-0.5 flex min-w-0 items-center gap-1 truncate text-xs text-muted-foreground"
            title={lecturers.join(' · ')}
          >
            <User class="size-3 shrink-0" aria-hidden="true" />
            <span class="truncate">
              {lecturers[0]}{lecturers.length > 1 ? ` +${lecturers.length - 1}` : ''}
            </span>
          </p>
        {/if}
        <div class="mt-1.5 space-y-1.5">
          {#each kinds as kind (kind.key)}
            {#if kinds.length > 1}
              <p class="text-eyebrow font-semibold uppercase tracking-eyebrow text-muted-foreground">
                {kind.label}
              </p>
            {/if}
            {#each kind.items as option (option.key)}
            <div
              class={cn(
                'relative rounded-lg border-l-[3px] bg-muted/40 p-1.5 pr-11',
                option.warnings.length > 0 ? 'border-l-destructive' : 'border-l-transparent',
              )}
              data-plan-option={option.key}
            >
              <div class="flex min-w-0 items-center gap-2">
                <Badge variant="outline" class="shrink-0 text-xs">
                  S{option.sectionNumber}
                </Badge>
                <span class="truncate text-xs text-muted-foreground">
                  {sectionSessions(option)
                    .map(
                      (session) =>
                        `${session.day} ${session.start}–${session.end}${session.room ? ` · ${session.room}` : ''}`,
                    )
                    .join(' / ')}
                </span>
              </div>
              {#if option.warnings.length > 0}
                <span class="sr-only">
                  Conflicts: {option.warnings.join('; ')}
                </span>
              {/if}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                class="absolute right-1 top-1/2 size-11 -translate-y-1/2 min-[901px]:size-8"
                aria-label={`Add ${subject.name} section ${option.sectionNumber} to plan${option.warnings.length > 0 ? ', conflicts with the current plan' : ''}`}
                onclick={() => onadd(option)}
              >
                <Plus class="size-4" aria-hidden="true" />
              </Button>
            </div>
          {/each}
          {/each}
        </div>
      </li>
    {/each}
  </ul>
{/each}
