# Veldu Rafbíl

Icelandic single-page site listing every 100% electric car sold new in Iceland,
with sorting, filtering and an AI advisor chat. Next.js App Router + TypeScript +
Tailwind v4, deployed on Vercel. One route: `/`.

## Commands

```bash
npm run dev        # next dev
npm run build      # next build — the real gate, no test suite exists
npx tsc --noEmit   # typecheck (there is no `lint` script; this is it)
npm run prettify   # prettier --write across the repo
```

There are **no tests and no ESLint**. After a change, run `npx tsc --noEmit` and,
for anything beyond a data edit, `npm run build`. The build succeeds with no
environment variables set; the `Missing Axiom token` lines it prints are expected.

`npm run prettify` rewrites the _whole_ repo and ~18 files are currently
unformatted, so running it produces a large unrelated diff. Format only what you
touched instead: `npx prettier --write <files>`.

## Layout

| Path                 | What lives there                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| `modules/newCars.ts` | The entire car database — ~185 hand-written `NewCar` literals, 2800 lines. Most commits touch only this. |
| `types.ts`           | All shared types, imported as `from '../types'`                                                          |
| `app/page.tsx`       | Server component: parses `searchParams` into `Sorting`/`Filters`                                         |
| `app/newCars.tsx`    | `'use client'` — all list state, sorting, filtering, URL sync                                            |
| `modules/`           | Pure domain logic (sorting, filtering, price, formatting)                                                |
| `components/`        | Presentational; `components/chat/` is the chat UI                                                        |
| `app/api/chat/`      | Gemini-backed advisor route + its `fetchCarDetails` tool                                                 |
| `public/images/`     | `<heroImageName>.jpg`, every one 1920×1280 (3:2)                                                         |

## Domain rules that are easy to get wrong

**The grant is baked into every displayed price.** Cars under 10,000,000 ISK get
a 500,000 ISK government grant (`modules/getPriceWithGrant.ts`, amount in
`modules/globals.ts`). `car.price` is the _list_ price; anything user-facing —
display, sorting by price, sorting by value, the price/range/value filters, and
the car summary fed to the LLM — must go through `getPriceWithGrant()`. Never
compare or render `car.price` raw except as the "full price without grant"
tooltip.

**Range is WLTP** (`car.range`), a manufacturer figure. Real Icelandic range is
lower; the system prompt tells the assistant to estimate 70–85%.

**Fast-charge is a derived number**, not a stored one:
`getKmPerMinutesCharged(timeToCharge10T080, range)` = `(range * 0.7) / minutes`,
returned as a `.toPrecision(3)` **string** — callers wrap it in `Number()` before
comparing.

**`addDecimalSeparators` exists because `toLocaleString()` breaks SSR** — it can
differ between Node and the browser and cause hydration mismatches. Use it for
every number rendered in the list UI.

**`stableSort` (`modules/stableSort.ts`), not `Array.prototype.sort`**, for the
car list, so equal-ranked cars keep a deterministic order.

## Sorting and filtering

The sorting contract in `modules/sorting.ts`:

- `ascendingSorter` always compares ascending; `carSorter` negates afterwards for
  `desc`. Add a new `Sorting` case there and TypeScript's exhaustive switch will
  flag the rest.
- `defaultDirection` is the "most useful first" direction per sorting (e.g.
  `range` defaults to `desc`). The URL only records deviations: `ofugt=1` means
  "flipped from the default", not "descending".
- Adding a sorting means updating `Sorting`, `SortingQuery`, `queryToSorting`,
  `sortingToQuery`, `defaultDirection`, `ascendingSorter`, and the `Toggles`
  items in `app/newCars.tsx`.

`carFilter` treats an _absent_ key as "no constraint"; present keys are ANDed.
Note the asymmetry: `drive` and `name` return `false` when their value is
missing, the numeric ones fall back to `MAX_SAFE_INTEGER`/`0`.

## Everything user-facing is Icelandic

UI copy, and **the query parameters too**. Keep the code identifiers English and
the wire format Icelandic; the mapping lives in `getFiltersFromQuery`
(`app/page.tsx`) and `useFilters`/`useSorting` (`app/newCars.tsx`) and must stay
in sync in both directions:

`radaeftir` sorting · `ofugt` flipped · `nafn` name · `verd` price ·
`draegni` range · `hrodun` acceleration · `virdi` value · `hradhledsla` fastcharge ·
`drif` drive · `frambod` availability (`faanlegir` = available, `vaentanlegir` = expected)

Use Icelandic characters properly (á é í ó ú ý þ æ ö ð) and mind the plural
agreement already handled in `app/newCars.tsx` ("bíll" vs "bílar").

## Adding or updating a car

1. Add a `NewCar` entry to `modules/newCars.ts`, grouped with its make (the list
   is roughly alphabetical by make, then model).
2. `price` in ISK using numeric separators: `9_990_000`. List price, pre-grant.
3. Drop the photo at `public/images/<heroImageName>.jpg`, 1920×1280.
4. `expectedDelivery` is a lowercase-able Icelandic phrase (`"sumar 2026"`) and
   is what makes a car count as "expected" rather than available — it drives both
   the `frambod` filter and the badge on the card.
5. Commit messages for this are short and plain: `Add BMW iX3 40`,
   `Update Skoda lineup`, `Fix B05 seller link`.

The site's own description ("Listi yfir alla N bílana…") and the assistant's
system prompt both interpolate `newCars.length`, so no count needs updating by
hand.

## Chat advisor (`app/api/chat/route.ts`)

- Streams from `gemini-3.8-flash` via `@ai-sdk/google` and the Vercel AI SDK.
  Needs `GOOGLE_GENERATIVE_AI_API_KEY`; `AXIOM_TOKEN` is optional telemetry.
- The **entire car list is inlined into the system prompt** on every request, as
  post-grant prices. Changing `NewCar` fields or `getPriceWithGrant` changes what
  the model sees — keep `carsSummary` in step.
- The prompt is Icelandic and the assistant must answer in Icelandic and refuse
  off-topic questions.
- Follow-up questions travel in the message text as `[q:…]` markers, parsed and
  stripped by `utils/chatHelpers.ts`. `stripFollowUps` also handles the partial
  `[q:` that appears mid-stream — keep that behaviour if you touch it.
- `fetchCarDetails` scrapes ev-database.org HTML with regexes against
  `car.evDatabaseURL`. It is best-effort and returns a message rather than
  throwing on failure.
- Chat history is persisted in `localStorage` under `veldu-rafbil-chat-messages`
  (`components/ChatContainer.tsx`).

## Styling

Tailwind v4 — **no `tailwind.config.js`**. The theme is `@theme` in
`app/globals.css`: colours `sky`, `sky-darker`, `tint`, `stone`, `clay`, `smoke`,
`cloud`, `lab`, plus an `xs` breakpoint at 375px (design is mobile-first, `xs:`
and `md:` are the workhorses). Chat markdown is styled by the plain
`.message-content` rules at the bottom of that file, not by utilities.

Prettier config: **no semicolons**, single quotes, trailing commas, always
parenthesise arrow params.

## Gotchas

- **React Compiler is on** (`reactCompiler: true`, `babel-plugin-react-compiler`).
  Don't add `useMemo`/`useCallback`/`memo` by hand; the compiler handles
  memoisation.
- `useBodyScrollLock` is copy-pasted into both `app/newCars.tsx` and
  `components/ChatContainer.tsx`. Fix one, fix both. `reactStrictMode` is on, so
  its effects double-invoke in dev.
- Sorting and filter state lives in React _and_ in the URL via `router.replace`.
  Adding state means updating the effect that serialises it, or the URL silently
  drifts from the UI.
- Fathom analytics is loaded twice on purpose-ish: a `<script>` in `app/layout.tsx`
  and `fathom-client` in `components/Fathom.tsx`. Site ID `DDOQKVOW` is hardcoded.
  Use `trackEvent('…')` for new events.
- Image `deviceSizes` in `next.config.js` are tuned to specific iPhone widths with
  comments; don't prune them casually.
- `/notadir` (the retired used-cars route) permanently redirects to `/`. `UsedCar`,
  `ProcessedUsedCar` and `Snapshot` in `types.ts` are leftovers from it.
