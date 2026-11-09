import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import Card from './card.svelte'

describe('Card', () => {
  it('renders the default raised surface', () => {
    const { container } = render(Card)
    const el = container.firstElementChild as HTMLElement

    expect(el.tagName).toBe('DIV')
    expect(el.className).toContain('rounded-2xl')
    expect(el.className).toContain('border')
    expect(el.className).toContain('shadow-card')
  })

  it('drops the border and honours the requested element and class', () => {
    const { container } = render(Card, {
      props: { as: 'section', variant: 'borderless', class: 'p-4' },
    })
    const el = container.firstElementChild as HTMLElement

    expect(el.tagName).toBe('SECTION')
    expect(el.className).not.toMatch(/\bborder\b/)
    expect(el.className).toContain('p-4')
  })
})
