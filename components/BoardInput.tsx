'use client'

import { motion } from 'motion/react'
import { useState, useEffect } from 'react'

interface BoardInputProps {
  boardWidth: number
  boardHeight: number
  kerf: number
  allowRotate: boolean
  forceTwoColumns: boolean
  objective?: 'waste' | 'cuts' | 'balanced'
  onChange: (config: {
    boardWidth?: number
    boardHeight?: number
    kerf?: number
    allowRotate?: boolean
    forceTwoColumns?: boolean
    objective?: 'waste' | 'cuts' | 'balanced'
  }) => void
}

export default function BoardInput({
  boardWidth,
  boardHeight,
  kerf,
  allowRotate,
  forceTwoColumns,
  objective = 'balanced',
  onChange
}: BoardInputProps) {
  // Local state for input values to allow empty strings during editing
  const [widthValue, setWidthValue] = useState(boardWidth.toString())
  const [heightValue, setHeightValue] = useState(boardHeight.toString())
  const [kerfValue, setKerfValue] = useState(kerf.toString())

  // Update local state when props change (e.g., after reset)
  useEffect(() => {
    setWidthValue(boardWidth.toString())
  }, [boardWidth])
  
  useEffect(() => {
    setHeightValue(boardHeight.toString())
  }, [boardHeight])
  
  useEffect(() => {
    setKerfValue(kerf.toString())
  }, [kerf])
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-neutral-600">Configuration planche</h3>
      
      {/* Board dimensions */}
      <div className="space-y-3">
        <div>
          <label className="text-xs text-neutral-500 block mb-1">
            Largeur
          </label>
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
              className="flex-1 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg
                         focus:border-neutral-400 transition-colors text-sm"
            />
            <span className="text-xs text-neutral-400">mm</span>
          </div>
        </div>
        
        <div>
          <label className="text-xs text-neutral-500 block mb-1">
            Longueur
          </label>
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
              className="flex-1 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg
                         focus:border-neutral-400 transition-colors text-sm"
            />
            <span className="text-xs text-neutral-400">mm</span>
          </div>
        </div>
        
        <div>
          <label className="text-xs text-neutral-500 block mb-1">
            Trait de scie
          </label>
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
                  setKerfValue('0')
                  onChange({ kerf: 0 })
                } else {
                  onChange({ kerf: num })
                }
              }}
              className="flex-1 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg
                         focus:border-neutral-400 transition-colors text-sm"
            />
            <span className="text-xs text-neutral-400">mm</span>
          </div>
        </div>
      </div>
      
      {/* Options */}
      <div className="space-y-3 pt-3 border-t border-neutral-100">
        <div>
          <label className="text-xs text-neutral-500 block mb-1">
            Objectif d&apos;optimisation
          </label>
          <select
            value={objective}
            onChange={(e) => onChange({ objective: e.target.value as any })}
            className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg
                     focus:border-neutral-400 transition-colors text-sm"
          >
            <option value="waste">Minimiser les chutes</option>
            <option value="balanced">Équilibré</option>
            <option value="cuts">Minimiser les coupes</option>
          </select>
        </div>
        
        <motion.label 
          className="flex items-center gap-2 cursor-pointer group"
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="checkbox"
            checked={allowRotate}
            onChange={(e) => onChange({ allowRotate: e.target.checked })}
            className="w-4 h-4 rounded border-neutral-300 text-neutral-900 
                       focus:ring-0 focus:ring-offset-0"
          />
          <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
            Rotation 90°
          </span>
        </motion.label>
        
        <motion.label 
          className="flex items-center gap-2 cursor-pointer group"
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="checkbox"
            checked={forceTwoColumns}
            onChange={(e) => onChange({ forceTwoColumns: e.target.checked })}
            className="w-4 h-4 rounded border-neutral-300 text-neutral-900 
                       focus:ring-0 focus:ring-offset-0"
          />
          <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
            Optimisation 2 colonnes
          </span>
        </motion.label>
      </div>
    </div>
  )
}