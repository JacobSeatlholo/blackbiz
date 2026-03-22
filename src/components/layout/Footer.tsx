import Link from 'next/link'
import { Building2, Twitter, Linkedin, Instagram } from 'lucide-react'

const LINKS = {
  Platform: [
    { href: '/directory', label: 'Directory' },
    { href: '/directory?sort=rating', label: 'Top Rated' },
    { href: '/directory?verified=true', label: 'Verified Businesses' },
    { href: '/auth/register', label: 'List Your Business' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/popia', label: 'POPIA Compliance' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-ink-700 bg-ink-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center">
                <Building2 size={16} className="text-ink-900" />
              </div>
              <span className="font-display text-lg font-bold text-white">
                Black<span className="text-gold-400">Biz</span>
              </span>
            </Link>
            <p className="text-sm text-ink-400 leading-relaxed max-w-xs mb-5">
              South Africa's most powerful business intelligence platform for Black-owned SMEs.
              Discover. Verify. Connect.
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-ink-700 hover:bg-gold-500/20 hover:text-gold-400 flex items-center justify-center text-ink-400 transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-ink-300 uppercase tracking-widest mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ink-400 hover:text-gold-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} BlackBiz. Built by{' '}
            <a href="https://businesshustle.co.za" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:text-gold-400 transition-colors">
              Business Hustle
            </a>
          </p>
          <p className="text-xs text-ink-600">Empowering the new South African economy.</p>
        </div>
      </div>
    </footer>
  )
}
