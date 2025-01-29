import Fathom from '../components/Fathom'
import StyledJsxRegistry from './Registry'

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
        <style>{`
*,
*::before,
*::after {
    box-sizing: border-box;
}
html {
    min-height: 100vh;
}
body {
    margin: 0;
    color: #111;
    width: 100%;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
button, input {
    font-family: Inter, sans-serif;
}
:root {
    font-family: Inter, sans-serif;
    font-feature-settings: 'liga' 1, 'calt' 1; /* fix for Chrome */
}
@supports (font-variation-settings: normal) {
    :root { font-family: InterVariable, sans-serif; }
}
          `}</style>
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
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  )
}
