import React, { useState, useEffect, FunctionComponent } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import * as FirebaseApp from 'firebase/app'
import * as Auth from 'firebase/auth'
import * as Database from 'firebase/database'

import { Snapshot as CarsSnapshot } from '../../types'
import Footer from '../../components/Footer'
import Toggles from '../../components/Toggles'
import UsedAdminCar from '../../components/UsedAdminCar'
import usedCarModels from '../../apiHelpers/usedCarModels'

const firebaseConfig = {
  apiKey: 'AIzaSyCAGbbD7QXS0tV9cKbXqXYUbPR9vM4tJ1s',
  authDomain: 'choose-ev.firebaseapp.com',
  databaseURL: 'https://choose-ev.firebaseio.com',
  projectId: 'choose-ev',
  storageBucket: 'choose-ev.appspot.com',
  messagingSenderId: '390856951245',
  appId: '1:390856951245:web:01bed7b2e1d2cfd7ddf084',
}

const app =
  FirebaseApp.getApps().length == 0
    ? FirebaseApp.initializeApp(firebaseConfig)
    : FirebaseApp.getApp()

const auth = Auth.getAuth(app)
const database = Database.getDatabase()

const LogIn: FunctionComponent<{}> = () => {
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')

  let handleSignIn = () => {
    Auth.signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) =>
        console.log('Sign-in successful!', userCredential),
      )
      .catch((error) => console.log('Sign-in error', error))
  }

  return (
    <div>
      <label htmlFor="email">Email</label>
      <input
        value={email}
        id="email"
        placeholder="name@company.com"
        type="text"
        onChange={(event) => setEmail(() => event.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        value={password}
        id="password"
        type="password"
        onChange={(event) => setPassword(() => event.target.value)}
      />
      <button onClick={handleSignIn}>Sign in</button>
    </div>
  )
}

const AdminCars: FunctionComponent<{}> = () => {
  let [carsSnapshots, setCarsSnapshot] = useState<CarsSnapshot | null>(null)
  const [showTagged, setShowTagged] = useState<boolean>(false)
  const [showFiltered, setShowFiltered] = useState<boolean>(false)
  const [showWithNoImage, setShowWithNoImage] = useState<boolean>(false)

  const usedCars = carsSnapshots?.cars ?? []

  useEffect(() => {
    let lastScrapeRef = Database.query(
      Database.ref(database, 'snapshots/'),
      Database.orderByKey(),
      Database.limitToLast(1),
    )

    Database.onValue(lastScrapeRef, (snapshot) => {
      let snapshots = snapshot.val()
      let lastestSnapshot: CarsSnapshot = snapshots[Object.keys(snapshots)[0]]
      setCarsSnapshot(() => lastestSnapshot)
    })
  }, [])

  const taggedCount = usedCars.filter((car) => car.metadata).length
  const filteredCount = usedCars.filter((car) => car.filtered).length
  const withNoImageCount = usedCars.filter((car) => !car.image).length

  const carsToShow = usedCars
    .map((car, index) => [car, index] as const)
    .filter(
      ([car]) =>
        (!car.filtered || showFiltered) &&
        (!Boolean(car.metadata?.id) || showTagged) &&
        (Boolean(car.image) || showWithNoImage),
    )

  return (
    <>
      <div className="root">
        <Head>
          <title key="title">Stjórnborð notaðra rafbíla</title>
        </Head>

        <h1>
          Stjórnborð notaðra rafbíla <span>{usedCars.length}</span>
        </h1>

        <div className="toggles">
          <Toggles<boolean>
            currentValue={showTagged}
            items={[[`Sýna merkta (${taggedCount})`, true]]}
            onClick={() => setShowTagged(!showTagged)}
          />

          <div style={{ width: '8px' }} />

          <Toggles<boolean>
            currentValue={showFiltered}
            items={[[`Sýna falda (${filteredCount})`, true]]}
            onClick={() => setShowFiltered(!showFiltered)}
          />

          <div style={{ width: '8px' }} />

          <Toggles<boolean>
            currentValue={showWithNoImage}
            items={[[`Sýna án myndar (${withNoImageCount})`, true]]}
            onClick={() => setShowWithNoImage(!showWithNoImage)}
          />
        </div>

        <div className="cars">
          {carsToShow.length > 0 ? (
            carsToShow.map(([car, index]) => (
              <UsedAdminCar
                key={car.link}
                car={car}
                onFilteredChange={(filtered) =>
                  Database.update(
                    Database.ref(
                      database,
                      `snapshots/${carsSnapshots?.timestamp}/cars/${index}`,
                    ),
                    { filtered },
                  )
                }
                onMetadataChange={(usedModelId) =>
                  Database.update(
                    Database.ref(
                      database,
                      `snapshots/${carsSnapshots?.timestamp}/cars/${index}`,
                    ),
                    {
                      metadata: usedCarModels.find(
                        ({ id }) => id === usedModelId,
                      ),
                    },
                  )
                }
              />
            ))
          ) : (
            <div className="emptyResults">Engir bílar til að sýna</div>
          )}
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .root {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          margin: 0 auto;
          max-width: 560px;
          padding: 24px;
        }

        h1 {
          font-size: 40px;
          font-weight: 600;
        }

        h1 span {
          font-weight: 400;
        }

        .toggles {
          display: flex;
        }

        .cars {
          display: grid;
          grid-gap: 32px;
          grid-template-columns: 100%;
          margin-top: 32px;
        }

        .emptyResults {
          font-weight: 500;
          color: #888;
        }

        @media screen and (min-width: 767px) {
          .root {
            margin: 0 auto;
            max-width: 1180px;
          }

          .cars {
            grid-template-columns: 1fr 1fr;
            margin: 24px;
          }
        }

        @media screen and (min-width: 1200px) {
          .cars {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
      `}</style>
    </>
  )
}

const Admin: NextPage<{}> = () => {
  let [user, setUser] = useState<Auth.User | null>(null)

  useEffect(() => {
    Auth.onAuthStateChanged(auth, (authUser) => setUser(() => authUser))
  }, [])

  return (
    <div>
      Hello {user?.email}
      {user ? <AdminCars /> : <LogIn />}
    </div>
  )
}

export default Admin
