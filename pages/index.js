import React from "react";
import Head from "next/head";
import Car from "../components/NewCar";
import Footer from "../components/Footer";
import Toggles from "../components/Toggles";
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
            <title key="title">Veldu Rafbíl</title>
            <meta
              key="description"
              name="description"
              content="Listi yfir alla 12 rafbílana sem seldir eru á Íslandi með hlekk á seljanda og helstu upplýsingum til samanburðar"
            />
          </Head>

          <header>
            <h1>Veldu Rafbíl</h1>

            <div className="sorting-title">Raða eftir:</div>

            <Toggles
              currentValue={this.state.sorting}
              items={[
                ["Nafi", "name"],
                ["Verði", "price"],
                ["Drægni", "range"],
                ["Hröðun", "acceleration"]
              ]}
              onClick={this.handleSetSorting}
            />
          </header>

          <div className="cars">
            {cars.sort(this.carSorter).map(car => (
              <Car car={car} key={`${car.make} ${car.model}`} />
            ))}
          </div>
        </div>

        <Footer />

        <style jsx>
          {`
          .root {
            max-width: 1024px;
            margin: 0 auto;
          }
          header {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin 0 auto;
            max-width: 480px;
            padding: 16px;
          }
          h1 {
            font-size: 40px;
            font-weight: 600;
            line-height: 1.1;
          }

          .sorting-title {
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 600;
          }

          @media screen and (min-width: 375px) {
            header {
              padding: 24px;
            }
            h1 {
              font-size: 48px;
            }
          }

          @media screen and (min-width: 768px) {
            header {
              padding-left: 40px;
              max-width: none;
              padding-bottom: 40px; 
            }
            h1 {
              font-size: 64px;
            }
          }
        `}
        </style>
      </>
    );
  }
}
