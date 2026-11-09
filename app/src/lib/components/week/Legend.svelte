<script lang="ts">
  const ITEMS: readonly { category: 'core' | 'elective' | 'gened'; label: string }[] = [
    { category: 'core', label: 'Core' },
    { category: 'elective', label: 'CEI elective' },
    { category: 'gened', label: 'Gen Ed' },
  ]
</script>

<div class="legend" role="group" aria-label="Course category legend">
  {#each ITEMS as item (item.category)}
    <span class="legend-item">
      <i class="legend-swatch" data-category={item.category} aria-hidden="true"></i>
      {item.label}
    </span>
  {/each}
</div>

<style>
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1rem;
    margin: 0 0 0.5rem;
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
  }

  .legend-swatch {
    display: inline-block;
    flex: none;
    width: 9px;
    height: 9px;
    margin-right: 0.25rem;
    border: 1px solid color-mix(in srgb, var(--foreground) 12%, transparent);
    border-radius: var(--radius-full);
    background: var(--cat-core);
  }

  .legend-swatch[data-category='elective'] {
    background: var(--cat-elective);
  }

  .legend-swatch[data-category='gened'] {
    background: var(--cat-gened);
  }
</style>
