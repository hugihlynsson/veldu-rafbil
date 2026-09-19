---
name: update-new-cars
description: Refresh the car list in modules/newCars.ts against the sellers' current price lists — prices, new and discontinued variants, expected deliveries. Use when asked to update, sweep, or check prices for one make or all of them.
---

# Updating the car list

The list is `modules/newCars.ts`: hand-written `NewCar` literals, one per
variant. Updating it means reading each importer's current price list, comparing
it with what is there, and editing the difference. Read the "Adding or updating
a car" and "Domain rules" sections of `AGENTS.md` first; this file covers the
process and does not repeat them.

Where each make's price list lives, and how to get at it, is in
[sources.md](sources.md). Fix that file when a URL rots or you learn a better
way in; the next run depends on it.

## What counts as one entry

- **One entry per battery/drive variant, priced at its cheapest trim.** The Kia
  EV2 has two batteries and three trims each; the list carries one entry per
  battery, at the entry trim's price. Trim ladders (Light/Air/Earth) are not
  entries. Look at how the make's existing entries are split and follow that.
- **Only 100% electric cars.** The importers' lists are full of hybrids, plug-in
  hybrids and diesel siblings of the EV. Skip them.
- **`price` is the list price, before the grant.** Icelandic price lists print
  two rows per trim: the price, and "Verð með rafbílastyrk" (the grant already
  deducted). Take the first. The site subtracts the grant itself; recording the
  second row deducts it twice.
- Price digits are real. Askja lists end in `…777`; keep them (`4_490_777`).

## The process

### 1. Scope and a baseline

Work per make. If the user named makes, do those; otherwise sweep all of them,
in alphabetical order so the diff stays readable.

Before opening a price list, pull up what the list currently says for that make
(`grep -n "make: 'Kia'" modules/newCars.ts`, then read the entries). You are
looking for a difference, so know the starting point.

To see which makes are worth a look first, check the freshness signals instead
of opening everything: the issuu listings show what was published recently,
dated price-list filenames (Polestar) carry their own date, and the last time
the make was touched is `git log -1 --format=%ad -S"make: 'Kia'" -- modules/newCars.ts`.

### 2. Get the current price list

Follow [sources.md](sources.md) for the make. The three shapes you will meet:

- **A PDF at a URL.** Download it into the scratchpad and read it with the Read
  tool (`pages` for anything over ten pages). That needs `pdftoppm`; if it is
  missing (`brew install poppler`) tell the user rather than working around it.
- **An issuu flipbook.** Issuu has no text layer, only page images.
  `scripts/issuu-pages.sh <doc url> <dir>` downloads every page as a JPEG;
  read those with the Read tool. The script also prints the upload date taken
  from the document id.
  **That date, not the date on the publisher's listing, says how fresh the list
  is.** Importers re-upload over the same document, and the listing keeps the
  date of the first publish.
- **A JS-rendered page or a blocked one** (Audi and Tesla answer 403 to WebFetch
  and curl). Use the built-in browser: `get_page_text` for prices printed on
  the page, `javascript_exec` to pull link `href`s, screenshots for flipbooks.
  The browser pane must be showing for screenshots to work.

Page images are big. Read the price page and the spec page of a brochure, not
the equipment lists.

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

### 4. Adding a car

Follow the "Adding or updating a car" steps in `AGENTS.md`, plus:

- **Specs come from ev-database.** Find the variant there (`WebFetch` works on
  `ev-database.org`) and take its `evDatabaseURL`. Every URL must be unique to
  one entry; a test fails otherwise. `acceleration`, `capacity`, `range` (WLTP),
  `power` and `timeToCharge10T080` come from that page, cross-checked against
  the brochure's spec page. Where the two disagree by more than rounding, say so
  in the report instead of choosing silently.
- **If ev-database has no entry yet**, leave `evDatabaseURL` out and use the
  brochure's figures, and say so in the report.
- **`sellerURL` is the car's own model page**, not the importer's front page.
  Seven cars once pointed at a site root and had to be fixed.
- **`subModel`** names the variant. Front- and all-wheel-drive siblings must not
  share a name.
- **The hero photo** follows the steps under "Hero photos" below. A test fails
  until the file exists, so a car added without one is not finished, and the
  report has to say so.

#### Hero photos

The photo is `public/images/<heroImageName>.jpg`, 1920×1280 (3:2), like every
other one there.

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

- **Changed**, grouped by make: old price → new price, added, removed.
- **Not finished**: cars added without a photo, cars with no ev-database entry.
- **Doubtful**: cars missing from a list but not confirmed gone, spec
  disagreements between brochure and ev-database.
- **Not checked**: makes whose source was blocked, unreadable, or not in
  `sources.md`, so the user knows what the sweep did not cover.

Never write "prices are up to date" for a make you did not read a list for.
