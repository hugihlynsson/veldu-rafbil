import React, { FunctionComponent } from 'react'

interface Props {
  current?: boolean
  external?: boolean
  extra?: string
  href?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

const LinkPill: FunctionComponent<Props> = React.forwardRef<
  HTMLAnchorElement,
  Props
>(({ children, current, external, extra, href, onClick }, ref) => (
  <a
    ref={ref}
    className={current ? 'current' : ''}
    onClick={onClick}
    href={href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener' : undefined}
  >
    {children} {extra && <span className="extra">{extra}</span>}
    <style jsx>{`
      a {
        display: inline-block;
        align-self: flex-start;
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
      a:hover {
        background-color: #dadcec;
      }
      .current,
      .current:hover {
        background-color: #48f;
        color: #fff;
      }
      .extra {
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
      a:hover .extra {
        background: rgba(255, 255, 255, 0.8);
      }
      .current:hover .extra,
      .current .extra {
        color: #27f;
        background: rgba(255, 255, 255, 0.9);
      }
    `}</style>
  </a>
))

export default LinkPill
