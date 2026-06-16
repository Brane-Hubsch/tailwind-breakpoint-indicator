# tailwind-breakpoint-indicator

A tiny React component that renders the active Tailwind CSS breakpoint in the bottom-left corner of the viewport.

It is based on the `TailwindIndicator` used in FacilityMonster. The original behavior is preserved: if you do not pass `enabled`, the indicator only renders when `NEXT_PUBLIC_ENV=dev`.

Click the indicator to hide it for the current page load. It does not write to local storage or session storage, so refreshing the page brings it back.

## Install

```sh
npm install tailwind-breakpoint-indicator
```

React is a peer dependency, so install it in the consuming app if it is not already present.

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

By default this mirrors FacilityMonster and renders only when:

```env
NEXT_PUBLIC_ENV=dev
```

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

You can also use the FacilityMonster-compatible alias:

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

## Tailwind Setup

This package intentionally uses Tailwind classes, just like the FacilityMonster component. Make sure Tailwind scans the package output so these classes are generated.

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

The component does not measure the viewport in JavaScript. It renders one label per breakpoint and lets Tailwind's responsive visibility utilities decide which one is visible:

```tsx
<div className="block sm:hidden">xs</div>
<div className="hidden sm:block md:hidden">sm</div>
<div className="hidden md:block lg:hidden">md</div>
<div className="hidden lg:block xl:hidden">lg</div>
<div className="hidden xl:block 2xl:hidden">xl</div>
<div className="hidden 2xl:block">2xl</div>
```

The hide interaction is intentionally temporary:

```tsx
onClick={(event) => {
  event.currentTarget.hidden = true
}}
```
