import { useState } from 'react'

/** A lazily loaded chunk, fetched ahead of need, and whether it has arrived */
const useChunk = (importChunk: () => Promise<unknown>) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  return {
    isLoaded,
    load: () => {
      void importChunk().then(() => setIsLoaded(true))
    },
  }
}

export default useChunk
