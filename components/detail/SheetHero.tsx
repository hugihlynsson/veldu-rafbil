'use client'

import type { FunctionComponent } from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import Image from 'next/image'

import type { Car } from '@/modules/data/cars'
import { heroImageProps } from './heroImage'

interface Props {
  car: Car
}

/**
 * The sheet's photo, which fades into the next car's as the sheet steps. The
 * last one stays the same element underneath until the new one is in: a new
 * <img> paints blank until it has decoded, even from the cache.
 */
const SheetHero: FunctionComponent<Props> = ({ car }) => {
  const [layers, setLayers] = useState<ReadonlyArray<Car>>([car])
  const [loaded, setLoaded] = useState<Car | null>(null)

  const top = layers.at(-1) ?? car
  if (top.id !== car.id) {
    // Back to one still underneath, which has long since loaded
    setLayers(layers.some((layer) => layer.id === car.id) ? [car] : [top, car])
  }

  return (
    <div className="relative isolate">
      {/* Grown from its bottom edge, which stays on the text under it, as
          Safari bounces. Over the reflection, and a layer of its own, as no
          browser paints what is above a box's top unless it is one. */}
      <div
        data-overscroll-stretch
        className="relative z-1 origin-bottom will-change-[scale]"
      >
        {layers.map((layer) => {
          const isTop = layer.id === car.id
          const fading = isTop && layers.length > 1
          return (
            <Image
              key={layer.id}
              {...heroImageProps(layer, true)}
              preload
              className={clsx(
                'w-full h-auto block',
                // Positioned either way, so the new one stays over the old as its
                // fade ends: an opacity of 1 would drop it under the absolute one
                isTop ? 'relative' : 'absolute top-0 left-0',
                fading && (loaded === layer ? 'animate-hero-in' : 'opacity-0'),
              )}
              onLoad={isTop ? () => setLoaded(layer) : undefined}
              onAnimationEnd={fading ? () => setLayers([layer]) : undefined}
            />
          )
        })}
      </div>
      {/* Above the sheet's top, where only a bounce shows it: the photo
          reflected, from sharp at its edge to blurred and gone, for Chrome,
          which says nothing of how far it bounced. In the content, so the
          reflection's edge stays on the photo's as it moves. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-full h-40 overflow-hidden will-change-transform"
      >
        {/* Wider than the sheet, so the blur's own faded edges fall outside it */}
        <div className="absolute inset-0 scale-x-110 blur-lg [mask-image:linear-gradient(to_top,black,transparent)]">
          <Reflection car={car} />
        </div>
        <div className="absolute inset-0 [mask-image:linear-gradient(to_top,black,transparent_50%)]">
          <Reflection car={car} />
        </div>
      </div>
    </div>
  )
}

// Eager: it is outside the sheet's view, where a lazy one would never load
const Reflection: FunctionComponent<Props> = ({ car }) => (
  <Image
    {...heroImageProps(car, true)}
    loading="eager"
    className="absolute bottom-0 left-0 w-full h-auto -scale-y-100"
  />
)

export default SheetHero
