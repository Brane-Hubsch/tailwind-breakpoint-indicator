import { TailwindBreakpointIndicator } from 'tailwind-breakpoint-indicator'

const root = window.ReactDOM.createRoot(document.getElementById('app'))

root.render(
  window.React.createElement(TailwindBreakpointIndicator, {
    enabled: true,
  }),
)
