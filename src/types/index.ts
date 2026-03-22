export type BusinessCategory =
  | 'Technology'
  | 'Construction'
  | 'Retail & Trade'
  | 'Agriculture'
  | 'Manufacturing'
  | 'Financial Services'
  | 'Healthcare'
  | 'Education & Training'
  | 'Transport & Logistics'
  | 'Hospitality & Tourism'
  | 'Media & Creative'
  | 'Professional Services'
  | 'Energy & Environment'
  | 'Mining & Resources'
  | 'Other'

export type Province =
  | 'Gauteng'
  | 'KwaZulu-Natal'
  | 'Western Cape'
  | 'Eastern Cape'
  | 'Limpopo'
  | 'Mpumalanga'
  | 'Free State'
  | 'North West'
  | 'Northern Cape'

export type BusinessSize = 'Micro' | 'Small' | 'Medium' | 'Large'

export type VerificationStatus = 'unverified' | 'pending' | 'verified'

export type SubscriptionTier = 'free' | 'verified' | 'pro' | 'enterprise'

export interface Business {
  id: string
  slug: string
  owner_id: string
  name: string
  tagline: string | null
  description: string | null
  category: BusinessCategory
  province: Province
  city: string | null
  size: BusinessSize
  founded_year: number | null
  employee_count: number | null
  annual_revenue_band: string | null
  website: string | null
  email: string | null
  phone: string | null
  address: string | null
  logo_url: string | null
  cover_url: string | null
  cipc_number: string | null
  tax_number: string | null
  bbee_level: number | null
  verification_status: VerificationStatus
  subscription_tier: SubscriptionTier
  profile_completeness: number
  rating_average: number
  rating_count: number
  view_count: number
  is_featured: boolean
  is_active: boolean
  services: string[]
  products: string[]
  certifications: string[]
  social_links: Record<string, string>
  created_at: string
  updated_at: string
}

export interface BusinessProfile extends Business {
  owner: UserProfile | null
  reviews: Review[]
  documents: BusinessDocument[]
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'owner' | 'admin' | 'user'
  created_at: string
}

export interface Review {
  id: string
  business_id: string
  reviewer_id: string
  reviewer: UserProfile | null
  rating: number
  title: string | null
  body: string | null
  is_verified_transaction: boolean
  created_at: string
}

export interface BusinessDocument {
  id: string
  business_id: string
  type: 'cipc' | 'tax' | 'bbee' | 'other'
  name: string
  url: string
  verified: boolean
  created_at: string
}

export interface SearchFilters {
  query: string
  category: BusinessCategory | ''
  province: Province | ''
  size: BusinessSize | ''
  bbee_level: number | null
  verification_status: VerificationStatus | ''
  sort: 'relevance' | 'rating' | 'newest' | 'name'
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}
