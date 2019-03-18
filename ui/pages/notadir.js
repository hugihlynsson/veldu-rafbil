import React from 'react'
import fetch from 'isomorphic-unfetch'
import Car from '../components/UsedCar'
import Head from 'next/head'

export default class Used extends React.Component {
  static getInitialProps = async ({ req }) => {
    return await fetch('/api/used.ts')
  }

  state = {
    filter: undefined,
    sorting: 'price',
  }

  handleSetFilter = (filter) => {
    this.setState({ filter })
  }

  handleSetSorting = (sorting) => {
    this.setState({ sorting })
  }

  render() {
    const { cars } = this.props
    const { filter, sorting } = this.state

    console.log('Render')

    return (
      <div className="root" key="used">
        <Head>
          <title key="title">Notaðir Rafbílar</title>
          <meta
            key="viewport"
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>

        <h1>Notaðir Rafbílar</h1>

        <div className="sorting">
          <div
            className="sorting-item"
            style={
              sorting === 'price' ? { backgroundColor: '#EEE' } : undefined
            }
            onClick={() => this.handleSetSorting('price')}
          >
            Verð
          </div>
          <div
            className="sorting-item"
            style={sorting === 'age' ? { backgroundColor: '#EEE' } : undefined}
            onClick={() => this.handleSetSorting('age')}
          >
            Aldur
          </div>
          <div
            className="sorting-item"
            style={
              sorting === 'milage' ? { backgroundColor: '#EEE' } : undefined
            }
            onClick={() => this.handleSetSorting('milage')}
          >
            Keyrsla
          </div>
          <div
            className="sorting-item"
            style={sorting === 'name' ? { backgroundColor: '#EEE' } : undefined}
            onClick={() => this.handleSetSorting('name')}
          >
            Nafn
          </div>
        </div>

        <div className="filters">
          <div
            className="filter"
            style={!filter ? { backgroundColor: '#EEE' } : undefined}
            onClick={() => this.handleSetFilter()}
          >
            ALLIR <span className="count">{cars.length}</span>
          </div>

          {Object.entries(
            cars
              .map((car) => car.make)
              .reduce(
                (makes, make) =>
                  makes[make]
                    ? { ...makes, [make]: makes[make] + 1 } // Add one count
                    : { ...makes, [make]: 1 }, // Create a new make and set to 1
                {},
              ),
          ).map(([make, count]) => (
            <div
              key={make}
              className="filter"
              style={filter === make ? { backgroundColor: '#EEE' } : undefined}
              onClick={() => this.handleSetFilter(make)}
            >
              {make} <span className="count">{count}</span>
            </div>
          ))}
        </div>

        <div className="cars">
          {cars
            .filter((car) => !filter || car.make === filter)
            .slice() // Make sure the sorting doesn't try to mutate the original
            .sort((a, b) => {
              switch (this.state.sorting) {
                case 'price': {
                  return (
                    Number(a.price.replace('.', '')) -
                    Number(b.price.replace('.', ''))
                  )
                }
                case 'age': {
                  return (
                    Number((b.date.split('/')[1] || '').split(' ')[0]) -
                    Number((a.date.split('/')[1] || '').split(' ')[0])
                  )
                }
                case 'milage': {
                  return (
                    (Number(a.milage.replace(' km.', '').replace('.', '')) ||
                      0) -
                    (Number(b.milage.replace(' km.', '').replace('.', '')) || 0)
                  )
                }
                case 'name': {
                  return `${a.make} ${a.model}`.localeCompare(
                    `${b.make} ${b.model}`,
                  )
                }
                default: {
                  return 1
                }
              }
            })
            .map((car) => {
              console.log(car.milage)
              return car
            })
            .map((car) => (
              <Car car={car} key={car.link} />
            ))}
        </div>

        <style jsx global>{`
          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto,
              Helvetica, Arial, sans-serif;
            color: #111;
          }
        `}</style>

        <style jsx>
          {`
          .root {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin 0 auto;
            max-width: 560px;
            padding: 24px;
          }
          h1 {
            font-size: 40px;
            font-weight: 600;
          }
          .sorting {
            display: flex;
            flex-wrap: wrap;
            border: 1px solid #EEE;
            align-self: flex-start;
            margin-bottom: 8px;
            border-radius: 4px;
          }
          .sorting-item {
            font-size: 11px;
            font-weight: 600;
            padding: 4px 8px;
            cursor: pointer;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            border-right: 1px solid #EEE;

          }
          .sorting-item:last-child {
            border-right-width: 0;
          }
          .sorting-item:hover {
            background-color: #F8F8F8;
          }

          .filters {
            display: flex;
            flex-wrap: wrap;
          }
          .filter {
            font-size: 11px;
            font-weight: 600;
            margin-right: 2px;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 2px;
          }
          .filter:hover {
            background-color: #F8F8F8;
          }
          .count {
            font-weight: 400;
            margin-left: 2px;
            color: #888;
          }

          .cars {
            display: flex;
            flex-direction: column;
            align-items: stretch;
          }

          @media screen and (min-width: 768px) {
            .root {
              margin 0 auto;
              max-width: 1120px;
            }
            .cars {
              flex-direction: row;
              flex-wrap: wrap;
            }
          }
        `}
        </style>
      </div>
    )
  }
}
