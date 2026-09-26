import type { NextConfig } from 'next'

import { filterUrlKeys } from './modules/filters'
import { sortingUrlKeys } from './modules/sorting'

// Every parameter that changes what the list shows, read from the tables nuqs
// reads, so a new filter is rendered per request without being listed here
const listQueryKeys = [
  ...Object.values(sortingUrlKeys),
  ...Object.values(filterUrlKeys),
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  images: {
    deviceSizes: [
      540, // Screen wider than 1024px @1x
      828, // DPR2 phones and tablets, which otherwise round up to 1080
      1080, // Screen wider than 1024px @2x
      1180, // 390pt iPhones (12-14, 16e) and 393pt ones (14 Pro, 15, 16)
      1320, // iPhone 16 Pro Max, and the widest anything here asks for
    ],
    // The two widths either side of MiniCar's 120px box, which is all that
    // reads this list
    imageSizes: [128, 256],
    // No query string, so a photo already cached cannot be asked for again
    // under a fresh URL
    localPatterns: [{ pathname: '/images/**', search: '' }],
    qualities: [75],
    // 31 days: the point Vercel stops counting the cache write
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    return [
      {
        source: '/notadir',
        destination: '/',
        permanent: true,
      },
      // Only ever reached through the rewrite below, which redirects do not
      // see; asked for by name, it is the list at its one address
      {
        source: '/with-query',
        destination: '/',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return {
      // Before the static / is served: one rule per key, as the conditions
      // within a rule must all hold
      beforeFiles: listQueryKeys.map((key) => ({
        source: '/',
        has: [{ type: 'query' as const, key }],
        destination: '/with-query',
      })),
      afterFiles: [],
      fallback: [],
    }
  },
}

export default nextConfig
