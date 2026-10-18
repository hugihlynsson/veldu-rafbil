import { FunctionComponent } from 'react'

/**
 * Two columns of figures side by side, as on the comparison page. The rows are
 * what keep it from reading as a split-view toggle, or as pause when the
 * columns stand apart
 */
const CompareIcon: FunctionComponent<{ size: number }> = ({ size }) => (
  <svg
    aria-hidden
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <rect x="1.25" y="1.75" width="11.5" height="10.5" rx="2" />
    <path d="M7 1.75v10.5M3.5 5h1.5M3.5 8h1.5M9 5h1.5M9 8h1.5" />
  </svg>
)

export default CompareIcon
