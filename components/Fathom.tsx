'use client'

import { load, trackPageview } from 'fathom-client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Fathom() {
  const pathname = usePathname()

  useEffect(() => {
    load('DDOQKVOW', { auto: false })
  }, [])

  // On the path alone: a sort or a filter rewrites the query string in place,
  // and is a view of the one page rather than a visit to another. The script
  // reads the URL and referrer itself, query string and all.
  useEffect(() => {
    trackPageview()
  }, [pathname])

  return null
}
