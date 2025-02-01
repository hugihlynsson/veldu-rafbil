import { grantAmount } from './globals'

export default (price: number): number =>
  price < 10_000_000 ? price - grantAmount : price
