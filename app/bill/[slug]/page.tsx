import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'

import { carPath, shareImagePath, shareImageSize } from '@/modules/detail/paths'
import { resolveSlugs } from '@/modules/detail/slugs'
import { similarTo } from '@/modules/detail/similar'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { carSlug } from '@/modules/data/getCarId'
import carReviews from '@/modules/data/carReviews'
import CarView from '@/components/detail/CarView'
import PageTop from '@/components/detail/PageTop'
import PageChat from '@/components/detail/PageChat'
import Footer from '@/components/Footer'

interface Props {
  params: Promise<{ slug: string }>
}

// The slug read as any page reads its slugs, so a renamed car is followed and a
// gone one is known for what it was
const read = async ({ params }: Props) =>
  resolveSlugs([decodeURIComponent((await params).slug)])

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const {
    cars: [car],
    slugs,
  } = await read(props)
  if (!car) return { title: 'Veldu Rafbíl' }

  const title = `${car.label} – Veldu Rafbíl`
  const description = `${car.label}: ${addDecimalSeparators(car.priceWithGrant)} kr.${car.hasGrant ? ' með styrk' : ''}, ${car.range} km drægni, ${car.capacity} kWh rafhlaða. Umsögn og svipaðir bílar.`

  return {
    title,
    description,
    alternates: { canonical: carPath(slugs[0]) },
    openGraph: {
      title,
      description,
      siteName: 'Veldu Rafbíl',
      locale: 'is_IS',
      images: [
        { url: shareImagePath(slugs[0]), ...shareImageSize, alt: car.label },
      ],
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function Page(props: Props) {
  const segment = decodeURIComponent((await props.params).slug)
  const {
    cars: [car],
    slugs,
    goneCount,
  } = await read(props)

  if (goneCount > 0) {
    return (
      <>
        <main className="max-w-page mx-auto px-(--gutter) pb-16 md:px-10">
          <PageTop />
          <h1 className="m-0 text-2xl font-semibold">
            Þessi bíll er ekki lengur seldur nýr
          </h1>
          <p className="mt-3 text-stone">
            <Link
              href="/"
              className="text-tint font-semibold no-underline hover:underline"
            >
              Sjá alla rafbílana sem eru í sölu →
            </Link>
          </p>
        </main>
        <Footer />
      </>
    )
  }
  if (!car) notFound()
  // A renamed car, or a slug in the wrong case: the one address the page has
  if (slugs[0] !== segment) permanentRedirect(carPath(slugs[0]))

  return (
    <>
      <CarView
        car={car}
        similar={similarTo(car)}
        review={carReviews[carSlug(car)]}
      />
      <Footer />
      <PageChat cars={[car]} />
    </>
  )
}
