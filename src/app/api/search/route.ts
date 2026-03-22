import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const province = searchParams.get('province') || ''
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)

  const supabase = createClient()

  let query = supabase
    .from('businesses')
    .select('id, slug, name, tagline, category, province, city, logo_url, verification_status, rating_average, rating_count')
    .eq('is_active', true)
    .limit(limit)

  if (q) {
    query = query.textSearch('search_vector', q, { type: 'websearch', config: 'english' })
  }
  if (category) query = query.eq('category', category)
  if (province) query = query.eq('province', province)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ results: data })
}
