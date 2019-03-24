import { createServer, IncomingMessage, ServerResponse } from 'http'
import firebaseAdmin from 'firebase-admin'
import dotenv from 'dotenv'
import atob from 'atob'

import { UsedCar } from '../../types'
import scrapeUsedCars from '../scrapeUsedCars'
import filterUsedCars from '../filterUsedCars'
import fetchLastSnapshot from '../fetchLastSnapshot'

if (!process.env.IS_NOW) {
  dotenv.config()
}

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: atob(process.env.FIREBASE_PRIVATE_KEY!).replace(/\\n/g, '\n'),
  }),
  databaseURL: 'https://choose-ev.firebaseio.com',
})

const handler = async (_: IncomingMessage, res: ServerResponse) => {
  const database = firebaseAdmin.database()
  try {
    const snapshot = await fetchLastSnapshot(database)
    if (snapshot) {
      const isFromLastHour =
        new Date().getTime() - snapshot.timestamp < 60 * 60 * 1000
      if (isFromLastHour) {
        console.log('Returning snapshot from', snapshot.date)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ cars: snapshot.cars }))
        return
      }
      console.log('Snapshot too old, from:', snapshot.date)
    } else {
      console.log('Found no snapshot')
    }
  } catch (error) {
    console.log('Failed to fetch snapshot', error)
  }

  console.log('Starting new scrape')
  let cars: Array<UsedCar> = []
  try {
    cars = await scrapeUsedCars()
  } catch (error) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Failed to fetch cars' }))
    return
  }

  const filteredCars = filterUsedCars(cars)
  console.log('Storing scrape', new Date())

  const now = new Date()
  database
    .ref(`snapshots/${now.getTime()}`)
    .set({
      timestamp: now.getTime(),
      cars: JSON.parse(JSON.stringify(filteredCars)), // Trim undefined values
      date: now.toISOString(),
    })
    .catch((error) =>
      console.log('Failed to add new snapshot to Firebase', error),
    )

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ cars: filteredCars }))
}

// process.env.IS_NOW is undefined locally,
if (!process.env.IS_NOW) {
  // so we have a server with the handler!
  createServer(handler).listen(4000)
  console.log('Stated used.ts on port 4000')
}

// Either way, this is exported
// On Now, this is what gets invoked/called/executed.
export default handler
