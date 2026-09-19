import React from 'react'

interface Props {
  onClick: () => void
}

/** The X in the corner of a modal header, the same one in both of them */
const CloseButton: React.FunctionComponent<Props> = ({ onClick }) => (
  <button
    type="button"
    aria-label="Loka"
    onClick={onClick}
    className="absolute left-[11px] top-[11px] flex items-center justify-center h-8 w-8 border-0 p-0 rounded-2xl appearance-none bg-transparent text-[30px] text-stone cursor-pointer transition-all duration-200 hover:bg-cloud [&_path]:transition-all [&_path]:duration-200 hover:[&_path]:fill-tint"
  >
    <svg
      width="14"
      height="14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="m2.07 13.12 4.78-4.78 4.93 4.93 1.29-1.29-4.93-4.93 4.78-4.78L11.64.98 6.85 5.77 1.91.83.63 2.1l4.94 4.94-4.79 4.79 1.29 1.28Z"
        className="fill-stone"
      />
    </svg>
  </button>
)

export default CloseButton
