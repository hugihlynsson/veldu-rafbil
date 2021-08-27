// Running this script will delete all snapshots but leave one snapshot (the first) for each calendar day
import dotenv from 'dotenv'
import firebaseAdmin from 'firebase-admin'

dotenv.config()

const app = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: atob(process.env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, '\n'),
  }),
  databaseURL: 'https://choose-ev.firebaseio.com',
})

const datesSeen = new Set() // A set of dates in the format YYYYMmDd
let deleteCount = 0

console.log('Starting deleting all snapshots except one per day')
console.log('Running query for 2000 items')

let snapshotRef = firebaseAdmin.database().ref('snapshots')

const snapshotsDataSnapshot = await snapshotRef
  .orderByKey()
  .limitToFirst(2000)
  .once('value')

snapshotsDataSnapshot.forEach((childSnapshot) => {
  let key = childSnapshot.key
  const date = new Date(Number(key))
  const dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

  if (datesSeen.has(dateString)) {
    console.log(
      `Found another one for ${dateString}, deleting (${deleteCount}): ${key}`,
    )
    snapshotRef.child(key).remove()
    deleteCount += 1
  } else {
    console.log(`Found first for ${dateString}, keeping: ${key}`)
    datesSeen.add(dateString)
  }
})

setTimeout(() => app.delete(), 5000)
