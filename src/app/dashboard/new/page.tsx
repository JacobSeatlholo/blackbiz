'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { slugify, CATEGORIES, PROVINCES, BUSINESS_SIZES, REVENUE_BANDS } from '@/lib/utils'
import toast from 'react-hot-toast'

const STEPS = ['Basics', 'Details', 'Contact', 'Services']

export default function NewBusinessPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '', tagline: '', description: '', category: '',
    province: '', city: '', size: 'Small', founded_year: '',
    employee_count: '', annual_revenue_band: '', website: '',
    email: '', phone: '', address: '', cipc_number: '',
    bbee_level: '', services: '', products: '',
  })

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Not signed in'); setSaving(false); return }

    const slug = slugify(form.name) + '-' + Math.random().toString(36).slice(2, 6)

    const { data, error } = await supabase.from('businesses').insert({
      owner_id: user.id,
      slug,
      name: form.name,
      tagline: form.tagline || null,
      description: form.description || null,
      category: form.category,
      province: form.province,
      city: form.city || null,
      size: form.size,
      founded_year: form.founded_year ? parseInt(form.founded_year) : null,
      employee_count: form.employee_count ? parseInt(form.employee_count) : null,
      annual_revenue_band: form.annual_revenue_band || null,
      website: form.website || null,
      email: form.email || null,
      phone: form.phone || null,
      address: form.address || null,
      cipc_number: form.cipc_number || null,
      bbee_level: form.bbee_level ? parseInt(form.bbee_level) : null,
      services: form.services ? form.services.split(',').map(s => s.trim()).filter(Boolean) : [],
      products: form.products ? form.products.split(',').map(s => s.trim()).filter(Boolean) : [],
      profile_completeness: 30,
    }).select().single()

    if (error) { toast.error('Failed to create business: ' + error.message); setSaving(false); return }
    toast.success('Business created!')
    router.push(`/business/${data.slug}`)
  }

  const canNext = () => {
    if (step === 0) return form.name.length > 1 && form.category && form.province
    if (step === 1) return true
    if (step === 2) return true
    return true
  }

  return (
    <div className="min-h-screen bg-ink-900 flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center">
            <Building2 size={18} className="text-ink-900" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white">New Business Profile</h1>
            <p className="text-ink-400 text-xs">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`h-1 w-full rounded-full transition-colors ${
                i < step ? 'bg-gold-500' : i === step ? 'bg-gold-400' : 'bg-ink-700'
              }`} />
              <span className={`text-xs ${i <= step ? 'text-gold-400' : 'text-ink-600'}`}>{s}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="card p-7 space-y-5">

          {/* Step 0: Basics */}
          {step === 0 && (
            <>
              <div>
                <label className="label">Business Name *</label>
                <input className="input" placeholder="e.g. Mzansi Tech Solutions" value={form.name} onChange={set('name')} required />
              </div>
              <div>
                <label className="label">Tagline</label>
                <input className="input" placeholder="One sentence that describes what you do" value={form.tagline} onChange={set('tagline')} />
              </div>
              <div>
                <label className="label">Industry *</label>
                <select className="input" value={form.category} onChange={set('category')} required>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Province *</label>
                  <select className="input" value={form.province} onChange={set('province')} required>
                    <option value="">Select province</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">City</label>
                  <input className="input" placeholder="e.g. Johannesburg" value={form.city} onChange={set('city')} />
                </div>
              </div>
            </>
          )}

          {/* Step 1: Details */}
          {step === 1 && (
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
                  <input className="input" type="number" placeholder="e.g. 2018" min="1900" max={new Date().getFullYear()}
                    value={form.founded_year} onChange={set('founded_year')} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Employees</label>
                  <input className="input" type="number" placeholder="e.g. 12" value={form.employee_count} onChange={set('employee_count')} />
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
                  <input className="input" placeholder="e.g. 2018/123456/07" value={form.cipc_number} onChange={set('cipc_number')} />
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

          {/* Step 2: Contact */}
          {step === 2 && (
            <>
              <div>
                <label className="label">Website</label>
                <input className="input" type="url" placeholder="https://yourbusiness.co.za" value={form.website} onChange={set('website')} />
              </div>
              <div>
                <label className="label">Business Email</label>
                <input className="input" type="email" placeholder="info@yourbusiness.co.za" value={form.email} onChange={set('email')} />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input className="input" type="tel" placeholder="+27 11 000 0000" value={form.phone} onChange={set('phone')} />
              </div>
              <div>
                <label className="label">Business Address</label>
                <textarea className="input resize-none" rows={3}
                  placeholder="Full street address..." value={form.address} onChange={set('address')} />
              </div>
            </>
          )}

          {/* Step 3: Services */}
          {step === 3 && (
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
                <p className="text-xs text-gold-400 font-medium mb-1">You're almost done!</p>
                <p className="text-xs text-ink-400">
                  After creating your profile, you can upload a logo, add photos, and submit for verification.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={() => step > 0 ? setStep(s => s - 1) : router.push('/dashboard')}
            className="btn-ghost gap-2">
            <ArrowLeft size={16} />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>

          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
              className="btn-primary gap-2 disabled:opacity-50">
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={saving} className="btn-primary gap-2">
              {saving ? 'Creating...' : <><Check size={16} /> Create Profile</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
