import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CheckCircle, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing — BlackBiz',
  description: 'Free to start. Upgrade when you\'re ready. BlackBiz plans for verified Black-owned businesses.',
}

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'Get listed and found',
    color: 'ink',
    features: [
      'Public business profile',
      'Appear in search results',
      'Collect reviews',
      'Basic profile analytics',
      'Hustle Feed access',
      'Category & province listing',
    ],
    cta: 'Get Started Free',
    href: '/auth/register',
    highlight: false,
  },
  {
    name: 'Verified',
    price: 'R299',
    period: '/month',
    desc: 'Build credibility that wins contracts',
    color: 'gold',
    features: [
      'Everything in Starter',
      'CIPC verification badge',
      'B-BBEE certificate display',
      'Priority search ranking',
      'Profile completeness score',
      'Featured in directory',
      'Verified review badge',
      'WhatsApp enquiry button',
    ],
    cta: 'Upgrade to Verified',
    href: '/auth/register',
    highlight: true,
  },
  {
    name: 'Intelligence',
    price: 'R999',
    period: '/month',
    desc: 'Full business intelligence suite',
    color: 'blue',
    features: [
      'Everything in Verified',
      'Live performance dashboard',
      'Transaction signal tracking',
      'Competitor benchmarking',
      'Procurement alerts',
      'Export data & reports',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Contact Us',
    href: '/contact',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-14">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-ink-400 text-lg max-w-xl mx-auto">
              Start free. Upgrade when you're ready to unlock verification, intelligence and priority visibility.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {PLANS.map(plan => (
              <div key={plan.name} className={`card p-7 flex flex-col relative ${plan.highlight ? 'border-gold-500/40' : ''}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-ink-900 text-xs font-bold px-4 py-1 rounded-full font-display">
                    MOST POPULAR
                  </div>
                )}
                {plan.highlight && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400/30 rounded-t-xl" />}

                <div className="mb-6">
                  <h2 className="font-display text-xl font-bold text-white mb-1">{plan.name}</h2>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`font-display text-3xl font-bold ${plan.highlight ? 'text-gold-400' : 'text-white'}`}>
                      {plan.price}
                    </span>
                    {plan.period && <span className="text-ink-500 text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-ink-500 text-sm">{plan.desc}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink-300">
                      <CheckCircle size={15} className={`flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-gold-400' : 'text-emerald-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className={plan.highlight ? 'btn-primary justify-center py-3' : 'btn-secondary justify-center py-3'}>
                  {plan.highlight && <Zap size={15} />}
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="card p-6 text-center border-ink-700">
            <p className="text-ink-400 text-sm">
              All plans include POPIA compliance and secure data handling. Cancel anytime. Questions?{' '}
              <Link href="/contact" className="text-gold-400 hover:underline">Contact us</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
