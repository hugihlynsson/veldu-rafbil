import type { Car } from '@/modules/data/cars'
import type { Drive } from '@/modules/data/newCarSchema'
import { carSlug } from '@/modules/data/getCarId'
import { carPath } from '@/modules/detail/paths'
import { SITE_URL } from '@/modules/siteUrl'

const driveConfigurations: Record<Drive, string> = {
  AWD: 'https://schema.org/AllWheelDriveConfiguration',
  FWD: 'https://schema.org/FrontWheelDriveConfiguration',
  RWD: 'https://schema.org/RearWheelDriveConfiguration',
}

/**
 * The car as schema.org reads it, for search results. The offer is the price
 * after the grant, the one the page shows, since a search engine checks the
 * two agree; a car no longer sold new has none.
 */
export const carStructuredData = (car: Car) => {
  const url = `${SITE_URL}${carPath(carSlug(car))}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: car.label,
    url,
    image: `${SITE_URL}/images/${car.heroImageName}.jpg`,
    brand: { '@type': 'Brand', name: car.make },
    model: car.subModel ? `${car.model} ${car.subModel}` : car.model,
    fuelType: 'Electricity',
    vehicleSeatingCapacity: car.seats,
    driveWheelConfiguration: driveConfigurations[car.drive],
    ...(!car.deprecated && {
      offers: {
        '@type': 'Offer',
        url,
        price: car.priceWithGrant,
        priceCurrency: 'ISK',
        ...(car.expectedDelivery && {
          availability: 'https://schema.org/PreOrder',
        }),
      },
    }),
  }
}

// A car's name in the data can carry anything, and a </script> in it would
// end the tag the page writes this into
export const serializeStructuredData = (data: object): string =>
  JSON.stringify(data).replace(/</g, '\\u003c')
