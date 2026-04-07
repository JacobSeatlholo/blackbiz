'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Radio, StopCircle, Share2, Copy, Check, Camera, CameraOff, Mic, MicOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Link from 'next/link'

const BASE_URL = 'https://www.blackbiz.co.za'
const CHUNK_INTERVAL = 2000 // 2 seconds per chunk

interface Props {
  businessSlug: string
  businessId: string
}

export default function GoLiveDashboard({ businessSlug, businessId }: Props) {
  const [phase, setPhase]           = useState<'idle' | 'preview' | 'live' | 'ended'>('idle')
  const [postId, setPostId]         = useState<string | null>(null)
  const [duration, setDuration]     = useState(0)
  const [viewers, setViewers]       = useState(0)
  const [camOn, setCamOn]           = useState(true)
  const [micOn, setMicOn]           = useState(true)
  const [copied, setCopied]         = useState(false)
  const [error, setError]           = useState<string | null>(null)

  const videoRef      = useRef<HTMLVideoElement>(null)
  const streamRef     = useRef<MediaStream | null>(null)
  const recorderRef   = useRef<MediaRecorder | null>(null)
  const chunkIndexRef = useRef(0)
  const timerRef      = useRef<NodeJS.Timeout | null>(null)
  const durationRef   = useRef<NodeJS.Timeout | null>(null)

  const supabase = createClient()

  // ── Request camera + mic ─────────────────────────────────────
 const requestPermissions = async () => {
    setError(null)
    try {
      // Check if permissions already granted
      const camPerm = await navigator.permissions.query({ name: 'camera' as PermissionName })
      const micPerm = await navigator.permissions.query({ name: 'microphone' as PermissionName })
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true
      }
      setPhase('preview')
    } catch (err: any) {
      console.error('Camera error:', err.name, err.message)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera access denied. Please allow camera and microphone access in your browser settings and refresh the page.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.')
      } else if (err.name === 'NotReadableError') {
        setError('Camera is in use by another app. Close it and try again.')
      } else {
        setError(`Could not access camera: ${err.name} — ${err.message}`)
      }
    }
  }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true // prevent echo
      }
      setPhase('preview')
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera and microphone access in your browser settings.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.')
      } else {
        setError('Could not access camera: ' + err.message)
      }
    }
  }

  // ── Start broadcasting ───────────────────────────────────────
  const startBroadcast = async () => {
    if (!streamRef.current) return

    try {
      // Create a hustle_posts record for this live stream
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { toast.error('Sign in required'); return }

      const { data: post, error: postError } = await supabase
        .from('hustle_posts')
        .insert({
          business_id: businessId,
          author_id: user.id,
          post_type: 'update',
          title: '🔴 Live Now',
          body: 'Streaming live from BlackBiz',
          is_live: true,
          tags: ['live', 'livestream'],
        })
        .select('id')
        .single()

      if (postError || !post) {
        toast.error('Failed to start stream')
        return
      }

      setPostId(post.id)
      chunkIndexRef.current = 0

      // Mark business as live
      await supabase
        .from('businesses')
        .update({ is_live: true })
        .eq('id', businessId)

      // Start MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4'

      const recorder = new MediaRecorder(streamRef.current, {
        mimeType,
        videoBitsPerSecond: 1000000, // 1Mbps
      })

      recorder.ondataavailable = async (e) => {
        if (e.data && e.data.size > 0) {
          const chunkPath = `live/${post.id}/chunk_${String(chunkIndexRef.current).padStart(6, '0')}.webm`
          chunkIndexRef.current++

          await supabase.storage
            .from('feed-videos')
            .upload(chunkPath, e.data, {
              contentType: mimeType,
              upsert: true,
            })
        }
      }

      recorder.start(CHUNK_INTERVAL)
      recorderRef.current = recorder

      setPhase('live')

      // Duration counter
      durationRef.current = setInterval(() => {
        setDuration(d => d + 1)
      }, 1000)

      // Viewer count simulation (replace with Supabase Realtime later)
      timerRef.current = setInterval(async () => {
        // Count recent views on the post
        const { count } = await supabase
          .from('hustle_posts')
          .select('view_count', { count: 'exact', head: true })
          .eq('id', post.id)
        setViewers(count ?? 0)
      }, 5000)

      toast.success('🔴 You\'re live!')

    } catch (err: any) {
      toast.error('Failed to start broadcast: ' + err.message)
    }
  }

  // ── End broadcast ────────────────────────────────────────────
  const endBroadcast = async () => {
    // Stop recorder
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }

    // Stop camera
    streamRef.current?.getTracks().forEach(t => t.stop())

    // Clear timers
    if (timerRef.current) clearInterval(timerRef.current)
    if (durationRef.current) clearInterval(durationRef.current)

    // Update DB
    if (postId) {
      await supabase.from('hustle_posts').update({ is_live: false }).eq('id', postId)
    }
    await supabase.from('businesses').update({ is_live: false }).eq('id', businessId)

    setPhase('ended')
    toast.success('Stream ended')
  }

  // ── Toggle camera ────────────────────────────────────────────
  const toggleCamera = () => {
    const track = streamRef.current?.getVideoTracks()[0]
    if (track) { track.enabled = !track.enabled; setCamOn(c => !c) }
  }

  // ── Toggle mic ───────────────────────────────────────────────
  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0]
    if (track) { track.enabled = !track.enabled; setMicOn(m => !m) }
  }

  // ── Copy share link ──────────────────────────────────────────
  const copyLink = async () => {
    if (!postId) return
    await navigator.clipboard.writeText(`${BASE_URL}/feed/${postId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Link copied!')
  }

  // ── Format duration ──────────────────────────────────────────
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
      if (timerRef.current) clearInterval(timerRef.current)
      if (durationRef.current) clearInterval(durationRef.current)
    }
  }, [])

  // ── IDLE ─────────────────────────────────────────────────────
  if (phase === 'idle') return (
    <div className="card border-red-500/20 overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-red-500 to-transparent" />
      <div className="p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <Radio size={28} className="text-red-400" />
        </div>
        <h3 className="font-display text-lg font-bold text-white mb-2">Go Live</h3>
        <p className="text-sm text-ink-400 mb-6 max-w-xs mx-auto">
          Broadcast live to the BlackBiz community directly from your browser. No apps needed.
        </p>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 mb-4 text-left">
            {error}
          </div>
        )}
        <button onClick={requestPermissions}
          className="btn-primary w-full justify-center py-3 gap-2 bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600">
          <Camera size={16} /> Enable Camera & Go Live
        </button>
        <p className="text-xs text-ink-600 mt-3">
          Your browser will ask for camera and microphone access
        </p>
      </div>
    </div>
  )

  // ── ENDED ────────────────────────────────────────────────────
  if (phase === 'ended') return (
    <div className="card border-ink-700 overflow-hidden p-6 text-center">
      <div className="text-4xl mb-3">🎬</div>
      <h3 className="font-display text-lg font-bold text-white mb-2">Stream ended</h3>
      <p className="text-sm text-ink-400 mb-4">Duration: {fmt(duration)}</p>
      {postId && (
        <div className="space-y-2">
          <Link href={`/feed/${postId}`} className="btn-secondary w-full justify-center text-sm py-2.5">
            View Stream Post →
          </Link>
          <div className="flex gap-2">
            <a href={`https://twitter.com/intent/tweet?text=I just went live on BlackBiz! Watch here:&url=${BASE_URL}/feed/${postId}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-secondary flex-1 justify-center text-xs py-2">
              Share on X
            </a>
            <a href={`https://wa.me/?text=I just streamed live on BlackBiz! Watch: ${BASE_URL}/feed/${postId}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-secondary flex-1 justify-center text-xs py-2">
              WhatsApp
            </a>
          </div>
        </div>
      )}
      <button onClick={() => { setPhase('idle'); setDuration(0); setPostId(null) }}
        className="btn-ghost w-full justify-center text-sm mt-2">
        Start new stream
      </button>
    </div>
  )

  // ── PREVIEW + LIVE ───────────────────────────────────────────
  return (
    <div className="card border-red-500/20 overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-red-500 to-transparent" />

      {/* Video preview */}
      <div className="relative bg-black aspect-video">
        <video ref={videoRef} autoPlay playsInline muted
          className="w-full h-full object-cover" />

        {/* Live indicators */}
        {phase === 'live' && (
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-red-500 px-2.5 py-1 rounded-full animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" /> LIVE
            </span>
            <span className="text-xs text-white bg-black/60 px-2 py-1 rounded-full font-mono">
              {fmt(duration)}
            </span>
          </div>
        )}

        {phase === 'preview' && (
          <div className="absolute top-3 left-3">
            <span className="text-xs text-white bg-black/60 px-2.5 py-1 rounded-full">
              Preview
            </span>
          </div>
        )}

        {/* Camera/Mic controls overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <button onClick={toggleCamera}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              camOn ? 'bg-black/60 text-white hover:bg-black/80' : 'bg-red-500 text-white'
            }`}>
            {camOn ? <Camera size={16} /> : <CameraOff size={16} />}
          </button>
          <button onClick={toggleMic}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              micOn ? 'bg-black/60 text-white hover:bg-black/80' : 'bg-red-500 text-white'
            }`}>
            {micOn ? <Mic size={16} /> : <MicOff size={16} />}
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Share link when live */}
        {phase === 'live' && postId && (
          <div className="mb-4 flex items-center gap-2 bg-ink-900 border border-ink-700 rounded-lg px-3 py-2">
            <span className="text-xs text-ink-500 truncate flex-1">
              {BASE_URL}/feed/{postId}
            </span>
            <button onClick={copyLink}
              className="text-gold-400 hover:text-gold-300 flex-shrink-0 transition-colors">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}

        {/* Action buttons */}
        {phase === 'preview' && (
          <button onClick={startBroadcast}
            className="w-full btn-primary justify-center py-3 gap-2 bg-red-500 hover:bg-red-600 border-red-500">
            <Radio size={16} /> Start Broadcasting
          </button>
        )}

        {phase === 'live' && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <a href={`https://twitter.com/intent/tweet?text=I'm live on BlackBiz! Watch:&url=${BASE_URL}/feed/${postId}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-secondary flex-1 justify-center text-xs py-2">
                Share on X
              </a>
              <a href={`https://wa.me/?text=Watch me live on BlackBiz: ${BASE_URL}/feed/${postId}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-secondary flex-1 justify-center text-xs py-2">
                WhatsApp
              </a>
            </div>
            <button onClick={endBroadcast}
              className="w-full flex items-center justify-center gap-2 text-sm text-red-400 border border-red-500/20 hover:bg-red-500/10 rounded-lg py-2.5 transition-all">
              <StopCircle size={16} /> End Stream
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
