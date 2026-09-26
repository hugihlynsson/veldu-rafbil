# Where the price lists live

Entry points supplied by the owner, with how each one behaved when checked on
2026-09-19. Importer sites move things around; when a link or a method stops
working, fix this file as part of the run.

"Read" below means a price list was opened and compared with the car list, not
just that its page loaded. Where a make says "listing only", the page was
fetched and its links seen, but no list was read yet.

A make that appears in the car list but not here has no known price-list page.
Start from the `sellerUrl` of its existing entries, and say in the report that
it was a guess.

## Importers with one page for several makes

Two importers publish nearly everything on issuu. Their profile pages list the
newest price lists first. Fetch the listing with WebFetch, then run
`scripts/issuu-pages.sh` on each document worth reading.

| Importer | Makes                                                             | Listing                        |
| -------- | ----------------------------------------------------------------- | ------------------------------ |
| Askja    | Kia, Honda, Mercedes-Benz, smart, XPENG                           | https://issuu.com/askja?ps=24  |
| BL       | BMW, Renault, Nissan, MG, Mini, Hyundai, Hongqi, Subaru, and more | https://issuu.com/hallih?ps=24 |

- **`ps=24` is a page size, and 24 is not everything.** `ps=100` returns 48
  documents. There is no second page (`&page=2` returns the same 48), so a model
  can be missing from every listing. The Kia EV9 has no price list of its own in
  it, only the EV9 GT. When one is missing, look for it from the make's own page,
  or guess the slug (`kia_ev6_ver_listi` was found that way; `kia_ev6_verdlisti`
  was not a document). Say in the report which lists could not be found.
- **The listing date is the first publish.** The date the script prints is the
  latest upload; use that one. A document can also keep a years-old slug over
  current content: Kia's EV3 list is `ev3_20240910` and was uploaded on
  2026-07-23. Trust the upload date over the name.
- Askja publishes one document per model, BL one per make, so a single BL
  document can hold several EVs. BL's slugs are years old too
  (`subaru_ver__listi_sept2015lr`).
- A price list is one or two pages. Page 1 has the price table and the headline
  specs (drive, power, kWh, range, 0-100); page 2 has dimensions and a fuller
  spec table with charging times.

Askja documents read so far, as slugs under `issuu.com/askja/docs/`:
`kia_ev2_ver_listi`, `ev3_20240910`, `kia_ev4_verdlisti`, `kia_ev5_verdlisti`,
`kia_ev6_ver_listi`, `kia_ev9_gt_verdlisti`, `kia_pv5_verdlisti`.

## Per make

| Make          | Entry point                                              | How to read it                                                                                                                                                                                                                                                                                           |
| ------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Audi          | https://www.audi.is/is/nyr-audi/verdlistar/              | **Read.** 403 to WebFetch and curl; the built-in browser loads it. Its "Nánar" links are PDFs on `www.hekla.is/static/files/efni/verdlistar/audi/` (`q4-e-tron.pdf`, `q6-e-tron.pdf`, `a6.pdf`), which curl fetches and `pdf text` reads. The e-tron GT and SQ6 are not in Audi's list.                  |
| Lexus         | https://www.lexus.is/new-cars/kynningarefni              | **Read.** The combined list is an iPaper flipbook at `kynningarefni.toyota.is/verdlistilexus`; run `scripts/ipaper-text.py` on it and look for the RZ and ES pages. One unlabelled "VERÐ": the pre-grant price.                                                                                          |
| Mazda         | https://mazda.is/verdlistar                              | **Read.** Direct PDFs at `skjol.mazda.is/media/19/` (`mazda6e-verd.pdf`, `cx-6e.pdf`). The price table is an image inside the PDF, so `pdf text` skips it: render with `pdf pages` at scale 5 and crop the table.                                                                                        |
| Mercedes-Benz | https://www.mercedes-benz.is/site/verdlistar/            | Listing only. Links go to Askja's issuu documents, one per model line.                                                                                                                                                                                                                                   |
| Polestar      | https://brimborg.polestarimporter.com/is/verdlistar      | **Read.** Direct PDFs at `…/static/files/Polestar<N>/`, the filename ending in the list's date (`…_20260910.pdf`); `pdf text` reads the price rows; the first figure is the price, the second "Verð með 500.000 kr. styrk". Polestar 2 Performance is an option package on the base car, not a row.      |
| Porsche       | https://dealer.porsche.com/is/island/is-IS/nyir-bilar    | Listing only. Starting prices are printed on the page ("frá"), so a PDF may be unnecessary. The "Sækja verðlista" buttons expose no URL to WebFetch; the browser may.                                                                                                                                    |
| Škoda         | https://www.skoda.is/nyr-skoda/verdlistar                | Listing only. PDFs on `www.hekla.is/static/files/efni/verdlistar/skoda/` (`peaq`, `epiq`, `elroq`, `enyaq`); same route as Audi.                                                                                                                                                                         |
| Subaru        | https://www.subaru.is/verdlisti/                         | Listing only. WebFetch returns the page without the price-list link; use the built-in browser. Also listed in BL's issuu.                                                                                                                                                                                |
| Tesla         | https://www.tesla.com/is_is                              | **Partly.** 403 to WebFetch. The built-in browser shows "Verð frá" for Model Y and Model 3, the entry trims only. `/modely/design` gave financing and upgrade amounts rather than trim prices, and needs clicking through. Other trims are unsettled.                                                    |
| Toyota        | https://www.toyota.is/new-cars/kynningarefni             | **Read.** The list is an iPaper flipbook at `kynningarefni.toyota.is/verdlisti`; run `scripts/ipaper-text.py` on it and search for `RAFMAGN`. One unlabelled "VERÐ": the pre-grant price. It also holds the vans and the Hilux, which are not in the car list. The built-in browser refuses this domain. |
| Volkswagen    | https://www.volkswagen.is/is/kaup-tilbod/verdlistar.html | Listing only. PDFs on `www.hekla.is/static/files/efni/verdlistar/vw/` (`id3`, `id4`, `id7`, `idcross`, `idbuzz-people`, `id-polo`); same route as Audi.                                                                                                                                                  |

Hekla is the importer behind Audi, Škoda and Volkswagen, and its static PDFs
have not needed a browser.

## Makes with no page from the owner

BYD, Citroën, Fiat, Ford, GWM, Jeep, KGM, Leapmotor, Maxus, Opel, Peugeot,
Range Rover, Suzuki, Volvo. Some may be on the BL or Askja issuu pages; check
those listings first. Otherwise, the importer's site as linked from the existing
entries.

**Range Rover is the one that cannot be started from its entries.** Both
Electric rows point at `rangerover.com/en-gb`, the manufacturer's UK site rather
than an Icelandic seller, so there is no importer page to work back to and no
price to check against. Find the Icelandic importer's model page, fix
`sellerUrl` on both rows, and record the price list here.
