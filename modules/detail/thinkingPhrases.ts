// What a comparison shows while the model writes its verdict on the cars. The model's
// own thoughts arrive in English whatever it is asked, so these stand in for
// them, in its own voice: the first person, with the "ég" left off. A couple
// of lines to start, then the cars themselves in no set order, and the
// closing lines on a loop until the verdict is in. The names are left
// uninflected, as a foreign car's name is in Icelandic.

/** The first line, the same on the server as in the browser */
export const firstPhrase = 'Legg bílana hlið við hlið…'

const intro = [
  'Renni yfir verðin og drægnina…',
  'Opna verðlistana frá umboðunum…',
  'Set mig í spor kaupanda…',
  'Les smáa letrið…',
  'Fletti í gegnum tækniblöðin…',
]

const aboutCar: Array<(car: string) => string> = [
  (car) => `Mæli skottið í ${car}…`,
  (car) => `Hugsa um ${car} í febrúarfrosti…`,
  (car) => `Prófa hvort golfsett komist í ${car}…`,
  (car) => `Athuga hvort ${car} ráði við hjólhýsi…`,
  (car) => `Ímynda mér ${car} á leið norður á Akureyri…`,
  (car) => `Skoða hve fljótt ${car} hleðst í Staðarskála…`,
  (car) => `Sest í aftursætið á ${car}…`,
  (car) => `Reikna með ${car} á vetrardekkjum…`,
  (car) => `Skoða hvort barnavagn komist í ${car}…`,
]

const aboutPair: Array<(a: string, b: string) => string> = [
  (a, b) => `Ber saman drægni ${a} og ${b}…`,
  (a, b) => `Læt ${a} og ${b} spyrna upp Ártúnsbrekkuna…`,
  (a, b) => `Veg verðmuninn á ${a} og ${b}…`,
  (a, b) => `Spyr mig hvort ${a} eða ${b} henti fjölskyldu betur…`,
  (a, b) => `Legg ${a} og ${b} í sama stæðið, í huganum…`,
  (a, b) => `Keyri ${a} og ${b} yfir Hellisheiði í skafrenningi…`,
  (a, b) => `Spyr tengdamömmu hvort hún kjósi ${a} eða ${b}…`,
  (a, b) => `Sé hvor kemst lengra til Egilsstaða, ${a} eða ${b}…`,
  (a, b) => `Raða ferðatöskum í ${a} og ${b}…`,
  (a, b) => `Læt ${a} og ${b} keppa um síðasta stæðið í Kringlunni…`,
  (a, b) => `Sting ${a} og ${b} í samband og sé hvor er fyrr klár…`,
  (a, b) => `Prófa ${a} og ${b} á holóttum malarvegi…`,
  (a, b) => `Sé hvor er flottari við Hallgrímskirkju, ${a} eða ${b}…`,
]

const closing = [
  'Dreg saman það sem skiptir máli…',
  'Vel réttu orðin…',
  'Fínpússa ráðleggingarnar…',
  'Legg lokahönd á samantektina…',
  'Les yfir einu sinni enn…',
]

type Random = () => number

const shuffled = <T>(list: ReadonlyArray<T>, random: Random): T[] => {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j]!, copy[i]!]
  }
  return copy
}

export interface ThinkingPhrases {
  /** The lines after the first, in order */
  phrases: string[]
  /** Where to go back to once the last has shown: the start of the closing lines */
  loopFrom: number
}

/**
 * The lines to show after the first, for cars by these names,
 * drawn afresh each time so no two waits read alike. Every car gets a line
 * of its own, and a pair or two get one between them, in no set order; a car
 * on its own page gets three.
 */
export const thinkingPhrases = (
  names: ReadonlyArray<string>,
  random: Random = Math.random,
): ThinkingPhrases => {
  const opening = shuffled(intro, random).slice(0, 2)
  const carLines = shuffled(aboutCar, random)
  const pairLines = shuffled(aboutPair, random)
  const pairs = shuffled(
    names.flatMap((a, i) => names.slice(i + 1).map((b) => [a, b] as const)),
    random,
  ).slice(0, names.length > 2 ? 2 : 1)

  const middle = shuffled(
    [
      ...names.flatMap(
        (name, index) => carLines[index % carLines.length]?.(name) ?? [],
      ),
      ...pairs.flatMap(([a, b], index) => pairLines[index]?.(a, b) ?? []),
    ],
    random,
  )

  return {
    phrases: [...opening, ...middle, ...shuffled(closing, random)],
    loopFrom: opening.length + middle.length,
  }
}

/**
 * Long enough to read the line at an easy pace, never so long it seems stuck,
 * and a little uneven, as a mind at work is
 */
export const phraseDuration = (
  phrase: string,
  random: Random = Math.random,
): number =>
  Math.round(
    Math.min(4500, Math.max(2200, 1400 + phrase.length * 45)) *
      (0.8 + random() * 0.4),
  )
