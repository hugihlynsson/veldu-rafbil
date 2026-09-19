# Veldu Rafbíl

Icelandic single-page site listing every 100% electric car sold new in Iceland,
with sorting, filtering and an AI advisor chat. Next.js App Router + TypeScript +
Tailwind v4, deployed on Vercel.

## Verifying a change

`npm test`, `npm run typecheck` and `npm run lint`, plus `npm run build` for
anything beyond a data edit. The first three run on every pull request; Vercel
builds the preview, so CI does not repeat the build. The build needs no
environment variables and should print no warnings.

Tests are Vitest and live next to what they test. They cover the pure logic in
`modules/`; there are no component tests, and the browser-facing code in
`utils/` mostly cannot have one without a DOM. Two kinds are worth writing:
tests that pin a contract two places have to agree on (a URL round trip, a
query mapping), and tests over the car data itself — most commits edit that
file, and most corrections to it have been a bad link or an image that does not
resolve.

Formatting takes care of itself: a husky pre-commit hook runs oxfmt over the
staged files and then oxlint over the repo, so don't hand-format. `.oxfmtrc.json`
carries the style and the paths oxfmt must leave alone — generated files and
lockfiles belong to their tools.

`.oxlintrc.json` keeps a few rules at warning rather than error, where the real
fix is a bigger refactor than whatever you came here to do. Today that is the
URL-sync effects in `app/newCars.tsx`, which go away when sorting and filter
state stops being kept in React _and_ in the URL, and not before. Treat the
warnings a clean checkout produces as the budget: a run after your change should
show the same ones it showed before. A new warning is yours to fix, and
downgrading a rule to clear a run is not a fix.

## Layout

| Path              | What lives there                                                     |
| ----------------- | -------------------------------------------------------------------- |
| `modules/`        | Pure logic: no React, no browser. The car data lives here too        |
| `utils/`          | The things that _do_ need React or the browser                       |
| `components/`     | The UI, including the chat                                           |
| `app/page.tsx`    | Server component: turns `searchParams` into sorting and filter state |
| `app/newCars.tsx` | `'use client'` — all list state, sorting, filtering, URL sync        |

The whole rule for which of the first two a new file goes in: if it can be
tested in plain node, it is a module, and it gets a test next to it. If it
reaches for the DOM, a hook or storage, it is a util.

The car database is a single file of hand-written `NewCar` literals in
`modules/`. It is by far the largest file in the repo and most commits touch
only it. Anything that reads a car field should go through the helpers rather
than re-deriving it.

`components/Modal.tsx` is the shared half of every modal — a real `<dialog>`,
so that Escape, the backdrop and the focus trap are the browser's job, wrapped
in the enter and leave animation `<dialog>` does not do by itself. A caller
gives it a label, an `onDone`, optionally an element to focus (because
`showModal()` would otherwise land on the close button), and a render prop that
receives the visibility and a close function. The dialog carries `data-state`,
so a caller styles its own backdrop from it. Don't hand-roll a second one.

A modal made with `showModal()` sits in the top layer and makes the whole page
behind it inert, so anything that has to stay usable while one is open belongs
_inside_ the dialog. That is why the chat's single input is rendered either on
the page or as the dialog's composer, and why the draft lives in the container
rather than the input: the input is unmounted and mounted again by that move.
Render such things beside the panel rather than within it — the panel is scaled
and blurred, and a transform or a filter becomes the containing block of the
fixed things inside it.

Watch the names: the client component and the data module can share a name and
differ only by extension. They are not related.

## Domain rules that are easy to get wrong

**The grant is baked into every displayed price.** Cars under a price ceiling
get a government grant; both numbers live in `modules/` and change by
legislation, so read them, never inline them. `car.price` is the _list_ price;
anything user-facing — display, sorting by price, sorting by value, the
price/range/value filters, and the car summary fed to the LLM — must go through
`getPriceWithGrant()`. Never compare or render `car.price` raw except as the
"full price without grant" tooltip.

**Range is WLTP**, a manufacturer figure. Real Icelandic range is lower, and the
system prompt tells the assistant to say so.

**Fast-charge is derived, not stored.** `getKmPerMinutesCharged` computes it and
returns a fixed-precision **string**, so callers wrap it in `Number()` before
comparing.

**`addDecimalSeparators` exists because `toLocaleString()` breaks SSR** — it can
differ between Node and the browser and cause hydration mismatches. Use it for
every number rendered in the list UI.

**`stableSort`, not `Array.prototype.sort`**, for the car list, so equal-ranked
cars keep a deterministic order.

## Sorting and filtering

The contract in `modules/sorting.ts`:

- `ascendingSorter` always compares ascending; `carSorter` negates afterwards for
  `desc`. Add a new `Sorting` case there and TypeScript's exhaustive switch will
  flag everywhere else that needs it.
- `defaultDirection` is the "most useful first" direction per sorting. The URL
  only records deviations from it — the flip parameter means "flipped from the
  default", not "descending".
- Adding a sorting means touching every link in that chain: the `Sorting` and
  query types, both directions of the query mapping, the default direction, the
  sorter, and the toggle list in the client component. Let the exhaustive
  switches lead you.

Filters follow the same shape, and the multi-value ones travel as a comma
separated list — anything that writes one has to join and anything that reads
one has to split. A filter that round-trips through the URL wants a test, since
a multi-value filter coming back as a single value matches nothing and fails
quietly.

## Everything user-facing is Icelandic

UI copy, and **the query parameters too**. Keep the code identifiers English and
the wire format Icelandic. The mapping lives in `modules/filters.ts`,
`modules/sorting.ts` and the hooks in `app/newCars.tsx`, and has to stay in sync
in both directions — read it there rather than from a list in this file.

New copy that counts things needs Icelandic plural agreement: use `agree()`
from `modules/plural.ts` rather than testing the number yourself. The singular
goes with a count ending in 1 _except_ one ending in 11, which is the part that
is easy to get wrong.

## Adding or updating a car

1. Add a `NewCar` entry to the data module, grouped with its make (the list is
   roughly alphabetical by make, then model).
2. `price` in ISK using numeric separators: `9_990_000`. List price, pre-grant.
3. Drop the photo in `public/images/`, named after the car's hero image field
   and matching the dimensions and aspect ratio of the ones already there.
4. `expectedDelivery` is a lowercase-able Icelandic phrase and is what makes a
   car count as "expected" rather than available — it drives both the
   availability filter and the badge on the card.
5. Commit messages for this are short and plain: `Add BMW iX3 40`,
   `Update Skoda lineup`, `Fix B05 seller link`.

Copy that counts cars — the site's own description, the assistant's system
prompt — interpolates the length of the list, so no count needs updating by
hand. Keep it that way.

## Chat advisor

Lives in `app/api/chat/` and streams from a hosted model through the Vercel AI
SDK. The model name and provider are config, not architecture: read the route
rather than assuming. It needs the provider's API key; telemetry is optional and
its client is only constructed when its token is set.

**The model is picked on Icelandic performance, not on general benchmarks.** The
advisor only ever answers in Icelandic, so a model that tops the English
leaderboards and stumbles here is no use, and the trade-off to weigh is score
against cost and speed — the chat is public and free to use. Miðeind's Icelandic
LLM leaderboard is the yardstick:

<https://huggingface.co/spaces/mideind/icelandic-llm-leaderboard>

The comment on the model constant in the route says why the current one won.
Re-run that comparison before swapping the model, and update the comment with
what you found.

- The endpoint is public and spends money, so `POST` is guarded before it
  reaches the model: a per-IP rate limit (in-memory and best effort — one window
  per serverless instance) and a schema check on the body that bounds the
  message count and size. That schema deliberately stays loose about what is
  _inside_ a message part; the SDK's conversion owns that shape.
- The **entire car list is inlined into the system prompt** on every request, as
  post-grant prices. Changing `NewCar` fields or the grant changes what the model
  sees — keep the summary in step.
- Follow-up questions travel inside the message text as markers, parsed and
  stripped by `modules/chatHelpers.ts`. The stripping also has to handle a
  partial marker arriving mid-stream — keep that behaviour if you touch it.
- The car-details tool scrapes an external database with regexes. It is
  best-effort and returns a message rather than throwing on failure. **The URL is
  checked against the set of URLs in the car data before anything is fetched** —
  the model chooses that argument, and a model can be talked into choosing
  anything. The allowlist, the timeout and the response cap are a security
  boundary, not a nicety; a test pins the allowlist, and all three stay.
- Chat history is persisted in `localStorage` through `utils/chatStorage.ts`. Go
  through it rather than touching `localStorage` directly: every call there can
  throw (private mode, a full quota, half-written JSON from an older shape) and a
  broken history must read as an empty one rather than take the page down.

## Styling

Tailwind v4 — **no `tailwind.config.js`**. The theme, colours and the extra
breakpoint are the `@theme` block in `app/globals.css`; read the palette there
rather than guessing a colour name. Design is mobile-first. Chat markdown is
styled by plain CSS rules at the bottom of that file, not by utilities.

## Gotchas

- **React Compiler is on.** Don't add `useMemo`/`useCallback`/`memo` by hand; the
  compiler handles memoisation.
- **The chat is loaded lazily, on purpose** — the container is a `next/dynamic`
  import so the AI SDK is off the list's hydration path, and the modal is another
  one inside it so the markdown renderer is fetched only once someone opens the
  chat, warmed on intent. Importing either statically puts tens of kilobytes back
  into the first load for visitors who never chat, which is most of them.
- **`next/image` `sizes` is load-bearing.** A typo in it is silent: the browser
  falls back to `100vw` and fetches the largest candidate. `deviceSizes` in
  `next.config.js` is tuned to the phones people actually use.
- **Sorting and filter state lives in React _and_ in the URL** via
  `router.replace`. Adding state means updating the effect that serialises it,
  or the URL silently drifts from the UI.
- Analytics is loaded by a component that injects the script itself. Use its
  `trackEvent` helper for new events, and don't add a second `<script>` for it.
- **Leave the `nextjs-agent-rules` block at the bottom of this file alone.**
  `next dev` rewrites whatever sits between those two markers on startup. It
  preserves everything around them, so the rest of this file is yours.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
