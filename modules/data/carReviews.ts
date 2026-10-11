// The review on each car's page, by slug. Written by scripts/car-reviews.ts,
// and read in the pull request like any other change to the data: an entry
// can be edited by hand, and a run keeps it until its car's figures change.
// carReviews.test.ts fails while a car has none, or one out of date.

export interface CarReview {
  paragraphs: ReadonlyArray<string>
  /** The figures it was written from, as reviewFactsKey hashes them */
  facts: string
  /** The model that wrote it, and how hard it thought; none for one written by hand */
  model?: string
}

const carReviews: Readonly<Record<string, CarReview>> = {
  'audi-a6-e-tron-sportback-quattro': {
    paragraphs: [
      'Audi A6 e-tron Sportback quattro er dýrari en flestir rafbílar hér en meðal þeirra langdrægustu, með 712 km samkvæmt WLTP, og meðal þeirra sem hlaða hraðast. Fjórhjóladrif, snörp hröðun og hagstætt verð á hvern km miðað við bíla á svipuðu verði gera hann að sterkum kosti fyrir þá sem aka mikið á milli landshluta.',
    ],
    facts: 'cf5a35dc9543',
  },
  'audi-a6-e-tron-avant-quattro': {
    paragraphs: [
      'Audi A6 e-tron Avant quattro er dýrari en flestir en meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast. Með fjórhjóladrifi og meira afli en flestir hentar hann þeim sem vilja langferðabíl og eru tilbúnir að borga fyrir hann.',
    ],
    facts: '16768dc51e04',
  },
  'audi-e-tron-gt-quattro': {
    paragraphs: [
      'Audi e-tron GT quattro er meðal dýrustu bílanna á listanum og meðal þeirra sneggstu og aflmestu. Drægnin er hins vegar styttri en hjá flestum bílum á svipuðu verði, svo hann er fyrir þá sem setja aksturinn sjálfan ofar langferðum og verði.',
    ],
    facts: '31ddac76bef0',
  },
  'audi-q4-e-tron-45-quattro': {
    paragraphs: [
      'Audi Q4 e-tron 45 quattro er fjórhjóladrifinn og dýrari en flestir, en drífur styttra og hleður hægar en flestir bílar á svipuðu verði. Hann er í meðallagi í flestu öðru, svo hann borgar sig helst fyrir þá sem vilja Audi umfram allt.',
    ],
    facts: '991962ef6422',
  },
  'audi-q6-e-tron-base': {
    paragraphs: [
      'Audi Q6 e-tron er meðal þeirra langdrægustu á listanum, með 625 km, og hleður hraðar en flestir. Hann er fjórhjóladrifinn og dýrari en flestir, og í meðallagi miðað við bíla á svipuðu verði, svo valið stendur helst um merkið og þægindin.',
    ],
    facts: '63c57c17d103',
  },
  'audi-q6-e-tron-sportback': {
    paragraphs: [
      'Audi Q6 e-tron Sportback er meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast, með fjórhjóladrif og meira afl en flestir. Hann er dýrari en flestir og í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: 'f7e367c58b0b',
  },
  'audi-sq6-e-tron-base': {
    paragraphs: [
      'Audi SQ6 e-tron er meðal dýrustu bílanna á listanum, sneggri og aflmeiri en flestir og drífur lengra en flestir. Verð á hvern km drægni er þó meðal þess hæsta, svo hann er fyrir þá sem vilja afl og eru ekki að spara.',
    ],
    facts: '3e95e03d3063',
  },
  'bmw-i4-40-xdrive': {
    paragraphs: [
      'BMW i4 40 xDrive er fjórhjóladrifinn og sneggri en flestir, og hleður hraðar en flestir á listanum. Miðað við bíla á svipuðu verði drífur hann þó styttra og rafhlaðan er með þeim minnstu.',
    ],
    facts: 'df5d4ebe059b',
  },
  'bmw-i4-m60-xdrive': {
    paragraphs: [
      'BMW i4 M60 xDrive er meðal sneggstu og aflmestu bílanna á listanum, líka miðað við bíla á svipuðu verði. Hann er dýr og drífur styttra en flestir á sama verði, svo hann er fyrst og fremst fyrir þá sem vilja akstursánægju.',
    ],
    facts: '6f08397fe73e',
  },
  'bmw-i5-edrive40': {
    paragraphs: [
      'BMW i5 eDrive40 er afturhjóladrifinn og drífur lengra en flestir, en er dýrari en flestir og hleður hægar en flestir bílar á svipuðu verði. Hann er í meðallagi að afli og hröðun.',
    ],
    facts: '21c91d749061',
  },
  'bmw-i5-m60-xdrive': {
    paragraphs: [
      'BMW i5 M60 xDrive er meðal dýrustu, sneggstu og aflmestu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann þó með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: '9adfec4ae4bb',
  },
  'bmw-ix-xdrive-45-sport': {
    paragraphs: [
      'BMW iX xDrive 45 Sport er meðal dýrustu bílanna á listanum, fjórhjóladrifinn og drífur lengra en flestir. Miðað við bíla á svipuðu verði er hann þó aflminni og hleður hægar en flestir.',
    ],
    facts: '3a1ada60c06e',
  },
  'bmw-ix-xdrive-60-sport': {
    paragraphs: [
      'BMW iX xDrive 60 Sport er meðal þeirra langdrægustu, með 701 km, og með einni af stærstu rafhlöðunum á listanum. Hann er dýr, en meðal þeirra ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '853d5e37c57e',
  },
  'bmw-ix1-edrive-20': {
    paragraphs: [
      'BMW iX1 eDrive 20 er ódýrari en flestir og ódýrari á hvern km drægni en flestir, með drægni í meðallagi. Hann er hægari og aflminni en flestir og framhjóladrifinn, svo hann hentar best í rólegan daglegan akstur.',
    ],
    facts: '7a357637d052',
  },
  'bmw-ix1-xdrive-30': {
    paragraphs: [
      'BMW iX1 xDrive 30 er fjórhjóladrifinn og í meðallagi að verði, en drífur styttra og hleður hægar en flestir. Rafhlaðan er með þeim minnstu miðað við bíla á svipuðu verði, sem kemur niður á langferðum.',
    ],
    facts: 'c2f2c6dfa29f',
  },
  'bmw-ix3-40': {
    paragraphs: [
      'BMW iX3 40 er meðal þeirra langdrægustu, með 637 km, og meðal þeirra sem hlaða hraðast. Hann er afturhjóladrifinn og dýrari en flestir, en ódýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: 'c9a516b4b0c4',
  },
  'bmw-ix3-50-xdrive': {
    paragraphs: [
      'BMW iX3 50 xDrive er meðal þeirra langdrægustu á listanum, með 805 km, og meðal þeirra sem hlaða hraðast. Hann er fjórhjóladrifinn og dýrari en flestir, en meðal þeirra ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '61331f005690',
  },
  'byd-dolphin-base': {
    paragraphs: [
      'BYD Dolphin er meðal ódýrustu bílanna á listanum og meðal þeirra ódýrustu á hvern km drægni. Hann hleður þó með þeim hægustu, svo hann hentar best í innanbæjarakstur og styttri ferðir.',
    ],
    facts: 'f28dea4386f3',
  },
  'byd-seal-base': {
    paragraphs: [
      'BYD Seal er fjórhjóladrifinn og meðal þeirra sneggstu og aflmestu á listanum, á verði í meðallagi. Drægnin er í meðallagi og hann hleður hægar en flestir, sem skiptir máli á langferðum.',
    ],
    facts: 'a6eee18c6c11',
  },
  'byd-seal-u-base': {
    paragraphs: [
      'BYD Seal U er ódýrari en flestir og með stærri rafhlöðu en flestir, en hleður með þeim hægustu og er meðal þeirra hægustu í hröðun. Hann hentar þeim sem vilja mikið fyrir peninginn og aka rólega.',
    ],
    facts: '835eec18e3ad',
  },
  'byd-sealion-7-base': {
    paragraphs: [
      'BYD Sealion 7 er fjórhjóladrifinn, meðal þeirra aflmestu og hleður hraðar en flestir. Drægnin er þó í meðallagi og hann er dýrari á hvern km drægni en flestir.',
    ],
    facts: 'a12f806b8b0f',
  },
  'byd-tang-flagship': {
    paragraphs: [
      'BYD Tang Flagship er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum á listanum. Hann er dýrari en flestir og hleður með þeim hægustu, sem er galli á langferðum.',
    ],
    facts: 'da25920fd165',
  },
  'citroen-e-c4-base': {
    paragraphs: [
      'Citroën ë-C4 er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Hann er hins vegar meðal þeirra hægustu og aflminnstu, drífur styttra og hleður hægar en flestir, svo hann hentar helst í daglegan akstur.',
    ],
    facts: '01c8baf25e60',
  },
  'fiat-500e-base': {
    paragraphs: [
      'Fiat 500e er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst, með 305 km, og hleður með þeim hægustu. Hann er fjögurra sæta og hentar best sem innanbæjarbíll.',
    ],
    facts: '6c43f8b948a7',
  },
  'fiat-600e-base': {
    paragraphs: [
      'Fiat 600e er ódýrari en flestir en meðal þeirra sem drífa styst og meðal þeirra hægustu og aflminnstu. Hann hentar best í daglegan akstur innanbæjar.',
    ],
    facts: '676ea7303621',
  },
  'ford-capri-base': {
    paragraphs: [
      'Ford Capri er fjórhjóladrifinn og drífur lengra en flestir, á verði í meðallagi. Miðað við bíla á svipuðu verði er hann meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast, sem gerir hann að sterkum kosti á langferðum.',
    ],
    facts: 'b725c404f80f',
  },
  'ford-explorer-er-awd': {
    paragraphs: [
      'Ford Explorer ER AWD er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er ódýrari á hvern km drægni en flestir og traustur kostur fyrir íslenskar aðstæður.',
    ],
    facts: 'c717d592ebce',
  },
  'ford-mustang-mach-e-lr-awd': {
    paragraphs: [
      'Ford Mustang Mach-E LR AWD er fjórhjóladrifinn og drífur lengra en flestir, með einni af stærstu rafhlöðunum miðað við bíla á svipuðu verði. Hann hleður þó hægar en flestir, sem lengir hleðslustoppin á langferðum.',
    ],
    facts: '62ca61e8af92',
  },
  'ford-puma-base': {
    paragraphs: [
      'Ford Puma er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og aflminnstu. Miðað við bíla á svipuðu verði hleður hann þó hraðar en flestir.',
    ],
    facts: '2c1f4ca20aa6',
  },
  'hongqi-ehs5-base': {
    paragraphs: [
      'Hongqi EHS5 er ódýrari en flestir en fjórhjóladrifinn og meðal þeirra sneggstu og aflmestu. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu, sem gerir hann að miklum bíl fyrir peninginn.',
    ],
    facts: 'ba6a822803ec',
  },
  'hongqi-ehs7-premium': {
    paragraphs: [
      'Hongqi EHS7 Premium er fjórhjóladrifinn, meðal þeirra aflmestu og sneggstu, og með stærstu rafhlöðuna miðað við bíla á svipuðu verði. Drægnin er þó í meðallagi og hann er dýrari á hvern km drægni en flestir á sama verði.',
    ],
    facts: '3a3333498e46',
  },
  'hyundai-inster-base': {
    paragraphs: [
      'Hyundai INSTER er meðal ódýrustu bílanna á listanum og meðal þeirra ódýrustu á hvern km drægni. Hann drífur þó með þeim stystu, hleður hægt og er aflminni en flestir, svo hann hentar best innanbæjar.',
    ],
    facts: 'ed92d40d7850',
  },
  'hyundai-inster-long-range': {
    paragraphs: [
      'Hyundai INSTER Long Range er meðal ódýrustu bílanna á listanum og ódýrari á hvern km drægni en flestir. Drægnin er samt með þeirri stystu og hann hleður hægt, svo hann er helst borgarbíll.',
    ],
    facts: '93c6f4fa6857',
  },
  'hyundai-ioniq-3-standard-range': {
    paragraphs: [
      'Hyundai IONIQ 3 Standard Range er meðal ódýrustu bílanna en meðal þeirra sem drífa styst og hleður með þeim hægustu. Hann er væntanlegur í lok árs 2026 og hentar helst í innanbæjarakstur.',
    ],
    facts: '9c26521cb3d3',
  },
  'hyundai-ioniq-3-long-range': {
    paragraphs: [
      'Hyundai IONIQ 3 Long Range er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni, með 496 km. Hann er þó meðal þeirra hægustu og aflminnstu, og væntanlegur í lok árs 2026.',
    ],
    facts: '60ddcc68748d',
  },
  'hyundai-ioniq-5-long-range-awd': {
    paragraphs: [
      'Hyundai IONIQ 5 Long Range AWD er fjórhjóladrifinn og meðal þeirra sem hlaða hraðast á listanum, sá hraðasti miðað við bíla á svipuðu verði. Hann drífur lengra en flestir á sama verði og er ódýrari á hvern km drægni en flestir.',
    ],
    facts: '547c5f26c39c',
  },
  'hyundai-ioniq-9-long-range-awd': {
    paragraphs: [
      'Hyundai IONIQ 9 Long Range AWD er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum og drífur lengra en flestir. Hann er dýrari en flestir og hægari en flestir í hröðun.',
    ],
    facts: '631700586184',
  },
  'hyundai-ioniq-9-long-range-performance-awd': {
    paragraphs: [
      'Hyundai IONIQ 9 Long Range Performance AWD er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum og meira afl en flestir. Hann er dýrari en flestir og í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: '24f9e703ad54',
  },
  'hyundai-kona-electric-65-kwh': {
    paragraphs: [
      'Hyundai Kona Electric 65 kWh er ódýrari en flestir og meðal þeirra ódýrustu á hvern km drægni. Hann drífur lengra en flestir bílar á svipuðu verði en hleður hægar en flestir.',
    ],
    facts: '6cc9ddb01dd8',
  },
  'hyundai-staria-electric-base': {
    paragraphs: [
      'Hyundai STARIA Electric tekur níu manns, á verði í meðallagi. Hann er þó meðal þeirra sem drífa styst og meðal þeirra hægustu, og væntanlegur í lok árs 2026.',
    ],
    facts: '96a34256ea87',
  },
  'jeep-avenger-base': {
    paragraphs: [
      'Jeep Avenger er ódýrari en flestir en meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir. Hann hentar helst sem bíll í daglegan akstur innanbæjar.',
    ],
    facts: 'aedfb70cc973',
  },
  'kgm-musso-ev-base': {
    paragraphs: [
      'KGM Musso EV er ódýrari en flestir og með stærri rafhlöðu en flestir. Hann hleður þó með þeim hægustu og er meðal þeirra hægustu í hröðun.',
    ],
    facts: '38827a0d9c9c',
  },
  'kgm-musso-ev-4wd': {
    paragraphs: [
      'KGM Musso EV 4WD er fjórhjóladrifinn en meðal þeirra sem drífa styst og hlaða hægast. Hann er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: 'fad1ab92a693',
  },
  'kgm-torres-evx': {
    paragraphs: [
      'KGM Torres EVX er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Hann er þó hægari, aflminni og hleður hægar en flestir.',
    ],
    facts: 'dde274931991',
  },
  'kia-ev2-standard-range': {
    paragraphs: [
      'Kia EV2 Standard Range er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar best sem innanbæjarbíll.',
    ],
    facts: '2ab8f29d8533',
  },
  'kia-ev2-long-range': {
    paragraphs: [
      'Kia EV2 Long Range er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur lengra en flestir bílar á svipuðu verði en er meðal þeirra hægustu og aflminnstu.',
    ],
    facts: 'acfd4896a650',
  },
  'kia-ev3-standard-range': {
    paragraphs: [
      'Kia EV3 Standard Range er meðal ódýrustu bílanna á listanum og ódýrari á hvern km drægni en flestir. Hann drífur styttra og hleður hægar en flestir, en er í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: 'a5ac8fa23612',
  },
  'kia-ev3-long-range': {
    paragraphs: [
      'Kia EV3 Long Range er ódýrari en flestir en drífur lengra en flestir, með 605 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er aflminni en flestir, svo hann er hagkvæmur langferðabíll fyrir þá sem þurfa ekki fjórhjóladrif.',
    ],
    facts: 'ea684c9bf92b',
  },
  'kia-ev3-long-range-awd': {
    paragraphs: [
      'Kia EV3 Long Range AWD er fjórhjóladrifinn, ódýrari en flestir og drífur lengra en flestir. Hann er ódýrari á hvern km drægni en flestir og hleður hraðar en flestir bílar á svipuðu verði.',
    ],
    facts: '4ff8f49db637',
  },
  'kia-ev4-base': {
    paragraphs: [
      'Kia EV4 er meðal þeirra langdrægustu, með 625 km, og meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir en er hægari og aflminni en flestir.',
    ],
    facts: 'e22a3fafe8e4',
  },
  'kia-ev4-fastback': {
    paragraphs: [
      'Kia EV4 Fastback er ódýrari en flestir, drífur lengra en flestir og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir en er hægari og aflminni en flestir.',
    ],
    facts: '06b5bcfe6713',
  },
  'kia-ev5-base': {
    paragraphs: [
      'Kia EV5 er í meðallagi að verði, drægni og hleðslu. Hann er hægari og aflminni en flestir og framhjóladrifinn, svo hann er fyrir þá sem aka rólega.',
    ],
    facts: '2ad9e5e3ce04',
  },
  'kia-ev5-awd': {
    paragraphs: [
      'Kia EV5 AWD er fjórhjóladrifinn og í meðallagi að verði, en drífur styttra og hleður hægar en flestir. Hann er líka hægari og aflminni en flestir.',
    ],
    facts: 'fb820999e660',
  },
  'kia-ev6-2025-long-range-awd': {
    paragraphs: [
      'Kia EV6 2025 Long Range AWD er fjórhjóladrifinn og meðal þeirra sem hlaða hraðast, á verði í meðallagi. Hann er sneggri en flestir og ódýrari á hvern km drægni en flestir.',
    ],
    facts: '46354ee3c65d',
  },
  'kia-ev9-base': {
    paragraphs: [
      'Kia EV9 er sjö sæta og fjórhjóladrifinn, með stærri rafhlöðu en flestir og hleður hraðar en flestir. Hann er dýrari en flestir og drífur styttra en flestir bílar á svipuðu verði.',
    ],
    facts: '825d2ff3657a',
  },
  'kia-ev9-gt': {
    paragraphs: [
      'Kia EV9 GT er sjö sæta, fjórhjóladrifinn og sneggri og aflmeiri en flestir. Hann er meðal dýrustu bílanna og drífur með þeim stystu miðað við bíla á svipuðu verði.',
    ],
    facts: 'a96882e9d387',
  },
  'kia-pv5-base': {
    paragraphs: [
      'Kia PV5 er sjö sæta og afturhjóladrifinn, á verði í meðallagi. Hann er meðal þeirra hægustu og aflminnstu og drífur styttra en flestir.',
    ],
    facts: '906afb81bc90',
  },
  'leapmotor-t03-base': {
    paragraphs: [
      'Leapmotor T03 er ódýrasti bíllinn á listanum og meðal þeirra ódýrustu á hvern km drægni. Hann er fjögurra sæta, drífur með þeim stystu og hleður hægt, svo hann er eingöngu borgarbíll.',
    ],
    facts: 'adedab20d34e',
  },
  'leapmotor-b03x-pro': {
    paragraphs: [
      'Leapmotor B03X Pro er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst. Hann er væntanlegur í lok árs 2026 og hentar helst innanbæjar.',
    ],
    facts: '9c6765f8331d',
  },
  'leapmotor-b03x-promax': {
    paragraphs: [
      'Leapmotor B03X ProMax er meðal ódýrustu bílanna og drífur lengra en flestir bílar á svipuðu verði. Miðað við þá hleður hann líka með þeim hröðustu; hann er væntanlegur í lok árs 2026.',
    ],
    facts: '04c19c4923bc',
  },
  'leapmotor-b05-pro': {
    paragraphs: [
      'Leapmotor B05 Pro er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og er meðal þeirra sneggstu; hann er væntanlegur í lok árs 2026.',
    ],
    facts: '75038d53ed85',
  },
  'leapmotor-b05-promax': {
    paragraphs: [
      'Leapmotor B05 ProMax er meðal ódýrustu bílanna og drífur lengst, hleður hraðast og er sneggstur bíla á svipuðu verði. Hann er væntanlegur í lok árs 2026.',
    ],
    facts: 'dc1638ace155',
  },
  'leapmotor-b10-base': {
    paragraphs: [
      'Leapmotor B10 er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur með þeim stystu á listanum en hleður hraðar en flestir bílar á svipuðu verði.',
    ],
    facts: '34515459fffb',
  },
  'leapmotor-b10-67-1-kwh': {
    paragraphs: [
      'Leapmotor B10 67.1 kWh er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu.',
    ],
    facts: '345a56bc4686',
  },
  'leapmotor-c10-pro': {
    paragraphs: [
      'Leapmotor C10 Pro er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur styttra og hleður hægar en flestir.',
    ],
    facts: '2389369c210b',
  },
  'leapmotor-c10-promax': {
    paragraphs: [
      'Leapmotor C10 ProMax er ódýrari en flestir og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og er meðal þeirra aflmestu.',
    ],
    facts: '90d9b9ab19ce',
  },
  'leapmotor-c10-promax-awd': {
    paragraphs: [
      'Leapmotor C10 ProMax AWD er fjórhjóladrifinn, ódýrari en flestir og meðal þeirra sneggstu og aflmestu. Hann drífur þó styttra og hleður hægar en flestir.',
    ],
    facts: '34564344ef37',
  },
  'lexus-es-350e': {
    paragraphs: [
      'Lexus ES 350e er framhjóladrifinn og drífur lengra en flestir, en er dýrari en flestir. Miðað við bíla á svipuðu verði er hann meðal þeirra hægustu og aflminnstu.',
    ],
    facts: 'dc17d6d74adc',
  },
  'lexus-es-500e': {
    paragraphs: [
      'Lexus ES 500e er fjórhjóladrifinn og meðal dýrustu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann styttra og hleður með þeim hægustu.',
    ],
    facts: '46fa0992d8cd',
  },
  'lexus-rz-350e': {
    paragraphs: [
      'Lexus RZ 350e er framhjóladrifinn og drífur lengra en flestir, en er dýrari en flestir. Miðað við bíla á svipuðu verði drífur hann styttra og er meðal þeirra hægustu og aflminnstu.',
    ],
    facts: '8d0c6c3d0d4f',
  },
  'lexus-rz-500e': {
    paragraphs: [
      'Lexus RZ 500e er fjórhjóladrifinn og sneggri en flestir, en dýrari en flestir og meðal þeirra dýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: '8ed986c78204',
  },
  'lexus-rz-550e-f-sport': {
    paragraphs: [
      'Lexus RZ 550e F SPORT er meðal dýrustu bílanna á listanum, fjórhjóladrifinn og sneggri en flestir. Miðað við bíla á svipuðu verði drífur hann þó með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: '5c8c62bff359',
  },
  'lexus-ux-300e': {
    paragraphs: [
      'Lexus UX 300e er dýrari en flestir en drífur styttra, hleður með þeim hægustu og er hægari og aflminni en flestir. Miðað við bíla á svipuðu verði gefur hann eftir í flestu sem tölurnar mæla.',
    ],
    facts: 'dce48bde196b',
  },
  'mazda-6e-long-range': {
    paragraphs: [
      'Mazda 6e Long Range er ódýrari en flestir en drífur lengra en flestir, með 552 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður þó með þeim hægustu á listanum, sem lengir stoppin á langferðum.',
    ],
    facts: '487c9dd3ac11',
  },
  'mazda-cx-6e-78-kwh': {
    paragraphs: [
      'Mazda CX-6e 78 kWh er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði hleður hann hraðar en flestir, en er hægari en flestir; hann er væntanlegur haustið 2026.',
    ],
    facts: '624f0a26218b',
  },
  'mercedes-benz-c-400-4matic': {
    paragraphs: [
      'Mercedes-Benz C 400 4MATIC er meðal þeirra langdrægustu á listanum, með 762 km, meðal þeirra sem hlaða hraðast og meðal þeirra sneggstu. Hann er dýrari en flestir, en ódýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: 'bb99530b3f5d',
  },
  'mercedes-benz-cla-200': {
    paragraphs: [
      'Mercedes-Benz CLA 200 er á verði í meðallagi og hleður hraðar en flestir, með þeim hröðustu miðað við bíla á svipuðu verði. Hann er þó hægari og aflminni en flestir og með minni rafhlöðu.',
    ],
    facts: '0c8c54cadb8a',
  },
  'mercedes-benz-cla-350-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA 350 4MATIC er meðal þeirra langdrægustu á listanum, með 770 km, og meðal þeirra sem hlaða hraðast. Hann er ódýrastur bíla á svipuðu verði á hvern km drægni, sem gerir hann að einum besta langferðabílnum í sínum verðflokki.',
    ],
    facts: '32bf4d70d539',
  },
  'mercedes-benz-cla-shooting-brake-350-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA Shooting Brake 350 4MATIC er meðal þeirra langdrægustu, með 743 km, og meðal þeirra sem hlaða hraðast. Hann er dýrari en flestir en meðal þeirra ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '3e88a13e7c47',
  },
  'mercedes-benz-cla-amg-45-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA AMG 45 4MATIC+ er sneggstur bíla á svipuðu verði og meðal þeirra aflmestu, en líka meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast. Hann er fjögurra sæta og dýrari en flestir.',
    ],
    facts: '6fb7275afd9d',
  },
  'mercedes-benz-eqa-suv-300-4matic': {
    paragraphs: [
      'Mercedes-Benz EQA SUV 300 4MATIC er fjórhjóladrifinn og á verði í meðallagi, en drífur styttra, hleður hægar og er hægari og aflminni en flestir. Miðað við bíla á svipuðu verði hleður hann með þeim hægustu.',
    ],
    facts: '83d304c4d548',
  },
  'mercedes-benz-glb-350-4matic-eq': {
    paragraphs: [
      'Mercedes-Benz GLB 350 4MATIC EQ er sjö sæta og fjórhjóladrifinn, meðal þeirra sem hlaða hraðast og drífur lengra en flestir. Hann er dýrari en flestir en meðal þeirra langdrægustu miðað við bíla á svipuðu verði.',
    ],
    facts: '45ed5ebf6eaa',
  },
  'mercedes-benz-glc-300-4matic': {
    paragraphs: [
      'Mercedes-Benz GLC 300 4MATIC er fjórhjóladrifinn, drífur lengra en flestir og hleður hraðar en flestir. Hann er dýrari en flestir og í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: '69044176090c',
  },
  'mercedes-benz-glc-400-4matic': {
    paragraphs: [
      'Mercedes-Benz GLC 400 4MATIC er meðal þeirra langdrægustu, með 715 km, og meðal þeirra sem hlaða hraðast. Hann er fjórhjóladrifinn, sneggri og aflmeiri en flestir og dýrari en flestir.',
    ],
    facts: '273e1d28f57b',
  },
  'mercedes-benz-eqe-suv-350-4matic': {
    paragraphs: [
      'Mercedes-Benz EQE SUV 350 4MATIC er meðal dýrustu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann styttra, hleður með þeim hægustu og er meðal þeirra hægustu og aflminnstu.',
    ],
    facts: 'e5031300ff9d',
  },
  'mercedes-benz-eqs-580-4matic': {
    paragraphs: [
      'Mercedes-Benz EQS 580 4MATIC drífur lengst allra bíla á listanum, 869 km, og hefur stærstu rafhlöðuna. Hann er meðal dýrustu bílanna en ódýrastur á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: 'a7b159ecef57',
  },
  'mercedes-benz-eqs-suv-580-4matic': {
    paragraphs: [
      'Mercedes-Benz EQS SUV 580 4MATIC er sjö sæta, meðal þeirra langdrægustu og meðal þeirra aflmestu á listanum. Miðað við bíla á svipuðu verði hleður hann þó með þeim hægustu.',
    ],
    facts: '39182ca8f9fd',
  },
  'mercedes-benz-eqt-200': {
    paragraphs: [
      'Mercedes-Benz EQT 200 er sjö sæta á verði í meðallagi, en meðal þeirra sem drífa styst, hlaða hægast og eru hægastir. Hann hentar helst sem rúmgóður bíll í styttri ferðir.',
    ],
    facts: '6088eef7e4fc',
  },
  'mercedes-benz-eqv-300': {
    paragraphs: [
      'Mercedes-Benz EQV 300 tekur átta manns en er meðal dýrustu bílanna á listanum og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin umfram allt.',
    ],
    facts: '177f9b3dca02',
  },
  'mercedes-benz-vle-300': {
    paragraphs: [
      'Mercedes-Benz VLE 300 er átta sæta og meðal þeirra langdrægustu, með 713 km, og með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna og meðal þeirra hægustu, og væntanlegur árið 2027.',
    ],
    facts: 'a48af364b80f',
  },
  'mercedes-benz-vle-400-4matic': {
    paragraphs: [
      'Mercedes-Benz VLE 400 4MATIC er átta sæta og fjórhjóladrifinn, meðal þeirra langdrægustu og með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum og væntanlegur árið 2027.',
    ],
    facts: '63683fa1dde9',
  },
  'mercedes-benz-g-class-580-eq': {
    paragraphs: [
      'Mercedes-Benz G-class 580 EQ er meðal dýrustu og aflmestu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: 'a7c8e47c1f18',
  },
  'mercedes-benz-evito-tourer': {
    paragraphs: [
      'Mercedes-Benz eVito Tourer tekur níu manns en er dýrari en flestir og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin.',
    ],
    facts: 'b529fc0d63a6',
  },
  'mg-cyberster-gt': {
    paragraphs: [
      'MG Cyberster GT er tveggja sæta, fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur styttra og hleður með þeim hægustu, svo hann er bíll fyrir aksturinn fremur en langferðir.',
    ],
    facts: 'cd0f7330bf39',
  },
  'mg-mg4-urban-standard-range': {
    paragraphs: [
      'MG MG4 Urban Standard Range er meðal ódýrustu bílanna á listanum og meðal þeirra ódýrustu á hvern km drægni. Hann drífur þó með þeim stystu og hleður hægt, svo hann hentar best innanbæjar.',
    ],
    facts: 'd2cb042819a0',
  },
  'mg-mg4-urban-long-range': {
    paragraphs: [
      'MG MG4 Urban Long Range er meðal ódýrustu bílanna og meðal þeirra langdrægustu miðað við bíla á svipuðu verði. Hann er þó meðal þeirra hægustu og aflminnstu á listanum.',
    ],
    facts: 'd561aa89b78e',
  },
  'mg-mgs5-lux': {
    paragraphs: [
      'MG MGS5 LUX er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði drífur hann lengra, hleður hraðar og er sneggri en flestir.',
    ],
    facts: '8831f93e169f',
  },
  'mg-mgs6-dual-motor': {
    paragraphs: [
      'MG MGS6 Dual Motor er fjórhjóladrifinn, ódýrari en flestir og sneggri og aflmeiri en flestir. Hann drífur þó styttra og hleður hægar en flestir.',
    ],
    facts: 'c4a974a1b565',
  },
  'mini-aceman-e': {
    paragraphs: [
      'Mini Aceman E er ódýrari en flestir en meðal þeirra sem drífa styst og hlaða hægast, og meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði. Hann hentar helst innanbæjar.',
    ],
    facts: 'c58dee5fff30',
  },
  'mini-countryman-e': {
    paragraphs: [
      'Mini Countryman E er á verði í meðallagi en drífur styttra, hleður hægar og er meðal þeirra hægustu. Miðað við bíla á svipuðu verði er hann með einni af minnstu rafhlöðunum.',
    ],
    facts: '5cbce46a3bb6',
  },
  'mini-countryman-se-4x4': {
    paragraphs: [
      'Mini Countryman SE 4x4 er fjórhjóladrifinn og á verði í meðallagi, en drífur styttra og hleður hægar en flestir. Hann er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '77a1c2edd4fd',
  },
  'nissan-ariya-base': {
    paragraphs: [
      'Nissan Ariya er á verði í meðallagi, með stærri rafhlöðu en flestir og ódýrari á hvern km drægni en flestir. Hann hleður þó hægar og er hægari og aflminni en flestir.',
    ],
    facts: '7b4d55c3845e',
  },
  'nissan-ariya-e-4orce': {
    paragraphs: [
      'Nissan Ariya e-4ORCE er fjórhjóladrifinn og með stærri rafhlöðu en flestir, en hleður með þeim hægustu og drífur styttra en flestir. Hann er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: 'e2425bbf002e',
  },
  'nissan-leaf-standard-range': {
    paragraphs: [
      'Nissan Leaf Standard Range er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur lengra en flestir bílar á svipuðu verði en er hægari en flestir.',
    ],
    facts: 'f0210f255f35',
  },
  'nissan-leaf-extended-range': {
    paragraphs: [
      'Nissan Leaf Extended Range er ódýrari en flestir en drífur lengra en flestir, með 622 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er sterkur langferðabíll fyrir verðið.',
    ],
    facts: 'd403fd929dd3',
  },
  'opel-frontera-base': {
    paragraphs: [
      'Opel Frontera er sjö sæta og meðal ódýrustu bílanna á listanum. Hann er þó meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir.',
    ],
    facts: '1bf0988f13bd',
  },
  'opel-grandland-base': {
    paragraphs: [
      'Opel Grandland er ódýrari en flestir og ódýrari á hvern km drægni en flestir, með drægni í meðallagi. Hann er meðal þeirra hægustu og hleður hægar en flestir.',
    ],
    facts: '20948be61fd4',
  },
  'opel-grandland-awd': {
    paragraphs: [
      'Opel Grandland AWD er fjórhjóladrifinn og á verði í meðallagi. Hann drífur styttra og hleður hægar en flestir, en er í meðallagi að afli og hröðun.',
    ],
    facts: '954a05305509',
  },
  'gwm-ora-3-48-kwh': {
    paragraphs: [
      'GWM Ora 3 48 kWh er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar best innanbæjar.',
    ],
    facts: '7b68705ac074',
  },
  'peugeot-e-2008-54-kwh': {
    paragraphs: [
      'Peugeot e-2008 54 kWh er meðal ódýrustu bílanna en drífur styttra og er meðal þeirra hægustu og aflminnstu. Miðað við bíla á svipuðu verði hleður hann þó hraðar en flestir.',
    ],
    facts: 'bed6b68cd2bf',
  },
  'peugeot-e-3008-base': {
    paragraphs: [
      'Peugeot e-3008 er ódýrari en flestir og ódýrari á hvern km drægni en flestir, og drífur lengra en flestir bílar á svipuðu verði. Hann hleður hægar og er aflminni en flestir.',
    ],
    facts: '198e614b0c8f',
  },
  'peugeot-e-3008-dual-motor': {
    paragraphs: [
      'Peugeot e-3008 Dual Motor er fjórhjóladrifinn, ódýrari en flestir og drífur lengra en flestir bílar á svipuðu verði. Hann hleður þó hægar en flestir.',
    ],
    facts: 'f2f30039cf77',
  },
  'peugeot-e-5008-base': {
    paragraphs: [
      'Peugeot e-5008 er sjö sæta og ódýrari en flestir, með drægni í meðallagi. Hann er meðal þeirra hægustu og hleður hægar en flestir.',
    ],
    facts: '74063c967e5f',
  },
  'peugeot-e-5008-dual-motor': {
    paragraphs: [
      'Peugeot e-5008 Dual Motor er sjö sæta og fjórhjóladrifinn, á verði í meðallagi. Hann drífur styttra en flestir og hleður með þeim hægustu miðað við bíla á svipuðu verði.',
    ],
    facts: '3c5f83371c3b',
  },
  'peugeot-e-rifter-base': {
    paragraphs: [
      'Peugeot e-Rifter er sjö sæta og ódýrari en flestir, en meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir. Hann hentar helst sem rúmgóður bíll í styttri ferðir.',
    ],
    facts: '405a281f7f21',
  },
  'peugeot-e-traveller-base': {
    paragraphs: [
      'Peugeot e-Traveller tekur níu manns en er dýrari en flestir og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin umfram allt.',
    ],
    facts: '6c0983d6e534',
  },
  'polestar-2-long-range-dual-motor': {
    paragraphs: [
      'Polestar 2 Long Range Dual Motor er fjórhjóladrifinn, drífur lengra en flestir og hleður hraðar en flestir, á verði í meðallagi. Miðað við bíla á svipuðu verði er hann meðal þeirra langdrægustu og sneggri en flestir.',
    ],
    facts: 'cd7df46bac4c',
  },
  'polestar-2-long-range-performance': {
    paragraphs: [
      'Polestar 2 Long Range Performance er fjórhjóladrifinn, sneggri og aflmeiri en flestir, og drífur lengra og hleður hraðar en flestir. Hann er á verði í meðallagi.',
    ],
    facts: '94faf5a9383a',
  },
  'polestar-3-base': {
    paragraphs: [
      'Polestar 3 er meðal þeirra langdrægustu og með einni af stærstu rafhlöðunum. Hann er fjórhjóladrifinn og dýrari en flestir, og hleður hægar en flestir bílar á svipuðu verði.',
    ],
    facts: '0e29c1e42cc2',
  },
  'polestar-3-performance': {
    paragraphs: [
      'Polestar 3 Performance er fjórhjóladrifinn, sneggri og aflmeiri en flestir og með einni af stærstu rafhlöðunum. Miðað við bíla á svipuðu verði drífur hann þó styttra og hleður hægar.',
    ],
    facts: '529301e2a258',
  },
  'polestar-4-long-range-dual-motor': {
    paragraphs: [
      'Polestar 4 Long Range Dual Motor er kraftmikill, fjórhjóladrifinn bíll sem hentar þeim sem leita að mikilli drægni og snörpum afköstum í öllum veðrum.',
      'Helsti styrkur bílsins er að hann drífur lengra en flestir rafbílar og er með einni af stærstu rafhlöðunum í sínum verðflokki. Þetta þýðir að ferðalög milli landshluta takast auðveldlega án hleðslustopps, jafnvel í vetrarkulda. Hann er jafnframt meðal þeirra aflmestu og sneggstu, ræður við 2.000 kg drátt og býður upp á 526 lítra skott.',
      'Hraðhleðslan er hins vegar aðeins í meðallagi og bíllinn er dýrari en flestir. Polestar 4 er 7,7 km/mín hægari að hlaða en Smart #5 Brabus, þótt Smart sé með 50 km minni drægni. Einnig er Polestar 4 160.000 kr. dýrari en Tesla Model Y Performance og 0,3 s hægari í hundraðið.',
      'Þetta eru góð kaup fyrir þá sem vilja öflugan fjórhjóladrifinn bíl með mikla vetrardrægni og ríflega dráttargetu. Hann hentar síður þeim sem vilja hraðari hleðslu á langferðum eða lægra verð.',
    ],
    facts: '9400f9c5e9f3',
    model: 'gemini-3.8-flash, thinking high',
  },
  'polestar-4-suv-long-range-dual-motor': {
    paragraphs: [
      'Polestar 4 SUV Long Range Dual Motor er meðal sneggstu og aflmestu bílanna, drífur lengra en flestir og hleður hraðar en flestir. Hann er dýrari en flestir.',
    ],
    facts: '40d5cca7678b',
  },
  'porsche-macan-4-electric': {
    paragraphs: [
      'Porsche Macan 4 Electric er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir. Hann er dýrari en flestir og í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: 'e167938f4f3b',
  },
  'porsche-macan-4s-electric': {
    paragraphs: [
      'Porsche Macan 4s Electric er meðal sneggstu bílanna á listanum og hleður hraðar en flestir. Hann er meðal þeirra dýrustu.',
    ],
    facts: 'b39e2737f681',
  },
  'porsche-taycan-plus': {
    paragraphs: [
      'Porsche Taycan Plus er meðal þeirra langdrægustu, með 678 km, og meðal þeirra sem hlaða hraðast. Hann er afturhjóladrifinn og meðal dýrustu bílanna á listanum.',
    ],
    facts: 'bea812314e71',
  },
  'porsche-taycan-4-plus': {
    paragraphs: [
      'Porsche Taycan 4 Plus er fjórhjóladrifinn, meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '5e022bace7c8',
  },
  'porsche-taycan-4s-plus': {
    paragraphs: [
      'Porsche Taycan 4S Plus er sneggstur bíla á svipuðu verði og meðal þeirra aflmestu á listanum. Hann hleður með þeim hröðustu, en drífur styttra en flestir á sama verði.',
    ],
    facts: 'c7fa6e1af7cb',
  },
  'porsche-taycan-4-cross-turismo': {
    paragraphs: [
      'Porsche Taycan 4 Cross Turismo er fjórhjóladrifinn, drífur lengra en flestir og er meðal þeirra sem hlaða hraðast. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '9f546a2b1508',
  },
  'porsche-taycan-4s-cross-turismo': {
    paragraphs: [
      'Porsche Taycan 4s Cross Turismo er meðal sneggstu og aflmestu bílanna á listanum og meðal þeirra sem hlaða hraðast. Hann er meðal þeirra dýrustu.',
    ],
    facts: '1fb4116c9928',
  },
  'porsche-cayenne-base': {
    paragraphs: [
      'Porsche Cayenne er meðal þeirra langdrægustu, með 642 km, meðal þeirra sem hlaða hraðast og með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: 'cf6cf63f49ff',
  },
  'porsche-cayenne-coupe': {
    paragraphs: [
      'Porsche Cayenne Coupé er meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast, með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '0cb0768ad03b',
  },
  'porsche-cayenne-s': {
    paragraphs: [
      'Porsche Cayenne S er meðal þeirra langdrægustu, sneggstu og aflmestu á listanum, og meðal þeirra sem hlaða hraðast. Hann er meðal dýrustu bílanna.',
    ],
    facts: 'f7fef8adf379',
  },
  'porsche-cayenne-s-coupe': {
    paragraphs: [
      'Porsche Cayenne S Coupé er meðal þeirra langdrægustu, sneggstu og aflmestu, og hleður hraðast bíla á svipuðu verði. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '3bc29faea023',
  },
  'porsche-cayenne-turbo': {
    paragraphs: [
      'Porsche Cayenne Turbo er meðal sneggstu og aflmestu bílanna á listanum og meðal þeirra sem hlaða hraðast. Hann er meðal þeirra dýrustu.',
    ],
    facts: '2b4796e50c2d',
  },
  'porsche-cayenne-turbo-coupe': {
    paragraphs: [
      'Porsche Cayenne Turbo Coupé er meðal þeirra langdrægustu, sneggstu og aflmestu, og hleður hraðast bíla á svipuðu verði. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '9014f462f973',
  },
  'range-rover-electric-ev450': {
    paragraphs: [
      'Range Rover Electric EV450 er meðal dýrustu bílanna á listanum, með einni af stærstu rafhlöðunum. Miðað við bíla á svipuðu verði drífur hann styttra, hleður hægar og er meðal þeirra hægustu.',
    ],
    facts: '63eea6de20a1',
  },
  'range-rover-electric-ev550': {
    paragraphs: [
      'Range Rover Electric EV550 er meðal dýrustu og aflmestu bílanna á listanum, með einni af stærstu rafhlöðunum. Miðað við bíla á svipuðu verði drífur hann þó styttra og hleður hægar.',
    ],
    facts: '13532ee77e2d',
  },
  'renault-r5-e-tech-base': {
    paragraphs: [
      'Renault R5 E-Tech er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar best innanbæjar.',
    ],
    facts: 'b06357c2faa7',
  },
  'renault-r5-e-tech-52-kwh': {
    paragraphs: [
      'Renault R5 E-Tech 52 kWh er meðal ódýrustu bílanna á listanum og ódýrari á hvern km drægni en flestir. Hann drífur styttra og hleður hægar en flestir, svo hann hentar best í daglegan akstur.',
    ],
    facts: 'f4c28284f1ad',
  },
  'renault-scenic-e-tech-ev60': {
    paragraphs: [
      'Renault Scenic E-Tech EV60 er ódýrari en flestir en drífur styttra og hleður hægar en flestir, og er meðal þeirra hægustu og aflminnstu. Hann hentar þeim sem aka mest innanbæjar.',
    ],
    facts: 'ab64d748ee41',
  },
  'renault-scenic-e-tech-ev87': {
    paragraphs: [
      'Renault Scenic E-Tech EV87 er ódýrari en flestir en drífur lengra en flestir, með 623 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður þó hægar og er hægari og aflminni en flestir.',
    ],
    facts: '9f7930fde450',
  },
  'skoda-epiq-55': {
    paragraphs: [
      'Skoda Epiq 55 er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði hleður hann hraðar og er sneggri en flestir; hann er væntanlegur í lok árs 2026.',
    ],
    facts: '342d030ac555',
  },
  'skoda-elroq-85': {
    paragraphs: [
      'Skoda Elroq 85 er ódýrari en flestir en drífur lengra en flestir, með 579 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er í meðallagi að afli, sem gerir hann að jöfnum og hagkvæmum langferðabíl.',
    ],
    facts: 'cdb8705a8006',
  },
  'skoda-elroq-85x': {
    paragraphs: [
      'Skoda Elroq 85x er fjórhjóladrifinn, ódýrari en flestir og drífur lengra en flestir. Hann er meðal þeirra ódýrustu á hvern km drægni og hleður hraðar en flestir.',
    ],
    facts: 'c719f6deb32c',
  },
  'skoda-elroq-rs': {
    paragraphs: [
      'Skoda Elroq RS er fjórhjóladrifinn og drífur lengra en flestir, á verði í meðallagi. Í flestu öðru er hann í meðallagi, bæði á listanum og miðað við bíla á svipuðu verði.',
    ],
    facts: '3a2216243ce5',
  },
  'skoda-enyaq-85x': {
    paragraphs: [
      'Skoda Enyaq 85X er fjórhjóladrifinn og ódýrari á hvern km drægni en flestir, á verði í meðallagi. Hann er hægari en flestir og í meðallagi í hleðslu.',
    ],
    facts: 'b73614a0fcfa',
  },
  'skoda-enyaq-rs': {
    paragraphs: [
      'Skoda Enyaq RS er fjórhjóladrifinn og dýrari en flestir, en í meðallagi í nánast öllu sem tölurnar mæla. Hann er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '61fe07293d7e',
  },
  'skoda-peaq-90x': {
    paragraphs: [
      'Skoda Peaq 90x er sjö sæta og fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir. Hann er dýrari en flestir en meðal þeirra langdrægustu miðað við bíla á svipuðu verði.',
    ],
    facts: '21afaa17e1c0',
  },
  'smart-1-pro': {
    paragraphs: [
      'Smart #1 Pro+ er meðal ódýrustu bílanna og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði hleður hann hraðar og er sneggri og aflmeiri en flestir.',
    ],
    facts: '016d49710e84',
  },
  'smart-1-pulse': {
    paragraphs: [
      'Smart #1 Pulse er fjórhjóladrifinn, ódýrari en flestir og meðal þeirra sneggstu miðað við bíla á svipuðu verði. Hann drífur þó með þeim stystu og hleður hægar en flestir.',
    ],
    facts: 'e5fc8bd2bca4',
  },
  'smart-1-brabus': {
    paragraphs: [
      'Smart #1 Brabus er fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur þó með þeim stystu og hleður hægar en flestir.',
    ],
    facts: '8d172e94c45b',
  },
  'smart-3-pulse': {
    paragraphs: [
      'Smart #3 Pulse er fjórhjóladrifinn, ódýrari en flestir og sneggri og aflmeiri en flestir. Hann drífur styttra og hleður hægar en flestir.',
    ],
    facts: '46e9bd7690d3',
  },
  'smart-3-brabus': {
    paragraphs: [
      'Smart #3 Brabus er fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur styttra og hleður hægar en flestir, og er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '3488a9842ef7',
  },
  'smart-5-pro': {
    paragraphs: [
      'Smart #5 Pro er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði er hann sneggri og aflmeiri en flestir.',
    ],
    facts: '1936fc2f66b4',
  },
  'smart-5-pulse': {
    paragraphs: [
      'Smart #5 Pulse er fjórhjóladrifinn, meðal þeirra aflmestu og hleður hraðar en flestir, á verði í meðallagi. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu.',
    ],
    facts: '5b9493c3fb82',
  },
  'smart-5-brabus': {
    paragraphs: [
      'Smart #5 Brabus er aflmestur bíla á svipuðu verði og meðal þeirra sneggstu á listanum. Hann er dýrari en flestir og í meðallagi að drægni.',
    ],
    facts: '109f28eb6e6d',
  },
  'subaru-e-outback-base': {
    paragraphs: [
      'Subaru e-Outback er fjórhjóladrifinn, sneggri og aflmeiri en flestir, á verði í meðallagi. Drægni og hleðsla eru í meðallagi.',
    ],
    facts: 'bcbd199cf5d3',
  },
  'subaru-solterra-base': {
    paragraphs: [
      'Subaru Solterra er fjórhjóladrifinn og sneggri en flestir, á verði í meðallagi. Í drægni og hleðslu er hann í meðallagi.',
    ],
    facts: '6d5842d043cf',
  },
  'subaru-uncharted-base': {
    paragraphs: [
      'Subaru Uncharted er fjórhjóladrifinn, ódýrari en flestir og sneggri en flestir. Hann drífur styttra en flestir en er ódýrari á hvern km drægni en flestir.',
    ],
    facts: '1eaaf2ede3dd',
  },
  'suzuki-e-vitara-4x4-allgrip': {
    paragraphs: [
      'Suzuki e Vitara 4x4 AllGrip er fjórhjóladrifinn og ódýrari en flestir, en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar helst þeim sem þurfa fjórhjóladrif í styttri ferðir.',
    ],
    facts: 'bea361d053c6',
  },
  'tesla-model-3-afturhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Afturhjóladrif er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði er hann meðal þeirra langdrægustu, sneggstu og þeirra sem hlaða hraðast.',
    ],
    facts: '2c3162badba0',
  },
  'tesla-model-3-long-range-afturhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Long Range Afturhjóladrif er ódýrasti bíllinn á listanum á hvern km drægni og meðal þeirra langdrægustu, með 750 km. Hann hleður hraðar og er sneggri en flestir, svo fáir bílar gefa meira fyrir peninginn á langferðum.',
    ],
    facts: 'c5468e327177',
  },
  'tesla-model-3-long-range-fjorhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Long Range Fjórhjóladrif er fjórhjóladrifinn, meðal þeirra langdrægustu og meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er meðal þeirra sneggstu miðað við bíla á svipuðu verði.',
    ],
    facts: 'be21609500db',
  },
  'tesla-model-3-performance': {
    paragraphs: [
      'Tesla Model 3 Performance er sneggstur bíla á svipuðu verði og meðal þeirra aflmestu á listanum. Hann er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir.',
    ],
    facts: 'e44eb5acdb1f',
  },
  'tesla-model-y-standard-range': {
    paragraphs: [
      'Tesla Model Y Standard Range er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði drífur hann lengra og hleður hraðar en flestir.',
    ],
    facts: '06e706747800',
  },
  'tesla-model-y-premium-long-range': {
    paragraphs: [
      'Tesla Model Y Premium Long Range drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er meðal þeirra langdrægustu og ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '1289d1cfe509',
  },
  'tesla-model-y-long-range-dual-motor': {
    paragraphs: [
      'Tesla Model Y Long Range Dual Motor er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er meðal þeirra langdrægustu og aflmestu miðað við bíla á svipuðu verði.',
    ],
    facts: '896155cb97ac',
  },
  'tesla-model-y-performance': {
    paragraphs: [
      'Tesla Model Y Performance er meðal sneggstu og aflmestu bílanna á listanum, drífur lengra og hleður hraðar en flestir. Hann er dýrari en flestir.',
    ],
    facts: 'e1daa97e0890',
  },
  'toyota-bz4x-base': {
    paragraphs: [
      'Toyota bZ4X drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er framhjóladrifinn og hægari og aflminni en flestir.',
    ],
    facts: '7cd9ca563881',
  },
  'toyota-bz4x-awd': {
    paragraphs: [
      'Toyota bZ4X AWD er fjórhjóladrifinn og sneggri en flestir, en dýrari en flestir og í meðallagi að drægni og hleðslu.',
    ],
    facts: '02b79222e8e2',
  },
  'toyota-bz4x-touring-base': {
    paragraphs: [
      'Toyota bZ4X Touring drífur lengra en flestir og hleður hraðar en flestir bílar á svipuðu verði. Hann er dýrari en flestir og hægari og aflminni en flestir.',
    ],
    facts: '8bb7ebe6919e',
  },
  'toyota-bz4x-touring-awd': {
    paragraphs: [
      'Toyota bZ4X Touring AWD er fjórhjóladrifinn, sneggri og aflmeiri en flestir, en dýrari en flestir. Hann hleður hægar en flestir og er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: 'a8c51202d28b',
  },
  'toyota-c-hr-base': {
    paragraphs: [
      'Toyota C-HR+ er ódýrari en flestir en drífur styttra en flestir, með einni af minnstu rafhlöðunum, og er meðal þeirra aflminnstu.',
    ],
    facts: '5531228c8df7',
  },
  'toyota-c-hr-77-kwh': {
    paragraphs: [
      'Toyota C-HR+ 77 kWh drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er meðal þeirra langdrægustu miðað við bíla á svipuðu verði, en hægari og aflminni en flestir.',
    ],
    facts: 'bd8a692d9f91',
  },
  'toyota-c-hr-awd': {
    paragraphs: [
      'Toyota C-HR+ AWD er fjórhjóladrifinn og sneggri en flestir, en dýrari en flestir og hleður hægar en flestir. Hann er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '2238e45ba3be',
  },
  'toyota-proace-city-verso-base': {
    paragraphs: [
      'Toyota Proace City Verso er sjö sæta á verði í meðallagi, en meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir. Hann hentar helst sem rúmgóður bíll í styttri ferðir.',
    ],
    facts: '3f1e8ab027c9',
  },
  'toyota-proace-verso-base': {
    paragraphs: [
      'Toyota Proace Verso tekur níu manns en er dýrari en flestir og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin umfram allt.',
    ],
    facts: 'c29571193d89',
  },
  'toyota-urban-cruiser-active-fwd': {
    paragraphs: [
      'Toyota Urban Cruiser Active FWD er ódýrari en flestir en drífur styttra en flestir, hleður með þeim hægustu og er meðal þeirra aflminnstu. Hann hentar helst innanbæjar.',
    ],
    facts: '2ab0ce5c78d3',
  },
  'toyota-urban-cruiser-active-awd': {
    paragraphs: [
      'Toyota Urban Cruiser Active AWD er fjórhjóladrifinn og ódýrari en flestir, en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar þeim sem þurfa fjórhjóladrif í styttri ferðir.',
    ],
    facts: '8d86903dcae0',
  },
  'volkswagen-id-buzz-gtx': {
    paragraphs: [
      'Volkswagen ID. Buzz GTX er sjö sæta og fjórhjóladrifinn, með stærri rafhlöðu en flestir. Miðað við bíla á svipuðu verði drífur hann þó með þeim stystu og hleður hægar en flestir.',
    ],
    facts: 'e04c30bf06b7',
  },
  'volkswagen-id-polo-base': {
    paragraphs: [
      'Volkswagen ID. Polo er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu; hann er væntanlegur í lok árs 2026.',
    ],
    facts: '03a763b03e90',
  },
  'volkswagen-id-cross-base': {
    paragraphs: [
      'Volkswagen ID. Cross er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Hann drífur styttra en flestir, en hleður hraðar en flestir bílar á svipuðu verði.',
    ],
    facts: '2d5514eb86b4',
  },
  'volkswagen-id-3-pro': {
    paragraphs: [
      'Volkswagen ID.3 Pro er meðal ódýrustu bílanna og ódýrari á hvern km drægni en flestir. Hann drífur styttra og hleður hægar en flestir.',
    ],
    facts: 'c8a50e11cedd',
  },
  'volkswagen-id-3-neo-58-kwh': {
    paragraphs: [
      'Volkswagen ID.3 Neo 58 kWh er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði drífur hann lengra og hleður hraðar; hann er væntanlegur í lok árs 2026.',
    ],
    facts: '2c09d590ea1b',
  },
  'volkswagen-id-4-gtx': {
    paragraphs: [
      'Volkswagen ID.4 GTX er fjórhjóladrifinn og í meðallagi í öllu sem tölurnar mæla, bæði á listanum og miðað við bíla á svipuðu verði. Hann er jafn bíll án sérstakra styrkleika eða veikleika.',
    ],
    facts: 'f8ef07312565',
  },
  'volkswagen-id-4-pro-4motion': {
    paragraphs: [
      'Volkswagen ID.4 Pro 4MOTION er fjölskylduvænn jepplingur með fjórhjóladrifi sem hentar sérlega vel þeim sem þurfa traustan ferðabíl í misjöfnum íslenskum aðstæðum.',
      'Í sínum verðflokki drífur bíllinn lengra en flestir og er ódýrari á hvern kílómetra drægni en flestir rafbílar á landinu, sem skilar sér í mikilli drægni fyrir peninginn. Fjórhjóladrifið kemur sér vel í hálku og snjó, og 543 lítra farangursrýmið tekur léttilega við öllum hefðbundnum farangri.',
      'Aftur á móti hefur bíllinn ekkert framskott og má draga 1.200 kg. Hann er einnig aflminni en helstu keppinautar, með 140 kW minna afl en XPENG G6 AWD Performance sem er 100.000 kr. ódýrari. Þá er ID.4 9,1 km/mín hægari í hraðhleðslu en Hyundai IONIQ 5 Long Range AWD, sem bíður styttra við hleðslustöðvar á langferðum.',
      'Bíllinn er skynsamleg kaup fyrir þá sem leita að rúmgóðum og hagkvæmum rafbíl í daglegan akstur og vetrarferðir. Hann hentar síður þeim sem leggja mikla áherslu á hraðari hleðslutíma eða mikið afl.',
    ],
    facts: '36797869876d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volkswagen-id-7-gtx': {
    paragraphs: [
      'Volkswagen ID.7 GTX er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, og er með stærri rafhlöðu en flestir. Hann er dýrari en flestir.',
    ],
    facts: 'd474f0c3c7b0',
  },
  'volvo-ec40-recharge-twin': {
    paragraphs: [
      'Volvo EC40 Recharge Twin er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, og er sneggri og aflmeiri en flestir. Hann er dýrari en flestir.',
    ],
    facts: 'b841eafc303c',
  },
  'volvo-es90-twin-motor': {
    paragraphs: [
      'Volvo ES90 Twin Motor er meðal þeirra langdrægustu, með 679 km, og meðal þeirra sem hlaða hraðast. Hann er dýrari en flestir og væntanlegur í október 2026.',
    ],
    facts: 'e8d5bfbfc534',
  },
  'volvo-es90-twin-motor-performance': {
    paragraphs: [
      'Volvo ES90 Twin Motor Performance er meðal þeirra langdrægustu, sneggstu og aflmestu, og meðal þeirra sem hlaða hraðast. Hann er dýrari en flestir og væntanlegur í október 2026.',
    ],
    facts: 'a9ffdb239aff',
  },
  'volvo-ex40-recharge-twin': {
    paragraphs: [
      'Volvo EX40 Recharge Twin er fjórhjóladrifinn, sneggri og aflmeiri en flestir. Hann er dýrari en flestir og í meðallagi að drægni og hleðslu.',
    ],
    facts: 'd1ffd71a9079',
  },
  'volvo-ex30-single-motor': {
    paragraphs: [
      'Volvo EX30 Single Motor er ódýrari en flestir en meðal þeirra sem drífa styst, og meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði. Hann hentar helst innanbæjar.',
    ],
    facts: 'ec1af72432c1',
  },
  'volvo-ex30-single-motor-extended-range': {
    paragraphs: [
      'Volvo EX30 Single Motor Extended Range er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði hleður hann hraðar og er sneggri en flestir.',
    ],
    facts: '6e2b10982515',
  },
  'volvo-ex30-twin-motor-performance': {
    paragraphs: [
      'Volvo EX30 Twin Motor Performance er fjórhjóladrifinn og meðal þeirra sneggstu á listanum, ódýrari en flestir. Hann drífur þó styttra en flestir.',
    ],
    facts: '97bc940b349f',
  },
  'volvo-ex30-cross-country-twin-motor-performance': {
    paragraphs: [
      'Volvo EX30 Cross Country Twin Motor Performance er fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur styttra og hleður hægar en flestir, og er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '6cd2c213a721',
  },
  'volvo-ex60-p10': {
    paragraphs: [
      'Volvo EX60 P10 er stór og öflugur fjórhjóladrifinn jepplingur sem hentar vel fyrir fjölskyldur sem þurfa mikið rými og öruggan ferðabíl í öllum veðrum.',
      'Hann er meðal þeirra langdrægustu af rafbílum hér á landi og drífur lengra en flestir í sínum verðflokki, sem kemur sér vel í vetrarkulda milli landshluta. Hraðhleðslan er einnig meðal þeirra hröðustu á markaðnum og styttir stopp á langferðum. Fjórhjóladrifið, 523 lítra farangursrými og 2.400 kg dráttargeta gera hann auk þess afar færan í íslenskri vetrarfærð og við kerrudrátt.',
      'Á móti er bíllinn dýrari en flestir rafbílar og fær ekki styrk. Ef hámarksdrægni ræður öllu kemst Mercedes-Benz CLA Shooting Brake 350 4MATIC lengra, en miðað við hann er Volvo með 83 km minni drægni og er 4,6 km/mín hægari í hraðhleðslu. Ef kaupverðið vegur þyngra kemur Audi A6 e-tron Avant quattro til greina, en Volvo er 100.000 kr. dýrari en hann.',
      'Þetta eru góð kaup fyrir þá sem vilja mikinn dráttarkraft, gott skott og áreiðanlegan ferðabíl fyrir erfiðari aðstæður, en síður fyrir þá sem horfa stíft í verðið eða vilja fremur lægri langbak.',
    ],
    facts: '1b9f59dc3cc3',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volvo-ex60-p12': {
    paragraphs: [
      'Volvo EX60 P12 drífur lengst bíla á svipuðu verði, 810 km, og hefur stærstu rafhlöðuna í þeim hópi. Hann er líka meðal þeirra sneggstu, aflmestu og þeirra sem hlaða hraðast.',
    ],
    facts: 'fac3ee690a38',
  },
  'volvo-ex90-twin-motor': {
    paragraphs: [
      'Volvo EX90 Twin Motor er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum og drífur lengra en flestir. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '2319bd70711d',
  },
  'volvo-ex90-twin-motor-performance': {
    paragraphs: [
      'Volvo EX90 Twin Motor Performance er sjö sæta, fjórhjóladrifinn og sneggri og aflmeiri en flestir, með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '95fd09c57aad',
  },
  'xpeng-g6-rwd-standard-range': {
    paragraphs: [
      'XPENG G6 RWD Standard Range er ódýrari en flestir og hleður hraðar en flestir, með þeim hröðustu miðað við bíla á svipuðu verði. Hann drífur þó styttra en flestir.',
    ],
    facts: '0271068dee0c',
  },
  'xpeng-g6-rwd-long-range': {
    paragraphs: [
      'XPENG G6 RWD Long Range er ódýrari en flestir, drífur lengra en flestir og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er með stærri rafhlöðu en flestir.',
    ],
    facts: '09dc60519783',
  },
  'xpeng-g6-awd-performance': {
    paragraphs: [
      'XPENG G6 AWD Performance er fjórhjóladrifinn, ódýrari en flestir og meðal þeirra sneggstu á listanum. Hann drífur lengra og hleður hraðar en flestir, sem gerir hann að miklum bíl fyrir peninginn.',
    ],
    facts: '020d14ba8ec7',
  },
  'xpeng-g9-awd-performance': {
    paragraphs: [
      'XPENG G9 AWD Performance er fjórhjóladrifinn, meðal þeirra sem hlaða hraðast og sneggri og aflmeiri en flestir. Hann er dýrari en flestir og drífur styttra en flestir bílar á svipuðu verði.',
    ],
    facts: 'd87ad9f4eccd',
  },
  'xpeng-x9-awd-performance': {
    paragraphs: [
      'XPENG X9 AWD Performance er sjö sæta og hleður hraðast allra bíla á listanum, með einni af stærstu rafhlöðunum. Hann er dýrari en flestir og drífur styttra en flestir bílar á svipuðu verði.',
    ],
    facts: 'c0b306738cce',
  },
}

export default carReviews
