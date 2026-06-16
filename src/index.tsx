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
  'fixed bottom-1 left-1 z-[100000000000] flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-full border-0 bg-[rgba(0,0,0,0.4)] p-4 font-mono text-xs text-white'

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

export function TailwindBreakpointIndicator({
  enabled,
  className,
  labels = {},
}: TailwindBreakpointIndicatorProps) {
  const shouldRender = enabled ?? isEnabledByDefault()

  if (!shouldRender) {
    return null
  }

  return (
    <button
      aria-label="Tailwind breakpoint indicator"
      className={cx(DEFAULT_CLASS_NAME, className)}
      data-testid="tailwind-breakpoint-indicator"
      onClick={(event) => {
        event.currentTarget.hidden = true
      }}
      title="Hide Tailwind breakpoint indicator"
      type="button"
    >
      {BREAKPOINTS.map((breakpoint) => (
        <div className={breakpoint.className} key={breakpoint.key}>
          {labels[breakpoint.key] ?? breakpoint.key}
        </div>
      ))}
    </button>
  )
}

export const TailwindIndicator = TailwindBreakpointIndicator
