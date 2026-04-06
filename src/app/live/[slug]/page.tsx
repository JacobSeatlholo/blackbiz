import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Shield, MapPin, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://www.blackbiz.co.za'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: biz } = await supabase
    .from('businesses')
    .select('name, city, province')
    .eq('slug', params.slug)
    .single()

  if (!biz) return { title: 'Live Stream | BlackBiz' }

  return {
    title: `🔴 ${biz.name} is Live | BlackBiz`,
    description: `Watch ${biz.name} live on BlackBiz — South Africa's Black Business Intelligence Platform`,
  }
}

export default async function LiveStreamPage({ params }: Props) {
  const supabase = createClient()

  const { data: biz } = await supabase
    .from('businesses')
    .select('id, name, slug, city, province, category, verification_status, mux_playback_id, is_live, tagline')
    .eq('slug', params.slug)
    .single()

  if (!biz || !biz.mux_playback_id) notFound()

  const hlsUrl = `https://stream.mux.com/${biz.mux_playback_id}.m3u8`
  const thumbnailUrl = `https://image.mux.com/${biz.mux_playback_id}/thumbnail.png`

  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Back */}
          <div className="py-4">
            <Link href={`/business/${biz.slug}`}
              className="flex items-center gap-2 text-sm text-ink-500 hover:text-gold-400 transition-colors">
              <ArrowLeft size={14} /> Back to {biz.name}
            </Link>
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-6">

            {/* Player */}
            <div>
              {/* Live badge */}
              {biz.is_live && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-400" /> LIVE
                  </span>
                </div>
              )}

              {/* HLS Video Player */}
              <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                {biz.is_live ? (
                  <video
                    id="live-player"
                    className="w-full h-full"
                    controls
                    autoPlay
                    playsInline
                    poster={thumbnailUrl}
                  >
                    <source src={hlsUrl} type="application/x-mpegURL" />
                    Your browser does not support HLS playback.
                  </video>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <div className="text-5xl mb-4">📡</div>
                    <h2 className="font-display text-xl font-bold text-white mb-2">
                      Stream not live yet
                    </h2>
                    <p className="text-ink-400 text-sm">
                      {biz.name} hasn't started streaming. Check back soon or follow them on BlackBiz.
                    </p>
                  </div>
                )}
              </div>

              {/* HLS.js for browser compatibility */}
              {biz.is_live && (
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      document.addEventListener('DOMContentLoaded', function() {
                        var video = document.getElementById('live-player');
                        if (video && typeof Hls !== 'undefined' && Hls.isSupported()) {
                          var hls = new Hls({ lowLatencyMode: true });
                          hls.loadSource('${hlsUrl}');
                          hls.attachMedia(video);
                        }
                      });
                    `,
                  }}
                />
              )}

              {/* Title */}
              <div className="mt-4">
                <h1 className="font-display text-2xl font-bold text-white mb-1">
                  {biz.is_live ? `🔴 ${biz.name} is Live` : `${biz.name} — Live Stream`}
                </h1>
                {biz.tagline && <p className="text-ink-400 text-sm">{biz.tagline}</p>}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">

              {/* Business card */}
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center font-display text-xl font-bold text-gold-400">
                    {biz.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display text-sm font-bold text-white">{biz.name}</h3>
                      {biz.verification_status === 'verified' && (
                        <Shield size={12} className="text-emerald-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-ink-500">
                      <MapPin size={10} /> {biz.city}, {biz.province}
                    </div>
                  </div>
                </div>
                <Link href={`/business/${biz.slug}`} className="btn-secondary w-full justify-center text-sm py-2">
                  View Business Profile →
                </Link>
              </div>

              {/* Share */}
              <div className="card p-5">
                <h3 className="font-display text-sm font-semibold text-white mb-3">Share this stream</h3>
                <div className="space-y-2">
                  <a href={`https://twitter.com/intent/tweet?text=🔴 ${encodeURIComponent(biz.name)} is live on BlackBiz!&url=${encodeURIComponent(`${BASE_URL}/live/${biz.slug}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-secondary text-xs py-2 w-full justify-center">
                    Share on X
                  </a>
                  <a href={`https://wa.me/?text=🔴 ${encodeURIComponent(biz.name)} is live on BlackBiz! Watch here: ${BASE_URL}/live/${biz.slug}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-secondary text-xs py-2 w-full justify-center">
                    Share on WhatsApp
                  </a>
                </div>
              </div>

              {/* CTA */}
              <div className="card p-5 border-gold-500/20 text-center">
                <p className="text-xs text-ink-400 mb-3">Want to go live on BlackBiz?</p>
                <Link href="/pricing" className="btn-primary text-xs py-2 w-full justify-center">
                  Upgrade to Verified →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* HLS.js CDN */}
      <script src="https://cdn.jsdelivr.net/npm/hls.js@latest" async />

      <Footer />
    </div>
  )
}
