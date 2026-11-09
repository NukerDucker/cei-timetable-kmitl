<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '$lib/utils'
  import { cardVariants, type CardVariants } from './card-variants'

  type Props = HTMLAttributes<HTMLElement> & {
    /** Rendered element. Use `section` when the card needs a landmark label. */
    as?: keyof HTMLElementTagNameMap
    variant?: CardVariants['variant']
    class?: string
    children?: Snippet
  }

  let {
    as = 'div',
    class: className = '',
    variant = 'default',
    children,
    ...rest
  }: Props = $props()
</script>

<svelte:element this={as} class={cn(cardVariants({ variant }), className)} {...rest}>
  {@render children?.()}
</svelte:element>
