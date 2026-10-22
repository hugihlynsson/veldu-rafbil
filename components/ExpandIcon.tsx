import { FunctionComponent } from 'react'

/** Two arrows out to opposite corners, for opening something at full size */
const ExpandIcon: FunctionComponent<{ size: number }> = ({ size }) => (
  <svg
    aria-hidden
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.5 1.5h4v4M12.5 1.5 8 6M5.5 12.5h-4v-4M1.5 12.5 6 8" />
  </svg>
)

export default ExpandIcon
