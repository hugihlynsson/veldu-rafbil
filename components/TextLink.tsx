import { ComponentProps } from 'react'

/** A link inside running text, set apart by its weight until it is hovered */
const TextLink = ({ children, ...props }: ComponentProps<'a'>) => (
  <a
    {...props}
    className="text-tint font-semibold no-underline hover:underline"
  >
    {children}
  </a>
)

export default TextLink
