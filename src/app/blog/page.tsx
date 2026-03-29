import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { BookOpen, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog — BlackBiz',
  description: 'Insights, guides and stories from the BlackBiz community.',
}

const COMING_SOON = [
  { tag: 'Guide', title: 'How to get CIPC verified on BlackBiz in 48 hours', desc: 'A step-by-step walkthrough of the verification process and what documents you need.' },
  { tag: 'Intelligence', title: 'The R500B gap: Why Black SMEs are still locked out of capital', desc: 'We break down the data behind South Africa\'s SME funding crisis and what\'s changing.' },
  { tag: 'Community', title: '10 Black-owned businesses that dominated their sectors in 2025', desc: 'Celebrating the businesses setting the standard for Black excellence in South Africa.' },
  { tag: 'How-to', title: 'Writing a business profile that wins procurement contracts', desc: 'What procurement officers actually look for — and how to make your profile irresistible.' },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-medium mb-6">
              <BookOpen size={12} /> Coming Soon
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              BlackBiz Blog
            </h1>
            <p className="text-ink-400 text-lg max-w-xl mx-auto">
              Insights, guides, intelligence and stories from South Africa's Black business community. Launching soon.
            </p>
          </div>

          {/* Upcoming articles */}
          <div className="space-y-4 mb-12">
            {COMING_SOON.map(post => (
              <div key={post.title} className="card p-6 opacity-70">
                <div className="flex items-start gap-4">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 flex-shrink-0 mt-0.5">
                    {post.tag}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-white mb-1">{post.title}</h3>
                    <p className="text-ink-500 text-sm">{post.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-ink-600 flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>

          {/* Subscribe */}
          <div className="card p-8 text-center border-gold-500/20">
            <h2 className="font-display text-xl font-bold text-white mb-3">Get notified when we launch</h2>
            <p className="text-ink-400 text-sm mb-6">Be the first to read guides, intelligence reports and community stories.</p>
            <form className="flex gap-3 max-w-md mx-auto">
              <input type="email" placeholder="your@email.com" className="input flex-1 text-sm" />
              <button type="submit" className="btn-primary text-sm px-5 flex-shrink-0">Notify me</button>
            </form>
            <p className="text-ink-600 text-xs mt-4">No spam. Unsubscribe anytime.</p>
          </div>

          <div className="text-center mt-8">
            <p className="text-ink-500 text-sm">In the meantime, join the conversation on the{' '}
              <Link href="/feed" className="text-gold-400 hover:underline">Hustle Feed →</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
