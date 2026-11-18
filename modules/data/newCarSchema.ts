import { z } from 'zod'

import { drives } from './drives'

export const driveSchema = z.enum(drives)

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
  // kg on a braked trailer, the maker's figure: 0 where it approves none, so
  // the car takes no towbar, and null where none has been found, which the
  // site says rather than guess either way. 3,500 kg is the EU's cap for a car.
  towing: z.int().min(0).max(3500).nullable(),
  // mm, the maker's figure at the highest the car can be raised, as that is
  // what someone asking about snow wants. `adjustable` marks a raised air
  // suspension level, often for low speeds only. null where none has been
  // found, which the site says rather than guess.
  groundClearance: z
    .strictObject({
      mm: z.int().min(100).max(350),
      adjustable: z.literal(true).optional(),
    })
    .nullable(),
  // Minutes on a fast charger
  timeToCharge10To80: z.number().positive().lt(180),
  // kW
  power: z.number().positive().lt(1500),
  // In Icelandic, for example: "sumar 2026"
  expectedDelivery: z.string().trim().min(1).optional(),
  // The day it stopped being sold new here, as 2026-10-11. The car keeps its
  // page, so links to it keep working, but leaves the list, the advisor and
  // the published data. Set this rather than taking the car out.
  deprecated: z.iso.date().optional(),
})

export type Drive = z.infer<typeof driveSchema>
export type NewCar = z.infer<typeof newCarSchema>
