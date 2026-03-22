'use client'
import { cn } from '@/lib/utils'

export default function CompletenessBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-gold-500' : 'bg-red-500'
  const label = score >= 80 ? 'Strong' : score >= 50 ? 'Good' : 'Needs work'

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-ink-400">{label}</span>
        <span className="text-sm font-semibold text-white">{score}%</span>
      </div>
      <div className="h-2 bg-ink-700 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700', color)}
          style={{ width: `${score}%` }}
        />
      </div>
      {score < 100 && (
        <p className="text-xs text-ink-500 mt-2">
          Complete your profile to rank higher in search results.
        </p>
      )}
    </div>
  )
}
