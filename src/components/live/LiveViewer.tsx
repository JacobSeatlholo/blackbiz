'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  postId: string
  isLive: boolean
}

export default function LiveViewer({ postId, isLive }: Props) {
  const videoRef    = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<'waiting' | 'playing' | 'ended'>('waiting')
  const sourceRef   = useRef<MediaSource | null>(null)
  const bufferRef   = useRef<SourceBuffer | null>(null)
  const chunkQueue  = useRef<ArrayBuffer[]>([])
  const chunkIndex  = useRef(0)
  const polling     = useRef<NodeJS.Timeout | null>(null)
  const supabase    = createClient()

  const appendNextChunk = () => {
    if (!bufferRef.current || bufferRef.current.updating) return
    if (chunkQueue.current.length === 0) return
    const chunk = chunkQueue.current.shift()!
    try {
      bufferRef.current.appendBuffer(chunk)
    } catch (e) {
      console.warn('Buffer append error:', e)
    }
  }

  const fetchChunk = async (index: number) => {
    const path = `live/${postId}/chunk_${String(index).padStart(6, '0')}.webm`
    const { data, error } = await supabase.storage
      .from('feed-videos')
      .download(path)
    if (error || !data) return false
    const buffer = await data.arrayBuffer()
    chunkQueue.current.push(buffer)
    appendNextChunk()
    return true
  }

  useEffect(() => {
    if (!isLive) { setStatus('ended'); return }
    if (!('MediaSource' in window)) return

    const ms = new MediaSource()
    sourceRef.current = ms
    if (videoRef.current) videoRef.current.src = URL.createObjectURL(ms)

    ms.addEventListener('sourceopen', () => {
      const mimeType = 'video/webm;codecs=vp9'
      try {
        const sb = ms.addSourceBuffer(mimeType)
        bufferRef.current = sb
        sb.addEventListener('updateend', appendNextChunk)
        setStatus('playing')

        // Poll for new chunks
        polling.current = setInterval(async () => {
          const found = await fetchChunk(chunkIndex.current)
          if (found) chunkIndex.current++
        }, 2000)

      } catch (e) {
        console.error('SourceBuffer error:', e)
      }
    })

    return () => {
      if (polling.current) clearInterval(polling.current)
    }
  }, [postId, isLive])

  if (!isLive) return (
    <div className="aspect-video bg-ink-900 rounded-xl flex items-center justify-center border border-ink-700">
      <div className="text-center">
        <div className="text-4xl mb-3">📴</div>
        <p className="text-ink-400 text-sm">Stream has ended</p>
      </div>
    </div>
  )

  return (
    <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
      {status === 'waiting' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white text-sm">Connecting to stream…</p>
          </div>
        </div>
      )}
      <video ref={videoRef} autoPlay playsInline controls
        className="w-full h-full object-cover" />
      {status === 'playing' && (
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-red-500 px-2.5 py-1 rounded-full animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white" /> LIVE
          </span>
        </div>
      )}
    </div>
  )
}
