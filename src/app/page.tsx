import type { Metadata } from 'next'
import Link from 'next/link'
import { Search, TrendingUp, Shield, Star, ArrowRight, Building2, Users, Zap, CheckCircle, MapPin } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HustleFeedPreview from '@/components/feed/HustleFeedPreview'
import { CATEGORIES, CATEGORY_ICONS } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'BlackBiz — Find Black-Owned Businesses in South Africa',
  description: 'BlackBiz is THE place to find verified Black-owned businesses in South Africa. Search 21+ CIPC-verified companies across all 9 provinces. Free to list. Powered by Business Hustle.',
  alternates: { canonical: 'https://www.blackbiz.co.za' },
}

const FEATURES = [
  { icon: Search,     title: 'Powerful Search',    description: 'Find black-owned businesses by name, industry, province, service or keyword. Semantic search that understands context.',  color: 'gold' },
  { icon: Shield,     title: 'Verified Profiles',  description: 'CIPC registration checks, B-BBEE certificates and document vaults. Know exactly who you\'re dealing with.',              color: 'green' },
  { icon: TrendingUp, title: 'Live Performance',   description: 'Track business health scores, financial bands and growth metrics. Real intelligence — not just listings.',              color: 'blue' },
  { icon: Star,       title: 'Trusted Reviews',    description: 'Verified client reviews from real transactions. Earn your reputation. Build credibility that wins contracts.',           color: 'purple' },
]

const WHY_BLACKBIZ = [
  'CIPC-verified business profiles',
  'B-BBEE level ratings on every listing',
  'Live performance and growth data',
  'Hustle Feed for tenders and opportunities',
  'Search across all 9 provinces',
  'Free to list your business',
]

// Province quick links — local SEO
const PROVINCES = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
  'Limpopo', 'Mpumalanga', 'Free State', 'North West', 'Northern Cape',
]

export default async function HomePage() {
  const supabase = createClient()

  const { count: bizCount } = await supabase
    .from('businesses').select('*', { count: 'exact', head: true }).eq('is_active', true)
  const { count: verifiedCount } = await supabase
    .from('businesses').select('*', { count: 'exact', head: true }).eq('verification_status', 'verified')

  const STATS = [
    { label: 'Registered Businesses', value: `${bizCount ?? 0}+` },
    { label: 'Provinces Covered',     value: '9' },
    { label: 'Industry Categories',   value: '15' },
    { label: 'Verified Businesses',   value: `${verifiedCount ?? 0}+` },
  ]

  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-20 overflow-hidden" aria-label="Hero">
        <div className="absolute inset-0 bg-noise opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(201,149,42,0.08) 0%, transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-medium mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            South Africa&apos;s Black Business Intelligence Platform
          </div>

          {/* H1 — primary keyword in first 3 words */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6 animate-fade-up">
            Find Black-Owned<br />
            Businesses in{' '}
            <span className="gold-gradient">South Africa</span>
          </h1>

          {/* Subheading — secondary keywords */}
          <p className="text-lg text-ink-300 max-w-2xl mx-auto mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            BlackBiz is <strong className="text-white">THE</strong> verified directory for Black-owned SMEs in South Africa.
            CIPC verified. B-BBEE rated. Free to list.
          </p>
          <p className="text-sm text-ink-500 max-w-xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            Search across all 9 provinces and 15 industries — from Technology and Construction to Healthcare and Agriculture.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/directory" className="btn-primary text-base px-8 py-3 animate-pulse-gold">
              <Search size={18} /> Search Businesses
            </Link>
            <Link href="/auth/register" className="btn-secondary text-base px-8 py-3">
              List Your Business Free <ArrowRight size={18} />
            </Link>
          </div>

          {/* Search bar — keyword in placeholder */}
          <div className="max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <form action="/directory" method="GET" className="relative" role="search" aria-label="Search black-owned businesses">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                name="q"
                placeholder="Search black-owned businesses, services, or categories..."
                className="input pl-11 pr-32 py-4 text-base rounded-xl border-ink-500 focus:border-gold-500"
                aria-label="Search black-owned businesses in South Africa"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-sm rounded-lg">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-ink-700 bg-ink-800/50" aria-label="Platform statistics">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl font-bold text-gold-400">{s.value}</div>
                <div className="text-sm text-ink-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY BLACKBIZ — keyword-rich trust section ── */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6" aria-label="Why choose BlackBiz">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {/* H2 with target keyword */}
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              The #1 place to find Black-owned businesses in South Africa
            </h2>
            <p className="text-ink-400 text-sm leading-relaxed mb-6">
              Whether you&apos;re a procurement officer looking for BBBEE-verified suppliers,
              a consumer who wants to support Black business, or an entrepreneur who wants to
              be found — BlackBiz is built for you. Verified. Intelligent. Free.
            </p>
            <ul className="space-y-3">
              {WHY_BLACKBIZ.map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-ink-300">
                  <CheckCircle size={15} className="text-gold-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/directory" className="btn-primary text-sm px-6 py-3">
                Browse All Businesses →
              </Link>
            </div>
          </div>
          <div className="card p-6 border-gold-500/20">
            <div className="text-xs text-ink-500 font-mono mb-4 uppercase tracking-wider">// What makes us different</div>
            {[
              ['Basic directory', 'Full business intelligence'],
              ['Unverified listings', 'CIPC + B-BBEE verified'],
              ['Static profiles', 'Live performance data'],
              ['No community', 'Hustle Feed for tenders & wins'],
              ['Paid to list', '100% free to start'],
            ].map(([old, neww]) => (
              <div key={old} className="flex items-center gap-3 py-2.5 border-b border-ink-700 last:border-0 text-sm">
                <span className="text-ink-600 line-through flex-1">{old}</span>
                <ArrowRight size={12} className="text-gold-400 flex-shrink-0" />
                <span className="text-gold-400 font-medium flex-1 text-right">{neww}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6" aria-label="Browse by industry">
        <div className="text-center mb-12">
          {/* H2 with category + location keyword */}
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Browse Black-Owned Businesses by Industry
          </h2>
          <p className="text-ink-400 text-sm">
            Find verified Black-owned businesses across 15 industries and all 9 provinces in South Africa
          </p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/directory?category=${encodeURIComponent(cat)}`}
              className="card-hover p-4 text-center group cursor-pointer"
              title={`Find Black-owned ${cat} businesses in South Africa`}
            >
              <div className="text-2xl mb-2">{CATEGORY_ICONS[cat]}</div>
              <div className="text-xs text-ink-300 group-hover:text-white transition-colors leading-tight">{cat}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PROVINCE LINKS — local SEO ── */}
      <section className="pb-16 max-w-6xl mx-auto px-4 sm:px-6" aria-label="Browse by province">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold text-white mb-2">
            Find Black-Owned Businesses Near You
          </h2>
          <p className="text-ink-400 text-sm">Search by province across all of South Africa</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {PROVINCES.map(prov => (
            <Link
              key={prov}
              href={`/directory?province=${encodeURIComponent(prov)}`}
              className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-gold-400 bg-ink-800 hover:bg-ink-700 border border-ink-700 hover:border-gold-500/30 px-4 py-2 rounded-full transition-all"
              title={`Black-owned businesses in ${prov}`}
            >
              <MapPin size={12} /> {prov}
            </Link>
          ))}
        </div>
      </section>

      {/* ── HUSTLE FEED ── */}
      <section className="py-20 bg-ink-800/30" aria-label="Hustle Feed — tenders and opportunities">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <HustleFeedPreview />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20" aria-label="Platform features">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              More than a Black business directory
            </h2>
            <p className="text-ink-400 max-w-xl mx-auto text-sm">
              BlackBiz is a full business intelligence platform. The data moat that levels the playing field for Black-owned SMEs in South Africa.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon
              const colorMap: Record<string, string> = {
                gold:   'bg-gold-500/10 text-gold-400 border-gold-500/20',
                green:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                blue:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
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

      {/* ── FAQ — captures "People Also Ask" on Google ── */}
      <section className="py-20 bg-ink-800/30" aria-label="Frequently asked questions">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Where can I find verified Black-owned businesses in South Africa?',
                a: 'BlackBiz (blackbiz.co.za) is South Africa\'s leading verified Black-owned business directory. All businesses are cross-checked against CIPC records and B-BBEE certificates. Search by province, industry and size to find exactly what you need.',
              },
              {
                q: 'How do I find Black-owned suppliers for procurement?',
                a: 'Use BlackBiz to search for BBBEE-verified Black-owned suppliers across all 9 provinces and 15 industries. Filter by BBBEE level, province and industry to find procurement-ready suppliers quickly.',
              },
              {
                q: 'Is it free to list a Black-owned business on BlackBiz?',
                a: 'Yes — listing your business on BlackBiz is completely free. Free profiles appear in search results and can collect reviews. Paid plans from R299/month unlock CIPC verification badges, priority ranking and live performance tracking.',
              },
              {
                q: 'How does BlackBiz verify Black-owned businesses?',
                a: 'We cross-reference CIPC registration numbers, B-BBEE certificates and business documents submitted by owners. Verified businesses receive a ✓ Verified badge and rank higher in search results.',
              },
              {
                q: 'What makes BlackBiz different from other business directories?',
                a: 'BlackBiz is the only South African directory with live performance data, intelligence scores, verified CIPC and B-BBEE information, and the Hustle Feed — a community platform for sharing tenders, milestones and opportunities.',
              },
            ].map((faq, i) => (
              <details key={i} className="card p-5 group">
                <summary className="font-display text-base font-semibold text-white cursor-pointer flex items-center justify-between gap-4 list-none">
                  {faq.q}
                  <span className="text-gold-400 flex-shrink-0 group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <p className="text-ink-400 text-sm leading-relaxed mt-4 pt-4 border-t border-ink-700">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6" aria-label="Call to action">
        <div className="relative rounded-2xl overflow-hidden border border-gold-500/20 bg-ink-800 p-12 text-center">
          <div className="absolute inset-0 bg-noise" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(201,149,42,0.12) 0%, transparent 70%)' }} />
          <div className="relative">
            <Building2 size={40} className="text-gold-400 mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Ready to be found by procurement officers,<br />investors and customers?
            </h2>
            <p className="text-ink-400 max-w-lg mx-auto mb-8 text-sm leading-relaxed">
              Join 21+ verified Black-owned businesses already on BlackBiz.
              Free to list. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/register" className="btn-primary text-base px-10 py-3">
                <Zap size={18} /> List Your Business Free
              </Link>
              <Link href="/directory" className="btn-secondary text-base px-10 py-3">
                <Users size={18} /> Browse Directory
              </Link>
            </div>
            <p className="text-ink-600 text-xs mt-6">
              🔒 POPIA compliant · Secured by Supabase · Built in South Africa by{' '}
              <a href="https://businesshustle.co.za" className="text-gold-500 hover:underline" target="_blank" rel="noopener noreferrer">
                Business Hustle
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
