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
              ? {
                  backgroundColor: '#fff',
                  color: colors.tint,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
                }
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
            background-color: rgba(0, 0, 0, 0.04);
            align-self: flex-start;
            border-radius: 10px;
            padding: 3px;
            gap: 3px;
          }
          .toggle {
            font-size: 12px;
            font-weight: 600;
            padding: 7px 12px;
            cursor: pointer;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            white-space: nowrap;
            min-width: 0;
            color: ${colors.stone};
            border-radius: 7px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
          }
          .toggle:hover {
            color: ${colors.tint};
            background-color: rgba(255, 255, 255, 0.5);
          }
          .toggle:active {
            transform: scale(0.97);
          }

          @media (min-width: 375px) {
            .toggles {
              border-radius: 12px;
              padding: 4px;
              gap: 4px;
            }
            .toggle {
              font-size: 13px;
              padding: 8px 16px;
              border-radius: 8px;
            }
          }
        `}
      </style>
    </div>
  )
}
