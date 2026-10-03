import React from 'react'

interface Props {
  onClick: () => void
}

const CloseButton: React.FunctionComponent<Props> = ({ onClick }) => (
  <button
    type="button"
    aria-label="Loka"
    onClick={onClick}
    className="absolute left-2.75 top-2.75 flex items-center justify-center h-8 w-8 border-0 p-0 rounded-full appearance-none bg-transparent text-stone cursor-pointer transition-colors duration-200 hover:bg-cloud hover:text-tint"
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
        fill="currentColor"
      />
    </svg>
  </button>
)

export default CloseButton
