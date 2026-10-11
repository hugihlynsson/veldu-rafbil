import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

import type { Car } from '@/modules/data/cars'
import { carName } from '@/modules/data/getCarId'
import { shareImageSize as size } from '@/modules/detail/paths'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { specRows, type SpecKey } from '@/modules/detail/specs'
import { carSubtitle, deprecatedNotice } from '@/modules/detail/subtitle'
import Logo from '@/components/Logo'

// Static cuts of the site's Inter at the two weights drawn here: the image
// renderer reads neither WOFF2 nor a variable font
const font = (name: string) =>
  readFile(path.join(process.cwd(), `app/fonts/Inter${name}-og.woff`))
const fonts = Promise.all([font('Regular'), font('SemiBold')])

// The photos are read from disk, which next.config.ts traces into this
// function, as public/ is otherwise served by the CDN and not bundled
const photo = async (name: string) =>
  `data:image/jpeg;base64,${(
    await readFile(path.join(process.cwd(), `public/images/${name}.jpg`))
  ).toString('base64')}`

const gap = 32
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
  gapBefore = 0,
}: {
  label: string
  value: string
  detail: string
  gapBefore?: number
}) => (
  <div
    style={{ display: 'flex', flexDirection: 'column', marginLeft: gapBefore }}
  >
    <div
      style={{
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: stone,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 34, marginTop: 4 }}>{value}</div>
    <div style={{ fontSize: 19, color: stone, marginTop: 2 }}>{detail}</div>
  </div>
)

/**
 * The picture a link to a car's page unfurls into: the car as its card on the
 * list shows it on a wide screen, so the preview reads as the site, drawn
 * larger for the size a chat shows it at
 */
const carImage = async (car: Car) => {
  const src = await photo(car.heroImageName)
  const subTitle = carSubtitle(car)
  const notice = deprecatedNotice(car)
  const figures = new Map(
    specRows([car]).map(({ key, cells: [cell] }) => [key, cell]),
  )
  const text = (key: SpecKey) => figures.get(key)?.text ?? ''
  const priceBadge = figures.get('price')?.detail

  return new ImageResponse(
    <div
      style={{
        ...frame,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: margin,
      }}
    >
      <div style={{ display: 'flex', marginBottom: 32 }}>
        <Logo width={250} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
        {/* An image drawn to a PNG, which next/image has no part in */}
        {/* oxlint-disable-next-line nextjs/no-img-element */}
        <img
          alt=""
          src={src}
          width={540}
          height={360}
          style={{ borderRadius: 16, objectFit: 'cover' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: 12,
              fontSize: 44,
              lineHeight: 1.1,
            }}
          >
            <span style={{ fontWeight: 600 }}>{car.make}</span>
            <span>{car.model}</span>
          </div>
          {subTitle && (
            <div style={{ fontSize: 24, color: stone, marginTop: 6 }}>
              {subTitle}
            </div>
          )}
          {notice && (
            <div style={{ fontSize: 22, fontWeight: 600, marginTop: 14 }}>
              {notice}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              gap: 12,
              marginTop: 22,
              padding: '6px 8px 6px 16px',
              borderRadius: 999,
              background: '#eee',
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {`${addDecimalSeparators(car.priceWithGrant)} kr.`}
            {priceBadge && (
              <span
                style={{
                  padding: '3px 9px',
                  borderRadius: 999,
                  background: '#fff',
                  color: stone,
                  fontSize: 12,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                {priceBadge}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 32 }}>
            <Stat
              label="0-100 km/klst"
              value={text('acceleration')}
              detail={text('power')}
            />
            <Stat
              label="Rafhlaða"
              value={text('capacity')}
              detail={text('charging')}
            />
            {/* The first column is as wide as its label, and the battery's as
                its value, so the range needs more room to look as apart */}
            <Stat
              label="Drægni"
              value={text('range')}
              detail={car.drive}
              gapBefore={16}
            />
          </div>
        </div>
      </div>
    </div>,
    await options(),
  )
}

/** The picture a shared comparison link unfurls into: the cars side by side */
const comparisonImage = async (cars: ReadonlyArray<Car>) => {
  const photos = await Promise.all(cars.map((car) => photo(car.heroImageName)))
  const width =
    (size.width - margin * 2 - gap * Math.max(cars.length - 1, 0)) /
    Math.max(cars.length, 1)
  const crowded = cars.length > 2
  // Cropped to fill the frame: two at their own 3:2 crowd the heading, and
  // four leave half the picture empty
  const height = crowded ? 260 : 310

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: `48px ${margin}px`,
        background: '#fff',
        color: '#111',
        fontFamily: 'Inter',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 28,
        }}
      >
        <Logo width={190} />
        <span style={{ color: stone }}>Samanburður</span>
      </div>

      <div style={{ display: 'flex', gap }}>
        {cars.map((car, index) => (
          <div
            key={car.id}
            style={{ display: 'flex', flexDirection: 'column', width }}
          >
            {/* An image drawn to a PNG, which next/image has no part in */}
            {/* oxlint-disable-next-line nextjs/no-img-element */}
            <img
              alt=""
              src={photos[index]}
              width={width}
              height={height}
              style={{ borderRadius: 16, objectFit: 'cover' }}
            />
            {/* The name as the cards set it, the make in bold */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: crowded ? 9 : 12,
                marginTop: 20,
                fontSize: crowded ? 32 : 44,
                lineHeight: 1.1,
              }}
            >
              <span style={{ fontWeight: 600 }}>{car.make}</span>
              <span>{carName(car, cars).replace(`${car.make} `, '')}</span>
            </div>
            <div style={{ marginTop: 10, fontSize: crowded ? 24 : 30 }}>
              {`${addDecimalSeparators(car.priceWithGrant)} kr.`}
            </div>
          </div>
        ))}
      </div>
    </div>,
    await options(),
  )
}

/** The picture the page about these cars unfurls into */
export const shareImage = (cars: ReadonlyArray<Car>) => {
  const [only] = cars
  return only && cars.length === 1 ? carImage(only) : comparisonImage(cars)
}
