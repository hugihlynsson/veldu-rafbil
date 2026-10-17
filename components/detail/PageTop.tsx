import { FunctionComponent } from 'react'

import Logo from '@/components/Logo'
import ListLink from './ListLink'

/**
 * The wordmark atop a page other than the list, at the size and place it has
 * there, leading back to the list as it was left
 */
const PageTop: FunctionComponent = () => (
  <ListLink className="block w-[70%] max-w-[359px] mt-10 mb-4 text-tint no-underline transition-opacity duration-100 hover:opacity-70 md:mt-15 md:mb-5">
    <Logo className="block w-full h-auto" />
  </ListLink>
)

export default PageTop
