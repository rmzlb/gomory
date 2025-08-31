'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function HowItWorks() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-amber-50 via-orange-50 to-white rounded-2xl border border-amber-200 p-4 sm:p-5 mb-6"
    >
      {/* Header with toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
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
          className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-6 space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900 mb-1">Configurez votre planche</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Entrez les dimensions de votre planche (largeur × hauteur) et l'épaisseur de trait de scie. 
                    Activez la rotation si vos pièces peuvent être tournées.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Panneau de gauche
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900 mb-1">Ajoutez vos pièces</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Définissez chaque type de pièce avec ses dimensions (L × H) et la quantité désirée. 
                    Utilisez le bouton "+" pour ajouter de nouveaux types.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Section "Pièces à découper"
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900 mb-1">Lancez l'optimisation</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Cliquez sur "Optimiser la découpe" pour calculer le placement optimal. 
                    Le résultat s'affiche avec un plan détaillé et les statistiques.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 text-xs bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 px-3 py-1.5 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Résultats instantanés
                  </div>
                </div>
              </div>

              {/* Tips section */}
              <div className="mt-6 p-4 bg-gradient-to-r from-neutral-50 to-white rounded-xl border border-neutral-200">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-neutral-900 mb-1">Astuces</h5>
                    <ul className="text-xs text-neutral-600 space-y-1">
                      <li>• Utilisez le <span className="font-medium">zoom</span> pour mieux voir les détails</li>
                      <li>• Exportez le plan en <span className="font-medium">PDF</span> pour l'atelier</li>
                      <li>• L'algorithme <span className="font-medium">minimise automatiquement</span> les coupes et les chutes</li>
                      <li>• Sur mobile, l'écran <span className="font-medium">défile automatiquement</span> vers les résultats</li>
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