// @ts-check

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  reactCompiler: true,
  images: {
    deviceSizes: [
      540, // Screen wider than 1024px @1x
      1080, // Screen wider than 1024px @2x
      1170, // iPhone 12-14, 12 Pro, 13 Pro, 16e
      1320, // iPhone 16 Pro Max
      1920, // Full size
    ],
    minimumCacheTTL: 2592000,
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
