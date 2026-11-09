import { cva, type VariantProps } from 'class-variance-authority'

export const inputVariants = cva(
  'min-h-11 w-full rounded-lg border bg-background px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-10',
  {
    variants: {
      variant: {
        default: 'bg-background',
        card: 'bg-card',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export type InputVariants = VariantProps<typeof inputVariants>
