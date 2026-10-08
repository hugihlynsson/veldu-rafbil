import './globals.css'
import localFont from 'next/font/local'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import Fathom from '@/components/Fathom'

// rsms's InterVariable 4.1 rather than Google's cut, which drops glyphs the
// list uses, ↗ among them. Served from here, so the first paint waits on no
// other host. Upright only: the italic is another 379 KB, so emphasis in a
// chat answer is the browser slanting this one.
//
// Cut from the release's 352 KB to 53 KB: Latin-1 and Extended-A,
// punctuation, the arrows, € ™ ₂ and the maths signs a chat answer reaches
// for. Anything else falls back to the system font, and fonts/fonts.test.ts
// fails when the source uses it. Only the features that shape text are kept,
// so `tabular-nums` and the like would do nothing. Optical size is kept whole,
// but weight only from 400, as nothing is set lighter; that alone is 18 KB.
// The name table keeps the OFL notice. From the release:
//   pyftsubset InterVariable.woff2 --flavor=woff2 --name-IDs='*' \
//     --layout-features=kern,mark,mkmk,ccmp,locl,calt,case \
//     --unicodes=U+0000-017F,U+2000-206F,U+2082,U+20AC,U+2122,U+2190-2199,U+2212,U+2248,U+2260,U+2264-2265,U+2713 \
//     --output-file=InterVariable-subset.woff2
//   fonttools varLib.instancer InterVariable-subset.woff2 wght=400:900 \
//     -o InterVariable-subset.woff2
const inter = localFont({
  src: './fonts/InterVariable-subset.woff2',
  weight: '400 900',
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
