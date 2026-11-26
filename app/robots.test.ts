import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { MAX_COMPARED } from '@/modules/detail/comparison'
import {
  comparisonLinkRel,
  comparisonPath,
  shareImagePath,
} from '@/modules/detail/paths'

const robots = readFileSync(path.join(__dirname, 'robots.txt'), 'utf8')

// Google's reading: a prefix, where * stands for any run of characters
const disallowed = robots
  .split('\n')
  .flatMap((line) => line.match(/^Disallow: (\S+)$/)?.[1] ?? [])
  .map(
    (rule) =>
      new RegExp(
        `^${rule
          .split('*')
          .map((part) => part.replace(/[.?+^$()[\]{}|\\]/g, '\\$&'))
          .join('.*')}`,
      ),
  )

const isDisallowed = (url: string) => disallowed.some((rule) => rule.test(url))

const slugsOf = (count: number) =>
  Array.from({ length: count }, (_, index) => `bill-${index}`)

describe('robots.txt', () => {
  it.each(Array.from({ length: MAX_COMPARED - 1 }, (_, index) => index + 2))(
    'agrees with the links on whether %i cars are crawled',
    (count) => {
      const slugs = slugsOf(count)
      expect(isDisallowed(comparisonPath(slugs))).toBe(
        comparisonLinkRel(slugs) === 'nofollow',
      )
    },
  )

  it('leaves pairs open', () => {
    expect(isDisallowed(comparisonPath(slugsOf(2)))).toBe(false)
  })

  // A link people share has to unfurl, whatever its size
  it('leaves every share image open', () => {
    for (let count = 1; count <= MAX_COMPARED; count++) {
      expect(isDisallowed(shareImagePath(slugsOf(count)))).toBe(false)
    }
  })
})
