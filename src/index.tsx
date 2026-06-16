import { useEffect, useState } from 'react'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type BreakpointLabels = Partial<Record<Breakpoint, string>>

export interface TailwindBreakpointIndicatorProps {
  /**
   * Controls whether the indicator renders.
   *
   * When omitted, the component mirrors the FacilityMonster behavior and
   * renders only when NEXT_PUBLIC_ENV is set to "dev".
   */
  enabled?: boolean
  /**
   * Extra classes for the outer indicator wrapper.
   */
  className?: string
  /**
   * Optional replacement labels for one or more breakpoints.
   */
  labels?: BreakpointLabels
}

declare const process:
  | {
      env?: {
        NEXT_PUBLIC_ENV?: string
      }
    }
  | undefined

const DEFAULT_CLASS_NAME =
  'group fixed bottom-1 left-1 z-[100000000000] flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-full border-0 bg-[rgba(0,0,0,0.4)] p-4 font-mono text-xs text-white relative appearance-none'

const WIDTH_LABEL_CLASS_NAME =
  'pointer-events-none absolute left-10 top-1/2 whitespace-nowrap rounded-[6px] bg-[rgba(0,0,0,0.78)] px-2 py-[6px] text-xs leading-none text-white opacity-0 -translate-y-1/2 translate-x-1 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100'

const BREAKPOINTS: Array<{ key: Breakpoint; className: string }> = [
  { key: 'xs', className: 'block sm:hidden' },
  { key: 'sm', className: 'hidden sm:block md:hidden' },
  { key: 'md', className: 'hidden md:block lg:hidden' },
  { key: 'lg', className: 'hidden lg:block xl:hidden' },
  { key: 'xl', className: 'hidden xl:block 2xl:hidden' },
  { key: '2xl', className: 'hidden 2xl:block' },
]

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function isEnabledByDefault() {
  return (
    typeof process !== 'undefined' &&
    process.env?.NEXT_PUBLIC_ENV === 'dev'
  )
}

function getViewportWidth() {
  return typeof window === 'undefined' ? 0 : window.innerWidth
}

export function TailwindBreakpointIndicator({
  enabled,
  className,
  labels = {},
}: TailwindBreakpointIndicatorProps) {
  const [dismissed, setDismissed] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(getViewportWidth)
  const shouldRender = enabled ?? isEnabledByDefault()

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    function handleResize() {
      setViewportWidth(window.innerWidth)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (!shouldRender || dismissed) {
    return null
  }

  return (
    <button
      aria-label="Tailwind breakpoint indicator. Click to hide."
      className={cx(DEFAULT_CLASS_NAME, className)}
      data-testid="tailwind-breakpoint-indicator"
      onClick={() => {
        setDismissed(true)
      }}
      title="Hide Tailwind breakpoint indicator"
      type="button"
    >
      {BREAKPOINTS.map((breakpoint) => (
        <span className={breakpoint.className} key={breakpoint.key}>
          {labels[breakpoint.key] ?? breakpoint.key}
        </span>
      ))}
      <span className={WIDTH_LABEL_CLASS_NAME}>{viewportWidth} px</span>
    </button>
  )
}

export const TailwindIndicator = TailwindBreakpointIndicator
