// The harness reads app/api/chat/route.ts as text, because a route file can
// only export handlers. These fail when an edit to the route breaks that, and
// then extract-prompt.mjs is the thing to update.
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import newCars from '../../../../modules/newCars'
import getPriceWithGrant from '../../../../modules/getPriceWithGrant'
import { buildSystemPrompt, productionVariant } from './extract-prompt.mjs'

const route = readFileSync(
  new URL('../../../../app/api/chat/route.ts', import.meta.url),
  'utf8',
)

describe('the chat route as the eval harness reads it', () => {
  it('yields the system prompt with the car list and the follow-up format', () => {
    const { systemPrompt, carsSummary } = buildSystemPrompt(
      route,
      newCars,
      getPriceWithGrant,
    )
    expect(carsSummary.split('\n')).toHaveLength(newCars.length)
    expect(systemPrompt).toContain(carsSummary)
    expect(systemPrompt).toContain('[q:')
  })

  it('reads the model and thinking level production runs with', () => {
    expect(productionVariant(route)).toMatch(
      /^google\/[\w.-]+@(minimal|low|medium|high)$/,
    )
  })

  it('says so when the markers are gone, rather than evaluating nonsense', () => {
    expect(() => buildSystemPrompt('export const x = 1', [], () => 0)).toThrow(
      /marker comments/,
    )
    expect(() => productionVariant('export const x = 1')).toThrow(/modelName/)
  })
})
