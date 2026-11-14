import { describe, expect, it } from 'vitest'

import { readDetails } from './reviewPrompt'
import { evDatabaseId, readListSpecs } from './evDatabaseList'

// Two rows of the front page, cut to what is read from them
const row = ({
  id,
  shape,
  size,
  hitch,
  towing,
  cargo,
}: {
  id: number
  shape: string
  size: string
  hitch: boolean
  towing: number
  cargo: number
}) =>
  `<div class="list-item" data-jplist-item> <div class="icons-row-1"><span data-tooltip="Market Segment" class="size-${size}" style="padding-left: 5px;">${size.toUpperCase()}</span></div>
<div class="icons-row-2"> ${hitch ? '<span class="tow-hitch hidden">Towbar possible</span><span class="tooltip-wrapper" data-tooltip="Towbar possible">' : '<span class="tooltip-wrapper" data-tooltip="Towbar not possible">'} <i class="fas fa-trailer"></i> </span></div>
<span class="towweight_p">${towing} kg</span> <span class="towweight hidden">${towing}</span>
<span class="cargo">${cargo} L</span> <span class="cargosort hidden">${cargo}</span>
<div class="hidden"><span class="id hidden">${id}</span><span class="shape-${shape} hidden">x</span></div> </div>`

const html = `<html>${row({ id: 3725, shape: 'hatchback', size: 'c', hitch: true, towing: 1600, cargo: 409 })}
${row({ id: 1285, shape: 'liftback', size: 'd', hitch: false, towing: 0, cargo: 0 })}</html>`

describe('the front page list', () => {
  const specs = readListSpecs(html)

  it('reads each car by its id, in the words its page uses', () => {
    expect(specs.get('3725')).toEqual({
      carBody: 'Hatchback',
      segment: 'C - Medium',
      cargoVolume: '409 L',
      towingBraked: '1600 kg',
      towHitch: 'Yes',
    })
  })

  // The list's 0 is a figure it does not have, but a towbar it rules out
  it('reads a car that takes no towbar as towing nothing', () => {
    expect(readDetails(specs.get('1285')!)).toMatchObject({
      body: 'Liftback Sedan',
      cargo: undefined,
      towing: 0,
    })
  })

  it('finds a page by the id in its URL', () => {
    expect(
      evDatabaseId('https://ev-database.org/car/3725/Audi-A2-e-tron-125-kW'),
    ).toBe('3725')
  })
})
