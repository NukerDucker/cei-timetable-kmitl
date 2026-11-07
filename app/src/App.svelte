<script lang="ts">
  import { TriangleAlert } from 'lucide-svelte'
  import Button from '$lib/components/ui/button/button.svelte'
</script>

<main class="min-h-dvh bg-background text-foreground">
  <div class="mx-auto max-w-[1400px] p-3 sm:p-5">
    <header class="flex flex-wrap items-center gap-3 rounded-lg border bg-card px-4 py-3">
      <div class="min-w-0">
        <p class="text-[0.62rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
          KMITL · Faculty of Engineering
        </p>
        <h1 class="text-2xl font-bold leading-tight tracking-tight">CEI Schedule</h1>
      </div>
      <div class="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm"><TriangleAlert />Scaffold</Button>
        <Button size="sm">Plan</Button>
      </div>
    </header>
    <p class="mt-3 text-xs text-muted-foreground">
      Svelte + Tailwind + shadcn-svelte scaffold. Timetable views port next.
    </p>
  </div>
</main>
