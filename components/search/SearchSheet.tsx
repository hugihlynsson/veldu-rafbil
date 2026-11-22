'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import Modal, { sheetPanel } from '@/components/Modal'
import CloseButton from '@/components/CloseButton'
import SearchIcon from '@/components/SearchIcon'
import FilterSuggestions, {
  type BarAction,
} from '@/components/filters/FilterSuggestions'
import { MakeChip } from '@/components/filters/MakeRow'
import cars from '@/modules/data/cars'
import carFilter from '@/modules/list/carFilter'
import {
  bodyTypeLabels,
  bodyTypes,
  type BodyType,
} from '@/modules/list/bodyTypes'
import { MAX_INTENT_LENGTH } from '@/modules/list/filterIntent'
import { activeChips } from '@/modules/list/filterChips'
import { normalizeFilters, type Filters } from '@/modules/list/filters'
import {
  millionsText,
  pricePresets,
  quickToggleOn,
  quickToggles,
  toggledQuick,
} from '@/modules/list/search'
import { agree } from '@/modules/copy/plural'
import { getInputModality } from '@/utils/inputModality'
import { showCarsText, type SearchSection } from './SearchHeader'

const countOf = (filters: Filters) =>
  cars.filter(carFilter(normalizeFilters(filters))).length

const steps = pricePresets(cars)

const without = (filters: Filters, key: keyof Filters): Filters => {
  const rest = { ...filters }
  delete rest[key]
  return rest
}

const Section = ({
  title,
  sectionRef,
  children,
}: {
  title: string
  sectionRef?: (element: HTMLElement | null) => void
  children: ReactNode
}) => (
  <section ref={sectionRef} className="scroll-mt-4">
    <h3 className="m-0 mb-3 text-sm font-semibold text-tint">{title}</h3>
    {children}
  </section>
)

const Choice = ({
  pressed,
  onClick,
  children,
  className,
}: {
  pressed: boolean
  onClick: () => void
  children: ReactNode
  className?: string
}) => (
  <button
    type="button"
    aria-pressed={pressed}
    onClick={onClick}
    className={clsx(
      'border-0 cursor-pointer transition duration-150 active:scale-96 active:duration-75',
      pressed
        ? 'bg-surface text-tint ring-2 ring-inset ring-tint'
        : 'bg-surface text-tint ring-1 ring-inset ring-line-field hover:ring-line-strong',
      className,
    )}
  >
    {children}
  </button>
)

interface Props {
  initialFilters: Filters
  /** The part of the search that was tapped, which it opens at */
  section: SearchSection
  onSubmit: (filters: Filters) => void
  /** To the full set of fields, with what has been chosen here so far */
  onAllFilters: (filters: Filters) => void
  onDone: () => void
}

/**
 * The whole search, with what each choice leaves counted on the button that
 * shows them. Nothing reaches the list until then, so closing it any other way
 * leaves the list as it was.
 */
export default function SearchSheet({
  initialFilters,
  section,
  onSubmit,
  onAllFilters,
  onDone,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const sections = useRef<Partial<Record<SearchSection, HTMLElement>>>({})
  const [draft, setDraft] = useState<Filters>(initialFilters)
  const [text, setText] = useState('')
  const [action, setAction] = useState<BarAction | null>(null)
  const count = countOf(draft)

  // Opened at what was tapped; the text field is focused instead, by Modal
  useEffect(() => {
    if (section !== 'text') sections.current[section]?.scrollIntoView()
  }, [section])

  const sectionRef = (name: SearchSection) => (element: HTMLElement | null) => {
    if (element) sections.current[name] = element
  }

  const applyText = (filters: Filters) => {
    setDraft(filters)
    setText('')
    if (getInputModality() === 'keyboard') inputRef.current?.focus()
  }

  const toggleBody = (type: BodyType) => {
    const current = draft.body ?? []
    const next = current.includes(type)
      ? current.filter((other) => other !== type)
      : [...current, type]
    setDraft(next.length ? { ...draft, body: next } : without(draft, 'body'))
  }

  const fourWheel = draft.drive?.length === 1 && draft.drive[0] === 'AWD'
  // Chosen here or carried in, the filters that have no place of their own
  // above, so they can be seen and taken off
  const otherChips = activeChips(draft).filter(
    ({ name }) =>
      !['price', 'body', 'drive'].includes(name) &&
      !quickToggles.some(
        (toggle) => toggle.key === name && quickToggleOn(toggle, draft),
      ),
  )

  return (
    <Modal
      labelledBy="search-sheet-title"
      onDone={onDone}
      initialFocusRef={section === 'text' ? inputRef : undefined}
      returnFocus="keyboard"
      className={clsx(
        'items-end data-[state=visible]:backdrop:bg-backdrop-strong',
        'sheet-panel:items-center',
      )}
    >
      {({ close }) => (
        <section className={clsx(sheetPanel, 'h-[92dvh] sheet-panel:h-auto')}>
          <header className="relative bg-surface text-center px-4 py-3 border-b border-line sheet-panel:py-4.5">
            <CloseButton onClick={close} className="sheet-panel:left-4" />
            <h2 id="search-sheet-title" className="m-0 text-lg font-semibold">
              Leita
            </h2>
          </header>

          <div className="grow shrink overflow-y-auto flex flex-col gap-8 p-5 pb-10 sheet-panel:p-6 sheet-panel:pb-10">
            <div>
              <label
                htmlFor="search-text"
                className="flex items-center gap-3 rounded-2xl bg-surface ring-1 ring-inset ring-line-field px-4 transition-shadow duration-150 focus-within:ring-2 focus-within:ring-tint"
              >
                <SearchIcon size={15} className="shrink-0 text-stone" />
                <input
                  ref={inputRef}
                  id="search-text"
                  type="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  maxLength={MAX_INTENT_LENGTH}
                  placeholder="Kia EV3, jeppi með dráttarkrók…"
                  value={text}
                  onChange={(event) => setText(event.currentTarget.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key !== 'Enter' ||
                      event.nativeEvent.isComposing ||
                      event.keyCode === 229
                    )
                      return
                    event.preventDefault()
                    if (action?.filter) applyText(action.filter.filters)
                  }}
                  className="grow min-w-0 border-0 bg-transparent py-3.5 text-base text-tint outline-none placeholder:text-clay"
                />
              </label>
              <div className="mt-3">
                <FilterSuggestions
                  active
                  text={text}
                  filters={draft}
                  onApply={applyText}
                  onAction={setAction}
                />
              </div>
            </div>

            <Section title="Verð" sectionRef={sectionRef('price')}>
              <div className="flex flex-wrap gap-2">
                <Choice
                  pressed={draft.price === undefined}
                  onClick={() => setDraft(without(draft, 'price'))}
                  className="rounded-full py-2.5 px-4 text-control font-semibold"
                >
                  Hvaða verð sem er
                </Choice>
                {[
                  ...new Set([
                    ...steps,
                    ...(draft.price === undefined ? [] : [draft.price]),
                  ]),
                ]
                  .sort((a, b) => a - b)
                  .map((price) => (
                    <Choice
                      key={price}
                      pressed={draft.price === price}
                      onClick={() => setDraft({ ...draft, price })}
                      className="rounded-full py-2.5 px-4 text-control font-semibold"
                    >
                      Undir {millionsText(price)}
                    </Choice>
                  ))}
              </div>
            </Section>

            <Section title="Gerð" sectionRef={sectionRef('body')}>
              <div className="grid grid-cols-2 gap-2 xs:grid-cols-3">
                {bodyTypes.map((type) => {
                  const pressed = draft.body?.includes(type) ?? false
                  const left = countOf({
                    ...without(draft, 'body'),
                    body: [type],
                  })
                  return (
                    <Choice
                      key={type}
                      pressed={pressed}
                      onClick={() => toggleBody(type)}
                      className="flex flex-col items-start gap-0.5 rounded-xl py-3 px-3.5 text-left"
                    >
                      <span className="text-sm font-semibold">
                        {bodyTypeLabels[type]}
                      </span>
                      <span
                        className={clsx(
                          'text-xs',
                          left === 0 ? 'text-clay' : 'text-stone',
                        )}
                      >
                        {agree(left, `${left} bíll`, `${left} bílar`)}
                      </span>
                    </Choice>
                  )
                })}
              </div>
            </Section>

            <Section title="Drif" sectionRef={sectionRef('drive')}>
              <Choice
                pressed={fourWheel}
                onClick={() =>
                  setDraft(
                    fourWheel
                      ? without(draft, 'drive')
                      : { ...draft, drive: ['AWD'] },
                  )
                }
                className="w-full flex items-center justify-between gap-4 rounded-xl py-3.5 px-4 text-left"
              >
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">Fjórhjóladrif</span>
                  <span className="text-xs text-stone">
                    Fyrir snjó, hálku og malarvegi
                  </span>
                </span>
                <span
                  aria-hidden
                  className={clsx(
                    'relative shrink-0 w-11 h-6.5 rounded-full transition-colors duration-200',
                    fourWheel ? 'bg-tint' : 'bg-smoke',
                  )}
                >
                  <span
                    className={clsx(
                      'absolute top-0.75 size-5 rounded-full bg-surface shadow-(--shadow-raised) transition-[left] duration-200',
                      fourWheel ? 'left-5.25' : 'left-0.75',
                    )}
                  />
                </span>
              </Choice>
            </Section>

            <Section title="Fleira">
              <div className="flex flex-wrap gap-1.5">
                {quickToggles.map((toggle) => (
                  <MakeChip
                    key={toggle.key}
                    pressed={quickToggleOn(toggle, draft)}
                    onClick={() => setDraft(toggledQuick(toggle, draft))}
                  >
                    {toggle.label}
                  </MakeChip>
                ))}
                {otherChips.map(({ name, label, value, removeLabel }) => (
                  <MakeChip
                    key={name}
                    pressed
                    label={removeLabel}
                    onClick={() => setDraft(without(draft, name))}
                  >
                    {label} {value} <span className="text-stone">×</span>
                  </MakeChip>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  onAllFilters(draft)
                  close()
                }}
                className="mt-4 border-0 bg-transparent p-0 text-sm font-semibold text-tint underline underline-offset-3 cursor-pointer"
              >
                Allar síur
              </button>
            </Section>
          </div>

          <footer className="p-4 flex justify-between items-center shadow-(--shadow-sheet-footer) z-1">
            <button
              type="button"
              className="appearance-none border-0 bg-transparent p-0 pl-1 sheet-panel:pl-2 text-stone text-sm font-semibold transition-[color,opacity] duration-200 cursor-pointer hover:enabled:text-tint disabled:opacity-40 disabled:cursor-default"
              disabled={Object.keys(draft).length === 0 && text === ''}
              onClick={() => {
                setDraft({})
                setText('')
              }}
            >
              Hreinsa
            </button>
            <button
              type="button"
              className="appearance-none px-5 pt-2.75 pb-3 bg-sky border-0 rounded-full text-on-sky text-sm font-semibold cursor-pointer transition duration-150 hover:bg-sky-hover active:scale-96 active:duration-75"
              onClick={() => {
                onSubmit(draft)
                close()
              }}
            >
              {showCarsText(count)}
            </button>
          </footer>
        </section>
      )}
    </Modal>
  )
}
