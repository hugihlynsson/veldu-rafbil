import { describe, expect, it } from 'vitest'

import {
  eventRows,
  productEventSchema,
  readBatch,
  type EventName,
  type TrackedEvent,
} from './events'
import { MAX_BATCH } from './visit'

const conversationId = '6f1c8a52-3e0b-4d5e-9a57-0f2b6c1d9e44'

// One of each, as a call site writes it: the compile holds these to the type
// the pages track with, and the test holds the schema to the same events
const tracked = {
  page_viewed: {
    name: 'page_viewed',
    viewId: 'a1b2',
    from: 'list',
    query: '?verd=6000000',
    referrer: 'www.google.com',
  },
  page_left: {
    name: 'page_left',
    viewId: 'a1b2',
    engagedMs: 41_200,
    maxScroll: 75,
  },
  sorting_changed: {
    name: 'sorting_changed',
    sorting: 'range',
    direction: 'desc',
  },
  view_changed: { name: 'view_changed', view: 'grid' },
  filters_changed: {
    name: 'filters_changed',
    source: 'modal',
    filters: [
      { key: 'price', value: '6000000' },
      { key: 'drive', value: 'AWD, RWD' },
    ],
    count: 31,
  },
  car_opened: { name: 'car_opened', car: 'kia-ev3', position: 4 },
  car_sheet_expanded: { name: 'car_sheet_expanded', car: 'kia-ev3' },
  compare_toggled: {
    name: 'compare_toggled',
    car: 'kia-ev3',
    added: true,
    count: 2,
  },
  comparison_opened: {
    name: 'comparison_opened',
    cars: ['kia-ev3', 'skoda-elroq'],
    source: 'chat',
    conversationId,
  },
  compare_more: { name: 'compare_more', cars: ['kia-ev3', 'skoda-elroq'] },
  verdict_shown: { name: 'verdict_shown', written: false, waitMs: 18_400 },
  verdict_failed: { name: 'verdict_failed', waitMs: 61_000 },
  seller_clicked: { name: 'seller_clicked', car: 'kia-ev3' },
  ev_database_clicked: { name: 'ev_database_clicked', car: 'kia-ev3' },
  shared: { name: 'shared', target: 'comparison', method: 'sheet' },
  chat_bar_focused: { name: 'chat_bar_focused' },
  chat_opened: { name: 'chat_opened' },
  chat_question_sent: { name: 'chat_question_sent', conversationId },
  chat_car_picked: { name: 'chat_car_picked', car: 'kia-ev3' },
  suggestions_shown: {
    name: 'suggestions_shown',
    requestId: conversationId,
    count: 2,
  },
} satisfies { [Name in EventName]: Extract<TrackedEvent, { name: Name }> }

const onPage = (event: TrackedEvent) => ({
  ...event,
  page: { kind: 'car', slugs: ['kia-ev3'] },
  ageMs: 1_500,
})

const batch = (events: unknown[]) => ({
  sessionId: conversationId,
  device: 'phone',
  events,
})

describe('productEventSchema', () => {
  it.each(Object.values(tracked))('reads $name as a page sends it', (event) => {
    expect(productEventSchema.parse(onPage(event))).toEqual(onPage(event))
  })

  it('reads a car viewed in the sheet over the list', () => {
    const viewed = onPage({ ...tracked.page_viewed, sheet: true })
    expect(productEventSchema.parse(viewed)).toEqual(viewed)
  })

  it('refuses a field the event does not have', () => {
    const extra = { ...onPage(tracked.seller_clicked), price: 5_990_000 }
    expect(productEventSchema.safeParse(extra).success).toBe(false)
  })

  it('refuses a filter the list does not have', () => {
    const event = onPage(tracked.filters_changed)
    const filters = { ...event, filters: [{ key: 'colour', value: 'red' }] }
    expect(productEventSchema.safeParse(filters).success).toBe(false)
  })
})

describe('readBatch', () => {
  it('keeps the events it knows and drops the rest', () => {
    const read = readBatch(
      batch([
        onPage(tracked.seller_clicked),
        { ...onPage(tracked.chat_opened), name: 'chat_liked' },
      ]),
    )
    expect(read?.events.map(({ name }) => name)).toEqual(['seller_clicked'])
    expect(read?.dropped).toBe(1)
  })

  it('refuses a batch with no event it knows', () => {
    expect(readBatch(batch([{ name: 'chat_liked' }]))).toBeUndefined()
    expect(readBatch(batch([]))).toBeUndefined()
  })

  it('refuses more events than one request carries', () => {
    const events = Array.from({ length: MAX_BATCH + 1 }, () =>
      onPage(tracked.chat_opened),
    )
    expect(readBatch(batch(events))).toBeUndefined()
    expect(readBatch(batch(events.slice(1)))?.events).toHaveLength(MAX_BATCH)
  })

  it('refuses a session that is not an id', () => {
    const body = { ...batch([onPage(tracked.chat_opened)]), sessionId: 'me' }
    expect(readBatch(body)).toBeUndefined()
  })
})

describe('eventRows', () => {
  it('dates each event by its age when it arrived, and flattens its page', () => {
    const read = readBatch(batch([onPage(tracked.car_opened)]))!
    const rows = eventRows(read, {
      receivedAt: Date.UTC(2026, 9, 18, 12, 0, 0),
      country: 'IS',
      environment: 'production',
      commit: 'bc4a4a3',
    })
    expect(rows).toEqual([
      {
        _time: '2026-10-18T11:59:58.500Z',
        name: 'car_opened',
        car: 'kia-ev3',
        position: 4,
        page: 'car',
        pageSlugs: ['kia-ev3'],
        sessionId: conversationId,
        device: 'phone',
        country: 'IS',
        environment: 'production',
        commit: 'bc4a4a3',
      },
    ])
  })

  it('counts the events it dropped in a row of their own', () => {
    const read = readBatch(
      batch([onPage(tracked.chat_opened), { name: 'chat_liked' }]),
    )!
    const rows = eventRows(read, {
      receivedAt: Date.UTC(2026, 9, 18, 12, 0, 0),
      country: undefined,
      environment: 'production',
      commit: undefined,
    })
    expect(rows).toHaveLength(2)
    expect(rows[1]).toMatchObject({
      _time: '2026-10-18T12:00:00.000Z',
      name: 'events_dropped',
      count: 1,
      sessionId: conversationId,
    })
  })
})
