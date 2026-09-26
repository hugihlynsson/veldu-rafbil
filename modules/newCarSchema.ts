import { z } from 'zod'

export const driveSchema = z.enum(['AWD', 'FWD', 'RWD'])

/**
 * What a hand-written entry in newCars.ts has to be. The bounds are
 * plausibility, not physics: each has caught a typo that still type-checked.
 */
export const newCarSchema = z.strictObject({
  make: z.string().trim().min(1),
  model: z.string().trim().min(1),
  subModel: z.string().trim().min(1).optional(),
  heroImageName: z.string().regex(/^[a-z0-9-]+$/),
  // ISK has no subunit, unlike the measurements below
  price: z.int().positive(),
  sellerUrl: z.url({ protocol: /^https$/ }),
  // 0-100 km/h, in seconds
  acceleration: z.number().positive().lt(30),
  // kWh
  capacity: z.number().positive().lt(250),
  // WLTP, km
  range: z.number().positive().lt(1200),
  evDatabaseUrl: z
    .string()
    .regex(/^https:\/\/ev-database\.org\/car\/\d+\//)
    .optional(),
  drive: driveSchema,
  // The most the model can be ordered with here, paid options included. People,
  // so whole ones, and a passenger car is neither a bike nor a bus.
  seats: z.int().min(2).max(9),
  // Minutes on a fast charger
  timeToCharge10To80: z.number().positive().lt(180),
  // kW
  power: z.number().positive().lt(1500),
  // In Icelandic, for example: "sumar 2026"
  expectedDelivery: z.string().trim().min(1).optional(),
})

export type Drive = z.infer<typeof driveSchema>
export type NewCar = z.infer<typeof newCarSchema>
