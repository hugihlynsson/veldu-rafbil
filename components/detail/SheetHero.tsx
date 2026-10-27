'use client'

import { FunctionComponent, useState } from 'react'
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
    <div className="relative">
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
  )
}

export default SheetHero
