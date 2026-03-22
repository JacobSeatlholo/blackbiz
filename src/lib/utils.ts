import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatCurrency(amount: number, currency = 'ZAR'): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays} days ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export const CATEGORIES = [
  'Technology', 'Construction', 'Retail & Trade', 'Agriculture',
  'Manufacturing', 'Financial Services', 'Healthcare', 'Education & Training',
  'Transport & Logistics', 'Hospitality & Tourism', 'Media & Creative',
  'Professional Services', 'Energy & Environment', 'Mining & Resources', 'Other',
] as const

export const PROVINCES = [
  'Gauteng', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape',
  'Limpopo', 'Mpumalanga', 'Free State', 'North West', 'Northern Cape',
] as const

export const BUSINESS_SIZES = ['Micro', 'Small', 'Medium', 'Large'] as const

export const REVENUE_BANDS = [
  'Under R500K', 'R500K–R2M', 'R2M–R10M', 'R10M–R50M', 'R50M+'
] as const

export const CATEGORY_ICONS: Record<string, string> = {
  'Technology': '💻', 'Construction': '🏗️', 'Retail & Trade': '🛍️',
  'Agriculture': '🌾', 'Manufacturing': '🏭', 'Financial Services': '💰',
  'Healthcare': '🏥', 'Education & Training': '📚', 'Transport & Logistics': '🚚',
  'Hospitality & Tourism': '🏨', 'Media & Creative': '🎨',
  'Professional Services': '💼', 'Energy & Environment': '⚡',
  'Mining & Resources': '⛏️', 'Other': '🔧',
}
