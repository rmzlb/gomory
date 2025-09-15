'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'

import { analytics } from '@/lib/analytics'

export default function HowItWorks() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-white p-4 sm:p-5"
    >
      {/* Header with toggle */}
      <button
        onClick={() => {
          const newExpanded = !isExpanded
          setIsExpanded(newExpanded)

          // Track when methodology is viewed (expanded)
          if (newExpanded) {
            analytics.methodologyViewed()
          }
        }}
        className="group flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white">
            ?
          </div>
          <div className="text-left">
            <h3 className="text-base font-medium text-neutral-900">Comment utiliser l'outil</h3>
            <p className="text-sm text-neutral-600">
              {isExpanded ? 'Cliquez pour masquer' : '3 étapes simples - Cliquez pour voir'}
            </p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="rounded-lg p-1.5 transition-colors hover:bg-white/50"
        >
          <svg
            className="h-5 w-5 text-neutral-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-bold text-white">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 font-medium text-neutral-900">Configurez votre planche</h4>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    Entrez les dimensions de votre planche (largeur × hauteur) et l'épaisseur de
                    trait de scie. Activez la rotation si vos pièces peuvent être tournées.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs text-blue-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Panneau de gauche
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-sm font-bold text-white">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 font-medium text-neutral-900">Ajoutez vos pièces</h4>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    Définissez chaque type de pièce avec ses dimensions (L × H) et la quantité
                    désirée. Utilisez le bouton "+" pour ajouter de nouveaux types.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-xs text-green-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Section "Pièces à découper"
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-sm font-bold text-white">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 font-medium text-neutral-900">Lancez l'optimisation</h4>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    Cliquez sur "Optimiser la découpe" pour calculer le placement optimal. Le
                    résultat s'affiche avec un plan détaillé et les statistiques.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 text-xs text-orange-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Résultats instantanés
                  </div>
                </div>
              </div>

              {/* Tips section */}
              <div className="mt-6 rounded-xl border border-neutral-200 bg-gradient-to-r from-neutral-50 to-white p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <h5 className="mb-1 text-sm font-medium text-neutral-900">Astuces</h5>
                    <ul className="space-y-1 text-xs text-neutral-600">
                      <li>
                        • Utilisez le <span className="font-medium">zoom</span> pour mieux voir les
                        détails
                      </li>
                      <li>
                        • Exportez le plan en <span className="font-medium">PDF</span> pour
                        l'atelier
                      </li>
                      <li>
                        • L'algorithme <span className="font-medium">minimise automatiquement</span>{' '}
                        les coupes et les chutes
                      </li>
                      <li>
                        • Sur mobile, l'écran{' '}
                        <span className="font-medium">défile automatiquement</span> vers les
                        résultats
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
