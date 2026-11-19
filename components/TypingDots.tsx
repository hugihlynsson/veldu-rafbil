import type { FunctionComponent } from 'react'
import clsx from 'clsx'

/** The dots shown while a model has yet to write its first word */
const TypingDots: FunctionComponent<{ label: string; className?: string }> = ({
  label,
  className,
}) => (
  // <output> carries role="status", so the dots announce themselves
  <output className={clsx('flex flex-col items-start', className)}>
    <span className="sr-only">{label}</span>
    <span aria-hidden className="h-6 flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-clay animate-typing" />
      <span className="w-1.5 h-1.5 rounded-full bg-clay animate-typing [animation-delay:0.2s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-clay animate-typing [animation-delay:0.4s]" />
    </span>
  </output>
)

export default TypingDots
