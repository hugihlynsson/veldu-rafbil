'use client'

import { FunctionComponent, MouseEvent } from 'react'
import Link from 'next/link'

import Logo from './Logo'
import { useListHref } from '@/utils/listReturn'
import prefersReducedMotion from '@/utils/prefersReducedMotion'

/**
 * The footer's wordmark, leading where the one atop the page does: back to the
 * list as it was left, or on the list itself up to its top, keeping its sort
 * and filters
 */
const FooterLogo: FunctionComponent = () => {
  const listHref = useListHref()

  const scrollUpOnList = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname !== '/') return
    event.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
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
