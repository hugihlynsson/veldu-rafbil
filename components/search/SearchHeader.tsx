import type { ReactNode, Ref } from 'react'
import clsx from 'clsx'

import Logo from '@/components/Logo'
import SearchIcon from '@/components/SearchIcon'
import TextLink from '@/components/TextLink'
import cars from '@/modules/data/cars'
import { grantAmountText, grantCeilingText } from '@/modules/copy/grantCopy'
import { listLead } from '@/modules/copy/listHeadline'
import { agree } from '@/modules/copy/plural'
import type { Filters } from '@/modules/list/filters'
import {
  bodySummary,
  driveSummary,
  presetMatches,
  presets,
  priceSummary,
  searchSummary,
  textSummary,
  type Preset,
} from '@/modules/list/search'
import type { SortingState } from '@/modules/list/sorting'

export type SearchSection = 'text' | 'price' | 'body' | 'drive'

/**
 * Scrolled sideways below md, out to the screen's edges rather than the
 * column's, with the first chip padded back in line with the text; wrapped
 * from md. As the make row does.
 */
export const edgeScroll =
  'overflow-x-auto no-scrollbar max-md:mx-[calc(50%-50vw)] max-md:px-[calc(50vw-50%)] max-md:scroll-px-[calc(50vw-50%)] md:flex-wrap md:overflow-visible'

const shownPresets = presets(cars)

/** "14 bíla", as a button that shows them reads */
export const showCarsText = (count: number) =>
  `Sýna ${count} ${agree(count, 'bíl', 'bíla')}`

interface BarProps {
  filters: Filters
  count: number
  onOpen: (section: SearchSection) => void
  onShowResults: () => void
}

/** The search as one button on a phone, which opens the whole of it */
export function SearchPill({
  filters,
  count,
  onOpen,
  className,
}: Omit<BarProps, 'onShowResults'> & { className?: string }) {
  const summary = searchSummary(filters)
  return (
    <button
      type="button"
      onClick={() => onOpen('text')}
      className={clsx(
        'w-full flex items-center gap-3.5 border-0 rounded-full bg-surface shadow-(--shadow-search) py-3 pl-5 pr-4 text-left cursor-pointer transition duration-150 active:scale-98',
        className,
      )}
    >
      <SearchIcon size={16} className="shrink-0 text-tint" />
      <span className="flex flex-col min-w-0 grow">
        <span className="text-sm font-semibold text-tint truncate">
          {summary.length ? summary.join(' · ') : 'Leita að rafbíl'}
        </span>
        <span className="text-xs text-stone truncate">
          {summary.length
            ? `${count} ${agree(count, 'bíll', 'bílar')}`
            : 'Nafn · Verð · Gerð · Drif'}
        </span>
      </span>
    </button>
  )
}

const Segment = ({
  label,
  value,
  placeholder,
  onClick,
  className,
}: {
  label: string
  value?: string
  placeholder: string
  onClick: () => void
  className?: string
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      'group/segment relative flex flex-col gap-0.5 min-w-0 border-0 bg-transparent rounded-full py-2.5 px-6 text-left cursor-pointer transition-colors duration-150 hover:bg-haze',
      // The divider before each but the first, gone beside a hovered one
      'before:absolute before:left-0 before:top-1/4 before:h-1/2 before:w-px before:bg-line first:before:hidden hover:before:opacity-0',
      className,
    )}
  >
    <span className="text-xs font-semibold text-tint">{label}</span>
    <span
      className={clsx('text-sm truncate', value ? 'text-tint' : 'text-clay')}
    >
      {value ?? placeholder}
    </span>
  </button>
)

/** The search laid out as its four questions, from md */
export function SegmentedBar({
  filters,
  count,
  onOpen,
  onShowResults,
}: BarProps) {
  return (
    <div className="flex items-center rounded-full bg-surface shadow-(--shadow-search) p-1.5 max-w-[52rem]">
      <Segment
        className="flex-[1.5]"
        label="Leit"
        value={textSummary(filters)}
        placeholder="Nafn eða þörf"
        onClick={() => onOpen('text')}
      />
      <Segment
        className="flex-1"
        label="Verð"
        value={priceSummary(filters)}
        placeholder="Öll verð"
        onClick={() => onOpen('price')}
      />
      <Segment
        className="flex-1"
        label="Gerð"
        value={bodySummary(filters)}
        placeholder="Allar gerðir"
        onClick={() => onOpen('body')}
      />
      <Segment
        className="flex-1"
        label="Drif"
        value={driveSummary(filters)}
        placeholder="Öll drif"
        onClick={() => onOpen('drive')}
      />
      <button
        type="button"
        onClick={onShowResults}
        className="shrink-0 flex items-center gap-2 border-0 rounded-full bg-sky text-on-sky py-3.5 pl-4.5 pr-5 text-sm font-semibold whitespace-nowrap cursor-pointer transition duration-150 hover:bg-sky-hover active:scale-96"
      >
        <SearchIcon size={14} />
        {showCarsText(count)}
      </button>
    </div>
  )
}

const PresetButton = ({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean
  onClick: () => void
  children: ReactNode
}) => (
  <button
    type="button"
    aria-pressed={pressed}
    onClick={onClick}
    className={clsx(
      'shrink-0 border-0 rounded-full py-2.5 px-4 text-control font-semibold whitespace-nowrap cursor-pointer transition duration-150 active:scale-96 active:duration-75',
      pressed ? 'bg-tint text-lab' : 'bg-cloud text-tint hover:bg-smoke',
    )}
  >
    {children}
  </button>
)

interface Props extends BarProps {
  sorting: SortingState
  barRef: Ref<HTMLDivElement>
  onPreset: (preset: Preset) => void
  /** The make row, under the ways in */
  children?: ReactNode
  /** Beside the headline from lg, where it would otherwise leave half empty */
  aside?: ReactNode
}

export default function SearchHeader({
  filters,
  count,
  sorting,
  barRef,
  onOpen,
  onShowResults,
  onPreset,
  children,
  aside,
}: Props) {
  return (
    <>
      <h1 className="mt-6 mb-8 md:mt-10 md:mb-10">
        <Logo className="w-40 md:w-52" />
      </h1>

      <div className="flex items-end justify-between gap-10 mb-6 md:mb-8">
        <div>
          <p className="m-0 text-[1.75rem] leading-tight font-semibold text-tint text-balance md:text-display">
            Finndu rafbílinn sem hentar þér
          </p>
          <p className="m-0 mt-2 text-sm text-stone text-pretty max-w-[36em] md:text-base">
            {listLead(cars.length)}, með verði, drægni og hleðsluhraða til
            samanburðar.
          </p>
        </div>
        {aside && <div className="hidden lg:block shrink-0">{aside}</div>}
      </div>

      <div ref={barRef}>
        <SearchPill
          className="md:hidden"
          filters={filters}
          count={count}
          onOpen={onOpen}
        />
        <div className="hidden md:block">
          <SegmentedBar
            filters={filters}
            count={count}
            onOpen={onOpen}
            onShowResults={onShowResults}
          />
        </div>
      </div>

      <fieldset
        aria-label="Leiðir inn í listann"
        className={clsx('m-0 min-w-0 border-0 p-0 flex gap-2 mt-5', edgeScroll)}
      >
        {shownPresets.map((preset) => (
          <PresetButton
            key={preset.id}
            pressed={presetMatches(preset, filters, sorting)}
            onClick={() => onPreset(preset)}
          >
            {preset.label}
          </PresetButton>
        ))}
      </fieldset>

      {children}

      <p className="m-0 mt-6 text-xs text-stone max-w-[36em]">
        Kaupendur nýskráðra rafbíla sem kosta minna en {grantCeilingText} eiga
        kost á að{' '}
        <TextLink href="https://island.is/rafbilastyrkir">
          sækja um {grantAmountText} rafbílastyrk
        </TextLink>
        .
      </p>
    </>
  )
}
