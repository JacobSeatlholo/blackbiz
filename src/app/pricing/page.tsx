'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Zap, Shield, Lock, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const PLANS = [
  {
    name: 'Starter',
    displayPrice: 'Free',
    period: null,
    desc: 'Get listed and found',
    highlight: false,
    planKey: null,
    cta: 'Get Started Free',
    href: '/auth/register',
    features: [
      'Public business profile',
      'Appear in search results',
      'Collect reviews',
      'Basic profile analytics',
      'Hustle Feed access',
      'Category & province listing',
    ],
  },
  {
    name: 'Verified',
    displayPrice: 'R299',
    period: '/month',
    desc: 'Build credibility that wins contracts',
    highlight: true,
    planKey: 'verified',
    cta: 'Upgrade to Verified',
    href: null,
    features: [
      'Everything in Starter',
      'CIPC verification badge',
      'B-BBEE certificate display',
      'Priority search ranking',
      'Featured in directory',
      'Verified review badge',
      'WhatsApp enquiry button',
      'Go Live on Hustle Feed',
      'Real-time notifications',
      'Export Intelligence Hub',
    ],
  },
  {
    name: 'Intelligence',
    displayPrice: 'R999',
    period: '/month',
    desc: 'Full business intelligence suite',
    highlight: false,
    planKey: 'intelligence',
    cta: 'Upgrade to Intelligence',
    href: null,
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
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const paymentStatus = searchParams.get('payment')

  const handleUpgrade = async (planKey: string) => {
    setLoading(planKey)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Sign in first to upgrade')
      setLoading(null)
      window.location.href = '/auth/login'
      return
    }

    const { data: bizData } = await supabase
      .from('businesses')
      .select('id, name')
      .eq('owner_id', user.id)
      .single()

    if (!bizData) {
      toast.error('List your business first before upgrading')
      setLoading(null)
      window.location.href = '/dashboard/new'
      return
    }

    try {
      const res = await fetch('/api/yoco/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planKey,
          user_id: user.id,
          business_id: bizData.id,
          business_name: bizData.name,
        }),
      })

      const data = await res.json()

      if (data.redirectUrl) {
        // Redirect to Yoco hosted payment page
        window.location.href = data.redirectUrl
      } else {
        toast.error(data.error ?? 'Failed to create checkout')
        setLoading(null)
      }
    } catch (err) {
      toast.error('Payment system unavailable. Try again.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Payment status banners */}
          {paymentStatus === 'success' && (
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 mb-8">
              <CheckCircle size={18} />
              <span className="text-sm font-medium">Payment successful! Your plan has been upgraded. Check your dashboard.</span>
            </div>
          )}
          {(paymentStatus === 'cancelled' || paymentStatus === 'failed') && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 mb-8">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">
                {paymentStatus === 'cancelled' ? 'Payment cancelled.' : 'Payment failed.'} Please try again or contact us.
              </span>
            </div>
          )}

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
              <div key={plan.name}
                className={`card p-7 flex flex-col relative ${plan.highlight ? 'border-gold-500/40' : ''}`}>
                {plan.highlight && (
                  <>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-ink-900 text-xs font-bold px-4 py-1 rounded-full font-display">
                      MOST POPULAR
                    </div>
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400/30 rounded-t-xl" />
                  </>
                )}

                <div className="mb-6">
                  <h2 className="font-display text-xl font-bold text-white mb-1">{plan.name}</h2>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`font-display text-3xl font-bold ${plan.highlight ? 'text-gold-400' : 'text-white'}`}>
                      {plan.displayPrice}
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

                {plan.href ? (
                  <Link href={plan.href}
                    className="btn-secondary justify-center py-3">
                    {plan.cta}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.planKey!)}
                    disabled={loading === plan.planKey}
                    className={`${plan.highlight ? 'btn-primary' : 'btn-secondary'} justify-center py-3 gap-2 disabled:opacity-50`}>
                    {loading === plan.planKey
                      ? 'Redirecting to payment…'
                      : <><Zap size={15} /> {plan.cta}</>
                    }
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Trust signals */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Shield, text: 'Secured by Yoco — South Africa\'s leading payment provider' },
              { icon: Lock, text: 'POPIA compliant — your data is protected' },
              { icon: CheckCircle, text: 'Cancel anytime — no lock-in contracts' },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.text} className="card p-4 flex items-center gap-3">
                  <Icon size={16} className="text-gold-400 flex-shrink-0" />
                  <p className="text-xs text-ink-400">{item.text}</p>
                </div>
              )
            })}
          </div>

          <div className="card p-6 text-center border-ink-700">
            <p className="text-ink-400 text-sm">
              Questions about pricing?{' '}
              <Link href="/contact" className="text-gold-400 hover:underline">Contact us</Link>
              {' '}or{' '}
              <a href="https://wa.me/27744815163" target="_blank" rel="noopener noreferrer"
                className="text-gold-400 hover:underline">WhatsApp us</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
