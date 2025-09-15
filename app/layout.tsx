import { Inter } from 'next/font/google'

import Navigation from '@/components/Navigation'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AnalyticsProvider } from '@/components/AnalyticsProvider'

import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Gomory - Advanced Cutting Stock Optimizer | Two-Stage Guillotine Algorithm',
  description:
    'Professional cutting optimization tool using two-stage guillotine algorithm with NFDH heuristic. Minimize waste, reduce cuts, and optimize material usage for woodworking, metalworking, glass cutting, and industrial manufacturing. Free online tool with PDF export.',
  keywords:
    'cutting optimizer, guillotine cutting, cutting stock problem, material optimization, wood cutting, panel cutting, NFDH algorithm, Gomory algorithm, board optimization, waste minimization, cutting plan generator, woodworking calculator, sheet optimization, material calculator, cut list optimizer, panel saw optimizer, cutting diagram, manufacturing optimization',
  authors: [{ name: 'rmzlb', url: 'https://github.com/rmzlb' }],
  creator: 'rmzlb',
  publisher: 'rmzlb',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://gomory-optimizer.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Gomory - Professional Cutting Stock Optimizer',
    description:
      'Advanced two-stage guillotine cutting algorithm for optimal material usage. Minimize waste and cuts with our free online tool.',
    url: 'https://gomory-optimizer.vercel.app',
    siteName: 'Gomory Optimizer',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Gomory Cutting Optimizer - Optimize your cutting plans',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gomory - Cutting Stock Optimizer',
    description:
      'Professional cutting optimization with two-stage guillotine algorithm. Free online tool.',
    images: ['/og-image.png'],
    creator: '@rmzlb',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  applicationName: 'Gomory Optimizer',
  referrer: 'origin-when-cross-origin',
  category: 'technology',
  classification: 'Industrial Software, Manufacturing Tools, Optimization Software',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-white text-neutral-900">
        <LanguageProvider>
          <Navigation />
          <main className="pt-14">{children}</main>
        </LanguageProvider>
        <AnalyticsProvider />
      </body>
    </html>
  )
}
