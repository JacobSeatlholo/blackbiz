import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/auth/callback',
          '/auth/reset-password',
        ],
      },
      {
        // Allow Google to crawl everything public
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
    ],
    sitemap: 'https://www.blackbiz.co.za/sitemap.xml',
    host: 'https://www.blackbiz.co.za',
  }
}
