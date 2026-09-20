---
name: update-new-cars
description: Refresh the car list in modules/newCars.ts against the sellers' current price lists — prices, new and discontinued variants, expected deliveries. Use when asked to update, sweep, or check prices for one make or all of them.
---

# Updating the car list

The list is `modules/newCars.ts`: hand-written `NewCar` literals, one per
variant. Updating it means reading each importer's current price list, comparing
it with what is there, and editing the difference. `AGENTS.md` covers the
repo's conventions; the rules about a car field are comments in the module that
owns it. This file is the process, end to end.

Where each make's price list lives, and how to get at it, is in
[sources.md](sources.md). Fix that file when a URL rots or you learn a better
way in; the next run depends on it.

## What counts as one entry

- **One entry per battery/drive variant, priced at its cheapest trim.** The Kia
  EV2 has two batteries and three trims each; the list carries one entry per
  battery, at the entry trim's price. Trim ladders (Light/Air/Earth) are not
  entries. Look at how the make's existing entries are split and follow that.
  Two things fold into an existing entry instead of making a new one: a variant
  with the same battery and drive that differs only in wheel size (the Mazda
  CX-6e has a 484 km and a 468 km row for 19" and 21" wheels), and a trim that is
  only a step up in equipment.
- **A variant sold as an option package is the base plus the package.** The
  Polestar 2 "Long Range Performance" is the Long Range Dual Motor plus a
  900.000 kr. Performance package, and its price is derived that way, so when the
  base moves the variant moves with it.
- **Only 100% electric cars.** The importers' lists are full of hybrids, plug-in
  hybrids and diesel siblings of the EV. Skip them. Lists also mix in commercial
  vehicles: cargo vans and pickups (Kia PV5 Cargo, Toyota Hilux, Proace) are not
  in the list, while people carriers (PV5 Passenger, Proace Verso) are.
- **`price` is always the price before the grant, with VAT.** The site
  subtracts the grant itself, so a figure that already has it deducted gets it
  deducted twice. Lists differ in what they print, and nearly all of them label
  it:
  - **Both, labelled.** The usual case: "Verð" and "Verð með rafbílastyrk" (or
    "Verð með styrk", "Verð með 500.000 kr. styrk frá Orkusjóði"), as rows in
    Kia's lists and as columns in Audi's, Mazda's and Polestar's. Take the
    unlabelled one; the fine print sometimes says so outright ("verð án
    sérstaks styrks … er fullt verð").
  - **Only the price with the grant.** Add the grant back. Read the amount from
    `grantAmount` in `modules/globals.ts` rather than typing it, and check the
    sum is still under the ceiling in `modules/getPriceWithGrant.ts`; a car over
    it gets no grant, so a figure labelled "með styrk" cannot belong to one.
  - **Only one figure and no label.** Toyota's and Lexus's lists print a single
    "VERÐ", and it is the pre-grant price: it equals what the list already has.
    When a list is unlabelled, compare it with the existing entry before
    deciding.
  - Van rows add a "Verð án vsk", without VAT. That is not the price either.
  - **A change of exactly the grant amount is a red flag.** It is what a row read
    from the wrong column looks like. Re-read the label before applying it.
- Price digits are real. Askja lists end in `…777`; keep them (`4_490_777`).

## The process

### 1. Scope and a baseline

Work per make. If the user named makes, do those; otherwise sweep all of them,
in alphabetical order so the diff stays readable.

Before opening a price list, pull up what the list currently says for that make
(`grep -n "make: 'Kia'" modules/newCars.ts`, then read the entries). You are
looking for a difference, so know the starting point.

To see which makes are worth a look first, check the freshness signals instead
of opening everything. The last time the make was touched is
`git log -1 --format=%ad -S"make: 'Kia'" -- modules/newCars.ts`; a price list
uploaded after that date has not been applied yet. The upload date of an issuu
document comes from `scripts/issuu-pages.sh`, and dated filenames (Polestar)
carry their own. A list older than the last touch can be skipped, and it is
worth saying so in the report.

### 2. Get the current price list

Follow [sources.md](sources.md) for the make. Prefer text to images wherever
the source has any: digits come out exactly, where a page image can be misread.
The shapes you will meet, best first:

- **An iPaper flipbook** (Toyota and Lexus). The page's HTML carries the text of
  every page. `scripts/ipaper-text.py <url>` prints it, one line per page. No
  browser is needed, and the `?page=N` in the URL changes nothing.
- **A PDF at a URL.** Download it into the scratchpad. On a Mac,
  `scripts/pdf.swift` reads it without installing anything; compile it once
  with `swiftc -O scripts/pdf.swift -o <scratchpad>/pdf` (running the source
  directly recompiles every time and takes half a minute).
  - `pdf text <pdf>` prints the text layer. Audi's and Polestar's price tables
    are in it as one line per model.
  - Some PDFs keep the price table as an image, so it is missing from the text
    (Mazda's). Use `pdf pages <pdf> <dir> [scale]` to render JPEGs for the Read
    tool. Where the content is small on a large sheet, render at scale 5 and
    crop the table with `sips` to read the digits.
  - Without a Mac, `pdftotext` and `pdftoppm` from poppler do the same.
- **An issuu flipbook.** Issuu has no text layer, only page images.
  `scripts/issuu-pages.sh <doc url> <dir>` downloads every page as a JPEG; read
  those with the Read tool. A price list is one or two pages, and page 1 carries
  the price table with the headline specs. Read page 2 only for the figures
  page 1 lacks.
  The script also prints the upload date taken from the document id. **That
  date, not the date on the publisher's listing, says how fresh the list is.**
  Importers re-upload over the same document, and the listing keeps the date of
  the first publish (an EV2 list listed in April was uploaded in September).
- **A JS-rendered page or a blocked one** (Audi and Tesla answer 403 to WebFetch
  and curl). Use the built-in browser: `get_page_text` for prices printed on
  the page, `javascript_exec` to pull link `href`s. The browser pane must be
  showing for screenshots to work. Look for what the page links to before
  reading the page itself; Audi's page is a shell around PDFs that plain curl
  can fetch.

Read the price table and the spec page of a brochure, not the equipment lists.

### 3. Compare

For each electric variant in the list, sort it into one of:

| Finding                       | Action                                                       |
| ----------------------------- | ------------------------------------------------------------ |
| Price changed                 | Edit `price`                                                 |
| Variant in the list, not here | Add it (see below)                                           |
| Variant here, not in the list | Investigate before removing                                  |
| Now shipping                  | Delete `expectedDelivery`                                    |
| Delivery date changed         | Edit `expectedDelivery`                                      |
| Spec really changed           | Edit — new model year, bigger battery, not a rounding change |

**Removing a car.** A car missing from a price list is not proof it is gone —
lists get split, renamed and sometimes just not uploaded. Remove one only when
the importer's own site or list says it is discontinued; otherwise leave it and
flag it in the report. Removing a car also means deleting its photo in
`public/images/`: a test fails on photos no car uses.

**Specs on existing cars.** The brochures round differently from ev-database,
which the existing numbers appear to follow (the EV2 entry has 8.5 s and 30 min
where the brochure says 8.6 s and 29 min). Do not overwrite a spec because the
brochure differs in the last digit. Change it when the car itself changed.

**Range is the exception, and it follows a rule.** `range` is the lower of the
two WLTP figures, the brochure's and ev-database's. Expect it to move often: the
first sweep changed eleven, by 1 to 31 km (Polestar 3 610 → 628, Toyota bZ4X
Touring 591 → 560). Read ev-database's headline figure (TEL, the one listed
first) for its side; its page shows a second, lower rating (TEH), which is not
what the rule refers to. Say in the report which range changes you made, so the
owner can look them over.

The brochure side only exists for a make whose list you read this run. A car you
did not read a list for keeps the range it has.

### 4. Adding a car

A `NewCar` literal goes in with its make — the list is roughly alphabetical by
make, then model. The fields that are easy to get wrong:

- **`price`** in ISK with numeric separators, `9_990_000`. The list price,
  before the grant, per "What counts as one entry" above.
- **`seats` is the most the model can be ordered with here, paid options
  included.** A third row that costs extra still counts, so a Mercedes GLB sold
  with an optional third row is a `7`. This is the one field that does not
  describe the trim the entry is priced at: someone filtering for seven seats
  wants every car that _can_ carry seven. A configuration Iceland never gets
  does not count, so read the Icelandic list, not the international brochure.
- **`expectedDelivery`** is a lowercase-able Icelandic phrase (`sumar 2026`),
  and having one at all is what makes a car count as expected rather than
  available — it drives both the availability filter and the badge on the card.
  Leave it out for a car that is on the road here.
- **`heroImageName`** names the photo under "Hero photos" below. A test fails
  while the file is missing.
- **Make, model and `subModel` are a car's identity.** `getCarId()` builds the
  card's anchor, the target the chat scrolls to and the React key out of them,
  so two entries differing only in price collide and a test fails.

And, for a car that is genuinely new to the list:

- **Specs come from ev-database.** Find the variant with `WebSearch` limited to
  `ev-database.org` (`"ev-database Kia EV2 61 kWh"`), then read the page with
  `WebFetch`. Guessing the URL does not work: the path needs the exact slug
  (`/car/3491/Kia-EV2-61-kWh`), and a wrong slug is a 404 even for a real id.
  Sibling variants often have adjacent ids, which helps only once you know the
  slug. Every `evDatabaseURL` must be unique to one entry; a test fails
  otherwise. `acceleration`, `power` and `timeToCharge10T080` come from that
  page, cross-checked against the brochure's spec page, and `range` is the lower
  of the two, as under "Specs on existing cars". `capacity`
  is the nominal figure, as the existing entries have it (EV2: 42.2 in the list,
  where ev-database's usable figure is 41.0). Where the two disagree on any
  other spec by more than rounding, say so in the report instead of choosing
  silently.
- **If ev-database has no entry yet**, leave `evDatabaseURL` out and use the
  brochure's figures, and say so in the report.
- **`sellerURL` is the car's own model page**, not the importer's front page.
  Seven cars once pointed at a site root and had to be fixed.
- **`subModel`** names the variant, and per the identity rule above two entries
  must not share one. Front- and all-wheel-drive siblings must not share a name.
  When a second variant joins a model that had none, name the existing one as
  well (the EV2 became "Standard Range" beside a new "Long Range", as the EV3
  already is).
- **A sibling variant can share the photo.** Two i4 entries use `bmw-i4`, and
  the EV2 Long Range uses `kia-ev2`. Check whether the model's existing photo
  fits before looking for a new one.
- **A new body style needs its own photo.** A test fails until the file exists,
  and a car with the wrong photo is worse than a missing car. Do not add the
  entry with a photo that does not exist: leave the tree passing, and put the
  finished entry, with every field filled in, in the report along with what is
  waiting on (the photo, per "Hero photos" below). The Polestar 4 SUV was found
  this way.

#### Hero photos

The photo is `public/images/<heroImageName>.jpg`, 1920×1280 (3:2), like every
other one there.

**Replacing a photo means giving it a new filename.** `minimumCacheTTL` in
`next.config.js` is 31 days and there is no way to invalidate the image cache,
so a better shot dropped in over the old one goes on serving the old one for up
to a month. Name the replacement something else, point `heroImageName` at it
and delete the file it replaces — the orphan test catches the delete if you
forget it, but nothing catches the stale cache.

1. **Find a press photo.** Search for `<make> <model> press photos`; the
   manufacturer's media site or a press-photo gallery is the source. Pick a
   clean shot of the car at about 45 degrees, front three-quarter, without text,
   people or a cluttered background. Take the highest resolution offered: the
   crop below throws most of the frame away, so a small source ends up soft.
2. **Ask before downloading.** Give the user the photo's URL, the filename and
   the size, and wait for a yes. If a candidate is doubtful, offer two.
3. **Crop so the car fills about half the frame.** The crop box must be 3:2, so
   the width is 1.5 times the height. `sips` does this on macOS; the offset is
   the box's top-left corner, `Y` then `X`, in source pixels:

   ```bash
   sips --cropToHeightWidth <H> <W> --cropOffset <Y> <X> source.jpg --out crop.jpg
   sips --resampleWidth 1920 -s format jpeg -s formatOptions 80 crop.jpg \
     --out public/images/<heroImageName>.jpg
   ```

   Aim near the sizes already there (a couple of hundred KB, none over a
   megabyte); lower `formatOptions` if the file is far above that.

4. **Look at the result** with the Read tool and compare it with a neighbour
   (`audi-q6.jpg` is a good reference for framing). Check the dimensions with
   `sips -g pixelWidth -g pixelHeight`, and that nothing is cut off or blurry.

Work in the scratchpad and only the final JPEG goes into `public/images/`.

### 5. Verify

`npm test`, `npm run typecheck` and `npm run lint`. The data tests catch the
usual mistakes: a hero image that does not resolve, a photo left behind, a
duplicate React key, a duplicate ev-database URL, an implausible number. A lint
run should show the warnings a clean checkout shows and no more.

### 6. Commit

Leave the changes uncommitted unless asked. When asked, one commit per make,
with a short plain message in the repo's style: `Update Skoda lineup`,
`Update Tesla Model Y prices`, `Add Mazda CX-6e`.

## The report

End with what the user needs to act on, not with the diff:

- **Changed**, grouped by make: old price → new price, old range → new range,
  added, removed.
- **Not finished**: cars found but held back for want of a photo, with the
  entry ready to paste; cars with no ev-database entry.
- **Doubtful**: cars missing from a list but not confirmed gone, a price whose
  label you could not read, and spec disagreements other than range, which the
  lower-of-two rule already settles.
- **Not checked**: makes whose source was blocked, unreadable, or not in
  `sources.md`, so the user knows what the sweep did not cover.

Never write "prices are up to date" for a make you did not read a list for.
