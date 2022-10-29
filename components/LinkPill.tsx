import React, { ReactNode, FunctionComponent } from 'react'
import Link from 'next/link'

interface Props {
  current?: boolean
  external?: boolean
  extra?: string
  href?: any
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  onGray?: boolean
  children?: ReactNode | undefined
}

const LinkPill: FunctionComponent<Props> = ({
  children,
  current,
  external,
  extra,
  href,
  onClick,
  onGray,
}) => (
  <Link
    className={'link-pill ' + (current ? 'current' : onGray ? 'on-gray' : '')}
    onClick={onClick}
    href={href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener' : undefined}
  >
    {children} {extra && <span className="extra">{extra}</span>}
    <style jsx global>{`
      .link-pill {
        display: inline-block;
        align-self: flex-start;
        flex-shrink: 0;
        margin-top: 8px;
        color: inherit;
        font-size: 14px;
        font-weight: 600;
        background-color: #eee;
        border-radius: 100px;
        padding: 4px 12px;
        text-decoration: none;
        margin-left: -2px;
        margin-right: 10px;
        transition: background-color 0.1s;
      }
      .link-pill:hover {
        background-color: #ddd;
      }
      .link-pill.current,
      .link-pill.current:hover {
        background-color: #48f;
        color: #fff;
      }
      .link-pill.on-gray {
        background-color: #e4e4e4;
      }
      .link-pill.on-gray:hover {
        background-color: #d8d8d8;
      }
      .link-pill .extra {
        text-transform: uppercase;
        font-weight: 700;
        font-size: 10px;
        background: white;
        color: #444;
        border-radius: 16px;
        padding: 1px 6px 2px;
        margin: 1px -6px -4px 1px;
        vertical-align: top;
        display: inline-block;
        transition: background-color 0.1s;
      }
      .link-pill.link-pill:hover .extra {
        background: rgba(255, 255, 255, 0.8);
      }
      .link-pill.current:hover .extra,
      .link-pill.current .extra {
        color: #27f;
        background: rgba(255, 255, 255, 0.9);
      }
    `}</style>
  </Link>
)

export default LinkPill
