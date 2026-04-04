import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY!
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.blackbiz.co.za'

const PLAN_AMOUNTS: Record<string, number> = {
  verified:     29900, // R299 in cents
  intelligence: 99900, // R999 in cents
}

export async function POST(req: NextRequest) {
  try {
    const { plan, user_id, business_id, business_name } = await req.json()

    if (!plan || !user_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const amount = PLAN_AMOUNTS[plan]
    if (!amount) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Create Yoco checkout session
    const res = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOCO_SECRET_KEY}`,
        'Idempotency-Key': `${user_id}-${plan}-${Date.now()}`,
      },
      body: JSON.stringify({
        amount,
        currency: 'ZAR',
        successUrl: `${BASE_URL}/dashboard?payment=success&plan=${plan}`,
        cancelUrl: `${BASE_URL}/pricing?payment=cancelled`,
        failureUrl: `${BASE_URL}/pricing?payment=failed`,
        metadata: {
          user_id,
          business_id: business_id ?? '',
          plan,
          business_name: business_name ?? '',
        },
      }),
    })

    const checkout = await res.json()

    if (!res.ok) {
      console.error('Yoco checkout error:', checkout)
      return NextResponse.json(
        { error: checkout.message ?? 'Failed to create checkout' },
        { status: res.status }
      )
    }

    // Return redirect URL to client
    return NextResponse.json({
      success: true,
      redirectUrl: checkout.redirectUrl,
      checkoutId: checkout.id,
    })

  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
