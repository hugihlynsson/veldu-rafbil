import React, { ReactNode, FunctionComponent } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

interface Props {
  /** Where it sits: the pill sets none of its own margins */
  className?: string
  external?: boolean
  extra?: string
  /** The regular weight, for a pill beside a bold one it should not compete with */
  light?: boolean
  /** A size down, for a column a quarter of a phone wide */
  compact?: boolean
  href: React.ComponentProps<typeof Link>['href']
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  children?: ReactNode
  title?: string
}

const LinkPill: FunctionComponent<Props> = ({
  children,
  className,
  external,
  extra,
  light,
  compact,
  href,
  onClick,
  title,
}) => (
  <Link
    className={clsx(
      'group inline-flex self-start items-center shrink-0 text-inherit rounded-full no-underline bg-cloud transition duration-100 hover:bg-smoke active:scale-[0.98]',
      compact ? 'py-1 px-2 text-xs' : 'py-1 px-3 text-sm',
      light ? 'font-normal' : 'font-semibold',
      className,
    )}
    onClick={onClick}
    href={href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener' : undefined}
    title={title}
  >
    {children}{' '}
    {extra && (
      <span className="uppercase font-bold text-eyebrow rounded-full py-0.5 px-1.5 my-0 ml-1.25 -mr-1.75 align-top inline-block text-stone bg-raised transition-colors duration-100 group-hover:bg-raised/80">
        {extra}
      </span>
    )}
  </Link>
)

export default LinkPill
