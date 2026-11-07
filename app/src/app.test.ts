import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import App from './App.svelte'
import { memoryStorage } from './domain/test-utils'
import { createGenedState } from './state/gened.svelte'
import { createPlanState } from './state/plan.svelte'
import { createTermsState } from './state/terms.svelte'

describe('App shell', () => {
  it('renders the CEI Schedule heading', () => {
    const state = createTermsState({ auto: false })
    render(App, { props: { state } })
    expect(screen.getByRole('heading', { name: /CEI Schedule/i })).toBeInTheDocument()
  })

  it('renders the Plan view for the plan hash route', () => {
    window.history.replaceState(null, '', '#/2569-1/y1/plan')
    const state = createTermsState({ auto: false })
    const gened = createGenedState({
      storage: memoryStorage(),
      now: () => 1,
      initial: { t1: { status: 'ready', courses: [], savedAt: 1 } },
    })
    const plan = createPlanState({
      storage: memoryStorage(),
      context: () => ({ terms: state.terms, gened: gened.states }),
      initialEntries: [],
    })

    render(App, { props: { state, planState: plan, genedState: gened } })

    expect(screen.getByRole('heading', { name: /My plan · 1\/2569/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Plan' })).toHaveAttribute('aria-pressed', 'true')
  })
})
