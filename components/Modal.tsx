'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

/** How long the leave animation gets before the dialog actually closes */
const LEAVE_MS = 300

type State = 'initializing' | 'visible' | 'leaving'

interface Modal {
  /** True once the enter animation should be running */
  isVisible: boolean
  /** Animates out, then closes and unmounts */
  close: () => void
}

interface Props {
  /** id of the heading inside that names this dialog */
  labelledBy: string
  /** Called once the leave animation has finished and the dialog is closed */
  onDone: () => void
  /** Called as the leave animation starts, for anything that should not wait */
  onLeave?: () => void
  /**
   * Focused after the dialog opens. showModal() puts focus on the first
   * focusable thing, which is the close button in both of ours, so anything
   * that wants focus elsewhere has to ask for it after that, not before.
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>
  /** Layout and backdrop for this particular dialog */
  className?: string
  children: (modal: Modal) => ReactNode
}

/**
 * The shared half of a modal: a real <dialog>, so that Escape, the backdrop and
 * the focus trap are the browser's job rather than ours, wrapped in the enter
 * and leave animation that <dialog> does not do on its own.
 *
 * `data-state` is on the dialog element, so a caller can drive its backdrop
 * from Tailwind (`data-[state=visible]:backdrop:bg-black/30`), and the panel
 * inside gets `isVisible` to animate with.
 */
const Modal: React.FunctionComponent<Props> = ({
  labelledBy,
  onDone,
  onLeave,
  initialFocusRef,
  className,
  children,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [state, setState] = useState<State>('initializing')

  useEffect(() => {
    dialogRef.current?.showModal()
    initialFocusRef?.current?.focus()
    // A frame with the enter styles still applied is what gives the transition
    // something to move from
    const timer = setTimeout(() => setState('visible'), 1)
    return () => clearTimeout(timer)
    // Opening happens once, on mount. A ref is not reactive, so the dependency
    // the rule asks for here would mean nothing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = () => {
    setState('leaving')
    onLeave?.()
    setTimeout(() => {
      // Closing before unmount is what hands focus back to whatever opened us
      dialogRef.current?.close()
      onDone()
    }, LEAVE_MS)
  }

  return (
    // oxlint and jsx-a11y do not know <dialog>: the click is backdrop dismissal
    // and Escape is handled natively through onCancel below
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      data-state={state}
      aria-labelledby={labelledBy}
      className={clsx(
        'hidden open:flex fixed inset-0 m-0 h-full w-full max-h-none max-w-none border-0 bg-transparent p-0 justify-center',
        'backdrop:bg-black/0 backdrop:transition-[background-color] backdrop:delay-100 data-[state=visible]:backdrop:delay-0',
        className,
      )}
      onCancel={(event) => {
        // Escape: animate out rather than letting the browser close instantly
        event.preventDefault()
        close()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      {children({ isVisible: state === 'visible', close })}
    </dialog>
  )
}

export default Modal
