import { FunctionComponent } from 'react'

/** A car from the side, where a car's photo would be and there is none */
const CarIcon: FunctionComponent<{ size: number; className?: string }> = ({
  size,
  className,
}) => (
  <svg
    aria-hidden
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5.5 16H4a1 1 0 0 1-1-1v-1.6a2 2 0 0 1 1.5-1.9l2.3-.6 1.9-2.6a2 2 0 0 1 1.6-.8h3.9a2 2 0 0 1 1.6.8l2 2.7 1.7.4a2 2 0 0 1 1.5 1.9V15a1 1 0 0 1-1 1h-1.5M9.5 16h5" />
    <circle cx="7.5" cy="16" r="2" />
    <circle cx="16.5" cy="16" r="2" />
  </svg>
)

export default CarIcon
