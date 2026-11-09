import { cva, type VariantProps } from 'class-variance-authority'

export const cardVariants = cva('rounded-2xl bg-card text-card-foreground', {
  variants: {
    variant: {
      default: 'border shadow-card',
      borderless: 'shadow-card',
    },
  },
  defaultVariants: { variant: 'default' },
})

export type CardVariants = VariantProps<typeof cardVariants>
