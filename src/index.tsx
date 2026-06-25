import { useEffect, useState, type CSSProperties } from 'react'

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
   * Inline style overrides for the outer indicator wrapper.
   */
  style?: CSSProperties
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

const DEFAULT_CLASS_NAME = 'relative'

const WIDTH_LABEL_CLASS_NAME = 'pointer-events-none absolute whitespace-nowrap'

const DEFAULT_BUTTON_STYLE: CSSProperties = {
  appearance: 'none',
  background: 'rgba(0, 0, 0, 0.4)',
  border: 0,
  borderRadius: '9999px',
  bottom: '8px',
  color: '#ffffff',
  cursor: 'pointer',
  display: 'flex',
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
  fontSize: '12px',
  height: '24px',
  justifyContent: 'center',
  left: '8px',
  lineHeight: 1,
  margin: 0,
  padding: 0,
  position: 'fixed',
  userSelect: 'none',
  width: '24px',
  zIndex: 100000000000,
}

const DEFAULT_WIDTH_LABEL_STYLE: CSSProperties = {
  background: 'rgba(0, 0, 0, 0.78)',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '12px',
  left: '40px',
  lineHeight: 1,
  opacity: 0,
  padding: '6px 8px',
  pointerEvents: 'none',
  position: 'absolute',
  top: '50%',
  transform: 'translate(4px, -50%)',
  transition: 'opacity 150ms ease, transform 150ms ease',
  whiteSpace: 'nowrap',
}

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
  style,
  labels = {},
}: TailwindBreakpointIndicatorProps) {
  const [dismissed, setDismissed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocusVisible, setIsFocusVisible] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(getViewportWidth)
  const shouldRender = enabled ?? isEnabledByDefault()
  const isWidthLabelVisible = isHovered || isFocusVisible

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
      onBlur={() => {
        setIsFocusVisible(false)
      }}
      onClick={() => {
        setDismissed(true)
      }}
      onFocus={() => {
        setIsFocusVisible(true)
      }}
      onMouseEnter={() => {
        setIsHovered(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
      }}
      style={{
        ...DEFAULT_BUTTON_STYLE,
        ...style,
      }}
      title="Hide Tailwind breakpoint indicator"
      type="button"
    >
      {BREAKPOINTS.map((breakpoint) => (
        <span className={breakpoint.className} key={breakpoint.key}>
          {labels[breakpoint.key] ?? breakpoint.key}
        </span>
      ))}
      <span
        className={WIDTH_LABEL_CLASS_NAME}
        style={{
          ...DEFAULT_WIDTH_LABEL_STYLE,
          opacity: isWidthLabelVisible ? 1 : 0,
          transform: isWidthLabelVisible
            ? 'translate(0, -50%)'
            : 'translate(4px, -50%)',
        }}
      >
        {viewportWidth} px
      </span>
    </button>
  )
}

export const TailwindIndicator = TailwindBreakpointIndicator
