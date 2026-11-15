import React from 'react'
import clsx from 'clsx'

import CrossIcon from './CrossIcon'

interface Props {
  onClick: () => void
  className?: string
}

const CloseButton: React.FunctionComponent<Props> = ({
  onClick,
  className,
}) => (
  <button
    type="button"
    aria-label="Loka"
    onClick={onClick}
    className={clsx(
      'absolute left-2.75 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 border-0 p-0 rounded-full appearance-none bg-transparent text-stone cursor-pointer transition-colors duration-200 hover:bg-cloud hover:text-tint',
      className,
    )}
  >
    <CrossIcon size={14} />
  </button>
)

export default CloseButton
