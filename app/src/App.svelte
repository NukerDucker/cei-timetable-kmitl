<script lang="ts">
  import { Moon, Sun, TriangleAlert } from 'lucide-svelte'
  import Button from '$lib/components/ui/button/button.svelte'

  let dark = $state(false)
  function toggleTheme() {
    dark = !dark
    document.documentElement.classList.toggle('dark', dark)
  }
</script>

<main class="min-h-dvh bg-background text-foreground">
  <header class="material-bar sticky top-0 z-10 border-b">
    <div class="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-3">
      <div class="min-w-0">
        <p class="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          KMITL · Faculty of Engineering
        </p>
        <h1 class="text-[1.75rem] font-bold leading-tight tracking-[-0.02em]">CEI Schedule</h1>
      </div>
      <div class="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm"><TriangleAlert />Scaffold</Button>
        <Button variant="outline" size="icon" aria-label={dark ? 'Use light appearance' : 'Use dark appearance'} onclick={toggleTheme}>
          {#if dark}<Sun />{:else}<Moon />{/if}
        </Button>
        <Button size="sm">Plan</Button>
      </div>
    </div>
  </header>

  <div class="mx-auto max-w-[1400px] px-4 py-4">
    <section class="rounded-xl bg-card p-4 shadow-card">
      <p class="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">Scaffold</p>
      <p class="mt-1 text-sm text-card-foreground">
        Apple-native tokens active. Timetable views port next.
      </p>
    </section>
  </div>
</main>
