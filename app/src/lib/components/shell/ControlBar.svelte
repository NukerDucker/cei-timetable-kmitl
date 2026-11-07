<script lang="ts">
  import { onMount } from 'svelte'
  import { Moon, Sun } from 'lucide-svelte'
  import { cn } from '$lib/utils'
  import { COHORT_TABS, TERM_TABS } from '../../../state/route.svelte'
  import type { Route, RouteView } from '../../../state/route.svelte'

  interface Props {
    route: Route
    onchange: (patch: Partial<Route>) => void
  }

  let { route, onchange }: Props = $props()

  const VIEW_TABS: readonly { id: RouteView; label: string }[] = [
    { id: 'week', label: 'Week' },
    { id: 'courses', label: 'Courses' },
    { id: 'exams', label: 'Exams' },
  ]

  const THEME_KEY = 'timetable-theme'
  let dark = $state(false)

  function tabClass(active: boolean): string {
    return cn(
      'inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg px-3 text-[0.78rem] font-medium transition-colors sm:min-h-8 sm:px-2.5 sm:text-xs',
      active
        ? 'bg-card text-foreground shadow-card'
        : 'text-muted-foreground hover:text-foreground',
    )
  }

  function applyTheme(): void {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('dark', dark)
  }

  function toggleTheme(): void {
    dark = !dark
    applyTheme()
    try {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
    } catch {
      // Storage unavailable (private mode); the in-memory choice still applies.
    }
  }

  onMount(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(THEME_KEY)
    } catch {
      saved = null
    }
    if (saved === 'light' || saved === 'dark') {
      dark = saved === 'dark'
    } else if (typeof window.matchMedia === 'function') {
      dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  })
</script>

<nav aria-label="Timetable controls" class="flex items-center gap-2">
  <div class="-mx-1 min-w-0 flex-1 overflow-x-auto px-1 py-1">
    <div class="flex w-max items-center gap-2">
      <div class="flex shrink-0 gap-0.5 rounded-xl bg-muted p-0.5" role="group" aria-label="Term">
        {#each TERM_TABS as tab (tab.id)}
          <button
            type="button"
            class={tabClass(route.term === tab.id)}
            aria-pressed={route.term === tab.id}
            onclick={() => onchange({ term: tab.id })}
          >
            {tab.label}
          </button>
        {/each}
      </div>

      <div class="flex shrink-0 gap-0.5 rounded-xl bg-muted p-0.5" role="group" aria-label="Year">
        {#each COHORT_TABS as tab (tab.id)}
          <button
            type="button"
            class={tabClass(route.cohort === tab.id)}
            aria-pressed={route.cohort === tab.id}
            onclick={() => onchange({ cohort: tab.id })}
          >
            {tab.label}
          </button>
        {/each}
      </div>

      <div class="flex shrink-0 gap-0.5 rounded-xl bg-muted p-0.5" role="group" aria-label="View">
        {#each VIEW_TABS as tab (tab.id)}
          <button
            type="button"
            class={tabClass(route.view === tab.id)}
            aria-pressed={route.view === tab.id}
            onclick={() => onchange({ view: tab.id })}
          >
            {tab.label}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <button
    type="button"
    class="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border bg-card text-foreground transition-colors hover:bg-muted/60 sm:size-9"
    aria-label={dark ? 'Use light appearance' : 'Use dark appearance'}
    title={dark ? 'Use light appearance' : 'Use dark appearance'}
    onclick={toggleTheme}
  >
    {#if dark}
      <Sun class="size-4" />
    {:else}
      <Moon class="size-4" />
    {/if}
  </button>
</nav>
