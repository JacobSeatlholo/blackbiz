'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Building2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { toast.error('Passwords do not match'); return }
    if (password.length < 8)  { toast.error('Password must be at least 8 characters'); return }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      toast.error(error.message)
    } else {
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 2500)
    }
    setLoading(false)
  }

  if (done) return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={28} className="text-emerald-400" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white mb-2">Password updated!</h1>
        <p className="text-ink-400">Redirecting you to your dashboard…</p>
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
          <h1 className="font-display text-2xl font-bold text-white mb-2">Set new password</h1>
          <p className="text-ink-400 text-sm">Choose a strong password for your account</p>
        </div>

        <div className="card p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required minLength={8}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="input pl-9 pr-10"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required minLength={8}
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  className="input pl-9"
                />
              </div>
            </div>
            {password && confirm && password !== confirm && (
              <p className="text-xs text-red-400">Passwords do not match</p>
            )}
            <button type="submit"
              disabled={loading || !password || !confirm || password !== confirm}
              className="btn-primary w-full justify-center py-3 disabled:opacity-50">
              {loading ? 'Updating…' : 'Set New Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
