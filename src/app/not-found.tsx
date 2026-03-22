import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-display text-8xl font-bold text-gold-500/20 mb-4">404</div>
        <h1 className="font-display text-3xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-ink-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/directory" className="btn-secondary">Browse Directory</Link>
        </div>
      </div>
    </div>
  )
}
