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
    facts: 'bac88b383353',
  },
  'audi-a6-e-tron-avant-quattro': {
    paragraphs: [
      'Audi A6 e-tron Avant quattro er dýrari en flestir en meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast. Með fjórhjóladrifi og meira afli en flestir hentar hann þeim sem vilja langferðabíl og eru tilbúnir að borga fyrir hann.',
    ],
    facts: 'e34864c1bbf6',
  },
  'audi-e-tron-gt-quattro': {
    paragraphs: [
      'Audi e-tron GT quattro er meðal dýrustu bílanna á listanum og meðal þeirra sneggstu og aflmestu. Drægnin er hins vegar styttri en hjá flestum bílum á svipuðu verði, svo hann er fyrir þá sem setja aksturinn sjálfan ofar langferðum og verði.',
    ],
    facts: '8b76a6e071d1',
  },
  'audi-q4-e-tron-45-quattro': {
    paragraphs: [
      'Audi Q4 e-tron 45 quattro er fjórhjóladrifinn og dýrari en flestir, en drífur styttra og hleður hægar en flestir bílar á svipuðu verði. Hann er í meðallagi í flestu öðru, svo hann borgar sig helst fyrir þá sem vilja Audi umfram allt.',
    ],
    facts: '310a20f7f852',
  },
  'audi-q6-e-tron-base': {
    paragraphs: [
      'Audi Q6 e-tron er meðal þeirra langdrægustu á listanum, með 625 km, og hleður hraðar en flestir. Hann er fjórhjóladrifinn og dýrari en flestir, og í meðallagi miðað við bíla á svipuðu verði, svo valið stendur helst um merkið og þægindin.',
    ],
    facts: '112a76ba82d3',
  },
  'audi-q6-e-tron-sportback': {
    paragraphs: [
      'Audi Q6 e-tron Sportback er meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast, með fjórhjóladrif og meira afl en flestir. Hann er dýrari en flestir og í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: '8e95eba3fccb',
  },
  'audi-sq6-e-tron-base': {
    paragraphs: [
      'Audi SQ6 e-tron er meðal dýrustu bílanna á listanum, sneggri og aflmeiri en flestir og drífur lengra en flestir. Verð á hvern km drægni er þó meðal þess hæsta, svo hann er fyrir þá sem vilja afl og eru ekki að spara.',
    ],
    facts: '471f7f24c048',
  },
  'bmw-i4-40-xdrive': {
    paragraphs: [
      'BMW i4 40 xDrive er fjórhjóladrifinn og sneggri en flestir, og hleður hraðar en flestir á listanum. Miðað við bíla á svipuðu verði drífur hann þó styttra og rafhlaðan er með þeim minnstu.',
    ],
    facts: '974fc7fccd12',
  },
  'bmw-i4-m60-xdrive': {
    paragraphs: [
      'BMW i4 M60 xDrive er meðal sneggstu og aflmestu bílanna á listanum, líka miðað við bíla á svipuðu verði. Hann er dýr og drífur styttra en flestir á sama verði, svo hann er fyrst og fremst fyrir þá sem vilja akstursánægju.',
    ],
    facts: '1ecce778f46d',
  },
  'bmw-i5-edrive40': {
    paragraphs: [
      'BMW i5 eDrive40 er afturhjóladrifinn og drífur lengra en flestir, en er dýrari en flestir og hleður hægar en flestir bílar á svipuðu verði. Hann er í meðallagi að afli og hröðun.',
    ],
    facts: '7cd232e53ef8',
  },
  'bmw-i5-m60-xdrive': {
    paragraphs: [
      'BMW i5 M60 xDrive er meðal dýrustu, sneggstu og aflmestu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann þó með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: 'b7b473c10aa9',
  },
  'bmw-ix-xdrive-45-sport': {
    paragraphs: [
      'BMW iX xDrive 45 Sport er meðal dýrustu bílanna á listanum, fjórhjóladrifinn og drífur lengra en flestir. Miðað við bíla á svipuðu verði er hann þó aflminni og hleður hægar en flestir.',
    ],
    facts: '640ced4a5489',
  },
  'bmw-ix-xdrive-60-sport': {
    paragraphs: [
      'BMW iX xDrive 60 Sport er meðal þeirra langdrægustu, með 701 km, og með einni af stærstu rafhlöðunum á listanum. Hann er dýr, en meðal þeirra ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '2e406d25ce74',
  },
  'bmw-ix1-edrive-20': {
    paragraphs: [
      'BMW iX1 eDrive 20 er ódýrari en flestir og ódýrari á hvern km drægni en flestir, með drægni í meðallagi. Hann er hægari og aflminni en flestir og framhjóladrifinn, svo hann hentar best í rólegan daglegan akstur.',
    ],
    facts: '198cceb137fc',
  },
  'bmw-ix1-xdrive-30': {
    paragraphs: [
      'BMW iX1 xDrive 30 er fjórhjóladrifinn og í meðallagi að verði, en drífur styttra og hleður hægar en flestir. Rafhlaðan er með þeim minnstu miðað við bíla á svipuðu verði, sem kemur niður á langferðum.',
    ],
    facts: '8231c7efc24c',
  },
  'bmw-ix3-40': {
    paragraphs: [
      'BMW iX3 40 er meðal þeirra langdrægustu, með 637 km, og meðal þeirra sem hlaða hraðast. Hann er afturhjóladrifinn og dýrari en flestir, en ódýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '5886e5cd60c6',
  },
  'bmw-ix3-50-xdrive': {
    paragraphs: [
      'BMW iX3 50 xDrive er meðal þeirra langdrægustu á listanum, með 805 km, og meðal þeirra sem hlaða hraðast. Hann er fjórhjóladrifinn og dýrari en flestir, en meðal þeirra ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '59ad065b2922',
  },
  'byd-dolphin-base': {
    paragraphs: [
      'BYD Dolphin er meðal ódýrustu bílanna á listanum og meðal þeirra ódýrustu á hvern km drægni. Hann hleður þó með þeim hægustu, svo hann hentar best í innanbæjarakstur og styttri ferðir.',
    ],
    facts: 'f88411a480ec',
  },
  'byd-seal-base': {
    paragraphs: [
      'BYD Seal er fjórhjóladrifinn og meðal þeirra sneggstu og aflmestu á listanum, á verði í meðallagi. Drægnin er í meðallagi og hann hleður hægar en flestir, sem skiptir máli á langferðum.',
    ],
    facts: 'ab40c226107c',
  },
  'byd-seal-u-base': {
    paragraphs: [
      'BYD Seal U er ódýrari en flestir og með stærri rafhlöðu en flestir, en hleður með þeim hægustu og er meðal þeirra hægustu í hröðun. Hann hentar þeim sem vilja mikið fyrir peninginn og aka rólega.',
    ],
    facts: 'ba899643f2b0',
  },
  'byd-sealion-7-base': {
    paragraphs: [
      'BYD Sealion 7 er fjórhjóladrifinn, meðal þeirra aflmestu og hleður hraðar en flestir. Drægnin er þó í meðallagi og hann er dýrari á hvern km drægni en flestir.',
    ],
    facts: '019c6db6c59c',
  },
  'byd-tang-flagship': {
    paragraphs: [
      'BYD Tang Flagship er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum á listanum. Hann er dýrari en flestir og hleður með þeim hægustu, sem er galli á langferðum.',
    ],
    facts: '0c340b013e84',
  },
  'citroen-e-c4-base': {
    paragraphs: [
      'Citroën ë-C4 er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Hann er hins vegar meðal þeirra hægustu og aflminnstu, drífur styttra og hleður hægar en flestir, svo hann hentar helst í daglegan akstur.',
    ],
    facts: '155df9ecf460',
  },
  'fiat-500e-base': {
    paragraphs: [
      'Fiat 500e er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst, með 305 km, og hleður með þeim hægustu. Hann er fjögurra sæta og hentar best sem innanbæjarbíll.',
    ],
    facts: 'c42fb69990fd',
  },
  'fiat-600e-base': {
    paragraphs: [
      'Fiat 600e er ódýrari en flestir en meðal þeirra sem drífa styst og meðal þeirra hægustu og aflminnstu. Hann hentar best í daglegan akstur innanbæjar.',
    ],
    facts: '4f3eb0246974',
  },
  'ford-capri-base': {
    paragraphs: [
      'Ford Capri er fjórhjóladrifinn og drífur lengra en flestir, á verði í meðallagi. Miðað við bíla á svipuðu verði er hann meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast, sem gerir hann að sterkum kosti á langferðum.',
    ],
    facts: '494be38819a8',
  },
  'ford-explorer-er-awd': {
    paragraphs: [
      'Ford Explorer ER AWD er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er ódýrari á hvern km drægni en flestir og traustur kostur fyrir íslenskar aðstæður.',
    ],
    facts: 'd006eb9f898a',
  },
  'ford-mustang-mach-e-lr-awd': {
    paragraphs: [
      'Ford Mustang Mach-E LR AWD er fjórhjóladrifinn og drífur lengra en flestir, með einni af stærstu rafhlöðunum miðað við bíla á svipuðu verði. Hann hleður þó hægar en flestir, sem lengir hleðslustoppin á langferðum.',
    ],
    facts: '97b58e997fe5',
  },
  'ford-puma-base': {
    paragraphs: [
      'Ford Puma er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og aflminnstu. Miðað við bíla á svipuðu verði hleður hann þó hraðar en flestir.',
    ],
    facts: '51eb4afe222f',
  },
  'hongqi-ehs5-base': {
    paragraphs: [
      'Hongqi EHS5 er ódýrari en flestir en fjórhjóladrifinn og meðal þeirra sneggstu og aflmestu. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu, sem gerir hann að miklum bíl fyrir peninginn.',
    ],
    facts: '91bc38132fd5',
  },
  'hongqi-ehs7-premium': {
    paragraphs: [
      'Hongqi EHS7 Premium er fjórhjóladrifinn, meðal þeirra aflmestu og sneggstu, og með stærstu rafhlöðuna miðað við bíla á svipuðu verði. Drægnin er þó í meðallagi og hann er dýrari á hvern km drægni en flestir á sama verði.',
    ],
    facts: 'fa8143757f2a',
  },
  'hyundai-inster-base': {
    paragraphs: [
      'Hyundai INSTER er meðal ódýrustu bílanna á listanum og meðal þeirra ódýrustu á hvern km drægni. Hann drífur þó með þeim stystu, hleður hægt og er aflminni en flestir, svo hann hentar best innanbæjar.',
    ],
    facts: 'c91c2679efa9',
  },
  'hyundai-inster-long-range': {
    paragraphs: [
      'Hyundai INSTER Long Range er meðal ódýrustu bílanna á listanum og ódýrari á hvern km drægni en flestir. Drægnin er samt með þeirri stystu og hann hleður hægt, svo hann er helst borgarbíll.',
    ],
    facts: 'e9e22c68ae4b',
  },
  'hyundai-ioniq-3-standard-range': {
    paragraphs: [
      'Hyundai IONIQ 3 Standard Range er meðal ódýrustu bílanna en meðal þeirra sem drífa styst og hleður með þeim hægustu. Hann er væntanlegur í lok árs 2026 og hentar helst í innanbæjarakstur.',
    ],
    facts: 'eb72f9008119',
  },
  'hyundai-ioniq-3-long-range': {
    paragraphs: [
      'Hyundai IONIQ 3 Long Range er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni, með 496 km. Hann er þó meðal þeirra hægustu og aflminnstu, og væntanlegur í lok árs 2026.',
    ],
    facts: '80d730f7f5b7',
  },
  'hyundai-ioniq-5-long-range-awd': {
    paragraphs: [
      'Hyundai IONIQ 5 Long Range AWD er fjórhjóladrifinn og meðal þeirra sem hlaða hraðast á listanum, sá hraðasti miðað við bíla á svipuðu verði. Hann drífur lengra en flestir á sama verði og er ódýrari á hvern km drægni en flestir.',
    ],
    facts: 'fbf0acb72d06',
  },
  'hyundai-ioniq-9-long-range-awd': {
    paragraphs: [
      'Hyundai IONIQ 9 Long Range AWD er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum og drífur lengra en flestir. Hann er dýrari en flestir og hægari en flestir í hröðun.',
    ],
    facts: '6835bf66f695',
  },
  'hyundai-ioniq-9-long-range-performance-awd': {
    paragraphs: [
      'Hyundai IONIQ 9 Long Range Performance AWD er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum og meira afl en flestir. Hann er dýrari en flestir og í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: 'ebfffbbaac0c',
  },
  'hyundai-kona-electric-65-kwh': {
    paragraphs: [
      'Hyundai Kona Electric 65 kWh er ódýrari en flestir og meðal þeirra ódýrustu á hvern km drægni. Hann drífur lengra en flestir bílar á svipuðu verði en hleður hægar en flestir.',
    ],
    facts: '42b0f2752808',
  },
  'hyundai-staria-electric-base': {
    paragraphs: [
      'Hyundai STARIA Electric tekur níu manns, á verði í meðallagi. Hann er þó meðal þeirra sem drífa styst og meðal þeirra hægustu, og væntanlegur í lok árs 2026.',
    ],
    facts: '7c2557b1c2f5',
  },
  'jeep-avenger-base': {
    paragraphs: [
      'Jeep Avenger er ódýrari en flestir en meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir. Hann hentar helst sem bíll í daglegan akstur innanbæjar.',
    ],
    facts: '5bab78708f5c',
  },
  'kgm-musso-ev-base': {
    paragraphs: [
      'KGM Musso EV er ódýrari en flestir og með stærri rafhlöðu en flestir. Hann hleður þó með þeim hægustu og er meðal þeirra hægustu í hröðun.',
    ],
    facts: 'a7e2c8ebd888',
  },
  'kgm-musso-ev-4wd': {
    paragraphs: [
      'KGM Musso EV 4WD er fjórhjóladrifinn en meðal þeirra sem drífa styst og hlaða hægast. Hann er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '47bac64a85af',
  },
  'kgm-torres-evx': {
    paragraphs: [
      'KGM Torres EVX er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Hann er þó hægari, aflminni og hleður hægar en flestir.',
    ],
    facts: 'd8bd756a5bf0',
  },
  'kia-ev2-standard-range': {
    paragraphs: [
      'Kia EV2 Standard Range er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar best sem innanbæjarbíll.',
    ],
    facts: '6abb9071fc07',
  },
  'kia-ev2-long-range': {
    paragraphs: [
      'Kia EV2 Long Range er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur lengra en flestir bílar á svipuðu verði en er meðal þeirra hægustu og aflminnstu.',
    ],
    facts: '4daa1ff9ad7a',
  },
  'kia-ev3-standard-range': {
    paragraphs: [
      'Kia EV3 Standard Range er meðal ódýrustu bílanna á listanum og ódýrari á hvern km drægni en flestir. Hann drífur styttra og hleður hægar en flestir, en er í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: '6cbd7cacf976',
  },
  'kia-ev3-long-range': {
    paragraphs: [
      'Kia EV3 Long Range er ódýrari en flestir en drífur lengra en flestir, með 605 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er aflminni en flestir, svo hann er hagkvæmur langferðabíll fyrir þá sem þurfa ekki fjórhjóladrif.',
    ],
    facts: '74609f0dbd55',
  },
  'kia-ev3-long-range-awd': {
    paragraphs: [
      'Kia EV3 Long Range AWD er fjórhjóladrifinn, ódýrari en flestir og drífur lengra en flestir. Hann er ódýrari á hvern km drægni en flestir og hleður hraðar en flestir bílar á svipuðu verði.',
    ],
    facts: 'ea5c9ca67957',
  },
  'kia-ev4-base': {
    paragraphs: [
      'Kia EV4 er meðal þeirra langdrægustu, með 625 km, og meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir en er hægari og aflminni en flestir.',
    ],
    facts: 'a5030843ee82',
  },
  'kia-ev4-fastback': {
    paragraphs: [
      'Kia EV4 Fastback er ódýrari en flestir, drífur lengra en flestir og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir en er hægari og aflminni en flestir.',
    ],
    facts: '20227d21fb30',
  },
  'kia-ev5-base': {
    paragraphs: [
      'Kia EV5 er í meðallagi að verði, drægni og hleðslu. Hann er hægari og aflminni en flestir og framhjóladrifinn, svo hann er fyrir þá sem aka rólega.',
    ],
    facts: 'e6eb4cdc0791',
  },
  'kia-ev5-awd': {
    paragraphs: [
      'Kia EV5 AWD er fjórhjóladrifinn og í meðallagi að verði, en drífur styttra og hleður hægar en flestir. Hann er líka hægari og aflminni en flestir.',
    ],
    facts: 'e515c3c2ff76',
  },
  'kia-ev6-2025-long-range-awd': {
    paragraphs: [
      'Kia EV6 2025 Long Range AWD er fjórhjóladrifinn og meðal þeirra sem hlaða hraðast, á verði í meðallagi. Hann er sneggri en flestir og ódýrari á hvern km drægni en flestir.',
    ],
    facts: '7240d71d4cec',
  },
  'kia-ev9-base': {
    paragraphs: [
      'Kia EV9 er sjö sæta og fjórhjóladrifinn, með stærri rafhlöðu en flestir og hleður hraðar en flestir. Hann er dýrari en flestir og drífur styttra en flestir bílar á svipuðu verði.',
    ],
    facts: 'a2e85e4c702d',
  },
  'kia-ev9-gt': {
    paragraphs: [
      'Kia EV9 GT er sjö sæta, fjórhjóladrifinn og sneggri og aflmeiri en flestir. Hann er meðal dýrustu bílanna og drífur með þeim stystu miðað við bíla á svipuðu verði.',
    ],
    facts: 'f3b7dd248332',
  },
  'kia-pv5-base': {
    paragraphs: [
      'Kia PV5 er sjö sæta og afturhjóladrifinn, á verði í meðallagi. Hann er meðal þeirra hægustu og aflminnstu og drífur styttra en flestir.',
    ],
    facts: '1f5e9d2192d8',
  },
  'leapmotor-t03-base': {
    paragraphs: [
      'Leapmotor T03 er ódýrasti bíllinn á listanum og meðal þeirra ódýrustu á hvern km drægni. Hann er fjögurra sæta, drífur með þeim stystu og hleður hægt, svo hann er eingöngu borgarbíll.',
    ],
    facts: '3ac3cdf8fd4b',
  },
  'leapmotor-b03x-pro': {
    paragraphs: [
      'Leapmotor B03X Pro er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst. Hann er væntanlegur í lok árs 2026 og hentar helst innanbæjar.',
    ],
    facts: '3e78783dee18',
  },
  'leapmotor-b03x-promax': {
    paragraphs: [
      'Leapmotor B03X ProMax er meðal ódýrustu bílanna og drífur lengra en flestir bílar á svipuðu verði. Miðað við þá hleður hann líka með þeim hröðustu; hann er væntanlegur í lok árs 2026.',
    ],
    facts: '56cd5dff39c5',
  },
  'leapmotor-b05-pro': {
    paragraphs: [
      'Leapmotor B05 Pro er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og er meðal þeirra sneggstu; hann er væntanlegur í lok árs 2026.',
    ],
    facts: '35abbd6181b7',
  },
  'leapmotor-b05-promax': {
    paragraphs: [
      'Leapmotor B05 ProMax er meðal ódýrustu bílanna og drífur lengst, hleður hraðast og er sneggstur bíla á svipuðu verði. Hann er væntanlegur í lok árs 2026.',
    ],
    facts: '8cba272746f9',
  },
  'leapmotor-b10-base': {
    paragraphs: [
      'Leapmotor B10 er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur með þeim stystu á listanum en hleður hraðar en flestir bílar á svipuðu verði.',
    ],
    facts: '10ba95b5fec0',
  },
  'leapmotor-b10-67-1-kwh': {
    paragraphs: [
      'Leapmotor B10 67.1 kWh er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu.',
    ],
    facts: '60bb3d4f6c3f',
  },
  'leapmotor-c10-pro': {
    paragraphs: [
      'Leapmotor C10 Pro er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur styttra og hleður hægar en flestir.',
    ],
    facts: 'c4b064ef1347',
  },
  'leapmotor-c10-promax': {
    paragraphs: [
      'Leapmotor C10 ProMax er ódýrari en flestir og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og er meðal þeirra aflmestu.',
    ],
    facts: 'd3a65aee3c92',
  },
  'leapmotor-c10-promax-awd': {
    paragraphs: [
      'Leapmotor C10 ProMax AWD er fjórhjóladrifinn, ódýrari en flestir og meðal þeirra sneggstu og aflmestu. Hann drífur þó styttra og hleður hægar en flestir.',
    ],
    facts: '905e481ae04a',
  },
  'lexus-es-350e': {
    paragraphs: [
      'Lexus ES 350e er framhjóladrifinn og drífur lengra en flestir, en er dýrari en flestir. Miðað við bíla á svipuðu verði er hann meðal þeirra hægustu og aflminnstu.',
    ],
    facts: 'df1eb1df334c',
  },
  'lexus-es-500e': {
    paragraphs: [
      'Lexus ES 500e er fjórhjóladrifinn og meðal dýrustu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann styttra og hleður með þeim hægustu.',
    ],
    facts: '67adbc0b50a6',
  },
  'lexus-rz-350e': {
    paragraphs: [
      'Lexus RZ 350e er framhjóladrifinn og drífur lengra en flestir, en er dýrari en flestir. Miðað við bíla á svipuðu verði drífur hann styttra og er meðal þeirra hægustu og aflminnstu.',
    ],
    facts: 'a78028e18d18',
  },
  'lexus-rz-500e': {
    paragraphs: [
      'Lexus RZ 500e er fjórhjóladrifinn og sneggri en flestir, en dýrari en flestir og meðal þeirra dýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: '258433e29e04',
  },
  'lexus-rz-550e-f-sport': {
    paragraphs: [
      'Lexus RZ 550e F SPORT er meðal dýrustu bílanna á listanum, fjórhjóladrifinn og sneggri en flestir. Miðað við bíla á svipuðu verði drífur hann þó með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: '76efeff4d0e0',
  },
  'lexus-ux-300e': {
    paragraphs: [
      'Lexus UX 300e er dýrari en flestir en drífur styttra, hleður með þeim hægustu og er hægari og aflminni en flestir. Miðað við bíla á svipuðu verði gefur hann eftir í flestu sem tölurnar mæla.',
    ],
    facts: 'a7eccce1df84',
  },
  'mazda-6e-long-range': {
    paragraphs: [
      'Mazda 6e Long Range er ódýrari en flestir en drífur lengra en flestir, með 552 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður þó með þeim hægustu á listanum, sem lengir stoppin á langferðum.',
    ],
    facts: 'ef9f3ae56312',
  },
  'mazda-cx-6e-78-kwh': {
    paragraphs: [
      'Mazda CX-6e 78 kWh er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði hleður hann hraðar en flestir, en er hægari en flestir; hann er væntanlegur haustið 2026.',
    ],
    facts: 'db53eaadfcc5',
  },
  'mercedes-benz-c-400-4matic': {
    paragraphs: [
      'Mercedes-Benz C 400 4MATIC er meðal þeirra langdrægustu á listanum, með 762 km, meðal þeirra sem hlaða hraðast og meðal þeirra sneggstu. Hann er dýrari en flestir, en ódýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '30edea4d1883',
  },
  'mercedes-benz-cla-200': {
    paragraphs: [
      'Mercedes-Benz CLA 200 er á verði í meðallagi og hleður hraðar en flestir, með þeim hröðustu miðað við bíla á svipuðu verði. Hann er þó hægari og aflminni en flestir og með minni rafhlöðu.',
    ],
    facts: '9cde7716deaa',
  },
  'mercedes-benz-cla-350-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA 350 4MATIC er meðal þeirra langdrægustu á listanum, með 770 km, og meðal þeirra sem hlaða hraðast. Hann er ódýrastur bíla á svipuðu verði á hvern km drægni, sem gerir hann að einum besta langferðabílnum í sínum verðflokki.',
    ],
    facts: '27514912609c',
  },
  'mercedes-benz-cla-shooting-brake-350-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA Shooting Brake 350 4MATIC er meðal þeirra langdrægustu, með 743 km, og meðal þeirra sem hlaða hraðast. Hann er dýrari en flestir en meðal þeirra ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '41b6c877e07f',
  },
  'mercedes-benz-cla-amg-45-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA AMG 45 4MATIC+ er sneggstur bíla á svipuðu verði og meðal þeirra aflmestu, en líka meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast. Hann er fjögurra sæta og dýrari en flestir.',
    ],
    facts: '74b2430318c1',
  },
  'mercedes-benz-eqa-suv-300-4matic': {
    paragraphs: [
      'Mercedes-Benz EQA SUV 300 4MATIC er fjórhjóladrifinn og á verði í meðallagi, en drífur styttra, hleður hægar og er hægari og aflminni en flestir. Miðað við bíla á svipuðu verði hleður hann með þeim hægustu.',
    ],
    facts: 'db2813bb8f18',
  },
  'mercedes-benz-glb-350-4matic-eq': {
    paragraphs: [
      'Mercedes-Benz GLB 350 4MATIC EQ er sjö sæta og fjórhjóladrifinn, meðal þeirra sem hlaða hraðast og drífur lengra en flestir. Hann er dýrari en flestir en meðal þeirra langdrægustu miðað við bíla á svipuðu verði.',
    ],
    facts: 'e67db6e1a63b',
  },
  'mercedes-benz-glc-300-4matic': {
    paragraphs: [
      'Mercedes-Benz GLC 300 4MATIC er fjórhjóladrifinn, drífur lengra en flestir og hleður hraðar en flestir. Hann er dýrari en flestir og í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: 'ca734c7abe96',
  },
  'mercedes-benz-glc-400-4matic': {
    paragraphs: [
      'Mercedes-Benz GLC 400 4MATIC er meðal þeirra langdrægustu, með 715 km, og meðal þeirra sem hlaða hraðast. Hann er fjórhjóladrifinn, sneggri og aflmeiri en flestir og dýrari en flestir.',
    ],
    facts: '4fb9818faa2c',
  },
  'mercedes-benz-eqe-suv-350-4matic': {
    paragraphs: [
      'Mercedes-Benz EQE SUV 350 4MATIC er meðal dýrustu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann styttra, hleður með þeim hægustu og er meðal þeirra hægustu og aflminnstu.',
    ],
    facts: '5900fd1b9f9c',
  },
  'mercedes-benz-eqs-580-4matic': {
    paragraphs: [
      'Mercedes-Benz EQS 580 4MATIC drífur lengst allra bíla á listanum, 869 km, og hefur stærstu rafhlöðuna. Hann er meðal dýrustu bílanna en ódýrastur á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: 'e1e440baa759',
  },
  'mercedes-benz-eqs-suv-580-4matic': {
    paragraphs: [
      'Mercedes-Benz EQS SUV 580 4MATIC er sjö sæta, meðal þeirra langdrægustu og meðal þeirra aflmestu á listanum. Miðað við bíla á svipuðu verði hleður hann þó með þeim hægustu.',
    ],
    facts: '7ccd7690a52f',
  },
  'mercedes-benz-eqt-200': {
    paragraphs: [
      'Mercedes-Benz EQT 200 er sjö sæta á verði í meðallagi, en meðal þeirra sem drífa styst, hlaða hægast og eru hægastir. Hann hentar helst sem rúmgóður bíll í styttri ferðir.',
    ],
    facts: '816ec6e77906',
  },
  'mercedes-benz-eqv-300': {
    paragraphs: [
      'Mercedes-Benz EQV 300 tekur átta manns en er meðal dýrustu bílanna á listanum og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin umfram allt.',
    ],
    facts: 'cfad53aa00bd',
  },
  'mercedes-benz-vle-300': {
    paragraphs: [
      'Mercedes-Benz VLE 300 er átta sæta og meðal þeirra langdrægustu, með 713 km, og með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna og meðal þeirra hægustu, og væntanlegur árið 2027.',
    ],
    facts: 'a6669ffac6ed',
  },
  'mercedes-benz-vle-400-4matic': {
    paragraphs: [
      'Mercedes-Benz VLE 400 4MATIC er átta sæta og fjórhjóladrifinn, meðal þeirra langdrægustu og með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum og væntanlegur árið 2027.',
    ],
    facts: 'ad4cd7f9d7d4',
  },
  'mercedes-benz-g-class-580-eq': {
    paragraphs: [
      'Mercedes-Benz G-class 580 EQ er meðal dýrustu og aflmestu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: 'ff6645f346c8',
  },
  'mercedes-benz-evito-tourer': {
    paragraphs: [
      'Mercedes-Benz eVito Tourer tekur níu manns en er dýrari en flestir og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin.',
    ],
    facts: 'b26a86b4d23a',
  },
  'mg-cyberster-gt': {
    paragraphs: [
      'MG Cyberster GT er tveggja sæta, fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur styttra og hleður með þeim hægustu, svo hann er bíll fyrir aksturinn fremur en langferðir.',
    ],
    facts: '4803a40676c9',
  },
  'mg-mg4-urban-standard-range': {
    paragraphs: [
      'MG MG4 Urban Standard Range er meðal ódýrustu bílanna á listanum og meðal þeirra ódýrustu á hvern km drægni. Hann drífur þó með þeim stystu og hleður hægt, svo hann hentar best innanbæjar.',
    ],
    facts: 'fa00102fdf41',
  },
  'mg-mg4-urban-long-range': {
    paragraphs: [
      'MG MG4 Urban Long Range er meðal ódýrustu bílanna og meðal þeirra langdrægustu miðað við bíla á svipuðu verði. Hann er þó meðal þeirra hægustu og aflminnstu á listanum.',
    ],
    facts: 'c26eff8a8a32',
  },
  'mg-mgs5-lux': {
    paragraphs: [
      'MG MGS5 LUX er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði drífur hann lengra, hleður hraðar og er sneggri en flestir.',
    ],
    facts: 'be4634ebed07',
  },
  'mg-mgs6-dual-motor': {
    paragraphs: [
      'MG MGS6 Dual Motor er fjórhjóladrifinn, ódýrari en flestir og sneggri og aflmeiri en flestir. Hann drífur þó styttra og hleður hægar en flestir.',
    ],
    facts: '1dbdc5d6315b',
  },
  'mini-aceman-e': {
    paragraphs: [
      'Mini Aceman E er ódýrari en flestir en meðal þeirra sem drífa styst og hlaða hægast, og meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði. Hann hentar helst innanbæjar.',
    ],
    facts: '9236b5f0861a',
  },
  'mini-countryman-e': {
    paragraphs: [
      'Mini Countryman E er á verði í meðallagi en drífur styttra, hleður hægar og er meðal þeirra hægustu. Miðað við bíla á svipuðu verði er hann með einni af minnstu rafhlöðunum.',
    ],
    facts: '1df5d9a06454',
  },
  'mini-countryman-se-4x4': {
    paragraphs: [
      'Mini Countryman SE 4x4 er fjórhjóladrifinn og á verði í meðallagi, en drífur styttra og hleður hægar en flestir. Hann er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '0b8779b7f2b9',
  },
  'nissan-ariya-base': {
    paragraphs: [
      'Nissan Ariya er á verði í meðallagi, með stærri rafhlöðu en flestir og ódýrari á hvern km drægni en flestir. Hann hleður þó hægar og er hægari og aflminni en flestir.',
    ],
    facts: '6c91849b667e',
  },
  'nissan-ariya-e-4orce': {
    paragraphs: [
      'Nissan Ariya e-4ORCE er fjórhjóladrifinn og með stærri rafhlöðu en flestir, en hleður með þeim hægustu og drífur styttra en flestir. Hann er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '2b893c5c4d9e',
  },
  'nissan-leaf-standard-range': {
    paragraphs: [
      'Nissan Leaf Standard Range er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur lengra en flestir bílar á svipuðu verði en er hægari en flestir.',
    ],
    facts: '9dba101dd6fb',
  },
  'nissan-leaf-extended-range': {
    paragraphs: [
      'Nissan Leaf Extended Range er ódýrari en flestir en drífur lengra en flestir, með 622 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er sterkur langferðabíll fyrir verðið.',
    ],
    facts: '81e6a06ebd13',
  },
  'opel-frontera-base': {
    paragraphs: [
      'Opel Frontera er sjö sæta og meðal ódýrustu bílanna á listanum. Hann er þó meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir.',
    ],
    facts: '639ac8818402',
  },
  'opel-grandland-base': {
    paragraphs: [
      'Opel Grandland er ódýrari en flestir og ódýrari á hvern km drægni en flestir, með drægni í meðallagi. Hann er meðal þeirra hægustu og hleður hægar en flestir.',
    ],
    facts: '4719c53154a1',
  },
  'opel-grandland-awd': {
    paragraphs: [
      'Opel Grandland AWD er fjórhjóladrifinn og á verði í meðallagi. Hann drífur styttra og hleður hægar en flestir, en er í meðallagi að afli og hröðun.',
    ],
    facts: '2132b5d2c51f',
  },
  'gwm-ora-3-48-kwh': {
    paragraphs: [
      'GWM Ora 3 48 kWh er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar best innanbæjar.',
    ],
    facts: '7ec25be68017',
  },
  'peugeot-e-2008-54-kwh': {
    paragraphs: [
      'Peugeot e-2008 54 kWh er meðal ódýrustu bílanna en drífur styttra og er meðal þeirra hægustu og aflminnstu. Miðað við bíla á svipuðu verði hleður hann þó hraðar en flestir.',
    ],
    facts: '871aa0cd9f85',
  },
  'peugeot-e-3008-base': {
    paragraphs: [
      'Peugeot e-3008 er ódýrari en flestir og ódýrari á hvern km drægni en flestir, og drífur lengra en flestir bílar á svipuðu verði. Hann hleður hægar og er aflminni en flestir.',
    ],
    facts: '128c7948092b',
  },
  'peugeot-e-3008-dual-motor': {
    paragraphs: [
      'Peugeot e-3008 Dual Motor er fjórhjóladrifinn, ódýrari en flestir og drífur lengra en flestir bílar á svipuðu verði. Hann hleður þó hægar en flestir.',
    ],
    facts: '46224bde9c9c',
  },
  'peugeot-e-5008-base': {
    paragraphs: [
      'Peugeot e-5008 er sjö sæta og ódýrari en flestir, með drægni í meðallagi. Hann er meðal þeirra hægustu og hleður hægar en flestir.',
    ],
    facts: 'c9d2a316e9d3',
  },
  'peugeot-e-5008-dual-motor': {
    paragraphs: [
      'Peugeot e-5008 Dual Motor er sjö sæta og fjórhjóladrifinn, á verði í meðallagi. Hann drífur styttra en flestir og hleður með þeim hægustu miðað við bíla á svipuðu verði.',
    ],
    facts: '8da9ed4f4634',
  },
  'peugeot-e-rifter-base': {
    paragraphs: [
      'Peugeot e-Rifter er sjö sæta og ódýrari en flestir, en meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir. Hann hentar helst sem rúmgóður bíll í styttri ferðir.',
    ],
    facts: '0c1f5e10383f',
  },
  'peugeot-e-traveller-base': {
    paragraphs: [
      'Peugeot e-Traveller tekur níu manns en er dýrari en flestir og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin umfram allt.',
    ],
    facts: 'd075d4f5d7b5',
  },
  'polestar-2-long-range-dual-motor': {
    paragraphs: [
      'Polestar 2 Long Range Dual Motor er fjórhjóladrifinn, drífur lengra en flestir og hleður hraðar en flestir, á verði í meðallagi. Miðað við bíla á svipuðu verði er hann meðal þeirra langdrægustu og sneggri en flestir.',
    ],
    facts: '79813a59a48c',
  },
  'polestar-2-long-range-performance': {
    paragraphs: [
      'Polestar 2 Long Range Performance er fjórhjóladrifinn, sneggri og aflmeiri en flestir, og drífur lengra og hleður hraðar en flestir. Hann er á verði í meðallagi.',
    ],
    facts: '654cac336bfb',
  },
  'polestar-3-base': {
    paragraphs: [
      'Polestar 3 er meðal þeirra langdrægustu og með einni af stærstu rafhlöðunum. Hann er fjórhjóladrifinn og dýrari en flestir, og hleður hægar en flestir bílar á svipuðu verði.',
    ],
    facts: 'f19b9eb85119',
  },
  'polestar-3-performance': {
    paragraphs: [
      'Polestar 3 Performance er fjórhjóladrifinn, sneggri og aflmeiri en flestir og með einni af stærstu rafhlöðunum. Miðað við bíla á svipuðu verði drífur hann þó styttra og hleður hægar.',
    ],
    facts: 'df306117bbea',
  },
  'polestar-4-long-range-dual-motor': {
    paragraphs: [
      'Polestar 4 Long Range Dual Motor er kraftmikill, fjórhjóladrifinn bíll sem hentar þeim sem leita að mikilli drægni og snörpum afköstum í öllum veðrum.',
      'Helsti styrkur bílsins er að hann drífur lengra en flestir rafbílar og er með einni af stærstu rafhlöðunum í sínum verðflokki. Þetta þýðir að ferðalög milli landshluta takast auðveldlega án hleðslustopps, jafnvel í vetrarkulda. Hann er jafnframt meðal þeirra aflmestu og sneggstu, ræður við 2.000 kg drátt og býður upp á 526 lítra skott.',
      'Hraðhleðslan er hins vegar aðeins í meðallagi og bíllinn er dýrari en flestir. Polestar 4 er 7,7 km/mín hægari að hlaða en Smart #5 Brabus, þótt Smart sé með 50 km minni drægni. Einnig er Polestar 4 160.000 kr. dýrari en Tesla Model Y Performance og 0,3 s hægari í hundraðið.',
      'Þetta eru góð kaup fyrir þá sem vilja öflugan fjórhjóladrifinn bíl með mikla vetrardrægni og ríflega dráttargetu. Hann hentar síður þeim sem vilja hraðari hleðslu á langferðum eða lægra verð.',
    ],
    facts: '369d9faa24a7',
    model: 'gemini-3.8-flash, thinking high',
  },
  'polestar-4-suv-long-range-dual-motor': {
    paragraphs: [
      'Polestar 4 SUV Long Range Dual Motor er meðal sneggstu og aflmestu bílanna, drífur lengra en flestir og hleður hraðar en flestir. Hann er dýrari en flestir.',
    ],
    facts: 'b7bf2a083851',
  },
  'porsche-macan-4-electric': {
    paragraphs: [
      'Porsche Macan 4 Electric er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir. Hann er dýrari en flestir og í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: '00b6862445fc',
  },
  'porsche-macan-4s-electric': {
    paragraphs: [
      'Porsche Macan 4s Electric er meðal sneggstu bílanna á listanum og hleður hraðar en flestir. Hann er meðal þeirra dýrustu.',
    ],
    facts: 'bcf40cc6e7e9',
  },
  'porsche-taycan-plus': {
    paragraphs: [
      'Porsche Taycan Plus er meðal þeirra langdrægustu, með 678 km, og meðal þeirra sem hlaða hraðast. Hann er afturhjóladrifinn og meðal dýrustu bílanna á listanum.',
    ],
    facts: '5cc285600c81',
  },
  'porsche-taycan-4-plus': {
    paragraphs: [
      'Porsche Taycan 4 Plus er fjórhjóladrifinn, meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '1a4f645d5b7f',
  },
  'porsche-taycan-4s-plus': {
    paragraphs: [
      'Porsche Taycan 4S Plus er sneggstur bíla á svipuðu verði og meðal þeirra aflmestu á listanum. Hann hleður með þeim hröðustu, en drífur styttra en flestir á sama verði.',
    ],
    facts: '4c90dda0d9e9',
  },
  'porsche-taycan-4-cross-turismo': {
    paragraphs: [
      'Porsche Taycan 4 Cross Turismo er fjórhjóladrifinn, drífur lengra en flestir og er meðal þeirra sem hlaða hraðast. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '9647ceac3d22',
  },
  'porsche-taycan-4s-cross-turismo': {
    paragraphs: [
      'Porsche Taycan 4s Cross Turismo er meðal sneggstu og aflmestu bílanna á listanum og meðal þeirra sem hlaða hraðast. Hann er meðal þeirra dýrustu.',
    ],
    facts: '8d8a87d4aa2a',
  },
  'porsche-cayenne-base': {
    paragraphs: [
      'Porsche Cayenne er meðal þeirra langdrægustu, með 642 km, meðal þeirra sem hlaða hraðast og með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '2c056288ef51',
  },
  'porsche-cayenne-coupe': {
    paragraphs: [
      'Porsche Cayenne Coupé er meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast, með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: 'abfb7acddfc1',
  },
  'porsche-cayenne-s': {
    paragraphs: [
      'Porsche Cayenne S er meðal þeirra langdrægustu, sneggstu og aflmestu á listanum, og meðal þeirra sem hlaða hraðast. Hann er meðal dýrustu bílanna.',
    ],
    facts: '15e113b31050',
  },
  'porsche-cayenne-s-coupe': {
    paragraphs: [
      'Porsche Cayenne S Coupé er meðal þeirra langdrægustu, sneggstu og aflmestu, og hleður hraðast bíla á svipuðu verði. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: 'be0c0f9a57df',
  },
  'porsche-cayenne-turbo': {
    paragraphs: [
      'Porsche Cayenne Turbo er meðal sneggstu og aflmestu bílanna á listanum og meðal þeirra sem hlaða hraðast. Hann er meðal þeirra dýrustu.',
    ],
    facts: 'd3cbcd246034',
  },
  'porsche-cayenne-turbo-coupe': {
    paragraphs: [
      'Porsche Cayenne Turbo Coupé er meðal þeirra langdrægustu, sneggstu og aflmestu, og hleður hraðast bíla á svipuðu verði. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '69ed014b5aec',
  },
  'range-rover-electric-ev450': {
    paragraphs: [
      'Range Rover Electric EV450 er meðal dýrustu bílanna á listanum, með einni af stærstu rafhlöðunum. Miðað við bíla á svipuðu verði drífur hann styttra, hleður hægar og er meðal þeirra hægustu.',
    ],
    facts: 'faa914ec8948',
  },
  'range-rover-electric-ev550': {
    paragraphs: [
      'Range Rover Electric EV550 er meðal dýrustu og aflmestu bílanna á listanum, með einni af stærstu rafhlöðunum. Miðað við bíla á svipuðu verði drífur hann þó styttra og hleður hægar.',
    ],
    facts: '2dbd2faae2cc',
  },
  'renault-r5-e-tech-base': {
    paragraphs: [
      'Renault R5 E-Tech er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar best innanbæjar.',
    ],
    facts: 'f24c787a35e4',
  },
  'renault-r5-e-tech-52-kwh': {
    paragraphs: [
      'Renault R5 E-Tech 52 kWh er meðal ódýrustu bílanna á listanum og ódýrari á hvern km drægni en flestir. Hann drífur styttra og hleður hægar en flestir, svo hann hentar best í daglegan akstur.',
    ],
    facts: 'b098ddea3322',
  },
  'renault-scenic-e-tech-ev60': {
    paragraphs: [
      'Renault Scenic E-Tech EV60 er ódýrari en flestir en drífur styttra og hleður hægar en flestir, og er meðal þeirra hægustu og aflminnstu. Hann hentar þeim sem aka mest innanbæjar.',
    ],
    facts: '4a1a13953249',
  },
  'renault-scenic-e-tech-ev87': {
    paragraphs: [
      'Renault Scenic E-Tech EV87 er ódýrari en flestir en drífur lengra en flestir, með 623 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður þó hægar og er hægari og aflminni en flestir.',
    ],
    facts: 'acd09fabb5d1',
  },
  'skoda-epiq-55': {
    paragraphs: [
      'Skoda Epiq 55 er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði hleður hann hraðar og er sneggri en flestir; hann er væntanlegur í lok árs 2026.',
    ],
    facts: '72a90190fad6',
  },
  'skoda-elroq-85': {
    paragraphs: [
      'Skoda Elroq 85 er ódýrari en flestir en drífur lengra en flestir, með 579 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er í meðallagi að afli, sem gerir hann að jöfnum og hagkvæmum langferðabíl.',
    ],
    facts: 'f238cd645681',
  },
  'skoda-elroq-85x': {
    paragraphs: [
      'Skoda Elroq 85x er fjórhjóladrifinn, ódýrari en flestir og drífur lengra en flestir. Hann er meðal þeirra ódýrustu á hvern km drægni og hleður hraðar en flestir.',
    ],
    facts: '046a7c819ffe',
  },
  'skoda-elroq-rs': {
    paragraphs: [
      'Skoda Elroq RS er fjórhjóladrifinn og drífur lengra en flestir, á verði í meðallagi. Í flestu öðru er hann í meðallagi, bæði á listanum og miðað við bíla á svipuðu verði.',
    ],
    facts: 'f791863250c6',
  },
  'skoda-enyaq-85x': {
    paragraphs: [
      'Skoda Enyaq 85X er fjórhjóladrifinn og ódýrari á hvern km drægni en flestir, á verði í meðallagi. Hann er hægari en flestir og í meðallagi í hleðslu.',
    ],
    facts: '0dafdd84fbcb',
  },
  'skoda-enyaq-rs': {
    paragraphs: [
      'Skoda Enyaq RS er fjórhjóladrifinn og dýrari en flestir, en í meðallagi í nánast öllu sem tölurnar mæla. Hann er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '3bfa282d2c5f',
  },
  'skoda-peaq-90x': {
    paragraphs: [
      'Skoda Peaq 90x er sjö sæta og fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir. Hann er dýrari en flestir en meðal þeirra langdrægustu miðað við bíla á svipuðu verði.',
    ],
    facts: '68fed3ddb748',
  },
  'smart-1-pro': {
    paragraphs: [
      'Smart #1 Pro+ er meðal ódýrustu bílanna og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði hleður hann hraðar og er sneggri og aflmeiri en flestir.',
    ],
    facts: 'c16440ae1109',
  },
  'smart-1-pulse': {
    paragraphs: [
      'Smart #1 Pulse er fjórhjóladrifinn, ódýrari en flestir og meðal þeirra sneggstu miðað við bíla á svipuðu verði. Hann drífur þó með þeim stystu og hleður hægar en flestir.',
    ],
    facts: '89b5d2fc00da',
  },
  'smart-1-brabus': {
    paragraphs: [
      'Smart #1 Brabus er fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur þó með þeim stystu og hleður hægar en flestir.',
    ],
    facts: '126070c12281',
  },
  'smart-3-pulse': {
    paragraphs: [
      'Smart #3 Pulse er fjórhjóladrifinn, ódýrari en flestir og sneggri og aflmeiri en flestir. Hann drífur styttra og hleður hægar en flestir.',
    ],
    facts: 'de6f09965685',
  },
  'smart-3-brabus': {
    paragraphs: [
      'Smart #3 Brabus er fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur styttra og hleður hægar en flestir, og er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '13b8e459e544',
  },
  'smart-5-pro': {
    paragraphs: [
      'Smart #5 Pro er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði er hann sneggri og aflmeiri en flestir.',
    ],
    facts: 'fb28e895fd17',
  },
  'smart-5-pulse': {
    paragraphs: [
      'Smart #5 Pulse er fjórhjóladrifinn, meðal þeirra aflmestu og hleður hraðar en flestir, á verði í meðallagi. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu.',
    ],
    facts: 'f5b666792eb4',
  },
  'smart-5-brabus': {
    paragraphs: [
      'Smart #5 Brabus er aflmestur bíla á svipuðu verði og meðal þeirra sneggstu á listanum. Hann er dýrari en flestir og í meðallagi að drægni.',
    ],
    facts: '7f0c7ce1b875',
  },
  'subaru-e-outback-base': {
    paragraphs: [
      'Subaru e-Outback er fjórhjóladrifinn, sneggri og aflmeiri en flestir, á verði í meðallagi. Drægni og hleðsla eru í meðallagi.',
    ],
    facts: '351009f2a131',
  },
  'subaru-solterra-base': {
    paragraphs: [
      'Subaru Solterra er fjórhjóladrifinn og sneggri en flestir, á verði í meðallagi. Í drægni og hleðslu er hann í meðallagi.',
    ],
    facts: '4bdcaff470e0',
  },
  'subaru-uncharted-base': {
    paragraphs: [
      'Subaru Uncharted er fjórhjóladrifinn, ódýrari en flestir og sneggri en flestir. Hann drífur styttra en flestir en er ódýrari á hvern km drægni en flestir.',
    ],
    facts: '600be7f80558',
  },
  'suzuki-e-vitara-4x4-allgrip': {
    paragraphs: [
      'Suzuki e Vitara 4x4 AllGrip er fjórhjóladrifinn og ódýrari en flestir, en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar helst þeim sem þurfa fjórhjóladrif í styttri ferðir.',
    ],
    facts: '9e1f45f4381d',
  },
  'tesla-model-3-afturhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Afturhjóladrif er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði er hann meðal þeirra langdrægustu, sneggstu og þeirra sem hlaða hraðast.',
    ],
    facts: '6e4b042f5f8e',
  },
  'tesla-model-3-long-range-afturhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Long Range Afturhjóladrif er ódýrasti bíllinn á listanum á hvern km drægni og meðal þeirra langdrægustu, með 750 km. Hann hleður hraðar og er sneggri en flestir, svo fáir bílar gefa meira fyrir peninginn á langferðum.',
    ],
    facts: '9236d52b3e46',
  },
  'tesla-model-3-long-range-fjorhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Long Range Fjórhjóladrif er fjórhjóladrifinn, meðal þeirra langdrægustu og meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er meðal þeirra sneggstu miðað við bíla á svipuðu verði.',
    ],
    facts: '0373111d1d2f',
  },
  'tesla-model-3-performance': {
    paragraphs: [
      'Tesla Model 3 Performance er sneggstur bíla á svipuðu verði og meðal þeirra aflmestu á listanum. Hann er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir.',
    ],
    facts: 'a819b88caa71',
  },
  'tesla-model-y-standard-range': {
    paragraphs: [
      'Tesla Model Y Standard Range er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði drífur hann lengra og hleður hraðar en flestir.',
    ],
    facts: '854aea2b938e',
  },
  'tesla-model-y-premium-long-range': {
    paragraphs: [
      'Tesla Model Y Premium Long Range drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er meðal þeirra langdrægustu og ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '813241da310c',
  },
  'tesla-model-y-long-range-dual-motor': {
    paragraphs: [
      'Tesla Model Y Long Range Dual Motor er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er meðal þeirra langdrægustu og aflmestu miðað við bíla á svipuðu verði.',
    ],
    facts: '104f6f637e46',
  },
  'tesla-model-y-performance': {
    paragraphs: [
      'Tesla Model Y Performance er meðal sneggstu og aflmestu bílanna á listanum, drífur lengra og hleður hraðar en flestir. Hann er dýrari en flestir.',
    ],
    facts: 'd5ab64b5fdd7',
  },
  'toyota-bz4x-base': {
    paragraphs: [
      'Toyota bZ4X drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er framhjóladrifinn og hægari og aflminni en flestir.',
    ],
    facts: '5daad0653610',
  },
  'toyota-bz4x-awd': {
    paragraphs: [
      'Toyota bZ4X AWD er fjórhjóladrifinn og sneggri en flestir, en dýrari en flestir og í meðallagi að drægni og hleðslu.',
    ],
    facts: 'bebd36fdafb1',
  },
  'toyota-bz4x-touring-base': {
    paragraphs: [
      'Toyota bZ4X Touring drífur lengra en flestir og hleður hraðar en flestir bílar á svipuðu verði. Hann er dýrari en flestir og hægari og aflminni en flestir.',
    ],
    facts: 'a9a3b6645aa7',
  },
  'toyota-bz4x-touring-awd': {
    paragraphs: [
      'Toyota bZ4X Touring AWD er fjórhjóladrifinn, sneggri og aflmeiri en flestir, en dýrari en flestir. Hann hleður hægar en flestir og er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '4917c609e76a',
  },
  'toyota-c-hr-base': {
    paragraphs: [
      'Toyota C-HR+ er ódýrari en flestir en drífur styttra en flestir, með einni af minnstu rafhlöðunum, og er meðal þeirra aflminnstu.',
    ],
    facts: 'aa17f0d1bc36',
  },
  'toyota-c-hr-77-kwh': {
    paragraphs: [
      'Toyota C-HR+ 77 kWh drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er meðal þeirra langdrægustu miðað við bíla á svipuðu verði, en hægari og aflminni en flestir.',
    ],
    facts: 'a6d4f8722282',
  },
  'toyota-c-hr-awd': {
    paragraphs: [
      'Toyota C-HR+ AWD er fjórhjóladrifinn og sneggri en flestir, en dýrari en flestir og hleður hægar en flestir. Hann er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: 'a5f5e54b6b26',
  },
  'toyota-proace-city-verso-base': {
    paragraphs: [
      'Toyota Proace City Verso er sjö sæta á verði í meðallagi, en meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir. Hann hentar helst sem rúmgóður bíll í styttri ferðir.',
    ],
    facts: '36719519a815',
  },
  'toyota-proace-verso-base': {
    paragraphs: [
      'Toyota Proace Verso tekur níu manns en er dýrari en flestir og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin umfram allt.',
    ],
    facts: '629c94f65613',
  },
  'toyota-urban-cruiser-active-fwd': {
    paragraphs: [
      'Toyota Urban Cruiser Active FWD er ódýrari en flestir en drífur styttra en flestir, hleður með þeim hægustu og er meðal þeirra aflminnstu. Hann hentar helst innanbæjar.',
    ],
    facts: 'd99deb64672c',
  },
  'toyota-urban-cruiser-active-awd': {
    paragraphs: [
      'Toyota Urban Cruiser Active AWD er fjórhjóladrifinn og ódýrari en flestir, en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar þeim sem þurfa fjórhjóladrif í styttri ferðir.',
    ],
    facts: '1857fd3af07a',
  },
  'volkswagen-id-buzz-gtx': {
    paragraphs: [
      'Volkswagen ID. Buzz GTX er sjö sæta og fjórhjóladrifinn, með stærri rafhlöðu en flestir. Miðað við bíla á svipuðu verði drífur hann þó með þeim stystu og hleður hægar en flestir.',
    ],
    facts: '28e752c130b8',
  },
  'volkswagen-id-polo-base': {
    paragraphs: [
      'Volkswagen ID. Polo er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu; hann er væntanlegur í lok árs 2026.',
    ],
    facts: '920460fd359c',
  },
  'volkswagen-id-cross-base': {
    paragraphs: [
      'Volkswagen ID. Cross er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Hann drífur styttra en flestir, en hleður hraðar en flestir bílar á svipuðu verði.',
    ],
    facts: '35672ab6484e',
  },
  'volkswagen-id-3-pro': {
    paragraphs: [
      'Volkswagen ID.3 Pro er meðal ódýrustu bílanna og ódýrari á hvern km drægni en flestir. Hann drífur styttra og hleður hægar en flestir.',
    ],
    facts: '179cfdb79e93',
  },
  'volkswagen-id-3-neo-58-kwh': {
    paragraphs: [
      'Volkswagen ID.3 Neo 58 kWh er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði drífur hann lengra og hleður hraðar; hann er væntanlegur í lok árs 2026.',
    ],
    facts: 'b699319c4a40',
  },
  'volkswagen-id-4-gtx': {
    paragraphs: [
      'Volkswagen ID.4 GTX er fjórhjóladrifinn og í meðallagi í öllu sem tölurnar mæla, bæði á listanum og miðað við bíla á svipuðu verði. Hann er jafn bíll án sérstakra styrkleika eða veikleika.',
    ],
    facts: '5d3262df0b27',
  },
  'volkswagen-id-4-pro-4motion': {
    paragraphs: [
      'Volkswagen ID.4 Pro 4MOTION er fjölskylduvænn jepplingur með fjórhjóladrifi sem hentar sérlega vel þeim sem þurfa traustan ferðabíl í misjöfnum íslenskum aðstæðum.',
      'Í sínum verðflokki drífur bíllinn lengra en flestir og er ódýrari á hvern kílómetra drægni en flestir rafbílar á landinu, sem skilar sér í mikilli drægni fyrir peninginn. Fjórhjóladrifið kemur sér vel í hálku og snjó, og 543 lítra farangursrýmið tekur léttilega við öllum hefðbundnum farangri.',
      'Aftur á móti hefur bíllinn ekkert framskott og má draga 1.200 kg. Hann er einnig aflminni en helstu keppinautar, með 140 kW minna afl en XPENG G6 AWD Performance sem er 100.000 kr. ódýrari. Þá er ID.4 9,1 km/mín hægari í hraðhleðslu en Hyundai IONIQ 5 Long Range AWD, sem bíður styttra við hleðslustöðvar á langferðum.',
      'Bíllinn er skynsamleg kaup fyrir þá sem leita að rúmgóðum og hagkvæmum rafbíl í daglegan akstur og vetrarferðir. Hann hentar síður þeim sem leggja mikla áherslu á hraðari hleðslutíma eða mikið afl.',
    ],
    facts: 'e20b5cb95094',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volkswagen-id-7-gtx': {
    paragraphs: [
      'Volkswagen ID.7 GTX er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, og er með stærri rafhlöðu en flestir. Hann er dýrari en flestir.',
    ],
    facts: '7b3020e1467d',
  },
  'volvo-ec40-recharge-twin': {
    paragraphs: [
      'Volvo EC40 Recharge Twin er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, og er sneggri og aflmeiri en flestir. Hann er dýrari en flestir.',
    ],
    facts: 'b0894cdd0b84',
  },
  'volvo-es90-twin-motor': {
    paragraphs: [
      'Volvo ES90 Twin Motor er meðal þeirra langdrægustu, með 679 km, og meðal þeirra sem hlaða hraðast. Hann er dýrari en flestir og væntanlegur í október 2026.',
    ],
    facts: '14ec449c4f32',
  },
  'volvo-es90-twin-motor-performance': {
    paragraphs: [
      'Volvo ES90 Twin Motor Performance er meðal þeirra langdrægustu, sneggstu og aflmestu, og meðal þeirra sem hlaða hraðast. Hann er dýrari en flestir og væntanlegur í október 2026.',
    ],
    facts: '6d11ee7aa2db',
  },
  'volvo-ex40-recharge-twin': {
    paragraphs: [
      'Volvo EX40 Recharge Twin er fjórhjóladrifinn, sneggri og aflmeiri en flestir. Hann er dýrari en flestir og í meðallagi að drægni og hleðslu.',
    ],
    facts: 'fa39131e65e3',
  },
  'volvo-ex30-single-motor': {
    paragraphs: [
      'Volvo EX30 Single Motor er ódýrari en flestir en meðal þeirra sem drífa styst, og meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði. Hann hentar helst innanbæjar.',
    ],
    facts: 'f3714398c2db',
  },
  'volvo-ex30-single-motor-extended-range': {
    paragraphs: [
      'Volvo EX30 Single Motor Extended Range er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði hleður hann hraðar og er sneggri en flestir.',
    ],
    facts: '8dc827a3fbf9',
  },
  'volvo-ex30-twin-motor-performance': {
    paragraphs: [
      'Volvo EX30 Twin Motor Performance er fjórhjóladrifinn og meðal þeirra sneggstu á listanum, ódýrari en flestir. Hann drífur þó styttra en flestir.',
    ],
    facts: '50af540dc87e',
  },
  'volvo-ex30-cross-country-twin-motor-performance': {
    paragraphs: [
      'Volvo EX30 Cross Country Twin Motor Performance er fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur styttra og hleður hægar en flestir, og er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '489b33a54290',
  },
  'volvo-ex60-p10': {
    paragraphs: [
      'Volvo EX60 P10 er stór og öflugur fjórhjóladrifinn jepplingur sem hentar vel fyrir fjölskyldur sem þurfa mikið rými og öruggan ferðabíl í öllum veðrum.',
      'Hann er meðal þeirra langdrægustu af rafbílum hér á landi og drífur lengra en flestir í sínum verðflokki, sem kemur sér vel í vetrarkulda milli landshluta. Hraðhleðslan er einnig meðal þeirra hröðustu á markaðnum og styttir stopp á langferðum. Fjórhjóladrifið, 523 lítra farangursrými og 2.400 kg dráttargeta gera hann auk þess afar færan í íslenskri vetrarfærð og við kerrudrátt.',
      'Á móti er bíllinn dýrari en flestir rafbílar og fær ekki styrk. Ef hámarksdrægni ræður öllu kemst Mercedes-Benz CLA Shooting Brake 350 4MATIC lengra, en miðað við hann er Volvo með 83 km minni drægni og er 4,6 km/mín hægari í hraðhleðslu. Ef kaupverðið vegur þyngra kemur Audi A6 e-tron Avant quattro til greina, en Volvo er 100.000 kr. dýrari en hann.',
      'Þetta eru góð kaup fyrir þá sem vilja mikinn dráttarkraft, gott skott og áreiðanlegan ferðabíl fyrir erfiðari aðstæður, en síður fyrir þá sem horfa stíft í verðið eða vilja fremur lægri langbak.',
    ],
    facts: '858ca6a6214e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volvo-ex60-p12': {
    paragraphs: [
      'Volvo EX60 P12 drífur lengst bíla á svipuðu verði, 810 km, og hefur stærstu rafhlöðuna í þeim hópi. Hann er líka meðal þeirra sneggstu, aflmestu og þeirra sem hlaða hraðast.',
    ],
    facts: '2bbdc3c9cdd6',
  },
  'volvo-ex90-twin-motor': {
    paragraphs: [
      'Volvo EX90 Twin Motor er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum og drífur lengra en flestir. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '8c4703eadf9c',
  },
  'volvo-ex90-twin-motor-performance': {
    paragraphs: [
      'Volvo EX90 Twin Motor Performance er sjö sæta, fjórhjóladrifinn og sneggri og aflmeiri en flestir, með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '15f349b0317b',
  },
  'xpeng-g6-rwd-standard-range': {
    paragraphs: [
      'XPENG G6 RWD Standard Range er ódýrari en flestir og hleður hraðar en flestir, með þeim hröðustu miðað við bíla á svipuðu verði. Hann drífur þó styttra en flestir.',
    ],
    facts: 'd4a5f3a90a38',
  },
  'xpeng-g6-rwd-long-range': {
    paragraphs: [
      'XPENG G6 RWD Long Range er ódýrari en flestir, drífur lengra en flestir og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er með stærri rafhlöðu en flestir.',
    ],
    facts: '71aec058a48b',
  },
  'xpeng-g6-awd-performance': {
    paragraphs: [
      'XPENG G6 AWD Performance er fjórhjóladrifinn, ódýrari en flestir og meðal þeirra sneggstu á listanum. Hann drífur lengra og hleður hraðar en flestir, sem gerir hann að miklum bíl fyrir peninginn.',
    ],
    facts: '65b1ab835a62',
  },
  'xpeng-g9-awd-performance': {
    paragraphs: [
      'XPENG G9 AWD Performance er fjórhjóladrifinn, meðal þeirra sem hlaða hraðast og sneggri og aflmeiri en flestir. Hann er dýrari en flestir og drífur styttra en flestir bílar á svipuðu verði.',
    ],
    facts: 'a56f90bdba44',
  },
  'xpeng-x9-awd-performance': {
    paragraphs: [
      'XPENG X9 AWD Performance er sjö sæta og hleður hraðast allra bíla á listanum, með einni af stærstu rafhlöðunum. Hann er dýrari en flestir og drífur styttra en flestir bílar á svipuðu verði.',
    ],
    facts: '1ba4553184a7',
  },
}

export default carReviews
