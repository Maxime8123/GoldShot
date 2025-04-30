/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // !! WARN !!
    // Temporarily ignoring TypeScript errors for preview deployment
    // This should be removed for production
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'cryptologos.cc',
      'www.moonpay.com',
      'ramp.network',
      'i.imgur.com'
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
