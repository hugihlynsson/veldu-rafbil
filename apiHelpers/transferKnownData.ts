import { Snapshot, UsedCar, ProcessedUsedCar } from '../types'

const transferKnownData = (
  snapshot: Snapshot | undefined,
  newCars: Array<UsedCar>,
): Array<ProcessedUsedCar> => {
  if (!snapshot) {
    // For some reason, the snapshot is missing
    return newCars
  }

  return newCars.map((newCar) => {
    const carToTransfer = snapshot.cars.find(
      (car) => car.serialNumber === newCar.serialNumber,
    )

    if (!carToTransfer) {
      return newCar
    }

    return {
      ...newCar,
      metadata: carToTransfer.metadata,
      filtered: carToTransfer.filtered,
      firstSeen: carToTransfer.firstSeen ?? newCar.firstSeen,
    }
  })
}

export default transferKnownData
