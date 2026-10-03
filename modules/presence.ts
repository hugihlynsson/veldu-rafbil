export interface Presence<T> {
  key: string
  item: T
  /** Gone from the items, and shown only until its exit has played */
  leaving: boolean
}

/**
 * The list as it should render now: every current item in its order, and
 * every one that has gone kept where it stood, leaving, until `depart` is
 * called for it. One that comes back before then is simply current again.
 */
export const arrive = <T extends { key: string }>(
  rendered: ReadonlyArray<Presence<T>>,
  items: ReadonlyArray<T>,
): Presence<T>[] => {
  const keys = new Set(items.map((item) => item.key))
  const next: Presence<T>[] = items.map((item) => ({
    key: item.key,
    item,
    leaving: false,
  }))

  rendered.forEach((entry, index) => {
    if (keys.has(entry.key)) return
    // After the nearest one above it that is still shown, so it leaves from
    // the place it was seen in rather than jumping to an end first
    const anchor = rendered
      .slice(0, index)
      .findLast(({ key }) => next.some((shown) => shown.key === key))
    const at = anchor ? next.findIndex(({ key }) => key === anchor.key) + 1 : 0
    next.splice(at, 0, { ...entry, leaving: true })
  })

  return next
}

/** Drops a leaving entry once its exit has played */
export const depart = <T>(
  rendered: ReadonlyArray<Presence<T>>,
  key: string,
): Presence<T>[] =>
  rendered.filter((entry) => !(entry.leaving && entry.key === key))
