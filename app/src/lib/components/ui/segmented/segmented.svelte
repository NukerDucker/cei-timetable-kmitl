<script lang="ts" generics="T extends string">
  import { cn } from '$lib/utils'

  interface Props {
    items: readonly { id: T; label: string }[]
    value: T
    /** Accessible name for the radio group. */
    label: string
    onchange: (id: T) => void
    /** Optional warm-up hook fired on hover, focus, or touch. */
    onprefetch?: (id: T) => void
    class?: string
  }

  let { items, value, label, onchange, onprefetch, class: className = '' }: Props = $props()

  const ITEM_CLASS =
    'inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg px-3 text-[0.78rem] font-medium transition-colors sm:min-h-8 sm:px-2.5 sm:text-xs'

  function itemClass(active: boolean): string {
    return cn(
      ITEM_CLASS,
      active ? 'bg-card text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground',
    )
  }
</script>

<div class={cn('flex shrink-0 gap-0.5 rounded-xl bg-muted p-0.5', className)} role="group" aria-label={label}>
  {#each items as item (item.id)}
    {@const prefetch = onprefetch ? () => onprefetch(item.id) : undefined}
    <button
      type="button"
      class={itemClass(value === item.id)}
      aria-pressed={value === item.id}
      onclick={() => onchange(item.id)}
      onpointerenter={prefetch}
      onfocus={prefetch}
      ontouchstart={prefetch}
    >
      {item.label}
    </button>
  {/each}
</div>
