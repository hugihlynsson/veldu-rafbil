import type { Car } from '@/modules/data/cars'

/** The photo at the top, which CarSheet also preloads for the cars either side */
export const heroImageProps = (car: Car, sheet?: boolean) => ({
  alt: '',
  sizes: sheet
    ? '(max-width: 1143px) calc(100vw - 184px), 960px'
    : '(max-width: 767px) 100vw, (max-width: 1023px) calc(100vw - 80px), 944px',
  src: `/images/${car.heroImageName}.jpg`,
  width: 1920,
  height: 1280,
})
