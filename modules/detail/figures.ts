import type { Car } from '@/modules/data/cars'
import { specRows, type SpecKey } from './specs'

export interface Figure {
  key: SpecKey
  label: string
  text: string
  /** On hover over the figure */
  textTitle?: string
  detail?: string
  /** On hover over the line under it */
  detailTitle?: string
}

// Eight, which fill the rows two to a row on a phone and four from lg
const figureOrder: SpecKey[] = [
  'range',
  'acceleration',
  'capacity',
  'seats',
  'charging',
  'towing',
  'drive',
  'value',
]

/**
 * The figures on a car's own page. Power has no square of its own: its kW
 * stand under the towing, which a heavy trailer leans on, with the
 * horsepower on hover, and the towing's own "hemlaður vagn" moves to hover.
 */
export const carFigures = (car: Car): Figure[] => {
  const rows = specRows([car])
  const power = rows.find((row) => row.key === 'power')?.cells[0]

  return figureOrder.flatMap((key): Figure[] => {
    const row = rows.find((row) => row.key === key)
    const cell = row?.cells[0]
    if (!row || !cell) return []
    if (key !== 'towing') {
      return [{ key, label: row.label, text: cell.text, detail: cell.detail }]
    }
    return [
      {
        key,
        label: row.label,
        text: cell.text,
        textTitle: cell.detail,
        detail: power?.text,
        detailTitle: power?.detail,
      },
    ]
  })
}
