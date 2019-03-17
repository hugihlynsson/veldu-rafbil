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

export interface UsedCar {
  image?: string
  link?: string
  make: string
  model: string
  modelExtra: string
  date: string
  milage: string
  price: string
}
