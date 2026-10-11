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
- Byggðu aðeins á gögnunum hér að neðan og því sem fetchCarDetails skilar, ekki á því sem þú heldur að þú vitir um bílana.
- Ekkert markdown, engin feitletrun, engir listar, engar fyrirsagnir.`

const intro = `Þú ert ráðgjafi Veldu Rafbíl, íslensks vefs sem ber saman alla 100% rafdrifna bíla sem eru seldir nýir á Íslandi.`

// The first thing anyone reads about a car on its page, under its figures,
// so it is written to orient: what the car is, what it is good at, and what
// it costs you, measured against every electric car sold here rather than
// against an idea of what a car should be
const carSystemPrompt = `${intro} Einhver hefur opnað síðu bílsins hér að neðan til að kynnast honum. Umsögnin þín er það fyrsta sem viðkomandi les um hann, á eftir tölunum. Hún á að gefa heiðarlega og upplýsandi mynd af því hvers konar bíll þetta er, hvar hann skarar fram úr og hvar hann gefur eftir, svo lesandinn viti hvort hann sé þess virði að skoða betur.

Áður en þú skrifar:
- Sæktu nánari upplýsingar um bílinn með fetchCarDetails, með ev-database slóðinni sem fylgir honum hér að neðan, til að vita stærð hans, farangursrými, framskott og dráttargetu. Ef hann hefur enga slóð eru engar slíkar upplýsingar til.
- Lestu hvar bíllinn stendur á listanum: meðal allra rafbílanna sem eru seldir á Íslandi og meðal þeirra sem kosta svipað. Þar sést hvað er í raun sérstakt við hann og hvað er bara venjulegt. Það sem er í meðallagi er ekki styrkleiki. Staðan er sögð í orðum, til dæmis „meðal þeirra ódýrustu“ eða „dýrari en flestir“: segðu hana þannig líka, aldrei með prósentum, sæti í röð eða fjölda bíla.

Það sem skiptir íslenska kaupendur mestu, eftir því sem á við þennan bíl:
- Hvort drægnin dugar í vetrarkulda, á milli landshluta og ekki bara innanbæjar.
- Hraðhleðsla á langferðum, þar sem hleðslustöðvar eru strjálar utan höfuðborgarsvæðisins.
- Fjórhjóladrif í snjó, hálku og á malarvegum.
- Pláss: farangursrými, sætafjöldi og dráttargeta fyrir kerru eða hjólhýsi.
- Verðið eftir styrk og hvað maður fær fyrir það, til dæmis verð á hvern km drægni.
Veldu það sem segir mest um þennan bíl. Ekki fara yfir allt.

${writingRules}

Svaraðu með um 150 orðum í fjórum stuttum efnisgreinum og engu öðru:
1. Hvers konar bíll þetta er og hverjum hann hentar best, í einni eða tveimur setningum.
2. Tveir eða þrír helstu styrkleikar hans og hvað þeir þýða í daglegu lífi.
3. Hvað maður gefur eftir, og hvenær einn af svipuðu bílunum væri betri kostur, með muninum úr gögnunum.
4. Niðurstaða í einni eða tveimur setningum sem dregur hitt saman: fyrir hvern hann eru góð kaup og fyrir hvern ekki. Ekki endurtaka fyrstu efnisgreinina.

Vertu heiðarleg(ur). Það sem bíllinn gerir í meðallagi gerirðu ekki að kosti: segðu það eða slepptu því. Notaðu ekki orð eins og "einstakur", "framúrskarandi" eða "frábær" nema staða hans á listanum sýni að hann skari fram úr. Fjallaðu ekki um innréttingu, efnisval, þægindi, hljóðvist, hugbúnað eða áreiðanleika: um það eru engin gögn hér. Nefndu bíla með tegund og gerð, til dæmis Kia EV3.`

interface Metric {
  label: string
  better: 'higher' | 'lower'
  value: (car: Car) => number
  format: (value: number) => string
  /** The gap behind the leader, as the trailing car is described by it */
  behind: (gap: string) => string
  /** Where a car stands among others on it, from first of all to among the worst */
  standing: Record<'first' | 'top' | 'above' | 'below' | 'bottom', string>
}

const oneDecimal = (value: number) => String(Number(value.toFixed(1)))

const metrics: Metric[] = [
  {
    label: 'Verð',
    better: 'lower',
    value: (car) => car.priceWithGrant,
    format: (value) => `${addDecimalSeparators(value)} kr.`,
    behind: (gap) => `${gap} dýrari`,
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
    format: (value) => `${value} km`,
    behind: (gap) => `${gap} minni drægni`,
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
    format: (value) => `${addDecimalSeparators(value)} kr.`,
    behind: (gap) => `${gap} dýrari á km`,
    standing: {
      first: 'ódýrastur á hvern km drægni',
      top: 'meðal þeirra ódýrustu á hvern km drægni',
      above: 'ódýrari á hvern km drægni en flestir',
      below: 'dýrari á hvern km drægni en flestir',
      bottom: 'meðal þeirra dýrustu á hvern km drægni',
    },
  },
  {
    label: 'Hraðhleðsla, drægni bætt við á mínútu',
    better: 'higher',
    value: (car) => car.kmPerMinuteCharged,
    // Three figures, as the list quotes it, without the zeros a gap would trail
    format: (value) => `${Number(value.toPrecision(3))} km/mín`,
    behind: (gap) => `${gap} hægari`,
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
    format: (value) => `${oneDecimal(value)} kWh`,
    behind: (gap) => `${gap} minni`,
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
    format: (value) => `${oneDecimal(value)} s`,
    behind: (gap) => `${gap} hægari`,
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
    format: (value) => `${value} kW`,
    behind: (gap) => `${gap} minna afl`,
    standing: {
      first: 'aflmestur',
      top: 'meðal þeirra aflmestu',
      above: 'aflmeiri en flestir',
      below: 'aflminni en flestir',
      bottom: 'meðal þeirra aflminnstu',
    },
  },
]

const describeCar = (car: Car): string =>
  [
    car.label,
    car.evDatabaseUrl
      ? `ev-database: ${car.evDatabaseUrl}`
      : 'engin ev-database slóð',
    `${addDecimalSeparators(car.priceWithGrant)} kr.${car.hasGrant ? ' eftir styrk' : ', fær ekki styrk'}`,
    `${car.range} km drægni (WLTP)`,
    `${car.capacity} kWh rafhlaða`,
    `hraðhleðsla 10-80% á ${car.timeToCharge10To80} mín`,
    `0-100 km/klst á ${car.acceleration} s`,
    `${car.power} kW`,
    driveLabels[car.drive].toLowerCase(),
    `allt að ${car.seats} sæti`,
    car.expectedDelivery
      ? `ekki kominn, væntanlegur ${car.expectedDelivery.toLowerCase()}`
      : 'fáanlegur núna',
  ].join(', ')

// The model is given every gap worked out, so a figure in its text is one it
// copied rather than one it subtracted
const describeMetric = (metric: Metric, compared: ReadonlyArray<Car>) => {
  const ranked = compared.toSorted((a, b) =>
    metric.better === 'lower'
      ? metric.value(a) - metric.value(b)
      : metric.value(b) - metric.value(a),
  )
  const leader = metric.value(ranked[0])

  const entries = ranked.map((car) => {
    const value = metric.value(car)
    const gap = Math.abs(value - leader)
    const standing =
      gap === 0
        ? 'fremstur'
        : metric.behind(metric.format(Number(gap.toPrecision(6))))
    return `${car.label} ${metric.format(value)} (${standing})`
  })

  return `${metric.label}: ${entries.join(', ')}`
}

const listCars = (cars: ReadonlyArray<Car>) =>
  cars.map((car) => `- ${describeCar(car)}`).join('\n')

const listGaps = (cars: ReadonlyArray<Car>) =>
  metrics.map((metric) => `- ${describeMetric(metric, cars)}`).join('\n')

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
      const overall = `${standingAmong(metric, car, others)} á listanum öllum`
      // Price is what the band is cut by, so it says nothing within it
      const nearby =
        withBand && metric.label !== 'Verð'
          ? `; ${standingAmong(metric, car, band)} meðal bíla á svipuðu verði`
          : ''
      return `- ${metric.label}: ${overall}${nearby}`
    })
    .join('\n')
}

/** The same for one car, with the cars like it and where it stands among all */
export const carFacts = (
  car: Car,
  similar: ReadonlyArray<Car>,
  all: ReadonlyArray<Car> = cars,
): string =>
  `Bíllinn:\n${listCars([car])}\n\nStaða hans á listanum:\n${describeStanding(car, all)}\n\nSvipaðir bílar, næstir honum að verði og drægni:\n${listCars(similar)}\n\nMunurinn á honum og þeim, sá besti fyrst:\n${listGaps([car, ...similar])}`

/** Everything the model is given for a car's review */
export const reviewPrompt = (car: Car): { system: string; prompt: string } => ({
  system: carSystemPrompt,
  prompt: carFacts(car, similarTo(car)),
})

/**
 * The figures a review quotes, its car's and its similar cars', hashed: a
 * review is out of date once they change. Where the car stands on the list
 * is left out, as one car added moves dozens of others a little and the
 * words for it change slowly.
 */
export const reviewFactsKey = (car: Car): string =>
  createHash('sha256')
    .update(listCars([car, ...similarTo(car)]))
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
