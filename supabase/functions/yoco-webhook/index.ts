import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const YOCO_SECRET_KEY = Deno.env.get('YOCO_SECRET_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const PLANS: Record<string, { tier: string; status: string }> = {
  'verified':     { tier: 'verified',     status: 'verified' },
  'intelligence': { tier: 'intelligence', status: 'verified' },
}

serve(async (req) => {
  try {
    const body = await req.json()
    console.log('Yoco webhook received:', JSON.stringify(body))

    const { type, payload } = body

    // Only process successful payments
    if (type !== 'payment.succeeded') {
      return new Response(JSON.stringify({ received: true }), { status: 200 })
    }

    const { id: paymentId, metadata, amount_in_cents, currency } = payload

    // Metadata passed from checkout: { user_id, plan, business_id }
    const { user_id, plan, business_id } = metadata ?? {}

    if (!user_id || !plan) {
      console.error('Missing metadata:', { user_id, plan })
      return new Response(JSON.stringify({ error: 'Missing metadata' }), { status: 400 })
    }

    const planConfig = PLANS[plan]
    if (!planConfig) {
      console.error('Unknown plan:', plan)
      return new Response(JSON.stringify({ error: 'Unknown plan' }), { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Update business verification status and subscription tier
    const { error: bizError } = await supabase
      .from('businesses')
      .update({
        verification_status: planConfig.status,
        subscription_tier: planConfig.tier,
        subscription_start: new Date().toISOString(),
        subscription_payment_id: paymentId,
      })
      .eq('owner_id', user_id)

    if (bizError) {
      console.error('Business update error:', bizError)
      return new Response(JSON.stringify({ error: bizError.message }), { status: 500 })
    }

    // Log the payment
    await supabase.from('payments').insert({
      user_id,
      business_id: business_id ?? null,
      payment_id: paymentId,
      plan,
      amount_cents: amount_in_cents,
      currency,
      status: 'succeeded',
      created_at: new Date().toISOString(),
    })

    console.log(`✅ Upgraded user ${user_id} to ${plan}`)
    return new Response(JSON.stringify({ success: true }), { status: 200 })

  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
