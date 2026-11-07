import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import App from './App.svelte'
import { createTermsState } from './state/terms.svelte'

describe('App shell', () => {
  it('renders the CEI Schedule heading', () => {
    const state = createTermsState({ auto: false })
    render(App, { props: { state } })
    expect(screen.getByRole('heading', { name: /CEI Schedule/i })).toBeInTheDocument()
  })
})
