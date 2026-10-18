import { createHash } from 'node:crypto'

import cars, { type Car } from '@/modules/data/cars'
import type { CarReview } from '@/modules/data/carReviews'
import { similarTo } from '@/modules/detail/similar'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { driveLabels } from '@/modules/data/drives'
import {
  advisorIntro as intro,
  writingRules as shared,
} from '@/modules/detail/writingRules'

const writingRules = [
  'Þegar þú skrifar:',
  shared.voice,
  '- Ekki endursegja tölurnar: þær eru í töflu beint fyrir ofan textann þinn. Segðu frekar hvað þær þýða í daglegu lífi.',
  shared.noArithmetic,
  shared.grant,
  shared.winterRange,
  '- Tölur taktu aðeins úr gögnunum hér að neðan, aldrei úr minni. Notaðu óhikað almenna þekkingu á bílnum og framleiðandanum, til dæmis hvar merkið stendur í gæðum og verði, fyrir hvað það er þekkt, hvort það rekur eigið hleðslunet eða hvernig bíllinn er í akstri: það er oft það sem kaupandi vill helst vita og tölurnar sýna ekki.',
  shared.numberStyle,
  '- Nefndu hleðsluhraða aldrei í tölum, hvorki í km/mín, kW né mínútum: fáir tengja við þær. Segðu frekar að hann hlaði hraðar eða hægar en aðrir, eða hve miklu styttri eða lengri hleðslustoppin eru, eins og það er gefið.',
  shared.agreement,
  '- Endurtaktu ekki sama orðalagið: segðu „á svipuðu verði“ eða „í sínum verðflokki“ í mesta lagi einu sinni, og þegar lesandinn veit við hvaða bíla er miðað dugar „flestir keppinautar hans“ eða að sleppa því. Byrjaðu ekki alltaf á sama hátt þegar þú snýrð þér að göllunum.',
  shared.allAvailable,
  shared.plainText,
].join('\n')

// The first thing anyone reads about a car on its page, under its figures,
// so it is written to orient: what the car is, what it is good at, and what
// it costs you, measured against every electric car sold here rather than
// against an idea of what a car should be
const carSystemPrompt = `${intro} Einhver hefur opnað síðu bílsins hér að neðan til að kynnast honum. Umsögnin þín er það fyrsta sem viðkomandi les um hann, á eftir tölunum. Hún á að gefa heiðarlega og upplýsandi mynd af því hvers konar bíll þetta er, hvar hann skarar fram úr og hvar hann gefur eftir, svo lesandinn viti hvort hann sé þess virði að skoða betur.

Áður en þú skrifar:
- Gefðu stærð, farangursrými og dráttargetu aðeins meira vægi þar sem bíllinn sker sig úr, eins og staða hans og munurinn á honum og svipuðu bílunum sýna: það sýna tölurnar á síðunni ekki. Bíll sem má ekki draga kerru nefnirðu alltaf sem galla, enda draga margir Íslendingar kerru eða hjólhýsi.
- Sama á við um ábyrgðina á rafhlöðunni: nefndu hana þar sem hún er lengri eða styttri en hjá flestum.
- Lestu hvar bíllinn stendur á listanum: meðal allra rafbílanna sem eru seldir á Íslandi og meðal þeirra sem kosta svipað. Þar sést hvað er í raun sérstakt við hann og hvað er bara venjulegt. Það sem er í meðallagi er ekki styrkleiki. Staðan er sögð í orðum, aldrei með prósentum, sæti í röð eða fjölda bíla, og þú segir hana þannig líka. Stöðuna af öllum bílunum segirðu sem lýsingu á bílnum sjálfum, til dæmis „hann hleður fremur hægt“, ekki sem samanburð við alla hina. Samanburð við aðra gerirðu við bíla á svipuðu verði, til dæmis „miðað við aðra í sínum verðflokki“. Segðu aðeins annað hvort um hverja tölu, oftast samanburðinn við bíla á svipuðu verði, og stöðuna af öllum bílunum bara þegar hún bætir einhverju við. Segi þær ólíkt, til dæmis að hann drífi mjög stutt en lengra en flestir á svipuðu verði, segðu hvort tveggja í sömu setningu svo það lesist ekki sem mótsögn.

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
3. Hvað maður gefur eftir, og hvenær einn af svipuðu bílunum væri betri kostur. Nefndu einn eða tvo mun sem skipta mestu máli, ekki upptalningu á tölum. Nefndu aðeins bíl sem er sams konar bíll og þar sem munurinn skiptir kaupanda máli, ekki fáeinir km eða smávægilegur verðmunur, aldrei fleiri en tvo og aldrei tvo sem segja það sama. Eigi enginn þeirra við, nefndu engan. Hér segirðu hvar hann gefur eftir, ekki hvar hann stendur betur en hinir: hafi hann fáa veikleika, segðu það og nefndu þann stærsta.
Endaðu á stuttri niðurstöðu um þennan bíl, sem má vera lokasetning þriðju efnisgreinar eða efnisgrein ein og sér, orðuð út frá honum frekar en eftir föstu sniði. Ekki endurtaka það sem áður er sagt.

Lesandinn er að velja á milli bíla, svo skrifaðu um það sem greinir þennan bíl frá hinum frekar en það sem á við um flesta rafbíla. Hver setning á helst að segja eitthvað sem ætti ekki jafn vel við um svipuðu bílana. Að fjórhjóladrif gefi grip í snjó og hálku segirðu til dæmis aðeins þar sem drifið greinir hann frá þeim.

Vertu heiðarleg(ur). Það sem bíllinn gerir í meðallagi gerirðu ekki að kosti: segðu það eða slepptu því. Notaðu ekki orð eins og "einstakur", "framúrskarandi" eða "frábær" nema staða hans á listanum sýni að hann skari fram úr. Segðu ekkert um hann sem staða hans segir annað um: kallaðu hann ekki rúmgóðan ef skottið er minna en hjá flestum á svipuðu verði. Framhjóla- eða afturhjóladrif er aldrei kostur í snjó og hálku. Stærð rafhlöðunnar skiptir kaupanda aðeins máli gegnum drægnina, svo nefndu hana ekki sem kost eða galla ein og sér.

Ef aðrar útfærslur sama bíls eru á listanum, nefndu eina aðeins þar sem hún bætir úr helsta galla hans, til dæmis með fjórhjóladrifi eða meiri drægni, eða sparar mikið án þess að gefa mikið eftir.

Hafi bíllinn fáa styrkleika í tölunum, segðu hvað merkið eða hönnunin færir kaupandanum og stattu við að þeir séu fáir: ekki fylla upp í með almennu hrósi.

Veldu það sem skiptir þá máli sem kaupa svona bíl: í stórum fjölskyldubíl, fjölnotabíl eða jeppa vega skott, sæti og dráttargeta þyngra en hröðun og afl, en í sportbíl er því öfugt farið. Um innréttingu, hljóðvist, hugbúnað og áreiðanleika eru engin gögn hér, en það sem almennt er vitað um merkið og bílinn máttu segja. Nefndu bíla með tegund og gerð, til dæmis Kia EV3, en þegar fleiri en ein útfærsla sömu gerðar er í gögnunum skaltu nefna útfærsluna líka, eins og bíllinn heitir þar, til dæmis Kia EV3 Long Range, svo ekki fari á milli mála við hvaða bíl er átt.`

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

// More than this behind the seats, with no figure for them folded, is the
// folded one given in its place, as the site does for a car or two: no car
// on the list carries half of it with every seat up
const MAX_SEATS_UP_CARGO = 2000
// Folding the seats at least doubles a boot; a "folded" figure barely above
// the one behind them is a slip on the page, as the Solterra's 452 l over 421
const MIN_FOLDED_GAIN = 1.5

/** A car's page, as fetchCarSpecs reads it, in numbers */
export const readDetails = (
  specs: Readonly<Record<string, string | undefined>>,
): CarDetails => {
  const read = numberIn(specs.cargoVolume)
  const folded = numberIn(specs.cargoVolumeMax)
  const cargoMax =
    folded && read && folded < read * MIN_FOLDED_GAIN ? undefined : folded
  // A pickup's figure is its bed, which no boot is measured against
  const cargo =
    specs.carBody === 'Pickup Truck' ||
    (read !== undefined && !cargoMax && read > MAX_SEATS_UP_CARGO)
      ? undefined
      : read
  return {
    body: specs.carBody,
    segment: specs.segment,
    length: numberIn(specs.length),
    cargo,
    cargoMax: cargo === undefined ? undefined : cargoMax,
    frunk: numberIn(specs.frunk),
    // A car that takes no hitch tows nothing, whatever weight the page leaves
    towing:
      specs.towHitch?.toLowerCase() === 'no' ? 0 : numberIn(specs.towingBraked),
    warrantyYears: numberIn(specs.batteryWarrantyPeriod),
    warrantyKm: numberIn(specs.batteryWarrantyMileage),
  }
}

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

// The site's body types in the words an Icelandic buyer uses for them. An
// SUV is a jepplingur or a jeppi by its size, which the model is left to say
const bodyNames: Record<string, string> = {
  SUV: 'jepplingur eða jeppi, eftir stærð',
  Sedan: 'fólksbíll með skottloki (stallbakur)',
  'Liftback Sedan': 'fólksbíll með afturhlera (hlaðbakur)',
  Hatchback: 'hlaðbakur',
  'Station/Estate': 'skutbíll',
  MPV: 'fjölnotabíll',
  'Small Passenger Van': 'fjölnotabíll byggður á sendibíl',
  'Pickup Truck': 'pallbíll',
  Cabriolet: 'blæjubíll',
}

// What ev-database adds to the list's figures, where it has a page for it
const describeDetails = (details: CarDetails | undefined): string[] => {
  if (!details) return ['engar nánari upplýsingar af ev-database']
  const { body, segment, length, cargo, cargoMax, frunk, towing } = details
  const { warrantyYears, warrantyKm } = details
  return [
    body && `yfirbygging: ${bodyNames[body] ?? body}`,
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
      const differences = [
        ...(other.drive === car.drive
          ? []
          : [driveLabels[other.drive].toLowerCase()]),
        ...metrics.flatMap(
          (metric) => compare(metric, other, car, details) ?? [],
        ),
      ]
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

// The model's other versions on the list, worked out against it as the
// similar cars are, so a review can say the drawback it names is one a
// version without it fixes, and by how much
const listVariants = (
  car: Car,
  all: ReadonlyArray<Car>,
  details: DetailsOf,
): string => {
  const variants = all.filter(
    (other) =>
      other !== car && other.make === car.make && other.model === car.model,
  )
  if (variants.length === 0) return ''
  return `\n\nAðrar útfærslur hans á listanum:\n${listCars(variants, details)}\n\nHvernig þær eru miðað við hann:\n${listDifferences(car, variants, details)}`
}

/** The same for one car, with the cars like it and where it stands among all */
export const carFacts = (
  car: Car,
  similar: ReadonlyArray<Car>,
  all: ReadonlyArray<Car> = cars,
  details: DetailsOf = noDetails,
): string =>
  `Bíllinn:\n${listCars([car], details)}\n\nStaða hans á listanum:\n${describeStanding(car, all, details)}${listVariants(car, all, details)}\n\nSvipaðir bílar, næstir honum að verði og drægni:\n${listCars(similar, details)}\n\nHvernig þeir eru miðað við ${car.label}:\n${listDifferences(car, similar, details)}`

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

/** How many questions to start on each car's page is written with */
export const QUESTION_COUNT = 10
// A starter is a pill that does not wrap, and has a phone's width to fit in
export const MAX_STARTER_LENGTH = 44

// Written after the review and from it, so they can take up what it raises
// rather than ask what it has just said. It names no trip or need as an
// example: the model copied them, and Akureyri reached 167 of 189 cars
const questionsSystemPrompt = `${intro} Einhver hefur opnað síðu bílsins hér að neðan og lesið umsögnina um hann. Neðst á síðunni getur viðkomandi spurt þig um bílinn, og þar bjóðast nokkrar spurningar til að byrja á, sem ýtt er á í stað þess að skrifa. Skrifaðu ${QUESTION_COUNT} slíkar spurningar.

Góð spurning:
- Er um þennan bíl og ætti ekki jafn vel við um hvaða rafbíl sem er.
- Fer lengra en umsögnin: tekur upp það sem hún nefnir, til dæmis galla, keppinaut eða aðra útfærslu, og spyr nánar út í það, frekar en að spyrja um það sem hún svarar þegar eða tölurnar sýna beint.
- Er það sem sá sem kaupir svona bíl vill í alvöru vita, eftir því hvers konar bíll hann er og hverjum hann hentar.
- Er spurning sem þú getur svarað af þekkingu: ekki um verð á aukahlutum, afslætti, afhendingartíma eða reynslu einstakra eigenda.

Að minnsta kosti helmingur spurninganna snýst um það sem aðeins þessi bíll vekur: einn af svipuðu bílunum, nefndan með nafni, aðra útfærslu hans, eða kost eða galla sem umsögnin nefnir.

Um efni sem á við flesta rafbíla, eins og drægni í kulda, hleðslu, langferðir, snjó, dráttargetu eða pláss fyrir barnavagn og barnabílstóla, skrifarðu í mesta lagi eina spurningu, og þá um það sem bíllinn sker sig úr í. Ekki fleiri en tvær um sama efni.

Hvernig þær eru skrifaðar:
- Eins og kaupandi myndi spyrja, á eðlilegri íslensku. Bíllinn er „hann“ og ekki nefndur með nafni, því lesandinn er á síðu hans.
- Aðra bíla nefnirðu með tegund og gerð, til dæmis Kia EV3 eða Audi e-tron GT, aldrei styttra svo það verði óljóst, og útfærsluna aðeins þar sem þarf til að greina á milli. Útfærslu hans sjálfs nægir að nefna, til dæmis GT-útfærsluna.
- Stuttar: í mesta lagi ${MAX_STARTER_LENGTH} stafir með bilum, helst færri, svo þær passi í eina línu á síma.
- Hver er ein spurning sem endar á spurningarmerki, ekki tvær í einni.
- Gættu að beygingum og samræmi.

Svaraðu með spurningunum, einni í hverri línu, án númera eða merkja, og engu öðru.`

/** What the model is given to write the questions to start on a car's page */
export const questionsPrompt = (
  car: Car,
  review: CarReview,
): { system: string; prompt: string } => ({
  system: questionsSystemPrompt,
  prompt: `${carFacts(car, similarTo(car))}\n\nUmsögnin á síðunni:\n${review.paragraphs.join('\n\n')}`,
})

/**
 * The questions in an answer as pills show them, one a line, leaving out any
 * too long for a pill or not a question at all
 */
export const readQuestions = (text: string): string[] => {
  const questions = text
    .slice(0, MAX_LENGTH)
    .split('\n')
    .map((line) =>
      line
        .replace(/^\s*(\d+[.)]|[-*•])\s+/, '')
        .replace(/\*\*|__|["„“”]/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter((line) => line.endsWith('?') && line.length <= MAX_STARTER_LENGTH)

  return [...new Set(questions)].slice(0, QUESTION_COUNT)
}
