import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import App from './App.svelte'

describe('App shell', () => {
  it('renders the CEI Schedule heading', () => {
    render(App)
    expect(screen.getByRole('heading', { name: /CEI Schedule/i })).toBeInTheDocument()
  })
})
