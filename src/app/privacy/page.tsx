import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — BlackBiz',
  description: 'BlackBiz Privacy Policy — how we collect, use and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-ink-500 text-sm mb-10">Last updated: March 2026</p>

          {[
            { title: '1. Information We Collect', body: 'We collect information you provide when registering an account or listing a business, including your name, email address, business details, CIPC number, and B-BBEE certificate. We also collect usage data such as pages visited, search queries, and profile views to improve the platform.' },
            { title: '2. How We Use Your Information', body: 'We use your information to operate and improve BlackBiz, verify business profiles, display business listings in the directory, send transactional emails (confirmations, notifications), and provide analytics to business owners about their profile performance.' },
            { title: '3. Data Sharing', body: 'We do not sell your personal information to third parties. Business profile information you choose to make public (name, description, contact details, category) is visible to all users of the platform. Verification documents are stored securely and only accessed by our verification team.' },
            { title: '4. Data Security', body: 'We use Supabase infrastructure with row-level security, encrypted data at rest, and SSL in transit. Authentication is handled via Supabase Auth with industry-standard security practices. We conduct regular security reviews.' },
            { title: '5. Your Rights (POPIA)', body: 'Under the Protection of Personal Information Act (POPIA), you have the right to access your personal information, request correction of inaccurate data, request deletion of your account and associated data, and object to processing of your information. To exercise these rights, contact us at team@businesshustle.co.za.' },
            { title: '6. Cookies', body: 'We use essential cookies for authentication and session management. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, but this may affect platform functionality.' },
            { title: '7. Contact', body: 'For privacy-related enquiries, contact us at team@businesshustle.co.za or via WhatsApp at +27 74 481 5163.' },
          ].map(section => (
            <div key={section.title} className="mb-8">
              <h2 className="font-display text-lg font-semibold text-white mb-3">{section.title}</h2>
              <p className="text-ink-400 text-sm leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
