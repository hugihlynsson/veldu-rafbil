---
name: write-car-reviews
description: Write or refresh the reviews on each car's page in modules/data/carReviews.ts, and the details they are written from in scripts/carDetails.json — including finding a car's boot and body when ev-database is blocked. Use after a car is added or its figures change, when carReviews.test.ts fails, or when asked to write, rewrite or fix a review.
---

# Writing the car reviews

Each car's page has a short review in `modules/data/carReviews.ts`, with the
questions its chat offers to start on. `scripts/car-reviews.ts` writes them
with the advisor's model, from prompts in `scripts/reviewPrompt.ts` that work
out every gap and standing in code. The model is the one chosen for its
Icelandic (see the comment on `advisorModel`), so the script stays the writer;
this skill is everything around it.

## 1. Run the script, naming the cars

```bash
node --env-file=.env.local --import ./scripts/resolve.ts scripts/car-reviews.ts <slug>…
```

Name the cars the change put out of date: each car added or whose figures
changed, each car whose entry in `similarCars.ts` was edited, and each car that
offers a changed car as similar. `npx vitest run modules/data/carReviews.test.ts`
lists the ones that are missing or stale. Each review is a billed minute of
thinking, so a bare run stops when more than a few are due; when it does,
something other than this change put them out of date (a change to the grant
does it to nearly all of them), so say so rather than passing `--due`.

## 2. If it stops for a car's details

A review is written from every car's details in `scripts/carDetails.json`:
body, segment, length, boot, frunk and battery warranty, by slug. Most were
read off ev-database. Towing is not among them: a review takes the list's own
`towing` from `newCars.ts`, which the `update-new-cars` skill sources. A car
with no entry is looked up when the script runs: first its ev-database page,
then, if that fails (ev-database answers 429 for weeks at a time), the site's
front page, which lists every car and has kept answering through the blocks.
The front page has no length or warranty, and gives boot and frunk as one
figure, kept as `cargoWithFrunk`; the prompt compares every car on the two
together. A car whose `evDatabaseUrl` changes is looked up again, as is one
that gains a link. To do that without writing any review, as when only a link
changed, run `node --import ./scripts/resolve.ts scripts/car-reviews.ts --details`.

A link that answers 404 stops the run, rather than taking the car off the list
by its id and shipping the broken link: find the right page with
`scripts/ev-database-list.ts` and fix `evDatabaseUrl` in `newCars.ts`.

A car on neither, usually one with no `evDatabaseUrl`, stops the run with
`No details for <slug>`. Write its entry by hand, then run the script again:

```json
"hongqi-ehs5-base": {
  "source": "https://electricvehicleweb.com/hongqi-ehs5/",
  "read": "2026-11-14",
  "body": "SUV",
  "segment": "D - Large",
  "length": 4750,
  "cargo": 462,
  "cargoMax": 1601,
  "frunk": 48
}
```

- **Units:** mm for length, litres for `cargo` (seats up), `cargoMax` (seats
  folded) and `frunk`. Leave out a field you could not find, rather than
  guessing or writing 0.
- **`body`** is one of ev-database's names, the keys of `bodyNames` in
  `scripts/reviewPrompt.ts` (`SUV`, `Hatchback`, `Liftback Sedan`, …), which the
  prompt puts into Icelandic. **`segment`** is the European letter and its name:
  `B - Compact`, `C - Medium`, `D - Large`, `E - Executive`.
- **`source`** is the one page you read the figures on, and `read` is today.
  A car that has an `evDatabaseUrl` gets the same in its entry, or the next
  run takes the entry for one read off another page and looks the car up
  again. `carDetails.test.ts` checks every entry's bounds, body and link.

Where to look, in order:

1. **The car's ev-database page, if there is one.** Look for it even when the
   car has no `evDatabaseUrl`, as the site may have added it since:
   `node --import ./scripts/resolve.ts scripts/ev-database-list.ts "<make> <model>"` searches the front
   page, which gives its URL. If you find one, add it to the car in
   `newCars.ts`, and the next run reads its details itself.
   While the pages answer 429 to curl, WebFetch and the browser alike,
   `WebSearch` with `allowed_domains: ["ev-database.org"]` still returns their
   figures in its snippets.
2. **fleetnews.co.uk**, which republishes ev-database's data under the same
   reference number.
3. **The maker's own specifications**: a spec-sheet PDF, the press site, or a
   country site's technical data. Iceland's importer rarely lists the boot;
   the UK, German or French sites usually do.
4. **A specialist review** (electrifying.com, carsguide, Auto Express) for
   what the maker does not give.

A variant shares the body, segment, length and boot of its siblings.

## 3. Read what it wrote

Read each new review in the diff before committing, as you would the figures:

- **Body and size.** With details missing or thin, the model has guessed a
  body wrong before ("fólksbíll eða hlaðbakur" for an SUV).
- **No grant.** A review never mentions the rafbílastyrkur, not even that a
  car does not get it: the price is what the buyer pays.
- **Tone.** Like a knowledgeable friend, not a salesman: everyday words
  ("krókur", not "dráttargeta"), short closing lines. Never "þú" or "ég": a
  review speaks of "fólk sem vill…" or "þá sem þurfa…", never "fyrir þig sem
  vilt…" or "færðu". `carReviews.test.ts` fails on either.
- **Typos and grammar.** Fix them by hand in `carReviews.ts`. An edited review
  is kept by later runs until its car's figures change.

## When the script cannot write at all

Without the API key, or with the provider down, write the review by hand from
the same facts. Print `reviewPrompt(car, details)` and `reviewFactsKey(car)`
from `scripts/reviewPrompt.ts` with a throwaway script in `scripts/`, where the
`@/` imports resolve, and read details from `carDetails.json`. Write to the
prompt's rules, set `facts` to the key and leave out `model`. Then write its
questions the same way, from `questionsPrompt`.

## Keeping the details current

The details change with a model year, not between runs, so a run reads no
page for a car that has an entry. To bring the front-page entries up to their
pages (which add length, frunk and warranty), and to reread pages over a year
old:

```bash
node --import ./scripts/resolve.ts scripts/car-reviews.ts --refresh-details
```

It reads one page every 9 seconds and stops at the first 429, saving as it
goes, so it can be cut short or run again. Check with a single `curl -sI` on a
car page first, and don't run it while ev-database is blocking.
