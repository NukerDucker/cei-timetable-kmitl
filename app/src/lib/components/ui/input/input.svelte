<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { cn } from '$lib/utils'
  import { inputVariants, type InputVariants } from './input-variants'

  type Props = HTMLInputAttributes & {
    variant?: InputVariants['variant']
    class?: string
    ref?: HTMLInputElement | null
  }

  let {
    class: className = '',
    variant = 'default',
    value = $bindable(),
    ref = $bindable(null),
    ...rest
  }: Props = $props()
</script>

<input bind:this={ref} bind:value class={cn(inputVariants({ variant }), className)} {...rest} />
