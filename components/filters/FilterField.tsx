import type { ReactNode } from 'react'
import React from 'react'

import ChevronIcon from '@/components/ChevronIcon'

const controlClasses =
  'block w-full border border-line-field rounded-xl bg-surface p-2.75 text-base font-normal text-tint transition-[border-color] duration-200 hover:border-line-strong'

const inputClasses = `${controlClasses} placeholder:text-clay`

const selectClasses = `${controlClasses} appearance-none pr-10 cursor-pointer`

interface LabelProps {
  id: string
  label: string
  /** "Hámark" or "Lágmark", with the unit where there is one to give */
  hint?: string
  className?: string
  children: ReactNode
}

const Field: React.FunctionComponent<LabelProps> = ({
  id,
  label,
  hint,
  className,
  children,
}) => (
  <div className={className}>
    <div className="flex gap-2 items-baseline mb-1 px-3">
      <label htmlFor={id} className="text-tint text-xs font-semibold">
        {label}
      </label>
      {hint && <p className="m-0 text-xs text-clay">{hint}</p>}
    </div>
    {children}
  </div>
)

type ControlEvent = React.FormEvent<HTMLInputElement | HTMLSelectElement>
type ControlKeyEvent = React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>

interface InputProps {
  id: string
  label: string
  hint?: string
  type: 'text' | 'number'
  placeholder: string
  value: string | number
  onChange: (event: ControlEvent) => void
  onKeyDown: (event: ControlKeyEvent) => void
  inputRef?: React.Ref<HTMLInputElement>
  className?: string
}

export const FilterInput: React.FunctionComponent<InputProps> = ({
  id,
  label,
  hint,
  type,
  placeholder,
  value,
  onChange,
  onKeyDown,
  inputRef,
  className,
}) => (
  <Field id={id} label={label} hint={hint} className={className}>
    <input
      ref={inputRef}
      id={id}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={value}
      className={inputClasses}
    />
  </Field>
)

interface SelectProps {
  id: string
  label: string
  /** Value and Icelandic label, in the order they are offered */
  options: Array<[string, string]>
  value: string
  onChange: (event: ControlEvent) => void
  onKeyDown: (event: ControlKeyEvent) => void
}

/** An option with the value "" is the one that means no filter */
export const FilterSelect: React.FunctionComponent<SelectProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  onKeyDown,
}) => (
  <Field id={id} label={label}>
    {/* appearance-none takes the browser's chevron, which is all that tells a
        select from a text field, so it is drawn back */}
    <div className="relative">
      <select
        id={id}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={value}
        className={selectClasses}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
      <ChevronIcon
        size={12}
        direction="down"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone"
      />
    </div>
  </Field>
)
