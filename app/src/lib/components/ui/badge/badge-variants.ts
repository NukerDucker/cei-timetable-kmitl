import { cva, type VariantProps } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center whitespace-nowrap rounded-full border px-1.5 py-0.5 text-eyebrow font-medium leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        block: 'border-transparent bg-black/20',
        room: 'border-transparent bg-transparent px-0 py-0',
        tag: 'border-transparent bg-black/20',
        lab: 'border-white/35 bg-transparent',
        ta: 'border-transparent bg-black/20',
        conflict: 'border-transparent bg-black/20',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
