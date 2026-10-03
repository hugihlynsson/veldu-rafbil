import { grantAmount, grantPriceCeiling } from './globals'

const getPriceWithGrant = (price: number): number =>
  price < grantPriceCeiling ? price - grantAmount : price

export default getPriceWithGrant
