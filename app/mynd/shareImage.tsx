import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import type { CSSProperties, ReactNode } from 'react'

import cars, { type Car } from '@/modules/data/cars'
import { shareImageSize as size } from '@/modules/detail/paths'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { specRows, type SpecKey } from '@/modules/detail/specs'
import { carSubtitle, deprecatedNotice } from '@/modules/detail/subtitle'
import { listHeadline } from '@/modules/copy/listHeadline'
import Logo from '@/components/Logo'
import { showcaseCars } from './showcase'

// Static cuts of the site's Inter at the two weights drawn here: the image
// renderer reads neither WOFF2 nor a variable font
const font = (name: string) =>
  readFile(path.join(process.cwd(), `app/fonts/Inter${name}-og.woff`))
const fonts = Promise.all([font('Regular'), font('SemiBold')])

// Fetched from the CDN, not traced into the function: bundled, they were
// stored with every deploy, once per route, and filled the plan's storage. A
// preview fetches production's, as its own sit behind deployment protection,
// so a car added in a branch has no share image until it is merged.
const photoOrigin = (request: Request) =>
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : new URL(request.url).origin

const photo = async (origin: string, name: string) => {
  const response = await fetch(`${origin}/images/${name}.jpg`)
  if (!response.ok) throw new Error(`No photo at ${response.url}`)
  return `data:image/jpeg;base64,${Buffer.from(
    await response.arrayBuffer(),
  ).toString('base64')}`
}

const gap = 32
const margin = 56
// Where a car's own picture, centred, had its logo; a comparison's starts there
// too, so the two read as one
const logoTop = 100

// The car's own picture's type, which two cars side by side have room for
const type = { name: 44, subtitle: 24, notice: 22 }

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

/**
 * The logo at logoTop over what is drawn under it. Content too tall for that,
 * like two names that wrap, shrinks the space above instead of the margin below.
 */
const Page = ({
  children,
  logoWidth = 250,
  toBottom = false,
}: {
  children: ReactNode
  logoWidth?: number
  // Sets what is under the logo on the bottom margin rather than below it
  toBottom?: boolean
}) => (
  <div style={{ ...frame, flexDirection: 'column', padding: margin }}>
    <div style={{ height: logoTop - margin, flexShrink: 1 }} />
    <div style={{ display: 'flex', flexShrink: 0, marginBottom: 32 }}>
      <Logo width={logoWidth} />
    </div>
    {toBottom && <div style={{ flexGrow: 1 }} />}
    <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {children}
    </div>
  </div>
)

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

/** The price as the cards set it, in a pill with what it is after */
const PriceTag = ({
  car,
  badge,
  small = false,
  style,
}: {
  car: Car
  badge?: string
  small?: boolean
  style?: CSSProperties
}) => (
  <div
    style={{
      display: 'flex',
      alignSelf: 'flex-start',
      alignItems: 'center',
      gap: small ? 8 : 12,
      marginTop: small ? 14 : 22,
      padding: badge
        ? small
          ? '5px 6px 5px 12px'
          : '6px 8px 6px 16px'
        : small
          ? '5px 12px'
          : '6px 16px',
      borderRadius: 999,
      background: '#eee',
      fontSize: small ? 17 : 20,
      fontWeight: 600,
      ...style,
    }}
  >
    {`${addDecimalSeparators(car.priceWithGrant)} kr.`}
    {badge && (
      <span
        style={{
          padding: small ? '2px 7px' : '3px 9px',
          borderRadius: 999,
          background: '#fff',
          color: stone,
          fontSize: small ? 11 : 12,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}
      >
        {badge}
      </span>
    )}
  </div>
)

/**
 * The picture a link to a car's page unfurls into: the car as its card on the
 * list shows it on a wide screen, so the preview reads as the site, drawn
 * larger for the size a chat shows it at
 */
const carImage = async (origin: string, car: Car) => {
  const src = await photo(origin, car.heroImageName)
  const subTitle = carSubtitle(car)
  const notice = deprecatedNotice(car)
  const figures = new Map(
    specRows([car]).map(({ key, cells: [cell] }) => [key, cell]),
  )
  const text = (key: SpecKey) => figures.get(key)?.text ?? ''
  const priceBadge = figures.get('price')?.detail

  return new ImageResponse(
    <Page>
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
              fontSize: type.name,
              lineHeight: 1.1,
            }}
          >
            <span style={{ fontWeight: 600 }}>{car.make}</span>
            <span>{car.model}</span>
          </div>
          {subTitle && (
            <div
              style={{ fontSize: type.subtitle, color: stone, marginTop: 6 }}
            >
              {subTitle}
            </div>
          )}
          {notice && (
            <div
              style={{ fontSize: type.notice, fontWeight: 600, marginTop: 14 }}
            >
              {notice}
            </div>
          )}
          <PriceTag car={car} badge={priceBadge} />
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
    </Page>,
    await options(),
  )
}

/**
 * The picture a shared comparison link unfurls into: the cars side by side,
 * each as the car's own picture sets it, under the same logo
 */
const comparisonImage = async (origin: string, cars: ReadonlyArray<Car>) => {
  const photos = await Promise.all(
    cars.map((car) => photo(origin, car.heroImageName)),
  )
  const count = Math.max(cars.length, 1)
  const width = (size.width - margin * 2 - gap * (count - 1)) / count
  const crowded = cars.length > 2
  // At their own 3:2 two would push the prices off the bottom, so they are
  // cropped shorter; three and four fit as they are
  const height = Math.min(240, Math.round((width * 2) / 3))
  const nameSize = { 2: type.name, 3: 30 }[cars.length] ?? 26

  return new ImageResponse(
    <Page>
      <div style={{ display: 'flex', gap }}>
        {cars.map((car, index) => {
          const subTitle = carSubtitle(car)
          const notice = deprecatedNotice(car)
          return (
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0 4px',
                  marginTop: 20,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    columnGap: crowded ? 8 : 12,
                    fontSize: nameSize,
                    lineHeight: 1.1,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{car.make}</span>
                  <span>{car.model}</span>
                </div>
                {(notice ?? subTitle) && (
                  <div
                    style={{
                      fontSize: crowded
                        ? 19
                        : notice
                          ? type.notice
                          : type.subtitle,
                      fontWeight: notice ? 600 : 400,
                      color: notice ? '#111' : stone,
                      marginTop: 6,
                    }}
                  >
                    {notice ?? subTitle}
                  </div>
                )}
                {/* A car no longer sold has no price to go and pay */}
                {!notice && (
                  <PriceTag
                    car={car}
                    small={crowded}
                    // Four leave no room for it beside the price
                    badge={
                      cars.length < 4
                        ? specRows([car]).find(({ key }) => key === 'price')
                            ?.cells[0]?.detail
                        : undefined
                    }
                    // The pill's round end reads as further in than the text
                    // above it, so it sits a little out to line up by eye
                    style={{ marginTop: crowded ? 11 : 18, marginLeft: -2 }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Page>,
    await options(),
  )
}

/**
 * The picture a link to the list unfurls into: what it holds, and a run of
 * photos from the cheapest to the dearest, the last cut by the edge as the
 * list goes on past it
 */
const listImage = async (origin: string) => {
  const shown = showcaseCars()
  const photos = await Promise.all(
    shown.map((car) => photo(origin, car.heroImageName)),
  )
  const cheapest = Math.min(...cars.map((car) => car.priceWithGrant))

  return new ImageResponse(
    <Page logoWidth={480} toBottom>
      <div style={{ fontSize: type.name, lineHeight: 1.1 }}>
        {listHeadline(cars.length)}
      </div>
      <div style={{ fontSize: type.subtitle, color: stone, marginTop: 6 }}>
        {`Frá ${addDecimalSeparators(cheapest)} kr.`}
      </div>
      {/* A photo's hard edge reads as further in than the text above it, so
          the strip sits a little out to line up by eye */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          marginTop: 32,
          position: 'relative',
          left: -4,
          top: 4,
        }}
      >
        {photos.map((src, index) => (
          // An image drawn to a PNG, which next/image has no part in
          // oxlint-disable-next-line nextjs/no-img-element
          <img
            key={shown[index]?.id}
            alt=""
            src={src}
            width={300}
            height={200}
            style={{ flexShrink: 0, borderRadius: 16, objectFit: 'cover' }}
          />
        ))}
      </div>
    </Page>,
    await options(),
  )
}

/** The picture the page about these cars unfurls into */
export const shareImage = (request: Request, cars: ReadonlyArray<Car>) => {
  const origin = photoOrigin(request)
  const [only] = cars
  return only && cars.length === 1
    ? carImage(origin, only)
    : comparisonImage(origin, cars)
}

/** The picture the list unfurls into */
export const listShareImage = (request: Request) =>
  listImage(photoOrigin(request))
