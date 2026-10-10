'use client'

import { FunctionComponent, useState } from 'react'
import clsx from 'clsx'
import { trackEvent } from 'fathom-client'

interface Props {
  title: string
  /** A secondary pill, for where it is not the page's main action */
  quiet?: boolean
  className?: string
}

/**
 * The phone's own share sheet where there is one, so the link goes straight
 * into a chat; elsewhere the link is copied
 */
const ShareButton: FunctionComponent<Props> = ({ title, quiet, className }) => {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    trackEvent('Comparison shared')
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // Closing the sheet rejects too, and is no failure
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Afritaðu hlekkinn', url)
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 text-sm font-semibold rounded-full border-0 cursor-pointer transition duration-100 active:scale-[0.98]',
        quiet
          ? 'py-1.5 px-3.5 bg-cloud text-tint hover:bg-smoke'
          : 'py-3 px-5 bg-sky text-on-sky hover:bg-sky-hover',
        className,
      )}
    >
      <svg
        aria-hidden
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 10V2M5 5l3-3 3 3M3 8v5h10V8" />
      </svg>
      <span aria-live="polite">
        {copied ? 'Hlekkur afritaður' : 'Deila samanburði'}
      </span>
    </button>
  )
}

export default ShareButton
