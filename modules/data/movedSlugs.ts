// A page's URL names its car by slug, and a link someone shared has to keep
// working after the car is renamed. So a slug no car has any more stays here,
// pointing at the slug that replaced it, for good. A car no longer sold keeps
// its slug: it is marked deprecated rather than taken out.
export const movedSlugs: Readonly<Record<string, string>> = {
  'volvo-ec40-recharge-twin': 'volvo-ec40-twin-motor',
}
