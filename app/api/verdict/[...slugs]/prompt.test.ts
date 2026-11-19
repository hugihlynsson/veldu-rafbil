import { describe, expect, it } from 'vitest'

import { groundClearanceText } from '@/modules/copy/groundClearanceCopy'
import cars from '@/modules/data/cars'
import { writingRules } from '@/modules/detail/writingRules'
import { verdictFacts, verdictPrompt } from './prompt'

const kia = cars.find((car) => car.label === 'Kia EV3 Long Range')!
const tesla = cars.find((car) => car.label === 'Tesla Model Y Standard Range')!

describe('verdictFacts', () => {
  const facts = verdictFacts([kia, tesla])

  it('names each car compared in full', () => {
    expect(facts).toContain(`- ${kia.label}, `)
    expect(facts).toContain(`- ${tesla.label}, `)
  })

  it('gives each car its ground clearance, unranked', () => {
    expect(facts).toContain(groundClearanceText(kia.groundClearance))
    expect(facts).not.toMatch(/^- Veghæð/m)
  })

  it('leaves out a ground clearance that is not known', () => {
    const unknown = cars.find((car) => car.groundClearance === null)!
    expect(verdictFacts([kia, unknown])).not.toContain(
      groundClearanceText(null),
    )
  })

  // The model copies a gap; left to subtract, it gets one wrong now and then
  it('works out every gap between them', () => {
    expect(facts).toContain(
      `${tesla.label} ${tesla.range} km (${kia.range - tesla.range} km minni drægni)`,
    )
  })
})

describe('verdictPrompt', () => {
  it('compares the cars, with nothing of where each stands on the list', () => {
    const { system, prompt } = verdictPrompt([kia, tesla])
    expect(system).toContain('samanburði á bílunum')
    expect(prompt).not.toContain('Staða hans')
  })

  // So a correction made for the reviews reaches the verdicts too
  it('keeps every rule the car reviews are written by', () => {
    const { system } = verdictPrompt([kia, tesla])
    for (const rule of Object.values(writingRules)) {
      expect(system).toContain(rule)
    }
  })
})
