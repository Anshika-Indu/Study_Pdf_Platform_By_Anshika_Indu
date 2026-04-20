/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
  webpack: (config) => {
    // Required for pdfjs-dist
    config.resolve.alias.canvas = false
    return config
  },
}

module.exports = nextConfig
