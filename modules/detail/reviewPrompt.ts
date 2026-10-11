import { createHash } from 'node:crypto'

import cars, { type Car } from '@/modules/data/cars'
import type { CarReview } from '@/modules/data/carReviews'
import { similarTo } from '@/modules/detail/similar'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { grantAmountText } from '@/modules/copy/grantCopy'
import { driveLabels } from '@/modules/data/drives'
import { realRangeHighFactor, realRangeLowFactor } from '@/modules/data/globals'

const writingRules = `Þegar þú skrifar:
- Skrifaðu á eðlilegri, lipurri íslensku, í samtalstón, eins og fróður vinur en ekki sölumaður.
- Ekki endursegja tölurnar: þær eru í töflu beint fyrir ofan textann þinn. Segðu frekar hvað þær þýða í daglegu lífi.
- Reiknaðu aldrei sjálf(ur). Munurinn á tölunum er reiknaður fyrir þig: taktu hann orðréttan. Til að bera saman tölur úr fetchCarDetails, nefndu tölurnar sjálfar frekar en muninn á þeim.
- Verðin eru eftir ${grantAmountText} ríkisstyrk þar sem hann á við.
- Drægnin er samkvæmt WLTP. Í íslenskum vetri er hún nær ${Math.round(realRangeLowFactor * 100)}–${Math.round(realRangeHighFactor * 100)}% af því.
- Tölur taktu aðeins úr gögnunum hér að neðan og því sem fetchCarDetails skilar, aldrei úr minni. Almenna þekkingu á bílunum og framleiðendum þeirra, til dæmis hvar merki stendur í gæðum og verði eða hvernig drifið hagar sér í snjó, máttu nota í hófi þar sem hún hjálpar kaupandanum.
- Skrifaðu tölur að íslenskum sið: komma í tugabrotum (7,7 s) og punktur í þúsundum (100.000 kr.).
- Nefndu hleðsluhraða aldrei í tölum, hvorki í km/mín, kW né mínútum: fáir tengja við þær. Segðu frekar að hann hlaði hraðar eða hægar en aðrir, eða hve miklu styttri eða lengri hleðslustoppin eru, eins og það er gefið.
- Gættu að beygingum og samræmi („hann er góð kaup“, ekki „hann eru“), og notaðu orð um bíla en ekki fólk: lágur eða hár, ekki lágvaxinn eða hávaxinn.
- Ekkert markdown, engin feitletrun, engir listar, engar fyrirsagnir.`

const intro = `Þú ert ráðgjafi Veldu Rafbíl, íslensks vefs sem ber saman alla 100% rafdrifna bíla sem eru seldir nýir á Íslandi.`

// The first thing anyone reads about a car on its page, under its figures,
// so it is written to orient: what the car is, what it is good at, and what
// it costs you, measured against every electric car sold here rather than
// against an idea of what a car should be
const carSystemPrompt = `${intro} Einhver hefur opnað síðu bílsins hér að neðan til að kynnast honum. Umsögnin þín er það fyrsta sem viðkomandi les um hann, á eftir tölunum. Hún á að gefa heiðarlega og upplýsandi mynd af því hvers konar bíll þetta er, hvar hann skarar fram úr og hvar hann gefur eftir, svo lesandinn viti hvort hann sé þess virði að skoða betur.

Áður en þú skrifar:
- Sæktu nánari upplýsingar um bílinn og svipuðu bílana með fetchCarDetails, með ev-database slóðinni sem fylgir hverjum þeirra hér að neðan, til að vita stærð þeirra, veghæð, farangursrými, framskott og dráttargetu. Bíll sem hefur enga slóð hefur engar slíkar upplýsingar.
- Gefðu stærð, veghæð, rými og dráttargetu aðeins meira vægi þar sem bíllinn sker sig úr frá svipuðu bílunum: það sýna tölurnar á síðunni ekki.
- Lestu hvar bíllinn stendur á listanum: meðal allra rafbílanna sem eru seldir á Íslandi og meðal þeirra sem kosta svipað. Þar sést hvað er í raun sérstakt við hann og hvað er bara venjulegt. Það sem er í meðallagi er ekki styrkleiki. Staðan er sögð í orðum, til dæmis „meðal þeirra ódýrustu“ eða „dýrari en flestir“: segðu hana þannig líka, aldrei með prósentum, sæti í röð eða fjölda bíla. Orðaðu hana eðlilega og segðu við hvað er miðað eins og fólk talar, til dæmis „af rafbílum hér á landi“ eða „í sínum verðflokki“.

Það sem skiptir íslenska kaupendur mestu, eftir því sem á við þennan bíl:
- Hvort drægnin dugar í vetrarkulda, á milli landshluta og ekki bara innanbæjar.
- Hraðhleðsla á langferðum, þar sem hleðslustöðvar eru strjálar utan höfuðborgarsvæðisins.
- Fjórhjóladrif í snjó, hálku og á malarvegum.
- Pláss: farangursrými, sætafjöldi og dráttargeta fyrir kerru eða hjólhýsi.
- Verðið eftir styrk og hvað maður fær fyrir það, til dæmis verð á hvern km drægni.
Veldu það sem segir mest um þennan bíl. Ekki fara yfir allt.

${writingRules}

Svaraðu með um 150 orðum í þremur eða fjórum stuttum efnisgreinum og engu öðru:
1. Opnaðu á því sem greinir hann frá svipuðu bílunum, sjálfu, og hvað það þýðir fyrir þann sem hann hentar. Segðu beint hvað það er, ekki að hann skeri sig úr eða greinist frá hinum.
2. Aðrir helstu styrkleikar hans og hvað þeir þýða í daglegu lífi.
3. Hvað maður gefur eftir, og hvenær einn af svipuðu bílunum væri betri kostur. Nefndu einn eða tvo mun sem skipta mestu máli, ekki upptalningu á tölum.
Endaðu á stuttri niðurstöðu um þennan bíl, sem má vera lokasetning þriðju efnisgreinar eða efnisgrein ein og sér, orðuð út frá honum frekar en eftir föstu sniði. Ekki endurtaka það sem áður er sagt.

Lesandinn er að velja á milli bíla, svo skrifaðu um það sem greinir þennan bíl frá hinum frekar en það sem á við um flesta rafbíla. Hver setning á helst að segja eitthvað sem ætti ekki jafn vel við um svipuðu bílana.

Vertu heiðarleg(ur). Það sem bíllinn gerir í meðallagi gerirðu ekki að kosti: segðu það eða slepptu því. Notaðu ekki orð eins og "einstakur", "framúrskarandi" eða "frábær" nema staða hans á listanum sýni að hann skari fram úr. Um innréttingu, hljóðvist, hugbúnað og áreiðanleika eru engin gögn hér: segðu aðeins það sem almennt er vitað um merkið, og ekki sem staðreynd um þennan tiltekna bíl. Nefndu bíla með tegund og gerð, til dæmis Kia EV3.`

interface Metric {
  label: string
  better: 'higher' | 'lower'
  value: (car: Car) => number
  /**
   * How another car differs from this one on it, said of the other car: the
   * gap as worth saying, and the words for more and for less
   */
  difference:
    | {
        format: (gap: number) => string
        more: (gap: string) => string
        less: (gap: string) => string
      }
    // A difference with a reading of its own rather than a gap
    | ((other: Car, car: Car) => string | undefined)
  /** Where a car stands among others on it, from first of all to among the worst */
  standing: Record<'first' | 'top' | 'above' | 'below' | 'bottom', string>
}

// With a decimal comma, as the model would otherwise copy the point into
// Icelandic text
const decimal = (value: number) => String(value).replace('.', ',')
const oneDecimal = (value: number) => decimal(Number(value.toFixed(1)))

/** How another car differs from this one on a figure, or nothing if not */
const compare = (metric: Metric, other: Car, car: Car): string | undefined => {
  if (typeof metric.difference === 'function') {
    return metric.difference(other, car)
  }
  const { format, more, less } = metric.difference
  const gap = metric.value(other) - metric.value(car)
  if (gap === 0) return undefined
  const said = format(Math.abs(gap))
  return gap > 0 ? more(said) : less(said)
}

// A charging speed in km/min means little to most buyers, so it is given as
// how much shorter or longer a stop for the same range is, to the nearest 5%
const compareCharging = (other: Car, car: Car): string | undefined => {
  const stop = car.kmPerMinuteCharged / other.kmPerMinuteCharged
  const percent = Math.round(Math.abs(1 - stop) * 20) * 5
  if (percent === 0) return 'álíka löng hleðslustopp'
  return stop < 1
    ? `um ${percent}% styttri hleðslustopp`
    : `um ${percent}% lengri hleðslustopp`
}

const metrics: Metric[] = [
  {
    label: 'Verð',
    better: 'lower',
    value: (car) => car.priceWithGrant,
    difference: {
      // 160.000 kr., not the 160.010 kr. two list prices happen to differ by
      format: (gap) =>
        `${addDecimalSeparators(Number(gap.toPrecision(2)))} kr.`,
      more: (gap) => `${gap} dýrari`,
      less: (gap) => `${gap} ódýrari`,
    },
    standing: {
      first: 'ódýrastur',
      top: 'meðal þeirra ódýrustu',
      above: 'ódýrari en flestir',
      below: 'dýrari en flestir',
      bottom: 'meðal þeirra dýrustu',
    },
  },
  {
    label: 'Drægni',
    better: 'higher',
    value: (car) => car.range,
    difference: {
      format: (gap) => `${gap} km`,
      more: (gap) => `${gap} meiri drægni`,
      less: (gap) => `${gap} minni drægni`,
    },
    standing: {
      first: 'drífur lengst',
      top: 'meðal þeirra langdrægustu',
      above: 'drífur lengra en flestir',
      below: 'drífur styttra en flestir',
      bottom: 'meðal þeirra sem drífa styst',
    },
  },
  {
    label: 'Verð á hvern km drægni',
    better: 'lower',
    value: (car) => Math.round(car.pricePerKm),
    difference: {
      format: (gap) => `${addDecimalSeparators(gap)} kr.`,
      more: (gap) => `${gap} dýrari á hvern km drægni`,
      less: (gap) => `${gap} ódýrari á hvern km drægni`,
    },
    standing: {
      first: 'ódýrastur á hvern km drægni',
      top: 'meðal þeirra ódýrustu á hvern km drægni',
      above: 'ódýrari á hvern km drægni en flestir',
      below: 'dýrari á hvern km drægni en flestir',
      bottom: 'meðal þeirra dýrustu á hvern km drægni',
    },
  },
  {
    label: 'Hraðhleðsla',
    better: 'higher',
    value: (car) => car.kmPerMinuteCharged,
    difference: compareCharging,
    standing: {
      first: 'hleður hraðast',
      top: 'meðal þeirra sem hlaða hraðast',
      above: 'hleður hraðar en flestir',
      below: 'hleður hægar en flestir',
      bottom: 'meðal þeirra sem hlaða hægast',
    },
  },
  {
    label: 'Rafhlaða',
    better: 'higher',
    value: (car) => car.capacity,
    difference: {
      format: (gap) => `${oneDecimal(gap)} kWh`,
      more: (gap) => `${gap} stærri rafhlaða`,
      less: (gap) => `${gap} minni rafhlaða`,
    },
    standing: {
      first: 'með stærstu rafhlöðuna',
      top: 'með einni af stærstu rafhlöðunum',
      above: 'með stærri rafhlöðu en flestir',
      below: 'með minni rafhlöðu en flestir',
      bottom: 'með einni af minnstu rafhlöðunum',
    },
  },
  {
    label: 'Hröðun 0-100 km/klst',
    better: 'lower',
    value: (car) => car.acceleration,
    difference: {
      format: (gap) => `${oneDecimal(gap)} s`,
      more: (gap) => `${gap} hægari í 0-100 km/klst`,
      less: (gap) => `${gap} sneggri í 0-100 km/klst`,
    },
    standing: {
      first: 'sneggstur',
      top: 'meðal þeirra sneggstu',
      above: 'sneggri en flestir',
      below: 'hægari en flestir',
      bottom: 'meðal þeirra hægustu',
    },
  },
  {
    label: 'Afl',
    better: 'higher',
    value: (car) => car.power,
    difference: {
      format: (gap) => `${gap} kW`,
      more: (gap) => `${gap} meira afl`,
      less: (gap) => `${gap} minna afl`,
    },
    standing: {
      first: 'aflmestur',
      top: 'meðal þeirra aflmestu',
      above: 'aflmeiri en flestir',
      below: 'aflminni en flestir',
      bottom: 'meðal þeirra aflminnstu',
    },
  },
]

// Its charging is left to its standing and the comparisons, which say it
// without a figure
const describeCar = (car: Car): string =>
  [
    car.label,
    car.evDatabaseUrl
      ? `ev-database: ${car.evDatabaseUrl}`
      : 'engin ev-database slóð',
    `${addDecimalSeparators(car.priceWithGrant)} kr.${car.hasGrant ? ' eftir styrk' : ', fær ekki styrk'}`,
    `${car.range} km drægni (WLTP)`,
    `${decimal(car.capacity)} kWh rafhlaða`,
    `0-100 km/klst á ${decimal(car.acceleration)} s`,
    `${car.power} kW`,
    driveLabels[car.drive].toLowerCase(),
    `allt að ${car.seats} sæti`,
    car.expectedDelivery
      ? `ekki kominn, væntanlegur ${car.expectedDelivery.toLowerCase()}`
      : 'fáanlegur núna',
  ].join(', ')

const listCars = (cars: ReadonlyArray<Car>) =>
  cars.map((car) => `- ${describeCar(car)}`).join('\n')

// Each similar car said against this one rather than against the best of
// them, so a difference the model quotes is one between the two cars it names
const listDifferences = (car: Car, similar: ReadonlyArray<Car>) =>
  similar
    .map((other) => {
      const differences = metrics.flatMap(
        (metric) => compare(metric, other, car) ?? [],
      )
      return `- ${other.label}: ${differences.join(', ')}`
    })
    .join('\n')

// Within this much of the car's price either way, a car is one a buyer
// would weigh it against
const PRICE_BAND = 0.2
// Fewer than this at a similar price, and where it stands among them says little
const MIN_BAND = 5

// In words rather than as a share, since a share is what the model would
// quote, and "ahead of 98% of them" reads as a spec sheet, not as advice
const standingAmong = (
  metric: Metric,
  car: Car,
  others: ReadonlyArray<Car>,
): string => {
  const beaten =
    others.filter((other) =>
      metric.better === 'lower'
        ? metric.value(car) < metric.value(other)
        : metric.value(car) > metric.value(other),
    ).length / others.length

  if (beaten === 1) return metric.standing.first
  if (beaten >= 0.85) return metric.standing.top
  if (beaten >= 0.6) return metric.standing.above
  if (beaten > 0.4) return 'í meðallagi'
  if (beaten > 0.15) return metric.standing.below
  return metric.standing.bottom
}

/**
 * Where the car stands among every other car on the list, and among those at
 * a similar price, on each figure: what makes a number good or ordinary,
 * worked out so the model need not guess it
 */
export const describeStanding = (
  car: Car,
  all: ReadonlyArray<Car> = cars,
): string => {
  const others = all.filter((other) => other !== car)
  const band = others.filter(
    (other) =>
      Math.abs(other.priceWithGrant - car.priceWithGrant) <=
      car.priceWithGrant * PRICE_BAND,
  )
  const withBand = band.length >= MIN_BAND

  return metrics
    .map((metric) => {
      const overall = `af öllum: ${standingAmong(metric, car, others)}`
      // Price is what the band is cut by, so it says nothing within it
      const nearby =
        withBand && metric.label !== 'Verð'
          ? `; á svipuðu verði: ${standingAmong(metric, car, band)}`
          : ''
      return `- ${metric.label} — ${overall}${nearby}`
    })
    .join('\n')
}

/** The same for one car, with the cars like it and where it stands among all */
export const carFacts = (
  car: Car,
  similar: ReadonlyArray<Car>,
  all: ReadonlyArray<Car> = cars,
): string =>
  `Bíllinn:\n${listCars([car])}\n\nStaða hans á listanum:\n${describeStanding(car, all)}\n\nSvipaðir bílar, næstir honum að verði og drægni:\n${listCars(similar)}\n\nHvernig þeir eru miðað við ${car.label}:\n${listDifferences(car, similar)}`

/** Everything the model is given for a car's review */
export const reviewPrompt = (car: Car): { system: string; prompt: string } => ({
  system: carSystemPrompt,
  prompt: carFacts(car, similarTo(car)),
})

// The figures a review is written from, as the data has them rather than as
// the prompt words them, so rewording the prompt dates no review
const quoted = (car: Car) => [
  car.label,
  car.priceWithGrant,
  car.range,
  car.capacity,
  car.acceleration,
  car.power,
  car.drive,
  car.seats,
  car.timeToCharge10To80,
  car.expectedDelivery ?? null,
  car.evDatabaseUrl ?? null,
]

/**
 * The figures a review quotes, its car's and its similar cars', hashed: a
 * review is out of date once they change. Where the car stands on the list
 * is left out, as one car added moves dozens of others a little and the
 * words for it change slowly.
 */
export const reviewFactsKey = (car: Car): string =>
  createHash('sha256')
    .update(JSON.stringify([car, ...similarTo(car)].map(quoted)))
    .digest('hex')
    .slice(0, 12)

// A bound that only stops a runaway; the prompt asks for a fraction of it
const MAX_LENGTH = 3000

/**
 * The answer as the page shows it: its paragraphs, with the markdown the
 * prompt asks it not to write taken out anyway
 */
export const readReview = (text: string): CarReview['paragraphs'] | null => {
  const paragraphs = text
    .slice(0, MAX_LENGTH)
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph
        .replace(/\*\*|__|^#+\s*|^[-*•]\s+/gm, '')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(Boolean)

  return paragraphs.length > 0 ? paragraphs : null
}
