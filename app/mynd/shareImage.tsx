import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

import type { Car } from '@/modules/data/cars'
import { shareImageSize as size } from '@/modules/detail/paths'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'

// Static cuts of the site's Inter at the two weights drawn here: the image
// renderer reads neither WOFF2 nor a variable font
const fonts = Promise.all(
  (['Regular', 'SemiBold'] as const).map((name) =>
    readFile(path.join(process.cwd(), `app/fonts/Inter${name}-og.woff`)),
  ),
)

// The photos are read from disk, which next.config.ts traces into this
// function, as public/ is otherwise served by the CDN and not bundled
const photo = async (name: string) =>
  `data:image/jpeg;base64,${(
    await readFile(path.join(process.cwd(), `public/images/${name}.jpg`))
  ).toString('base64')}`

const margin = 56

const options = async () => {
  const [regular, semiBold] = await fonts
  return {
    ...size,
    headers: {
      // Drawn from the car data alone, which only a deploy changes; Vercel's
      // CDN keys on the deploy, as with the list in next.config.ts
      'Cache-Control': 'public, max-age=86400',
      'Vercel-CDN-Cache-Control': 'max-age=31536000',
    },
    fonts: [
      {
        name: 'Inter',
        data: regular,
        weight: 400 as const,
        style: 'normal' as const,
      },
      {
        name: 'Inter',
        data: semiBold,
        weight: 600 as const,
        style: 'normal' as const,
      },
    ],
  }
}

const frame = {
  width: '100%',
  height: '100%',
  display: 'flex',
  background: '#fff',
  color: '#111',
  fontFamily: 'Inter',
} as const

/** The picture a link to a car's page unfurls into: its photo and its figures */
export const shareImage = async (car: Car) => {
  const src = await photo(car.heroImageName)
  return new ImageResponse(
    <div style={{ ...frame, alignItems: 'center', padding: margin, gap: 48 }}>
      {/* An image drawn to a PNG, which next/image has no part in */}
      {/* oxlint-disable-next-line nextjs/no-img-element */}
      <img
        alt=""
        src={src}
        width={660}
        height={440}
        style={{ borderRadius: 20, objectFit: 'cover' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: 26, fontWeight: 600, marginBottom: 40 }}>
          Veldu Rafbíl
        </div>
        <div style={{ fontSize: 28, color: '#555', fontWeight: 600 }}>
          {car.make}
        </div>
        <div style={{ fontSize: 52, fontWeight: 600, lineHeight: 1.05 }}>
          {car.model}
        </div>
        {car.subModel && (
          <div style={{ fontSize: 26, color: '#555', marginTop: 6 }}>
            {car.subModel}
          </div>
        )}
        <div style={{ fontSize: 32, marginTop: 28 }}>
          {`${addDecimalSeparators(car.priceWithGrant)} kr.`}
        </div>
        <div style={{ fontSize: 26, color: '#555', marginTop: 8 }}>
          {`${car.range} km drægni`}
        </div>
      </div>
    </div>,
    await options(),
  )
}
