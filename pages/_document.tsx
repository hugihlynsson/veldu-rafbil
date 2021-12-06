import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class Evs extends Document {
  render() {
    return (
      <Html lang="is">
        <Head>
          <link rel="icon" href="/images/icon.png" type="image/png" />
          <link rel="preconnect" href="https://www.google-analytics.com" />

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
                font-family: BlinkMacSystemFont, -apple-system, Roboto, Helvetica,
                  Arial, sans-serif;
                color: #111;
                width: 100%;
                min-height: 100vh;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              button, input {
                font-family: BlinkMacSystemFont, -apple-system, Roboto, Helvetica,
                  Arial, sans-serif;
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
      </Html>
    )
  }
}
