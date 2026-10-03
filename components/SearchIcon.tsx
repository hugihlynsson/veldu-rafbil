/** The magnifier on the search button, and on the filters suggested from text */
const SearchIcon = ({
  size,
  className,
}: {
  size: number
  className?: string
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      fill="currentColor"
      d="m14.298 13.202-3.87-3.87A5.514 5.514 0 0 0 11.55 6C11.55 2.94 9.061.45 6 .45 2.94.45.45 2.94.45 6c0 3.061 2.49 5.55 5.55 5.55a5.514 5.514 0 0 0 3.332-1.122l3.87 3.87a.775.775 0 1 0 1.096-1.096ZM1.55 6A4.455 4.455 0 0 1 6 1.55 4.455 4.455 0 0 1 10.45 6 4.455 4.455 0 0 1 6 10.45 4.455 4.455 0 0 1 1.55 6Z"
    />
  </svg>
)

export default SearchIcon
