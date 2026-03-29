import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE_URL = 'https://www.blackbiz.co.za'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()

  // Fetch all active business slugs
  const { data: businesses } = await supabase
    .from('businesses')
    .select('slug, updated_at, rating_average, view_count')
    .eq('is_active', true)
    .order('view_count', { ascending: false })

  // Fetch all active feed posts
  const { data: posts } = await supabase
    .from('hustle_posts')
    .select('id, updated_at, post_type, like_count')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(500)

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/directory`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/feed`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/directory?sort=rating`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/directory?verified=true`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/popia`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Category pages — high value for keyword targeting
  const categories = [
    'Technology', 'Construction', 'Retail & Trade', 'Agriculture',
    'Manufacturing', 'Financial Services', 'Healthcare', 'Education & Training',
    'Transport & Logistics', 'Hospitality & Tourism', 'Media & Creative',
    'Professional Services', 'Energy & Environment', 'Mining & Resources',
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${BASE_URL}/directory?category=${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }))

  // Province pages — local SEO goldmine
  const provinces = [
    'Gauteng', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape',
    'Limpopo', 'Mpumalanga', 'Free State', 'North West', 'Northern Cape',
  ]

  const provincePages: MetadataRoute.Sitemap = provinces.map(prov => ({
    url: `${BASE_URL}/directory?province=${encodeURIComponent(prov)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Business profile pages — the money pages
  const businessPages: MetadataRoute.Sitemap = (businesses ?? []).map(biz => ({
    url: `${BASE_URL}/business/${biz.slug}`,
    lastModified: biz.updated_at ? new Date(biz.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    // Higher rated businesses get higher priority
    priority: biz.rating_average >= 4.5 ? 0.9 : biz.rating_average >= 4.0 ? 0.8 : 0.7,
  }))

  // Feed post pages — Reddit-style indexing
  const feedPages: MetadataRoute.Sitemap = (posts ?? []).map(post => ({
    url: `${BASE_URL}/feed/${post.id}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: post.like_count > 100 ? 0.75 : post.like_count > 20 ? 0.65 : 0.55,
  }))

  return [
    ...staticPages,
    ...categoryPages,
    ...provincePages,
    ...businessPages,
    ...feedPages,
  ]
}
