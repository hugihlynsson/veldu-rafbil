import { FunctionComponent } from 'react'

const paths = {
  left: 'M9 2 4 7l5 5',
  right: 'M5 2l5 5-5 5',
  down: 'M2.9 5.25 7 9.33l4.1-4.08',
}

/** A chevron pointing the way something steps or opens */
const ChevronIcon: FunctionComponent<{
  size: number
  direction: keyof typeof paths
  className?: string
}> = ({ size, direction, className }) => (
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
    className={className}
  >
    <path d={paths[direction]} />
  </svg>
)

export default ChevronIcon
