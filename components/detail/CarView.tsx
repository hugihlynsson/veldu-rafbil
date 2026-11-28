import type { FunctionComponent } from 'react'
import clsx from 'clsx'
import Image from 'next/image'

import type { SheetStep } from '@/modules/detail/sheetStep'
import { pageColumn } from '@/components/pageColumn'
import CarDetails, { type CarDetailsProps } from './CarDetails'
import PageTop from './PageTop'
import { heroImageProps } from './heroImage'
import SheetDetails from './SheetDetails'
import SheetHero from './SheetHero'

interface Props extends CarDetailsProps {
  /** Over the list on a desktop, which is the page and has the logo */
  sheet?: boolean
  /** Which way a sheet stepped to the car, none for one opened or linked to */
  step?: SheetStep | null
}

/** One car's own page: its photo and figures, a review, and the cars like it */
const CarView: FunctionComponent<Props> = ({
  car,
  similar,
  review,
  history,
  sheet,
  step,
}) => {
  // In a sheet the list is the page behind, with its own landmark and logo
  const Root = sheet ? 'article' : 'main'

  return (
    <Root
      // In a sheet, the end scrolls clear of the chat bar raised over it
      className={clsx('max-w-page mx-auto', sheet ? 'pb-24' : 'pb-14 md:pb-24')}
    >
      {!sheet && (
        // The list's gap from the logo to its intro, which pads its top
        <header className={clsx(pageColumn, 'pt-4 pb-6 xs:pt-6')}>
          <PageTop />
        </header>
      )}

      {/* Edge to edge on a phone, and from md as wide as the column, as the
          list has its photos. A sheet is only ever md up, and its photo runs
          to its edges: the window less 184px, the margins and the step
          buttons, up to the sheet's 960px, which CarSheet sets */}
      <div className={clsx(!sheet && 'md:px-10')}>
        {sheet ? (
          <SheetHero car={car} />
        ) : (
          <Image
            {...heroImageProps(car)}
            preload
            className="w-full h-auto block md:rounded-lg"
          />
        )}
      </div>

      {sheet ? (
        <SheetDetails
          car={car}
          similar={similar}
          review={review}
          history={history}
          step={step}
        />
      ) : (
        <CarDetails
          car={car}
          similar={similar}
          review={review}
          history={history}
        />
      )}
    </Root>
  )
}

export default CarView
