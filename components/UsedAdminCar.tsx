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

const UsedAdminCar: FunctionComponent<Props> = ({
  car,
  onFilteredChange,
  onMetadataChange,
}) => (
  <div>
    <Car car={car} />

    <div className="car-settings">
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
        margin-top: 8px;
      }
      select {
        display: block;
      }
    `}</style>
  </div>
)

export default UsedAdminCar
