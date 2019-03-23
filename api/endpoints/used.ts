import { createServer, IncomingMessage, ServerResponse } from 'http'
import dotenv from 'dotenv'
import atob from 'atob'
import { Firestore, Timestamp } from '@google-cloud/firestore'

import { UsedCar } from '../../types'
import scrapeUsedCars from '../scrapeUsedCars'
import filterUsedCars from '../filterUsedCars'
import fetchLastSnapshot from '../fetchLastSnapshot'

if (!process.env.IS_NOW) {
  dotenv.config()
}

const firestore = new Firestore({
  projectId: process.env.FIREBASE_PROJECT_ID,
  credentials: {
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: atob(process.env.FIREBASE_PRIVATE_KEY!).replace(/\\n/g, '\n'),
  },
})

const handler = async (_: IncomingMessage, res: ServerResponse) => {
  try {
    const snapshot = await fetchLastSnapshot(firestore)
    if (snapshot) {
      const snapshotEpoch = snapshot.timestamp.toDate().getTime()
      const isFromLastHour =
        new Date().getTime() - snapshotEpoch < 60 * 60 * 1000
      if (isFromLastHour) {
        console.log('Returning snapshot from', snapshot.timestamp.toDate())
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ cars: snapshot.cars }))
        return
      }
      console.log('Snapshot too old, from:', snapshot.timestamp.toDate())
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
  firestore
    .collection('snapshots')
    .add({
      timestamp: Timestamp.fromDate(new Date()),
      cars: JSON.parse(JSON.stringify(filteredCars)), // Trim undefined values
    })
    .catch((error) =>
      console.log('Failed to add new snapshot to Firestore', error),
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
