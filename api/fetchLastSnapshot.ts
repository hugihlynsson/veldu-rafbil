import firebaseAdmin from 'firebase-admin'

import { UsedCar } from '../types'

interface UsedCarsSnapshot {
  cars: Array<UsedCar>
  timestamp: number
  date: string // ISO date string (Date.toISOString())
}

export default async (
  database: firebaseAdmin.database.Database,
): Promise<UsedCarsSnapshot | undefined> => {
  const dataSnapshot = await database
    .ref('snapshots')
    .orderByKey()
    .limitToFirst(1)
    .once('value')

  const snapshots: Array<UsedCarsSnapshot> = dataSnapshot.val()
  if (!snapshots || !snapshots.length) {
    console.log('Snapshots empty')
    return
  }

  console.log('Found snapshot, timestamp:', snapshots[0].date)
  return snapshots[0]
}
