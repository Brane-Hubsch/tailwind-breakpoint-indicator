# tailwind-breakpoint-indicator

A tiny React component that renders the active Tailwind CSS breakpoint in the bottom-left corner of the viewport.

It matches the Facility Monster-style indicator:

- a small dark circle in the bottom-left corner
- the active breakpoint label inside
- an exact pixel-width label on hover/focus
- click to hide for the current page load

If you do not pass `enabled`, the indicator renders only when `NEXT_PUBLIC_ENV=dev`.

## Install

```sh
npm install tailwind-breakpoint-indicator
```

React is a peer dependency, so install it in the consuming app if it is not already present.

If you install directly from a Git URL instead of the npm registry, the repo now rebuilds `dist/` through `prepare`, which avoids the old "package.json points at dist but dist is missing" problem.

## Quick Start

```tsx
import { TailwindBreakpointIndicator } from 'tailwind-breakpoint-indicator'

export function App() {
  return (
    <>
      <TailwindBreakpointIndicator />
      {/* your app */}
    </>
  )
}
```

By default, the indicator renders only when:

```env
NEXT_PUBLIC_ENV=dev
```

## Demo

This repo includes a small local demo in [`demo/`](./demo).

From the repo root:

```sh
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173/demo/
```

The demo lives in the same repo as the package and mirrors the current package behavior.

## Next.js

Add the environment flag:

```env
NEXT_PUBLIC_ENV=dev
```

Render the component anywhere near the root of your app:

```tsx
import { TailwindBreakpointIndicator } from 'tailwind-breakpoint-indicator'

export default function Page() {
  return (
    <main>
      <TailwindBreakpointIndicator />
      {/* page content */}
    </main>
  )
}
```

You can also use the shorter alias:

```tsx
import { TailwindIndicator } from 'tailwind-breakpoint-indicator'
```

## Vite or Generic React

Most non-Next apps should pass `enabled` explicitly:

```tsx
import { TailwindBreakpointIndicator } from 'tailwind-breakpoint-indicator'

export function App() {
  return <TailwindBreakpointIndicator enabled={import.meta.env.DEV} />
}
```

You can wire this to any flag you prefer:

```tsx
<TailwindBreakpointIndicator enabled={import.meta.env.VITE_SHOW_BREAKPOINTS === 'true'} />
```

## Why The Indicator Sometimes "Doesn't Show Up"

The two most common reasons are:

1. The component is not enabled in that environment.
2. Tailwind never generated the package classes.

If you do not see the dot at all in a consuming app, check Tailwind scanning first.

## Tailwind Setup

This package intentionally uses Tailwind classes. Make sure Tailwind scans the package output so these classes are generated.

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/tailwind-breakpoint-indicator/dist/**/*.{js,cjs,mjs}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

If your setup does not scan dependencies, safelist the classes used by the indicator:

```js
export default {
  safelist: [
    'group',
    'fixed',
    'bottom-1',
    'left-1',
    'z-[100000000000]',
    'flex',
    'h-6',
    'w-6',
    'cursor-pointer',
    'select-none',
    'items-center',
    'justify-center',
    'rounded-full',
    'border-0',
    'bg-[rgba(0,0,0,0.4)]',
    'p-4',
    'font-mono',
    'text-xs',
    'text-white',
    'relative',
    'appearance-none',
    'block',
    'hidden',
    'sm:hidden',
    'sm:block',
    'md:hidden',
    'md:block',
    'lg:hidden',
    'lg:block',
    'xl:hidden',
    'xl:block',
    '2xl:hidden',
    '2xl:block',
    'pointer-events-none',
    'absolute',
    'left-10',
    'top-1/2',
    'whitespace-nowrap',
    'rounded-[6px]',
    'bg-[rgba(0,0,0,0.78)]',
    'px-2',
    'py-[6px]',
    'leading-none',
    'opacity-0',
    '-translate-y-1/2',
    'translate-x-1',
    'translate-x-0',
    'transition-all',
    'duration-150',
    'group-hover:translate-x-0',
    'group-hover:opacity-100',
    'group-focus-visible:translate-x-0',
    'group-focus-visible:opacity-100',
  ],
}
```

## Props

```ts
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface TailwindBreakpointIndicatorProps {
  enabled?: boolean
  className?: string
  labels?: Partial<Record<Breakpoint, string>>
}
```

### `enabled`

Controls whether the indicator renders.

If omitted, the component checks:

```ts
process.env.NEXT_PUBLIC_ENV === 'dev'
```

### `className`

Adds extra classes to the outer wrapper.

```tsx
<TailwindBreakpointIndicator enabled className="bottom-4 left-4" />
```

### `labels`

Overrides one or more breakpoint labels.

```tsx
<TailwindBreakpointIndicator
  enabled
  labels={{
    xs: 'base',
    '2xl': 'wide',
  }}
/>
```

## Local Development

```sh
npm install
npm run typecheck
npm test
npm run build
```

Run everything:

```sh
npm run verify
```

## How It Works

The active breakpoint label still comes from Tailwind's responsive visibility utilities:

```tsx
<span className="block sm:hidden">xs</span>
<span className="hidden sm:block md:hidden">sm</span>
<span className="hidden md:block lg:hidden">md</span>
<span className="hidden lg:block xl:hidden">lg</span>
<span className="hidden xl:block 2xl:hidden">xl</span>
<span className="hidden 2xl:block">2xl</span>
```

The exact viewport width uses `window.innerWidth` and updates on resize.

The hide interaction is intentionally temporary for the current page load only.
