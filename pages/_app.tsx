import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AppProps } from 'next/app'
import * as Fathom from 'fathom-client'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    Fathom.load('DDOQKVOW', { includedDomains: ['veldurafbil.is'] })

    let onRouteChangeComplete = () => Fathom.trackPageview()

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => router.events.off('routeChangeComplete', onRouteChangeComplete)
  }, [])

  return <Component {...pageProps} />
}

export default App
