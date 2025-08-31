'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/Logo'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion, AnimatePresence } from 'motion/react'

export default function Navigation() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/optimizer', label: t.nav.optimizer },
    { href: '/history', label: t.nav.history },
    { href: '/methodology', label: t.nav.methodology },
  ]

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Logo size={24} className="text-neutral-900" />
              <span className="font-mono text-sm">Gomory</span>
            </Link>

            {/* Desktop Navigation Links */}
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

            {/* Right side actions */}
            <div className="flex items-center gap-3">
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
              
              {/* GitHub Link - hidden on mobile */}
              <a
                href="https://github.com/rmzlb/gomory"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                <motion.svg
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  className="w-5 h-5 text-neutral-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </motion.svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="sm:hidden fixed inset-0 bg-black/20 z-40 mt-14"
            />
            
            {/* Menu panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="sm:hidden fixed right-0 top-14 bottom-0 w-64 bg-white border-l border-neutral-200 z-50 shadow-xl"
            >
              <div className="p-6 space-y-4">
                {/* Navigation links */}
                <div className="space-y-3">
                  {links.map((link) => {
                    const isActive = pathname === link.href
                    
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMobileMenu}
                        className={`block font-mono text-sm py-2 px-3 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-neutral-100 text-neutral-900' 
                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                        }`}
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-200 pt-4">
                  {/* GitHub link */}
                  <a
                    href="https://github.com/rmzlb/gomory"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 font-mono text-sm py-2 px-3 rounded-lg
                             text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                </div>

                {/* Footer info */}
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-xs text-neutral-500 font-mono">
                    v1.0.0 • MIT License
                  </p>
                  <p className="text-xs text-neutral-500 font-mono mt-1">
                    Made by @rmzlb
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}