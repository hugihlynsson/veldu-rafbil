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
    .limitToLast(1)
    .once('value')

  const snapshots: { [key: string]: UsedCarsSnapshot } = dataSnapshot.val()
  if (!snapshots) {
    console.log('Fetched snapshots are empty')
    return
  }

  const snapshot = snapshots[Object.keys(snapshots)[0]]
  if (!snapshot) {
    console.log('Found no snapshot when fetching')
  }

  console.log('Fetched snapshot from', snapshot.date)
  return snapshot
}
