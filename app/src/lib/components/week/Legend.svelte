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
    gap: 4px 16px;
    margin: 0 0 8px;
    font-size: 0.7rem;
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
    margin-right: 5px;
    border-radius: 2px;
    background: var(--cat-core);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--foreground) 12%, transparent);
  }

  .legend-swatch[data-category='elective'] {
    background: var(--cat-elective);
  }

  .legend-swatch[data-category='gened'] {
    background: var(--cat-gened);
  }
</style>
