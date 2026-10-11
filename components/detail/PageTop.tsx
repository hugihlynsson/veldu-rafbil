import { FunctionComponent, ReactNode } from 'react'

import Logo from '@/components/Logo'
import ListLink from './ListLink'

interface Props {
  /** Beside the logo, at the far side: the page's share button */
  children?: ReactNode
}

/** The wordmark atop a page other than the list, leading back to it as it was left */
const PageTop: FunctionComponent<Props> = ({ children }) => (
  <div className="flex items-center justify-between gap-4 mb-6 md:mb-8">
    <ListLink className="block text-tint no-underline transition-opacity duration-100 hover:opacity-70">
      <Logo className="block w-36 h-auto md:w-44" />
    </ListLink>
    {children}
  </div>
)

export default PageTop
