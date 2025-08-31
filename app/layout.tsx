import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import { LanguageProvider } from '@/contexts/LanguageContext'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Gomory - Cutting Optimizer',
  description: 'Board cutting optimization with Gomory algorithm',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-white text-neutral-900">
        <LanguageProvider>
          <Navigation />
          <main className="pt-14">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  )
}