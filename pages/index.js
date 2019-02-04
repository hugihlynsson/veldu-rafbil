import React from "react";
import Head from "next/head";
import Car from "../components/NewCar";
import cars from "../data/cars.json";

export default class New extends React.Component {
  state = {
    sorting: "name"
  };

  handleSetSorting = sorting => {
    this.setState({ sorting });
  };

  carSorter = (a, b) => {
    switch (this.state.sorting) {
      case "name":
        return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
      case "price":
        return a.price - b.price;
      case "range":
        return b.range - a.range;
      case "acceleration":
        return a.acceleration - b.acceleration;
    }
  };

  render() {
    const { sorting } = this.state;

    return (
      <>
        <div className="root" key="new">
          <Head>
            <title key="title">Rafbílar á Íslandi</title>
            <meta
              key="viewport"
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>

          <header>
            <h1>Rafbílar á Íslandi</h1>

            <div className="sorting-label">Raða eftir:</div>
            <div className="sorting">
              <div
                className="sorting-item"
                style={
                  sorting === "name" ? { backgroundColor: "#EEE" } : undefined
                }
                onClick={() => this.handleSetSorting("name")}
              >
                Nafni
              </div>
              <div
                className="sorting-item"
                style={
                  sorting === "price" ? { backgroundColor: "#EEE" } : undefined
                }
                onClick={() => this.handleSetSorting("price")}
              >
                Verði
              </div>
              <div
                className="sorting-item"
                style={
                  sorting === "range" ? { backgroundColor: "#EEE" } : undefined
                }
                onClick={() => this.handleSetSorting("range")}
              >
                Drægni
              </div>
              <div
                className="sorting-item"
                style={
                  sorting === "acceleration"
                    ? { backgroundColor: "#EEE" }
                    : undefined
                }
                onClick={() => this.handleSetSorting("acceleration")}
              >
                Hröðun
              </div>
            </div>
          </header>

          <div className="cars">
            {cars.sort(this.carSorter).map(car => (
              <Car car={car} key={`${car.make} ${car.model}`} />
            ))}
          </div>
        </div>

        <footer>
          <p>
            Rafbílar á Íslandi er smíðuð af{" "}
            <a href="http://hugihlynsson.com">Huga Hlynssyni</a> og er geymd á{" "}
            <a href="https://github.com/hugihlynsson/evs">GitHub</a>.{" "}
          </p>

          <p>
            Ef þú ert með ábendingu eða fyrirspurn geturu sent póst á{" "}
            <a href="mailto:hugihlynsson@gmail.com">hugihlynsson@gmail.com</a>.
          </p>
        </footer>

        <style jsx global>{`
          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto,
              Helvetica, Arial, sans-serif;
            color: #111;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}</style>

        <style jsx>
          {`
          .root {
            max-width: 960px;
            margin: 0 auto;
          }
          header {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin 0 auto;
            max-width: 480px;
            padding: 24px;
          }
          h1 {
            font-size: 40px;
            font-weight: 600;
            line-height: 1.1;
          }

          .sorting-label {
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 600;
          }
          .sorting {
            display: flex;
            flex-wrap: wrap;
            border: 1px solid #EEE;
            align-self: flex-start;
            border-radius: 4px;
          }
          .sorting-item {
            font-size: 12px;
            font-weight: 600;
            padding: 4px 12px;
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

          footer {
            background-color: #F8F8F8;
            padding: 56px 24px;
          }
          footer p {
            margin 0 auto;
            max-width: 480px;
            font-size: 14px;
            line-height: 1.5;
            font-weight: 300;
          }
          footer a {
            color: #000;
            font-weight: 500;
            text-decoration: none;
          }
          footer a:hover {
            text-decoration: underline;
          }

          @media screen and (min-width: 768px) {
            header {
              padding-left: 40px;
              max-width: none;
            }
            h1 {
              font-size: 64px;
            }
            footer {
              padding: 56px 40px;
            }
            footer p {
              max-width: calc(960px - 40px - 40px);
              margin: 0 auto;
            }
          }
        `}
        </style>
      </>
    );
  }
}
