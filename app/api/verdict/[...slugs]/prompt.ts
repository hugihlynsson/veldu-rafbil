import type { Car } from '@/modules/data/cars'
import type { Verdict } from '@/modules/detail/verdictEvents'
import {
  intro,
  listCars,
  listGaps,
  readReview,
  writingRules,
} from '@/modules/detail/reviewPrompt'

const comparisonSystemPrompt = `${intro} Einhver er að bera saman bílana hér að neðan og þú átt að hjálpa viðkomandi að velja á milli þeirra.

Áður en þú skrifar:
- Sæktu nánari upplýsingar um hvern bíl með fetchCarDetails, með ev-database slóðinni sem fylgir honum hér að neðan, til að vita stærð hans, farangursrými og dráttargetu. Bíll sem hefur enga slóð hefur engar slíkar upplýsingar.

${writingRules('beint fyrir neðan textann þinn')}

Svaraðu með hnitmiðuðum samanburði á bílunum, um 160 orðum í tveimur eða þremur stuttum efnisgreinum og engu öðru. Byrjaðu á því sem helst skilur þá að, segðu svo hverjum hver þeirra hentar og hvers vegna, gjarnan með því sem þú last um stærð þeirra og pláss. Nefndu bílana með tegund og gerð, til dæmis Kia EV3.`

/** What the model is told about the cars, everything it may say included */
export const verdictFacts = (compared: ReadonlyArray<Car>): string =>
  `Bílarnir:\n${listCars(compared)}\n\nMunurinn, sá besti fyrst:\n${listGaps(compared)}`

/**
 * Everything the model is given for a comparison. The verdict's cache keys on
 * it, so cars whose figures change are compared afresh.
 */
export const verdictPrompt = (
  cars: ReadonlyArray<Car>,
): { system: string; prompt: string } => ({
  system: comparisonSystemPrompt,
  prompt: verdictFacts(cars),
})

/** The answer as the page shows it, read as a car's review is */
export const readVerdict = (text: string): Verdict | null => {
  const paragraphs = readReview(text)
  return paragraphs ? { paragraphs: [...paragraphs] } : null
}
