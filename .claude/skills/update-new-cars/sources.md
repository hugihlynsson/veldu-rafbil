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

## Last read

When each make's price list was last read and compared with the car list,
and the date of the list it was read from (its upload date, or the date it
prints). Update a make's row whenever you read its list, whether or not
anything changed. The dates before 2026-11-10 were pieced together from the
commits and the notes below, so a "—" means nothing recorded, not never.

| Make          | Last read  | List dated | Note                                           |
| ------------- | ---------- | ---------- | ---------------------------------------------- |
| Audi          | 2026-11-07 | 2026-11-04 | Q4 and Q6; A6 03-18                            |
| BMW           | 2026-11-23 | 2026-11-23 |                                                |
| BYD           | 2026-11-03 | 2026-10-30 |                                                |
| Citroën       | 2026-11-27 | —          | ë-C5 Aircross page, no price; estimated        |
| Fiat          | 2026-11-06 | 2026-01    | 500e unpriced ("Leitið til sölumanna")         |
| Ford          | 2026-11-10 | 2026-06-22 | Capri; Explorer 06-12, Puma 04-08, Mach-E 2025 |
| GWM           | 2026-11-06 | 2026-01-20 |                                                |
| Hongqi        | 2026-11-10 | 2026-10-31 |                                                |
| Hyundai       | 2026-11-20 | 2026-11-19 | STARIA in the main list again                  |
| JAC           | 2026-11-03 | 2026-10-30 |                                                |
| Jeep          | 2026-11-06 | —          | Avenger list is the 4xe hybrid only            |
| KGM           | 2026-11-10 | 2026-10-30 |                                                |
| Kia           | 2026-11-14 | 2026-11-13 | PV5 11-14; EV9 11-12; EV5 and EV6 11-10        |
| Leapmotor     | 2026-11-20 | 2026-11-19 | ÍSBAND PDF list; prices are images             |
| Lexus         | 2026-11-25 | —          | TZ unpriced; estimated from NL prices          |
| Mazda         | 2026-11-25 | 2026-11-25 | 6e; CX-6e 11-16                                |
| Mercedes-Benz | 2026-11-24 | 2026-11-23 | AMG GT, unpriced; C, GLA, GLB, GLC, CLA 11-16  |
| MG            | 2026-11-16 | 2026-11-16 |                                                |
| Mini          | 2026-11-06 | —          | List lacks the Aceman                          |
| Nissan        | 2026-11-10 | 2026-10-31 | nissan.is says 8.990.000 for the Evolve 4WD    |
| Opel          | —          | —          | No price published; see 2026-11-10 note        |
| Peugeot       | 2026-11-26 | 2026-11-05 | e-308 and SW from their PDF; rest 11-25 pages  |
| Polestar      | 2026-11-12 | 2026-11-05 | Polestar 5; 2, 3 and 4 from 2026-10-29         |
| Porsche       | 2026-11-12 | 2026-10-30 |                                                |
| Range Rover   | 2026-11-06 | 2026-10-14 |                                                |
| Renault       | 2026-11-19 | 2026-11-18 |                                                |
| Škoda         | 2026-11-24 | 2026-11-24 | Peaq; Enyaq 11-10; Epiq and Elroq 11-09        |
| Smart         | 2026-11-10 | 2026-11-02 |                                                |
| Subaru        | 2026-11-23 | 2026-11-23 |                                                |
| Suzuki        | 2026-11-10 | 2026-10-30 |                                                |
| Tesla         | 2026-11-25 | —          | Design pages; no dated list                    |
| Toyota        | 2026-11-25 | —          |                                                |
| Volkswagen    | 2026-11-12 | 2026-11-10 | ID.4 and ID.3 Neo; ID.3, ID.7, Polo 11-04      |
| Volvo         | 2026-11-21 | 2026-11-18 | EX40 and EC40 MY27.5 11-18; EX90 11-03         |
| XPENG         | 2026-11-10 | 2026-11-02 |                                                |

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
`eqs_ver_listi`, `smart_verdlisti_140723` (#1), `smart_3_verdlisti_290424`,
`smart_5_ver_listi`, `xpeng_ver_listar` (every XPENG, one model per two
pages), `c-class_verdlisti`, `cla_ver_listi`, `eqa_eqb_verdlisti`,
`eqe_suv_verdlisti`, `eqs_suv_verdlisti`, `g-class_verdlisti`, `glb_ver_listi`,
`n_r_glc_ver_listi`, `vito_tourer_verdlisti`, `vle_ver_listi`. `glc_verdlisti` and
`amg_verdlisti` are combustion and hybrid only.

BL documents read so far, under `issuu.com/hallih/docs/`:
`subaru_ver__listi_sept2015lr` (all three Subaru EVs), `mg_ver_listi`,
`nissan_ver__listi_febr__ar_2016lr`, `renault_ver__listi___g__st_2015lr`
(the R5, R4 since November 2026 and Scenic; its Rafale is a plug-in hybrid),
`nm70462_hyundai_ver__b__klingur___g` (every Hyundai EV, the IONIQ 3 and
STARIA Electric included since October 2026; the IONIQ 9 rows carry no grant
column, being over the ceiling), `bmw_ver_listi_xdrive_26.02.2019_lr` (iX5,
i3, iX3, iX, iX1 and i4 since November 2026; no i5; 28 pages since
2026-11-23, every model's price table on an even page) and `hongqi_-_verdlisti` (EHS5 and EHS7).
`dacia_ver__listi_16.01_2018_lr` has no EVs. Since October 2026 the MG list
holds the MGS5, MGS6 and Cyberster as well as the MG4 Urban, and the Nissan list
holds one Ariya row (Evolve 4WD) beside the Leaf; the Ariya's other trims are
on its model page on nissan.is, readable with curl, unlabelled and before the
grant. The BMW list's iX1 table is on page 10; the stale "Sérverð" page that
followed it was dropped in the upload of 2026-11-23.

BMW's press photos moved from PressClub to newsroom.bmwgroup.com, whose model
pages embed every photo as a `content.presspage.com` URL. Each one has `500_`
and `800_` variants for picking, and the bare name is the full-resolution
original.

The listing's HTML embeds each document as JSON with its `documentId` (the
upload timestamp), `title` and `uri`, so one curl of `?ps=100` maps every
recent upload to its slug without opening the documents.

## Per make

| Make          | Entry point                                           | How to read it                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Audi          | https://www.audi.is/is/nyr-audi/verdlistar/           | **Read.** 403 to WebFetch and curl; the built-in browser loads it. Its "Nánar" links are PDFs on `www.hekla.is/static/files/efni/verdlistar/audi/` (`q4-e-tron.pdf`, `q6-e-tron.pdf`, `a6.pdf`), which curl fetches and `pdf text` reads. The e-tron GT and SQ6 are not in Audi's list.                                                                                                                                                                                                                                                         |
| Lexus         | https://www.lexus.is/new-cars/kynningarefni           | **Read.** The combined list is an iPaper flipbook at `kynningarefni.toyota.is/verdlistilexus`; run `scripts/ipaper-text.py` on it and look for the RZ and ES pages. One unlabelled "VERÐ": the pre-grant price.                                                                                                                                                                                                                                                                                                                                 |
| Mazda         | https://mazda.is/verdlistar                           | **Read.** Direct PDFs at `skjol.mazda.is/media/19/` (`mazda6e-verd.pdf`, `cx-6e.pdf`). Since the lists of 2026-11-02 `pdf text` reads the price rows, "Verð" before "Verð með" styrk; before that the table was an image, to render with `pdf pages` at scale 5.                                                                                                                                                                                                                                                                                |
| Mercedes-Benz | https://www.mercedes-benz.is/site/verdlistar/         | **Read.** Links go to Askja's issuu documents, one per model line; the electric GLC is `n_r_glc_ver_listi`, not `glc_verdlisti`. The site menu's "100% rafbílar" list names every EV, priced or not. Vans (EQT, EQV, eVito Tourer) are on `/vans/site/verdlistar/`. A "Sérverð" row is a temporary offer, not the list price.                                                                                                                                                                                                                   |
| Polestar      | https://brimborg.polestarimporter.com/is/verdlistar   | **Read.** Direct PDFs at `…/static/files/Polestar<N>/`, the filename ending in the list's date (`…_20260910.pdf`); `pdf text` reads the price rows; the first figure is the price, the second "Verð með 500.000 kr. styrk". Polestar 2 Performance is an option package on the base car, not a row.                                                                                                                                                                                                                                             |
| Porsche       | https://dealer.porsche.com/is/island/is-IS/nyir-bilar | **Read.** The page prints only the entry trim's price ("Verð nú"). Every trim is in one PDF per model on `vefbordar-01.benni.is/pdf/` (`<id>-Macan-vef.pdf`, `-CayenneElectric-`, `-CayenneElectricCoupe-`, `-Taycan-VEF`, `-TaycanCrossTurismo-`; the id prefix changes with each list). The links are `p-link` elements, so find them in the built-in browser by walking shadow roots for "Sækja verðlista"; curl fetches the PDFs and their text layer holds the table. All cars are over the grant ceiling, so the one "Verð" is the price. |
| Škoda         | https://www.skoda.is/nyr-skoda/verdlistar             | Listing only. PDFs on `www.hekla.is/static/files/efni/verdlistar/skoda/` (`peaq`, `epiq`, `elroq`, `enyaq`); same route as Audi.                                                                                                                                                                                                                                                                                                                                                                                                                |
| Subaru        | https://www.subaru.is/verdlisti/                      | **Read.** One combined list on BL's issuu, `hallih/docs/subaru_ver__listi_sept2015lr` (the slug's date is not the list's), run through `scripts/issuu-pages.sh`: ten pages, two per model, the electric three first. "Verð kr." is the price; "M. styrk Orkusjóðs" has the grant off.                                                                                                                                                                                                                                                           |
| Tesla         | https://www.tesla.com/is_is                           | **Partly.** 403 to WebFetch. The built-in browser shows "Verð frá" for Model Y and Model 3, the entry trims only. `/modely/design` gave financing and upgrade amounts rather than trim prices, and needs clicking through. Other trims are unsettled.                                                                                                                                                                                                                                                                                           |
| Toyota        | https://www.toyota.is/new-cars/kynningarefni          | **Read.** The list is an iPaper flipbook at `kynningarefni.toyota.is/verdlisti`; run `scripts/ipaper-text.py` on it and search for `RAFMAGN`. One unlabelled "VERÐ": the pre-grant price. It also holds the vans, crew cabs and both Hilux pickups, mild-hybrid and electric; none is in the car list, being N1, but the Proace Verso and Proace City Verso are. The built-in browser refuses this domain.                                                                                                                                      |
| Volkswagen    | `hekla.is/static/files/efni/verdlistar/vw/`           | **Read.** Hekla PDFs on `www.hekla.is/static/files/efni/verdlistar/vw/` (`id3`, `neo`, `id4`, `id7`, `id-polo`), each with a `Last-Modified` header; `pdf text` reads them, "Verð" before "Verð m. styrk". No `id5` or `id-buzz` PDF answers there.                                                                                                                                                                                                                                                                                             |

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
menu no longer lists the e-Traveller. The e-308 and e-308 SW
share one PDF, `E-308.pdf`, which has a text layer but downloads rather than
opens in the browser; fetch it from a page on the site and inflate its
streams in the page to read it. On 2026-11-12 neither
the e-Rifter nor the e-Traveller had a page, a PDF, a sitemap entry or a car in
Brimborg's stock, and both are deprecated. `/sitemap.xml`, fetched from inside
the site in the built-in browser, lists every model page Peugeot still has.

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
`grantAmount`, so take the Listaverð. The page's "Skoða verðlista" link,
`isband.is/nyir-bilar/verdlistar-baeklingar/verdlisti-leapmotor`, answers
with a PDF dated by `Last-Modified`. Its prices and specs are images, so
render the pages with `pdf pages` rather than `pdf text`.

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

**Read on 2026-11-10, for makes that had no list here**:

- **Smart and XPENG** (Askja): their documents are not in the `?ps=100`
  listing. Each Smart model page on `smart.askja.is` links its list
  (`smart_verdlisti_140723` is the #1 whatever its slug says), and
  `xpeng.com/is/<model>` links `xpeng_ver_listar`. All four uploaded on
  2026-11-02. "Verð" is the price; a "sérverð" row (#5 Pulse) is an offer.
  The G9L was added on 2026-11-15 with estimated prices, ahead of any word
  from the importer: it has no page under `xpeng.com/is`, and
  `xpeng_ver_listar` was still the 2026-11-02 upload read above, which has
  no G9L. Both entries point at `xpeng.com/is` itself. XPENG is sold by
  Bílaumboðið Una, Askja's sister company, so the list stays on Askja's
  issuu while news goes on `bilaumbodiduna.is/frettir`. Check all three
  for the G9L each sweep, and replace the link, prices and delivery (a
  guessed `2027`) once they appear. The estimate's working is in PR #1769.
- **Volkswagen**: the ID.3 Neo has its own list, `vw/neo.pdf`, linked from
  the verdlistar page and uploaded on 2026-11-10. `vw/id3.pdf` is still the
  ID.3 Pro alone, uploaded on 2026-11-04, so both are on sale. The ID.
  Tiguan was added on 2026-11-12 with an estimated price, from its model page
  `volkswagen.is/is/bilar/id-tiguan.html` (pre-orders open, no price); no
  `vw/id-tiguan.pdf` answered that day, and `vw/tiguan.pdf` is a 2025
  placeholder saying there is no list. Check for a list each sweep, and add
  the Pure and Pro (rear-wheel drive) only if Hekla lists them: it sells the
  ID.4 with four-wheel drive alone. The vans are
  under `vw-atvinnubilar/`, linked from `volkswagen.is/is/bilar/nyr-transporter.html`.
  Only the five-seat crew van is in the list, from
  `e-transporter_lshape_2026.pdf` (uploaded 2026-09-03), and only the short
  one, by the owner's choice on 2026-11-11. The plain panel vans are cargo vans and stay out.
- **Opel and Citroën** (Brimborg): still no price anywhere. The model pages
  print none and link only to Brimborg's stock, `nyirbilar.brimborg.is`,
  which held one diesel Opel van that day and does not list Citroën as a
  make. The ë-C4 page still offers it for order. Ask Brimborg, or treat the
  prices as unverified.
- **Still offered**, though missing from their importer's list: the Mini
  Aceman (mini.is offers a test drive and a quote) and the IONIQ 3's
  42,2 kWh (hyundai.is names both batteries). Askja's showroom,
  `syningarsalur.askja.is`, lists only an "EV5 AWD", while kia.com's EV5 page
  still describes the front-wheel-drive car.

**Settled on 2026-11-12**: the list takes M1 passenger cars only, so the
electric pickups and crew vans are N1 and left out: Toyota's Hilux and Proace
crew cabs, KGM's Musso EV, JAC's T9 EV, VW's e-Transporter in every body,
Ford's E-Transit vans, Isuzu's D-Max EV (BL) and Maxus' eTerron 9 (Vatt). The
Ford E-Tourneo Custom, eight seats, is an M1 people carrier on `ford.is/verdlistar`
(`assets.mango.is/media/21/EKHnwu_tourneo_c.pdf`, page `ford.is/bill/tourneo-kombi`)
and is not in the list yet, for want of a photo: `fromtheroad.ford.com` serves
its press photos only to a browser.

**Read on 2026-11-10**: BL reissued its Hongqi, MG, Nissan, Renault and Subaru
lists on 2026-10-31, KGM and Suzuki theirs on 2026-10-30, and every price
matched. Each BL model's table sits under its photo on an even page; crop the
band below the photo rather than reading the whole page. The Nissan list
prices the Ariya Evolve 4WD at 8.490.000 while nissan.is says "Verð frá
8.990.000"; the list was kept. Ford's PDFs are unchanged since June, and their
`Last-Modified` dates them.

**Read on 2026-11-12**: every price matched, so the sweep changed only
ranges. Škoda's November lists and VW's ID.4 list print lower WLTP figures
than the car list had (Epiq 435, ID.4 GTX 521), and Peugeot's model pages give
the AWD e-3008 500 km and e-5008 467 km, where the list had the
front-wheel-drive figure. The issuu listing's `documentId` starts with the
upload time as `yymmddHHMMSS`. BYD's and JAC's Sanity PDF links are
content-hashed, so a new upload gets a new link, and each answers with a
`Last-Modified` header. Volvo's electric-cars page now prints a "Verð frá"
for the EX60 alone, not for the EX40 and EC40. Peugeot's e-308 and e-308 SW
pages still print no price.

**Checked on 2026-11-14**: no newer list than the one last read for Audi,
BYD, Ford, GWM, JAC, KGM, Mazda, Polestar, Porsche, Range Rover, Škoda,
Suzuki, Volkswagen and Volvo (by `Last-Modified` or the dated filename), nor
on Askja's and BL's issuu listings beyond the Kia PV5 and Renault lists of
2026-11-13. Renault's put the R4 E-Tech up 200.000 kr. The PV5 list gives
the Passenger one rear row (one rear legroom figure, a 60:40 bench) and no
seat count, against the 7 in the car list. Peugeot's model pages moved again,
to `/tegundir/<number>/e-<number>.html` (`/tegundir/3008/e-3008.html`); the
prices render client-side, so `find` "verð frá" in the built-in browser.

**Read on 2026-11-16**: issuu now answers 403 to curl, both the profile
listings and the document pages, so `scripts/issuu-pages.sh` cannot find a
document id. Open `issuu.com/<publisher>?ps=100` in the built-in browser and
pull each `documentId` (`yymmddHHMMSS-<hash>`) and `uri` out of the page's
HTML with `javascript_exec`; `image.isu.pub/<documentId>/jpg/page_<n>.jpg`
still answers curl. BL reissued its BMW, MG and Hyundai lists and Askja its
GLA, GLB, GLC and CLA lists that day, and Brimborg the Mazda CX-6e's; every
price matched. The Peugeot pages now live on `peugeotisland.is`, as the car
list's links already say; `peugeot.is` is refused by the built-in browser.

**Checked on 2026-11-18**: no newer list than the one last read for Audi,
BMW, BYD, Fiat, Ford, GWM, Hongqi, Hyundai, JAC, Jeep, KGM, Kia, MG, Mini,
Mercedes-Benz, Nissan, Polestar, Porsche, Range Rover, Renault, Škoda, Smart,
Subaru, Suzuki, Volkswagen, Volvo and XPENG, by `Last-Modified`, the dated
filename or the issuu `documentId`. The lists without a date (Leapmotor,
Lexus, Peugeot, Tesla, Toyota) and Mazda's 6e, re-uploaded on 2026-11-16, were
read, and every price matched. Documents missing from an issuu listing (Smart,
XPENG, most Kia and Mercedes lists) can be dated from inside the built-in
browser on issuu.com: `fetch('/askja/docs/<slug>')` returns the page, and the
first `yymmddHHMMSS-<hash>` in it is the document's upload. xpeng.com/is now
has a "Hannaðu þinn G9L" button, but it opens the L03 configurator, and
`/is/model/g9l` is a 404, so the G9L is still unpriced. `vw/id-tiguan.pdf`
is still a 404. Toyota's list prints 330 km for the Proace City Verso, the
long body (the only one it sells), where the car list has 345 km and links
ev-database's short L1; the Proace Verso prints a span, 338–432 km. Both were
left for the owner.

**Read on 2026-11-19**: BL reissued its Hyundai and Renault lists on
2026-11-18 and Askja its C-Class list on 2026-11-16; every price matched. The
Hyundai list prints the STARIA Electric (450 km, against 399 in the car list)
on its own page again. Volvo's electric-cars page links an EX40 list for the
2027.5 model year (`VOLVO_EX40_MY27_5_Verdlisti_20261104.pdf`), the P8 AWD
in Plus and Ultra trims, though it prints 442 hö and 4,6 sek where the
configurator gives 300 kW; its Plus at 9.190.000 replaced the estimate. No EC40
list yet. The EX90 list (2026-11-03) prints 606 km for both versions.
landrover.is now answers 403 to curl; in the built-in browser,
`fetch('/range-rover/range-rover-sport/electric')` returns a page whose HTML
holds every model's list under `/uploads/`, still the 14.10.2026 ones. No newer
list than the one last read for Audi, BMW, BYD, Fiat, Ford, GWM, Hongqi, JAC,
Jeep, KGM, Kia, Mazda, MG, Mini, Nissan, Polestar, Porsche, Range Rover,
Škoda, Smart, Subaru, Suzuki, Volkswagen and XPENG. The G9L's pages on
xpeng.com/is still redirect to a 404.

**Read on 2026-11-20**: BL re-uploaded its BMW and Hyundai lists on
2026-11-19, after that day's sweep had read them; every price matched. The
lists without a date (Lexus, Peugeot, Tesla, Toyota) were read too, and every
price matched. ÍSBAND's Leapmotor list is a PDF, last modified 2026-11-19, and
every price matched it. No newer list than the one last read for Audi, BYD,
Fiat, Ford, GWM, Hongqi, JAC, Jeep, Kia, Mazda, Mercedes-Benz, MG, Mini,
Nissan, Polestar, Porsche, Range Rover, Renault, Škoda, Smart, Subaru, Suzuki,
Volkswagen, Volvo and XPENG. `kgm.benni.is` did not answer curl within two
minutes, so KGM was not checked.

**Read on 2026-11-21**: BL re-uploaded its BMW list once more on 2026-11-20
at 14:53, after that day's sweep; every price matched. Volvo's electric-cars
page now links an EC40 list for the 2027.5 model year
(`VOLVO_EC40_MY27.5_Verdlisti_20261118.pdf`), its first, and a reissued EX40
list of the same date. Both sell only the P8 AWD, in Plus and Ultra trims;
the EC40 Plus lists at 9.190.000, the figure it had been given from the
EX40's, and the EX40 Plus is unchanged. Neither list has the older Twin
Motor versions the car list still carries. The undated lists (Lexus,
Peugeot, Tesla, Toyota) were read and every price matched. No newer list
than the one last read for Audi, BYD, Fiat, Ford, GWM, Hongqi, Hyundai, JAC,
Jeep, Kia, Leapmotor, Mazda, Mercedes-Benz, MG, Mini, Nissan, Polestar,
Porsche, Range Rover, Renault, Škoda, Smart, Subaru, Suzuki, Volkswagen and
XPENG. `kgm.benni.is` again did not answer curl within 45 seconds.

**Read on 2026-11-22**: the undated lists (Lexus, Peugeot, Tesla, Toyota)
were read and every price matched. With the browser pane hidden, Tesla's
design pages animate their figures, but each page's inline scripts hold the
trims as option codes (`"$MT367":{…,"price":…}`, `"$MTY85"`), priced on
top of the model's base (`"long_name":"Model 3","price":4000000`) before
VAT. (base + trim) × 1.24 + 164.592 kr. gives every "Staðgreiðsla" in the
car list to the króna, so that sum reads them without a screenshot. No newer
list than the one last read for Audi, BMW, BYD, Fiat, Ford, GWM, Hongqi,
Hyundai, JAC, Jeep, Kia, Leapmotor, Mazda, Mercedes-Benz, MG, Mini, Nissan,
Polestar, Porsche, Range Rover, Renault, Škoda, Smart, Subaru, Suzuki,
Volkswagen, Volvo and XPENG. `kgm.benni.is` refused curl and the built-in
browser alike.

**Read on 2026-11-23**: BL re-uploaded its BMW and Subaru lists that morning;
every price matched. The Subaru list is now eight pages, the three EVs on
pages 2, 4 and 6 (Uncharted, Solterra, e-Outback). The undated lists (Lexus,
Peugeot, Tesla, Toyota) were read and every price matched; the Lexus TZ is
still unpriced, and the XPENG G9L still has no page on xpeng.com/is nor any
word on `bilaumbodiduna.is/frettir`. No newer list than the one last read for
Audi, BYD, Fiat, Ford, GWM, Hongqi, Hyundai, JAC, Jeep, Kia, Leapmotor, Mazda,
Mercedes-Benz, MG, Mini, Nissan, Polestar, Porsche, Range Rover, Renault,
Škoda, Smart, Suzuki, Volkswagen, Volvo and XPENG. `kgm.benni.is` did not
answer curl within 30 seconds, so KGM was not checked.

**Read on 2026-11-24**: Hekla re-uploaded the Škoda Peaq list that morning.
It still sells only the 90x, at 9.190.000 for the Selection, 613 km, with
the third row standard, so every figure matched. Its second column is now
"Verð með Skodastyrk", a 500.000 kr. discount from Škoda itself, not the
grant (the car is over the ceiling); the first "Verð" stays the price. Askja
uploaded a new AMG GT list (`amg_gt_ver_listi`) on 2026-11-23 at 16:38. It
prints the same specs and ranges as the car list, a free four-seat option
(5 seats standard), and "Nánari upplýsingar hjá söluráðgjöfum" in place of
every price, so the 53, 55 and 63 keep the prices they were added with on
2026-11-05, unconfirmed. The undated lists (Lexus, Peugeot, Tesla, Toyota)
were read and every price matched; the Lexus TZ is still unpriced, the
XPENG G9L still has no page on xpeng.com/is, and `vw/id-tiguan.pdf` is
still a 404. No newer list than the one last read for Audi, BMW, BYD, Fiat,
Ford, GWM, Hongqi, Hyundai, JAC, Jeep, Kia, Leapmotor, Mazda, MG, Mini,
Nissan, Polestar, Porsche, Range Rover, Renault, Smart, Subaru, Suzuki,
Volkswagen, Volvo and XPENG. `kgm.benni.is` did not answer curl within 30
seconds, so KGM was not checked.

**Read on 2026-11-25**: Brimborg re-uploaded the Mazda 6e list that morning
and cut its price 300.000 kr., to 6.090.000 (552 km, unchanged). The undated
lists (Lexus, Peugeot, Tesla, Toyota) were read and every price matched; the
Lexus TZ is still unpriced, the XPENG G9L's page on xpeng.com/is is still a
404, `vw/id-tiguan.pdf` is still a 404, and Peugeot's e-308 page still prints
no price. No newer list than the one last read for Audi, BMW, BYD, Fiat, Ford,
GWM, Hongqi, Hyundai, JAC, Jeep, Kia, Leapmotor, Mercedes-Benz, MG, Mini,
Nissan, Polestar, Porsche, Range Rover, Renault, Škoda, Smart, Subaru, Suzuki,
Volkswagen, Volvo and XPENG. `kgm.benni.is` did not answer curl within 30
seconds, so KGM was not checked. `scripts/pdf.swift`, `scripts/issuu-pages.sh`
and `scripts/ipaper-text.py`, which SKILL.md names, are not in the repo: a
PDFKit reader was written in the scratchpad for `pdf text`, and the iPaper
page text is the run of long JSON strings in the flipbook's HTML.
