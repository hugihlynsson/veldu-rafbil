'use client'

import { FunctionComponent, MouseEvent } from 'react'
import Link from 'next/link'

import Logo from './Logo'
import { useListHref } from '@/utils/listReturn'

/**
 * The footer's wordmark, leading where the one atop the page does: back to the
 * list as it was left, or on the list itself up to its top, keeping its sort
 * and filters
 */
const FooterLogo: FunctionComponent = () => {
  const listHref = useListHref()

  // On the list the remembered search may be older than the one in the URL,
  // since it is kept only on leaving, so following the link could change it
  const scrollUpOnList = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname !== '/') return
    event.preventDefault()
    window.scrollTo(0, 0)
  }

  return (
    <Link
      href={listHref}
      onClick={scrollUpOnList}
      className="block w-40 mb-4 text-tint no-underline transition-opacity duration-100 hover:opacity-70"
    >
      <Logo className="block w-full h-auto" />
    </Link>
  )
}

export default FooterLogo
