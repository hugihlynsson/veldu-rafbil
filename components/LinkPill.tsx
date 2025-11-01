import React, { ReactNode, FunctionComponent } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

interface Props {
  current?: boolean
  external?: boolean
  extra?: string
  href?: any
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  onGray?: boolean
  children?: ReactNode | undefined
  large?: boolean
  title?: string
}

const LinkPill: FunctionComponent<Props> = ({
  children,
  current,
  external,
  extra,
  href,
  onClick,
  onGray,
  large,
  title,
}) => (
  <Link
    className={clsx(
      'group inline-flex self-start items-center shrink-0 mt-2 text-inherit text-sm font-semibold rounded-full no-underline -ml-0.5 mr-2.5 transition-colors duration-100',
      large ? 'py-[5px] px-[14px]' : 'py-1 px-3',
      current && 'bg-sky text-white hover:bg-sky',
      onGray && !current && 'bg-[#e4e4e4] hover:bg-[#d8d8d8]',
      !current && !onGray && 'bg-cloud hover:bg-smoke',
    )}
    onClick={onClick}
    href={href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener' : undefined}
    title={title}
  >
    {children}{' '}
    {extra && (
      <span
        className={clsx(
          'uppercase font-bold text-[10px] rounded-2xl py-0.5 px-1.5 my-0 ml-[5px] -mr-[7px] align-top inline-block transition-colors duration-100',
          current
            ? 'text-[#27f] bg-white/90'
            : 'text-[#444] bg-white group-hover:bg-white/80',
        )}
      >
        {extra}
      </span>
    )}
  </Link>
)

export default LinkPill
