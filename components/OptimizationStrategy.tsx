'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'

export type CuttingStrategy = 'auto' | 'vertical-first' | 'horizontal-first' | 'two-columns'
export type OptimizationPriority = 'cuts' | 'waste' | 'balanced'

interface OptimizationStrategyProps {
  strategy: CuttingStrategy
  priority: OptimizationPriority
  onStrategyChange: (strategy: CuttingStrategy) => void
  onPriorityChange: (priority: OptimizationPriority) => void
  showAdvanced?: boolean
}

export default function OptimizationStrategy({
  strategy,
  priority,
  onStrategyChange,
  onPriorityChange,
  showAdvanced = false
}: OptimizationStrategyProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const strategies = [
    {
      value: 'auto' as CuttingStrategy,
      label: 'Auto',
      description: 'Sélection automatique de la meilleure stratégie',
      icon: '🤖'
    },
    {
      value: 'vertical-first' as CuttingStrategy,
      label: 'Vertical-First',
      description: 'Colonnes verticales puis bandes horizontales',
      icon: '↕️'
    },
    {
      value: 'horizontal-first' as CuttingStrategy,
      label: 'Horizontal-First',
      description: 'Bandes horizontales puis coupes verticales',
      icon: '↔️'
    },
    {
      value: 'two-columns' as CuttingStrategy,
      label: 'Two-Columns',
      description: 'Optimisation avec exactement 2 colonnes',
      icon: '⚖️'
    }
  ]

  const priorities = [
    {
      value: 'cuts' as OptimizationPriority,
      label: 'Minimiser coupes',
      description: 'Réduit le nombre total de coupes',
      icon: '✂️'
    },
    {
      value: 'waste' as OptimizationPriority,
      label: 'Minimiser chutes',
      description: 'Maximise l\'utilisation du matériau',
      icon: '📐'
    },
    {
      value: 'balanced' as OptimizationPriority,
      label: 'Équilibré',
      description: 'Balance entre coupes et chutes',
      icon: '⚖️'
    }
  ]

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left group"
        type="button"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center text-sm">
            ⚙️
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-900">
              Stratégie d'optimisation
            </h3>
            <p className="text-xs text-neutral-500">
              {strategies.find(s => s.value === strategy)?.label} • {priorities.find(p => p.value === priority)?.label}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-neutral-400 group-hover:text-neutral-600"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {/* Strategy Selection */}
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-2">
                  Stratégie de découpe
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {strategies.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => onStrategyChange(s.value)}
                      className={`
                        p-3 rounded-lg border transition-all text-left
                        ${strategy === s.value 
                          ? 'border-neutral-900 bg-neutral-50' 
                          : 'border-neutral-200 hover:border-neutral-400'
                        }
                      `}
                      type="button"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{s.icon}</span>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-neutral-900">
                            {s.label}
                          </div>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            {s.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Selection */}
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-2">
                  Priorité d'optimisation
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {priorities.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => onPriorityChange(p.value)}
                      className={`
                        p-2 rounded-lg border transition-all text-center
                        ${priority === p.value 
                          ? 'border-neutral-900 bg-neutral-50' 
                          : 'border-neutral-200 hover:border-neutral-400'
                        }
                      `}
                      type="button"
                    >
                      <div className="text-lg mb-1">{p.icon}</div>
                      <div className="text-xs font-medium text-neutral-900">
                        {p.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Info */}
              {showAdvanced && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600">💡</span>
                    <div className="text-xs text-amber-800">
                      <strong>Conseil:</strong> Pour des pièces répétitives de même largeur, 
                      utilisez "Two-Columns" avec "Minimiser coupes" pour éviter les coupes 
                      de fermeture inutiles.
                    </div>
                  </div>
                </div>
              )}

              {/* Strategy Comparison (if auto selected) */}
              {strategy === 'auto' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-neutral-50 rounded-lg p-3"
                >
                  <div className="text-xs text-neutral-600">
                    <div className="font-medium mb-1">Mode automatique activé</div>
                    <div>
                      L'algorithme testera plusieurs stratégies et sélectionnera celle qui :
                    </div>
                    <ul className="mt-1 space-y-0.5 ml-3">
                      <li>• Minimise le nombre de coupes</li>
                      <li>• Maximise l'utilisation du matériau</li>
                      <li>• Optimise le temps de découpe</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}