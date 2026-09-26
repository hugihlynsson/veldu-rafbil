# Veldu Rafbíl

Icelandic single-page site listing every 100% electric car sold new in Iceland,
with sorting, filtering and an AI advisor chat. Next.js App Router + TypeScript +
Tailwind v4, deployed on Vercel.

This file holds the conventions, not the contracts. A rule about how one module
behaves is a comment in that module with a test beside it — read it there, where
the next reader is already looking and where the change that breaks it has to
touch it. What is here is what the code cannot tell you on its own.

## Verifying a change

`npm test`, `npm run typecheck` and `npm run lint`, plus `npm run build` for
anything beyond a data edit. The first three run on every pull request; Vercel
builds the preview, so CI does not repeat the build. The build needs no
environment variables and should print no warnings.

The lint budget is zero. `.oxlintrc.json` keeps a few rules at warning rather
than error, where the real fix would be a bigger refactor than whatever you came
here to do, and a clean checkout produces none of them. A warning your change
introduces is yours to fix; downgrading a rule to clear a run is not a fix.

Formatting takes care of itself — a husky pre-commit hook runs oxfmt over the
staged files and then oxlint over the repo, so don't hand-format.

Tests are Vitest and live next to what they test. They cover the pure logic in
`modules/`; there are no component tests. Two kinds are worth writing: tests
that pin a contract two places have to agree on (a URL round trip, a query
mapping), and tests over the car data itself — most commits edit that file, and
most corrections to it have been a bad link or a photo that does not resolve.

## Comments

Default to none — good names and structure should carry the meaning. Add one
only when it explains a non-obvious _why_: a workaround, an invariant, a
constraint the code itself doesn't show. Most comments should be one-liners.

Don't write a comment that restates what the code already says, narrates the
change ("removed X", "added for the Y fix"), or explains something a reader
gets from the name. If you'd delete the comment and the code would still be
just as clear, don't write it.

This is also where a rule about the domain goes. Write it next to the code it
governs rather than here, and pin it with a test.

## Layout

| Path           | What lives there                                                |
| -------------- | --------------------------------------------------------------- |
| `modules/`     | Pure logic: no React, no browser. The car data lives here too   |
| `utils/`       | The things that _do_ need React or the browser                  |
| `components/`  | The UI, including the chat                                      |
| `app/page.tsx` | The list, built once at deploy for a URL with no sort or filter |
| `app/listi/`   | The same list rendered per request, for a URL with one          |

The car data is read through `modules/cars.ts`, not `newCars.ts`: each `Car`
carries its id, label, price after the grant and charge rate, derived once. The
URL state is one table in `modules/filters.ts` and two parsers in
`modules/sorting.ts`, which nuqs reads on the server and writes in the browser.

The whole rule for which of the first two a new file goes in: if it can be
tested in plain node, it is a module, and it gets a test next to it. If it
reaches for the DOM, a hook or storage, it is a util.

Two components exist so a third copy never gets written — `FilterField.tsx` for
a field in the filter modal, `Modal.tsx` for a modal. Don't hand-roll either.
A `showModal()` dialog makes the page behind it inert, so anything that must
stay usable while one is open belongs _inside_ it, and anything fixed belongs
beside the panel rather than within it — a transform or a filter becomes the
containing block of the fixed things inside it.

`components/CarList.tsx` is the `'use client'` list, its sorting and filters
held by nuqs. Import across folders with `@/` (`@/modules/cars`), and with `./`
within one.

## The car data

`modules/newCars.ts` is one file of hand-written `NewCar` literals. It is by far
the largest file in the repo and most commits touch only it. Adding or updating
a car is the `update-new-cars` skill — read it rather than working from a
brochure directly.

`NewCar` is inferred from the Zod schema in `modules/newCarSchema.ts`, and
`newCars.test.ts` checks every entry against it. A field is added there, with
its bounds, rather than in `types.ts`.

Never re-derive a car field. Read cars through `modules/cars.ts`, whose `Car`
already carries `id`, `label`, `priceWithGrant`, `pricePerKm` and
`kmPerMinuteCharged`. Each of those has a module that owns the rule, and the
rule is the comment there:

| Before you                                  | Read                           |
| ------------------------------------------- | ------------------------------ |
| price, sort or filter on money              | `getPriceWithGrant`, `globals` |
| write copy that names the grant             | `grantCopy`                    |
| show or rank a charge rate                  | `getKmPerMinutesCharged`       |
| render any number in the list UI            | `addDecimalSeparators`         |
| build an anchor, React key or scroll target | `getCarId`                     |

The grant is worth stating twice, because getting it wrong is silent:
`car.price` is the _list_ price, everything user-facing reads
`car.priceWithGrant`, and raw `car.price` is only ever the "full price without
grant" tooltip.

No number about the data is written out by hand — copy that counts cars
interpolates the length of the list, and copy that names the grant reads the
figures. Keep it that way.

## Sorting and filtering

State lives in the URL, held by [nuqs](https://nuqs.dev): the same parsers
read it on the server and write it in the browser with a shallow
`history.replaceState`. Every filter is one entry in `filterDefinitions` in
`modules/filters.ts` — its Icelandic key, its parser and the test it puts a car
to — and the sorting is two parsers in `modules/sorting.ts`.

Most visits arrive at a bare `/`, which is built once and served from the CDN.
A URL carrying any of those keys is rewritten in `next.config.ts` to
`app/listi`, which renders per request, so a shared link arrives sorted and
filtered rather than reordering once it hydrates. The rewrite reads its keys
from the same two tables, and `next.config.test.ts` puts every sorting and
filter through it, so a new one needs nothing more here.

Adding a filter is an entry in that table, its chip in `ActiveFilters.tsx`, and
its field and `case` in `FilterModal.tsx`. The first two are mapped over
`Filters` and the modal's switch is exhaustive, so the compile tells you what
is missing; only the field is on you. A
sorting needs its key in `sorting.ts` and a place in the toggle list in the
client component. Write your own parser with `createParser` rather than an
`Array.isArray` at a call site, and give a filter that round-trips through the
URL a test: a multi-value filter coming back as a single value matches nothing,
and fails quietly.

## Everything user-facing is Icelandic

UI copy, and **the query parameters too**. Keep the code identifiers English and
the wire format Icelandic; the mapping is in `modules/filters.ts` and
`modules/sorting.ts`. `llms.txt` is the one exception on the site — its readers
are agents, not Icelandic car buyers.

Copy that counts things needs Icelandic plural agreement: use `agree()` from
`modules/plural.ts` rather than testing the number yourself.

## Chat advisor

`app/api/chat/` streams from a hosted model through the Vercel AI SDK. The model
and the provider are config, not architecture: read the route rather than
assuming.

**The model is picked on Icelandic performance, not general benchmarks.** The
advisor only ever answers in Icelandic, so one that tops the English
leaderboards and stumbles here is no use; the trade-off is score against cost
and speed, since the chat is public and free. Miðeind's leaderboard is the
yardstick — <https://huggingface.co/spaces/mideind/icelandic-llm-leaderboard>.
Re-run that comparison before swapping the model, and say in the comment on the
model constant what you found.

The system prompt is built in `modules/chatPrompt.ts`, from the same data and
constants as the rest of the site, and tested there. The whole car list is
inlined into it, which is what makes the
provider's implicit prompt caching worth having — it only hits on an identical
prefix, so keep anything per-request out of the system prompt.

The endpoint is public and spends money. The rate limit, the body schema, and
the allowlist, timeout and response cap on the car-details tool are a security
boundary, not a nicety: the model chooses the URL that tool fetches, and a model
can be talked into choosing anything. Tests pin them, and all of them stay.

`route.ts` holds only what needs the request or the provider — the rate limit,
the model and the logging, which runs in `after()` so it never holds the stream
open. Everything else is `chat.ts`, which takes the model as a parameter so
`chat.test.ts` can run it against a mock model: `parseChatRequest` bounds the
body and validates each message with `validateUIMessages`, and `streamChat`
streams the answer.

The prompt still asks for `[q:…]` follow-up markers, but they never reach the
browser: a stream transform in `modules/followUps.ts` takes them out of the text
and they arrive as the message's `metadata.followUps`. Histories stored before
that are upgraded as they are read.

`modules/chatMessage.ts` owns the `ChatMessage` type and its one validator,
shared by the route and the stored history, so the two cannot disagree on
what a message is.

## Published data

`/api/cars`, `/llms.txt` and `/robots.txt` are for readers who are not a
browser. The first two are `force-static`, built at deploy and served from the
CDN, which is why neither needs the rate limiting `/api/chat` has.

**The published shape is deliberately not `NewCar`.** It is a promise to people
who cannot see the commit that changes it, so adding a field to `NewCar` does
not add it here, and the hero photos stay out of it entirely.
`modules/carApi.ts` owns the wire format and `modules/llmsText.ts` the text; the
reasoning is in the comments there and `carApi.test.ts` fails if it is broken.

## Styling

Tailwind v4 — **no `tailwind.config.js`**. The theme, colours and the extra
breakpoint are the `@theme` block in `app/globals.css`; read the palette there
rather than guessing a colour name. Design is mobile-first. Chat markdown is
styled by plain CSS rules at the bottom of that file, not by utilities.

Light and dark share one set of names. Every colour token is a role — text,
surface, line, overlay — and the `prefers-color-scheme` block under `@theme`
is the only place a role takes a different value. So there is no `dark:`
variant in the codebase, and a new colour should not add one: give the role a
value in both blocks instead of a literal and a variant beside it. The dark
values were each picked against the surface they land on rather than by eye,
so take a pair off the ladder in that file rather than inventing one.

Shadows are the exception that has to live outside `@theme`, read as
`shadow-(--shadow-chip)`: Tailwind inlines a theme shadow into the utility
itself, where a dark override would never reach it.

## Gotchas

- **React Compiler is on.** Don't add `useMemo`/`useCallback`/`memo` by hand;
  the compiler handles memoisation.
- **The chat is loaded lazily, on purpose** — the container is a `next/dynamic`
  import so the AI SDK is off the list's hydration path, and the modal is
  another inside it so the markdown renderer is fetched only once someone opens
  the chat. Importing either statically puts tens of kilobytes back into the
  first load for visitors who never chat, which is most of them.
- **`next/image` `sizes` is load-bearing.** A typo in it is silent: the browser
  falls back to `100vw` and fetches the largest candidate. `deviceSizes` in
  `next.config.ts` is tuned to the phones people actually use. A `sizes` with
  no `vw` in it is worse than none — Next then puts every configured width in
  the srcset — and an image without one gets a 1x/2x pair off its `width`
  prop, so that prop has to be the size the box really renders at.
- **Nothing rendered on both sides may read the runtime's default locale.** It
  is not the same in node as in an Icelandic browser, and it surfaces as a
  hydration mismatch rather than an error.
- **Functions run in Dublin**, `regions` in `vercel.json`: the Vercel region
  nearest Iceland, where nearly every visitor is. Set it there, not with
  `preferredRegion` in a route, which this Next deprecates with a build warning.
- Analytics is loaded by a component that injects the script itself. Use its
  `trackEvent` helper for new events, and don't add a second `<script>` for it.
- Commit messages are short and plain: `Add BMW iX3 40`, `Update Skoda lineup`,
  `Fix B05 seller link`.
- **Leave the `nextjs-agent-rules` block at the bottom of this file alone.**
  `next dev` rewrites whatever sits between those two markers on startup. It
  preserves everything around them, so the rest of this file is yours.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
