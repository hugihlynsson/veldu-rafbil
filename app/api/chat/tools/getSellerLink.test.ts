import { describe, expect, it } from 'vitest'

import { getSellerLinkTool } from './getSellerLink'
import cars from '@/modules/data/cars'
import { carRef } from '@/modules/chat/cars'
import { sellerLink } from '@/modules/sellerLink'

const run = async (car: string) =>
  // The options are only along for the ride; this tool reads none of them
  (await getSellerLinkTool.execute!({ car }, {
    toolCallId: 'test',
    messages: [],
  } as never)) as { carName: string; sellerPage?: string; error?: string }

describe('getSellerLink', () => {
  it("gives every car the seller's page from the data, tagged as the list's", async () => {
    for (const car of cars) {
      expect(await run(carRef(car)), car.id).toEqual({
        carName: car.label,
        sellerPage: sellerLink(car.sellerUrl),
      })
    }
  })

  it('reads the auðkenni whatever its case', async () => {
    const car = cars[0]!
    expect((await run(carRef(car).toUpperCase())).sellerPage).toBe(
      sellerLink(car.sellerUrl),
    )
  })

  // The model chooses the input, and a link it could steer would be one it
  // made up with extra steps
  it.each([
    'https://example.com',
    cars[0]!.sellerUrl,
    'not-a-car',
    'toString',
    '__proto__',
  ])('gives no link for %s', async (car) => {
    const result = await run(car)
    expect(result.sellerPage).toBeUndefined()
    expect(result.error).toMatch(/no car with that auðkenni/)
  })
})
