import { useEffect, useState } from 'react'

import type { SheetReview } from '@/modules/detail/review'
import { carReviewPath } from '@/modules/detail/paths'
import type { NewsItem } from '@/modules/news/news'
import { carHistoryPath } from '@/modules/news/paths'

/**
 * A file the deploy builds for each car, so the sheet over the list fetches
 * what it shows of one car rather than bringing every car's with the list.
 * Each car's once a visit, kept as the sheet steps back to it; a request that
 * fails is forgotten, so the next opening asks again. The hook gives `empty`
 * until the file is in.
 */
const perCarFile = <T>(pathOf: (slug: string) => string, empty: T) => {
  const asked = new Map<string, Promise<T>>()
  // Read in render, so a car fetched ahead opens with its file in rather than
  // a frame without it
  const arrived = new Map<string, T>()

  const fileFor = (slug: string): Promise<T> => {
    const known = asked.get(slug)
    if (known) return known
    const request = fetch(pathOf(slug))
      .then(async (response) => {
        if (!response.ok) throw new Error(`${response.status}`)
        const file = (await response.json()) as T
        arrived.set(slug, file)
        return file
      })
      .catch(() => {
        asked.delete(slug)
        return empty
      })
    asked.set(slug, request)
    return request
  }

  const prefetch = (slug: string): void => void fileFor(slug)

  const useFile = (slug: string): T => {
    const [loaded, setLoaded] = useState<{ slug: string; file: T }>()

    useEffect(() => {
      if (arrived.has(slug)) return
      let current = true
      void fileFor(slug).then((file) => {
        if (current) setLoaded({ slug, file })
      })
      return () => {
        current = false
      }
    }, [slug])

    if (arrived.has(slug)) return arrived.get(slug) as T
    return loaded?.slug === slug ? loaded.file : empty
  }

  return [prefetch, useFile] as const
}

const noHistory: ReadonlyArray<NewsItem> = []

/** What the change log tells of a car, newest first; below the fold of the sheet */
export const [, useCarHistory] = perCarFile(carHistoryPath, noHistory)

/** A car's review, fetched ahead as a link to the car is pointed at */
export const [prefetchCarReview, useCarReview] = perCarFile<SheetReview | null>(
  carReviewPath,
  null,
)
