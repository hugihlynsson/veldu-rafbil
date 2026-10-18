import { FunctionComponent } from 'react'

/**
 * A cross to close or take something out with. Drawn, as × sits off the
 * centre of its glyph and shows it in any round badge.
 */
const CrossIcon: FunctionComponent<{ size: number }> = ({ size }) => (
  <svg
    aria-hidden
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m2.07 13.12 4.78-4.78 4.93 4.93 1.29-1.29-4.93-4.93 4.78-4.78L11.64.98 6.85 5.77 1.91.83.63 2.1l4.94 4.94-4.79 4.79 1.29 1.28Z"
      fill="currentColor"
    />
  </svg>
)

export default CrossIcon
