// @ts-check

/** @type {import('next').NextConfig} */
module.exports = {
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
    // The photos are rendered at build time, so nothing reaches `/_next/image`
    // and the knobs on the built-in optimiser no longer apply. The widths above
    // still shape the srcset, and `scripts/buildImageVariants.mjs` renders the
    // same list.
    loader: 'custom',
    loaderFile: './modules/heroImageLoader.ts',
  },
  async headers() {
    return [
      {
        // The name carries the source photo's hash, so a changed photo is a
        // changed URL and this can never go stale
        source: '/rendered/:file*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/notadir',
        destination: '/',
        permanent: true,
      },
    ]
  },
}
