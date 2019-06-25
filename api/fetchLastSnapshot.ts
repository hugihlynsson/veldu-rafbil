import { database } from 'firebase-admin'

import { UsedCar } from '../types'

interface Snapshot {
  cars: Array<UsedCar>
  timestamp: number
  date: string // ISO date string (Date.toISOString())
}

export default async (database: database.Database): Promise<Snapshot> => {
  const dataSnapshot = await database
    .ref('snapshots')
    .orderByKey()
    .limitToLast(1)
    .once('value')

  const snapshots: { [key: string]: Snapshot } = dataSnapshot.val()
  if (!snapshots) {
    throw new Error('Fetched snapshots are undefined')
  }

  const snapshot = snapshots[Object.keys(snapshots)[0]]
  if (!snapshot) {
    throw new Error('Fetched snapshots contain no items')
  }

  return snapshot
}
