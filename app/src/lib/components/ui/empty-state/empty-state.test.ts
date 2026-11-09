import { render, screen } from '@testing-library/svelte'
import { createRawSnippet } from 'svelte'
import { describe, expect, it } from 'vitest'
import EmptyState from './empty-state.svelte'

describe('EmptyState', () => {
  it('renders as a polite status with the muted body style', () => {
    const children = createRawSnippet(() => ({ render: () => '<span>No results</span>' }))
    render(EmptyState, { props: { children } })

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('No results')
    expect(status.className).toContain('text-muted-foreground')
  })
})
