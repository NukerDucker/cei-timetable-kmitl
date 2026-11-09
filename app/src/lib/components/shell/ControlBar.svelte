<script lang="ts">
  import { onMount } from 'svelte'
  import { Moon, Sun } from 'lucide-svelte'
  import { Segmented } from '$lib/components/ui/segmented'
  import { COHORT_TABS, TERM_TABS } from '../../../state/route.svelte'
  import type { Route, RouteView } from '../../../state/route.svelte'

  interface Props {
    route: Route
    onchange: (patch: Partial<Route>) => void
    /** Warm lazy data (GenEd) before the tab is selected. */
    onprefetch?: (view: RouteView) => void
  }

  let { route, onchange, onprefetch }: Props = $props()

  const VIEW_TABS: readonly { id: RouteView; label: string }[] = [
    { id: 'week', label: 'Week' },
    { id: 'courses', label: 'Courses' },
    { id: 'exams', label: 'Exams' },
    { id: 'plan', label: 'Plan' },
  ]

  const THEME_KEY = 'timetable-theme'
  let dark = $state(false)

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
  <div class="tab-scroll -mx-1 min-w-0 flex-1 overflow-x-auto px-1 py-1">
    <div class="flex w-max items-center gap-2">
      <Segmented items={TERM_TABS} value={route.term} label="Term" onchange={(term) => onchange({ term })} />

      <Segmented items={COHORT_TABS} value={route.cohort} label="Year" onchange={(cohort) => onchange({ cohort })} />

      <Segmented
        items={VIEW_TABS}
        value={route.view}
        label="View"
        onchange={(view) => onchange({ view })}
        onprefetch={onprefetch}
      />
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

<style>
  @media (max-width: 640px) {
    .tab-scroll {
      mask-image: linear-gradient(to right, #000 calc(100% - 20px), transparent);
      -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 20px), transparent);
      padding-right: 20px;
    }
  }
</style>
