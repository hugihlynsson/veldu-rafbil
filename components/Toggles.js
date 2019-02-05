export default ({ items, onClick, currentValue }) => (
  <div className="toggles">
    {items.map(([label, value]) => (
      <div
        key={value}
        className="toggle"
        style={value === currentValue ? { backgroundColor: "#EEE" } : undefined}
        onClick={() => onClick(value)}
      >
        {label}
      </div>
    ))}

    <style jsx>
      {`
        .toggles {
          display: flex;
          flex-wrap: wrap;
          border: 1px solid #eee;
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
);
