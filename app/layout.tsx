import './globals.css'
import localFont from 'next/font/local'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import Fathom from '@/components/Fathom'

// rsms's InterVariable 4.1 rather than Google's cut, which drops glyphs the
// list uses, ↗ among them. Served from here, so the first paint waits on no
// other host.
const inter = localFont({
  src: [
    { path: './fonts/InterVariable.woff2', style: 'normal' },
    { path: './fonts/InterVariable-Italic.woff2', style: 'italic' },
  ],
  weight: '100 900',
  variable: '--font-inter',
})

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="is" className={inter.variable}>
      <head>
        <link rel="icon" href="/icon.png" sizes="32x32" type="image/png" />
        <link
          rel="icon"
          href="/icon-512.png"
          sizes="512x512"
          type="image/png"
        />
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
      </head>
      <body>
        <Fathom />
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
