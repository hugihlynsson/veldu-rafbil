// A page's URL names its car by slug, and a link someone shared has to keep
// working after the car is renamed. So a slug no car has any more stays here,
// pointing at the slug that replaced it, for good. A car no longer sold keeps
// its slug: it is marked deprecated rather than taken out.
export const movedSlugs: Readonly<Record<string, string>> = {
  'volvo-ec40-recharge-twin': 'volvo-ec40-twin-motor',
  'volvo-ec40-p8-performance': 'volvo-ec40-p8-awd',
  'volvo-ex40-p8-performance': 'volvo-ex40-p8-awd',
  'byd-evo-base': 'byd-atto-3-evo-base',
  'leapmotor-b03x-promax': 'leapmotor-b03x-design',
  'leapmotor-b03x-pro': 'leapmotor-b03x-life',
  'leapmotor-b05-promax': 'leapmotor-b05-design',
  'leapmotor-b10-67-1-kwh': 'leapmotor-b10-design',
  'leapmotor-c10-promax-awd': 'leapmotor-c10-design-awd',
  'mercedes-benz-amg-gt-4-door-coupe-53-4matic':
    'mercedes-benz-amg-gt-53-4matic',
  'mercedes-benz-amg-gt-4-door-coupe-55-4matic':
    'mercedes-benz-amg-gt-55-4matic',
  'mercedes-benz-amg-gt-4-door-coupe-63-4matic':
    'mercedes-benz-amg-gt-63-4matic',
}
