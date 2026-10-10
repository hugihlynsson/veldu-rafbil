'use client'

import { FunctionComponent } from 'react'
import Orflaedi from './Orflaedi'
import TextLink from './TextLink'

const paragraph =
  'mx-auto max-w-column text-sm leading-6 px-(--gutter) text-stone md:max-w-page md:px-10'

const Footer: FunctionComponent<{}> = () => (
  <>
    <Orflaedi />
    <footer className="bg-haze pt-8 pb-34 xs:pt-14">
      <p className={paragraph}>
        Veldu Rafbíl er smíðuð af{' '}
        <TextLink href="https://hugihlynsson.com">Huga Hlynssyni</TextLink> og
        er geymd á{' '}
        <TextLink href="https://github.com/hugihlynsson/veldu-rafbil">
          GitHub
        </TextLink>
        .{' '}
      </p>

      <p className={paragraph}>
        Ef þú ert með ábendingu eða fyrirspurn geturu sent póst á{' '}
        <TextLink href="mailto:hugi@hey.com">hugi@hey.com</TextLink>.
      </p>
    </footer>
  </>
)

export default Footer
