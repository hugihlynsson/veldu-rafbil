'use client'

import { createContext, FunctionComponent, ReactNode, use } from 'react'
import clsx from 'clsx'

import useSyncedScroll from '@/utils/useSyncedScroll'

const LaneContext = createContext<((lane: HTMLElement | null) => void) | null>(
  null,
)

/** Holds the strips of a comparison that scroll sideways together */
export const ScrollLanes: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <LaneContext value={useSyncedScroll()}>{children}</LaneContext>

/**
 * One strip of the comparison's columns, which scrolls sideways on a phone
 * when `scrolls`, in step with the rest. It snaps to a column only while it is
 * the one being swiped.
 */
export const Lane: FunctionComponent<{
  scrolls: boolean
  className?: string
  children: ReactNode
}> = ({ scrolls, className, children }) => {
  const lane = use(LaneContext)
  return (
    <div
      ref={scrolls ? lane : undefined}
      className={clsx(
        scrolls &&
          'max-md:overflow-x-auto max-md:data-driving:snap-x max-md:data-driving:snap-mandatory max-md:scroll-pl-(--gutter) [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}
