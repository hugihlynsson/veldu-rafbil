import { NextApiRequest, NextApiResponse } from 'next'
import firebaseAdmin from 'firebase-admin'
import atob from 'atob'

import { UsedCar, Snapshot } from '../../types'
import scrapeUsedCars from '../../apiHelpers/scrapeUsedCars'
import filterUsedCars from '../../apiHelpers/filterUsedCars'
import fetchLastSnapshot from '../../apiHelpers/fetchLastSnapshot'
import transferKnownData from '../../apiHelpers/transferKnownData'

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = process.env

if (
  FIREBASE_PROJECT_ID &&
  FIREBASE_CLIENT_EMAIL &&
  FIREBASE_PRIVATE_KEY &&
  !firebaseAdmin.apps.length
) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: atob(FIREBASE_PRIVATE_KEY).replace(/\\n/g, '\n'),
    }),
    databaseURL: 'https://choose-ev.firebaseio.com',
  })
} else {
  console.error(
    'Missing firebase config. Are you trying to run `next`? Try `now dev`. See README.md for more info',
  )
}

export default async (_: NextApiRequest, res: NextApiResponse) => {
  const database = firebaseAdmin.database()
  let lastSnapshot: Snapshot | undefined
  try {
    lastSnapshot = await fetchLastSnapshot(database)
    if (lastSnapshot) {
      const isFromLastHour =
        new Date().getTime() - lastSnapshot.timestamp < 60 * 60 * 1000
      if (isFromLastHour) {
        console.log('Returning snapshot from', lastSnapshot.date)
        res.json({ cars: lastSnapshot.cars })
        return
      }
      console.log('Snapshot too old, from:', lastSnapshot.date)
    }
  } catch (error) {
    console.log('Failed to fetch snapshot', error)
    res
      .status(500)
      .json({ error: 'Failed to fetch cars, could not connect to database' })
    return
  }

  console.log('Starting new scrape')
  let cars: Array<UsedCar> = []
  try {
    cars = await scrapeUsedCars()
  } catch (error) {
    console.log('Failed to scrape cars', error)
    res.status(500).json({ error: 'Failed to fetch cars' })
    return
  }

  console.log('Scrape successful. Transferring known data from last snapshot…')
  const filteredCars = filterUsedCars(cars)
  const processedCars = transferKnownData(lastSnapshot, filteredCars)

  console.log(
    'Storing scrape',
    new Date(),
    JSON.parse(JSON.stringify(processedCars))[0],
  )
  const now = new Date()
  database
    .ref(`snapshots/${now.getTime()}`)
    .set({
      timestamp: now.getTime(),
      cars: JSON.parse(JSON.stringify(processedCars)), // Trim undefined values
      date: now.toISOString(),
    })
    .catch((error) =>
      console.log('Failed to add new snapshot to Firebase', error),
    )

  res.json({ cars: processedCars })
}
