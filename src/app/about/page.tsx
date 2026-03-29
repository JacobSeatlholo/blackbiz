import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Building2, Users, Shield, TrendingUp, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About — BlackBiz',
  description: 'BlackBiz is built by Business Hustle to power Black-owned SMEs across South Africa.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              Built by Business Hustle
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              We built the platform<br />
              <span className="gold-gradient">Black business deserves</span>
            </h1>
            <p className="text-ink-300 text-lg leading-relaxed max-w-2xl mx-auto">
              BlackBiz is South Africa's first business intelligence platform built exclusively for Black-owned SMEs.
              Discover. Verify. Connect. No gatekeepers.
            </p>
          </div>

          {/* Mission */}
          <div className="card p-8 mb-8 border-gold-500/20">
            <h2 className="font-display text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-ink-300 leading-relaxed mb-4">
              South Africa has over 2.5 million Black-owned SMEs contributing billions to the economy — yet they remain largely invisible to procurement officers, investors, and consumers who want to support them.
            </p>
            <p className="text-ink-300 leading-relaxed">
              BlackBiz closes that gap. We provide verified business profiles, live performance intelligence, and a community feed that puts Black business where it belongs: front and centre.
            </p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              { icon: Shield, color: 'gold', title: 'Verified First', desc: 'Every business is cross-checked against CIPC, SARS and B-BBEE records. Trust is built on proof, not promises.' },
              { icon: TrendingUp, color: 'green', title: 'Intelligence, Not Just Listings', desc: 'We track real performance data — financial bands, growth metrics, client reviews — so you can make informed decisions.' },
              { icon: Users, color: 'blue', title: 'Community Powered', desc: 'The Hustle Feed gives Black businesses a voice. Share tenders, milestones and opportunities with a community that\'s rooting for you.' },
              { icon: Heart, color: 'purple', title: 'Built With Purpose', desc: 'BlackBiz is a product of Business Hustle — a Cape Town-based agency committed to building tools that serve the African economy.' },
            ].map(item => {
              const Icon = item.icon
              const colorMap: Record<string, string> = {
                gold: 'bg-gold-500/10 border-gold-500/20 text-gold-400',
                green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
              }
              return (
                <div key={item.title} className="card p-6">
                  <div className={`inline-flex p-3 rounded-xl border mb-4 ${colorMap[item.color]}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-ink-400 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Built by BH */}
          <div className="card p-8 text-center border-gold-500/20">
            <Building2 size={36} className="text-gold-400 mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-white mb-3">Built by Business Hustle</h2>
            <p className="text-ink-400 text-sm leading-relaxed max-w-lg mx-auto mb-6">
              Business Hustle is a Cape Town-based digital agency and startup resource platform building civic tech tools and SME-focused products for South African founders and entrepreneurs.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href="https://businesshustle.co.za" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm px-6">
                Visit Business Hustle
              </a>
              <Link href="/auth/register" className="btn-secondary text-sm px-6">
                List Your Business
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
