import './globals.css'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import Fathom from '@/components/Fathom'

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="is">
      <head>
        <link rel="icon" href="/icon.png" sizes="32x32" type="image/png" />
        <link
          rel="icon"
          href="/icon-512.png"
          sizes="512x512"
          type="image/png"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {/* --color-lab in app/globals.css, for the browser chrome around the
            page: a white bar over a dark page is the one seam CSS cannot reach */}
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#ffffff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#000000"
        />
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>
        <Fathom />
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
