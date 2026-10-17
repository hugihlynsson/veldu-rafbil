import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'

import { carPath, shareImagePath, shareImageSize } from '@/modules/detail/paths'
import { readSegment, resolveSlugs } from '@/modules/detail/slugs'
import { similarTo } from '@/modules/detail/similar'
import { deprecatedNotice } from '@/modules/detail/subtitle'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { allCars } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import carReviews from '@/modules/data/carReviews'
import CarView from '@/components/detail/CarView'
import PageChat from '@/components/detail/PageChat'
import Footer from '@/components/Footer'

interface Props {
  params: Promise<{ slug: string }>
}

// The slug read as any page reads its slugs, so a renamed car is followed
const read = async ({ params }: Props) =>
  resolveSlugs([readSegment((await params).slug)])

// Built ahead from the car data, which only a deploy changes, those no longer
// sold included; a renamed car's old slug is rendered on demand to redirect
export const generateStaticParams = () =>
  allCars.map((car) => ({ slug: carSlug(car) }))

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const {
    cars: [car],
    slugs,
  } = await read(props)
  if (!car) return { title: 'Veldu Rafbíl' }

  const title = `${car.label} – Veldu Rafbíl`
  const notice = deprecatedNotice(car)
  const description = notice
    ? `${car.label}: ${notice}. ${car.range} km drægni, ${car.capacity} kWh rafhlaða. Svipaðir bílar sem eru í sölu.`
    : `${car.label}: ${addDecimalSeparators(car.priceWithGrant)} kr.${car.hasGrant ? ' með styrk' : ''}, ${car.range} km drægni, ${car.capacity} kWh rafhlaða. Umsögn og svipaðir bílar.`

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
  const segment = readSegment((await props.params).slug)
  const {
    cars: [car],
    slugs,
  } = await read(props)

  if (!car) notFound()
  // A renamed car, or a slug in the wrong case: the one address the page has
  if (slugs[0] !== segment) permanentRedirect(carPath(slugs[0]))

  return (
    <>
      <CarView
        car={car}
        similar={similarTo(car)}
        // Buying advice, which a car no longer sold new is past
        review={car.deprecated ? undefined : carReviews[carSlug(car)]}
      />
      <Footer />
      <PageChat cars={[car]} />
    </>
  )
}
