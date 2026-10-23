import type { Car } from '@/modules/data/cars'
import getPriceWithGrant from '@/modules/data/getPriceWithGrant'
import { nextGrant } from '@/modules/data/globals'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import {
  grantAmountText,
  nextGrantAmountText,
  nextGrantCeilingText,
  nextGrantStartText,
} from '@/modules/copy/grantCopy'

export interface GrantChangeNotice {
  title: string
  text: string
}

const deadline = `Til að fá ${grantAmountText} styrk þarf bíllinn að vera nýskráður og umsóknin samþykkt fyrir mánaðamót.`

/** What the grant change on 1 November does to one car's price, if anything */
export const grantChangeNotice = (car: Car): GrantChangeNotice | undefined => {
  // A car the grant does not reach now loses nothing by the change
  if (car.deprecated || getPriceWithGrant(car.price) === car.price) {
    return undefined
  }

  // Priced on the next grant already, so only the reason needs saying
  if (car.expectedDelivery) {
    return {
      title: 'Verðið miðast við nýja styrkinn',
      text: car.hasGrant
        ? `Rafbílastyrkurinn lækkar ${nextGrantStartText}, áður en bíllinn kemur, svo verðið hér er eftir ${nextGrantAmountText} styrk.`
        : `Rafbílastyrkurinn lækkar ${nextGrantStartText}, áður en bíllinn kemur, og bílar sem kosta meira en ${nextGrantCeilingText} fá þá engan styrk, svo verðið hér er án styrks.`,
    }
  }

  const nextPrice = getPriceWithGrant(car.price, nextGrant)
  const nextPriceText = `${addDecimalSeparators(nextPrice)} kr.`

  return nextPrice === car.price
    ? {
        title: `Styrkurinn fellur niður ${nextGrantStartText}`,
        text: `Bílar sem kosta meira en ${nextGrantCeilingText} fá engan styrk ef umsóknin er samþykkt ${nextGrantStartText} eða síðar, og þá kostar þessi ${nextPriceText} ${deadline}`,
      }
    : {
        title: `Styrkurinn lækkar ${nextGrantStartText}`,
        text: `Umsóknir sem eru samþykktar ${nextGrantStartText} eða síðar fá ${nextGrantAmountText}, og þá kostar þessi ${nextPriceText} ${deadline}`,
      }
}
