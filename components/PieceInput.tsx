'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { getPieceColor } from '@/lib/colors'
import type { PieceSpec } from '@/lib/types'

interface PieceInputProps {
  pieces: PieceSpec[]
  onChange: (pieces: PieceSpec[]) => void
}

interface LocalPieceValues {
  [key: string]: {
    w: string
    h: string
    qty: string
  }
}

export default function PieceInput({ pieces, onChange }: PieceInputProps) {
  // Local state for input values to allow empty strings during editing
  const [localValues, setLocalValues] = useState<LocalPieceValues>(() => {
    const initial: LocalPieceValues = {}
    pieces.forEach(p => {
      initial[p.id] = {
        w: p.w.toString(),
        h: p.h.toString(),
        qty: p.qty.toString()
      }
    })
    return initial
  })

  const updatePiece = (id: string, field: keyof PieceSpec, value: string | number) => {
    if (field === 'id') {
      onChange(pieces.map(p => 
        p.id === id 
          ? { ...p, id: value as string }
          : p
      ))
    } else {
      // Update local state
      setLocalValues(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value.toString()
        }
      }))
      
      // Update actual value if it's a valid number
      const num = Number(value)
      if (!isNaN(num) && num > 0) {
        onChange(pieces.map(p => 
          p.id === id 
            ? { ...p, [field]: num }
            : p
        ))
      }
    }
  }

  const handleBlur = (id: string, field: 'w' | 'h' | 'qty') => {
    const piece = pieces.find(p => p.id === id)
    if (!piece) return
    
    const value = localValues[id]?.[field] || ''
    const num = Number(value)
    
    if (isNaN(num) || num <= 0) {
      // Reset to original value
      setLocalValues(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: piece[field].toString()
        }
      }))
    } else {
      // Update with valid value
      onChange(pieces.map(p => 
        p.id === id 
          ? { ...p, [field]: num }
          : p
      ))
    }
  }

  const removePiece = (id: string) => {
    onChange(pieces.filter(p => p.id !== id))
    // Remove from local state
    setLocalValues(prev => {
      const newValues = { ...prev }
      delete newValues[id]
      return newValues
    })
  }

  const addPiece = () => {
    const newId = pieces.length === 0 
      ? 'A' 
      : String.fromCharCode(pieces[pieces.length - 1].id.charCodeAt(0) + 1)
    
    const newPiece = { 
      id: newId, 
      w: 300, 
      h: 200, 
      qty: 1 
    }
    
    // Add to local state
    setLocalValues(prev => ({
      ...prev,
      [newId]: {
        w: '300',
        h: '200',
        qty: '1'
      }
    }))
    
    onChange([...pieces, newPiece])
  }

  const totalPieces = pieces.reduce((sum, p) => sum + p.qty, 0)
  const totalArea = pieces.reduce((sum, p) => sum + (p.w * p.h * p.qty), 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-700">Pièces à découper</h3>
        <div className="flex gap-3 text-xs text-neutral-500">
          <span>{totalPieces} pièces</span>
          <span>•</span>
          <span>{(totalArea / 1000000).toFixed(2)} m²</span>
        </div>
      </div>

      {/* Dynamic height container - no scroll */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {pieces.map((piece, index) => {
            const color = getPieceColor(index)
            return (
            <motion.div
              key={piece.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="bg-neutral-50 rounded-lg p-3 group hover:bg-neutral-100 transition-colors"
            >
              {/* Header with ID and Delete */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {/* Color indicator */}
                  <div 
                    className="w-6 h-6 rounded border-2"
                    style={{ 
                      backgroundColor: color.light,
                      borderColor: color.border
                    }}
                  />
                  <input
                    value={piece.id}
                    onChange={(e) => updatePiece(piece.id, 'id', e.target.value)}
                    className="w-12 px-2 py-1 bg-white border border-neutral-200 rounded
                             focus:border-neutral-400 focus:outline-none transition-colors 
                             text-sm font-medium text-center"
                    placeholder="ID"
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => removePiece(piece.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  aria-label="Supprimer"
                >
                  <svg className="w-4 h-4 text-neutral-400 hover:text-red-500 transition-colors">
                    <path 
                      d="M6 18L18 6M6 6l12 12" 
                      stroke="currentColor" 
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Dimensions and Quantity */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Largeur</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={localValues[piece.id]?.w || piece.w}
                      onChange={(e) => updatePiece(piece.id, 'w', e.target.value)}
                      onBlur={() => handleBlur(piece.id, 'w')}
                      className="w-full px-2 py-1 bg-white border border-neutral-200 rounded
                               focus:border-neutral-400 focus:outline-none transition-colors text-sm"
                      placeholder="L"
                    />
                    <span className="text-xs text-neutral-400 ml-1">mm</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Hauteur</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={localValues[piece.id]?.h || piece.h}
                      onChange={(e) => updatePiece(piece.id, 'h', e.target.value)}
                      onBlur={() => handleBlur(piece.id, 'h')}
                      className="w-full px-2 py-1 bg-white border border-neutral-200 rounded
                               focus:border-neutral-400 focus:outline-none transition-colors text-sm"
                      placeholder="H"
                    />
                    <span className="text-xs text-neutral-400 ml-1">mm</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Quantité</label>
                  <input
                    type="text"
                    value={localValues[piece.id]?.qty || piece.qty}
                    onChange={(e) => updatePiece(piece.id, 'qty', e.target.value)}
                    onBlur={() => handleBlur(piece.id, 'qty')}
                    className="w-full px-2 py-1 bg-white border border-neutral-200 rounded
                             focus:border-neutral-400 focus:outline-none transition-colors text-sm"
                    placeholder="Qt"
                  />
                </div>
              </div>

              {/* Piece info */}
              <div className="mt-2 text-xs text-neutral-500">
                Surface: {((piece.w * piece.h * piece.qty) / 1000000).toFixed(3)} m²
              </div>
            </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
      
      {/* Add button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={addPiece}
        className="w-full py-2.5 text-neutral-600 text-sm font-medium
                 border-2 border-dashed border-neutral-200 rounded-lg
                 hover:border-neutral-300 hover:bg-neutral-50
                 transition-all"
      >
        + Ajouter une pièce
      </motion.button>
    </div>
  )
}