'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  MessageSquare, Heart, Trophy, FileText, Search,
  Newspaper, ArrowRight, Send, ChevronDown, Flame, X, Building2
} from 'lucide-react'
import toast from 'react-hot-toast'

// ── Types ─────────────────────────────────────────────────────
type PostType = 'all' | 'update' | 'tender' | 'rfq' | 'milestone' | 'opinion'

interface Post {
  id: string
  post_type: string
  title: string | null
  body: string
  tags: string[]
  budget_range: string | null
  deadline: string | null
  location: string | null
  like_count: number
  comment_count: number
  view_count: number
  is_verified_post: boolean
  is_pinned: boolean
  created_at: string
  businesses: {
    name: string
    slug: string
    city: string
    province: string
    category: string
    verification_status: string
  } | null
}

// ── Config ────────────────────────────────────────────────────
const FILTERS: { value: PostType; label: string; icon: any }[] = [
  { value: 'all',       label: 'All Posts',  icon: Flame },
  { value: 'update',    label: 'Updates',    icon: Newspaper },
  { value: 'tender',    label: 'Tenders',    icon: FileText },
  { value: 'rfq',       label: 'RFQ',        icon: Search },
  { value: 'milestone', label: 'Milestones', icon: Trophy },
  { value: 'opinion',   label: 'Opinions',   icon: MessageSquare },
]

const TYPE_CONFIG: Record<string, { label: string; badgeClasses: string; accentColor: string }> = {
  update:    { label: 'Update',    badgeClasses: 'bg-blue-500/10 border-blue-500/20 text-blue-400',     accentColor: '#3b82f6' },
  tender:    { label: 'Tender',    badgeClasses: 'bg-amber-500/10 border-amber-500/20 text-amber-400',  accentColor: '#f59e0b' },
  rfq:       { label: 'RFQ',       badgeClasses: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', accentColor: '#10b981' },
  milestone: { label: 'Milestone', badgeClasses: 'bg-gold-500/10 border-gold-500/20 text-gold-400',    accentColor: '#c9952a' },
  opinion:   { label: 'Opinion',   badgeClasses: 'bg-purple-500/10 border-purple-500/20 text-purple-400', accentColor: '#a855f7' },
}

const POST_TYPES = ['update', 'tender', 'rfq', 'milestone', 'opinion'] as const

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${Math.max(1, mins)}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

// ── Post Composer ─────────────────────────────────────────────
function PostComposer({ onPost }: { onPost: (p: Post) => void }) {
  const [open, setOpen]         = useState(false)
  const [type, setType]         = useState<typeof POST_TYPES[number]>('update')
  const [title, setTitle]       = useState('')
  const [body, setBody]         = useState('')
  const [budget, setBudget]     = useState('')
  const [deadline, setDeadline] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading]   = useState(false)

  const needsExtra = type === 'tender' || type === 'rfq'

  const submit = async () => {
    if (!body.trim()) return
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Sign in to post to the Hustle Feed')
      setLoading(false)
      return
    }

 const { data: bizData } = await supabase
  .from('businesses')
  .select('id')
  .eq('owner_id', user.id)
  .single()

const payload = {
  post_type: type,
  title: title || null,
  body: body.trim(),
  budget_range: budget || null,
  deadline: deadline || null,
  location: location || null,
  author_id: user.id,
  business_id: bizData?.id ?? null,
}

    const { data, error } = await supabase
      .from('hustle_posts')
      .insert(payload)
      .select('*, businesses(name, slug, city, province, category, verification_status)')
      .single()

  if (error) {
  toast.error(error.message)
  console.error('Post error:', error)
} else {
      onPost(data as Post)
      toast.success('Posted to Hustle Feed! 🔥')
      setTitle(''); setBody(''); setBudget(''); setDeadline(''); setLocation('')
      setOpen(false)
    }
    setLoading(false)
  }

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="card w-full p-4 flex items-center gap-3 text-left hover:border-gold-500/30 transition-all mb-6 cursor-text">
      <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 flex-shrink-0">
        ✏️
      </div>
      <span className="text-ink-500 text-sm italic flex-1">
        Share an update, tender, milestone or opinion…
      </span>
      <span className="btn-primary text-xs px-3 py-1.5 flex-shrink-0">Post</span>
    </button>
  )

  return (
    <div className="card p-6 mb-6 animate-fade-up">
      {/* Type selector */}
      <div className="flex gap-2 flex-wrap mb-4">
        {POST_TYPES.map(pt => {
          const config = TYPE_CONFIG[pt]
          return (
            <button key={pt} onClick={() => setType(pt)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all capitalize
                ${type === pt ? config.badgeClasses : 'border-ink-600 text-ink-500 hover:border-ink-400'}`}>
              {config.label}
            </button>
          )
        })}
      </div>

      {/* Title */}
      <input value={title} onChange={e => setTitle(e.target.value)}
        placeholder={
          type === 'tender'    ? 'Tender title…' :
          type === 'rfq'       ? 'What are you looking for?' :
          type === 'milestone' ? 'Your milestone headline…' :
          type === 'opinion'   ? 'Your take in one line…' :
          'Headline (optional)'
        }
        className="input mb-3 text-sm"
      />

      {/* Body */}
      <textarea value={body} onChange={e => setBody(e.target.value)} rows={4}
        placeholder={
          type === 'tender'    ? 'Describe scope, requirements, CIDB grade, and how to submit…' :
          type === 'rfq'       ? 'Describe what you need, volumes, timeline, and how to respond…' :
          type === 'milestone' ? 'Tell the community about this win. 🙏🏾' :
          type === 'opinion'   ? 'Share your perspective and invite the community to engage…' :
          'What do you want to share with the BlackBiz community?'
        }
        className="input mb-3 text-sm resize-none"
      />

      {/* Extra fields */}
      {needsExtra && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[
            ['Budget Range', budget, setBudget, 'e.g. R500K–R2M'],
            ['Deadline', deadline, setDeadline, 'YYYY-MM-DD'],
            ['Location', location, setLocation, 'e.g. Cape Town, WC'],
          ].map(([label, val, setter, ph]) => (
            <div key={label as string}>
              <label className="label">{label as string}</label>
              <input value={val as string} onChange={e => (setter as any)(e.target.value)}
                placeholder={ph as string} className="input text-sm" />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-600">{body.length}/1000</span>
        <div className="flex gap-2">
          <button onClick={() => setOpen(false)} className="btn-secondary text-sm py-2">
            Cancel
          </button>
          <button onClick={submit} disabled={!body.trim() || loading}
            className={`btn-primary text-sm py-2 gap-1.5 ${!body.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}>
            <Send size={14} />
            {loading ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Post Card ─────────────────────────────────────────────────
function PostCard({ post, onLike }: { post: Post; onLike: (id: string) => void }) {
  const [liked, setLiked]           = useState(false)
  const [expanded, setExpanded]     = useState(false)
  const [showComments, setComments] = useState(false)
  const [comment, setComment]       = useState('')
  const [localComments, setLocalComments] = useState<{ id: string; body: string; created_at: string }[]>([])

  const config = TYPE_CONFIG[post.post_type] ?? TYPE_CONFIG.update
  const biz    = post.businesses
  const isLong = post.body.length > 300

  const handleLike = async () => {
    if (liked) return
    setLiked(true)
    onLike(post.id)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('hustle_reactions').insert({ post_id: post.id, author_id: user.id }).select()
    }
  }

  const submitComment = async () => {
    if (!comment.trim()) return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Sign in to comment'); return }

    await supabase.from('hustle_comments').insert({
      post_id: post.id,
      author_id: user.id,
      body: comment.trim(),
    })

    setLocalComments(c => [...c, { id: crypto.randomUUID(), body: comment.trim(), created_at: new Date().toISOString() }])
    setComment('')
  }

  return (
    <div className="card overflow-hidden mb-4 hover:border-ink-600 transition-all">
      {/* Accent bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${config.accentColor}, transparent)` }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {biz ? (
              <Link href={`/business/${biz.slug}`}>
                <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center font-display font-bold text-sm text-gold-400 flex-shrink-0 hover:bg-gold-500/20 transition-colors">
                  {biz.name.charAt(0)}
                </div>
              </Link>
            ) : (
              <div className="w-9 h-9 rounded-lg bg-ink-700 flex items-center justify-center text-ink-400 flex-shrink-0">
                👤
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                {biz ? (
                  <Link href={`/business/${biz.slug}`} className="font-display text-sm font-semibold text-white hover:text-gold-400 transition-colors truncate">
                    {biz.name}
                  </Link>
                ) : (
                  <span className="font-display text-sm font-semibold text-white">Anonymous</span>
                )}
                {post.is_verified_post && (
                  <span className="text-xs text-gold-400 font-medium flex-shrink-0">✓</span>
                )}
              </div>
              <div className="text-xs text-ink-500 flex items-center gap-1.5">
                {biz && <span>{biz.city}</span>}
                {biz && <span>·</span>}
                <span>{timeAgo(post.created_at)}</span>
              </div>
            </div>
          </div>

          <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${config.badgeClasses}`}>
            {config.label}
          </span>
        </div>

        {/* Title */}
        {post.title && (
          <h3 className="font-display text-base font-semibold text-white mb-2 leading-snug">
            {post.title}
          </h3>
        )}

        {/* Body */}
        <p className="text-sm text-ink-400 leading-relaxed mb-3 whitespace-pre-line">
          {isLong && !expanded ? post.body.slice(0, 300) + '…' : post.body}
          {isLong && (
            <button onClick={() => setExpanded(!expanded)} className="text-gold-400 hover:text-gold-300 ml-1.5 text-xs font-medium">
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>

        {/* Tender/RFQ extras */}
        {(post.post_type === 'tender' || post.post_type === 'rfq') && (
          <div className="flex gap-2 flex-wrap mb-3">
            {post.budget_range && (
              <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full">
                💰 {post.budget_range}
              </span>
            )}
            {post.deadline && (
              <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full">
                📅 Closes {new Date(post.deadline).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
            {post.location && (
              <span className="text-xs bg-ink-700 border border-ink-600 text-ink-400 px-2.5 py-1 rounded-full">
                📍 {post.location}
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-3">
            {post.tags.slice(0, 5).map(tag => (
              <span key={tag} className="text-xs text-ink-600 hover:text-ink-400 cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-1 pt-3 border-t border-ink-700 -mx-5 px-5">
          <button onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all
              ${liked ? 'text-red-400 bg-red-500/10' : 'text-ink-500 hover:text-ink-300 hover:bg-ink-800'}`}>
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
            {post.like_count + (liked ? 1 : 0)}
          </button>

          <button onClick={() => setComments(!showComments)}
            className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all
              ${showComments ? 'text-gold-400 bg-gold-500/10' : 'text-ink-500 hover:text-ink-300 hover:bg-ink-800'}`}>
            <MessageSquare size={14} />
            {post.comment_count + localComments.length}
          </button>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(`https://blackbiz.co.za/feed`)
              toast.success('Link copied!')
            }}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg text-ink-500 hover:text-ink-300 hover:bg-ink-800 transition-all ml-auto">
            <ArrowRight size={14} /> Share
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-ink-700">
            <div className="flex gap-2 mb-3">
              <input value={comment} onChange={e => setComment(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment() } }}
                placeholder="Write a comment… (Enter to post)"
                className="input text-sm flex-1 py-2"
              />
              <button onClick={submitComment} disabled={!comment.trim()}
                className="btn-primary text-sm py-2 px-3 flex-shrink-0">
                <Send size={14} />
              </button>
            </div>
            {localComments.map(c => (
              <div key={c.id} className="flex gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-md bg-ink-700 flex items-center justify-center text-xs flex-shrink-0">👤</div>
                <div className="bg-ink-800 rounded-lg px-3 py-2 flex-1">
                  <p className="text-xs text-ink-300">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Client Component ─────────────────────────────────────
interface Props {
  initialPosts: Post[]
  totalCount: number
  tenderCount: number
  rfqCount: number
  milestoneCount: number
}

export default function FeedClient({ initialPosts, totalCount, tenderCount, rfqCount, milestoneCount }: Props) {
  const [posts, setPosts]     = useState<Post[]>(initialPosts)
  const [filter, setFilter]   = useState<PostType>('all')
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialPosts.length === 10)
  const [page, setPage]       = useState(1)

  const fetchMore = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const nextPage = page + 1

    let q = supabase
      .from('hustle_posts')
      .select('*, businesses(name, slug, city, province, category, verification_status)')
      .eq('is_active', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(nextPage * 10 - 10, nextPage * 10 - 1)

    if (filter !== 'all') q = q.eq('post_type', filter)
    if (search) q = q.or(`title.ilike.%${search}%,body.ilike.%${search}%`)

    const { data } = await q
    const newPosts = (data as Post[]) ?? []
    setPosts(p => [...p, ...newPosts])
    setHasMore(newPosts.length === 10)
    setPage(nextPage)
    setLoading(false)
  }, [page, filter, search])

  const applyFilter = useCallback(async (newFilter: PostType, newSearch = search) => {
    setLoading(true)
    setFilter(newFilter)
    setPage(1)

    const supabase = createClient()
    let q = supabase
      .from('hustle_posts')
      .select('*, businesses(name, slug, city, province, category, verification_status)')
      .eq('is_active', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(0, 9)

    if (newFilter !== 'all') q = q.eq('post_type', newFilter)
    if (newSearch) q = q.or(`title.ilike.%${newSearch}%,body.ilike.%${newSearch}%`)

    const { data } = await q
    setPosts((data as Post[]) ?? [])
    setHasMore((data?.length ?? 0) === 10)
    setLoading(false)
  }, [search])

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, like_count: p.like_count + 1 } : p))
  }

  const handleNewPost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev])
  }

  return (
    <div className="pt-10">
      <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-start">

        {/* ── Main column ──────────────────────────────────── */}
        <div>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-3xl font-bold text-white">Hustle Feed</h1>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-ink-400 text-sm">
              Updates, tenders, milestones and opinions from verified Black-owned businesses
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); applyFilter(filter, e.target.value) }}
              placeholder="Search posts, tenders, opportunities…"
              className="input pl-10 pr-8 text-sm"
            />
            {search && (
              <button onClick={() => { setSearch(''); applyFilter(filter, '') }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {FILTERS.map(f => {
              const Icon = f.icon
              return (
                <button key={f.value} onClick={() => applyFilter(f.value)}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all
                    ${filter === f.value
                      ? 'bg-gold-500/10 border-gold-500/30 text-gold-400'
                      : 'border-ink-700 text-ink-500 hover:border-ink-500 hover:text-ink-300'
                    }`}>
                  <Icon size={11} /> {f.label}
                </button>
              )
            })}
          </div>

          {/* Composer */}
          <PostComposer onPost={handleNewPost} />

          {/* Posts */}
          {loading && posts.length === 0 ? (
            <div className="space-y-4">
              {[0,1,2].map(i => (
                <div key={i} className="card p-5 h-44 animate-pulse">
                  <div className="h-3 bg-ink-700 rounded w-1/4 mb-3" />
                  <div className="h-4 bg-ink-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-ink-700 rounded w-full mb-1" />
                  <div className="h-3 bg-ink-700 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="card p-16 text-center">
              <Flame size={36} className="text-ink-600 mx-auto mb-3" />
              <p className="font-display text-lg font-semibold text-white mb-2">No posts yet</p>
              <p className="text-ink-400 text-sm">Be the first to post in the Hustle Feed</p>
            </div>
          ) : (
            <>
              {posts.map(post => (
                <PostCard key={post.id} post={post} onLike={handleLike} />
              ))}

              {hasMore && (
                <button onClick={fetchMore} disabled={loading}
                  className="btn-secondary w-full justify-center gap-2 mt-2">
                  <ChevronDown size={16} />
                  {loading ? 'Loading…' : 'Load more posts'}
                </button>
              )}
            </>
          )}
        </div>

        {/* ── Sidebar ──────────────────────────────────────── */}
        <div className="space-y-4 sticky top-24">

          {/* Stats */}
          <div className="card p-5">
            <h3 className="font-display text-sm font-semibold text-white mb-4">Feed Stats</h3>
            {[
              ['Total Posts', totalCount, 'text-gold-400'],
              ['Open Tenders', tenderCount, 'text-amber-400'],
              ['Open RFQs', rfqCount, 'text-emerald-400'],
              ['Milestones', milestoneCount, 'text-gold-400'],
            ].map(([label, val, cls]) => (
              <div key={label as string} className="flex items-center justify-between py-2 border-b border-ink-700 last:border-0">
                <span className="text-xs text-ink-400">{label as string}</span>
                <span className={`font-display font-bold text-base ${cls as string}`}>{val as number}</span>
              </div>
            ))}
          </div>

          {/* Post type guide */}
          <div className="card p-5">
            <h3 className="font-display text-sm font-semibold text-white mb-4">Post Types</h3>
            {[
              { emoji: '📢', label: 'Updates', desc: 'Share news & announcements' },
              { emoji: '📋', label: 'Tenders', desc: 'Post procurement opportunities' },
              { emoji: '🔍', label: 'RFQ', desc: 'Find the right suppliers' },
              { emoji: '🏆', label: 'Milestones', desc: 'Celebrate your wins' },
              { emoji: '💬', label: 'Opinions', desc: 'Spark industry conversations' },
            ].map(item => (
              <div key={item.label} className="flex gap-3 items-start py-2 border-b border-ink-700 last:border-0">
                <span className="text-base flex-shrink-0">{item.emoji}</span>
                <div>
                  <div className="text-xs font-semibold text-ink-300">{item.label}</div>
                  <div className="text-xs text-ink-600">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* List CTA */}
          <div className="card p-5 text-center border-gold-500/20">
            <Building2 size={28} className="text-gold-400 mx-auto mb-3" />
            <p className="font-display text-sm font-semibold text-white mb-1">List your business</p>
            <p className="text-xs text-ink-400 mb-4">Get verified and start posting</p>
            <Link href="/auth/register" className="btn-primary text-sm w-full justify-center">
              List Free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
