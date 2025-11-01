import React, { useEffect, useState } from 'react'

import { Availability, Drive, Filters } from '../types'
import clsx from 'clsx'

interface Props {
  initialFilters: Filters
  onSubmit: (filters: Filters) => void
  getCountPreview: (filters: Filters) => number
  onDone: () => void
}

type State = 'initializing' | 'visible' | 'leaving'

const FiltersModal: React.FunctionComponent<Props> = ({
  initialFilters,
  onSubmit,
  getCountPreview,
  onDone,
}) => {
  const [state, setState] = useState<State>('initializing')
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [nameInput, setNameInput] = useState<string>(
    filters.name?.join(', ') ?? '',
  )

  useEffect(() => {
    setTimeout(() => setState(() => 'visible'), 1)
    return
  }, [])

  const handleClose = () => {
    setState(() => 'leaving')
    setTimeout(onDone, 300)
  }

  const handleDone = () => {
    onSubmit(filters)
    setState(() => 'leaving')
    handleClose()
  }

  const handleFilterChange =
    (name: keyof Filters) =>
    (event: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
      let value = event.currentTarget.value
      setFilters((filters) => {
        let updatedFilters = Object.assign({}, filters)

        // Name is a special filter
        if (name == 'name') {
          setNameInput(() => value)
        }

        // Need to handle deletion separately
        if (value == '') {
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
            updatedFilters.name = value
              .split(',')
              .map((name) => name.trim())
              .filter((name) => name)
            break
          case 'price':
            updatedFilters.price = Number(value)
            break
          case 'range':
            updatedFilters.range = Number(value)
            break
          case 'value':
            updatedFilters.value = Number(value)
            break
        }

        return updatedFilters
      })
    }

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (event.key === 'Enter') {
      handleDone()
    }
  }

  return (
    <div
      className={clsx(
        "fixed inset-0 flex items-end justify-center before:content-[''] before:block before:absolute before:inset-0 before:bg-black/0 before:transition-[background-color] before:duration-200 before:delay-100",
        '[@media(min-width:800px)_and_(min-height:600px)]:items-center',
        state === 'visible' && 'before:delay-0 before:bg-black/30',
      )}
      onClick={handleClose}
    >
      <section
        className={clsx(
          'z-1 flex flex-col rounded-t-[20px] bg-white w-screen max-w-[400px] max-h-[70vh] overflow-hidden shadow-[0px_0px_40px_0px_rgba(0,0,0,0.1)] translate-y-10 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.32,0,0.67,0)]',
          '[@media(min-width:800px)_and_(min-height:600px)]:rounded-[20px] [@media(min-width:800px)_and_(min-height:600px)]:max-h-[500px]',
          state === 'visible' &&
            'opacity-100 ease-[cubic-bezier(0.33,1,0.68,1)] translate-y-0!',
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="relative bg-white text-lg text-center px-4 py-3 border-b border-cloud font-semibold">
          <button
            onClick={handleClose}
            className="absolute left-[11px] top-[11px] flex items-center justify-center h-8 w-8 border-0 p-0 rounded-2xl appearance-none bg-transparent text-[30px] text-stone cursor-pointer transition-all duration-200 hover:bg-cloud [&_path]:transition-all [&_path]:duration-200 hover:[&_path]:fill-tint"
          >
            <svg
              width="14"
              height="14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
            >
              <title>Close</title>
              <path
                d="m2.07 13.12 4.78-4.78 4.93 4.93 1.29-1.29-4.93-4.93 4.78-4.78L11.64.98 6.85 5.77 1.91.83.63 2.1l4.94 4.94-4.79 4.79 1.29 1.28Z"
                className="fill-stone"
              />
            </svg>
          </button>
          Leita
        </header>
        <div className="flex flex-col grow shrink overflow-scroll p-5 pb-2">
          <div className="flex gap-2 items-baseline mb-1 px-3">
            <label
              htmlFor="filter-name"
              className="text-tint text-xs font-semibold"
            >
              Nafn
            </label>
          </div>
          <input
            autoFocus
            id="filter-name"
            type="text"
            placeholder="Tesla, Kia"
            onChange={handleFilterChange('name')}
            onKeyDown={handleKeyPress}
            value={nameInput}
            className="border border-cloud rounded bg-white p-[11px] text-sm font-normal text-tint mb-6 transition-all duration-200 placeholder:text-clay hover:border-clay"
          />
          <div className="flex gap-2 items-baseline mb-1 px-3">
            <label
              htmlFor="filter-price"
              className="text-tint text-xs font-semibold"
            >
              Verð
            </label>
            <p className="m-0 text-xs text-clay">Hámark</p>
          </div>
          <input
            id="filter-price"
            type="number"
            placeholder="25000000"
            onChange={handleFilterChange('price')}
            onKeyDown={handleKeyPress}
            value={filters.price ?? ''}
            className="border border-cloud rounded bg-white p-[11px] text-sm font-normal text-tint mb-6 transition-all duration-200 placeholder:text-clay hover:border-clay"
          />
          <div className="flex gap-2 items-baseline mb-1 px-3">
            <label
              htmlFor="filter-range"
              className="text-tint text-xs font-semibold"
            >
              Drægni
            </label>
            <p className="m-0 text-xs text-clay">Lágmark</p>
          </div>
          <input
            id="filter-range"
            type="number"
            placeholder="230"
            onChange={handleFilterChange('range')}
            onKeyDown={handleKeyPress}
            value={filters.range ?? ''}
            className="border border-cloud rounded bg-white p-[11px] text-sm font-normal text-tint mb-6 transition-all duration-200 placeholder:text-clay hover:border-clay"
          />
          <div className="flex gap-2 items-baseline mb-1 px-3">
            <label
              htmlFor="filter-drive"
              className="text-tint text-xs font-semibold"
            >
              Drif
            </label>
          </div>
          <select
            id="filter-drive"
            onChange={handleFilterChange('drive')}
            onKeyDown={handleKeyPress}
            value={filters.drive?.[0] ?? 'all'}
            className="appearance-none border border-cloud bg-lab rounded p-[11px] text-sm font-normal text-tint mb-6 cursor-pointer hover:border-clay"
          >
            <option value="all">Öll</option>
            <option value="AWD">AWD</option>
            <option value="FWD">FWD</option>
            <option value="RWD">RWD</option>
          </select>
          <div className="flex gap-2 items-baseline mb-1 px-3">
            <label
              htmlFor="filter-drive"
              className="text-tint text-xs font-semibold"
            >
              Framboð
            </label>
          </div>
          <select
            id="filter-availability"
            onChange={handleFilterChange('availability')}
            onKeyDown={handleKeyPress}
            value={filters.availability ?? 'all'}
            className="appearance-none border border-cloud bg-lab rounded p-[11px] text-sm font-normal text-tint mb-6 cursor-pointer hover:border-clay"
          >
            <option value="all">Allir</option>
            <option value="available">Fáanlegir</option>
            <option value="expected">Væntanlegir</option>
          </select>
          <div className="flex gap-2 items-baseline mb-1 px-3">
            <label
              htmlFor="filter-acceleration"
              className="text-tint text-xs font-semibold"
            >
              Hröðun
            </label>
            <p className="m-0 text-xs text-clay">Lágmark, sec</p>
          </div>
          <input
            id="filter-acceleration"
            type="number"
            placeholder="8.0"
            onChange={handleFilterChange('acceleration')}
            onKeyDown={handleKeyPress}
            value={filters.acceleration ?? ''}
            className="border border-cloud rounded bg-white p-[11px] text-sm font-normal text-tint mb-6 transition-all duration-200 placeholder:text-clay hover:border-clay"
          />
          <div className="flex gap-2 items-baseline mb-1 px-3">
            <label
              htmlFor="filter-value"
              className="text-tint text-xs font-semibold"
            >
              Verði á km
            </label>
            <p className="m-0 text-xs text-clay">Hámark</p>
          </div>
          <input
            id="filter-value"
            type="number"
            placeholder="44000"
            onChange={handleFilterChange('value')}
            onKeyDown={handleKeyPress}
            value={filters.value ?? ''}
            className="border border-cloud rounded bg-white p-[11px] text-sm font-normal text-tint mb-6 transition-all duration-200 placeholder:text-clay hover:border-clay"
          />
          <div className="flex gap-2 items-baseline mb-1 px-3">
            <label
              htmlFor="filter-fastcharge"
              className="text-tint text-xs font-semibold"
            >
              Hraðhleðsla
            </label>
            <p className="m-0 text-xs text-clay">Lágmark, km/min</p>
          </div>
          <input
            id="filter-fastcharge"
            type="number"
            placeholder="3.1"
            onChange={handleFilterChange('fastcharge')}
            onKeyDown={handleKeyPress}
            value={filters.fastcharge ?? ''}
            className="border border-cloud rounded bg-white p-[11px] text-sm font-normal text-tint mb-6 transition-all duration-200 placeholder:text-clay hover:border-clay"
          />
        </div>
        <footer className="p-4 flex justify-between shadow-[0_0_32px_0_rgba(0,0,0,0.1)] z-1">
          <button
            className="appearance-none border-0 bg-transparent p-0 pl-1 text-stone text-sm font-semibold transition-all duration-200 cursor-pointer hover:text-tint"
            onClick={() => setFilters({})}
          >
            Hreinsa leit
          </button>
          <button
            className="appearance-none p-[11px_16px_12px_16px] bg-sky border-0 rounded-full text-lab text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-sky-darker"
            onClick={handleDone}
          >
            Sýna niðurstöður{' '}
            <span className="opacity-80">{getCountPreview(filters)}</span>
          </button>
        </footer>
      </section>
    </div>
  )
}

export default FiltersModal
