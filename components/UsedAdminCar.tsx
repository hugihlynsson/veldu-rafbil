import React, { FunctionComponent } from 'react'

import Car from './UsedCar'
import { ProcessedUsedCar } from '../types'
import usedCarModels from '../apiHelpers/usedCarModels'

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

        {usedCarModels.map((carOption) => (
          <option value={carOption.id} key={carOption.id}>
            {carOption.make} {carOption.model}: {carOption.id}
          </option>
        ))}
      </select>

      <input
        id={`filtered-${car.link}`}
        type="checkbox"
        checked={car.filtered}
        onChange={({ target }) => onFilteredChange(target.checked)}
      />
      <label htmlFor={`filtered-${car.link}`}>Filtered</label>
    </div>

    <style jsx>{`
      .car-settings {
        margin-top: 8px;
      }
    `}</style>
  </div>
)

export default UsedAdminCar
