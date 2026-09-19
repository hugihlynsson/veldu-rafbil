/**
 * What Next hands a page as `searchParams`. A parameter given more than once
 * arrives as an array rather than a string, which is why everything that reads
 * one has to cope with both — declaring it as Record<string, string> only made
 * the compiler stop asking.
 */
export type SearchParams = Record<string, string | Array<string> | undefined>

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
  availability?: Availability
}

export type Sorting =
  | 'name'
  | 'price'
  | 'range'
  | 'acceleration'
  | 'value'
  | 'fastcharge'

export type SortingDirection = 'asc' | 'desc'

export type SortingQuery =
  | 'nafni'
  | 'verdi'
  | 'draegni'
  | 'hrodun'
  | 'virdi'
  | 'hradhledslu'
