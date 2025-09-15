'use client'

import { Analytics } from '@vercel/analytics/react'

export function AnalyticsProvider() {
  return (
    <Analytics
      mode={process.env.NODE_ENV === 'production' ? 'production' : 'development'}
      debug={process.env.NODE_ENV === 'development'}
    />
  )
}
