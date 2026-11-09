import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'
import Segmented from './segmented.svelte'

const ITEMS = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
] as const

describe('Segmented', () => {
  it('marks the selected item and reports changes', async () => {
    const onchange = vi.fn()
    render(Segmented, { props: { items: ITEMS, value: 'a', label: 'Term', onchange } })

    expect(screen.getByRole('group', { name: 'Term' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Alpha' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Beta' })).toHaveAttribute('aria-pressed', 'false')

    await fireEvent.click(screen.getByRole('button', { name: 'Beta' }))
    expect(onchange).toHaveBeenCalledWith('b')
  })

  it('warms up an item on focus', async () => {
    const onprefetch = vi.fn()
    render(Segmented, {
      props: { items: ITEMS, value: 'a', label: 'View', onchange: () => {}, onprefetch },
    })

    await fireEvent.focus(screen.getByRole('button', { name: 'Beta' }))
    expect(onprefetch).toHaveBeenCalledWith('b')
  })
})
