import clsx from 'clsx'

interface Props<P> {
  items: Array<[string, P]>
  onClick: (value: P) => void
  currentValue: P | undefined
}

export default function Toggles<P>({ items, onClick, currentValue }: Props<P>) {
  return (
    <div className="flex max-w-full bg-black/4 self-start rounded-[10px] p-[3px] gap-[3px] xs:rounded-xl xs:p-1 xs:gap-1">
      {items.map(([label, value]) => (
        <div
          key={label}
          className={clsx(
            'text-xs font-semibold py-[7px] px-3 cursor-pointer text-center flex justify-center items-center whitespace-nowrap min-w-0 rounded-[7px] transition-all duration-200 ease-out relative',
            'xs:text-[13px] xs:py-2 xs:px-4 xs:rounded-lg',
            value === currentValue
              ? 'bg-white text-tint shadow-sm'
              : 'text-stone hover:text-tint hover:bg-white/50 active:scale-[0.97]',
          )}
          onClick={() => onClick(value)}
        >
          {label}
        </div>
      ))}
    </div>
  )
}
