import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MessageSquare, Heart, Flame, Trophy, FileText, Search, Newspaper, ArrowRight } from 'lucide-react'

interface Post {
  id: string
  post_type: string
  title: string | null
  body: string
  like_count: number
  comment_count: number
  deadline: string | null
  budget_range: string | null
  is_verified_post: boolean
  created_at: string
  businesses: {
    name: string
    slug: string
    city: string
    verification_status: string
  } | null
}

const TYPE_CONFIG: Record<string, { label: string; icon: any; classes: string; badgeClasses: string }> = {
  update:    { label: 'Update',    icon: Newspaper, classes: 'text-blue-400',   badgeClasses: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
  tender:    { label: 'Tender',    icon: FileText,  classes: 'text-amber-400',  badgeClasses: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
  rfq:       { label: 'RFQ',       icon: Search,    classes: 'text-emerald-400',badgeClasses: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
  milestone: { label: 'Milestone', icon: Trophy,    classes: 'text-gold-400',   badgeClasses: 'bg-gold-500/10 border-gold-500/20 text-gold-400' },
  opinion:   { label: 'Opinion',   icon: MessageSquare, classes: 'text-purple-400', badgeClasses: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${Math.max(1, mins)}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function PostCard({ post }: { post: Post }) {
  const config = TYPE_CONFIG[post.post_type] ?? TYPE_CONFIG.update
  const Icon = config.icon

  return (
    <Link href="/feed" className="card p-5 block group cursor-pointer hover:border-gold-500/30 transition-all">
      {/* Type badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${config.badgeClasses}`}>
          <Icon size={11} />
          {config.label}
        </span>
        {post.is_verified_post && (
          <span className="text-xs text-gold-400 font-medium">✓ Verified</span>
        )}
      </div>

      {/* Business */}
      {post.businesses && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-gold-500/20 flex items-center justify-center text-xs font-bold text-gold-400">
            {post.businesses.name.charAt(0)}
          </div>
          <span className="text-xs text-ink-400">
            {post.businesses.name}
            {post.businesses.verification_status === 'verified' && <span className="text-gold-400 ml-1">✓</span>}
          </span>
          <span className="text-ink-600 text-xs">·</span>
          <span className="text-xs text-ink-500">{timeAgo(post.created_at)}</span>
        </div>
      )}

      {/* Title */}
      {post.title && (
        <h3 className="font-display text-sm font-semibold text-white mb-2 leading-snug group-hover:text-gold-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
      )}

      {/* Body */}
      <p className="text-xs text-ink-400 leading-relaxed line-clamp-3 mb-3">
        {post.body}
      </p>

      {/* Tender/RFQ extras */}
      {(post.post_type === 'tender' || post.post_type === 'rfq') && (
        <div className="flex gap-2 flex-wrap mb-3">
          {post.budget_range && (
            <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
              💰 {post.budget_range}
            </span>
          )}
          {post.deadline && (
            <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
              📅 {new Date(post.deadline).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-4 text-xs text-ink-500">
        <span className="flex items-center gap-1">
          <Heart size={11} /> {post.like_count}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare size={11} /> {post.comment_count}
        </span>
      </div>
    </Link>
  )
}

export default async function HustleFeedPreview() {
  const supabase = createClient()

  const { data } = await supabase
    .from('hustle_posts')
    .select('*, businesses(name, slug, city, verification_status)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const posts = (data as Post[]) ?? []

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="section-title">Hustle Feed</h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-ink-400 text-sm">
            Updates, tenders, milestones and opinions from the community
          </p>
        </div>
        <Link href="/feed" className="btn-secondary text-sm gap-1.5 hidden sm:inline-flex">
          View Full Feed <ArrowRight size={14} />
        </Link>
      </div>

      {/* Cards */}
      {posts.length === 0 ? (
        <div className="card p-10 text-center">
          <Flame size={32} className="text-ink-600 mx-auto mb-3" />
          <p className="text-ink-400 text-sm mb-4">No posts yet — be the first to share</p>
          <Link href="/feed" className="btn-primary text-sm">
            Open Hustle Feed
          </Link>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>

          {/* CTA strip */}
          <div className="card p-4 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-ink-400">
              Share updates · Post tenders · Celebrate milestones · Find suppliers
            </p>
            <Link href="/feed" className="btn-primary text-sm gap-1.5">
              Open Hustle Feed <ArrowRight size={14} />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
