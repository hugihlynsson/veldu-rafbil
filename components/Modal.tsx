'use client'

import React, { ReactNode, useLayoutEffect, useRef, useState } from 'react'
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
  /** Focused after open: showModal() lands on the close button otherwise */
  initialFocusRef?: React.RefObject<HTMLElement | null>
  /** Layout and backdrop for this particular dialog */
  className?: string
  children: (modal: Modal) => ReactNode
}

/**
 * A real <dialog>, so that Escape, the backdrop and the focus trap are the
 * browser's job, wrapped in the animation it does not do on its own.
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

  // Layout rather than passive: a phone raises the keyboard only for a focus
  // inside the tap that asked for it, and passive effects run after the event
  useLayoutEffect(() => {
    dialogRef.current?.showModal()
    // preventScroll: the dialog is fixed, and scrolling to it moves the list
    initialFocusRef?.current?.focus({ preventScroll: true })
    // A frame with the enter styles gives the transition something to move from
    const timer = setTimeout(() => setState('visible'), 1)
    return () => clearTimeout(timer)
    // Opening happens once, on mount; a ref is not reactive
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
    // <dialog>: the click is backdrop dismissal, Escape is handled by onCancel
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
