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
`kia_ev6_ver_listi`, `kia_ev9_gt_verdlisti`, `kia_pv5_verdlisti`,
`eqs_ver_listi`, `c-class_verdlisti`, `cla_ver_listi`, `eqa_eqb_verdlisti`,
`eqe_suv_verdlisti`, `eqs_suv_verdlisti`, `g-class_verdlisti`, `glb_ver_listi`,
`n_r_glc_ver_listi`, `vito_tourer_verdlisti`. `glc_verdlisti` and
`amg_verdlisti` are combustion and hybrid only.

BL documents read so far, under `issuu.com/hallih/docs/`:
`subaru_ver__listi_sept2015lr` (all three Subaru EVs), `mg_ver_listi`,
`nissan_ver__listi_febr__ar_2016lr`, `renault_ver__listi___g__st_2015lr`
(the R5 and Scenic; its Rafale is a plug-in hybrid),
`nm70462_hyundai_ver__b__klingur___g` (every Hyundai EV, the IONIQ 3 and
STARIA Electric included since October 2026; the IONIQ 9 rows carry no grant
column, being over the ceiling), `bmw_ver_listi_xdrive_26.02.2019_lr` (iX5,
i3, iX3, iX, iX1 and i4 since November 2026; no i5; 30 pages, every model's
price table on an even page) and `hongqi_-_verdlisti` (EHS5 and EHS7).
`dacia_ver__listi_16.01_2018_lr` has no EVs. Since October 2026 the MG list
holds the MGS5, MGS6 and Cyberster as well as the MG4 Urban, and the Nissan list
holds one Ariya row (Evolve 4WD) beside the Leaf; the Ariya's other trims are
on its model page on nissan.is, readable with curl, unlabelled and before the
grant. The BMW list carries the iX1 twice: the table on page 10 is the list
price, and page 14's, headed "Sérverð", is a stale offer whose grant figures
match neither the current grant nor the ceiling.

BMW's press photos moved from PressClub to newsroom.bmwgroup.com, whose model
pages embed every photo as a `content.presspage.com` URL. Each one has `500_`
and `800_` variants for picking, and the bare name is the full-resolution
original.

The listing's HTML embeds each document as JSON with its `documentId` (the
upload timestamp), `title` and `uri`, so one curl of `?ps=100` maps every
recent upload to its slug without opening the documents.

## Per make

| Make          | Entry point                                              | How to read it                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Audi          | https://www.audi.is/is/nyr-audi/verdlistar/              | **Read.** 403 to WebFetch and curl; the built-in browser loads it. Its "Nánar" links are PDFs on `www.hekla.is/static/files/efni/verdlistar/audi/` (`q4-e-tron.pdf`, `q6-e-tron.pdf`, `a6.pdf`), which curl fetches and `pdf text` reads. The e-tron GT and SQ6 are not in Audi's list.                                                                                                                                                                                                                                                         |
| Lexus         | https://www.lexus.is/new-cars/kynningarefni              | **Read.** The combined list is an iPaper flipbook at `kynningarefni.toyota.is/verdlistilexus`; run `scripts/ipaper-text.py` on it and look for the RZ and ES pages. One unlabelled "VERÐ": the pre-grant price.                                                                                                                                                                                                                                                                                                                                 |
| Mazda         | https://mazda.is/verdlistar                              | **Read.** Direct PDFs at `skjol.mazda.is/media/19/` (`mazda6e-verd.pdf`, `cx-6e.pdf`). Since the lists of 2026-11-02 `pdf text` reads the price rows, "Verð" before "Verð með" styrk; before that the table was an image, to render with `pdf pages` at scale 5.                                                                                                                                                                                                                                                                                |
| Mercedes-Benz | https://www.mercedes-benz.is/site/verdlistar/            | **Read.** Links go to Askja's issuu documents, one per model line; the electric GLC is `n_r_glc_ver_listi`, not `glc_verdlisti`. The site menu's "100% rafbílar" list names every EV, priced or not. Vans (EQT, EQV, eVito Tourer) are on `/vans/site/verdlistar/`. A "Sérverð" row is a temporary offer, not the list price.                                                                                                                                                                                                                   |
| Polestar      | https://brimborg.polestarimporter.com/is/verdlistar      | **Read.** Direct PDFs at `…/static/files/Polestar<N>/`, the filename ending in the list's date (`…_20260910.pdf`); `pdf text` reads the price rows; the first figure is the price, the second "Verð með 500.000 kr. styrk". Polestar 2 Performance is an option package on the base car, not a row.                                                                                                                                                                                                                                             |
| Porsche       | https://dealer.porsche.com/is/island/is-IS/nyir-bilar    | **Read.** The page prints only the entry trim's price ("Verð nú"). Every trim is in one PDF per model on `vefbordar-01.benni.is/pdf/` (`<id>-Macan-vef.pdf`, `-CayenneElectric-`, `-CayenneElectricCoupe-`, `-Taycan-VEF`, `-TaycanCrossTurismo-`; the id prefix changes with each list). The links are `p-link` elements, so find them in the built-in browser by walking shadow roots for "Sækja verðlista"; curl fetches the PDFs and their text layer holds the table. All cars are over the grant ceiling, so the one "Verð" is the price. |
| Škoda         | https://www.skoda.is/nyr-skoda/verdlistar                | Listing only. PDFs on `www.hekla.is/static/files/efni/verdlistar/skoda/` (`peaq`, `epiq`, `elroq`, `enyaq`); same route as Audi.                                                                                                                                                                                                                                                                                                                                                                                                                |
| Subaru        | https://www.subaru.is/verdlisti/                         | **Read.** One combined list on BL's issuu, `hallih/docs/subaru_ver__listi_sept2015lr` (the slug's date is not the list's), run through `scripts/issuu-pages.sh`: ten pages, two per model, the electric three first. "Verð kr." is the price; "M. styrk Orkusjóðs" has the grant off.                                                                                                                                                                                                                                                           |
| Tesla         | https://www.tesla.com/is_is                              | **Partly.** 403 to WebFetch. The built-in browser shows "Verð frá" for Model Y and Model 3, the entry trims only. `/modely/design` gave financing and upgrade amounts rather than trim prices, and needs clicking through. Other trims are unsettled.                                                                                                                                                                                                                                                                                           |
| Toyota        | https://www.toyota.is/new-cars/kynningarefni             | **Read.** The list is an iPaper flipbook at `kynningarefni.toyota.is/verdlisti`; run `scripts/ipaper-text.py` on it and search for `RAFMAGN`. One unlabelled "VERÐ": the pre-grant price. It also holds the cargo vans and the 48V mild-hybrid Hilux, which are not in the car list; the electric Hilux Double Cab, under `100% RAFMAGNSBÍLL`, is. The built-in browser refuses this domain.                                                                                                                                                    |
| Volkswagen    | https://www.volkswagen.is/is/kaup-tilbod/verdlistar.html | Listing only. PDFs on `www.hekla.is/static/files/efni/verdlistar/vw/` (`id3`, `id4`, `id7`, `idcross`, `idbuzz-people`, `id-polo`); same route as Audi.                                                                                                                                                                                                                                                                                                                                                                                         |

Hekla is the importer behind Audi, Škoda and Volkswagen, and its static PDFs
have not needed a browser.

## Makes with no page from the owner

BYD, Citroën, Fiat, Ford, GWM, JAC, Jeep, KGM, Leapmotor, Maxus, Opel, Peugeot,
Range Rover, Suzuki, Volvo. Some may be on the BL or Askja issuu pages; check
those listings first. Otherwise, the importer's site as linked from the existing
entries.

**BYD** (Vatt): each model page on byd.is, readable with curl, links a
"Verðskrá" PDF on `cdn.sanity.io/files/mcx434c9/production/`. The PDF has no
text layer, so render it with `pdf pages`; page 1 prints "Verð" (before the
grant) beside "Verð m/ styrk". The Atto 3 Evo is sold here as "EVO AWD", at
`/typur/evo-awd`. The PDF's `Last-Modified` header is its upload date. Read
for every model on 2026-10-21, from lists uploaded on 2026-08-17.

**JAC** (Suzuki bílar): jac.is is built like byd.is, on the same Sanity
project, with a page per model at `/typur/<model>` (`e30x`, `t9-ev`) linking a
"Verðskrá" and a "Tækniupplýsingar" PDF. Both PDFs have a text layer, so
`pdf text` reads them; the price list prints "Verð" (before the grant) beside
"Verð m/ styrk". Trust the PDFs over the model page's spec table: on
2026-10-23 the T9 page said 212 kW and 7.5 s where both PDFs said 70 + 150 kW
and 8.5 s. The Norwegian site, jacmotors.no, uses the same images at higher
resolution and is the place to look for a photo. Read on 2026-10-23, from
lists uploaded on 2026-04-01 (E30X) and 2026-08-06 (T9 EV). BYD and JAC
reissued every list on 2026-10-30, printing the 400.000 kr. grant; read on
2026-11-03 with no price changed. A BYD PDF renders its page small in the
middle of an A4 sheet, so crop the middle third at scale 4 to read the row.

**Ford** (Brimborg): each `ford.is/bill/<model>` page, readable with curl, links
its PDF, and `pdf text` reads it. The first figure is the price. The page's
"Tilboð" rows are offers on stock cars, not the list price. Read on 2026-10-31.

**KGM** (Bílabúð Benna): `kgm.benni.is/musso-ev/` and `/torres-evx/` link a PDF
under `wp-content/uploads/<year>/<month>/`. Its text layer loses most digits, so
render it with `pdf pages` at scale 3 or more. Read on 2026-10-31.

**Suzuki**: `suzuki.is/e-vitara/` links a PDF that `pdf text` reads, "Verð - Verð
m/ styrk" on one line. Read on 2026-10-31.

**Peugeot** (Brimborg): 403 to curl, so use the built-in browser. Each model
page prints "Fullt verð frá" per trim, before the grant, and links a PDF under
`/content/dam/peugeot/iceland/verdlistar/`. Read on 2026-10-31 from the pages.
By 2026-11-03 the pages had moved to `/tegundir/<model>/e-<model>.html`; the
old URLs redirect there, except `E-Traveller.html`, which is a 404, and the
menu no longer lists the e-Traveller. The menu lists an e-308 and e-308 SW that
the car list does not have, with no price on their pages.

**Not found on 2026-10-31**: Citroën, Opel and Volvo load in the built-in browser
but print no price on the model page. Porsche's pages come back with no text.
Fiat's list link on isband.is is a file download. GWM prints no price, and
Tesla's Model 3 page shows financing amounts by default.

**Still not found on 2026-11-03**: Volvo's configurator, `/is/build/<model>`,
says "Verð fæst hjá söluráðgjafa" in place of a price. `nyirbilar.brimborg.is`
lists only the cars in stock, not a price list. jeep.com/is lists only the
Avenger 4xe hybrid, and `isband.is/nyir-bilar/fiat/` is an old review.

**Tesla**: the built-in browser reads `/is_is/model3/design` and
`/is_is/modely/design` once the prices stop animating (wait a few seconds, or
the figures read as fractions of the real ones). "Staðgreiðsla" is the price
before the grant. Premium shows its Long Range trims only after a click on
it. Read on 2026-11-03. The Model Y page says a seven-seat layout comes with
Premium AWD, but no seat option could be selected.

**Leapmotor** (ÍSBAND): leapmotor.net/is prints no price, but
`isband.is/nyir-bilar/leapmotor/`, readable with curl, lists each car it sells
under the name it advertises, with "Listaverð" before the grant. Read on
2026-11-02. Its "með rafbílastyrk" figures deduct 500.000 kr., not
`grantAmount`, so take the Listaverð.

**Placeholders**: Askja keeps a document's slug while a list is being reissued,
with one page that says so. On 2026-10-31 `kia_ev9_gt_verdlisti`, `eqt_verdlisti`,
`eqv_verdlisti` and `t-class_verdlisti` were placeholders, and still were on
2026-11-03; kia.com's EV9 page says "Verðlisti í vinnslu". The STARIA Electric
has moved from BL's main Hyundai list to `hyundai_fyrirt_kjalausnir`.

**Gaps seen on 2026-11-06**, each a car still in the list but missing from its
importer's current list: BL's Mini list (`mini_ver__listi_09.10.2017lr`, six
pages) has only the Cooper E and Countryman SE ALL4, though mini.is still
shows the Aceman; Lexus' 2026 list has no UX, and `lexus.is/car-models/ux-300e/`
redirects to `/new-cars`, which lists none; Škoda's November Elroq list starts
at the 85x; VW's November ID.3 list has only the ID.3 Pro; and Hyundai's
November list prices only the IONIQ 3's 61 kWh, though its page still offers
the 42,2 kWh. Hekla's PDFs carry a `Last-Modified` header worth checking
before reading them.

**Stock and delivery, read on 2026-11-06**, the place to check an
`expectedDelivery` against:

- **Hekla** (Škoda, VW, Audi): `hekla.is/is/bilar/nyir-bilar-syningasalur?filter-gerd=skoda&filter-tegund=<model>`
  (`filter-gerd=volkswagen-folksbilar` for VW) marks each car "Til á lager" or
  "Væntanlegur" with its configured price. The Epiq was in stock that day.
- **Land Rover** (BL): `landrover.is/offers-and-finance/cars-in-stock/range-rover?models=<model>&states=new`;
  no electric Range Rover was in stock that day.
- **BL's** `bl.is/nyir-bilar/<MAKE>` renders nothing without its script, and
  hyundai.is says nothing of delivery, so the IONIQ 3 and STARIA could not be checked.
- **Kia EV9**: the current list is `askja/docs/ev9_verdlisti` (Air, Earth and
  GT-Line), linked from kia.com's EV9 page; `kia_ev9_gt_verdlisti` is the GT's
  and was still a placeholder. kia.com's menu "Frá" figures can lag the lists:
  it said 8.590.777 for the PV5 Passenger, which the list prices at 7.790.777.

**Found on 2026-11-06**, for makes that had no list here:

- **Volvo**: the site's "Kaupa" menu links a PDF per model on
  `azure-eu-assets.contentstack.com`, dated in the filename
  (`VOLVO_EX30_Verdlisti_20261028.pdf`). The menu sits in a shadow root, so
  open it in the built-in browser and walk shadow roots for "Verðlisti"; the
  links change with each upload. EX30, EX30 Cross Country, EX60, EX90 and ES90
  have one, the EX40 and EC40 none, but `/is/cars/electric-cars/` prints their
  "Verð frá". `pdf text` reads them; the one figure is the price before the
  grant. Brimborg's stock (`nyirbilar.brimborg.is/is/nyir-bilar?fueltype=2`,
  pages 1-7) shows what is on order and when, not the list price.
- **Range Rover** (BL): `landrover.is/range-rover/<model>/electric` links its
  model's list under `landrover.is/uploads/` (`RangeRover-verðlisti-14.10.2026.pdf`,
  `RRSport-Verðlisti-14.10.2026.pdf`); `pdf text` reads the EV rows, one column
  per trim, the first priced one the entry. Photos: rangerover.com's model page
  embeds 2560 px originals under `/content/dam/lrdx/global/l461/`; landrover.is
  serves at most 1600 px, and the media site 750 px.
- **Jeep and Fiat** (ÍSBAND): `isband.is/nyir-bilar/verdlistar-baeklingar/verdlisti-jeep/`
  and `.../verdlisti-fiat/` answer with the PDF itself, not a page, so the
  built-in browser offers a download; fetch them with curl and `pdf text`.
  The Jeep list sells the Avenger as the 4xe hybrid only; the Fiat list (January 2026) prints "Leitið til sölumanna" for the 500e.
- **GWM** (Hekla): `hekla.is/static/files/efni/verdlistar/ora/ora-03.pdf`, where
  the car is now the ORA 300 Pure.
- **Opel and Citroën**: still none. opelisland.is links a van list through
  `/navigation-partials/…/brochures-pricelist.html`, but no car list was found.

**Read on 2026-11-10**: Askja reissued the Kia EV5, EV6 and PV5 lists and the
CLA list on 2026-11-09. The EV5 list now prints only the AWD, though kia.com's
EV5 page still names the front-wheel-drive car's 530 km. The PV5 list prices the
Passenger in Earth trim only. Polestar 5's list is now `polestar5_verdlisti_20261105.pdf`;
its second "Verð" is the showroom car with options, not a trim. Tesla's design
pages hold partial, still-animating figures while the browser pane is hidden;
a screenshot makes them render, after which `find` " kr" reads every trim.
Read that way the same day, every Model 3 and Model Y price was unchanged.
