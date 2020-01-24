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

export interface UsedCarModel {
  id: string
  make: string
  model: string
  acceleration: number // 0-100 km/hour
  capacity: number // kWh
  range?: number // WLTP, KM
  rangeNEDC?: number // KM
  price?: number // ISK
  sellerURL?: string
  evDatabaseURL?: string
}

export interface ProcessedUsedCar extends UsedCar {
  metadata?: UsedCarModel
  filtered?: boolean
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
