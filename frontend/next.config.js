// next.config.js
const path = require('path')
const webpack = require('webpack')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  // 📣 Add the exact origins you use in dev (include protocol + port):
  allowedDevOrigins: [
    'http://localhost:5173',
    'http://162.19.137.112:5173'
  ],

  webpack(config) {
    // Ensure globalThis for webpack runtime
    config.output.globalObject = 'globalThis'

    // Polyfill `process` for browser bundles (needed by Axios, Next internals, etc.)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      process: require.resolve('process/browser')
    }
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser'
      })
    )

    // Your existing module aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      components: path.resolve(__dirname, 'src/components'),
      api:        path.resolve(__dirname, 'src/api'),
      utils:      path.resolve(__dirname, 'src/utils'),
      hooks:      path.resolve(__dirname, 'src/hooks'),
      forms:      path.resolve(__dirname, 'src/components/Forms'),
      styles:     path.resolve(__dirname, 'src/styles'),
    }

    return config
  }
}
