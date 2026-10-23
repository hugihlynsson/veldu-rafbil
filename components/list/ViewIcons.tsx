// Each draws the layout it switches to: a photo beside its text, row after
// row, or the photos in a grid

export const ListIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="1" y="2" width="6" height="5" rx="1.25" />
    <rect x="9" y="2.75" width="6" height="1.5" rx="0.75" />
    <rect x="9" y="5" width="4" height="1.5" rx="0.75" />
    <rect x="1" y="9" width="6" height="5" rx="1.25" />
    <rect x="9" y="9.75" width="6" height="1.5" rx="0.75" />
    <rect x="9" y="12" width="4" height="1.5" rx="0.75" />
  </svg>
)

export const GridIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="1.5" y="1.5" width="5.75" height="5.75" rx="1.25" />
    <rect x="8.75" y="1.5" width="5.75" height="5.75" rx="1.25" />
    <rect x="1.5" y="8.75" width="5.75" height="5.75" rx="1.25" />
    <rect x="8.75" y="8.75" width="5.75" height="5.75" rx="1.25" />
  </svg>
)
