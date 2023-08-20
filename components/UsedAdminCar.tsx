import React, { FunctionComponent } from 'react'

import Car from './UsedCar'
import { ProcessedUsedCar, UsedCarModel } from '../types'
import usedCarModels from '../apiHelpers/usedCarModels'

const groupBy = (key: string) => (grouped: any, groupable: any) => {
  const value = groupable[key]
  const group = grouped[value]
  return {
    ...grouped,
    [value]: group ? [...group, groupable] : [groupable],
  }
}

interface Props {
  car: ProcessedUsedCar
  onFilteredChange: (filtered: boolean) => void
  onMetadataChange: (id: string) => void
}

let getTypeSuggestions = (car: ProcessedUsedCar): UsedCarModel[] =>
  usedCarModels.filter((model) => {
    return model.make.toLowerCase() === car.make.toLowerCase()
  })

const UsedAdminCar: FunctionComponent<Props> = ({
  car,
  onFilteredChange,
  onMetadataChange,
}) => (
  <div>
    <Car car={car} />

    <div className="car-settings">
      <p className="first-seen">
        {new Date().setHours(0, 0, 0, 0) ==
        new Date(car.firstSeen).setHours(0, 0, 0, 0)
          ? `Fyrst séður í dag kl. ${new Date(car.firstSeen).toLocaleTimeString(
              'DE',
            )}`
          : `Fyrst séður ${new Date(car.firstSeen).toLocaleString('DE')}`}
      </p>

      {!car.metadata && getTypeSuggestions(car).length > 0 ? (
        <select onChange={({ target }) => onMetadataChange(target.value)}>
          <option value={undefined}>Uppástungur</option>

          {Object.entries(getTypeSuggestions(car).reduce(groupBy('make'), {}))
            .sort() // Fix server-client mismatch
            .map(([make, models]) => (
              <optgroup label={make} key={make}>
                {(models as Array<UsedCarModel>).map((carOption) => (
                  <option value={carOption.id} key={carOption.id}>
                    {carOption.model}: {carOption.id}
                  </option>
                ))}
              </optgroup>
            ))}
        </select>
      ) : null}

      <select
        value={car.metadata?.id}
        onChange={({ target }) => onMetadataChange(target.value)}
      >
        <option value={undefined}>Ekki valið</option>

        {Object.entries(usedCarModels.reduce(groupBy('make'), {}))
          .sort() // Fix server-client mismatch
          .map(([make, models]) => (
            <optgroup label={make} key={make}>
              {(models as Array<UsedCarModel>).map((carOption) => (
                <option value={carOption.id} key={carOption.id}>
                  {carOption.model}: {carOption.id}
                </option>
              ))}
            </optgroup>
          ))}
      </select>

      <input
        id={`filtered-${car.link}`}
        type="checkbox"
        checked={Boolean(car.filtered)}
        onChange={({ target }) => onFilteredChange(target.checked)}
      />
      <label htmlFor={`filtered-${car.link}`}>Filtered</label>
    </div>

    <style jsx>{`
      .car-settings {
        margin-right: 12px;
        margin-left: 12px;
        margin-top: -8px;
      }
      .first-seen {
        margin: 0;
        margin-bottom: 12px;
        margin-left: 4px;
        font-size: 14px;
        color: #aaa;
        font-weight: 300;
      }
      select {
        display: block;
        width: 100%;
        margin: 0 0 8px;
      }
      input {
        margin-right: 8px;
      }
    `}</style>
  </div>
)

export default UsedAdminCar
