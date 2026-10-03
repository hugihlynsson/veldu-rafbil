import React, { useState } from 'react'
import clsx from 'clsx'

import { arrive, depart, type Presence } from '@/modules/presence'
import useFlip from '@/utils/useFlip'

export interface Pill {
  key: string
  content: React.ReactNode
  ariaLabel?: string
  onClick: () => void
  /** Seconds before it rises in, so a stack can come in from the input up */
  enterDelay?: number
}

interface Props {
  label: string
  pills: Pill[]
}

/**
 * The stack of pills above the chat input. A pill that goes plays its exit
 * where it stood, and the rest slide to their new places rather than jump.
 */
export default function SuggestionPills({ label, pills }: Props) {
  const [rendered, setRendered] = useState<Presence<Pill>[]>([])
  const [shownKeys, setShownKeys] = useState('')
  const track = useFlip()

  // Keyed on the set alone: the pills are new objects every render, and a
  // pill's own text is read from them below rather than from this state
  const keys = pills.map(({ key }) => key).join('\n')
  if (keys !== shownKeys) {
    setShownKeys(keys)
    setRendered((current) => arrive(current, pills))
  }

  const current = new Map(pills.map((pill) => [pill.key, pill]))
  const shown = rendered.map(({ key, item, leaving }) => ({
    pill: (!leaving && current.get(key)) || item,
    leaving,
  }))

  if (!shown.length) return null

  return (
    <fieldset
      aria-label={label}
      className="pointer-events-auto m-0 flex min-w-0 flex-col gap-2 border-0 p-0"
    >
      {shown.map(({ pill, leaving }) => (
        <button
          key={pill.key}
          ref={track(pill.key)}
          type="button"
          aria-label={pill.ariaLabel}
          // Out of reach while it goes, so a tap cannot land on one that has
          inert={leaving}
          className={clsx(
            'bg-raised/70 backdrop-blur-xl border border-scrim/6 rounded-2xl p-[12px_16px] text-sm font-medium text-tint cursor-pointer transition-all duration-200 text-left whitespace-nowrap shadow-(--shadow-chip)',
            'hover:bg-raised/90 hover:text-tint hover:-translate-y-0.5 hover:shadow-(--shadow-chip-hover)',
            'active:translate-y-0',
            leaving
              ? 'pointer-events-none animate-[fadeOutDownRotate_0.2s_ease-in_forwards]'
              : 'animate-[fadeInUpRotate_0.3s_ease-out_backwards]',
          )}
          style={
            leaving ? undefined : { animationDelay: `${pill.enterDelay ?? 0}s` }
          }
          // Keeps the input's blur from firing before the click lands;
          // Safari does not focus buttons on click
          onMouseDown={(event) => event.preventDefault()}
          onClick={pill.onClick}
          onAnimationEnd={(event) => {
            if (event.animationName === 'fadeOutDownRotate') {
              setRendered((current) => depart(current, pill.key))
            }
          }}
        >
          {pill.content}
        </button>
      ))}
    </fieldset>
  )
}
