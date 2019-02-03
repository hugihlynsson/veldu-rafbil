export default ({ car }) => (
  <article>
    <img src={car.heroImage} />
    <div className="content">
      <h1>
        <span className="make">{car.make}</span>{" "}
        <span className="model">{car.model}</span>
      </h1>

      <a className="price" target="_blank" href={car.sellerURL}>
        {car.price.toLocaleString("de")} kr.
      </a>

      <div className="info">
        <div className="info-item">
          <div className="info-item-label">0-100 km/klst</div>
          <div className="info-item-value">{car.acceleration}s</div>
        </div>

        <div className="info-item">
          <div className="info-item-label">Rýmd</div>
          <div className="info-item-value">{car.capacity} kWh</div>
        </div>

        <div className="info-item" title="Samkvæmt WLTP prófunum">
          <div className="info-item-label">Drægni</div>
          <div className="info-item-value">{car.range} km</div>
        </div>
      </div>

      <a className="more-info" target="_blank" href={car.evDatabaseURL}>
        Fleiri upplýsingar á ev-database.org
      </a>
    </div>

    <style jsx>
      {`
        article {
          margin-bottom: 32px;
        }

        img {
          width: 100%;
          height: auto;
        }

        .content {
          padding: 24px;
          margin 0 auto;
          max-width: 480px;
        }

        h1 {
          margin: 0;
          font-weight: 600;
          font-size: 32px;
        }
        .model {
          font-weight: 400;
        }

        .price {
          display: block;
          color: inherit;
          margin-top: 8px;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .info {
          display: flex;
          margin-bottom: 24px;
        }
        .info-item {
          margin-right: 16px;
        }
        .info-item:last-child {
          margin-right: 0;
        }
        .info-item-label {
          text-transform: uppercase;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.03em;
          margin-bottom: 2px;
          color: #aaa;
        }
        .info-item-value {
          font-size: 24px;
          font-weight: 300;
        }

        .more-info {
          display: block;
          color: inherit;
          font-size: 14px;
        }

        @media screen and (min-width: 768px) {
          
        }
      `}
    </style>
  </article>
);
