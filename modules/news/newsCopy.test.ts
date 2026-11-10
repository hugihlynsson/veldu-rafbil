import { describe, expect, it } from 'vitest'

import type { NewsDay, NewsItem } from './news'
import { dayHeadline, daySummary, itemText } from './newsCopy'

const item = (
  kind: NewsItem['kind'],
  label: string,
  extra: Partial<NewsItem> = {},
): NewsItem => ({
  kind,
  date: '2026-10-31',
  slug: label.toLowerCase().replaceAll(' ', '-'),
  label,
  ...extra,
})

const day = (...items: NewsItem[]): NewsDay => ({
  date: '2026-10-31',
  items: {
    added: items.filter(({ kind }) => kind === 'added'),
    price: items.filter(({ kind }) => kind === 'price'),
    estimate: items.filter(({ kind }) => kind === 'estimate'),
    delivery: items.filter(({ kind }) => kind === 'delivery'),
    removed: items.filter(({ kind }) => kind === 'removed'),
  },
})

// Variants of one model are one car to a headline
const nameOf = ({ label }: NewsItem) => label.split(' ').slice(0, 2).join(' ')

const lower = (label: string) =>
  item('price', label, { price: { from: 2, to: 1 } })

describe('dayHeadline', () => {
  it('leads with the new cars, a model once however many variants', () => {
    expect(
      dayHeadline(
        day(item('added', 'Polestar 5 Performance'), lower('Ford Puma')),
        nameOf,
      ),
    ).toBe('Polestar 5 bætist við')
    expect(
      dayHeadline(
        day(
          item('added', 'XPENG L03 RWD'),
          item('added', 'XPENG L03 AWD'),
          item('added', 'Mini Cooper SE'),
        ),
        nameOf,
      ),
    ).toBe('XPENG L03 og Mini Cooper bætast við')
  })

  // Names joined with "og" are plural, unlike a count of 21 bílar
  it('takes a plural verb for 21 names, as for any run of them', () => {
    const added = Array.from({ length: 21 }, (_, i) =>
      item('added', `Car ${i}`),
    )
    expect(dayHeadline(day(...added), nameOf)).toBe(
      'Car 0, Car 1 og 19 fleiri bætast við',
    )
    const removed = Array.from({ length: 21 }, (_, i) =>
      item('removed', `Car ${i}`),
    )
    expect(dayHeadline(day(...removed), nameOf)).toBe(
      'Car 0, Car 1 og 19 fleiri hætta í sölu',
    )
  })

  it('counts the rest of a long run of names', () => {
    const added = ['A 1', 'B 1', 'C 1', 'D 1', 'E 1'].map((label) =>
      item('added', label),
    )
    expect(dayHeadline(day(...added), nameOf)).toBe(
      'A 1, B 1 og 3 fleiri bætast við',
    )
  })

  it('names the one car whose price changed, and counts several', () => {
    expect(dayHeadline(day(lower('Ford Puma')), nameOf)).toBe(
      'Verð á Ford Puma lækkar',
    )
    expect(
      dayHeadline(
        day(item('price', 'Ford Puma', { price: { from: 1, to: 2 } })),
        nameOf,
      ),
    ).toBe('Verð á Ford Puma hækkar')
    // 21 takes the singular, as Icelandic counts
    const many = Array.from({ length: 21 }, (_, i) => lower(`Car ${i}`))
    expect(dayHeadline(day(...many), nameOf)).toBe('Verðbreytingar á 21 bíl')
    expect(dayHeadline(day(lower('Ford Puma'), lower('Kia EV3')), nameOf)).toBe(
      'Verðbreytingar á 2 bílum',
    )
  })

  it('tells a re-estimate after a price change, and as an estimate', () => {
    const estimate = item('estimate', 'Volkswagen ID.3 Neo', {
      price: { from: 6_390_000, to: 6_190_000 },
    })
    expect(dayHeadline(day(estimate), nameOf)).toBe(
      'Áætlað verð á Volkswagen ID.3 lækkar',
    )
    expect(dayHeadline(day(estimate, lower('Kia PV5')), nameOf)).toBe(
      'Verð á Kia PV5 lækkar',
    )
    expect(daySummary(day(estimate, lower('Kia PV5')))).toBe(
      '1 verðbreyting og 1 breyting á áætluðu verði.',
    )
  })

  it('tells cars arriving apart from deliveries moving', () => {
    expect(
      dayHeadline(
        day(
          item('delivery', 'Mazda CX-6e', { delivery: { from: 'lok 2026' } }),
        ),
        nameOf,
      ),
    ).toBe('Mazda CX-6e kominn í sölu')
    expect(
      dayHeadline(
        day(
          item('delivery', 'Volvo ES90', {
            delivery: { from: 'lok 2026', to: 'snemma 2027' },
          }),
        ),
        nameOf,
      ),
    ).toBe('Breytt afhending á Volvo ES90')
  })

  it('tells cars leaving last', () => {
    expect(
      dayHeadline(
        day(item('removed', 'Maxus eT90'), item('removed', 'Hyundai IONIQ 6')),
        nameOf,
      ),
    ).toBe('Maxus eT90 og Hyundai IONIQ hætta í sölu')
  })
})

describe('daySummary', () => {
  it('counts each kind in agreement', () => {
    expect(
      daySummary(
        day(item('added', 'A'), lower('B'), lower('C'), item('removed', 'D')),
      ),
    ).toBe('1 nýr bíll, 2 verðbreytingar og 1 hættir í sölu.')
    expect(daySummary(day(item('added', 'A'), item('added', 'B')))).toBe(
      '2 nýir bílar.',
    )
  })
})

describe('itemText', () => {
  it('gives the new price and the change, as news and looking back', () => {
    const cut = lower('Ford Puma')
    cut.price = { from: 5_190_000, to: 4_890_000 }
    expect(itemText(cut, 'news')).toBe('4.890.000 kr. · ↓ 300.000')
    const rise = item('price', 'Ford Capri', {
      price: { from: 7_990_000, to: 8_190_000 },
    })
    expect(itemText(rise, 'news')).toBe('8.190.000 kr. · ↑ 200.000')
    expect(itemText(cut, 'history')).toBe(
      'Listaverð lækkaði í 4.890.000 kr, um 300.000',
    )
  })

  it('gives a re-estimate as the estimate it is, looking back', () => {
    const estimate = item('estimate', 'A', {
      price: { from: 6_390_000, to: 6_190_000 },
    })
    expect(itemText(estimate, 'news')).toBe('6.190.000 kr. · ↓ 200.000')
    expect(itemText(estimate, 'history')).toBe(
      'Áætlað listaverð lækkaði í 6.190.000 kr, um 200.000',
    )
  })

  it('tells a car joining the list as registered, with its list price', () => {
    const added = item('added', 'A', { price: { to: 6_490_000 } })
    expect(itemText(added, 'history')).toBe('Skráður, listaverð 6.490.000 kr.')
  })

  it('writes a delivery as the comparison does', () => {
    expect(
      itemText(item('added', 'A', { delivery: { to: 'Lok 2026' } }), 'news'),
    ).toBe('Nýr á lista, væntanlegur lok 2026')
    expect(
      itemText(
        item('delivery', 'A', { delivery: { from: 'Lok 2026', to: '2027' } }),
        'history',
      ),
    ).toBe('Afhending færðist: lok 2026 → 2027')
  })

  it('gives a moved delivery as when the car is expected now', () => {
    expect(
      itemText(
        item('delivery', 'A', { delivery: { from: 'Lok 2026', to: '2027' } }),
        'news',
      ),
    ).toBe('Væntanlegur 2027')
  })
})
