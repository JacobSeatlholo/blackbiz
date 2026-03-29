import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'POPIA Compliance — BlackBiz',
}

export default function PopiaPage() {
  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20">
              <Shield size={24} className="text-gold-400" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-white">POPIA Compliance</h1>
              <p className="text-ink-500 text-sm mt-1">Protection of Personal Information Act, 2013</p>
            </div>
          </div>

          <div className="card p-6 border-gold-500/20 mb-8">
            <p className="text-ink-300 leading-relaxed">
              BlackBiz, operated by Business Hustle (Simple Eternity Holdings Pty Ltd), is committed to full compliance with the Protection of Personal Information Act 4 of 2013 (POPIA). This page outlines how we process personal information in accordance with the Act's conditions for lawful processing.
            </p>
          </div>

          {[
            { title: 'Information Officer', body: 'Our designated Information Officer is responsible for ensuring POPIA compliance across the platform. Contact: team@businesshustle.co.za | +27 74 481 5163' },
            { title: 'Lawful Basis for Processing', body: 'We process personal information only where: (a) you have given consent, (b) processing is necessary to fulfil a contract with you, (c) processing is required by law, or (d) processing is in our legitimate interests and does not outweigh your rights.' },
            { title: 'Purpose Specification', body: 'Personal information is collected for specific, explicitly defined purposes: operating the BlackBiz directory, verifying business profiles, providing analytics to business owners, and communicating service-related information. We do not process information for purposes incompatible with these.' },
            { title: 'Your Rights Under POPIA', body: 'You have the right to: request access to your personal information, request correction or deletion of your information, object to processing, lodge a complaint with the Information Regulator of South Africa, and withdraw consent at any time.' },
            { title: 'Data Retention', body: 'We retain personal information only for as long as necessary to fulfil the purpose for which it was collected, or as required by law. Business profile data is retained while your account is active and for 12 months after account closure.' },
            { title: 'Cross-Border Transfers', body: 'Your data may be processed on servers located outside South Africa (including Supabase infrastructure in the EU and US). We ensure adequate protections are in place that meet POPIA requirements for cross-border transfers.' },
            { title: 'Complaints', body: 'If you believe we have violated your rights under POPIA, you may contact us directly at team@businesshustle.co.za or lodge a complaint with the Information Regulator at inforeg.org.za.' },
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
