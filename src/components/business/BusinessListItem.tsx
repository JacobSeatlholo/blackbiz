import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Shield, Users, ArrowRight } from 'lucide-react'
import { StarRating } from './BusinessCard'
import { getInitials, CATEGORY_ICONS } from '@/lib/utils'
import type { Business } from '@/types'

interface Props {
  business: Business
  index?: number
}

export default function BusinessListItem({ business, index = 0 }: Props) {
  const initials = getInitials(business.name)
  const isVerified = business.verification_status === 'verified'

  return (
    <Link
      href={`/business/${business.slug}`}
      className="card-hover flex items-center gap-4 p-4 group"
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      {/* Logo */}
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-display font-bold text-sm flex-shrink-0 ${
        business.logo_url ? 'bg-white' : 'bg-gold-500 text-ink-900'
      }`}>
        {business.logo_url ? (
          <Image src={business.logo_url} alt={business.name} width={56} height={56} className="rounded-xl object-contain" />
        ) : initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-display font-semibold text-white text-sm group-hover:text-gold-400 transition-colors truncate">
            {business.name}
          </h3>
          {isVerified && <Shield size={13} className="text-emerald-400 flex-shrink-0" />}
        </div>

        {business.tagline && (
          <p className="text-xs text-ink-400 mb-1.5 line-clamp-1">{business.tagline}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500">
          <span className="flex items-center gap-1">
            <span>{CATEGORY_ICONS[business.category]}</span>
            {business.category}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {[business.city, business.province].filter(Boolean).join(', ')}
          </span>
          {business.employee_count && (
            <span className="flex items-center gap-1">
              <Users size={11} />
              {business.employee_count} employees
            </span>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <StarRating rating={business.rating_average} />
          {business.rating_count > 0 && (
            <span className="text-xs text-ink-500">({business.rating_count})</span>
          )}
        </div>
        <div className="flex gap-1.5">
          {business.bbee_level && <span className="badge-gold text-xs">B-BBEE L{business.bbee_level}</span>}
          {isVerified && <span className="badge-green text-xs">Verified</span>}
        </div>
        <ArrowRight size={14} className="text-ink-600 group-hover:text-gold-500 transition-colors" />
      </div>
    </Link>
  )
}
