// Add this to the top of dashboard/page.tsx
// After the existing imports, add this snippet to handle payment success

// In the DashboardPage component, after fetching businesses, add:
// const searchParams = useSearchParams() -- but this is a server component
// Instead, handle via the URL param in a client component wrapper

// SIMPLER: Add this to the dashboard page's metadata check
// The pricing page already redirects to /dashboard?payment=success&plan=verified
// The WelcomeModal already shows on /?welcome=1
// We just need a toast on the dashboard when payment=success is in the URL

// Add this client component to src/components/ui/PaymentSuccessToast.tsx:

'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function PaymentSuccessToast() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const payment = searchParams.get('payment')
    const plan = searchParams.get('plan')

    if (payment === 'success') {
      const planLabel = plan === 'intelligence' ? 'Intelligence' : 'Verified'
      toast.success(`🎉 Welcome to BlackBiz ${planLabel}! Your profile is now verified.`, {
        duration: 6000,
      })
      // Clean URL
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [searchParams])

  return null
}
