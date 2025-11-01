import './globals.css'
import Fathom from '../components/Fathom'

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
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

        <script
          src="https://cdn.usefathom.com/script.js"
          {...({ site: 'DDOQKVOW' } as any)}
          defer
        />
      </head>
      <body>
        <Fathom />
        {children}
      </body>
    </html>
  )
}
