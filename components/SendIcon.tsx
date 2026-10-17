/** The arrow on the chat's send button, and on the pill that asks instead */
const SendIcon = ({
  size,
  className,
}: {
  size: number
  className?: string
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M2 10L18 2L10 18L8.5 11.5L2 10Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SendIcon
