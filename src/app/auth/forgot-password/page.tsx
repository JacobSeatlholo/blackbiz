'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={28} className="text-emerald-400" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-ink-400 mb-6">
          We sent a password reset link to{' '}
          <span className="text-gold-400">{email}</span>.
          Click the link to set a new password.
        </p>
        <Link href="/auth/login" className="btn-secondary text-sm">
          <ArrowLeft size={14} /> Back to login
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center">
              <Building2 size={18} className="text-ink-900" />
            </div>
            <span className="font-display text-xl font-bold text-white">
              Black<span className="text-gold-400">Biz</span>
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white mb-2">Reset your password</h1>
          <p className="text-ink-400 text-sm">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="card p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-9"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link href="/auth/login" className="text-sm text-ink-500 hover:text-gold-400 transition-colors flex items-center justify-center gap-1.5">
              <ArrowLeft size={13} /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
