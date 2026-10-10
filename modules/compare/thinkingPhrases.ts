// What the comparison's verdict shows while the model writes it. The model's
// own thoughts arrive in English whatever it is asked, so these stand in for
// them: a couple of lines to start, then the cars themselves in no set order,
// and the closing lines on a loop until the verdict is in. Each car it really
// looks up takes the next turn, as a line of its own. The names are left
// uninflected, as a foreign car's name is in Icelandic.

/** The first line, the same on the server as in the browser */
export const FIRST_PHRASE = 'Leggur bílana hlið við hlið…'

const intro = [
  'Rennir yfir verðin og drægnina…',
  'Hellir upp á kaffi og opnar verðlistana…',
  'Setur sig í spor kaupandans…',
  'Les smáa letrið…',
  'Flettir í gegnum tækniblöðin…',
]

const aboutCar: Array<(car: string) => string> = [
  (car) => `Mælir skottið í ${car}…`,
  (car) => `Hugsar um ${car} í febrúarfrosti…`,
  (car) => `Prófar hvort golfsettið komist í ${car}…`,
  (car) => `Athugar hvort ${car} ráði við hjólhýsið…`,
  (car) => `Ímyndar sér ${car} á leið norður á Akureyri…`,
  (car) => `Skoðar hve fljótt ${car} hleðst í Staðarskála…`,
  (car) => `Sest í aftursætið á ${car}…`,
  (car) => `Reiknar með ${car} á nagladekkjum…`,
  (car) => `Skoðar hvort barnavagninn komist í ${car}…`,
]

const aboutPair: Array<(a: string, b: string) => string> = [
  (a, b) => `Ber saman drægni ${a} og ${b}…`,
  (a, b) => `Lætur ${a} og ${b} spyrna upp Ártúnsbrekkuna…`,
  (a, b) => `Vegur verðmuninn á ${a} og ${b}…`,
  (a, b) => `Spyr sig hvort ${a} eða ${b} henti fjölskyldunni betur…`,
  (a, b) => `Leggur ${a} og ${b} í sama stæðið, í huganum…`,
]

const closing = [
  'Dregur saman það sem skiptir máli…',
  'Velur réttu orðin…',
  'Fínpússar ráðleggingarnar…',
  'Leggur lokahönd á samantektina…',
  'Les yfir einu sinni enn…',
]

type Random = () => number

const shuffled = <T>(list: ReadonlyArray<T>, random: Random): T[] => {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
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
 * The lines to show after the first for a comparison of cars by these names,
 * drawn afresh each time so no two waits read alike. Every car gets a line
 * of its own, and a pair or two get one between them, in no set order.
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
      ...names.map((name, index) => carLines[index % carLines.length](name)),
      ...pairs.map(([a, b], index) => pairLines[index](a, b)),
    ],
    random,
  )

  return {
    phrases: [...opening, ...middle, ...shuffled(closing, random)],
    loopFrom: opening.length + middle.length,
  }
}

/** The line for a car the model is really looking up, shown next in turn */
export const lookupPhrase = (name: string): string =>
  `Flettir upp ${name} á ev-database.org…`

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
