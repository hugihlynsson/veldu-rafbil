import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'

import type { Car } from '@/modules/data/cars'
import {
  comparisonPath,
  pagePath,
  shareImagePath,
  shareImageSize,
} from '@/modules/detail/paths'
import { comparisonTitle } from '@/modules/detail/comparison'
import { MAX_COMPARED } from '@/modules/detail/comparison'
import { resolveSlugs } from '@/modules/detail/slugs'
import { carSlug } from '@/modules/data/getCarId'
import ComparisonView from '@/components/detail/ComparisonView'
import Verdict, { VerdictPlaceholder } from '@/components/detail/Verdict'
import Footer from '@/components/Footer'
import PageChat from '@/components/detail/PageChat'
import { peekVerdict } from '@/app/api/verdict/[...slugs]/verdict'

interface Props {
  params: Promise<{ bilar: string[] }>
}

const read = async ({ params }: Props) =>
  resolveSlugs((await params).bilar.map(decodeURIComponent), MAX_COMPARED)

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
    endpoint={`/api/verdict/${cars.map(carSlug).join('/')}`}
  />
)

export default async function Page(props: Props) {
  const segments = (await props.params).bilar
  const { cars, slugs, goneCount } = await read(props)

  if (cars.length === 0) notFound()
  // One car is a car's own page
  if (segments.length === 1 && goneCount === 0) {
    permanentRedirect(pagePath(slugs))
  }
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
      <PageChat cars={cars} />
    </>
  )
}
