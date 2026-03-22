'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Building2, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const navLinks = [
    { href: '/directory', label: 'Directory' },
    { href: '/directory?sort=rating', label: 'Top Rated' },
    { href: '/directory?verified=true', label: 'Verified' },
  ]

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-ink-900/95 backdrop-blur-md border-b border-ink-700' : 'bg-transparent'
    )}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center group-hover:bg-gold-400 transition-colors">
              <Building2 size={16} className="text-ink-900" />
            </div>
            <span className="font-display text-lg font-bold text-white">
              Black<span className="text-gold-400">Biz</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'btn-ghost text-sm',
                  pathname === link.href && 'text-gold-400 bg-gold-500/10'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/directory" className="btn-ghost">
              <Search size={16} /> Search
            </Link>
            {user ? (
              <Link href="/dashboard" className="btn-primary py-2 text-sm">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost text-sm">Sign In</Link>
                <Link href="/auth/register" className="btn-primary py-2 text-sm">
                  List Business
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden btn-ghost p-2"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-ink-800 border-t border-ink-700 px-4 py-4 space-y-1">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className="block py-2.5 px-3 text-ink-300 hover:text-white hover:bg-ink-700 rounded-lg text-sm transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-ink-700 flex flex-col gap-2">
            {user ? (
              <Link href="/dashboard" onClick={() => setOpen(false)} className="btn-primary text-center">Dashboard</Link>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setOpen(false)} className="btn-secondary text-center">Sign In</Link>
                <Link href="/auth/register" onClick={() => setOpen(false)} className="btn-primary text-center">List Business</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
