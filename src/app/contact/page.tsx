import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact — BlackBiz',
  description: 'Get in touch with the BlackBiz team.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-white mb-4">Get in touch</h1>
            <p className="text-ink-400 text-lg">We'd love to hear from you. Reach out via WhatsApp for the fastest response.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Contact info */}
            <div className="space-y-4">
              {[
                { icon: MessageSquare, label: 'WhatsApp (Fastest)', value: '+27 74 481 5163', href: 'https://wa.me/27744815163', color: 'green' },
                { icon: Mail, label: 'Email', value: 'team@businesshustle.co.za', href: 'mailto:team@businesshustle.co.za', color: 'gold' },
                { icon: Phone, label: 'Phone', value: '+27 74 481 5163', href: 'tel:+27744815163', color: 'blue' },
                { icon: MapPin, label: 'Location', value: 'Cape Town, Western Cape, South Africa', href: null, color: 'purple' },
              ].map(item => {
                const Icon = item.icon
                const colorMap: Record<string, string> = {
                  green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                  gold: 'bg-gold-500/10 border-gold-500/20 text-gold-400',
                  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                  purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
                }
                return (
                  <div key={item.label} className="card p-5 flex items-center gap-4">
                    <div className={`p-3 rounded-xl border flex-shrink-0 ${colorMap[item.color]}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-ink-500 mb-0.5">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-medium text-white hover:text-gold-400 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-sm font-medium text-white">{item.value}</div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* WhatsApp CTA */}
              <a href="https://wa.me/27744815163?text=Hi%20BlackBiz%2C%20I%27d%20like%20to%20know%20more%20about%20listing%20my%20business."
                target="_blank" rel="noopener noreferrer"
                className="btn-primary w-full justify-center py-3 mt-2">
                <MessageSquare size={16} /> Chat on WhatsApp
              </a>
            </div>

            {/* Contact form */}
            <div className="card p-7">
              <h2 className="font-display text-lg font-bold text-white mb-6">Send a message</h2>
              <form action="https://formspree.io/f/blackbiz" method="POST" className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input name="name" type="text" required className="input" placeholder="Your full name" />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input name="email" type="email" required className="input" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="label">Subject</label>
                  <select name="subject" className="input">
                    <option>List my business</option>
                    <option>Verification enquiry</option>
                    <option>Partnership opportunity</option>
                    <option>Technical support</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea name="message" required rows={4} className="input resize-none" placeholder="How can we help?" />
                </div>
                <button type="submit" className="btn-primary w-full justify-center py-3">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
