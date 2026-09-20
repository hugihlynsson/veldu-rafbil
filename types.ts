/**
 * What Next hands a page as `searchParams`. A parameter given more than once
 * arrives as an array rather than a string, so every reader copes with both.
 */
export type SearchParams = Record<string, string | Array<string> | undefined>

export type Drive = 'AWD' | 'FWD' | 'RWD'

export interface NewCar {
  make: string
  model: string
  subModel?: string
  heroImageName: string
  price: number // ISK, whole krónur
  sellerURL: string
  acceleration: number // 0-100 km/h
  capacity: number // kWh
  range: number // WLTP
  evDatabaseURL?: string
  drive: Drive
  // The most the model can be ordered with here, paid options included
  seats: number
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
  seats?: number
  value?: number
  availability?: Availability
}

/** How the list is laid out: one car per row, or a grid of them */
export type View = 'list' | 'overview'

export type ViewQuery = 'listi' | 'yfirlit'

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
