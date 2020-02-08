import React, { FunctionComponent } from 'react'

interface Props {
  current?: boolean
  href?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

const LinkPill: FunctionComponent<Props> = ({
  children,
  current,
  href,
  onClick,
}) => (
  <a className={current ? 'current' : ''} onClick={onClick} href={href}>
    {children}

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
        transition: background-color 0.1s;
        margin-right: 10px;
        transition: background-color: 0.2s;
      }
      a:hover {
        background-color: #dadcec;
      }
      .current,
      .current:hover {
        background-color: #48f;
        color: #fff;
      }
    `}</style>
  </a>
)

export default LinkPill
