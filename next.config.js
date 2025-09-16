/** @type {import('next').NextConfig} */
const { ProvidePlugin } = require("webpack");

const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      buffer: require.resolve("buffer/"),
      process: require.resolve("process/browser"),
    };
    
    config.plugins.push(
      new ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
        process: ["process"],
      })
    );
    
    // Handle WebAssembly modules
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    return config;
  },
}

module.exports = nextConfig
