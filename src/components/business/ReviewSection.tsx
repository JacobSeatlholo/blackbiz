'use client'
import { useState } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { StarRating } from './BusinessCard'
import { getInitials, timeAgo, cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Review } from '@/types'

interface Props {
  businessId: string
  reviews: Review[]
  currentUserId?: string
}

export default function ReviewSection({ businessId, reviews: initial, currentUserId }: Props) {
  const [reviews, setReviews] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const hasReviewed = currentUserId && reviews.some(r => r.reviewer_id === currentUserId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId) { toast.error('Sign in to leave a review'); return }
    setSubmitting(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('reviews')
      .insert({ business_id: businessId, reviewer_id: currentUserId, rating, title, body })
      .select('*, reviewer:profiles(full_name, avatar_url)')
      .single()

    if (error) { toast.error('Failed to submit review'); }
    else {
      setReviews(prev => [data as Review, ...prev])
      setShowForm(false)
      setTitle(''); setBody(''); setRating(5)
      toast.success('Review submitted!')
    }
    setSubmitting(false)
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare size={18} className="text-gold-400" />
          Reviews ({reviews.length})
        </h2>
        {currentUserId && !hasReviewed && (
          <button onClick={() => setShowForm(!showForm)} className="btn-secondary text-xs py-2">
            Write a Review
          </button>
        )}
        {!currentUserId && (
          <a href="/auth/login" className="text-xs text-gold-400 hover:underline">Sign in to review</a>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-5 mb-6">
          <h3 className="font-semibold text-white text-sm mb-4">Your Review</h3>
          {/* Star picker */}
          <div className="mb-4">
            <label className="label">Rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <button key={i} type="button"
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i)}
                  className="text-2xl transition-transform hover:scale-110">
                  <span className={cn(
                    i <= (hoverRating || rating) ? 'text-gold-400' : 'text-ink-600'
                  )}>★</span>
                </button>
              ))}
              <span className="text-sm text-ink-400 ml-2 self-center">{rating}/5</span>
            </div>
          </div>

          <div className="mb-3">
            <label className="label">Title</label>
            <input className="input" placeholder="Summarise your experience" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          <div className="mb-4">
            <label className="label">Review</label>
            <textarea className="input min-h-24 resize-none" placeholder="Tell others about your experience with this business..."
              value={body} onChange={e => setBody(e.target.value)} required rows={4} />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-primary text-sm py-2">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm py-2">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="card p-8 text-center">
          <Star size={28} className="text-ink-600 mx-auto mb-2" />
          <p className="text-ink-400 text-sm">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="card p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {review.reviewer?.full_name ? getInitials(review.reviewer.full_name) : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-white">
                      {review.reviewer?.full_name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-ink-500">{timeAgo(review.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating rating={review.rating} size={12} />
                    {review.is_verified_transaction && (
                      <span className="badge-green text-xs">Verified transaction</span>
                    )}
                  </div>
                </div>
              </div>
              {review.title && <p className="text-sm font-semibold text-white mb-1">{review.title}</p>}
              {review.body && <p className="text-sm text-ink-400 leading-relaxed">{review.body}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
