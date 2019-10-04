import { IncomingMessage, ServerResponse } from 'http'
import firebaseAdmin from 'firebase-admin'
import atob from 'atob'

import { UsedCar, Snapshot } from '../../types'
import scrapeUsedCars from '../scrapeUsedCars'
import filterUsedCars from '../filterUsedCars'
import fetchLastSnapshot from '../fetchLastSnapshot'
import transferKnownData from '../transferKnownData'

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: atob(process.env.FIREBASE_PRIVATE_KEY!).replace(/\\n/g, '\n'),
  }),
  databaseURL: 'https://choose-ev.firebaseio.com',
})

export default async (_: IncomingMessage, res: ServerResponse) => {
  const database = firebaseAdmin.database()
  let lastSnapshot: Snapshot | undefined
  try {
    lastSnapshot = await fetchLastSnapshot(database)
    if (lastSnapshot) {
      const isFromLastHour =
        new Date().getTime() - lastSnapshot.timestamp < 60 * 60 * 1000
      if (isFromLastHour) {
        console.log('Returning snapshot from', lastSnapshot.date)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ cars: lastSnapshot.cars }))
        return
      }
      console.log('Snapshot too old, from:', lastSnapshot.date)
    }
  } catch (error) {
    console.log('Failed to fetch snapshot', error)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        error: 'Failed to fetch cars, could not connect to database',
      }),
    )
    return
  }

  console.log('Starting new scrape')
  let cars: Array<UsedCar> = []
  try {
    cars = await scrapeUsedCars()
  } catch (error) {
    console.log('Failed to scrape cars', error)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Failed to fetch cars' }))
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

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ cars: processedCars }))
}
