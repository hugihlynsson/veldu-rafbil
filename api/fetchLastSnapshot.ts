import { Firestore, Timestamp } from '@google-cloud/firestore'

import { UsedCar } from '../types'

interface UsedCarsSnapshot {
  cars: Array<UsedCar>
  timestamp: Timestamp
}

export default async (
  firestore: Firestore,
): Promise<UsedCarsSnapshot | undefined> => {
  const query = await firestore
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
