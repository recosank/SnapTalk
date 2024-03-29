/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ROOT: __dirname,
  },

  webpack(config) {
    config.resolve.modules.push(__dirname);
    return config;
  },
  staticPageGenerationTimeout: "60",

  future: { webpack5: true },
};

module.exports = nextConfig;
