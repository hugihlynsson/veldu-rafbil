import { database } from 'firebase-admin'

import { Snapshot } from '../types'

export default async (
  database: database.Database,
): Promise<Snapshot | undefined> => {
  const dataSnapshot = await database
    .ref('snapshots')
    .orderByKey()
    .limitToLast(1)
    .once('value')

  const snapshots: { [key: string]: Snapshot } = dataSnapshot.val()
  if (!snapshots) {
    console.log('Fetched snapshots are undefined')
    return
  }

  const snapshot = snapshots[Object.keys(snapshots)[0]]
  if (!snapshot) {
    console.log('Fetched snapshots contain no items')
    return
  }

  return snapshot
}
