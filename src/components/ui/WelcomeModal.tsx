'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { X, Building2, Zap, Search, Star } from 'lucide-react'

export default function WelcomeModal() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    if (searchParams.get('welcome') === '1') {
      setShow(true)
      // Get user name
      const supabase = createClient()
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'there'
          setUserName(name)
        }
      })
      // Clean URL without reload
      window.history.replaceState({}, '', '/')
    }
  }, [searchParams])

  if (!show) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setShow(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-md bg-ink-800 border border-gold-500/20 rounded-2xl overflow-hidden shadow-2xl pointer-events-auto animate-fade-up">

          {/* Gold top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-gold-500 to-gold-400/30" />

          <div className="p-8">
            {/* Close */}
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 text-ink-500 hover:text-ink-300 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-4">
                <Building2 size={28} className="text-gold-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                Welcome to BlackBiz{userName ? `, ${userName.split(' ')[0]}` : ''}! 🎉
              </h2>
              <p className="text-ink-400 text-sm leading-relaxed">
                You're now part of South Africa's most powerful Black business community. Here's what you can do next.
              </p>
            </div>

            {/* Next steps */}
            <div className="space-y-3 mb-8">
              {[
                {
                  icon: Building2,
                  color: 'gold',
                  title: 'List your business',
                  desc: 'Create a verified profile that attracts clients and contracts',
                  href: '/dashboard/new',
                },
                {
                  icon: Search,
                  color: 'blue',
                  title: 'Explore the directory',
                  desc: 'Find and connect with 20+ verified Black-owned businesses',
                  href: '/directory',
                },
                {
                  icon: Zap,
                  color: 'green',
                  title: 'Post to Hustle Feed',
                  desc: 'Share updates, tenders, milestones and opportunities',
                  href: '/feed',
                },
                {
                  icon: Star,
                  color: 'purple',
                  title: 'Leave a review',
                  desc: 'Build trust in the community by reviewing businesses you know',
                  href: '/directory',
                },
              ].map((item) => {
                const Icon = item.icon
                const colorMap: Record<string, string> = {
                  gold:   'bg-gold-500/10 border-gold-500/20 text-gold-400',
                  blue:   'bg-blue-500/10 border-blue-500/20 text-blue-400',
                  green:  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                  purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
                }
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setShow(false)}
                    className="flex items-center gap-4 p-3 rounded-xl border border-ink-700 hover:border-gold-500/30 hover:bg-ink-700/50 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 ${colorMap[item.color]}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-xs text-ink-500 mt-0.5">{item.desc}</div>
                    </div>
                    <span className="text-ink-600 group-hover:text-gold-400 transition-colors text-sm">→</span>
                  </Link>
                )
              })}
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <Link href="/dashboard/new" onClick={() => setShow(false)} className="btn-primary flex-1 justify-center text-sm py-3">
                <Building2 size={15} /> List My Business
              </Link>
              <button onClick={() => setShow(false)} className="btn-secondary text-sm py-3 px-5">
                Explore first
              </button>
            </div>

            <p className="text-center text-xs text-ink-600 mt-4">
              Built by <span className="text-gold-500">Business Hustle</span> · Empowering Black business
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
