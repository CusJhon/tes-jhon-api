/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['raw.githubusercontent.com', 'files.catbox.moe'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  swcMinify: true,
  telemetry: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        'skia-canvas': false,
      }
    }
    return config
  },
}

module.exports = nextConfig