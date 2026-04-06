import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Eye, Star, BarChart2, Shield, Settings, Edit } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import CompletenessBar from '@/components/business/CompletenessBar'
import GoLiveDashboard from '@/components/live/GoLiveDashboard'
import { timeAgo } from '@/lib/utils'
import PaymentSuccessToast from '@/components/ui/PaymentSuccessToast'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
<PaymentSuccessToast />

      <main className="pt-20 pb-20 max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="py-10 flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-1">
              Hey, {firstName} 👋
            </h1>
            <p className="text-ink-400 text-sm">Manage your businesses and track performance</p>
          </div>
          <Link href="/dashboard/new" className="btn-primary">
            <Plus size={16} /> New Business
          </Link>
        </div>

        {businesses && businesses.length > 0 ? (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Businesses', value: businesses.length, icon: BarChart2, color: 'text-gold-400' },
                { label: 'Total Views', value: businesses.reduce((a, b) => a + (b.view_count || 0), 0).toLocaleString(), icon: Eye, color: 'text-blue-400' },
                { label: 'Total Reviews', value: businesses.reduce((a, b) => a + (b.rating_count || 0), 0), icon: Star, color: 'text-emerald-400' },
              ].map(stat => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="card p-5 flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-ink-700 ${stat.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-ink-400">{stat.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Business list */}
            <div>
              <h2 className="font-display text-lg font-semibold text-white mb-4">Your Businesses</h2>
              <div className="space-y-4">
                {businesses.map(biz => (
                  <div key={biz.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{biz.name}</h3>
                        {biz.verification_status === 'verified' && (
                          <Shield size={14} className="text-emerald-400" />
                        )}
                        <span className={`badge text-xs ${
                          biz.verification_status === 'verified' ? 'badge-green' :
                          biz.verification_status === 'pending' ? 'badge-gold' : 'badge-gray'
                        }`}>
                          {biz.verification_status}
                        </span>
                      </div>
                      <p className="text-sm text-ink-400 truncate">{biz.tagline || biz.category}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-ink-500">
                        <span className="flex items-center gap-1"><Eye size={11} /> {biz.view_count || 0} views</span>
                        <span className="flex items-center gap-1"><Star size={11} /> {biz.rating_average?.toFixed(1) || '—'} rating</span>
                        <span>Listed {timeAgo(biz.created_at)}</span>
{businesses?.some(b => b.verification_status === 'verified') && (
  <GoLiveDashboard businessSlug={biz.slug} businessId={biz.id} />
)}
                      </div>
                    </div>

                    {/* Completeness */}
                    <div className="sm:w-40">
                      <CompletenessBar score={biz.profile_completeness || 0} />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/business/${biz.slug}`} className="btn-ghost text-xs py-2 px-3">
                        <Eye size={13} /> View
                      </Link>
                      <Link href={`/dashboard/edit/${biz.id}`} className="btn-secondary text-xs py-2 px-3">
                        <Edit size={13} /> Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-5">
              <Plus size={32} className="text-gold-400" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">No businesses yet</h2>
            <p className="text-ink-400 text-sm max-w-sm mx-auto mb-8">
              Create your first business profile to start appearing in search results and connecting with clients.
            </p>
            <Link href="/dashboard/new" className="btn-primary text-base px-8 py-3">
              <Plus size={18} /> Create Your First Business
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
