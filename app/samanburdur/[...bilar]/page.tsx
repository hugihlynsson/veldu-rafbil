import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'

import type { Car } from '@/modules/data/cars'
import {
  comparisonPath,
  comparisonTitle,
  resolveComparison,
  shareImagePath,
  shareImageSize,
} from '@/modules/compare/comparison'
import { carSlug } from '@/modules/data/getCarId'
import ComparisonView from '@/components/compare/ComparisonView'
import Verdict, { VerdictPlaceholder } from '@/components/compare/Verdict'
import Footer from '@/components/Footer'
import ComparisonChat from '@/components/compare/ComparisonChat'
import { peekVerdict } from '@/app/api/comparison/[...slugs]/verdict'

interface Props {
  params: Promise<{ bilar: string[] }>
}

const read = async ({ params }: Props) =>
  resolveComparison((await params).bilar.map(decodeURIComponent))

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { cars, slugs } = await read(props)
  const title = `${comparisonTitle(cars)} – Veldu Rafbíl`
  const description = `Verð, drægni, hleðsla og hröðun hlið við hlið: ${cars
    .map((car) => car.label)
    .join(', ')}.`

  return {
    title,
    description,
    alternates: { canonical: comparisonPath(slugs) },
    openGraph: {
      title,
      description,
      siteName: 'Veldu Rafbíl',
      locale: 'is_IS',
      images: [
        {
          url: shareImagePath(slugs),
          ...shareImageSize,
          alt: `${cars.map((car) => car.label).join(', ')}, hlið við hlið`,
        },
      ],
    },
    twitter: { card: 'summary_large_image' },
  }
}

// Its own boundary, so the figures never wait on the cache
const WrittenVerdict = async ({ cars }: { cars: ReadonlyArray<Car> }) => (
  <Verdict
    cars={cars}
    written={await peekVerdict(cars)}
    endpoint={`/api/comparison/${cars.map(carSlug).join('/')}`}
  />
)

export default async function Page(props: Props) {
  const segments = (await props.params).bilar
  const { cars, slugs, goneCount } = await read(props)

  if (cars.length === 0) notFound()
  // A renamed car, a repeat or a stray slug: the one address the page has
  if (slugs.join('/') !== segments.map(decodeURIComponent).join('/')) {
    permanentRedirect(comparisonPath(slugs))
  }

  return (
    <>
      <ComparisonView
        cars={cars}
        slugs={slugs}
        goneCount={goneCount}
        verdict={
          <Suspense fallback={<VerdictPlaceholder />}>
            <WrittenVerdict cars={cars} />
          </Suspense>
        }
      />
      <Footer />
      <ComparisonChat cars={cars} />
    </>
  )
}
