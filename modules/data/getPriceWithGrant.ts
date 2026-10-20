import { currentGrant, type Grant } from './globals'

const getPriceWithGrant = (
  price: number,
  { amount, priceCeiling }: Grant = currentGrant,
): number => (price < priceCeiling ? price - amount : price)

export default getPriceWithGrant
