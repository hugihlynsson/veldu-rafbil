import React, { useEffect, useState } from 'react'

import { Availability, Drive, Filters } from '../types'
import { colors } from '../modules/globals'

interface Props {
  initialFilters: Filters
  onSubmit: (filters: Filters) => void
  getCountPreview: (filters: Filters) => number
  onDone: () => void
}

enum State {
  Initializing,
  Visible,
  Leaving,
}

const FiltersModal: React.FunctionComponent<Props> = ({
  initialFilters,
  onSubmit,
  getCountPreview,
  onDone,
}) => {
  const [state, setState] = useState<State>(State.Initializing)
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [nameInput, setNameInput] = useState<string>(
    filters.name?.join(', ') ?? '',
  )

  useEffect(() => {
    setTimeout(() => setState(() => State.Visible), 1)
    return
  }, [])

  const handleClose = () => {
    setState(() => State.Leaving)
    setTimeout(onDone, 300)
  }

  const handleDone = () => {
    onSubmit(filters)
    setState(() => State.Leaving)
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
      className={`container ${state === State.Visible ? 'visible' : ''}`}
      onClick={handleClose}
    >
      <section
        className={state === State.Visible ? 'visible' : ''}
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <button onClick={handleClose} className="close">
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
                fill={colors.stone}
              />
            </svg>
          </button>
          Síur
        </header>
        <div className="filters">
          <div className="filter-header">
            <label htmlFor="filter-name">Nafn</label>
          </div>
          <input
            id="filter-name"
            type="text"
            placeholder="Tesla, Kia"
            onChange={handleFilterChange('name')}
            onKeyDown={handleKeyPress}
            value={nameInput}
          />
          <div className="filter-header">
            <label htmlFor="filter-price">Verð</label>
            <p className="label-description">Hámark</p>
          </div>
          <input
            id="filter-price"
            type="number"
            placeholder="25000000"
            onChange={handleFilterChange('price')}
            onKeyDown={handleKeyPress}
            value={filters.price ?? ''}
          />
          <div className="filter-header">
            <label htmlFor="filter-range">Drægni</label>
            <p className="label-description">Lágmark</p>
          </div>
          <input
            id="filter-range"
            type="number"
            placeholder="230"
            onChange={handleFilterChange('range')}
            onKeyDown={handleKeyPress}
            value={filters.range ?? ''}
          />
          <div className="filter-header">
            <label htmlFor="filter-drive">Drif</label>
          </div>
          <select
            id="filter-drive"
            onChange={handleFilterChange('drive')}
            onKeyDown={handleKeyPress}
            value={filters.drive?.[0] ?? 'all'}
          >
            <option value="all">Öll</option>
            <option value="AWD">AWD</option>
            <option value="FWD">FWD</option>
            <option value="RWD">RWD</option>
          </select>
          <div className="filter-header">
            <label htmlFor="filter-drive">Framboð</label>
          </div>
          <select
            id="filter-availability"
            onChange={handleFilterChange('availability')}
            onKeyDown={handleKeyPress}
            value={filters.availability ?? 'all'}
          >
            <option value="all">Allir</option>
            <option value="available">Fáanlegir</option>
            <option value="expected">Væntanlegir</option>
          </select>
          <div className="filter-header">
            <label htmlFor="filter-acceleration">Hröðun</label>
            <p className="label-description">Lágmark, sec</p>
          </div>
          <input
            id="filter-acceleration"
            type="number"
            placeholder="8.0"
            onChange={handleFilterChange('acceleration')}
            onKeyDown={handleKeyPress}
            value={filters.acceleration ?? ''}
          />
          <div className="filter-header">
            <label htmlFor="filter-value">Verði á km</label>
            <p className="label-description">Hámark</p>
          </div>
          <input
            id="filter-value"
            type="number"
            placeholder="44000"
            onChange={handleFilterChange('value')}
            onKeyDown={handleKeyPress}
            value={filters.value ?? ''}
          />
          <div className="filter-header">
            <label htmlFor="filter-fastcharge">Hraðhleðsla</label>
            <p className="label-description">Lágmark, km/min</p>
          </div>
          <input
            id="filter-fastcharge"
            type="number"
            placeholder="3.1"
            onChange={handleFilterChange('fastcharge')}
            onKeyDown={handleKeyPress}
            value={filters.fastcharge ?? ''}
          />
        </div>
        <footer>
          <button className="clear" onClick={() => setFilters({})}>
            Hreinsa síur
          </button>
          <button className="submit" onClick={handleDone}>
            Sýna niðurstöður{' '}
            <span style={{ opacity: 0.8 }}>{getCountPreview(filters)}</span>
          </button>
        </footer>
      </section>

      <style jsx>{`
        .container {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .container:before {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-color: rgba(0, 0, 0, 0);
          transition: background-color 0.2s;
          transition-delay: 0.1s;
        }
        .container.visible:before {
          transition-delay: 0s;
          background-color: rgba(0, 0, 0, 0.3);
        }

        section {
          z-index: 1;
          display: flex;
          flex-direction: column;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          background-color: #fff;
          width: 100vw;
          max-width: 400px;
          max-height: 70vh;
          overflow: hidden;
          box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.1);
          transform: translateY(40px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.32, 0, 0.67, 0); /* Ease in quad */
        }
        section.visible {
          opacity: 1;
          transition-timing-function: cubic-bezier(
            0.33,
            1,
            0.68,
            1
          ); /* Ease out Cubic */
          transform: translateY(0);
        }

        header {
          position: relative;
          background-color: #fff;
          font-size: 18px;
          text-align: center;
          padding: 16px;
          border-bottom: 1px solid ${colors.cloud};
          font-weight: 600;
        }

        .close {
          position: absolute;
          left: 11px;
          top: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 32px;
          width: 32px;
          border: 0;
          padding: 0;
          border-radius: 16px;
          appearance: none;
          background-color: transparent;
          font-size: 30px;
          color: ${colors.stone};
          cursor: pointer;
          transition: all 0.2s;
        }
        .close:hover {
          background-color: ${colors.cloud};
        }
        .close path {
          transition: all 0.2s;
        }
        .close:hover path {
          fill: ${colors.tint};
        }

        .filters {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          flex-shring: 1;
          overflow: scroll;
          padding: 20px;
          padding-bottom: 8px;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 4px;
          padding-left: 12px;
          padding-right: 12px;
        }

        label {
          color: ${colors.tint};
          font-size: 12px;
          font-weight: 600;
        }

        .label-description {
          margin: 0;
          font-size: 12px;
          color: ${colors.clay};
        }

        input {
          border: 1px solid ${colors.cloud};
          border-radius: 4px;
          padding: 11px;
          font-size: 14px;
          font-weight: 400;
          color: ${colors.tint};
          margin-bottom: 24px;
          transition: all 0.2s;
        }
        input::placeholder {
          color: ${colors.clay};
        }
        input:hover {
          border-color: ${colors.clay};
        }

        select {
          appearance: none;
          border: 1px solid ${colors.cloud};
          background-color: ${colors.lab};
          border-radius: 4px;
          padding: 11px;
          font-size: 14px;
          font-weight: 400;
          color: ${colors.tint};
          margin-bottom: 24px;
          cursor: pointer;
        }
        select:hover {
          border-color: ${colors.clay};
        }

        footer {
          padding: 16px;
          display: flex;
          justify-content: space-between;
          box-shadow: 0 0 32px 0 rgba(0, 0, 0, 0.1);
          z-index: 1; /* Have the shadow appear above the input elements */
        }

        .clear {
          appearance: none;
          border: 0;
          background-color: transparent;
          padding: 0;
          padding-left: 4px;
          color: ${colors.stone};
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
          cursor: pointer;
        }
        .clear:hover {
          color: ${colors.tint};
        }

        .submit {
          appearance: none;
          padding: 11px 16px 12px 16px;
          background-color: ${colors.sky};
          border: 0;
          border-radius: 100px;
          color: ${colors.lab};
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .submit:hover {
          background-color: ${colors.skyDarker};
        }

        @media (min-height: 600px) and (min-width: 800px) {
          .container {
            align-items: center;
          }
          section {
            border-radius: 20px;
            max-height: 500px;
          }
        }
      `}</style>
    </div>
  )
}

export default FiltersModal
