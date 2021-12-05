import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AppProps } from 'next/app'
import Head from 'next/head'
import * as Fathom from 'fathom-client'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    Fathom.load('DDOQKVOW', { includedDomains: ['veldurafbil.is'] })

    let onRouteChangeComplete = () => Fathom.trackPageview()

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => router.events.off('routeChangeComplete', onRouteChangeComplete)
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width, maximum-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
