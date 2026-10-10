// What the comparison's verdict shows while the model writes it. The model's
// own thoughts arrive in English whatever it is asked, so these stand in for
// them: a few lines to start, some about the cars themselves, and the last
// few on a loop until the verdict is in. Each car it really looks up takes
// the next turn, as a line of its own. The names are left uninflected, as
// a foreign car's name is in Icelandic.

const intro = [
  'Leggur bílana hlið við hlið…',
  'Rennir yfir verðin og drægnina…',
  'Hellir upp á kaffi og opnar verðlistana…',
  'Setur sig í spor kaupandans…',
  'Les smáa letrið á bílunum…',
]

const aboutCar: Array<(car: string) => string> = [
  (car) => `Mælir skottið í ${car}…`,
  (car) => `Hugsar um ${car} í febrúarfrosti…`,
  (car) => `Prófar hvort golfsettið komist í ${car}…`,
  (car) => `Athugar hvort ${car} ráði við hjólhýsið…`,
  (car) => `Ímyndar sér ${car} á leið norður á Akureyri…`,
  (car) => `Skoðar hve fljótt ${car} hleðst í Staðarskála…`,
  (car) => `Kíkir undir húddið á ${car}…`,
]

const aboutPair: Array<(a: string, b: string) => string> = [
  (a, b) => `Ber saman drægni ${a} og ${b}…`,
  (a, b) => `Lætur ${a} og ${b} spyrna upp Ártúnsbrekkuna…`,
  (a, b) => `Vegur verðmuninn á ${a} og ${b}…`,
  (a, b) => `Spyr sig hvort ${a} eða ${b} henti fjölskyldunni betur…`,
]

const closing = [
  'Dregur saman það sem skiptir máli…',
  'Velur réttu orðin…',
  'Fínpússar ráðleggingarnar…',
  'Leggur lokahönd á samantektina…',
]

// The same comparison always gets the same lines, so the server's render and
// the browser's agree, while another comparison gets others
const seedOf = (text: string): number =>
  [...text].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7)

const from = <T>(list: ReadonlyArray<T>, seed: number, index: number): T =>
  list[(seed + index) % list.length]

export interface ThinkingPhrases {
  phrases: string[]
  /** Where to go back to once the last has shown: the start of the closing lines */
  loopFrom: number
}

/** The lines to show, in order, for a comparison of cars by these names */
export const thinkingPhrases = (
  names: ReadonlyArray<string>,
): ThinkingPhrases => {
  const seed = seedOf(names.join('|'))
  const pairs =
    names.length > 2
      ? [
          [0, 1],
          [1, 2],
        ]
      : [
          [0, 1],
          [1, 0],
        ]

  const aboutCars = names.map((name, index) =>
    from(aboutCar, seed, index)(name),
  )
  const aboutPairs = pairs.map(([a, b], index) =>
    from(aboutPair, seed, index)(names[a], names[b]),
  )
  // A pair after the first two cars, and the second after the rest
  const middle = [
    ...aboutCars.slice(0, 2),
    aboutPairs[0],
    ...aboutCars.slice(2),
    aboutPairs[1],
  ]
  const opening = [from(intro, seed, 0), from(intro, seed, 1)]

  return {
    phrases: [...opening, ...middle, ...closing],
    loopFrom: opening.length + middle.length,
  }
}

/** The line for a car the model is really looking up, shown next in turn */
export const lookupPhrase = (name: string): string =>
  `Flettir upp ${name} á ev-database.org…`

/** Long enough to read the line at an easy pace, and never so long it seems stuck */
export const phraseDuration = (phrase: string): number =>
  Math.min(4500, Math.max(2200, 1400 + phrase.length * 45))
