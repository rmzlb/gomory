'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'

interface BoardInputProps {
  boardWidth: number
  boardHeight: number
  kerf: number
  allowRotate: boolean
  forceTwoColumns: boolean
  objective?: 'waste' | 'cuts' | 'balanced'
  useAdvancedOptimizer?: boolean
  onChange: (config: {
    boardWidth?: number
    boardHeight?: number
    kerf?: number
    allowRotate?: boolean
    forceTwoColumns?: boolean
    objective?: 'waste' | 'cuts' | 'balanced'
    useAdvancedOptimizer?: boolean
  }) => void
}

// Tooltip component
function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [show, setShow] = useState(false)
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg bg-neutral-900 p-3 text-xs text-white shadow-lg z-50"
          >
            <div className="relative">
              {content}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-neutral-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Info icon component
function InfoIcon() {
  return (
    <svg className="w-4 h-4 text-neutral-400 hover:text-neutral-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export default function BoardInputEnhanced({
  boardWidth,
  boardHeight,
  kerf,
  allowRotate,
  forceTwoColumns: _forceTwoColumns,
  objective = 'balanced',
  useAdvancedOptimizer = false,
  onChange,
}: BoardInputProps) {
  // Local state for input values
  const [widthValue, setWidthValue] = useState(boardWidth.toString())
  const [heightValue, setHeightValue] = useState(boardHeight.toString())
  const [kerfValue, setKerfValue] = useState(kerf.toString())
  
  // Optimizer mode: 'standard', 'two-columns', 'advanced' - Default to 'two-columns'
  const [optimizerMode, setOptimizerMode] = useState<'standard' | 'two-columns' | 'advanced'>(
    useAdvancedOptimizer ? 'advanced' : 'two-columns'
  )

  // Update local state when props change
  useEffect(() => {
    setWidthValue(boardWidth.toString())
  }, [boardWidth])

  useEffect(() => {
    setHeightValue(boardHeight.toString())
  }, [boardHeight])

  useEffect(() => {
    setKerfValue(kerf.toString())
  }, [kerf])

  // Handle optimizer mode changes
  const handleOptimizerModeChange = (mode: 'standard' | 'two-columns' | 'advanced') => {
    setOptimizerMode(mode)
    
    switch (mode) {
      case 'standard':
        onChange({ forceTwoColumns: false, useAdvancedOptimizer: false })
        break
      case 'two-columns':
        onChange({ forceTwoColumns: true, useAdvancedOptimizer: false })
        break
      case 'advanced':
        onChange({ forceTwoColumns: false, useAdvancedOptimizer: true })
        break
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-neutral-600">Configuration planche</h3>

      {/* Board dimensions */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-xs text-neutral-500">Largeur</label>
            <Tooltip content="Largeur de la planche en millimètres. Standard: 1220, 1500, 1830, 2440mm">
              <InfoIcon />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={widthValue}
              onChange={(e) => {
                setWidthValue(e.target.value)
                const num = Number(e.target.value)
                if (!isNaN(num) && num > 0) {
                  onChange({ boardWidth: num })
                }
              }}
              onBlur={() => {
                const num = Number(widthValue)
                if (isNaN(num) || num <= 0) {
                  setWidthValue(boardWidth.toString())
                } else {
                  onChange({ boardWidth: num })
                }
              }}
              className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm transition-colors focus:border-neutral-400"
            />
            <span className="text-xs text-neutral-400">mm</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-xs text-neutral-500">Longueur</label>
            <Tooltip content="Longueur de la planche en millimètres. Standard: 2440, 2750, 3050, 5000mm">
              <InfoIcon />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={heightValue}
              onChange={(e) => {
                setHeightValue(e.target.value)
                const num = Number(e.target.value)
                if (!isNaN(num) && num > 0) {
                  onChange({ boardHeight: num })
                }
              }}
              onBlur={() => {
                const num = Number(heightValue)
                if (isNaN(num) || num <= 0) {
                  setHeightValue(boardHeight.toString())
                } else {
                  onChange({ boardHeight: num })
                }
              }}
              className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm transition-colors focus:border-neutral-400"
            />
            <span className="text-xs text-neutral-400">mm</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-xs text-neutral-500">Trait de scie</label>
            <Tooltip content="Épaisseur du trait de scie (kerf) en mm. Typique: 2-4mm pour scie circulaire, 0.5-1mm pour laser">
              <InfoIcon />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={kerfValue}
              onChange={(e) => {
                setKerfValue(e.target.value)
                const num = Number(e.target.value)
                if (!isNaN(num) && num >= 0) {
                  onChange({ kerf: num })
                }
              }}
              onBlur={() => {
                const num = Number(kerfValue)
                if (isNaN(num) || num < 0) {
                  setKerfValue(kerf.toString())
                } else {
                  onChange({ kerf: num })
                }
              }}
              className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm transition-colors focus:border-neutral-400"
            />
            <span className="text-xs text-neutral-400">mm</span>
          </div>
        </div>
      </div>

      {/* Optimizer mode selection - Compact */}
      <div className="space-y-3 border-t border-neutral-100 pt-3">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-xs font-medium text-neutral-600">Mode d'optimisation</label>
        </div>
        
        <div className="flex gap-2">
          <motion.label
            className={`flex-1 cursor-pointer p-2 rounded-lg border transition-all text-center ${
              optimizerMode === 'standard' 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="radio"
              checked={optimizerMode === 'standard'}
              onChange={() => handleOptimizerModeChange('standard')}
              className="sr-only"
            />
            <Tooltip content="Algorithme de placement libre. Utilise plusieurs planches si nécessaire pour placer toutes les pièces.">
              <div>
                <div className="text-xs font-medium text-neutral-900">Standard</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Placement libre</div>
              </div>
            </Tooltip>
          </motion.label>

          <motion.label
            className={`flex-1 cursor-pointer p-2 rounded-lg border transition-all text-center ${
              optimizerMode === 'two-columns' 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="radio"
              checked={optimizerMode === 'two-columns'}
              onChange={() => handleOptimizerModeChange('two-columns')}
              className="sr-only"
            />
            <Tooltip content="Force 2 colonnes verticales pour simplifier la découpe. Idéal pour découpe manuelle.">
              <div>
                <div className="text-xs font-medium text-neutral-900">2 colonnes</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Découpe simple</div>
              </div>
            </Tooltip>
          </motion.label>

          <motion.label
            className={`flex-1 cursor-pointer p-2 rounded-lg border transition-all text-center ${
              optimizerMode === 'advanced' 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="radio"
              checked={optimizerMode === 'advanced'}
              onChange={() => handleOptimizerModeChange('advanced')}
              className="sr-only"
            />
            <Tooltip content="Multi-colonnes dynamiques avec plusieurs stratégies. Plus lent mais peut trouver de meilleures solutions.">
              <div>
                <div className="flex items-center justify-center gap-1">
                  <div className="text-xs font-medium text-neutral-900">Avancé</div>
                  <span className="text-[9px] px-1 py-0 bg-amber-100 text-amber-700 rounded font-medium">BETA</span>
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Multi-colonnes</div>
              </div>
            </Tooltip>
          </motion.label>
        </div>
      </div>

      {/* Objective selection */}
      <div className="space-y-3 border-t border-neutral-100 pt-3">
        <div className="flex items-center gap-2 mb-1">
          <label className="text-xs font-medium text-neutral-600">Objectif prioritaire</label>
          <Tooltip content="Définit ce que l'algorithme cherche à optimiser en priorité">
            <InfoIcon />
          </Tooltip>
        </div>
        <select
          value={objective}
          onChange={(e) => onChange({ objective: e.target.value as any })}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm transition-colors focus:border-neutral-400"
        >
          <option value="waste">Minimiser les chutes (max utilisation)</option>
          <option value="balanced">Équilibré (compromis chutes/coupes)</option>
          <option value="cuts">Minimiser les coupes (plus rapide)</option>
        </select>
      </div>

      {/* Rotation option */}
      <div className="space-y-3 border-t border-neutral-100 pt-3">
        <motion.label
          className="group flex cursor-pointer items-center justify-between p-3 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all"
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={allowRotate}
              onChange={(e) => onChange({ allowRotate: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-300 text-blue-600"
            />
            <div>
              <div className="text-sm font-medium text-neutral-700">Autoriser rotation 90°</div>
              <div className="text-xs text-neutral-500">Les pièces peuvent être tournées pour mieux s'adapter</div>
            </div>
          </div>
          <Tooltip content="Permet aux pièces d'être pivotées de 90° pour optimiser le placement. Améliore généralement l'utilisation de +5-15%">
            <InfoIcon />
          </Tooltip>
        </motion.label>
      </div>

    </div>
  )
}