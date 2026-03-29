'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, ArrowLeft, Check, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, PROVINCES, BUSINESS_SIZES, REVENUE_BANDS } from '@/lib/utils'
import toast from 'react-hot-toast'

const TABS = ['Basics', 'Details', 'Contact', 'Services']

export default function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [slug, setSlug] = useState('')

  const [form, setForm] = useState({
    name: '', tagline: '', description: '', category: '',
    province: '', city: '', size: 'Small', founded_year: '',
    employee_count: '', annual_revenue_band: '', website: '',
    email: '', phone: '', address: '', cipc_number: '',
    bbee_level: '', services: '', products: '',
  })

  // Load existing data
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id)
        .single()

      if (error || !data) {
        toast.error('Business not found or access denied')
        router.push('/dashboard')
        return
      }

      setSlug(data.slug)
      setForm({
        name:                data.name ?? '',
        tagline:             data.tagline ?? '',
        description:         data.description ?? '',
        category:            data.category ?? '',
        province:            data.province ?? '',
        city:                data.city ?? '',
        size:                data.size ?? 'Small',
        founded_year:        data.founded_year?.toString() ?? '',
        employee_count:      data.employee_count?.toString() ?? '',
        annual_revenue_band: data.annual_revenue_band ?? '',
        website:             data.website ?? '',
        email:               data.email ?? '',
        phone:               data.phone ?? '',
        address:             data.address ?? '',
        cipc_number:         data.cipc_number ?? '',
        bbee_level:          data.bbee_level?.toString() ?? '',
        services:            (data.services ?? []).join(', '),
        products:            (data.products ?? []).join(', '),
      })
      setLoading(false)
    }
    load()
  }, [id])

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('businesses')
      .update({
        name:                form.name,
        tagline:             form.tagline || null,
        description:         form.description || null,
        category:            form.category,
        province:            form.province,
        city:                form.city || null,
        size:                form.size,
        founded_year:        form.founded_year ? parseInt(form.founded_year) : null,
        employee_count:      form.employee_count ? parseInt(form.employee_count) : null,
        annual_revenue_band: form.annual_revenue_band || null,
        website:             form.website || null,
        email:               form.email || null,
        phone:               form.phone || null,
        address:             form.address || null,
        cipc_number:         form.cipc_number || null,
        bbee_level:          form.bbee_level ? parseInt(form.bbee_level) : null,
        services:            form.services ? form.services.split(',').map(s => s.trim()).filter(Boolean) : [],
        products:            form.products ? form.products.split(',').map(s => s.trim()).filter(Boolean) : [],
        updated_at:          new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      toast.error('Failed to save: ' + error.message)
    } else {
      toast.success('Profile updated!')
      router.push(`/business/${slug}`)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this business? This cannot be undone.')) return
    setDeleting(true)
    const { error } = await supabase.from('businesses').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete: ' + error.message)
      setDeleting(false)
    } else {
      toast.success('Business deleted')
      router.push('/dashboard')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center">
      <div className="text-ink-400 text-sm">Loading your business profile…</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ink-900 flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center">
              <Building2 size={18} className="text-ink-900" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-white">Edit Business</h1>
              <p className="text-ink-400 text-xs">{form.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/business/${slug}`} className="btn-ghost text-xs py-2 px-3">
              <Eye size={13} /> View
            </Link>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-8">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`h-1 w-full rounded-full transition-colors ${
                i < tab ? 'bg-gold-500' : i === tab ? 'bg-gold-400' : 'bg-ink-700'
              }`} />
              <span className={`text-xs ${i <= tab ? 'text-gold-400' : 'text-ink-600'}`}>{t}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="card p-7 space-y-5">

          {/* Tab 0: Basics */}
          {tab === 0 && (
            <>
              <div>
                <label className="label">Business Name *</label>
                <input className="input" value={form.name} onChange={set('name')} placeholder="e.g. Mzansi Tech Solutions" />
              </div>
              <div>
                <label className="label">Tagline</label>
                <input className="input" value={form.tagline} onChange={set('tagline')} placeholder="One sentence that describes what you do" />
              </div>
              <div>
                <label className="label">Industry *</label>
                <select className="input" value={form.category} onChange={set('category')}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Province *</label>
                  <select className="input" value={form.province} onChange={set('province')}>
                    <option value="">Select province</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">City</label>
                  <input className="input" value={form.city} onChange={set('city')} placeholder="e.g. Johannesburg" />
                </div>
              </div>
            </>
          )}

          {/* Tab 1: Details */}
          {tab === 1 && (
            <>
              <div>
                <label className="label">About Your Business</label>
                <textarea className="input min-h-28 resize-none" rows={5}
                  placeholder="Describe what your business does, your mission, and what sets you apart..."
                  value={form.description} onChange={set('description')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Business Size</label>
                  <select className="input" value={form.size} onChange={set('size')}>
                    {BUSINESS_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Founded Year</label>
                  <input className="input" type="number" placeholder="e.g. 2018"
                    min="1900" max={new Date().getFullYear()}
                    value={form.founded_year} onChange={set('founded_year')} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Employees</label>
                  <input className="input" type="number" placeholder="e.g. 12"
                    value={form.employee_count} onChange={set('employee_count')} />
                </div>
                <div>
                  <label className="label">Annual Revenue</label>
                  <select className="input" value={form.annual_revenue_band} onChange={set('annual_revenue_band')}>
                    <option value="">Select band</option>
                    {REVENUE_BANDS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">CIPC Reg. Number</label>
                  <input className="input" placeholder="e.g. 2018/123456/07"
                    value={form.cipc_number} onChange={set('cipc_number')} />
                </div>
                <div>
                  <label className="label">B-BBEE Level</label>
                  <select className="input" value={form.bbee_level} onChange={set('bbee_level')}>
                    <option value="">Select level</option>
                    {[1,2,3,4,5,6,7,8].map(l => <option key={l} value={l}>Level {l}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Tab 2: Contact */}
          {tab === 2 && (
            <>
              <div>
                <label className="label">Website</label>
                <input className="input" type="url" placeholder="https://yourbusiness.co.za"
                  value={form.website} onChange={set('website')} />
              </div>
              <div>
                <label className="label">Business Email</label>
                <input className="input" type="email" placeholder="info@yourbusiness.co.za"
                  value={form.email} onChange={set('email')} />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input className="input" type="tel" placeholder="+27 11 000 0000"
                  value={form.phone} onChange={set('phone')} />
              </div>
              <div>
                <label className="label">Business Address</label>
                <textarea className="input resize-none" rows={3}
                  placeholder="Full street address..."
                  value={form.address} onChange={set('address')} />
              </div>
            </>
          )}

          {/* Tab 3: Services */}
          {tab === 3 && (
            <>
              <div>
                <label className="label">Services (comma-separated)</label>
                <textarea className="input resize-none" rows={3}
                  placeholder="e.g. Web Development, Mobile Apps, UI Design"
                  value={form.services} onChange={set('services')} />
                <p className="text-xs text-ink-500 mt-1">These appear as searchable tags on your profile</p>
              </div>
              <div>
                <label className="label">Products (comma-separated)</label>
                <textarea className="input resize-none" rows={3}
                  placeholder="e.g. CRM Software, E-commerce Platform"
                  value={form.products} onChange={set('products')} />
              </div>
              <div className="card p-4 bg-gold-500/5 border-gold-500/20">
                <p className="text-xs text-gold-400 font-medium mb-1">Profile tip</p>
                <p className="text-xs text-ink-400">
                  Businesses with 5+ services and a complete description rank 3× higher in search results.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => tab > 0 ? setTab(t => t - 1) : router.push('/dashboard')}
            className="btn-ghost gap-2">
            <ArrowLeft size={16} />
            {tab === 0 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex gap-2">
            {tab === TABS.length - 1 && (
              <button onClick={handleDelete} disabled={deleting}
                className="btn-ghost text-red-400 hover:text-red-300 gap-1.5 text-sm">
                <Trash2 size={14} />
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            )}

            {tab < TABS.length - 1 ? (
              <button onClick={() => setTab(t => t + 1)} className="btn-primary gap-2">
                Next <ArrowLeft size={16} className="rotate-180" />
              </button>
            ) : (
              <button onClick={handleSave} disabled={saving} className="btn-primary gap-2">
                {saving ? 'Saving…' : <><Check size={16} /> Save Changes</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
