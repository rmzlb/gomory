'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/Logo'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion } from 'motion/react'

export default function Navigation() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/optimizer', label: t.nav.optimizer },
    { href: '/history', label: t.nav.history },
    { href: '/methodology', label: t.nav.methodology },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Logo size={24} className="text-neutral-900" />
            <span className="font-mono text-sm">Gomory</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-6">
            {links.map((link) => {
              const isActive = pathname === link.href
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-mono text-xs transition-colors ${
                    isActive 
                      ? 'text-neutral-900' 
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Language Toggle & GitHub */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="font-mono text-xs px-3 py-1.5 border border-neutral-300 
                       hover:border-neutral-900 transition-colors rounded"
              aria-label="Toggle language"
            >
              {language === 'en' ? 'FR' : 'EN'}
            </motion.button>
            
            {/* GitHub Link */}
            <a
              href="https://github.com/rmzlb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}