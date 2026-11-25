/**
 * Scores how well the advisor reads the car list in its system prompt: a
 * figure asked of one car among its siblings, and the best car on the whole
 * list for a question with a computed answer. Each case checks the figure in
 * the answer and the [car:…] markers, which are how the chat finds the cars.
 *
 *   node --env-file=.env.local --import ./scripts/resolve.ts scripts/eval-advisor-prompt.ts [--runs=2] [--verbose] [--dry]
 *
 * Every case is a real, billed Gemini request carrying the whole prompt, about
 * 20-35 thousand input tokens, without tools. Run it on two checkouts to
 * compare two prompts; answers vary from run to run, so a case or two between
 * them is noise rather than a result.
 */
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

import systemPrompt from '@/app/api/chat/prompt'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { advisorModel } from '@/modules/chat/model'
import { carRef, resolveCarRefs } from '@/modules/chat/cars'
import cars, { type Car } from '@/modules/data/cars'

const verbose = process.argv.includes('--verbose')
const dry = process.argv.includes('--dry')
const runs = Number(
  process.argv.find((arg) => arg.startsWith('--runs='))?.slice(7) ?? 1,
)

interface Case {
  kind: 'lookup' | 'best'
  question: string
  /** Any of these is a right answer, as figures can tie */
  expected: string[]
  /** Figures one of which the answer text must hold */
  figures: string[]
}

// A figure as the model might write it in Icelandic: 37.3 as 37,3 too
const spellings = (value: number) => {
  const separated = addDecimalSeparators(value)
  return [
    ...new Set([
      separated,
      separated.replace('.', ','),
      String(value),
      String(value).replace('.', ','),
    ]),
  ]
}

const fields = [
  {
    ask: (label: string) => `Hver er drægnin á ${label}?`,
    value: (car: Car) => car.range,
  },
  {
    ask: (label: string) => `Hversu stór er rafhlaðan í ${label}?`,
    value: (car: Car) => car.capacity,
  },
  {
    ask: (label: string) => `Hvað er ${label} lengi að hraðhlaða úr 10 í 80%?`,
    value: (car: Car) => car.timeToCharge10To80,
  },
  {
    ask: (label: string) => `Hver er hröðunin á ${label} í hundrað?`,
    value: (car: Car) => car.acceleration,
  },
  {
    ask: (label: string) => `Hvað kostar ${label}?`,
    value: (car: Car) => car.priceWithGrant,
  },
  {
    ask: (label: string) => `Hvað má ${label} draga þunga kerru?`,
    value: (car: Car) => car.towing ?? 0,
  },
]

// A car among siblings is where a misread row or a neighbour's ref shows
const modelOf = (car: Car) => car.label.split(' ').slice(0, 2).join(' ')
const siblings = Map.groupBy(cars, modelOf)
const crowded = cars
  .filter((car) => (siblings.get(modelOf(car))?.length ?? 0) >= 3)
  .filter((car) => car.towing)
  .toSorted((a, b) => a.id.localeCompare(b.id))
const LOOKUPS = 24
const step = Math.max(1, Math.floor(crowded.length / LOOKUPS))

const lookups: Case[] = crowded
  .filter((_, index) => index % step === 0)
  .slice(0, LOOKUPS)
  .map((car, index) => {
    const field = fields[index % fields.length]!
    return {
      kind: 'lookup',
      question: field.ask(car.label),
      expected: [carRef(car)],
      figures: spellings(field.value(car)),
    }
  })

const best = (
  question: string,
  among: (car: Car) => boolean,
  score: (car: Car) => number,
  figure: (car: Car) => number,
): Case => {
  const pool = cars.filter(among)
  const top = Math.max(...pool.map(score))
  const winners = pool.filter((car) => score(car) === top)
  return {
    kind: 'best',
    question,
    expected: winners.map(carRef),
    figures: winners.flatMap((car) => spellings(figure(car))),
  }
}

const price = (car: Car) => car.priceWithGrant
const bests: Case[] = [
  best(
    'Hver er ódýrasti fjórhjóladrifni rafbíllinn?',
    (car) => car.drive === 'AWD',
    (car) => -price(car),
    price,
  ),
  best(
    'Hver er ódýrasti rafbíllinn með sjö sæti?',
    (car) => car.seats >= 7,
    (car) => -price(car),
    price,
  ),
  best(
    'Hvaða rafbíll undir 6 milljónum fer lengst á hleðslunni?',
    (car) => price(car) < 6_000_000,
    (car) => car.range,
    (car) => car.range,
  ),
  best(
    'Hvaða rafbíll undir 5 milljónum er fljótastur að hraðhlaða úr 10 í 80%?',
    (car) => price(car) < 5_000_000,
    (car) => -car.timeToCharge10To80,
    (car) => car.timeToCharge10To80,
  ),
  best(
    'Hvaða rafbíll undir 7 milljónum má draga þyngsta kerru?',
    (car) => price(car) < 7_000_000,
    (car) => car.towing ?? 0,
    (car) => car.towing ?? 0,
  ),
  best(
    'Hvaða rafbíll undir 6 milljónum er sneggstur í hundrað?',
    (car) => price(car) < 6_000_000,
    (car) => -car.acceleration,
    (car) => car.acceleration,
  ),
  best(
    'Hvaða rafbíll undir 5 milljónum er með stærstu rafhlöðuna?',
    (car) => price(car) < 5_000_000,
    (car) => car.capacity,
    (car) => car.capacity,
  ),
  best(
    'Hvaða afturhjóladrifni rafbíll fer lengst á hleðslunni?',
    (car) => car.drive === 'RWD',
    (car) => car.range,
    (car) => car.range,
  ),
]

const cases = [...lookups, ...bests]

interface Result {
  case: Case
  figure: boolean
  first: boolean
  tagged: boolean
  invalidRefs: string[]
  inputTokens: number
  text: string
  refs: string[]
}

const ask = async (testCase: Case): Promise<Result> => {
  const { text, usage } = await generateText({
    model: google(advisorModel),
    system: systemPrompt,
    prompt: testCase.question,
    providerOptions: {
      google: { thinkingConfig: { thinkingLevel: 'low' } },
    },
  })
  const refs = [...text.matchAll(/\[car:([^\]]+)\]/g)].map((m) => m[1]!.trim())
  const answer = text.replace(/\[(car|q):[^\]]*\]/g, '')
  return {
    case: testCase,
    figure: testCase.figures.some((figure) => answer.includes(figure)),
    first: testCase.expected.includes(refs[0] ?? ''),
    tagged: refs.some((ref) => testCase.expected.includes(ref)),
    invalidRefs: refs.filter((ref) => resolveCarRefs([ref]).length === 0),
    inputTokens: usage.inputTokens ?? 0,
    text: answer.trim(),
    refs,
  }
}

const inParallel = async <T, R>(
  items: T[],
  limit: number,
  work: (item: T) => Promise<R>,
): Promise<R[]> => {
  const results: R[] = []
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const index = next++
      results[index] = await work(items[index]!)
    }
  }
  await Promise.all(Array.from({ length: limit }, worker))
  return results
}

const percent = (count: number, of: number) =>
  `${count}/${of} (${Math.round((count / of) * 100)}%)`

const main = async () => {
  const lines = systemPrompt.split('\n').length
  console.log(
    `${advisorModel}, prompt ${systemPrompt.length} characters in ${lines} lines, ${cases.length} cases × ${runs}`,
  )

  if (dry) {
    for (const testCase of cases) {
      console.log(
        `${testCase.question} → ${testCase.expected.join(' / ')} (${testCase.figures[0]})`,
      )
    }
    return
  }

  const all = Array.from({ length: runs }, () => cases).flat()
  const results = await inParallel(all, 4, async (testCase) => {
    try {
      return await ask(testCase)
    } catch (error) {
      console.error(`Failed: ${testCase.question}`, error)
      return undefined
    }
  })
  const done = results.filter((result) => result !== undefined)

  for (const kind of ['lookup', 'best'] as const) {
    const of = done.filter((result) => result.case.kind === kind)
    console.log(`\n${kind}`)
    console.log(
      `  figure in answer  ${percent(of.filter((r) => r.figure).length, of.length)}`,
    )
    console.log(
      `  right car first   ${percent(of.filter((r) => r.first).length, of.length)}`,
    )
    console.log(
      `  right car tagged  ${percent(of.filter((r) => r.tagged).length, of.length)}`,
    )
  }

  const refs = done.flatMap((result) => result.refs)
  const invalid = done.flatMap((result) => result.invalidRefs)
  const tokens = done.map((result) => result.inputTokens)
  console.log(
    `\nrefs that resolve  ${percent(refs.length - invalid.length, refs.length)}`,
  )
  if (invalid.length) console.log(`  invalid: ${invalid.join(', ')}`)
  console.log(
    `input tokens       ${Math.round(tokens.reduce((a, b) => a + b, 0) / tokens.length)} per answer, ${tokens.reduce((a, b) => a + b, 0)} in all`,
  )
  if (done.length < all.length) {
    console.log(`failed requests    ${all.length - done.length}`)
  }

  if (verbose) {
    for (const result of done) {
      if (result.figure && result.first) continue
      console.log(`\n✗ ${result.case.question}`)
      console.log(
        `  expected ${result.case.expected.join(' / ')}, figure ${result.case.figures[0]}`,
      )
      console.log(`  tagged ${result.refs.join(', ') || '(none)'}`)
      console.log(`  ${result.text.replaceAll('\n', '\n  ')}`)
    }
  }
}

await main()
