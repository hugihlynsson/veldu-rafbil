import { Snapshot } from '../types'

// @ts-ignore
const snapshots: {
  [key: string]: Snapshot
} = require('./choose-ev-snapshots-export.json')

const getHumanDate = (date: Date): string =>
  `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`

const dates = Object.values(snapshots).map((snapshot) =>
  getHumanDate(new Date(snapshot.timestamp)),
)
const uniqueDates = Array.from(new Set(dates))
const uniqueDateSnapshots = uniqueDates.map(
  (date) =>
    Object.values(snapshots).find(
      (snapshot) => date === getHumanDate(new Date(snapshot.timestamp)),
    )!,
)

const prices = uniqueDateSnapshots.map((snapshot) => {
  const carsWithPrice = snapshot.cars.filter((car) => Boolean(car.price))
  const totalPrice = carsWithPrice.reduce(
    (total, car) => total + (car.price || 0),
    0,
  )
  const averagePrice = totalPrice / carsWithPrice.length
  const date = getHumanDate(new Date(snapshot.timestamp))
  const formattedAverage = averagePrice.toLocaleString().split('.')[0]
  return `${date}, ${snapshot.cars.length}: ${formattedAverage}`
})

console.log(JSON.stringify(prices, null, 2))
