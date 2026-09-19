import React, { ReactNode, FunctionComponent } from 'react'
import Link from 'next/link'

interface Props {
  external?: boolean
  extra?: string
  href: React.ComponentProps<typeof Link>['href']
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  children?: ReactNode
  title?: string
}

// `current`, `onGray` and `large` were props with styling behind them that
// nothing had passed in a long time, so the branches went with them.
const LinkPill: FunctionComponent<Props> = ({
  children,
  external,
  extra,
  href,
  onClick,
  title,
}) => (
  <Link
    className="group inline-flex self-start items-center shrink-0 mt-2 py-1 px-3 text-inherit text-sm font-semibold rounded-full no-underline -ml-0.5 mr-2.5 bg-cloud transition-all duration-100 hover:bg-smoke active:scale-[0.98]"
    onClick={onClick}
    href={href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener' : undefined}
    title={title}
  >
    {children}{' '}
    {extra && (
      <span className="uppercase font-bold text-[10px] rounded-2xl py-0.5 px-1.5 my-0 ml-[5px] -mr-[7px] align-top inline-block text-[#444] bg-white transition-colors duration-100 group-hover:bg-white/80">
        {extra}
      </span>
    )}
  </Link>
)

export default LinkPill
