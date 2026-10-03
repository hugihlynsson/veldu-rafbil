import React, { useRef, useState } from 'react'

import {
  fieldFromFilter,
  fieldsFromFilters,
  filtersFromFields,
  type FilterFields,
  type Filters,
} from '@/modules/list/filters'
import clsx from 'clsx'
import Modal, { panelMotion } from '@/components/Modal'
import CloseButton from '@/components/CloseButton'
import { FilterInput, FilterSelect } from './FilterField'

interface Props {
  initialFilters: Filters
  onSubmit: (filters: Filters) => void
  getCountPreview: (filters: Filters) => number
  onDone: () => void
}

const FiltersModal: React.FunctionComponent<Props> = ({
  initialFilters,
  onSubmit,
  getCountPreview,
  onDone,
}) => {
  // showModal would focus the close button; the name field is the point
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [fields, setFields] = useState<FilterFields>(() =>
    fieldsFromFilters(initialFilters),
  )
  const filters = filtersFromFields(fields)

  const driveOptions: Array<[string, string]> = [
    ['', 'Öll'],
    ['AWD', 'AWD'],
    ['FWD', 'FWD'],
    ['RWD', 'RWD'],
  ]
  // A link or a suggestion can ask for two drives, which no one option is
  if (fields.drive && !driveOptions.some(([value]) => value === fields.drive)) {
    driveOptions.push([fields.drive, fields.drive])
  }

  const handleFilterChange =
    (name: keyof Filters) =>
    (event: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.currentTarget.value
      setFields((fields) => ({ ...fields, [name]: value }))
    }

  return (
    <Modal
      labelledBy="filter-modal-title"
      onDone={onDone}
      initialFocusRef={nameInputRef}
      className={clsx(
        'items-end data-[state=visible]:backdrop:bg-backdrop-strong',
        '[@media(min-width:800px)_and_(min-height:600px)]:items-center',
      )}
    >
      {({ close }) => {
        const handleDone = () => {
          onSubmit(filters)
          close()
        }

        const handleKeyPress = (
          event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
        ) => {
          if (event.key === 'Enter') handleDone()
        }

        return (
          <section
            className={clsx(
              'z-1 flex flex-col rounded-t-sheet bg-surface w-screen max-w-[400px] max-h-[85vh] overflow-hidden shadow-(--shadow-sheet)',
              panelMotion,
              '[@media(min-width:800px)_and_(min-height:600px)]:rounded-sheet [@media(min-width:800px)_and_(min-height:600px)]:max-h-[500px]',
            )}
          >
            <header className="relative bg-surface text-lg text-center px-4 py-3 border-b border-line font-semibold">
              <CloseButton onClick={close} />
              <h2 id="filter-modal-title" className="m-0 text-lg font-semibold">
                Leita
              </h2>
            </header>
            <div className="flex flex-col grow shrink overflow-scroll p-5 pb-2">
              <FilterInput
                inputRef={nameInputRef}
                id="filter-name"
                label="Nafn"
                type="text"
                placeholder="Tesla, Kia"
                onChange={handleFilterChange('name')}
                onKeyDown={handleKeyPress}
                value={fields.name ?? ''}
              />
              <FilterInput
                id="filter-price"
                label="Verð"
                hint="Hámark"
                type="number"
                placeholder="25000000"
                onChange={handleFilterChange('price')}
                onKeyDown={handleKeyPress}
                value={fields.price ?? ''}
              />
              <FilterInput
                id="filter-range"
                label="Drægni"
                hint="Lágmark"
                type="number"
                placeholder="230"
                onChange={handleFilterChange('range')}
                onKeyDown={handleKeyPress}
                value={fields.range ?? ''}
              />
              <FilterSelect
                id="filter-drive"
                label="Drif"
                options={driveOptions}
                onChange={handleFilterChange('drive')}
                onKeyDown={handleKeyPress}
                value={fields.drive ?? ''}
              />
              <FilterSelect
                id="filter-seats"
                label="Sæti"
                options={[
                  ['', 'Öll'],
                  ['4', '4+'],
                  ['5', '5+'],
                  ['6', '6+'],
                  ['7', '7+'],
                ]}
                onChange={handleFilterChange('seats')}
                onKeyDown={handleKeyPress}
                value={fields.seats ?? ''}
              />
              <FilterSelect
                id="filter-availability"
                label="Framboð"
                options={[
                  ['', 'Allir'],
                  [fieldFromFilter('availability', 'available'), 'Fáanlegir'],
                  [fieldFromFilter('availability', 'expected'), 'Væntanlegir'],
                ]}
                onChange={handleFilterChange('availability')}
                onKeyDown={handleKeyPress}
                value={fields.availability ?? ''}
              />
              {/* carFilter keeps cars at or under this, so it is a maximum */}
              <FilterInput
                id="filter-acceleration"
                label="Hröðun"
                hint="Hámark, sec"
                type="number"
                placeholder="8.0"
                onChange={handleFilterChange('acceleration')}
                onKeyDown={handleKeyPress}
                value={fields.acceleration ?? ''}
              />
              <FilterInput
                id="filter-value"
                label="Verði á km"
                hint="Hámark"
                type="number"
                placeholder="44000"
                onChange={handleFilterChange('value')}
                onKeyDown={handleKeyPress}
                value={fields.value ?? ''}
              />
              <FilterInput
                id="filter-fastcharge"
                label="Hraðhleðsla"
                hint="Lágmark, km/min"
                type="number"
                placeholder="3.1"
                onChange={handleFilterChange('fastcharge')}
                onKeyDown={handleKeyPress}
                value={fields.fastcharge ?? ''}
              />
            </div>
            <footer className="p-4 flex justify-between shadow-(--shadow-sheet-footer) z-1">
              <button
                className="appearance-none border-0 bg-transparent p-0 pl-1 text-stone text-sm font-semibold transition-all duration-200 cursor-pointer hover:text-tint"
                onClick={() => setFields({})}
              >
                Hreinsa leit
              </button>
              <button
                className="appearance-none p-[11px_16px_12px_16px] bg-sky border-0 rounded-full text-on-sky text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-sky-hover active:scale-[0.98]"
                onClick={handleDone}
              >
                Sýna niðurstöður{' '}
                <span className="opacity-80">{getCountPreview(filters)}</span>
              </button>
            </footer>
          </section>
        )
      }}
    </Modal>
  )
}

export default FiltersModal
