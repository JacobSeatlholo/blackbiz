import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
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

// ── THE positioning statement Google will index ───────────────────────────────
// "BlackBiz is THE place to find black-owned businesses in South Africa"
// — verified, intelligent, community-powered. Not just a directory.

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'BlackBiz — Find Black-Owned Businesses in South Africa',
    template: '%s | BlackBiz — SA\'s Black Business Directory',
  },

  description: 'BlackBiz is THE place to find verified Black-owned businesses in South Africa. Search 21+ CIPC-verified companies across all 9 provinces and 15 industries. Free to list. Powered by Business Hustle.',

  keywords: [
    // Primary — highest intent, what people type into Google
    'find black owned businesses South Africa',
    'black owned business directory South Africa',
    'black business directory South Africa',
    'black owned companies South Africa',
    'black owned businesses near me South Africa',

    // BBBEE / procurement intent
    'BBBEE verified suppliers South Africa',
    'BBBEE level 1 suppliers directory',
    'black owned suppliers procurement South Africa',
    'verified black businesses CIPC',
    'black supplier database South Africa',

    // Location-specific (high local SEO value)
    'black owned businesses Gauteng',
    'black owned businesses Cape Town',
    'black owned businesses Johannesburg',
    'black owned businesses Durban',
    'black owned businesses Pretoria',
    'black owned businesses KwaZulu-Natal',
    'black owned businesses Western Cape',

    // Category-specific (long tail gold)
    'black owned technology companies South Africa',
    'black owned construction companies South Africa',
    'black owned healthcare companies South Africa',
    'black owned law firms South Africa',
    'black owned financial services South Africa',
    'black owned IT companies South Africa',
    'black owned catering companies South Africa',
    'black owned engineering companies South Africa',

    // Brand / platform
    'blackbiz',
    'blackbiz.co.za',
    'black business intelligence platform',
    'black SME directory South Africa',
    'support black businesses South Africa',
    'buy black South Africa',
  ],

  authors: [{ name: 'Business Hustle', url: 'https://businesshustle.co.za' }],
  creator: 'Business Hustle',
  publisher: 'BlackBiz',
  category: 'business directory',

  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: BASE_URL,
    siteName: 'BlackBiz',
    title: 'BlackBiz — THE Place to Find Black-Owned Businesses in South Africa',
    description: 'Search 21+ verified Black-owned businesses across all 9 provinces. CIPC verified. B-BBEE rated. Live performance data. Tenders & opportunities on the Hustle Feed. Free to list.',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'BlackBiz — Find Black-Owned Businesses in South Africa',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@blackbiz_za',
    creator: '@TeeJaySeatlholo',
    title: 'BlackBiz — THE Place to Find Black-Owned Businesses in SA',
    description: 'Verified Black-owned business directory. CIPC checked. B-BBEE rated. Tenders & opportunities. Free to list. blackbiz.co.za',
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
    google: 'add-your-google-search-console-code-here',
  },

  other: {
    'geo.region': 'ZA',
    'geo.country': 'South Africa',
    'language': 'English',
  },
}

// ── JSON-LD: Organization ─────────────────────────────────────────────────────
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BlackBiz',
  alternateName: 'BlackBiz South Africa',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description: 'BlackBiz is the leading verified Black-owned business intelligence platform in South Africa. Find CIPC-verified companies, check B-BBEE ratings, discover tenders and connect with the Black business community.',
  foundingDate: '2026',
  founder: {
    '@type': 'Person',
    name: 'Jacob Seatlholo',
    jobTitle: 'Founder',
    worksFor: { '@type': 'Organization', name: 'Business Hustle' },
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Cape Town',
    addressRegion: 'Western Cape',
    addressCountry: 'ZA',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+27-74-481-5163',
      contactType: 'customer support',
      availableLanguage: ['English', 'Zulu', 'Xhosa', 'Sotho', 'Afrikaans'],
      areaServed: 'ZA',
    },
  ],
  sameAs: [
    'https://twitter.com/blackbiz_za',
    'https://businesshustle.co.za',
    'https://www.linkedin.com/company/blackbiz-za',
  ],
  // Keywords Google uses to understand what this org is about
  knowsAbout: [
    'Black-owned businesses South Africa',
    'BBBEE verification',
    'CIPC registration',
    'Black SME directory',
    'Business intelligence',
    'Procurement transformation',
    'Black entrepreneurship',
  ],
}

// ── JSON-LD: WebSite with SearchAction ───────────────────────────────────────
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BlackBiz',
  alternateName: 'BlackBiz — Find Black-Owned Businesses in South Africa',
  url: BASE_URL,
  description: 'THE place to find verified Black-owned businesses in South Africa.',
  inLanguage: 'en-ZA',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/directory?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

// ── JSON-LD: FAQ — captures "People Also Ask" boxes on Google ────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where can I find verified Black-owned businesses in South Africa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BlackBiz (blackbiz.co.za) is South Africa\'s leading verified Black-owned business directory. All businesses are cross-checked against CIPC, B-BBEE certificates and CSD records. You can search by province, industry, size and more.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I find Black-owned suppliers for procurement in South Africa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use BlackBiz to search for BBBEE-verified Black-owned suppliers across all 9 provinces and 15 industries. Filter by BBBEE level, province and industry to find procurement-ready suppliers.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I list my Black-owned business online in South Africa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'List your Black-owned business for free on BlackBiz at blackbiz.co.za. Create a profile, get CIPC verified, and start appearing in search results for buyers and procurement officers across South Africa.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is BlackBiz?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BlackBiz is South Africa\'s Black Business Intelligence Platform — a verified directory of Black-owned SMEs with live performance data, B-BBEE ratings, CIPC verification, and the Hustle Feed for tenders, milestones and opportunities. Built by Business Hustle.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it free to list a business on BlackBiz?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Listing your business on BlackBiz is completely free. Paid plans (from R299/month) unlock CIPC verification badges, priority search ranking and live performance tracking.',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a08" />
        <meta name="color-scheme" content="dark" />
        <meta name="geo.region" content="ZA" />
        <meta name="geo.country" content="South Africa" />
        <meta name="geo.placename" content="South Africa" />
        <meta name="ICBM" content="-30.5595, 22.9375" />

        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
