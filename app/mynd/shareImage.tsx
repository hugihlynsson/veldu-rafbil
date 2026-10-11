import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

import type { Car } from '@/modules/data/cars'
import { shareImageSize as size } from '@/modules/detail/paths'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { formatKmPerMinute } from '@/modules/data/getKmPerMinutesCharged'
import { specRows } from '@/modules/detail/specs'
import Logo from '@/components/Logo'

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

const stone = '#555'

const Stat = ({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div
      style={{
        fontSize: 17,
        fontWeight: 600,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: stone,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 40, marginTop: 4 }}>{value}</div>
    <div style={{ fontSize: 22, color: stone, marginTop: 2 }}>{detail}</div>
  </div>
)

/**
 * The picture a link to a car's page unfurls into: the car as its card on the
 * list shows it on a wide screen, so the preview reads as the site, drawn
 * larger for the size a chat shows it at
 */
export const shareImage = async (car: Car) => {
  const src = await photo(car.heroImageName)
  const subTitle = [
    car.subModel,
    car.expectedDelivery && `Væntanlegur ${car.expectedDelivery.toLowerCase()}`,
  ]
    .filter(Boolean)
    .join(' · ')
  const priceBadge = specRows([car]).find(({ key }) => key === 'price')
    ?.cells[0].detail

  return new ImageResponse(
    <div style={{ ...frame, alignItems: 'center', padding: margin, gap: 48 }}>
      {/* An image drawn to a PNG, which next/image has no part in */}
      {/* oxlint-disable-next-line nextjs/no-img-element */}
      <img
        alt=""
        src={src}
        width={510}
        height={340}
        style={{ borderRadius: 16, objectFit: 'cover' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', marginBottom: 36 }}>
          <Logo width={190} />
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: 14,
            fontSize: 52,
            lineHeight: 1.1,
          }}
        >
          <span style={{ fontWeight: 600 }}>{car.make}</span>
          <span>{car.model}</span>
        </div>
        {subTitle && (
          <div style={{ fontSize: 28, color: stone, marginTop: 6 }}>
            {subTitle}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            alignItems: 'center',
            gap: 12,
            marginTop: 24,
            padding: '8px 10px 8px 22px',
            borderRadius: 999,
            background: '#eee',
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          {`${addDecimalSeparators(car.priceWithGrant)} kr.`}
          {priceBadge && (
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 999,
                background: '#fff',
                color: stone,
                fontSize: 15,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              {priceBadge}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 36, marginTop: 36 }}>
          <Stat
            label="0-100 km/klst"
            value={`${car.acceleration.toFixed(1)}s`}
            detail={`${car.power} kW`}
          />
          <Stat
            label="Rafhlaða"
            value={`${car.capacity} kWh`}
            detail={`${formatKmPerMinute(car.kmPerMinuteCharged)} km/min`}
          />
          <Stat label="Drægni" value={`${car.range} km`} detail={car.drive} />
        </div>
      </div>
    </div>,
    await options(),
  )
}
