import React from 'react'

import CrossIcon from './CrossIcon'

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
    <CrossIcon size={14} />
  </button>
)

export default CloseButton
