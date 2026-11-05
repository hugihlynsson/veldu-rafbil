import { useEffect, useState } from 'react'

import type { NewsItem } from '@/modules/news/news'
import { carHistoryPath } from '@/modules/news/paths'

// Each car's once a visit, kept as the sheet steps back to it. A request that
// fails is forgotten, so the next opening asks again.
const asked = new Map<string, Promise<NewsItem[]>>()

const historyFor = (slug: string): Promise<NewsItem[]> => {
  const known = asked.get(slug)
  if (known) return known
  const request = fetch(carHistoryPath(slug))
    .then((response) =>
      response.ok ? (response.json() as Promise<NewsItem[]>) : [],
    )
    .catch(() => {
      asked.delete(slug)
      return []
    })
  asked.set(slug, request)
  return request
}

/**
 * What the change log tells of a car, newest first, fetched from its own file
 * rather than the log: the sheet over the list shows one car at a time. Empty
 * until it arrives, which is below the fold of the sheet anyway.
 */
const useCarHistory = (slug: string): ReadonlyArray<NewsItem> => {
  const [loaded, setLoaded] = useState<{
    slug: string
    items: NewsItem[]
  }>()

  useEffect(() => {
    let current = true
    void historyFor(slug).then((items) => {
      if (current) setLoaded({ slug, items })
    })
    return () => {
      current = false
    }
  }, [slug])

  return loaded?.slug === slug ? loaded.items : []
}

export default useCarHistory
