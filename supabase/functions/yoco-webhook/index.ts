import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const PLAN_STATUS: Record<string, string> = {
  verified:     'verified',
  intelligence: 'verified',
}

serve(async (req) => {
  try {
    const body = await req.json()
    console.log('Yoco webhook:', JSON.stringify(body))

    const { type, payload } = body

    // New Yoco Checkout API event
    if (type !== 'checkout.completed' && type !== 'payment.succeeded') {
      return new Response(JSON.stringify({ received: true }), { status: 200 })
    }

    // Extract metadata from checkout
    const metadata = payload?.metadata ?? payload?.checkout?.metadata ?? {}
    const { user_id, business_id, plan } = metadata

    if (!user_id || !plan) {
      console.error('Missing metadata:', metadata)
      return new Response(JSON.stringify({ error: 'Missing metadata' }), { status: 400 })
    }

    const verificationStatus = PLAN_STATUS[plan]
    if (!verificationStatus) {
      return new Response(JSON.stringify({ error: 'Unknown plan' }), { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Upgrade business
    const { error } = await supabase
      .from('businesses')
      .update({
        verification_status: verificationStatus,
        subscription_tier: plan,
        subscription_start: new Date().toISOString(),
        subscription_payment_id: payload?.id ?? payload?.paymentId ?? null,
      })
      .eq('owner_id', user_id)

    if (error) {
      console.error('Upgrade error:', error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    // Log payment
    await supabase.from('payments').insert({
      user_id,
      business_id: business_id || null,
      payment_id: payload?.id ?? 'unknown',
      plan,
      amount_cents: payload?.amount ?? payload?.amountInCents ?? 0,
      currency: 'ZAR',
      status: 'succeeded',
    })

    console.log(`✅ Upgraded ${user_id} to ${plan}`)
    return new Response(JSON.stringify({ success: true }), { status: 200 })

  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
