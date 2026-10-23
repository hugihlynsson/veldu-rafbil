'use client'

import { FunctionComponent } from 'react'
import Link from 'next/link'

import Logo from '@/components/Logo'
import { useListHref } from '@/utils/listReturn'

/**
 * The wordmark atop a page other than the list, at the size and place it has
 * there, leading back to the list sorted, filtered and laid out as it was left
 */
const PageTop: FunctionComponent = () => (
  <Link
    href={useListHref()}
    className="block w-[70%] max-w-[359px] mt-10 mb-4 text-tint no-underline transition-opacity duration-100 hover:opacity-70 md:mt-15 md:mb-5"
  >
    <Logo className="block w-full h-auto" />
  </Link>
)

export default PageTop
