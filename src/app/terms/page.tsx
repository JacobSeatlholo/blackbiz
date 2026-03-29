import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service — BlackBiz',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-ink-500 text-sm mb-10">Last updated: March 2026</p>
          {[
            { title: '1. Acceptance of Terms', body: 'By accessing or using BlackBiz ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform. BlackBiz is operated by Business Hustle (Simple Eternity Holdings Pty Ltd), Cape Town, South Africa.' },
            { title: '2. Use of the Platform', body: 'You may use BlackBiz to list and discover Black-owned businesses in South Africa. You agree not to misrepresent your business, submit fraudulent verification documents, spam or harass other users, scrape or copy platform data without permission, or use the platform for any unlawful purpose.' },
            { title: '3. Business Listings', body: 'By listing your business, you confirm that all information provided is accurate and up to date. You grant BlackBiz a non-exclusive licence to display your business information on the platform. We reserve the right to remove listings that violate our policies.' },
            { title: '4. Verification', body: 'Verification badges are awarded based on document review and third-party checks (CIPC, SARS). Verification does not constitute an endorsement of the business. We reserve the right to revoke verification if documents are found to be fraudulent.' },
            { title: '5. Subscriptions & Payments', body: 'Paid plans are billed monthly. You may cancel at any time. Refunds are not provided for partial months. Prices are in South African Rand (ZAR) and inclusive of VAT where applicable.' },
            { title: '6. Limitation of Liability', body: 'BlackBiz is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform, including losses from relying on business information displayed.' },
            { title: '7. Changes to Terms', body: 'We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of significant changes via email.' },
            { title: '8. Contact', body: 'For legal enquiries, contact team@businesshustle.co.za.' },
          ].map(s => (
            <div key={s.title} className="mb-8">
              <h2 className="font-display text-lg font-semibold text-white mb-3">{s.title}</h2>
              <p className="text-ink-400 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
