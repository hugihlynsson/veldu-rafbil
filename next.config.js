module.exports = {
  reactStrictMode: true,
  images: {
    deviceSizes: [
      // 360,
      // 375, iPhones (8, x, etc) @1x
      // 414, iPhone plus (8+, 11, 11 Pro Max, etc) @1x
      540, // Screen wider than 1024px @1x
      720, //360@2x common Android Devices
      750, // iPhone 6, 7, 8, X, 6+, 6s+ @2x
      828, // iPhone plus (8+, 11, 11 Pro Max, etc) @2x
      856, // iPhone 12 Pro Max @2x
      1080, // Screen wider than 1024px @2x
      1125, // iPhone 6, 7, 8, X, 6+, 6s+ @3x
      1170, // iPhone 12 @3x
      1242, // iPhone plus (8+, 11, 11 Pro Max, etc) @2x
      1284, // iPhone 12 Pro Max @3x
    ],
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
