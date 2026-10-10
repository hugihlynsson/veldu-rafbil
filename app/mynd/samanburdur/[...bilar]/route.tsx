import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

import { comparedName, resolveComparison } from '@/modules/compare/comparison'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'

import { shareImageSize as size } from '@/modules/compare/comparison'

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

const gap = 32
const margin = 56

/**
 * The picture a shared comparison link unfurls into. Its own route rather than
 * an opengraph-image beside the page, which a catch-all segment cannot have.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bilar: string[] }> },
) {
  const { cars } = resolveComparison(
    (await params).bilar.map(decodeURIComponent),
  )
  const [regular, semiBold] = await fonts
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
          fontSize: 28,
          fontWeight: 600,
        }}
      >
        <span>Veldu Rafbíl</span>
        <span style={{ color: '#555', fontWeight: 400 }}>Samanburður</span>
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
            <div
              style={{
                marginTop: 20,
                fontSize: crowded ? 22 : 26,
                color: '#555',
                fontWeight: 600,
              }}
            >
              {car.make}
            </div>
            <div
              style={{
                fontSize: crowded ? 34 : 44,
                fontWeight: 600,
                lineHeight: 1.1,
              }}
            >
              {comparedName(car, cars).replace(`${car.make} `, '')}
            </div>
            <div style={{ marginTop: 10, fontSize: crowded ? 24 : 30 }}>
              {`${addDecimalSeparators(car.priceWithGrant)} kr.`}
            </div>
          </div>
        ))}
      </div>
    </div>,
    {
      ...size,
      headers: {
        // Drawn from the car data alone, which only a deploy changes; Vercel's
        // CDN keys on the deploy, as with the list in next.config.ts
        'Cache-Control': 'public, max-age=86400',
        'Vercel-CDN-Cache-Control': 'max-age=31536000',
      },
      fonts: [
        { name: 'Inter', data: regular, weight: 400, style: 'normal' },
        { name: 'Inter', data: semiBold, weight: 600, style: 'normal' },
      ],
    },
  )
}
