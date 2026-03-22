'use client'
import { useState, useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react'
import BusinessCard from '@/components/business/BusinessCard'
import BusinessListItem from '@/components/business/BusinessListItem'
import { cn } from '@/lib/utils'
import type { Business } from '@/types'

interface Props {
  businesses: Business[]
  totalCount: number
  totalPages: number
  currentPage: number
  searchParams: Record<string, string | undefined>
  categories: string[]
  provinces: string[]
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'A–Z' },
]

const SIZE_OPTIONS = ['Micro', 'Small', 'Medium', 'Large']

export default function DirectoryClient({
  businesses, totalCount, totalPages, currentPage, searchParams, categories, provinces,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const updateSearch = useCallback((updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const merged = { ...searchParams, ...updates, page: '1' }
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v) })
    startTransition(() => router.push(`/directory?${params.toString()}`))
  }, [searchParams, router])

  const clearFilter = (key: string) => updateSearch({ [key]: undefined })
  const clearAll = () => startTransition(() => router.push('/directory'))

  const activeFilters = Object.entries(searchParams).filter(([k, v]) => v && k !== 'page')

  return (
    <div className="flex gap-8">
      {/* Sidebar filters — desktop */}
      <aside className={cn(
        'hidden lg:block w-64 flex-shrink-0',
        isPending && 'opacity-60 pointer-events-none'
      )}>
        <FilterPanel
          searchParams={searchParams}
          categories={categories}
          provinces={provinces}
          onUpdate={updateSearch}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Search bar + controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              defaultValue={searchParams.q || ''}
              placeholder="Search businesses, services, keywords..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateSearch({ q: (e.target as HTMLInputElement).value || undefined })
                }
              }}
              className="input pl-9 rounded-xl"
            />
          </div>

          <div className="flex gap-2">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn('lg:hidden btn-secondary gap-2 text-sm px-3',
                showFilters && 'border-gold-500 text-gold-400')}
            >
              <SlidersHorizontal size={15} />
              Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
            </button>

            {/* Sort */}
            <select
              value={searchParams.sort || 'relevance'}
              onChange={(e) => updateSearch({ sort: e.target.value })}
              className="input rounded-xl text-sm w-auto px-3 py-2"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* View toggle */}
            <div className="hidden sm:flex border border-ink-600 rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('grid')}
                className={cn('p-2.5 transition-colors', viewMode === 'grid' ? 'bg-ink-700 text-white' : 'text-ink-400 hover:text-white')}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setViewMode('list')}
                className={cn('p-2.5 transition-colors', viewMode === 'list' ? 'bg-ink-700 text-white' : 'text-ink-400 hover:text-white')}>
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile filters */}
        {showFilters && (
          <div className="lg:hidden mb-6 card p-4">
            <FilterPanel
              searchParams={searchParams}
              categories={categories}
              provinces={provinces}
              onUpdate={updateSearch}
            />
          </div>
        )}

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {activeFilters.map(([key, value]) => (
              <span key={key} className="badge-gold gap-1.5 text-xs">
                {key}: {value}
                <button onClick={() => clearFilter(key)} className="hover:text-white ml-0.5">
                  <X size={12} />
                </button>
              </span>
            ))}
            <button onClick={clearAll} className="text-xs text-ink-400 hover:text-gold-400 transition-colors underline">
              Clear all
            </button>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-ink-400">
            {isPending ? 'Searching...' : `${totalCount.toLocaleString()} businesses found`}
          </p>
        </div>

        {/* Results */}
        {businesses.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {businesses.map((biz, i) => (
              <BusinessCard key={biz.id} business={biz} index={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {businesses.map((biz, i) => (
              <BusinessListItem key={biz.id} business={biz} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              disabled={currentPage <= 1}
              onClick={() => updateSearch({ page: String(currentPage - 1) })}
              className="btn-secondary py-2 px-3 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = i + 1
                return (
                  <button key={p}
                    onClick={() => updateSearch({ page: String(p) })}
                    className={cn('w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                      p === currentPage ? 'bg-gold-500 text-ink-900' : 'text-ink-400 hover:text-white hover:bg-ink-700'
                    )}>
                    {p}
                  </button>
                )
              })}
            </div>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => updateSearch({ page: String(currentPage + 1) })}
              className="btn-secondary py-2 px-3 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterPanel({ searchParams, categories, provinces, onUpdate }: {
  searchParams: Record<string, string | undefined>
  categories: string[]
  provinces: string[]
  onUpdate: (u: Record<string, string | undefined>) => void
}) {
  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <label className="label">Industry</label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          {categories.map(cat => (
            <button key={cat}
              onClick={() => onUpdate({ category: searchParams.category === cat ? undefined : cat })}
              className={cn(
                'w-full text-left text-sm px-3 py-2 rounded-lg transition-colors',
                searchParams.category === cat
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  : 'text-ink-300 hover:text-white hover:bg-ink-700'
              )}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Province */}
      <div>
        <label className="label">Province</label>
        <select
          value={searchParams.province || ''}
          onChange={(e) => onUpdate({ province: e.target.value || undefined })}
          className="input text-sm"
        >
          <option value="">All Provinces</option>
          {provinces.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Size */}
      <div>
        <label className="label">Business Size</label>
        <div className="grid grid-cols-2 gap-2">
          {SIZE_OPTIONS.map(size => (
            <button key={size}
              onClick={() => onUpdate({ size: searchParams.size === size ? undefined : size })}
              className={cn(
                'text-sm px-3 py-2 rounded-lg border transition-colors',
                searchParams.size === size
                  ? 'bg-gold-500/20 text-gold-400 border-gold-500/30'
                  : 'border-ink-600 text-ink-400 hover:text-white hover:border-ink-400'
              )}>
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Verified only */}
      <div>
        <label className="label">Status</label>
        <button
          onClick={() => onUpdate({ verified: searchParams.verified === 'true' ? undefined : 'true' })}
          className={cn(
            'w-full text-sm px-3 py-2 rounded-lg border transition-colors text-left',
            searchParams.verified === 'true'
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : 'border-ink-600 text-ink-400 hover:text-white hover:border-ink-400'
          )}>
          ✓ Verified only
        </button>
      </div>
    </div>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="font-display text-xl font-semibold text-white mb-2">No businesses found</h3>
      <p className="text-ink-400 text-sm mb-6">Try adjusting your filters or search query</p>
      <button onClick={onClear} className="btn-secondary text-sm">Clear all filters</button>
    </div>
  )
}
