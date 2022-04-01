// Deletes a snapshot with the key in the argument
// Run from the root of the project: node scripts/deleteSnapshot.mjs <snapshotKey>
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

let snapshotKey = process.argv[2]

console.log(`Deleting snapshot with key: ${snapshotKey}`)

let snapshotRef = firebaseAdmin.database().ref('snapshots')

snapshotRef.once('value', (dataSnapshot) => {
  if (dataSnapshot.hasChild(snapshotKey)) {
    snapshotRef.child(snapshotKey).remove()
    console.log('Successfully deleted!')
    setTimeout(() => app.delete(), 1000)
  } else {
    console.log("Snapshot doesn't exist, aborting")
    app.delete()
  }
})
