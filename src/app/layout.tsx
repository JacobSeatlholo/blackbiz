import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const BASE_URL = 'https://www.blackbiz.co.za'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'BlackBiz — South Africa\'s Black Business Intelligence Platform',
    template: '%s | BlackBiz',
  },

  description: 'Discover, verify and connect with Black-owned businesses across South Africa. CIPC verified profiles, B-BBEE ratings, live performance data and the Hustle Feed for tenders and opportunities. Free to list.',

  keywords: [
    'black owned businesses South Africa',
    'black business directory',
    'BBBEE verified suppliers',
    'black owned SME directory',
    'black business intelligence platform',
    'find black owned businesses',
    'black owned companies Gauteng',
    'black owned companies Cape Town',
    'black owned companies South Africa',
    'CIPC verified black businesses',
    'black entrepreneur directory',
    'black business network South Africa',
    'black owned technology companies',
    'black owned construction companies',
    'black owned healthcare companies',
    'procurement black suppliers',
    'blackbiz',
    'black business',
    'SMME directory South Africa',
  ],

  authors: [{ name: 'Business Hustle', url: 'https://businesshustle.co.za' }],
  creator: 'Business Hustle',
  publisher: 'BlackBiz',

  category: 'business',

  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: BASE_URL,
    siteName: 'BlackBiz',
    title: 'BlackBiz — South Africa\'s Black Business Intelligence Platform',
    description: 'The Crunchbase for Black-owned SMEs. Discover, verify and connect with South Africa\'s most powerful business community. CIPC verified. B-BBEE rated. Free to list.',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'BlackBiz — South Africa\'s Black Business Intelligence Platform',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@blackbiz_za',
    creator: '@TeeJaySeatlholo',
    title: 'BlackBiz — South Africa\'s Black Business Intelligence Platform',
    description: 'The Crunchbase for Black-owned SMEs. CIPC verified. B-BBEE rated. Free to list.',
    images: [`${BASE_URL}/og-image.png`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: BASE_URL,
  },

  verification: {
    google: 'add-your-google-search-console-verification-code-here',
  },

  other: {
    'geo.region': 'ZA',
    'geo.country': 'South Africa',
    'language': 'English',
  },
}

// Global JSON-LD — Organization schema
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BlackBiz',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description: 'South Africa\'s Black Business Intelligence Platform. Discover, verify and connect with Black-owned SMEs.',
  foundingDate: '2026',
  founder: {
    '@type': 'Person',
    name: 'Jacob Seatlholo',
    url: 'https://businesshustle.co.za',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Cape Town',
    addressRegion: 'Western Cape',
    addressCountry: 'ZA',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+27-74-481-5163',
    contactType: 'customer support',
    availableLanguage: ['English', 'Zulu', 'Xhosa', 'Sotho'],
  },
  sameAs: [
    'https://twitter.com/blackbiz_za',
    'https://businesshustle.co.za',
  ],
}

// WebSite schema with SearchAction — enables Google Sitelinks search
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BlackBiz',
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/directory?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme */}
        <meta name="theme-color" content="#0a0a08" />
        <meta name="color-scheme" content="dark" />

        {/* Geo targeting */}
        <meta name="geo.region" content="ZA" />
        <meta name="geo.country" content="South Africa" />
        <meta name="ICBM" content="-33.9249, 18.4241" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-body bg-ink-900 text-white antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1E1D19',
              color: '#fff',
              border: '1px solid rgba(201,149,42,0.3)',
              borderRadius: '8px',
              fontFamily: 'var(--font-body)',
            },
            success: { iconTheme: { primary: '#C9952A', secondary: '#1E1D19' } },
          }}
        />
      </body>
    </html>
  )
}
