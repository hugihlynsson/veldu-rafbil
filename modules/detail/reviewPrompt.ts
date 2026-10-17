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
- Reiknaðu aldrei sjálf(ur). Munurinn á tölunum er reiknaður fyrir þig: taktu hann orðréttan.
- Verðin eru eftir ${grantAmountText} ríkisstyrk þar sem hann á við.
- Drægnin er samkvæmt WLTP. Í íslenskum vetri er hún nær ${Math.round(realRangeLowFactor * 100)}–${Math.round(realRangeHighFactor * 100)}% af því.
- Tölur taktu aðeins úr gögnunum hér að neðan, aldrei úr minni. Notaðu óhikað almenna þekkingu á bílnum og framleiðandanum, til dæmis hvar merkið stendur í gæðum og verði, fyrir hvað það er þekkt, hvort það rekur eigið hleðslunet eða hvernig bíllinn er í akstri: það er oft það sem kaupandi vill helst vita og tölurnar sýna ekki.
- Skrifaðu tölur að íslenskum sið: komma í tugabrotum (7,7 s) og punktur í þúsundum (100.000 kr.).
- Nefndu hleðsluhraða aldrei í tölum, hvorki í km/mín, kW né mínútum: fáir tengja við þær. Segðu frekar að hann hlaði hraðar eða hægar en aðrir, eða hve miklu styttri eða lengri hleðslustoppin eru, eins og það er gefið.
- Gættu að beygingum og samræmi („hann er góð kaup“, ekki „hann eru“), og notaðu orð um bíla en ekki fólk: lágur eða hár, ekki lágvaxinn eða hávaxinn.
- Skrifaðu eins og allir bílarnir séu fáanlegir núna: segðu ekkert um hvenær bíll kemur eða hvort hann er kominn.
- Ekkert markdown, engin feitletrun, engir listar, engar fyrirsagnir.`

const intro = `Þú ert ráðgjafi Veldu Rafbíl, íslensks vefs sem ber saman alla 100% rafdrifna bíla sem eru seldir nýir á Íslandi.`

// The first thing anyone reads about a car on its page, under its figures,
// so it is written to orient: what the car is, what it is good at, and what
// it costs you, measured against every electric car sold here rather than
// against an idea of what a car should be
const carSystemPrompt = `${intro} Einhver hefur opnað síðu bílsins hér að neðan til að kynnast honum. Umsögnin þín er það fyrsta sem viðkomandi les um hann, á eftir tölunum. Hún á að gefa heiðarlega og upplýsandi mynd af því hvers konar bíll þetta er, hvar hann skarar fram úr og hvar hann gefur eftir, svo lesandinn viti hvort hann sé þess virði að skoða betur.

Áður en þú skrifar:
- Gefðu stærð, farangursrými og dráttargetu aðeins meira vægi þar sem bíllinn sker sig úr, eins og staða hans og munurinn á honum og svipuðu bílunum sýna: það sýna tölurnar á síðunni ekki. Bíll sem má ekki draga kerru nefnirðu alltaf sem galla, enda draga margir Íslendingar kerru eða hjólhýsi.
- Sama á við um ábyrgðina á rafhlöðunni: nefndu hana þar sem hún er lengri eða styttri en hjá flestum.
- Lestu hvar bíllinn stendur á listanum: meðal allra rafbílanna sem eru seldir á Íslandi og meðal þeirra sem kosta svipað. Þar sést hvað er í raun sérstakt við hann og hvað er bara venjulegt. Það sem er í meðallagi er ekki styrkleiki. Staðan er sögð í orðum, aldrei með prósentum, sæti í röð eða fjölda bíla, og þú segir hana þannig líka. Stöðuna af öllum bílunum segirðu sem lýsingu á bílnum sjálfum, til dæmis „hann hleður fremur hægt“, ekki sem samanburð við alla hina. Samanburð við aðra gerirðu við bíla á svipuðu verði, til dæmis „miðað við aðra í sínum verðflokki“. Segðu aðeins annað hvort um hverja tölu, oftast samanburðinn við bíla á svipuðu verði, og stöðuna af öllum bílunum bara þegar hún bætir einhverju við.

Það sem skiptir íslenska kaupendur mestu, eftir því sem á við þennan bíl:
- Hvort drægnin dugar í vetrarkulda, á milli landshluta og ekki bara innanbæjar.
- Hraðhleðsla á langferðum, þar sem hleðslustöðvar eru strjálar utan höfuðborgarsvæðisins.
- Fjórhjóladrif í snjó, hálku og á malarvegum.
- Pláss: farangursrými, sætafjöldi og dráttargeta fyrir kerru eða hjólhýsi.
- Verðið eftir styrk og hvað maður fær fyrir það, til dæmis verð á hvern km drægni.
Veldu það sem segir mest um þennan bíl. Ekki fara yfir allt.

${writingRules}

Svaraðu með um 150 orðum í þremur eða fjórum stuttum efnisgreinum og engu öðru:
1. Lýstu bílnum sjálfum: byrjaðu á hvers konar bíll hann er, yfirbyggingu og stærð eins og gögnin segja hana, á íslensku (til dæmis smábíll, hlaðbakur, fólksbíll, jepplingur, jeppi eða fjölnotabíll), og svo hvað einkennir hann helst og hverjum hann hentar. Nefndu enga aðra bíla hér: samanburðurinn kemur síðar. Lýstu honum með því sem helst greinir hann frá svipuðu bílunum, ekki orðum sem gætu átt við hvaða bíl sem er.
2. Aðrir helstu styrkleikar hans og hvað þeir þýða í daglegu lífi.
3. Hvað maður gefur eftir, og hvenær einn af svipuðu bílunum væri betri kostur. Nefndu einn eða tvo mun sem skipta mestu máli, ekki upptalningu á tölum. Nefndu aðeins bíl sem er sams konar bíll og þar sem munurinn skiptir kaupanda máli, ekki fáeinir km eða smávægilegur verðmunur, og aldrei tvo bíla sem segja það sama. Eigi enginn þeirra við, nefndu engan.
Endaðu á stuttri niðurstöðu um þennan bíl, sem má vera lokasetning þriðju efnisgreinar eða efnisgrein ein og sér, orðuð út frá honum frekar en eftir föstu sniði. Ekki endurtaka það sem áður er sagt.

Lesandinn er að velja á milli bíla, svo skrifaðu um það sem greinir þennan bíl frá hinum frekar en það sem á við um flesta rafbíla. Hver setning á helst að segja eitthvað sem ætti ekki jafn vel við um svipuðu bílana. Að fjórhjóladrif gefi grip í snjó og hálku segirðu til dæmis aðeins þar sem drifið greinir hann frá þeim.

Vertu heiðarleg(ur). Það sem bíllinn gerir í meðallagi gerirðu ekki að kosti: segðu það eða slepptu því. Notaðu ekki orð eins og "einstakur", "framúrskarandi" eða "frábær" nema staða hans á listanum sýni að hann skari fram úr. Um innréttingu, hljóðvist, hugbúnað og áreiðanleika eru engin gögn hér, en það sem almennt er vitað um merkið og bílinn máttu segja. Nefndu bíla með tegund og gerð, til dæmis Kia EV3, en þegar fleiri en ein útfærsla sömu gerðar er í gögnunum skaltu nefna útfærsluna líka, eins og bíllinn heitir þar, til dæmis Kia EV3 Long Range, svo ekki fari á milli mála við hvaða bíl er átt.`

type Standing = 'first' | 'top' | 'above' | 'below' | 'bottom'

interface Metric {
  label: string
  better: 'higher' | 'lower'
  /** Nothing for a figure only ev-database has, on a car it has none for */
  value: (car: Car, details: DetailsOf) => number | undefined
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
    | ((other: Car, car: Car, details: DetailsOf) => string | undefined)
  /** Where a car stands among those at its price, against them */
  standing: Record<Standing, string>
  /**
   * Where it stands among all of them, said of the car alone: "hleður fremur
   * hægt" reads as advice, "hleður hægar en flestir" as a league table
   */
  plain: Record<Standing, string>
  /** Said of a car with none of it at all, wherever that leaves it */
  none?: string
}

/** What ev-database says of a car that the list does not, as numbers */
export interface CarDetails {
  body?: string
  segment?: string
  /** In mm, as are the rest in litres, kg, years and km */
  length?: number
  cargo?: number
  cargoMax?: number
  frunk?: number
  towing?: number
  warrantyYears?: number
  warrantyKm?: number
}

export type DetailsOf = (car: Car) => CarDetails | undefined

const noDetails: DetailsOf = () => undefined

// "160,000 km", "8 years": the number in it, if there is one
const numberIn = (text?: string): number | undefined => {
  const value = Number(text?.replace(/[^\d.]/g, ''))
  return text && Number.isFinite(value) ? value : undefined
}

/** A car's page, as fetchCarSpecs reads it, in numbers */
export const readDetails = (
  specs: Readonly<Record<string, string | undefined>>,
): CarDetails => ({
  body: specs.carBody,
  segment: specs.segment,
  length: numberIn(specs.length),
  cargo: numberIn(specs.cargoVolume),
  cargoMax: numberIn(specs.cargoVolumeMax),
  frunk: numberIn(specs.frunk),
  // A car that takes no hitch tows nothing, whatever weight the page leaves
  towing:
    specs.towHitch?.toLowerCase() === 'no' ? 0 : numberIn(specs.towingBraked),
  warrantyYears: numberIn(specs.batteryWarrantyPeriod),
  warrantyKm: numberIn(specs.batteryWarrantyMileage),
})

// With a decimal comma, as the model would otherwise copy the point into
// Icelandic text
const decimal = (value: number) => String(value).replace('.', ',')
const oneDecimal = (value: number) => decimal(Number(value.toFixed(1)))

/** How another car differs from this one on a figure, or nothing if not */
const compare = (
  metric: Metric,
  other: Car,
  car: Car,
  details: DetailsOf,
): string | undefined => {
  if (typeof metric.difference === 'function') {
    return metric.difference(other, car, details)
  }
  const { format, more, less } = metric.difference
  const theirs = metric.value(other, details)
  const its = metric.value(car, details)
  if (theirs === undefined || its === undefined) return undefined
  const gap = theirs - its
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
    plain: {
      first: 'ódýrastur allra',
      top: 'mjög ódýr',
      above: 'fremur ódýr',
      below: 'fremur dýr',
      bottom: 'mjög dýr',
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
    plain: {
      first: 'drífur lengst allra',
      top: 'drífur mjög langt',
      above: 'drífur fremur langt',
      below: 'drífur fremur stutt',
      bottom: 'drífur mjög stutt',
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
    plain: {
      first: 'ódýrastur allra á hvern km drægni',
      top: 'mjög ódýr á hvern km drægni',
      above: 'fremur ódýr á hvern km drægni',
      below: 'fremur dýr á hvern km drægni',
      bottom: 'mjög dýr á hvern km drægni',
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
    plain: {
      first: 'hleður hraðast allra',
      top: 'hleður mjög hratt',
      above: 'hleður fremur hratt',
      below: 'hleður fremur hægt',
      bottom: 'hleður mjög hægt',
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
    plain: {
      first: 'með stærstu rafhlöðuna af öllum',
      top: 'með mjög stóra rafhlöðu',
      above: 'með fremur stóra rafhlöðu',
      below: 'með fremur litla rafhlöðu',
      bottom: 'með mjög litla rafhlöðu',
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
    plain: {
      first: 'sneggstur allra',
      top: 'mjög snöggur',
      above: 'fremur snöggur',
      below: 'fremur hægur',
      bottom: 'mjög hægur',
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
    plain: {
      first: 'aflmestur allra',
      top: 'mjög aflmikill',
      above: 'fremur aflmikill',
      below: 'fremur aflítill',
      bottom: 'mjög aflítill',
    },
  },
  {
    label: 'Farangursrými',
    better: 'higher',
    value: (car, details) => details(car)?.cargo,
    difference: {
      format: (gap) => `${addDecimalSeparators(gap)} l`,
      more: (gap) => `${gap} stærra skott`,
      less: (gap) => `${gap} minna skott`,
    },
    standing: {
      first: 'með stærsta skottið',
      top: 'með einu af stærstu skottunum',
      above: 'með stærra skott en flestir',
      below: 'með minna skott en flestir',
      bottom: 'með einu af minnstu skottunum',
    },
    plain: {
      first: 'með stærsta skott allra',
      top: 'með mjög stórt skott',
      above: 'með fremur stórt skott',
      below: 'með fremur lítið skott',
      bottom: 'með mjög lítið skott',
    },
  },
  {
    label: 'Dráttargeta',
    better: 'higher',
    value: (car, details) => details(car)?.towing,
    difference: (other, car, details) => {
      const theirs = details(other)?.towing
      const its = details(car)?.towing
      if (theirs === undefined || its === undefined || theirs === its) {
        return undefined
      }
      if (theirs === 0) return 'má ekki draga kerru'
      if (its === 0)
        return `má draga allt að ${addDecimalSeparators(theirs)} kg`
      const gap = `${addDecimalSeparators(Math.abs(theirs - its))} kg`
      return theirs > its
        ? `${gap} meiri dráttargeta`
        : `${gap} minni dráttargeta`
    },
    standing: {
      first: 'dregur mest',
      top: 'meðal þeirra sem draga mest',
      above: 'dregur meira en flestir',
      below: 'dregur minna en flestir',
      bottom: 'meðal þeirra sem draga minnst',
    },
    plain: {
      first: 'dregur mest allra',
      top: 'má draga mjög þungt',
      above: 'má draga fremur þungt',
      below: 'má draga fremur lítið',
      bottom: 'má draga mjög lítið',
    },
    none: 'má ekki draga kerru',
  },
  // Neither longer nor shorter is better: roomier, or easier to park.
  // `better` only orders them, and the words say which way it stands
  {
    label: 'Lengd',
    better: 'higher',
    value: (car, details) => details(car)?.length,
    difference: (other, car, details) => {
      const theirs = details(other)?.length
      const its = details(car)?.length
      if (theirs === undefined || its === undefined) return undefined
      const cm = Math.round((theirs - its) / 10)
      // A few cm is the same size of car
      if (Math.abs(cm) < 5) return undefined
      return cm > 0 ? `${cm} cm lengri` : `${-cm} cm styttri`
    },
    standing: {
      first: 'lengstur',
      top: 'meðal þeirra lengstu',
      above: 'lengri en flestir',
      below: 'styttri en flestir',
      bottom: 'meðal þeirra stystu',
    },
    plain: {
      first: 'lengstur allra',
      top: 'mjög langur',
      above: 'fremur langur',
      below: 'fremur stuttur',
      bottom: 'mjög stuttur',
    },
  },
  {
    label: 'Ábyrgð á rafhlöðu',
    better: 'higher',
    value: (car, details) => details(car)?.warrantyYears,
    difference: {
      format: (gap) => `${gap} ${gap === 1 ? 'ári' : 'árum'}`,
      more: (gap) => `ábyrgð á rafhlöðu ${gap} lengri`,
      less: (gap) => `ábyrgð á rafhlöðu ${gap} styttri`,
    },
    standing: {
      first: 'með lengstu ábyrgðina á rafhlöðunni',
      top: 'með einni lengstu ábyrgðinni á rafhlöðunni',
      above: 'með lengri ábyrgð á rafhlöðunni en flestir',
      below: 'með styttri ábyrgð á rafhlöðunni en flestir',
      bottom: 'með einni stystu ábyrgðinni á rafhlöðunni',
    },
    plain: {
      first: 'með lengstu ábyrgð allra á rafhlöðunni',
      top: 'með mjög langa ábyrgð á rafhlöðunni',
      above: 'með fremur langa ábyrgð á rafhlöðunni',
      below: 'með fremur stutta ábyrgð á rafhlöðunni',
      bottom: 'með mjög stutta ábyrgð á rafhlöðunni',
    },
  },
]

// What ev-database adds to the list's figures, where it has a page for it
const describeDetails = (details: CarDetails | undefined): string[] => {
  if (!details) return ['engar nánari upplýsingar af ev-database']
  const { body, segment, length, cargo, cargoMax, frunk, towing } = details
  const { warrantyYears, warrantyKm } = details
  return [
    body && `yfirbygging: ${body}`,
    segment && `stærðarflokkur: ${segment}`,
    length && `${decimal(Number((length / 1000).toFixed(2)))} m á lengd`,
    cargo &&
      `${addDecimalSeparators(cargo)} l farangursrými${cargoMax ? ` (${addDecimalSeparators(cargoMax)} l með aftursætin niðri)` : ''}`,
    frunk && `${addDecimalSeparators(frunk)} l framskott`,
    towing === 0
      ? 'má ekki draga kerru'
      : towing && `má draga ${addDecimalSeparators(towing)} kg`,
    warrantyYears &&
      `${warrantyYears} ára ábyrgð á rafhlöðu${warrantyKm ? ` eða ${addDecimalSeparators(warrantyKm)} km` : ''}`,
  ].filter((part): part is string => Boolean(part))
}

// Its charging is left to its standing and the comparisons, which say it
// without a figure. When it arrives is left out too: a review kept for years
// would read as dated by it
const describeCar = (car: Car, details: DetailsOf): string =>
  [
    car.label,
    `${addDecimalSeparators(car.priceWithGrant)} kr.${car.hasGrant ? ' eftir styrk' : ', fær ekki styrk'}`,
    `${car.range} km drægni (WLTP)`,
    `${decimal(car.capacity)} kWh rafhlaða`,
    `0-100 km/klst á ${decimal(car.acceleration)} s`,
    `${car.power} kW`,
    driveLabels[car.drive].toLowerCase(),
    `allt að ${car.seats} sæti`,
    ...describeDetails(details(car)),
  ].join(', ')

const listCars = (cars: ReadonlyArray<Car>, details: DetailsOf) =>
  cars.map((car) => `- ${describeCar(car, details)}`).join('\n')

// Each similar car said against this one rather than against the best of
// them, so a difference the model quotes is one between the two cars it names
const listDifferences = (
  car: Car,
  similar: ReadonlyArray<Car>,
  details: DetailsOf,
) =>
  similar
    .map((other) => {
      const differences = metrics.flatMap(
        (metric) => compare(metric, other, car, details) ?? [],
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
// A figure most of them share is ordinary, as the warranty most have is, and
// otherwise a tie counts half, so one shared with a few does not count as
// either beating them or losing to them
const standingAmong = (
  words: Record<Standing, string>,
  metric: Metric,
  car: Car,
  others: ReadonlyArray<Car>,
  details: DetailsOf,
): string => {
  const its = metric.value(car, details)!
  if (its === 0 && metric.none) return metric.none
  const values = others.flatMap((other) => metric.value(other, details) ?? [])
  const ahead = values.filter((value) =>
    metric.better === 'lower' ? its < value : its > value,
  ).length
  const tied = values.filter((value) => value === its).length
  if (tied >= values.length / 2) return 'í meðallagi'
  const beaten = (ahead + tied / 2) / values.length

  if (beaten === 1) return words.first
  if (beaten >= 0.85) return words.top
  if (beaten >= 0.6) return words.above
  if (beaten > 0.4) return 'í meðallagi'
  if (beaten > 0.15) return words.below
  return words.bottom
}

/**
 * Where the car stands among every other car on the list, and among those at
 * a similar price, on each figure: what makes a number good or ordinary,
 * worked out so the model need not guess it
 */
export const describeStanding = (
  car: Car,
  all: ReadonlyArray<Car> = cars,
  details: DetailsOf = noDetails,
): string =>
  metrics
    .flatMap((metric) => {
      if (metric.value(car, details) === undefined) return []
      // Only those it has the figure for: ev-database lacks a few
      const others = all.filter(
        (other) => other !== car && metric.value(other, details) !== undefined,
      )
      if (others.length === 0) return []
      const band = others.filter(
        (other) =>
          Math.abs(other.priceWithGrant - car.priceWithGrant) <=
          car.priceWithGrant * PRICE_BAND,
      )
      const overall = `af öllum: ${standingAmong(metric.plain, metric, car, others, details)}`
      // Price is what the band is cut by, so it says nothing within it
      const nearby =
        band.length >= MIN_BAND && metric.label !== 'Verð'
          ? `; miðað við aðra á svipuðu verði: ${standingAmong(metric.standing, metric, car, band, details)}`
          : ''
      return [`- ${metric.label} — ${overall}${nearby}`]
    })
    .join('\n')

/** The same for one car, with the cars like it and where it stands among all */
export const carFacts = (
  car: Car,
  similar: ReadonlyArray<Car>,
  all: ReadonlyArray<Car> = cars,
  details: DetailsOf = noDetails,
): string =>
  `Bíllinn:\n${listCars([car], details)}\n\nStaða hans á listanum:\n${describeStanding(car, all, details)}\n\nSvipaðir bílar, næstir honum að verði og drægni:\n${listCars(similar, details)}\n\nHvernig þeir eru miðað við ${car.label}:\n${listDifferences(car, similar, details)}`

/**
 * Everything the model is given for a car's review, with what ev-database
 * says of each car, which only a script with the network can read
 */
export const reviewPrompt = (
  car: Car,
  details: DetailsOf = noDetails,
): { system: string; prompt: string } => ({
  system: carSystemPrompt,
  prompt: carFacts(car, similarTo(car), cars, details),
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
  car.evDatabaseUrl ?? null,
]

/**
 * The figures a review quotes, its car's and its similar cars', hashed: a
 * review is out of date once they change. Where the car stands on the list
 * is left out, as one car added moves dozens of others a little and the
 * words for it change slowly, and so is what ev-database says, which the
 * test that holds reviews to their figures has no network to read.
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
