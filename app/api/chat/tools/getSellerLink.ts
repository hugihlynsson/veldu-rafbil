import { tool } from 'ai'
import { z } from 'zod'
import cars from '@/modules/data/cars'
import { carRef } from '@/modules/chat/cars'
import { sellerLink } from '@/modules/sellerLink'

// The model names a car, never a URL: the link handed back is the one the car
// data holds, so an answer cannot point a buyer at a page it made up
const sellerPages = new Map(
  cars.map(
    (car) =>
      [
        carRef(car),
        { carName: car.label, sellerPage: sellerLink(car.sellerUrl) },
      ] as const,
  ),
)

/** The seller-link tool. Nothing is fetched, so it needs no call limit. */
export const getSellerLinkTool = tool({
  description:
    "Get the link to the seller's page for a car, where a buyer can see it, book a test drive or order it. Use it whenever the answer sends the buyer to the seller, the dealer or the maker, whether or not a link was asked for, and give the link exactly as it comes back. It says nothing else about the seller.",
  inputSchema: z.object({
    car: z
      .string()
      .max(100)
      .describe("The car's auðkenni, exactly as the car list gives it"),
  }),
  execute: async ({ car }) =>
    sellerPages.get(car.toLowerCase()) ?? {
      carName: car,
      error:
        'There is no car with that auðkenni, so there is no link. Check the auðkenni against the car list, and never write a link of your own.',
    },
})
