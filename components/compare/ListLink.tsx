'use client'

import { FunctionComponent, ReactNode } from 'react'
import Link from 'next/link'

import { useListHref } from '@/utils/listReturn'

interface Props {
  className?: string
  onClick?: () => void
  children: ReactNode
}

/** Back to the list, sorted, filtered and laid out as it was left */
const ListLink: FunctionComponent<Props> = ({
  className,
  onClick,
  children,
}) => (
  <Link href={useListHref()} className={className} onClick={onClick}>
    {children}
  </Link>
)

export default ListLink
