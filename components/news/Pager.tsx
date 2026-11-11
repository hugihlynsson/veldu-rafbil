import { FunctionComponent } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

interface Step {
  href: string
  text: string
}

interface Props {
  label: string
  newer?: Step
  older?: Step
  className?: string
}

const stepLink =
  'block py-2 text-sm font-semibold text-tint no-underline hover:underline'

/** The way to newer news on the left and older on the right, as time reads */
const Pager: FunctionComponent<Props> = ({ label, newer, older, className }) =>
  !newer && !older ? null : (
    <nav
      aria-label={label}
      className={clsx(
        'pt-4 border-t border-line grid gap-1 sm:grid-cols-2',
        className,
      )}
    >
      {newer && (
        <Link href={newer.href} className={stepLink}>
          <span aria-hidden>←</span> {newer.text}
        </Link>
      )}
      {older && (
        <Link
          href={older.href}
          className={clsx(stepLink, 'text-right sm:col-start-2')}
        >
          {older.text} <span aria-hidden>→</span>
        </Link>
      )}
    </nav>
  )

export default Pager
