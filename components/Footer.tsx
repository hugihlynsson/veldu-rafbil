import { FunctionComponent } from 'react'

import { latestNews } from '@/modules/news/feed'
import LatestNews from '@/components/list/LatestNews'
import FooterLogo from './FooterLogo'
import TextLink from './TextLink'

// Rendered on the server only, by each page, so the change log it reads the
// latest update from never reaches the browser
const Footer: FunctionComponent<{}> = () => (
  <footer className="bg-haze pt-8 pb-34 xs:pt-14">
    <div className="mx-auto max-w-column px-(--gutter) md:max-w-page md:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
      <div className="text-sm leading-5.5 text-pretty text-stone">
        <FooterLogo />
        <p className="m-0">
          Veldu Rafbíl er smíðuð af{' '}
          <TextLink href="https://hugihlynsson.com">Huga Hlynssyni</TextLink> og
          er geymd á{' '}
          <TextLink href="https://github.com/hugihlynsson/veldu-rafbil">
            GitHub
          </TextLink>
          .
        </p>
        <p className="m-0">
          Ef þú ert með ábendingu eða fyrirspurn geturu sent póst á{' '}
          <TextLink href="mailto:hugi@hey.com">hugi@hey.com</TextLink>.
        </p>
      </div>

      {latestNews && (
        <LatestNews latest={latestNews} className="mt-8 lg:mt-0" />
      )}
    </div>
  </footer>
)

export default Footer
