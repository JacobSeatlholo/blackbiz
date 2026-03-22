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

export const metadata: Metadata = {
  title: { default: 'BlackBiz — South Africa\'s Black Business Intelligence Platform', template: '%s | BlackBiz' },
  description: 'Discover, verify, and connect with black-owned businesses across South Africa. The most powerful business intelligence platform for the new economy.',
  keywords: ['black owned businesses', 'South Africa', 'SME', 'B-BBEE', 'business directory'],
  openGraph: {
    title: 'BlackBiz — SA\'s Black Business Intelligence Platform',
    description: 'Discover verified black-owned businesses across South Africa.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
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
