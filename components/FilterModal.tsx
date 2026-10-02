import React, { useRef, useState } from 'react'

import { Availability, Drive, Filters } from '@/types'
import clsx from 'clsx'
import Modal from './Modal'
import CloseButton from './CloseButton'
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
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [nameInput, setNameInput] = useState<string>(
    filters.name?.join(', ') ?? '',
  )

  const handleFilterChange =
    (name: keyof Filters) =>
    (event: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.currentTarget.value
      if (name === 'name') setNameInput(value)

      setFilters((filters) => {
        const updatedFilters = Object.assign({}, filters)

        if (value === '') {
          delete updatedFilters[name]
          return updatedFilters
        }

        switch (name) {
          case 'acceleration':
            updatedFilters.acceleration = Number(value)
            break
          case 'availability':
            if (value === 'all') {
              delete updatedFilters.availability
            } else {
              updatedFilters.availability = value as Availability
            }
            break
          case 'drive':
            if (value === 'all') {
              delete updatedFilters.drive
            } else {
              updatedFilters.drive = [value as Drive]
            }
            break
          case 'fastcharge':
            updatedFilters.fastcharge = Number(value)
            break
          case 'name':
            const names = value
              .split(',')
              .map((name) => name.trim())
              .filter((name) => name)
            // Input of only separators is no filter at all, not a filter that
            // matches nothing
            if (names.length) {
              updatedFilters.name = names
            } else {
              delete updatedFilters.name
            }
            break
          case 'price':
            updatedFilters.price = Number(value)
            break
          case 'range':
            updatedFilters.range = Number(value)
            break
          case 'seats':
            if (value === 'all') {
              delete updatedFilters.seats
            } else {
              updatedFilters.seats = Number(value)
            }
            break
          case 'value':
            updatedFilters.value = Number(value)
            break
          default:
            // A filter without a case would be dropped here as it was typed
            name satisfies never
        }

        return updatedFilters
      })
    }

  return (
    <Modal
      labelledBy="filter-modal-title"
      onDone={onDone}
      initialFocusRef={nameInputRef}
      className={clsx(
        'items-end backdrop:duration-200 data-[state=visible]:backdrop:bg-backdrop-strong',
        '[@media(min-width:800px)_and_(min-height:600px)]:items-center',
      )}
    >
      {({ isVisible, close }) => {
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
              'z-1 flex flex-col rounded-t-[20px] bg-surface w-screen max-w-[400px] max-h-[85vh] overflow-hidden shadow-(--shadow-sheet) translate-y-10 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.32,0,0.67,0)]',
              '[@media(min-width:800px)_and_(min-height:600px)]:rounded-[20px] [@media(min-width:800px)_and_(min-height:600px)]:max-h-[500px]',
              isVisible &&
                'opacity-100 ease-[cubic-bezier(0.33,1,0.68,1)] translate-y-0!',
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
                value={nameInput}
              />
              <FilterInput
                id="filter-price"
                label="Verð"
                hint="Hámark"
                type="number"
                placeholder="25000000"
                onChange={handleFilterChange('price')}
                onKeyDown={handleKeyPress}
                value={filters.price ?? ''}
              />
              <FilterInput
                id="filter-range"
                label="Drægni"
                hint="Lágmark"
                type="number"
                placeholder="230"
                onChange={handleFilterChange('range')}
                onKeyDown={handleKeyPress}
                value={filters.range ?? ''}
              />
              <FilterSelect
                id="filter-drive"
                label="Drif"
                options={[
                  ['all', 'Öll'],
                  ['AWD', 'AWD'],
                  ['FWD', 'FWD'],
                  ['RWD', 'RWD'],
                ]}
                onChange={handleFilterChange('drive')}
                onKeyDown={handleKeyPress}
                value={filters.drive?.[0] ?? 'all'}
              />
              <FilterSelect
                id="filter-seats"
                label="Sæti"
                options={[
                  ['all', 'Öll'],
                  ['4', '4+'],
                  ['5', '5+'],
                  ['6', '6+'],
                  ['7', '7+'],
                ]}
                onChange={handleFilterChange('seats')}
                onKeyDown={handleKeyPress}
                value={filters.seats?.toString() ?? 'all'}
              />
              <FilterSelect
                id="filter-availability"
                label="Framboð"
                options={[
                  ['all', 'Allir'],
                  ['available', 'Fáanlegir'],
                  ['expected', 'Væntanlegir'],
                ]}
                onChange={handleFilterChange('availability')}
                onKeyDown={handleKeyPress}
                value={filters.availability ?? 'all'}
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
                value={filters.acceleration ?? ''}
              />
              <FilterInput
                id="filter-value"
                label="Verði á km"
                hint="Hámark"
                type="number"
                placeholder="44000"
                onChange={handleFilterChange('value')}
                onKeyDown={handleKeyPress}
                value={filters.value ?? ''}
              />
              <FilterInput
                id="filter-fastcharge"
                label="Hraðhleðsla"
                hint="Lágmark, km/min"
                type="number"
                placeholder="3.1"
                onChange={handleFilterChange('fastcharge')}
                onKeyDown={handleKeyPress}
                value={filters.fastcharge ?? ''}
              />
            </div>
            <footer className="p-4 flex justify-between shadow-(--shadow-sheet-footer) z-1">
              <button
                className="appearance-none border-0 bg-transparent p-0 pl-1 text-stone text-sm font-semibold transition-all duration-200 cursor-pointer hover:text-tint"
                onClick={() => {
                  setFilters({})
                  setNameInput('')
                }}
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
