import { beforeEach, describe, expect, it } from 'vitest'
import {
  DEFAULT_ROUTE,
  RouteState,
  parseRoute,
  routeHash,
  termConfigForKey,
} from './route.svelte'

describe('parseRoute', () => {
  it('parses a full hash route', () => {
    expect(parseRoute('#/2569-1/y3/plan')).toEqual({
      term: 't1',
      cohort: 'y3',
      view: 'plan',
    })
  })

  it('maps the second term to its domain id', () => {
    expect(parseRoute('#/2569-2/y4/exams')).toEqual({
      term: 't2',
      cohort: 'y4',
      view: 'exams',
    })
  })

  it('accepts a hash without the leading slash', () => {
    expect(parseRoute('#2569-1/y2/courses')).toEqual({
      term: 't1',
      cohort: 'y2',
      view: 'courses',
    })
  })

  it.each([
    ['empty', ''],
    ['hash only', '#'],
    ['missing segments', '#/2569-1/y3'],
    ['extra segments', '#/2569-1/y3/week/extra'],
    ['unknown term', '#/9999-1/y3/week'],
    ['unknown cohort', '#/2569-1/y5/week'],
    ['unknown view', '#/2569-1/y3/calendar'],
  ])('falls back for %s', (_label, hash) => {
    expect(parseRoute(hash)).toEqual(DEFAULT_ROUTE)
  })
})

describe('routeHash', () => {
  it('serialises the domain term id back to a hash key', () => {
    expect(routeHash({ term: 't1', cohort: 'y1', view: 'week' })).toBe('#/2569-1/y1/week')
    expect(routeHash({ term: 't2', cohort: 'y3', view: 'plan' })).toBe('#/2569-2/y3/plan')
  })
})

describe('term config mapping', () => {
  it('resolves route keys to TERM_CONFIG ids', () => {
    expect(termConfigForKey('2569-1')?.id).toBe('t1')
    expect(termConfigForKey('2569-2')?.id).toBe('t2')
    expect(termConfigForKey('2568-1')).toBeNull()
  })
})

describe('RouteState', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '#/')
  })

  it('reads the initial hash and replaces it on change', () => {
    window.history.replaceState(null, '', '#/2569-2/y2/courses')
    const store = new RouteState(window)
    expect(store.current).toEqual({ term: 't2', cohort: 'y2', view: 'courses' })

    store.set({ cohort: 'y4', view: 'exams' })
    expect(store.current).toEqual({ term: 't2', cohort: 'y4', view: 'exams' })
    expect(window.location.hash).toBe('#/2569-2/y4/exams')
    store.dispose()
  })

  it('restores state on popstate', () => {
    const store = new RouteState(window)
    window.history.replaceState(null, '', '#/2569-1/y3/plan')
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(store.current).toEqual({ term: 't1', cohort: 'y3', view: 'plan' })
    store.dispose()
  })
})
