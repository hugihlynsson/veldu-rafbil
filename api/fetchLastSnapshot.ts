import firebaseAdmin from 'firebase-admin'

import { UsedCar } from '../types'

interface UsedCarsSnapshot {
  cars: Array<UsedCar>
  timestamp: firebaseAdmin.firestore.Timestamp
}
// Assume that firebase app has already been initialised
export default async (): Promise<UsedCarsSnapshot | undefined> => {
  const query = await firebaseAdmin
    .firestore()
    .collection('snapshots')
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get()

  if (query.empty) {
    console.log('Snapshots query empty')
    return
  }

  const doc = query.docs[0]
  if (!doc) {
    console.log('Found no snapshot documents')
    return
  }

  const data = doc.data() as UsedCarsSnapshot
  console.log('Found snapshot, timestamp:', data.timestamp.toDate())
  return data
}
