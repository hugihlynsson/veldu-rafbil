import { UsedCar } from '../../types'

interface Props {
  car: UsedCar
}

export default ({ car }: Props) => (
  <a href={car.link}>
    <img src={car.image} />

    <div>
      <p className="title">
        <span className="make">{car.make.toLowerCase()}</span>{' '}
        {car.model.toLowerCase()}
      </p>

      {car.modelExtra && (
        <p className="extra extra--model">{car.modelExtra.toLowerCase()}</p>
      )}

      <p className="extra">
        {car.price && (
          <span className="price">{car.price.toLocaleString('de')} kr. </span>
        )}

        {car.date.split('/')[1]}

        {car.milage && ` • ${car.milage}`}
      </p>
    </div>

    <style jsx>{`
      a {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 24px;
        text-decoration: none;
        color: inherit;
      }
      img {
        width: 30%;
        border-radius: 2px;
        object-fit: cover;
        margin-right: 4%;
        background-color: #f8f8f8;
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
      }
      .title {
        font-size: 24px;
        color: #111;
        text-transform: capitalize;
        margin: 0;
        margin-bottom: 4px;
      }
      .make {
        font-weight: 600;
      }
      .extra {
        margin: 0 0 6px;
        color: #aaa;
        font-weight: 300;
        font-size: 14px;
      }
      .extra--model {
        text-transform: capitalize;
      }
      .price {
        color: #111;
        font-weight: 500;
      }

      @media screen and (min-width: 768px) {
        a {
          width: 50%;
          padding-right: 24px;
        }
      }
    `}</style>
  </a>
)
