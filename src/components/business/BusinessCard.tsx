import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Shield, Users, ExternalLink } from 'lucide-react'
import { cn, getInitials, CATEGORY_ICONS } from '@/lib/utils'
import type { Business } from '@/types'

interface Props {
  business: Business
  index?: number
}

export default function BusinessCard({ business, index = 0 }: Props) {
  const initials = getInitials(business.name)
  const isVerified = business.verification_status === 'verified'

  return (
    <Link
      href={`/business/${business.slug}`}
      className="card-hover flex flex-col group"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Cover / header */}
      <div className="relative h-28 bg-ink-700 overflow-hidden">
        {business.cover_url ? (
          <Image src={business.cover_url} alt="" fill className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink-600 to-ink-800" />
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="badge-gray text-xs">
            <span>{CATEGORY_ICONS[business.category] || '🏢'}</span>
            {business.category}
          </span>
        </div>
        {/* Featured */}
        {business.is_featured && (
          <div className="absolute top-3 right-3">
            <span className="badge-gold text-xs">⭐ Featured</span>
          </div>
        )}
        {/* Logo */}
        <div className="absolute -bottom-5 left-4">
          <div className={cn(
            'w-12 h-12 rounded-xl border-2 border-ink-800 flex items-center justify-center font-display font-bold text-sm',
            business.logo_url ? 'bg-white' : 'bg-gold-500 text-ink-900'
          )}>
            {business.logo_url ? (
              <Image src={business.logo_url} alt={business.name} width={48} height={48} className="rounded-xl object-contain" />
            ) : (
              initials
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 pt-8 flex-1 flex flex-col">
        {/* Name + verify badge */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-semibold text-white text-sm leading-snug group-hover:text-gold-400 transition-colors line-clamp-1">
            {business.name}
          </h3>
          {isVerified && (
            <Shield size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
          )}
        </div>

        {/* Tagline */}
        {business.tagline && (
          <p className="text-xs text-ink-400 mb-3 line-clamp-2 leading-relaxed">{business.tagline}</p>
        )}

        <div className="mt-auto space-y-2">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-ink-400">
            <MapPin size={11} className="flex-shrink-0" />
            <span>{[business.city, business.province].filter(Boolean).join(', ')}</span>
          </div>

          {/* Rating + employees */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <StarRating rating={business.rating_average} />
              {business.rating_count > 0 && (
                <span className="text-xs text-ink-500">({business.rating_count})</span>
              )}
            </div>
            {business.employee_count && (
              <div className="flex items-center gap-1 text-xs text-ink-500">
                <Users size={11} />
                {business.employee_count}
              </div>
            )}
          </div>

          {/* Services tags */}
          {business.services?.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {business.services.slice(0, 3).map(s => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-ink-700 text-ink-400">
                  {s}
                </span>
              ))}
              {business.services.length > 3 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-ink-700 text-ink-500">
                  +{business.services.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-ink-700 flex items-center justify-between">
        <div className="flex gap-1.5">
          {business.bbee_level && (
            <span className="badge-gold text-xs">B-BBEE L{business.bbee_level}</span>
          )}
          {isVerified && (
            <span className="badge-green text-xs">Verified</span>
          )}
        </div>
        <ExternalLink size={13} className="text-ink-600 group-hover:text-gold-500 transition-colors" />
      </div>
    </Link>
  )
}

export function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? 'star-filled' : 'star-empty'}>
          <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 1l2.39 5.26L18 7.27l-4 3.9.94 5.5L10 14.27l-4.94 2.4.94-5.5-4-3.9 5.61-.01z" />
          </svg>
        </span>
      ))}
    </div>
  )
}
