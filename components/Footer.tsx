'use client'

import { FunctionComponent } from 'react'
import Orflaedi from './Orflaedi'

const Footer: FunctionComponent<{}> = () => (
  <>
    <Orflaedi />
    <footer className="bg-[#f8f8f8] py-8 pb-[100px] xs:pt-14 md:pt-14">
      <p className="mx-auto max-w-[480px] text-sm leading-6 px-4 text-stone xs:px-6 md:max-w-[1024px] md:px-10">
        Veldu Rafbíl er smíðuð af{' '}
        <a
          href="https://hugihlynsson.com"
          className="text-tint font-semibold no-underline hover:underline"
        >
          Huga Hlynssyni
        </a>{' '}
        og er geymd á{' '}
        <a
          href="https://github.com/hugihlynsson/veldu-rafbil"
          className="text-tint font-semibold no-underline hover:underline"
        >
          GitHub
        </a>
        .{' '}
      </p>

      <p className="mx-auto max-w-[480px] text-sm leading-6 px-4 text-stone xs:px-6 md:max-w-[1024px] md:px-10">
        Ef þú ert með ábendingu eða fyrirspurn geturu sent póst á{' '}
        <a
          href="mailto:hugi@hey.com"
          className="text-tint font-semibold no-underline hover:underline"
        >
          hugi@hey.com
        </a>
        .
      </p>
    </footer>
  </>
)

export default Footer
