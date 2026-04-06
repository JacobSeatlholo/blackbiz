'use client'

import { useState } from 'react'
import { Radio, Copy, Check, ExternalLink, StopCircle, Wifi } from 'lucide-react'
import toast from 'react-hot-toast'

const RTMP_URL = 'rtmps://global-live.mux.com:443/app'

interface StreamInfo {
  stream_key: string
  playback_id: string
  stream_id: string
  status: string
}

export default function GoLiveDashboard() {
  const [loading, setLoading]       = useState(false)
  const [stream, setStream]         = useState<StreamInfo | null>(null)
  const [isLive, setIsLive]         = useState(false)
  const [copiedKey, setCopiedKey]   = useState(false)
  const [copiedUrl, setCopiedUrl]   = useState(false)

  const handleGoLive = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/mux/stream', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Failed to create stream')
        return
      }

      setStream(data)
      toast.success('Stream created! Connect OBS or your streaming app.')
    } catch {
      toast.error('Failed to connect to streaming service')
    } finally {
      setLoading(false)
    }
  }

  const handleEndStream = async () => {
    if (!confirm('End your live stream?')) return
    setLoading(true)
    try {
      await fetch('/api/mux/stream', { method: 'DELETE' })
      setStream(null)
      setIsLive(false)
      toast.success('Stream ended')
    } catch {
      toast.error('Failed to end stream')
    } finally {
      setLoading(false)
    }
  }

  const copy = async (text: string, type: 'key' | 'url') => {
    await navigator.clipboard.writeText(text)
    if (type === 'key') { setCopiedKey(true); setTimeout(() => setCopiedKey(false), 2000) }
    else { setCopiedUrl(true); setTimeout(() => setCopiedUrl(false), 2000) }
    toast.success('Copied!')
  }

  return (
    <div className="card border-red-500/20 overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-red-500 to-transparent" />
      <div className="p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Radio size={18} className="text-red-400" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">Go Live</h3>
              <p className="text-xs text-ink-500">Broadcast to the BlackBiz community</p>
            </div>
          </div>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> LIVE
            </span>
          )}
        </div>

        {!stream ? (
          <>
            {/* How it works */}
            <div className="bg-ink-800 rounded-xl p-4 mb-5">
              <p className="text-xs text-ink-400 font-semibold mb-3">How to go live:</p>
              {[
                ['1', 'Click "Create Stream" below to get your stream key'],
                ['2', 'Open OBS Studio or any RTMP app on your device'],
                ['3', 'Paste the RTMP URL and stream key into your app'],
                ['4', 'Click "Start Streaming" in OBS — you\'re live on BlackBiz!'],
              ].map(([num, step]) => (
                <div key={num} className="flex gap-3 mb-2 last:mb-0">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {num}
                  </span>
                  <p className="text-xs text-ink-400 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            <button onClick={handleGoLive} disabled={loading}
              className="btn-primary w-full justify-center py-3 gap-2 bg-red-500 hover:bg-red-600 border-red-500">
              <Radio size={16} />
              {loading ? 'Setting up stream…' : 'Create Stream'}
            </button>

            {/* OBS download link */}
            <p className="text-center text-xs text-ink-600 mt-3">
              Don't have OBS?{' '}
              <a href="https://obsproject.com" target="_blank" rel="noopener noreferrer"
                className="text-gold-400 hover:underline">
                Download free →
              </a>
            </p>
          </>
        ) : (
          <>
            {/* Stream credentials */}
            <div className="space-y-3 mb-5">
              {/* RTMP URL */}
              <div>
                <label className="text-xs text-ink-500 font-medium mb-1.5 block">RTMP URL</label>
                <div className="flex items-center gap-2 bg-ink-800 border border-ink-700 rounded-lg px-3 py-2.5">
                  <Wifi size={13} className="text-ink-500 flex-shrink-0" />
                  <code className="text-xs text-ink-300 flex-1 truncate">{RTMP_URL}</code>
                  <button onClick={() => copy(RTMP_URL, 'url')}
                    className="text-ink-500 hover:text-gold-400 transition-colors flex-shrink-0">
                    {copiedUrl ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Stream Key */}
              <div>
                <label className="text-xs text-ink-500 font-medium mb-1.5 block">Stream Key</label>
                <div className="flex items-center gap-2 bg-ink-800 border border-ink-700 rounded-lg px-3 py-2.5">
                  <code className="text-xs text-ink-300 flex-1 truncate">
                    {stream.stream_key.slice(0, 8)}••••••••••••••••••
                  </code>
                  <button onClick={() => copy(stream.stream_key, 'key')}
                    className="text-ink-500 hover:text-gold-400 transition-colors flex-shrink-0">
                    {copiedKey ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="text-xs text-red-400/70 mt-1">⚠️ Keep this private — never share your stream key</p>
              </div>
            </div>

            {/* Live preview link */}
            <a
              href={`https://stream.mux.com/${stream.playback_id}.m3u8`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-gold-400 hover:underline mb-5">
              <ExternalLink size={12} /> Preview your stream →
            </a>

            {/* Status */}
            <div className="bg-ink-800 rounded-xl p-4 mb-5 text-center">
              <div className={`text-sm font-semibold mb-1 ${isLive ? 'text-red-400' : 'text-ink-400'}`}>
                {isLive ? '🔴 You are live!' : '⏳ Waiting for stream connection…'}
              </div>
              <p className="text-xs text-ink-600">
                {isLive
                  ? 'Your stream is visible on your business profile'
                  : 'Start streaming in OBS to go live'}
              </p>
            </div>

            {/* End stream */}
            <button onClick={handleEndStream} disabled={loading}
              className="btn-secondary w-full justify-center py-3 gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10">
              <StopCircle size={16} />
              {loading ? 'Ending stream…' : 'End Stream'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
