import { Snapshot, UsedCar, ProcessedUsedCar } from '../types'

const transferKnownData = (
  snapshot: Snapshot | undefined,
  newCars: Array<UsedCar>,
): Array<ProcessedUsedCar> => {
  if (!snapshot) {
    // For some reason, the snapshot is missing
    return newCars.map((newCar) => ({
      ...newCar,
      metadata: { verified: false },
    }))
  }

  return newCars.map((newCar) => {
    const carToTransfer = snapshot.cars.find(
      (car) => car.serialNumber === newCar.serialNumber,
    )

    if (!carToTransfer) {
      return { ...newCar, metadata: { verified: false } }
    }

    return {
      ...newCar,
      metadata: carToTransfer.metadata || { verified: false },
    }
  })
}

export default transferKnownData
