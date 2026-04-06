import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    console.log('Mux webhook:', type)

    const supabase = createClient()

    if (type === 'video.live_stream.active') {
      // Stream went live
      await supabase
        .from('businesses')
        .update({ is_live: true })
        .eq('mux_stream_id', data.id)

      // Update related hustle post if exists
      await supabase
        .from('hustle_posts')
        .update({ is_live: true })
        .eq('is_live', false)
        .contains('tags', ['livestream'])

    } else if (
      type === 'video.live_stream.idle' ||
      type === 'video.live_stream.disconnected'
    ) {
      // Stream ended
      await supabase
        .from('businesses')
        .update({ is_live: false })
        .eq('mux_stream_id', data.id)

      await supabase
        .from('hustle_posts')
        .update({ is_live: false })
        .eq('is_live', true)
    }

    return NextResponse.json({ received: true })

  } catch (err) {
    console.error('Mux webhook error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
