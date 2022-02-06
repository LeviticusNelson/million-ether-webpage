module.exports = {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.experiments = {
      asyncWebAssembly: true,
    }
    return config;
  },
  
}
