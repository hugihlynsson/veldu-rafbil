# Veldu Rafbíl

Icelandic single-page site listing every 100% electric car sold new in Iceland,
with sorting, filtering and an AI advisor chat. Next.js App Router + TypeScript +
Tailwind v4, deployed on Vercel.

This file holds the conventions, not the contracts. A rule about how one module
behaves is a comment in that module with a test beside it — read it there, where
the next reader is already looking and where the change that breaks it has to
touch it. What is here is what the code cannot tell you on its own, so a file
is named here only where it is the place to start, and a refactor should rarely
need to touch this file.

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
`modules/` and beside the routes; there are no component tests. Two kinds are
worth writing: tests that pin a contract two places have to agree on (a URL
round trip, a query mapping), and tests over the car data itself — most
commits edit that file, and most corrections to it have been a bad link or a
photo that does not resolve.

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

## Where code goes

- Anything that reaches for the DOM, a hook or storage is a util, in `utils/`.
- Everything else is pure logic with a test next to it. It lives beside the one
  route that uses it, and moves to `modules/`, in the folder for its part of the
  site, once anything else does. A file in `app/` is only served if it is a
  `route.ts` or a `page.tsx`, so the rest are safe there.
- Code the browser must never load, like the system prompt and the model calls,
  stays beside its route, where an import from a component would look as wrong
  as it is.
- No `index.ts` that re-exports a folder: one import would pull the whole folder
  into the list's first load, which `firstLoad.test.ts` guards.
- Import across folders with `@/` and within one with `./`.

Three components exist so another copy never gets written — `FilterField.tsx`
for a field in the filter modal, `Modal.tsx` for a modal, and
`SuggestionPills.tsx` for a stack of pills above the chat input. Don't
hand-roll any of them.

## The car data

`modules/data/newCars.ts` is one file of hand-written `NewCar` literals. It is by
far the largest file in the repo and most commits touch only it. Adding or
updating a car is the `update-new-cars` skill — read it rather than working from
a brochure directly.

`NewCar` is inferred from the Zod schema in `modules/data/newCarSchema.ts`, and
`newCars.test.ts` checks every entry against it. A field is added there, with
its bounds, rather than as a type of its own.

Never re-derive a car field. Read cars through `modules/data/cars.ts`: each
`Car` already carries its id, label, price after the grant, price per km and
charge rate, and the module that works each one out holds its rule. Copy that
names the grant reads `modules/copy/grantCopy.ts`, and every number in the list
UI goes through `addDecimalSeparators`.

The grant is worth stating twice, because getting it wrong is silent:
`car.price` is the _list_ price, everything user-facing reads
`car.priceWithGrant`, and raw `car.price` is only ever the "full price without
grant" tooltip.

No number about the data is written out by hand — copy that counts cars
interpolates the length of the list, and copy that names the grant reads the
figures. Keep it that way.

## Sorting and filtering

The state lives in the URL, held by [nuqs](https://nuqs.dev), so a shared link
arrives sorted and filtered. Each filter is one entry in `filterDefinitions` in
`modules/list/filters.ts` and each sorting one in `sortingDefinitions` in
`modules/list/sorting.ts`; the comment on each table says what else a new one
needs.

## Everything user-facing is Icelandic

UI copy, and **the query parameters too**. Keep the code identifiers English and
the wire format Icelandic. `llms.txt` is the one exception on the site — its
readers are agents, not Icelandic car buyers.

Copy that counts things needs Icelandic plural agreement: use `agree()` from
`modules/copy/plural.ts` rather than testing the number yourself.

## The AI endpoints

`/api/chat`, the advisor, and `/api/filter-suggestions`, the filter pills above
the chat input, are public, free to use, and spend money on every call.

- **Their limits are a security boundary, not a nicety.** The rate limits, the
  body schemas, the car-details tool's allowlist, redirect check, timeout,
  response cap and per-answer call limit, and `readSuggestions` putting every
  suggestion back through its filter's parser: tests pin each one, and all of
  them stay. The model chooses the URL that tool fetches, and a model can be
  talked into choosing anything.
- **A model is chosen on Icelandic, not on general benchmarks.** The advisor
  only ever answers in Icelandic, so one that tops the English leaderboards and
  stumbles here is no use; the trade-off is score against cost and speed. The
  comment on each model constant says what the last comparison found and how to
  re-run it — do that before changing the model, and update the comment.
- **Keep anything per-request out of the chat's system prompt.** It inlines the
  whole car list, and the provider's prompt caching only hits on an identical
  prefix.
- **A model never writes a filter value.** The parser reads what a request
  states outright, for free; a model only picks from options cut from the car
  data. A suggestion is tapped, never applied for you, since a wrong filter
  quietly empties the list.

## Published data

`/api/cars` and `/llms.txt` are for readers who cannot see the commit that
changes them, so their shape is a promise and deliberately not `NewCar`: a field
added to a car does not reach them unless it is added there on purpose. The
reasoning is in `app/api/cars/carApi.ts`, and its test fails if it is broken.

## Styling

Tailwind v4 — **no `tailwind.config.js`**; the theme is the `@theme` block in
`app/globals.css`. Tailwind's default palette, radii, shadows and breakpoints
are cleared there, so `bg-gray-100` or `lg:` silently compiles to nothing. Use
the names defined there, and add one there when a value repeats rather than
writing it in brackets. Design is mobile-first. Chat markdown is styled by
plain CSS rules at the bottom of that file, not by utilities.

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
- **The chat is loaded lazily, on purpose** — the bar is a `next/dynamic`
  import so it is off the list's hydration path, the engine holding `useChat`
  is another inside it so the AI SDK and zod wait until someone focuses the
  bar, and the modal a third so the markdown renderer is fetched only once
  someone opens the chat. Importing any of them statically puts tens of
  kilobytes back into what every visitor downloads, though most never chat.
- **`next/image` `sizes` is load-bearing.** A typo in it is silent: the browser
  falls back to `100vw` and fetches the largest candidate. `deviceSizes` in
  `next.config.ts` is tuned to the phones people actually use. A `sizes` with
  no `vw` in it is worse than none — Next then puts every configured width in
  the srcset — and an image without one gets a 1x/2x pair off its `width`
  prop, so that prop has to be the size the box really renders at.
- **A `showModal()` dialog makes the page behind it inert**, so anything that
  must stay usable while one is open belongs _inside_ it, and anything fixed
  belongs beside the panel rather than within it — a transform or a filter
  becomes the containing block of the fixed things inside it.
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
