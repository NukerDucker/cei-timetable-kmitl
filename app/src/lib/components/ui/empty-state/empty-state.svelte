<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '$lib/utils'

  type Props = HTMLAttributes<HTMLParagraphElement> & {
    class?: string
    children?: Snippet
  }

  let { class: className = '', children, ...rest }: Props = $props()
</script>

<p class={cn('py-4 text-sm text-muted-foreground', className)} role="status" {...rest}>
  {@render children?.()}
</p>
