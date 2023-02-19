import { NextApiRequest, NextApiResponse } from 'next'
import firebaseAdmin from 'firebase-admin'
import atob from 'atob'

import { Snapshot, ProcessedUsedCar } from '../../types'
import fetchLastSnapshot from '../../apiHelpers/fetchLastSnapshot'

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
  process.env

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error(
    'Missing firebase config. Are you trying to run `next`? Try `now dev`. See README.md for more info',
  )
  process.exit(1)
}

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: atob(FIREBASE_PRIVATE_KEY).replace(/\\n/g, '\n'),
    }),
    databaseURL: 'https://choose-ev.firebaseio.com',
  })
} else {
  console.warn('Firebase admin app already initialized, skipping…')
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const database = firebaseAdmin.database()
  const baseUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${
    req.headers['x-forwarded-host'] || req.headers.host
  }`

  try {
    const lastSnapshot: Snapshot | undefined = await fetchLastSnapshot(database)
    if (lastSnapshot) {
      const isFromLast24Hours =
        new Date().getTime() - lastSnapshot.timestamp < 60 * 60 * 1000 * 24
      if (isFromLast24Hours) {
        const isFromLast24Hours =
          new Date().getTime() - lastSnapshot.timestamp < 60 * 60 * 1000 * 2
        if (isFromLast24Hours) {
          res.setHeader('Cache-Control', 's-maxage=7200')
        } else {
          // Update but immediately return the slightly older data
          console.log(
            'Data older than 2 hours but younger than 24. Returning stale but updating',
          )
          fetch(`${baseUrl}/api/updateUsed`)
        }
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

  try {
    console.log('Requesting updated cars')
    const response = await fetch(`${baseUrl}/api/updateUsed`)
    if (response.status !== 200) {
      throw new Error(await response.json())
    }
    const usedJson: { cars: Array<ProcessedUsedCar> } = await response.json()
    console.log('Update successful. Returning cars')
    res.setHeader('Cache-Control', 's-maxage=3600')
    res.json(usedJson)
  } catch (error) {
    console.log('Failed to update cars', error)
    res.status(500).json({ error: 'Failed to update cars' })
    return
  }
}
