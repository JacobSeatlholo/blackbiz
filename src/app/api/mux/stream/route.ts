import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID!
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET!
const MUX_BASE = 'https://api.mux.com'

const muxAuth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64')

const muxFetch = (path: string, options: RequestInit = {}) =>
  fetch(`${MUX_BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Basic ${muxAuth}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

// POST /api/mux/stream — create a new live stream
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check verified status
    const { data: biz } = await supabase
      .from('businesses')
      .select('id, name, verification_status, stream_key, mux_stream_id, mux_playback_id')
      .eq('owner_id', user.id)
      .single()

    if (!biz) {
      return NextResponse.json({ error: 'No business found' }, { status: 404 })
    }

    if (biz.verification_status !== 'verified') {
      return NextResponse.json({ error: 'Verified members only' }, { status: 403 })
    }

    // If stream already exists, return existing keys
    if (biz.mux_stream_id && biz.stream_key) {
      // Check if stream is still active on Mux
      const statusRes = await muxFetch(`/video/v1/live-streams/${biz.mux_stream_id}`)
      const statusData = await statusRes.json()

      if (statusRes.ok) {
        return NextResponse.json({
          stream_key: biz.stream_key,
          playback_id: biz.mux_playback_id,
          stream_id: biz.mux_stream_id,
          status: statusData.data?.status,
        })
      }
    }

    // Create new Mux live stream
    const res = await muxFetch('/video/v1/live-streams', {
      method: 'POST',
      body: JSON.stringify({
        playback_policy: ['public'],
        new_asset_settings: { playback_policy: ['public'] },
        reduced_latency: true,
        metadata: {
          business_id: biz.id,
          business_name: biz.name,
          user_id: user.id,
        },
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.messages?.[0] ?? 'Mux error' }, { status: 500 })
    }

    const stream = data.data
    const streamKey = stream.stream_key
    const playbackId = stream.playback_ids?.[0]?.id
    const streamId = stream.id

    // Save to businesses table
    await supabase.from('businesses').update({
      stream_key: streamKey,
      mux_stream_id: streamId,
      mux_playback_id: playbackId,
      is_live: false,
    }).eq('id', biz.id)

    return NextResponse.json({ stream_key: streamKey, playback_id: playbackId, stream_id: streamId, status: 'idle' })

  } catch (err) {
    console.error('Stream create error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// DELETE /api/mux/stream — end a live stream
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: biz } = await supabase
      .from('businesses')
      .select('id, mux_stream_id')
      .eq('owner_id', user.id)
      .single()

    if (!biz?.mux_stream_id) {
      return NextResponse.json({ error: 'No active stream' }, { status: 404 })
    }

    // Signal stream end on Mux
    await muxFetch(`/video/v1/live-streams/${biz.mux_stream_id}/complete`, { method: 'PUT' })

    // Update DB
    await supabase.from('businesses').update({ is_live: false }).eq('id', biz.id)
    await supabase.from('hustle_posts')
      .update({ is_live: false })
      .eq('business_id', biz.id)
      .eq('is_live', true)

    return NextResponse.json({ success: true })

  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
