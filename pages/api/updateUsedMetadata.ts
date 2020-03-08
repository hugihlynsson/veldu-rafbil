import { NextApiRequest, NextApiResponse } from 'next'
import firebaseAdmin from 'firebase-admin'
import atob from 'atob'
import dotenv from 'dotenv'
import fetchLastSnapshot from '../../apiHelpers/fetchLastSnapshot'

dotenv.config()

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = process.env

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

export default async (request: NextApiRequest, response: NextApiResponse) => {
  // TODO Return 403 if firebase admin is not configured
  const database = firebaseAdmin.database()
  const { metadata, carIndex } = request.body

  console.log('Request body', request.body)

  if (typeof carIndex !== 'number') {
    return response.status(400).json({ error: 'Missing carLink in JSON body' })
  }

  const lastSnapshot = await fetchLastSnapshot(database)

  if (!lastSnapshot) {
    return response.status(404).end()
  }

  if (metadata) {
    await database
      .ref(`snapshots/${lastSnapshot.timestamp}/cars/${carIndex}/metadata`)
      .set(metadata)
  } else {
    await database
      .ref(`snapshots/${lastSnapshot.timestamp}/cars/${carIndex}/metadata`)
      .remove()
  }

  response.status(200).end()
}
