'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.en
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with auto-detection
  const getInitialLanguage = (): Language => {
    // Server-side rendering safe check
    if (typeof window === 'undefined') return 'fr'
    
    // Check localStorage first for saved preference
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
      return savedLang
    }
    
    // Auto-detect from browser language
    const browserLang = navigator.language.toLowerCase()
    
    // Check for French-speaking regions
    if (browserLang.startsWith('fr') || 
        browserLang.includes('fr-') ||
        browserLang === 'fr-fr' || 
        browserLang === 'fr-ca' || 
        browserLang === 'fr-be' || 
        browserLang === 'fr-ch') {
      return 'fr'
    }
    
    // Default to English for all other languages
    return 'en'
  }

  const [language, setLanguage] = useState<Language>(getInitialLanguage)

  useEffect(() => {
    // Update language on client side if needed
    const detectedLang = getInitialLanguage()
    if (detectedLang !== language) {
      setLanguage(detectedLang)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}