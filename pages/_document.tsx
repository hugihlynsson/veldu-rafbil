import Document, { Head, Main, NextScript } from 'next/document'

export default class Evs extends Document {
  render() {
    return (
      <html lang="is">
        <Head>
          <meta
            key="viewport"
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />

          <link rel="icon" href="/images/icon.png" type="image/png" />
          <link rel="preconnect" href="https://www.google-analytics.com" />

          <style>{`
              *,
              *::before,
              *::after {
                box-sizing: border-box;
              }
              body {
                margin: 0;
                font-family: BlinkMacSystemFont, -apple-system, Roboto, Helvetica,
                  Arial, sans-serif;
                color: #111;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
          `}</style>

          <script
            src="https://cdn.usefathom.com/script.js"
            {...({ site: 'DDOQKVOW' } as any)}
            defer
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
