import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ReviewSection from '@/components/business/ReviewSection'
import CompletenessBar from '@/components/business/CompletenessBar'
import { Shield, Star, Eye, MapPin, Globe, Mail, Phone, Calendar, Users, TrendingUp, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const BASE_URL = 'https://www.blackbiz.co.za'

interface Props {
  params: { slug: string }
}

// ── Dynamic metadata for each business ──────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: biz } = await supabase
    .from('businesses')
    .select('name, tagline, description, category, city, province, bbee_level, rating_average, rating_count, slug, cipc_number, services')
    .eq('slug', params.slug)
    .single()

  if (!biz) return { title: 'Business Not Found' }

  const title = `${biz.name} — ${biz.category} | ${biz.city}, ${biz.province} | BlackBiz`
  const description = biz.tagline
    ? `${biz.tagline}. ${biz.description?.slice(0, 120) ?? ''} Verified Black-owned ${biz.category} business in ${biz.city}, ${biz.province}. B-BBEE Level ${biz.bbee_level ?? '—'}.`
    : `${biz.description?.slice(0, 160) ?? `Verified Black-owned ${biz.category} business`} based in ${biz.city}, ${biz.province}, South Africa.`

  const keywords = [
    biz.name,
    `${biz.category} ${biz.city}`,
    `Black-owned ${biz.category} ${biz.province}`,
    `${biz.name} reviews`,
    `${biz.name} contact`,
    `BBBEE level ${biz.bbee_level} ${biz.category}`,
    `verified ${biz.category} South Africa`,
    ...(biz.services ?? []),
  ]

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `${BASE_URL}/business/${biz.slug}`,
      siteName: 'BlackBiz',
      images: [
        {
          url: `${BASE_URL}/api/og/business/${biz.slug}`,
          width: 1200,
          height: 630,
          alt: `${biz.name} — BlackBiz`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/api/og/business/${biz.slug}`],
    },
    alternates: {
      canonical: `${BASE_URL}/business/${biz.slug}`,
    },
  }
}

// ── Generate static params for top businesses ───────────────────────────────
export async function generateStaticParams() {
  const supabase = createClient()
  const { data } = await supabase
    .from('businesses')
    .select('slug')
    .eq('is_active', true)
    .order('view_count', { ascending: false })
    .limit(100)

  return (data ?? []).map(b => ({ slug: b.slug }))
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function BusinessPage({ params }: Props) {
  const supabase = createClient()

  const { data: biz, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (error || !biz) notFound()

  // Increment view count
  supabase.from('businesses').update({ view_count: (biz.view_count ?? 0) + 1 }).eq('id', biz.id).then(() => {})

  // Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profiles(full_name, avatar_url)')
    .eq('business_id', biz.id)
    .order('created_at', { ascending: false })

  // LocalBusiness JSON-LD — this is what makes Google show rich results
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/business/${biz.slug}`,
    name: biz.name,
    description: biz.description ?? biz.tagline,
    url: biz.website ?? `${BASE_URL}/business/${biz.slug}`,
    telephone: biz.phone,
    email: biz.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: biz.city,
      addressRegion: biz.province,
      addressCountry: 'ZA',
      streetAddress: biz.address,
    },
    geo: { '@type': 'GeoCoordinates' },
    foundingDate: biz.founded_year?.toString(),
    numberOfEmployees: biz.employee_count
      ? { '@type': 'QuantitativeValue', value: biz.employee_count }
      : undefined,
    aggregateRating: biz.rating_count > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: biz.rating_average?.toFixed(1),
          reviewCount: biz.rating_count,
          bestRating: '5',
          worstRating: '1',
        }
      : undefined,
    review: (reviews ?? []).slice(0, 3).map(r => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: '5',
      },
      author: { '@type': 'Person', name: r.profiles?.full_name ?? 'Verified Client' },
      reviewBody: r.body,
      datePublished: r.created_at,
    })),
    hasOfferCatalog: biz.services?.length > 0
      ? {
          '@type': 'OfferCatalog',
          name: 'Services',
          itemListElement: biz.services.map((s: string) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: s },
          })),
        }
      : undefined,
    image: biz.logo_url ?? `${BASE_URL}/og-image.png`,
    sameAs: biz.website ? [biz.website] : [],
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'B-BBEE Level', value: biz.bbee_level },
      { '@type': 'PropertyValue', name: 'CIPC Number', value: biz.cipc_number },
      { '@type': 'PropertyValue', name: 'Verification Status', value: biz.verification_status },
    ].filter(p => p.value),
  }

  // BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Directory', item: `${BASE_URL}/directory` },
      { '@type': 'ListItem', position: 3, name: biz.category, item: `${BASE_URL}/directory?category=${encodeURIComponent(biz.category)}` },
      { '@type': 'ListItem', position: 4, name: biz.name, item: `${BASE_URL}/business/${biz.slug}` },
    ],
  }

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Navbar />
      <main className="pt-20 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="py-4 flex items-center gap-2 text-xs text-ink-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/directory" className="hover:text-gold-400 transition-colors">Directory</Link>
            <span>/</span>
            <Link href={`/directory?category=${encodeURIComponent(biz.category)}`} className="hover:text-gold-400 transition-colors">{biz.category}</Link>
            <span>/</span>
            <span className="text-ink-300">{biz.name}</span>
          </nav>

          {/* Header */}
          <div className="card p-8 mb-6 relative overflow-hidden">
            {biz.verification_status === 'verified' && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400/0" />
            )}

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                {biz.logo_url
                  ? <img src={biz.logo_url} alt={`${biz.name} logo`} className="w-full h-full object-cover rounded-2xl" />
                  : <span className="font-display text-2xl font-bold text-gold-400">{biz.name.slice(0, 2).toUpperCase()}</span>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="font-display text-3xl font-bold text-white mb-1">{biz.name}</h1>
                    {biz.tagline && <p className="text-ink-400 text-sm italic mb-3">{biz.tagline}</p>}
                    <div className="flex flex-wrap gap-2">
                      {biz.verification_status === 'verified' && (
                        <span className="badge badge-green text-xs flex items-center gap-1">
                          <Shield size={10} /> Verified
                        </span>
                      )}
                      {biz.bbee_level && (
                        <span className="badge badge-gold text-xs">B-BBEE Level {biz.bbee_level}</span>
                      )}
                      {biz.is_featured && (
                        <span className="badge badge-gold text-xs">⭐ Featured</span>
                      )}
                      <span className="badge badge-gray text-xs">{biz.category}</span>
                      <span className="badge badge-gray text-xs flex items-center gap-1">
                        <MapPin size={10} /> {biz.city}, {biz.province}
                      </span>
                    </div>
                  </div>

                  {/* Ubizo score */}
                  <div className="text-center flex-shrink-0">
                    <div className="text-xs text-ink-500 mb-1">Profile Score</div>
                    <div className="font-display text-3xl font-bold text-gold-400">{biz.profile_completeness ?? 0}</div>
                    <div className="text-xs text-ink-500">/100</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-ink-700">
              {[
                { icon: Star, label: 'Rating', value: biz.rating_count > 0 ? `${biz.rating_average?.toFixed(1)} ★` : '—', sub: `${biz.rating_count} reviews` },
                { icon: Users, label: 'Team Size', value: biz.size ?? '—', sub: biz.employee_count ? `${biz.employee_count} people` : '' },
                { icon: TrendingUp, label: 'Revenue Band', value: biz.annual_revenue_band ?? '—', sub: 'Annual' },
                { icon: Eye, label: 'Profile Views', value: (biz.view_count ?? 0).toLocaleString(), sub: 'All time' },
              ].map(stat => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="text-center">
                    <Icon size={14} className="text-ink-500 mx-auto mb-1" />
                    <div className="font-display text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-ink-500">{stat.label}</div>
                    {stat.sub && <div className="text-xs text-ink-600">{stat.sub}</div>}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-6">
            {/* Main */}
            <div className="space-y-6">

              {/* About */}
              {biz.description && (
                <div className="card p-6">
                  <h2 className="font-display text-lg font-semibold text-white mb-3">About {biz.name}</h2>
                  <p className="text-ink-400 leading-relaxed text-sm">{biz.description}</p>
                </div>
              )}

              {/* Services */}
              {biz.services?.length > 0 && (
                <div className="card p-6">
                  <h2 className="font-display text-lg font-semibold text-white mb-4">Services</h2>
                  <div className="flex flex-wrap gap-2">
                    {biz.services.map((s: string) => (
                      <Link key={s} href={`/directory?q=${encodeURIComponent(s)}`}
                        className="text-xs bg-ink-700 hover:bg-ink-600 border border-ink-600 text-ink-300 hover:text-white px-3 py-1.5 rounded-full transition-colors">
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {biz.products?.length > 0 && (
                <div className="card p-6">
                  <h2 className="font-display text-lg font-semibold text-white mb-4">Products</h2>
                  <div className="flex flex-wrap gap-2">
                    {biz.products.map((p: string) => (
                      <span key={p} className="text-xs bg-ink-700 border border-ink-600 text-ink-300 px-3 py-1.5 rounded-full">{p}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="card p-6">
                <h2 className="font-display text-lg font-semibold text-white mb-4">
                  Reviews ({biz.rating_count ?? 0})
                </h2>
                <ReviewSection businessId={biz.id} reviews={reviews ?? []} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">

              {/* Contact */}
              <div className="card p-5">
                <h3 className="font-display text-sm font-semibold text-white mb-4">Contact</h3>
                <div className="space-y-3">
                  {biz.website && (
                    <a href={biz.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-sm text-ink-300 hover:text-gold-400 transition-colors group">
                      <Globe size={14} className="text-ink-500 group-hover:text-gold-400 flex-shrink-0" />
                      <span className="truncate">{biz.website.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink size={11} className="text-ink-600 flex-shrink-0" />
                    </a>
                  )}
                  {biz.email && (
                    <a href={`mailto:${biz.email}`}
                      className="flex items-center gap-2.5 text-sm text-ink-300 hover:text-gold-400 transition-colors">
                      <Mail size={14} className="text-ink-500 flex-shrink-0" />
                      <span className="truncate">{biz.email}</span>
                    </a>
                  )}
                  {biz.phone && (
                    <a href={`tel:${biz.phone}`}
                      className="flex items-center gap-2.5 text-sm text-ink-300 hover:text-gold-400 transition-colors">
                      <Phone size={14} className="text-ink-500 flex-shrink-0" />
                      {biz.phone}
                    </a>
                  )}
                  {biz.address && (
                    <div className="flex items-start gap-2.5 text-sm text-ink-400">
                      <MapPin size={14} className="text-ink-500 flex-shrink-0 mt-0.5" />
                      {biz.address}
                    </div>
                  )}
                </div>

                {/* WhatsApp CTA if phone exists */}
                {biz.phone && (
                  <a href={`https://wa.me/${biz.phone.replace(/\D/g, '')}?text=Hi ${encodeURIComponent(biz.name)}, I found you on BlackBiz and would like to enquire about your services.`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-primary w-full justify-center mt-4 text-sm py-2.5">
                    💬 WhatsApp Enquiry
                  </a>
                )}
              </div>

              {/* Details */}
              <div className="card p-5">
                <h3 className="font-display text-sm font-semibold text-white mb-4">Details</h3>
                <div className="space-y-2">
                  {[
                    ['Category', biz.category],
                    ['Province', biz.province],
                    ['Size', biz.size],
                    ['Revenue Band', biz.annual_revenue_band],
                    ['B-BBEE Level', biz.bbee_level ? `Level ${biz.bbee_level}` : null],
                    ['CIPC No.', biz.cipc_number],
                    ['Founded', biz.founded_year],
                    ['Listed', new Date(biz.created_at).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' })],
                  ].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k as string} className="flex justify-between text-xs py-1.5 border-b border-ink-700 last:border-0">
                      <span className="text-ink-500">{k as string}</span>
                      <span className="text-ink-200 font-medium text-right max-w-[60%]">{v as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile strength */}
              <div className="card p-5">
                <h3 className="font-display text-sm font-semibold text-white mb-3">Profile Strength</h3>
                <CompletenessBar score={biz.profile_completeness ?? 0} />
              </div>

              {/* Share */}
              <div className="card p-5">
                <h3 className="font-display text-sm font-semibold text-white mb-3">Share This Profile</h3>
                <div className="flex gap-2">
                  <a href={`https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(biz.name)} on BlackBiz 🇿🇦&url=${encodeURIComponent(`${BASE_URL}/business/${biz.slug}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-secondary text-xs py-2 px-3 flex-1 justify-center">
                    Share on X
                  </a>
                  <a href={`https://wa.me/?text=Check out ${encodeURIComponent(biz.name)} on BlackBiz: ${BASE_URL}/business/${biz.slug}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-secondary text-xs py-2 px-3 flex-1 justify-center">
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
