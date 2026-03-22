import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DirectoryClient from '@/components/search/DirectoryClient'
import { CATEGORIES, PROVINCES } from '@/lib/utils'
import type { Business } from '@/types'

interface PageProps {
  searchParams: {
    q?: string
    category?: string
    province?: string
    size?: string
    sort?: string
    verified?: string
    page?: string
  }
}

const PAGE_SIZE = 12

export default async function DirectoryPage({ searchParams }: PageProps) {
  const supabase = createClient()
  const page = parseInt(searchParams.page || '1')
  const offset = (page - 1) * PAGE_SIZE

  let query = supabase
    .from('businesses')
    .select('*', { count: 'exact' })
    .eq('is_active', true)

  // Full-text search
  if (searchParams.q) {
    query = query.textSearch('search_vector', searchParams.q, {
      type: 'websearch',
      config: 'english',
    })
  }

  if (searchParams.category) query = query.eq('category', searchParams.category)
  if (searchParams.province)  query = query.eq('province', searchParams.province)
  if (searchParams.size)      query = query.eq('size', searchParams.size)
  if (searchParams.verified === 'true') query = query.eq('verification_status', 'verified')

  // Sorting
  switch (searchParams.sort) {
    case 'rating':  query = query.order('rating_average', { ascending: false }); break
    case 'newest':  query = query.order('created_at', { ascending: false }); break
    case 'name':    query = query.order('name', { ascending: true }); break
    default:        query = query.order('is_featured', { ascending: false }).order('rating_average', { ascending: false })
  }

  query = query.range(offset, offset + PAGE_SIZE - 1)

  const { data: businesses, count, error } = await query

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="py-10 border-b border-ink-700 mb-8">
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Business Directory
            </h1>
            <p className="text-ink-400 text-sm">
              {count ? `${count.toLocaleString()} businesses` : 'Discover'} across South Africa
            </p>
          </div>

          <Suspense fallback={<div className="text-ink-400">Loading...</div>}>
            <DirectoryClient
              businesses={(businesses as Business[]) || []}
              totalCount={count || 0}
              totalPages={totalPages}
              currentPage={page}
              searchParams={searchParams}
              categories={[...CATEGORIES]}
              provinces={[...PROVINCES]}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
