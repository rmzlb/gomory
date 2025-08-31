'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'

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
        <div className="flex items-center gap-3">
          <div className="flex gap-2 text-xs text-neutral-500">
            <span>{totalPieces} pièces</span>
            <span>•</span>
            <span>{(totalArea / 1000000).toFixed(2)} m²</span>
          </div>
          {pieces.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (confirm('Supprimer toutes les pièces ?')) {
                  onChange([])
                  setLocalValues({})
                }
              }}
              className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
              aria-label="Effacer tout"
            >
              Effacer
            </motion.button>
          )}
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => removePiece(piece.id)}
                  className="p-2 rounded-lg bg-white border border-neutral-200
                           hover:bg-red-50 hover:border-red-300 
                           active:bg-red-100 transition-all
                           sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label={`Supprimer pièce ${piece.id}`}
                >
                  <svg className="w-4 h-4 text-neutral-500 hover:text-red-600 transition-colors" 
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </div>

              {/* Dimensions and Quantity */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <div>
                  <label className="text-xs text-neutral-500 block mb-0.5 sm:mb-1">L (mm)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={localValues[piece.id]?.w || piece.w}
                    onChange={(e) => updatePiece(piece.id, 'w', e.target.value)}
                    onBlur={() => handleBlur(piece.id, 'w')}
                    className="w-full px-1.5 sm:px-2 py-1 bg-white border border-neutral-200 rounded
                             focus:border-neutral-400 focus:outline-none transition-colors text-sm"
                    placeholder="Largeur"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-neutral-500 block mb-0.5 sm:mb-1">H (mm)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={localValues[piece.id]?.h || piece.h}
                    onChange={(e) => updatePiece(piece.id, 'h', e.target.value)}
                    onBlur={() => handleBlur(piece.id, 'h')}
                    className="w-full px-1.5 sm:px-2 py-1 bg-white border border-neutral-200 rounded
                             focus:border-neutral-400 focus:outline-none transition-colors text-sm"
                    placeholder="Hauteur"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-neutral-500 block mb-0.5 sm:mb-1">Qté</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={localValues[piece.id]?.qty || piece.qty}
                    onChange={(e) => updatePiece(piece.id, 'qty', e.target.value)}
                    onBlur={() => handleBlur(piece.id, 'qty')}
                    className="w-full px-1.5 sm:px-2 py-1 bg-white border border-neutral-200 rounded
                             focus:border-neutral-400 focus:outline-none transition-colors text-sm"
                    placeholder="Quantité"
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