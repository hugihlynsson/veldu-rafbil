const withTypescript = require('@zeit/next-typescript')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = () => ({
  target: 'serverless',
  env: {
    LOCAL_BASE_URL: process.env.IS_NOW ? '' : 'http://localhost:4000',
  },
  ...withTypescript({
    webpack(config, options) {
      // Do not run type checking twice:
      if (options.isServer) {
        config.plugins.push(new ForkTsCheckerWebpackPlugin())
      }

      return config
    },
  }),
})
