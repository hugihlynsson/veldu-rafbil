// The reduced-motion rules in globals.css cannot reach scrollIntoView, which
// asks for its behaviour in JavaScript
const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default prefersReducedMotion
