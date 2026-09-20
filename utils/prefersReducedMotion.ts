// The reduced-motion rules in globals.css cannot reach scrollIntoView
const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default prefersReducedMotion
