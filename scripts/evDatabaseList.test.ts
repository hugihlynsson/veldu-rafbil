import { describe, expect, it } from 'vitest'

import { readDetails } from './reviewPrompt'
import { evDatabaseId, findInList, readList } from './evDatabaseList'

// Rows of the front page, cut to what is read from them
const row = ({
  id,
  slug,
  name,
  shape,
  size,
  hitch,
  towing,
  cargo,
  status = 'current',
}: {
  id: number
  slug: string
  name: string
  shape: string
  size: string
  hitch: boolean
  towing: number
  cargo: number
  status?: string
}) =>
  `<div class="list-item" data-jplist-item> <a href=/car/${id}/${slug}><img src="x.jpg"/></a>
<h2> <a href="/car/${id}/${slug}" class="title"><span class="audi">Audi</span> <span class="model">${name}</span><span class="hidden">${name}</span></a></h2>
<div class="availability current" data-tooltip="Date vehicle was available to order"> Available to order since September 2026 </div>
<div class="icons-row-1"><span data-tooltip="Rear Wheel Drive"><span class="achter fas fa-circle"></span></span><span data-tooltip="Market Segment" class="size-${size}" style="padding-left: 5px;">${size.toUpperCase()}</span><span class="tooltip-wrapper" data-tooltip="Number of seats"> <i class="seats-5 fas fa-user"></i> <span>5</span> </span></div>
<div class="icons-row-2"> ${hitch ? '<span class="tow-hitch hidden">Towbar possible</span><span class="tooltip-wrapper" data-tooltip="Towbar possible">' : '<span class="tooltip-wrapper" data-tooltip="Towbar not possible">'} <i class="fas fa-trailer"></i> </span></div>
<span class="erange_real">325 km</span> <span class="acceleration hidden">8.8</span> <span class="battery hidden">50</span> <span class="fastcharge_speed hidden">90</span>
<span class="towweight_p">${towing} kg</span> <span class="towweight hidden">${towing}</span>
<span class="cargo">${cargo} L</span> <span class="cargosort hidden">${cargo}</span>
<div class="pricing org"> <div class="price_buy ${status}"> <span class="country_de" data-tooltip="Local starting price including VAT is shown.">€38,200</span> </div> <div class="price_buy ${status}"> <span class="country_uk" data-tooltip="x">£30,700</span> </div> </div>
<div class="hidden"><span class="id hidden">${id}</span><span class="shape-${shape} hidden">x</span></div> </div>`

const html = `<html>${row({ id: 3725, slug: 'Audi-A2-e-tron-125-kW---50-kWh', name: 'Audi A2 e-tron 125 kW - 50 kWh', shape: 'hatchback', size: 'c', hitch: true, towing: 1600, cargo: 409 })}
${row({ id: 1285, slug: 'Audi-e-tron-GT', name: 'Audi e-tron GT', shape: 'liftback', size: 'd', hitch: false, towing: 0, cargo: 0, status: 'archive' })}</html>`

describe('the front page list', () => {
  const list = readList(html)

  it('reads each car by its id, with its page and figures', () => {
    expect(list.get('3725')).toEqual({
      id: '3725',
      name: 'Audi A2 e-tron 125 kW - 50 kWh',
      url: 'https://ev-database.org/car/3725/Audi-A2-e-tron-125-kW---50-kWh',
      availability: 'Available to order since September 2026',
      drive: 'RWD',
      seats: 5,
      acceleration: 8.8,
      usableBattery: 50,
      fastcharge: 90,
      realRange: 325,
      prices: {
        de: { price: '€38,200', status: 'current' },
        uk: { price: '£30,700', status: 'current' },
      },
      specs: {
        carBody: 'Hatchback',
        segment: 'C - Medium',
        cargoVolume: '409 L',
        towingBraked: '1600 kg',
        towHitch: 'Yes',
      },
    })
  })

  // A price is the last one known once a car is no longer sold
  it('says when a price is no longer asked', () => {
    expect(list.get('1285')?.prices.de?.status).toBe('archive')
  })

  // The list's 0 is a figure it does not have, but a towbar it rules out
  it('reads a car that takes no towbar as towing nothing', () => {
    const { specs } = list.get('1285')!
    expect(specs).toMatchObject({ towHitch: 'No' })
    expect(specs.towingBraked).toBeUndefined()
    expect(readDetails(specs)).toMatchObject({
      body: 'Liftback Sedan',
      cargo: undefined,
    })
  })

  it('finds cars by every word of a name, or by id', () => {
    const names = (query: string) =>
      findInList(list, query).map((car) => car.name)
    expect(names('audi E-TRON')).toEqual([
      'Audi A2 e-tron 125 kW - 50 kWh',
      'Audi e-tron GT',
    ])
    expect(names('e-tron gt')).toEqual(['Audi e-tron GT'])
    expect(names('1285')).toEqual(['Audi e-tron GT'])
    // A model named by a number is found by it, after the car with that id
    expect(names('125')).toEqual(['Audi A2 e-tron 125 kW - 50 kWh'])
    expect(names('3725')).toEqual(['Audi A2 e-tron 125 kW - 50 kWh'])
    expect(names('Kia')).toEqual([])
  })

  it('finds a page by the id in its URL', () => {
    expect(
      evDatabaseId('https://ev-database.org/car/3725/Audi-A2-e-tron-125-kW'),
    ).toBe('3725')
  })
})
