import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import Input from './input.svelte'

describe('Input', () => {
  it('forwards attributes and accepts bound input', async () => {
    render(Input, { props: { type: 'search', 'aria-label': 'Search courses', value: 'a' } })
    const input = screen.getByRole('searchbox', { name: 'Search courses' })

    expect(input).toHaveValue('a')
    await fireEvent.input(input, { target: { value: 'ab' } })
    expect(input).toHaveValue('ab')
  })

  it('applies the card variant and caller classes', () => {
    render(Input, { props: { variant: 'card', class: 'mt-2' } })
    const input = screen.getByRole('textbox')

    expect(input.className).toContain('bg-card')
    expect(input.className).toContain('mt-2')
  })
})
