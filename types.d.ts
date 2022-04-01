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
  firstSeen: string // ISO date string (Date.toISOString())
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

export type Drive = 'AWD' | 'FWD' | 'RWD'

export interface NewCar {
  make: string
  model: string
  subModel?: string
  heroImageName: string
  price: number // ISK
  sellerURL: string
  acceleration: number // 0-100 km/h
  capacity: number // kWh
  range: number // WLTP
  evDatabaseURL?: string
  drive: Drive
  timeToCharge10T080: number // minutes
  power: number // kW
  expectedDelivery?: string // In Icelandic, for example: "sumar 2020"
}

export type Availability = 'available' | 'expected'

export type Filters = {
  acceleration?: number
  drive?: Drive[]
  fastcharge?: number
  name?: string[]
  price?: number
  range?: number
  value?: number
  availability?: availability
}
