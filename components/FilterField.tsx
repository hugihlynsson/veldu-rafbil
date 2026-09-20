import React, { ReactNode } from 'react'

const controlClasses =
  'border border-line-strong rounded bg-surface p-[11px] text-base font-normal text-tint mb-6 transition-all duration-200 placeholder:text-clay hover:border-clay'

const selectClasses =
  'appearance-none border border-line-strong bg-surface rounded p-[11px] text-base font-normal text-tint mb-6 cursor-pointer hover:border-clay'

interface LabelProps {
  id: string
  label: string
  /** "Hámark" or "Lágmark", with the unit where there is one to give */
  hint?: string
  children: ReactNode
}

const Field: React.FunctionComponent<LabelProps> = ({
  id,
  label,
  hint,
  children,
}) => (
  <>
    <div className="flex gap-2 items-baseline mb-1 px-3">
      <label htmlFor={id} className="text-tint text-xs font-semibold">
        {label}
      </label>
      {hint && <p className="m-0 text-xs text-clay">{hint}</p>}
    </div>
    {children}
  </>
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
}) => (
  <Field id={id} label={label} hint={hint}>
    <input
      ref={inputRef}
      id={id}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={value}
      className={controlClasses}
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

/** "all" is the option that means no filter */
export const FilterSelect: React.FunctionComponent<SelectProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  onKeyDown,
}) => (
  <Field id={id} label={label}>
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
  </Field>
)
