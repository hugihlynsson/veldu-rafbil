export const CHAT_SUGGESTIONS = [
  'Er hagstæðara að reka rafbíl?',
  'Hvaða rafbílar bjóða upp á 7 sæti?',
  'Hver hentar best fyrir langferðir?',
  'Hvaða rafbíll hentar best fyrir íslenskan vetur?',
  'Hvað kostar að hlaða heima?',
  'Hver er með nútímalegasta tölvuviðmótið?',
  'Hvaða rafbíll verður góður í endursölu?',
  'Hver er öruggastur fyrir börn?',
  'Hver er með stærsta skottið?',
  'Hver er flottur fyrir innanbæjarakstur?',
  'Hversu mikið minnkar drægnin í frosti?',
  'Hver er með mestu veghæðina?',
  'Hver er besti kínverski rafbíllinn?',
  'Hvaða rafbílar geta dregið hjólhýsi?',
  'Skiptir forhitun miklu máli á veturna?',
]

/**
 * Questions to start on with a comparison in view. "Hvor" asks between two
 * and "hver" among more, and either agrees with bíll, as do the adjectives.
 */
export const comparisonSuggestions = (carCount: number): string[] => {
  const which = carCount === 2 ? 'Hvor' : 'Hver'
  return [
    `${which} þeirra hentar best fyrir fjölskyldu?`,
    `${which} þeirra er bestur í vetrarfærð?`,
    `${which} þeirra kemst lengst á hleðslunni í frosti?`,
    `${which} þeirra er með stærsta skottið?`,
    `${which} þeirra er ódýrastur í rekstri?`,
    `${which} þeirra hentar best fyrir langferðir?`,
  ]
}

// Fisher-Yates — sort() with a random comparator is not a shuffle
export const getRandomSuggestions = (
  suggestions: string[],
  count: number = 3,
): string[] => {
  const shuffled = [...suggestions]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}
