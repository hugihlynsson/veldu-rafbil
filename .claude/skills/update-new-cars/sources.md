# Where the price lists live

Entry points supplied by the owner, with how each one behaved when checked on
2026-09-19. Importer sites move things around; when a link or a method stops
working, fix this file as part of the run.

A make that appears in the car list but not here has no known price-list page.
Start from the `sellerURL` of its existing entries, and say in the report that
it was a guess.

## Importers with one page for several makes

Two importers publish nearly everything on issuu. Their profile pages list the
newest price lists first and are the best way to see what changed recently.
Fetch the listing with WebFetch, then run `scripts/issuu-pages.sh` on each
document worth reading.

| Importer | Makes                                                             | Listing                        |
| -------- | ----------------------------------------------------------------- | ------------------------------ |
| Askja    | Kia, Honda, Mercedes-Benz, smart, XPENG                           | https://issuu.com/askja?ps=24  |
| BL       | BMW, Renault, Nissan, MG, Mini, Hyundai, Hongqi, Subaru, and more | https://issuu.com/hallih?ps=24 |

- The listing date is the first publish. The date the script prints is the
  latest upload; use that one.
- Askja publishes one document per model (`kia_ev2_ver_listi`); BL publishes one
  per make, so a single document can hold several EVs. BL's document slugs are
  years old (`subaru_ver__listi_sept2015lr`) while the content is current.
- Askja's Mercedes-Benz page (below) links to the same issuu documents, and is
  the easier way to find the right one per model.

## Per make

| Make          | Entry point                                              | How to read it                                                                                                                                                                                                       |
| ------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Audi          | https://www.audi.is/is/nyr-audi/verdlistar/              | 403 to WebFetch and curl; the built-in browser loads it. The "Nánar" links go to PDFs on `www.hekla.is/static/files/efni/verdlistar/audi/` (`q4-e-tron.pdf`, `q6-e-tron.pdf`, `a6.pdf`), which curl downloads fine.  |
| Lexus         | https://www.lexus.is/new-cars/kynningarefni              | WebFetch works and lists model brochures and one combined price-list flipbook at `kynningarefni.toyota.is/verdlistilexus/?page=N`. How to read the flipbook pages is not settled; try the built-in browser.          |
| Mazda         | https://mazda.is/verdlistar                              | WebFetch works. Direct PDFs at `skjol.mazda.is/media/19/`; the electric ones are `mazda6e-verd.pdf` and `cx-6e.pdf`.                                                                                                 |
| Mercedes-Benz | https://www.mercedes-benz.is/site/verdlistar/            | WebFetch works. Links go to Askja's issuu documents, one per model line.                                                                                                                                             |
| Polestar      | https://brimborg.polestarimporter.com/is/verdlistar      | WebFetch works. Direct PDFs at `…/static/files/Polestar<N>/`; the filename ends in the list's date (`…_20260910.pdf`).                                                                                               |
| Porsche       | https://dealer.porsche.com/is/island/is-IS/nyir-bilar    | WebFetch works. Starting prices are printed on the page ("frá"), so there may be no need for a PDF. The "Sækja verðlista" buttons expose no URL to WebFetch; the browser may.                                        |
| Škoda         | https://www.skoda.is/nyr-skoda/verdlistar                | WebFetch works. PDFs on `www.hekla.is/static/files/efni/verdlistar/skoda/` (`peaq`, `epiq`, `elroq`, `enyaq`).                                                                                                       |
| Subaru        | https://www.subaru.is/verdlisti/                         | WebFetch returns the page shell without the price-list link; use the built-in browser. Also listed in BL's issuu.                                                                                                    |
| Tesla         | https://www.tesla.com/is_is                              | 403 to WebFetch; use the built-in browser. Prices show per model on the order flow.                                                                                                                                  |
| Toyota        | https://www.toyota.is/new-cars/kynningarefni             | WebFetch works. Brochure PDFs at `toyota.is/content/dam/toyota/nmsc/iceland/pdf-skjol/2026/`, price list as a flipbook at `kynningarefni.toyota.is/verdlisti/?page=N`. Same open question as Lexus for the flipbook. |
| Volkswagen    | https://www.volkswagen.is/is/kaup-tilbod/verdlistar.html | WebFetch works. PDFs on `www.hekla.is/static/files/efni/verdlistar/vw/` (`id3`, `id4`, `id7`, `idcross`, `idbuzz-people`, `id-polo`).                                                                                |

Hekla is the importer behind Audi, Škoda and Volkswagen, and its static PDFs
have not needed a browser.

## Makes with no page from the owner

BYD, Citroën, Fiat, Ford, GWM, Jeep, KGM, Leapmotor, Maxus, Opel, Peugeot,
Suzuki, Volvo. Some may be on the BL or Askja issuu pages; check those listings
first. Otherwise, the importer's site as linked from the existing entries.
