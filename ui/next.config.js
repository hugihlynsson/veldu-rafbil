const withTypescript = require('@zeit/next-typescript')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = () => ({
  target: 'serverless',
  env: {
    API_HOST: process.env.IS_NOW ? '' : 'http://localhost:4000',
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
