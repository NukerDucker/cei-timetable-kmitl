<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '$lib/utils'
  import { badgeVariants, type BadgeVariants } from './badge-variants'

  type Props = HTMLAttributes<HTMLSpanElement> & {
    variant?: BadgeVariants['variant']
    class?: string
    children?: Snippet
  }

  let { class: className = '', variant = 'default', children, ...rest }: Props = $props()
</script>

<span class={cn(badgeVariants({ variant }), className)} {...rest}>
  {@render children?.()}
</span>
