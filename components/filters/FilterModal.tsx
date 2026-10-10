import React, { useRef, useState } from 'react'

import {
  fieldFromFilter,
  fieldsFromFilters,
  filtersFromFields,
  type FilterFields,
  type FilterKey,
  type Filters,
} from '@/modules/list/filters'
import clsx from 'clsx'
import Modal, { panelMotion } from '@/components/Modal'
import CloseButton from '@/components/CloseButton'
import { FilterInput, FilterSelect } from './FilterField'

type Field =
  | {
      kind: 'input'
      label: string
      hint?: string
      type: 'text' | 'number'
      placeholder: string
    }
  | {
      kind: 'select'
      label: string
      options: Array<[string, string]>
    }

// Mapped over `Filters`, so a new filter does not compile until it has a
// field. In the order the modal shows them.
const fields: { [Key in FilterKey]-?: Field } = {
  name: {
    kind: 'input',
    label: 'Nafn',
    type: 'text',
    placeholder: 'Tesla, Kia',
  },
  price: {
    kind: 'input',
    label: 'Verð',
    hint: 'Hámark',
    type: 'number',
    placeholder: '25000000',
  },
  range: {
    kind: 'input',
    label: 'Drægni',
    hint: 'Lágmark',
    type: 'number',
    placeholder: '230',
  },
  drive: {
    kind: 'select',
    label: 'Drif',
    options: [
      ['', 'Öll'],
      ['AWD', 'AWD'],
      ['FWD', 'FWD'],
      ['RWD', 'RWD'],
    ],
  },
  seats: {
    kind: 'select',
    label: 'Sæti',
    options: [
      ['', 'Öll'],
      ['4', '4+'],
      ['5', '5+'],
      ['6', '6+'],
      ['7', '7+'],
    ],
  },
  availability: {
    kind: 'select',
    label: 'Framboð',
    options: [
      ['', 'Allir'],
      [fieldFromFilter('availability', 'available'), 'Fáanlegir'],
      [fieldFromFilter('availability', 'expected'), 'Væntanlegir'],
    ],
  },
  acceleration: {
    kind: 'input',
    label: 'Hröðun',
    hint: 'Hámark, sec',
    type: 'number',
    placeholder: '8.0',
  },
  value: {
    kind: 'input',
    label: 'Verði á km',
    hint: 'Hámark',
    type: 'number',
    placeholder: '44000',
  },
  fastcharge: {
    kind: 'input',
    label: 'Hraðhleðsla',
    hint: 'Lágmark, km/min',
    type: 'number',
    placeholder: '3.1',
  },
}

// A link or a suggestion can ask for what no one option is, two drives or
// eight seats, and a select cannot show a value it has no option for
const withCurrent = (
  options: Array<[string, string]>,
  current: string | undefined,
): Array<[string, string]> =>
  current && !options.some(([value]) => value === current)
    ? [...options, [current, current]]
    : options

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
  const [values, setValues] = useState<FilterFields>(() =>
    fieldsFromFilters(initialFilters),
  )
  const filters = filtersFromFields(values)

  const handleFilterChange =
    (name: FilterKey) =>
    (event: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.currentTarget.value
      setValues((values) => ({ ...values, [name]: value }))
    }

  return (
    <Modal
      labelledBy="filter-modal-title"
      onDone={onDone}
      initialFocusRef={nameInputRef}
      className={clsx(
        'items-end data-[state=visible]:backdrop:bg-backdrop-strong',
        'sheet-panel:items-center',
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
              'z-1 flex flex-col rounded-t-sheet bg-surface w-screen max-w-[400px] max-h-[85dvh] overflow-hidden shadow-(--shadow-sheet)',
              panelMotion,
              'sheet-panel:rounded-sheet sheet-panel:max-h-[500px]',
            )}
          >
            <header className="relative bg-surface text-center px-4 py-3 border-b border-line">
              <CloseButton onClick={close} />
              <h2 id="filter-modal-title" className="m-0 text-lg font-semibold">
                Leita
              </h2>
            </header>
            <div className="flex flex-col gap-6 grow shrink overflow-y-auto p-5 pb-8">
              {(Object.keys(fields) as FilterKey[]).map((key) => {
                const field = fields[key]
                const id = `filter-${key}`
                const value = values[key] ?? ''
                return field.kind === 'input' ? (
                  <FilterInput
                    key={key}
                    id={id}
                    inputRef={key === 'name' ? nameInputRef : undefined}
                    label={field.label}
                    hint={field.hint}
                    type={field.type}
                    placeholder={field.placeholder}
                    onChange={handleFilterChange(key)}
                    onKeyDown={handleKeyPress}
                    value={value}
                  />
                ) : (
                  <FilterSelect
                    key={key}
                    id={id}
                    label={field.label}
                    options={withCurrent(field.options, values[key])}
                    onChange={handleFilterChange(key)}
                    onKeyDown={handleKeyPress}
                    value={value}
                  />
                )
              })}
            </div>
            <footer className="p-4 flex justify-between shadow-(--shadow-sheet-footer) z-1">
              <button
                className="appearance-none border-0 bg-transparent p-0 pl-1 text-stone text-sm font-semibold transition-colors duration-200 cursor-pointer hover:text-tint"
                onClick={() => setValues({})}
              >
                Hreinsa leit
              </button>
              <button
                className="appearance-none px-4 pt-2.75 pb-3 bg-sky border-0 rounded-full text-on-sky text-sm font-semibold cursor-pointer transition duration-200 hover:bg-sky-hover active:scale-[0.98]"
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
