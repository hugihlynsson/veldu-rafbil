import { FunctionComponent } from 'react'

import Logo from './Logo'

const Title: FunctionComponent<{}> = () => (
  <h1 className="mt-10 mb-4 md:mt-15 md:mb-5">
    <Logo className="w-[70%] max-w-[359px]" />
  </h1>
)

export default Title
