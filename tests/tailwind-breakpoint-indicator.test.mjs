import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  TailwindBreakpointIndicator,
  TailwindIndicator,
} from '../dist/index.js'
import { jsx } from 'react/jsx-runtime'

describe('TailwindBreakpointIndicator', () => {
  const originalEnv = process.env.NEXT_PUBLIC_ENV

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_ENV
    } else {
      process.env.NEXT_PUBLIC_ENV = originalEnv
    }
  })

  it('renders all default breakpoint labels when enabled', () => {
    const html = renderToStaticMarkup(
      jsx(TailwindBreakpointIndicator, { enabled: true }),
    )

    assert.match(html, /xs/)
    assert.match(html, /sm/)
    assert.match(html, /md/)
    assert.match(html, /lg/)
    assert.match(html, /xl/)
    assert.match(html, /2xl/)
    assert.match(html, /0 px/)
  })

  it('renders nothing when disabled', () => {
    const html = renderToStaticMarkup(
      jsx(TailwindBreakpointIndicator, { enabled: false }),
    )

    assert.equal(html, '')
  })

  it('uses NEXT_PUBLIC_ENV=dev as the default visibility gate', () => {
    process.env.NEXT_PUBLIC_ENV = 'dev'

    const html = renderToStaticMarkup(jsx(TailwindBreakpointIndicator, {}))

    assert.match(html, /Tailwind breakpoint indicator/)
  })

  it('does not render by default outside the dev environment', () => {
    process.env.NEXT_PUBLIC_ENV = 'production'

    const html = renderToStaticMarkup(jsx(TailwindBreakpointIndicator, {}))

    assert.equal(html, '')
  })

  it('supports custom labels and wrapper classes', () => {
    const html = renderToStaticMarkup(
      jsx(TailwindBreakpointIndicator, {
        className: 'shadow-xl',
        enabled: true,
        labels: { xs: 'base', '2xl': 'wide' },
      }),
    )

    assert.match(html, /base/)
    assert.match(html, /wide/)
    assert.match(html, /shadow-xl/)
  })

  it('renders the fixed bottom-left positioning inline', () => {
    const html = renderToStaticMarkup(
      jsx(TailwindBreakpointIndicator, { enabled: true }),
    )

    assert.match(html, /position:fixed/)
    assert.match(html, /left:8px/)
    assert.match(html, /bottom:8px/)
    assert.match(html, /z-index:100000000000/)
  })

  it('renders the hover width label styles inline', () => {
    const html = renderToStaticMarkup(
      jsx(TailwindBreakpointIndicator, { enabled: true }),
    )

    assert.match(html, /left:40px/)
    assert.match(html, /top:50%/)
    assert.match(html, /opacity:0/)
    assert.match(html, /translate\(4px, -50%\)/)
  })

  it('exports a TailwindIndicator alias', () => {
    assert.equal(TailwindIndicator, TailwindBreakpointIndicator)
  })
})
