import { colors } from '../modules/globals'

interface Props<P> {
  items: Array<[string, P]>
  onClick: (value: P) => void
  currentValue: P | undefined
}

export default function Toggles<P>({ items, onClick, currentValue }: Props<P>) {
  return (
    <div className="toggles">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="toggle"
          style={
            value === currentValue
              ? { backgroundColor: colors.cloud, color: '#000' }
              : undefined
          }
          onClick={() => onClick(value)}
        >
          {label}
        </div>
      ))}

      <style jsx>
        {`
          .toggles {
            display: flex;
            max-width: 100%;
            border: 1px solid ${colors.cloud};
            align-self: flex-start;
            border-radius: 4px;
          }
          .toggle {
            font-size: 12px;
            font-weight: 600;
            padding: 6px 16px;
            cursor: pointer;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            border-right: 1px solid #eee;
            white-space: nowrap;
            min-width: 0;
            color: ${colors.tint};
          }
          .toggle:last-child {
            border-right-width: 0;
          }
          .toggle:hover {
            background-color: #f8f8f8;
          }
        `}
      </style>
    </div>
  )
}
