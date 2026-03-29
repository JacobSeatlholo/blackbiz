import Link from 'next/link'
import { Search, TrendingUp, Shield, Star, ArrowRight, Building2, Users, Zap } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HustleFeedPreview from '@/components/feed/HustleFeedPreview'
import { CATEGORIES, CATEGORY_ICONS } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

const FEATURES = [
  {
    icon: Search,
    title: 'Powerful Search',
    description: 'Find businesses by name, category, province, service, or keyword. Semantic search that understands context.',
    color: 'gold',
  },
  {
    icon: Shield,
    title: 'Verified Profiles',
    description: 'CIPC registration checks, B-BBEE certificates, and document vaults. Know who you\'re dealing with.',
    color: 'green',
  },
  {
    icon: TrendingUp,
    title: 'Live Performance',
    description: 'Track business health scores, financial bands, and growth metrics. Real data, not just listings.',
    color: 'blue',
  },
  {
    icon: Star,
    title: 'Trusted Reviews',
    description: 'Verified transaction reviews from real clients. Earn your reputation. Build lasting trust.',
    color: 'purple',
  },
]

export default async function HomePage() {
  const supabase = createClient()

  const { count: bizCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: verifiedCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('is_verified', true)

  const STATS = [
    { label: 'Registered Businesses', value: bizCount?.toString() ?? '0', suffix: bizCount ? '+' : ' — Be First' },
    { label: 'Provinces Covered', value: '9', suffix: '' },
    { label: 'Categories', value: '15', suffix: '' },
    { label: 'Verifications', value: verifiedCount?.toString() ?? '0', suffix: verifiedCount ? '+' : ' — Join Now' },
  ]

  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(201,149,42,0.08) 0%, transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-medium mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            South Africa's Black Business Intelligence Platform
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6 animate-fade-up">
            Your business,{' '}
            <span className="gold-gradient">seen.</span>
            <br />
            Your credibility,{' '}
            <span className="gold-gradient">built.</span>
          </h1>

          <p className="text-lg text-ink-300 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            The Crunchbase for Black-owned SMEs. Discover, verify, and connect with
            South Africa's most powerful business community. No gatekeepers.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/directory" className="btn-primary text-base px-8 py-3 animate-pulse-gold">
              <Search size={18} /> Explore Directory
            </Link>
            <Link href="/auth/register" className="btn-secondary text-base px-8 py-3">
              List Your Business <ArrowRight size={18} />
            </Link>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <form action="/directory" method="GET" className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                name="q"
                placeholder="Search businesses, services, or categories..."
                className="input pl-11 pr-32 py-4 text-base rounded-xl border-ink-500 focus:border-gold-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-sm rounded-lg">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-ink-700 bg-ink-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl font-bold text-gold-400">
                  {s.value}<span className="text-sm font-body text-ink-400">{s.suffix}</span>
                </div>
                <div className="text-sm text-ink-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Browse by Industry</h2>
          <p className="text-ink-400">Across all 15 categories and 9 provinces</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/directory?category=${encodeURIComponent(cat)}`}
              className="card-hover p-4 text-center group cursor-pointer"
            >
              <div className="text-2xl mb-2">{CATEGORY_ICONS[cat]}</div>
              <div className="text-xs text-ink-300 group-hover:text-white transition-colors leading-tight">{cat}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hustle Feed Preview */}
      <section className="py-20 bg-ink-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <HustleFeedPreview />
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="section-title mb-3">More than a directory</h2>
            <p className="text-ink-400 max-w-xl mx-auto">
              A full business intelligence platform. The data moat that levels the playing field.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon
              const colorMap: Record<string, string> = {
                gold: 'bg-gold-500/10 text-gold-400 border-gold-500/20',
                green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
              }
              return (
                <div key={f.title} className="card p-6">
                  <div className={`inline-flex p-3 rounded-xl border mb-4 ${colorMap[f.color]}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-ink-400 leading-relaxed">{f.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl overflow-hidden border border-gold-500/20 bg-ink-800 p-12 text-center">
          <div className="absolute inset-0 bg-noise" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(201,149,42,0.12) 0%, transparent 70%)' }} />
          <div className="relative">
            <Building2 size={40} className="text-gold-400 mx-auto mb-4" />
            <h2 className="section-title mb-4">Ready to be found?</h2>
            <p className="text-ink-400 max-w-lg mx-auto mb-8">
              List your business for free. Get verified. Build credibility that wins contracts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/register" className="btn-primary text-base px-10 py-3">
                <Zap size={18} /> Create Free Profile
              </Link>
              <Link href="/directory" className="btn-secondary text-base px-10 py-3">
                <Users size={18} /> Browse Directory
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
