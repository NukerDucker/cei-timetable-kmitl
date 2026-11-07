<script lang="ts">
  import { filterActive } from '../../../domain/filters'
  import type { PlanFilter, SortKey } from '../../../domain/filters'
  import { DAY_ORDER } from '../../../domain/time'
  import type { Day } from '../../../domain/types'
  import Button from '../ui/button/button.svelte'

  interface Props {
    filter: PlanFilter
    creditValues: number[]
    onchange: (patch: Partial<PlanFilter>, focus: HTMLElement | null) => void
    onclear: () => void
  }

  let { filter, creditValues, onchange, onclear }: Props = $props()

  const SORT_OPTIONS: readonly { value: SortKey; label: string }[] = [
    { value: 'name', label: 'Name' },
    { value: 'code', label: 'Code' },
    { value: 'time', label: 'Day & time' },
    { value: 'credits', label: 'Credits' },
  ]

  function toggleDay(day: Day, focus: HTMLElement | null): void {
    const days = filter.days.includes(day)
      ? filter.days.filter((value) => value !== day)
      : [...filter.days, day]
    onchange({ days }, focus)
  }
</script>

<div class="space-y-2">
  <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
    <label class="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span>Sort</span>
      <select
        class="min-h-11 rounded-md border bg-card px-2 text-xs text-foreground min-[901px]:min-h-8"
        aria-label="Sort plan courses"
        value={filter.sort}
        onchange={(event) => onchange({ sort: event.currentTarget.value as SortKey }, event.currentTarget)}
      >
        {#each SORT_OPTIONS as option (option.value)}
          <option value={option.value} selected={filter.sort === option.value}>{option.label}</option>
        {/each}
      </select>
    </label>

    <label class="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span>Credits</span>
      <select
        class="min-h-11 rounded-md border bg-card px-2 text-xs text-foreground min-[901px]:min-h-8"
        aria-label="Credits"
        value={filter.credit}
        onchange={(event) => onchange({ credit: event.currentTarget.value }, event.currentTarget)}
      >
        <option value="" selected={filter.credit === ''}>Any</option>
        {#each creditValues as credits (credits)}
          <option value={String(credits)} selected={filter.credit === String(credits)}>
            {credits}
          </option>
        {/each}
      </select>
    </label>

    <label class="inline-flex min-h-11 items-center gap-1.5 text-xs text-foreground min-[901px]:min-h-8">
      <input
        type="checkbox"
        class="size-4 accent-primary"
        checked={filter.hideConflicts}
        onchange={(event) => onchange({ hideConflicts: event.currentTarget.checked }, event.currentTarget)}
      />
      Hide conflicting
    </label>
  </div>

  <div class="flex flex-wrap items-center gap-1" role="group" aria-label="Filter by day">
    {#each DAY_ORDER as day (day)}
      <Button
        type="button"
        size="sm"
        variant={filter.days.includes(day) ? 'default' : 'outline'}
        class="min-h-11 min-w-11 min-[901px]:min-h-8 min-[901px]:min-w-0"
        aria-pressed={filter.days.includes(day)}
        onclick={(event) => toggleDay(day, event.currentTarget)}
      >
        {day}
      </Button>
    {/each}
  </div>

  {#if filterActive(filter)}
    <Button
      type="button"
      size="sm"
      variant="ghost"
      class="min-h-11 min-[901px]:min-h-8"
      onclick={onclear}
    >
      Clear filters
    </Button>
  {/if}
</div>
