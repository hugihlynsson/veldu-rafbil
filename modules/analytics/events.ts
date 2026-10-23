import { z } from 'zod'

import { MAX_COMPARED } from '@/modules/detail/comparison'
import { filterKeys, type FilterKey } from '@/modules/list/filters'
import { sortings, type Sorting } from '@/modules/list/sorting'
import { devices, MAX_BATCH, MAX_DURATION_MS, pageKinds } from './visit'

// What a page reports of how it is used, read on the server. The browser only
// imports the types, so zod stays off the list's first load.

const slug = z.string().min(1).max(100)
const pageKind = z.enum(pageKinds)
const conversationId = z.uuid().optional()
const milliseconds = z.int().min(0).max(MAX_DURATION_MS)

// Every event says where it happened and how long it waited to be sent, which
// the server turns into when it happened, as a phone's clock can be anything
const envelope = {
  page: z.strictObject({
    kind: pageKind,
    slugs: z.array(slug).max(MAX_COMPARED),
  }),
  ageMs: z.int().min(0).max(3_600_000),
}

const event = <Name extends string, Shape extends Record<string, z.ZodType>>(
  name: Name,
  shape: Shape,
) => z.strictObject({ name: z.literal(name), ...envelope, ...shape })

const filterKey = z.enum(filterKeys as [FilterKey, ...FilterKey[]])

/**
 * Every event a page sends. A field added to one is added here first, and the
 * compile asks every call site for it; one this does not know is dropped by
 * the route, which keeps the rest of its batch.
 */
export const productEventSchema = z.discriminatedUnion('name', [
  // A path, not a query: a sort or a filter is a view of the one page.
  // `from` is the page before it in the same tab, absent on arrival. `sheet`
  // is a car opened over the list on a desktop, rather than as its page.
  event('page_viewed', {
    viewId: z.string().min(1).max(40),
    from: pageKind.optional(),
    query: z.string().max(300),
    referrer: z.string().max(253).optional(),
    sheet: z.literal(true).optional(),
  }),
  // Sent each time the tab is hidden as well as when the page is left, the
  // totals growing, as a phone may never say it was left: read the largest
  event('page_left', {
    viewId: z.string().min(1).max(40),
    engagedMs: milliseconds,
    maxScroll: z.int().min(0).max(100),
  }),
  event('sorting_changed', {
    sorting: z.enum(sortings as [Sorting, ...Sorting[]]),
    direction: z.enum(['asc', 'desc']),
  }),
  event('view_changed', { view: z.enum(['list', 'grid']) }),
  // The filters as the list applies them, each as its field would read, and
  // the cars they leave. A list rather than an object, as Axiom makes a
  // column of every key, and a query naming a filter not yet used fails.
  event('filters_changed', {
    source: z.enum(['modal', 'chip', 'cleared', 'suggestion']),
    filters: z
      .array(z.strictObject({ key: filterKey, value: z.string().max(200) }))
      .max(filterKeys.length),
    count: z.int().min(0).max(10_000),
  }),
  // Its place in the list as it was sorted and filtered, from 0
  event('car_opened', { car: slug, position: z.int().min(0).max(10_000) }),
  // From the sheet to the car's own page
  event('car_sheet_expanded', { car: slug }),
  // To the car beside it in the list, `car` being the one stepped to
  event('car_sheet_stepped', {
    car: slug,
    direction: z.enum(['previous', 'next']),
    method: z.enum(['key', 'button']),
  }),
  event('compare_toggled', {
    car: slug,
    added: z.boolean(),
    count: z.int().min(0).max(MAX_COMPARED),
  }),
  event('comparison_opened', {
    cars: z.array(slug).min(1).max(MAX_COMPARED),
    source: z.enum(['tray', 'chat']),
    conversationId,
  }),
  event('compare_more', { cars: z.array(slug).min(1).max(MAX_COMPARED) }),
  // `written` when one was already there, which shows at once
  event('verdict_shown', { written: z.boolean(), waitMs: milliseconds }),
  event('verdict_failed', { waitMs: milliseconds }),
  event('seller_clicked', { car: slug }),
  event('ev_database_clicked', { car: slug }),
  event('shared', {
    target: pageKind,
    method: z.enum(['sheet', 'copy']),
  }),
  event('chat_bar_focused', {}),
  event('chat_opened', {}),
  // The route logs the question itself, under the same conversation
  event('chat_question_sent', { conversationId }),
  event('chat_car_picked', { car: slug, conversationId }),
  // Joined by requestId to the route's filter_suggestions event, and to the
  // filter_suggestion_outcome that follows a tap
  event('suggestions_shown', {
    requestId: z.uuid().optional(),
    count: z.int().min(1).max(20),
  }),
])

export type ProductEvent = z.output<typeof productEventSchema>
export type EventName = ProductEvent['name']

type WithoutEnvelope<Event> = Event extends unknown
  ? Omit<Event, keyof typeof envelope>
  : never

/** An event as a call site tracks it, before the page and its age are added */
export type TrackedEvent = WithoutEnvelope<z.input<typeof productEventSchema>>

const batchSchema = z.strictObject({
  sessionId: z.uuid(),
  device: z.enum(devices),
  events: z.array(z.unknown()).min(1).max(MAX_BATCH),
})

export type Batch = Omit<z.output<typeof batchSchema>, 'events'> & {
  events: ProductEvent[]
  /** The events in it this did not know, which only a count of says much */
  dropped: number
}

/**
 * The events in a request that read as events. A page left open across a
 * deploy can send one this no longer knows, which costs only that one.
 */
export const readBatch = (body: unknown): Batch | undefined => {
  const parsed = batchSchema.safeParse(body)
  if (!parsed.success) return undefined
  const events = parsed.data.events.flatMap((candidate) => {
    const read = productEventSchema.safeParse(candidate)
    return read.success ? [read.data] : []
  })
  const dropped = parsed.data.events.length - events.length
  return events.length > 0 ? { ...parsed.data, events, dropped } : undefined
}

/** What the route knows of a batch that the browser does not say */
export interface Receipt {
  receivedAt: number
  /** Vercel's two-letter guess from the address */
  country: string | undefined
  environment: string
  commit: string | undefined
}

/**
 * One row an event, flat, so each field is a column of its own in Axiom. Any
 * that were dropped are counted in a row of their own, `events_dropped`, so
 * a deploy that breaks an event shows up as more than a quiet gap.
 */
export const eventRows = (
  { sessionId, device, events, dropped }: Batch,
  { receivedAt, country, environment, commit }: Receipt,
) => {
  const about = { sessionId, device, country, environment, commit }
  const rows: object[] = events.map(({ ageMs, page, ...rest }) => ({
    _time: new Date(receivedAt - ageMs).toISOString(),
    ...rest,
    page: page.kind,
    pageSlugs: page.slugs,
    ...about,
  }))
  if (dropped > 0) {
    rows.push({
      _time: new Date(receivedAt).toISOString(),
      name: 'events_dropped',
      count: dropped,
      ...about,
    })
  }
  return rows
}
