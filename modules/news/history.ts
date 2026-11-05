import carChanges from '@/modules/data/carChanges'
import { readNews, type NewsItem } from './news'

// Apart from the feed, which works out every day's headline, so the car
// sheet that loads this behind next/dynamic brings the log and no more
const items = readNews(carChanges)

/** Everything the log tells a buyer, oldest first, from 2020 on */
export const allNews: ReadonlyArray<NewsItem> = items

/** Everything the log tells of one car, newest first, from 2020 on */
export const historyOf = (slug: string): NewsItem[] =>
  items.filter((item) => item.slug === slug).toReversed()
