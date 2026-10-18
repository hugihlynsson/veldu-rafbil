import { FunctionComponent } from 'react'

/** A plus to add something with. Drawn, as + sits off the centre of its glyph */
const PlusIcon: FunctionComponent<{ size: number }> = ({ size }) => (
  <svg aria-hidden width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path
      d="M7 2v10M2 7h10"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
)

export default PlusIcon
