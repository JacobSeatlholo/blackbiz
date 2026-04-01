import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, Heart, MessageSquare, Calendar, MapPin, DollarSign } from 'lucide-react'

const BASE_URL = 'https://www.blackbiz.co.za'

interface Props { params: { id: string } }

const TYPE_CONFIG: Record<string, { label: string; emoji: string }> = {
  update:    { label: 'Update',    emoji: '📢' },
  tender:    { label: 'Tender',    emoji: '📋' },
  rfq:       { label: 'RFQ',       emoji: '🔍' },
  milestone: { label: 'Milestone', emoji: '🏆' },
  opinion:   { label: 'Opinion',   emoji: '💬' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: post } = await supabase
    .from('hustle_posts')
    .select('*, businesses(name, slug, city, province, category)')
    .eq('id', params.id)
    .eq('is_active', true)
    .single()

  if (!post) return { title: 'Post Not Found' }

  const config = TYPE_CONFIG[post.post_type] ?? TYPE_CONFIG.update
  const bizName = post.businesses?.name ?? 'BlackBiz'
  const title = post.title
    ? `${post.title} — ${bizName} | BlackBiz Hustle Feed`
    : `${config.emoji} ${config.label} by ${bizName} | BlackBiz Hustle Feed`

  const description = post.body.slice(0, 160)

  return {
    title,
    description,
    keywords: [
      post.post_type === 'tender' ? 'tender opportunity South Africa' : '',
      post.post_type === 'rfq' ? 'supplier RFQ South Africa' : '',
      bizName,
      post.location ?? '',
      post.sector ?? '',
      'black business South Africa',
      'hustle feed blackbiz',
      ...(post.tags ?? []),
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/feed/${post.id}`,
      siteName: 'BlackBiz',
      type: 'article',
      publishedTime: post.created_at,
      authors: [bizName],
      tags: post.tags,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/feed/${post.id}`,
    },
  }
}

export default async function FeedPostPage({ params }: Props) {
  const supabase = createClient()

  const { data: post, error } = await supabase
    .from('hustle_posts')
    .select('*, businesses(name, slug, city, province, category, verification_status)')
    .eq('id', params.id)
    .eq('is_active', true)
    .single()

  if (error || !post) notFound()

  const { data: comments } = await supabase
    .from('hustle_comments')
    .select('*, profiles(full_name)')
    .eq('post_id', post.id)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  const config = TYPE_CONFIG[post.post_type] ?? TYPE_CONFIG.update
  const biz = post.businesses

  // Article JSON-LD for Google indexing
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': post.post_type === 'opinion' ? 'Article' : 'SocialMediaPosting',
    headline: post.title ?? `${config.label} by ${biz?.name}`,
    description: post.body.slice(0, 200),
    datePublished: post.created_at,
    dateModified: post.updated_at ?? post.created_at,
    author: {
      '@type': 'Organization',
      name: biz?.name ?? 'BlackBiz Community',
      url: biz ? `${BASE_URL}/business/${biz.slug}` : BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BlackBiz',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/feed/${post.id}`,
    },
    keywords: post.tags?.join(', '),
    ...(post.post_type === 'tender' && {
      about: {
        '@type': 'Tender',
        name: post.title,
        description: post.body,
        validThrough: post.deadline,
        areaServed: post.location,
      },
    }),
  }

  return (
    <div className="min-h-screen bg-ink-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="py-4 flex items-center gap-2 text-xs text-ink-500">
            <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/feed" className="hover:text-gold-400 transition-colors">Hustle Feed</Link>
            <span>/</span>
            <span className="text-ink-300 truncate">{post.title ?? config.label}</span>
          </nav>

          {/* Post */}
          <div className="card overflow-hidden mb-6">
            <div className="h-1" style={{ background: 'linear-gradient(90deg, #c9952a, transparent)' }} />
            <div className="p-7">

              {/* Type + Business */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {biz && (
                    <Link href={`/business/${biz.slug}`} className="flex items-center gap-2 group">
                      <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center font-display font-bold text-sm text-gold-400 group-hover:bg-gold-500/20 transition-colors">
                        {biz.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors">
                          {biz.name}
                          {biz.verification_status === 'verified' && <span className="text-gold-400 ml-1 text-xs">✓</span>}
                        </div>
                        <div className="text-xs text-ink-500">{biz.city}, {biz.province}</div>
                      </div>
                    </Link>
                  )}
                </div>
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400">
                  {config.emoji} {config.label}
                </span>
              </div>

              {/* Title */}
              {post.title && (
                <h1 className="font-display text-2xl font-bold text-white mb-4 leading-snug">
                  {post.title}
                </h1>
              )}

              {/* Body */}
              <div className="text-ink-300 leading-relaxed whitespace-pre-line mb-5 text-sm">
                {post.body}
              </div>

              {/* Tender/RFQ extras */}
              {(post.post_type === 'tender' || post.post_type === 'rfq') && (
                <div className="flex gap-3 flex-wrap mb-5">
                  {post.budget_range && (
                    <span className="flex items-center gap-1.5 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full">
                      <DollarSign size={11} /> {post.budget_range}
                    </span>
                  )}
                  {post.deadline && (
                    <span className="flex items-center gap-1.5 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full">
                      <Calendar size={11} /> Closes {new Date(post.deadline).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  )}
                  {post.location && (
                    <span className="flex items-center gap-1.5 text-xs bg-ink-700 border border-ink-600 text-ink-400 px-3 py-1.5 rounded-full">
                      <MapPin size={11} /> {post.location}
                    </span>
                  )}
                </div>
              )}

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-5">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="text-xs text-ink-600">#{tag}</span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center gap-4 pt-4 border-t border-ink-700 text-xs text-ink-500">
                <span className="flex items-center gap-1.5"><Heart size={13} /> {post.like_count} likes</span>
                <span className="flex items-center gap-1.5"><MessageSquare size={13} /> {post.comment_count} comments</span>
                <span className="ml-auto">{new Date(post.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="card p-6 mb-6">
            <h2 className="font-display text-base font-semibold text-white mb-4">
              Comments ({comments?.length ?? 0})
            </h2>
            {!comments?.length ? (
              <p className="text-ink-500 text-sm">No comments yet. <Link href="/auth/login" className="text-gold-400 hover:underline">Sign in</Link> to be the first.</p>
            ) : (
              <div className="space-y-4">
                {comments.map(c => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-ink-700 flex items-center justify-center text-xs font-bold text-ink-300 flex-shrink-0">
                      {c.profiles?.full_name?.charAt(0) ?? '?'}
                    </div>
                    <div className="bg-ink-800 rounded-lg px-4 py-3 flex-1">
                      <div className="text-xs font-semibold text-ink-300 mb-1">{c.profiles?.full_name ?? 'Anonymous'}</div>
                      <p className="text-sm text-ink-400">{c.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/feed" className="btn-secondary inline-flex gap-2 text-sm">
            <ArrowLeft size={14} /> Back to Hustle Feed
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
