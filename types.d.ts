export interface Snapshot {
  cars: Array<ProcessedUsedCar>
  timestamp: number
  date: string // ISO date string (Date.toISOString())
}

export interface UsedCar {
  image?: string
  link: string
  make: string
  model: string
  modelExtra: string
  date: string
  milage: string
  price?: number
  serialNumber: number
}

export interface ProcessedUsedCar extends UsedCar {
  metadata?: {
    verified: boolean
    hidden?: boolean
    knownCarId?: string
  }
}

export interface NewCar {
  make: string
  model: string
  heroImageName: string
  price: number
  sellerURL: string
  acceleration: number
  capacity: number
  range: number
  evDatabaseURL: string
}
