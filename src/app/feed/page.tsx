import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FeedClient from '@/components/feed/FeedClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hustle Feed — BlackBiz',
  description: 'Updates, tenders, milestones and opinions from South Africa\'s Black business community.',
}

export default async function FeedPage() {
  const supabase = createClient()

  // Initial load — most recent 10
  const { data, count } = await supabase
    .from('hustle_posts')
    .select('*, businesses(name, slug, city, province, category, is_verified)', { count: 'exact' })
    .eq('is_active', true)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .range(0, 9)

  // Feed stats
  const { count: tenderCount } = await supabase
    .from('hustle_posts')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('post_type', 'tender')

  const { count: rfqCount } = await supabase
    .from('hustle_posts')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('post_type', 'rfq')

  const { count: milestoneCount } = await supabase
    .from('hustle_posts')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('post_type', 'milestone')

  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Suspense fallback={<div className="text-ink-400 py-20 text-center">Loading feed…</div>}>
            <FeedClient
              initialPosts={data ?? []}
              totalCount={count ?? 0}
              tenderCount={tenderCount ?? 0}
              rfqCount={rfqCount ?? 0}
              milestoneCount={milestoneCount ?? 0}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
