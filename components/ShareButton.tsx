'use client'

import { FunctionComponent, useState } from 'react'
import clsx from 'clsx'
import { trackEvent } from 'fathom-client'

import { pageOf } from '@/modules/analytics/visit'
import { track } from '@/utils/track'

interface Props {
  title: string
  /** The page to share, when it is not the one this is on */
  path?: string
  label: string
  /** What analytics counts the share as */
  event: string
  /** A secondary pill, or a round icon on a card, where it is not the page's main action */
  variant?: 'primary' | 'quiet' | 'icon'
  className?: string
}

const ShareIcon = () => (
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
)

/**
 * The phone's own share sheet where there is one, so the link goes straight
 * into a chat; elsewhere the link is copied
 */
const ShareButton: FunctionComponent<Props> = ({
  title,
  path,
  label,
  event,
  variant = 'primary',
  className,
}) => {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = path
      ? new URL(path, window.location.origin).href
      : window.location.href
    trackEvent(event)
    track({
      name: 'shared',
      target: pageOf(new URL(url).pathname).kind,
      method: typeof navigator.share === 'function' ? 'sheet' : 'copy',
    })
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

  const said = copied ? 'Hlekkur afritaður' : label

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={share}
        aria-label={said}
        title={said}
        className={clsx(
          'inline-flex items-center justify-center shrink-0 w-7.5 h-7.5 rounded-full border border-line-chip bg-transparent text-tint cursor-pointer transition duration-100 hover:bg-cloud active:scale-[0.95]',
          className,
        )}
      >
        {copied ? <span aria-hidden>✓</span> : <ShareIcon />}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={share}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 text-sm font-semibold rounded-full border-0 cursor-pointer transition duration-100 active:scale-[0.98]',
        variant === 'quiet'
          ? 'py-1.5 px-3.5 bg-cloud text-tint hover:bg-smoke'
          : 'py-3 px-5 bg-sky text-on-sky hover:bg-sky-hover',
        className,
      )}
    >
      <ShareIcon />
      <span aria-live="polite">{said}</span>
    </button>
  )
}

export default ShareButton
