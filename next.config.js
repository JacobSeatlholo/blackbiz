/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  experimental: {
    missingSuspenseWithCSRBailout: false,
  },

  // Canonical redirect: www is canonical
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'blackbiz.co.za' }],
        destination: 'https://www.blackbiz.co.za/:path*',
        permanent: true,
      },
    ]
  },

  // Security + SEO headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Cache static business profiles for 5 minutes, revalidate in background
        source: '/business/:slug',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=300, stale-while-revalidate=600' },
        ],
      },
      {
        // Cache directory for 1 minute
        source: '/directory',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate=120' },
        ],
      },
      {
        // Cache feed posts for 5 minutes
        source: '/feed/:id',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=300, stale-while-revalidate=600' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
