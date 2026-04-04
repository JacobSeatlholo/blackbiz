import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY!

const PLANS: Record<string, string> = {
  verified: 'verified',
  intelligence: 'verified',
}

export async function POST(req: NextRequest) {
  try {
    const { token, amountInCents, currency, user_id, business_id, plan } = await req.json()

    if (!token || !amountInCents || !user_id || !plan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Charge via Yoco API
    const chargeRes = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'X-Auth-Secret-Key': YOCO_SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        amountInCents,
        currency: currency ?? 'ZAR',
        metadata: { user_id, business_id, plan },
      }),
    })

    const charge = await chargeRes.json()

    if (charge.status !== 'successful') {
      return NextResponse.json(
        { error: charge.displayMessage ?? 'Payment failed' },
        { status: 400 }
      )
    }

    // Payment successful — upgrade the business
    const supabase = createClient()

    const { error } = await supabase
      .from('businesses')
      .update({
        verification_status: PLANS[plan],
        subscription_tier: plan,
        subscription_start: new Date().toISOString(),
        subscription_payment_id: charge.id,
      })
      .eq('owner_id', user_id)

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log payment
    await supabase.from('payments').insert({
      user_id,
      business_id: business_id ?? null,
      payment_id: charge.id,
      plan,
      amount_cents: amountInCents,
      currency: currency ?? 'ZAR',
      status: 'succeeded',
    })

    return NextResponse.json({ success: true, charge_id: charge.id })

  } catch (err) {
    console.error('Charge error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
