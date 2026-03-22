import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Globe, Mail, Phone, Shield, Calendar, Users, Star, ChevronRight, Building2, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { StarRating } from '@/components/business/BusinessCard'
import CompletenessBar from '@/components/business/CompletenessBar'
import ReviewSection from '@/components/business/ReviewSection'
import { getInitials, CATEGORY_ICONS, timeAgo } from '@/lib/utils'
import type { Business, Review } from '@/types'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps) {
  const supabase = createClient()
  const { data } = await supabase.from('businesses').select('name, tagline, description').eq('slug', params.slug).single()
  if (!data) return { title: 'Business Not Found' }
  return {
    title: data.name,
    description: data.tagline || data.description?.slice(0, 160),
  }
}

export default async function BusinessPage({ params }: PageProps) {
  const supabase = createClient()

  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!business || error) notFound()

  // Increment view count (fire and forget)
  supabase.from('businesses').update({ view_count: (business.view_count || 0) + 1 }).eq('id', business.id)

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:profiles(full_name, avatar_url)')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: currentUser } = await supabase.auth.getUser()

  const initials = getInitials(business.name)
  const isVerified = business.verification_status === 'verified'

  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />

      {/* Cover */}
      <div className="relative h-56 md:h-72 mt-16 overflow-hidden bg-ink-800">
        {business.cover_url ? (
          <Image src={business.cover_url} alt="" fill className="object-cover opacity-50" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink-700 via-ink-800 to-ink-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" />
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 relative pb-20">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: main info */}
          <div className="lg:col-span-2">
            {/* Profile header */}
            <div className="flex items-end gap-5 mb-6">
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-ink-900 flex items-center justify-center font-display font-bold text-xl flex-shrink-0 shadow-xl ${
                business.logo_url ? 'bg-white' : 'bg-gold-500 text-ink-900'
              }`}>
                {business.logo_url ? (
                  <Image src={business.logo_url} alt={business.name} width={96} height={96} className="rounded-2xl object-contain" />
                ) : initials}
              </div>
              <div className="pb-2">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-white">{business.name}</h1>
                  {isVerified && (
                    <span className="badge-green text-xs flex items-center gap-1">
                      <Shield size={11} /> Verified
                    </span>
                  )}
                  {business.is_featured && (
                    <span className="badge-gold text-xs">⭐ Featured</span>
                  )}
                </div>
                {business.tagline && (
                  <p className="text-ink-400 text-sm">{business.tagline}</p>
                )}
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-ink-500 mb-6">
              <Link href="/directory" className="hover:text-gold-400 transition-colors">Directory</Link>
              <ChevronRight size={12} />
              <Link href={`/directory?category=${encodeURIComponent(business.category)}`}
                className="hover:text-gold-400 transition-colors">{business.category}</Link>
              <ChevronRight size={12} />
              <span className="text-ink-400">{business.name}</span>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { icon: Star, label: 'Rating', value: business.rating_average > 0 ? `${business.rating_average.toFixed(1)}/5` : 'No reviews' },
                { icon: Users, label: 'Employees', value: business.employee_count ? `${business.employee_count}` : '—' },
                { icon: Calendar, label: 'Founded', value: business.founded_year ? `${business.founded_year}` : '—' },
                { icon: Building2, label: 'Size', value: business.size },
              ].map(stat => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="card p-3 text-center">
                    <Icon size={16} className="text-gold-400 mx-auto mb-1" />
                    <div className="text-white font-semibold text-sm">{stat.value}</div>
                    <div className="text-ink-500 text-xs">{stat.label}</div>
                  </div>
                )
              })}
            </div>

            {/* About */}
            {business.description && (
              <section className="mb-8">
                <h2 className="font-display text-lg font-semibold text-white mb-3">About</h2>
                <p className="text-ink-300 text-sm leading-relaxed whitespace-pre-line">{business.description}</p>
              </section>
            )}

            {/* Services */}
            {business.services?.length > 0 && (
              <section className="mb-8">
                <h2 className="font-display text-lg font-semibold text-white mb-3">Services</h2>
                <div className="flex flex-wrap gap-2">
                  {business.services.map(s => (
                    <span key={s} className="badge-gray">{s}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Products */}
            {business.products?.length > 0 && (
              <section className="mb-8">
                <h2 className="font-display text-lg font-semibold text-white mb-3">Products</h2>
                <div className="flex flex-wrap gap-2">
                  {business.products.map(p => (
                    <span key={p} className="badge-blue">{p}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {business.certifications?.length > 0 && (
              <section className="mb-8">
                <h2 className="font-display text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Award size={16} className="text-gold-400" /> Certifications
                </h2>
                <div className="flex flex-wrap gap-2">
                  {business.certifications.map(c => (
                    <span key={c} className="badge-gold">{c}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <ReviewSection
              businessId={business.id}
              reviews={(reviews || []) as Review[]}
              currentUserId={currentUser?.user?.id}
            />
          </div>

          {/* Right: sidebar */}
          <aside className="space-y-5">
            {/* Contact card */}
            <div className="card p-5">
              <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h3>
              <div className="space-y-3">
                {business.website && (
                  <a href={business.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-ink-300 hover:text-gold-400 transition-colors group">
                    <Globe size={15} className="text-ink-500 group-hover:text-gold-400" />
                    <span className="truncate">{business.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
                {business.email && (
                  <a href={`mailto:${business.email}`}
                    className="flex items-center gap-3 text-sm text-ink-300 hover:text-gold-400 transition-colors group">
                    <Mail size={15} className="text-ink-500 group-hover:text-gold-400" />
                    <span className="truncate">{business.email}</span>
                  </a>
                )}
                {business.phone && (
                  <a href={`tel:${business.phone}`}
                    className="flex items-center gap-3 text-sm text-ink-300 hover:text-gold-400 transition-colors group">
                    <Phone size={15} className="text-ink-500 group-hover:text-gold-400" />
                    {business.phone}
                  </a>
                )}
                {business.address && (
                  <div className="flex items-start gap-3 text-sm text-ink-400">
                    <MapPin size={15} className="text-ink-500 mt-0.5 flex-shrink-0" />
                    {business.address}
                  </div>
                )}
              </div>
            </div>

            {/* Business details */}
            <div className="card p-5">
              <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Details</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Category', value: business.category },
                  { label: 'Province', value: business.province },
                  { label: 'Size', value: business.size },
                  { label: 'Revenue Band', value: business.annual_revenue_band },
                  { label: 'B-BBEE Level', value: business.bbee_level ? `Level ${business.bbee_level}` : null },
                  { label: 'CIPC No.', value: business.cipc_number },
                  { label: 'Listed', value: timeAgo(business.created_at) },
                ].filter(d => d.value).map(d => (
                  <div key={d.label} className="flex justify-between text-sm">
                    <span className="text-ink-500">{d.label}</span>
                    <span className="text-ink-200 font-medium text-right ml-4">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile completeness */}
            <div className="card p-5">
              <h3 className="font-display font-semibold text-white mb-3 text-sm uppercase tracking-wider">
                Profile Strength
              </h3>
              <CompletenessBar score={business.profile_completeness} />
            </div>

            {/* Rating breakdown */}
            {business.rating_count > 0 && (
              <div className="card p-5">
                <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Rating</h3>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-4xl font-display font-bold text-gold-400">
                    {business.rating_average.toFixed(1)}
                  </div>
                  <div>
                    <StarRating rating={business.rating_average} size={14} />
                    <div className="text-xs text-ink-500 mt-1">{business.rating_count} reviews</div>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}
