<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { cn } from '$lib/utils'
  import { inputVariants, type InputVariants } from './input-variants'

  type Props = HTMLInputAttributes & {
    variant?: InputVariants['variant']
    class?: string
  }

  let {
    class: className = '',
    variant = 'default',
    value = $bindable(),
    ...rest
  }: Props = $props()
</script>

<input bind:value class={cn(inputVariants({ variant }), className)} {...rest} />
