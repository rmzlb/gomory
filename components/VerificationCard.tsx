'use client'

import { motion } from 'motion/react'

import type { OptimizationResult, PieceSpec } from '@/lib/types'

interface VerificationCardProps {
  result: OptimizationResult
  specs: PieceSpec[]
  boardWidth: number
  boardHeight: number
}

export default function VerificationCard({ 
  result, 
  specs, 
  boardWidth, 
  boardHeight 
}: VerificationCardProps) {
  const areaPieces = result.allPieces.reduce((acc, p) => acc + p.w * p.h, 0)
  const boardsArea = result.boards.length * boardWidth * boardHeight
  
  // Count per spec
  const perSpecPlaced: Record<string, number> = {}
  specs.forEach(s => { perSpecPlaced[s.id] = 0 })
  result.allPieces.forEach(p => { 
    perSpecPlaced[p.specId] = (perSpecPlaced[p.specId] || 0) + 1 
  })
  
  const allMatch = specs.every(s => perSpecPlaced[s.id] === s.qty)
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-neutral-200 p-5"
    >
      <h3 className="font-medium text-base mb-3">✅ Carte de vérification</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-neutral-500">Pièces placées:</span>
            <span className="font-medium">{result.allPieces.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Surface pièces:</span>
            <span className="font-medium">{(areaPieces / 1000000).toFixed(2)} m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Surface planches:</span>
            <span className="font-medium">{(boardsArea / 1000000).toFixed(2)} m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Utilisation:</span>
            <span className={`font-medium ${
              result.utilization > 0.8 ? 'text-green-600' : 
              result.utilization > 0.6 ? 'text-neutral-900' : 
              'text-red-500'
            }`}>
              {(result.utilization * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="font-medium mb-1 text-neutral-700">Quantités par référence</div>
          {specs.map(s => {
            const placed = perSpecPlaced[s.id] || 0
            const isComplete = placed === s.qty
            
            return (
              <div key={s.id} className="flex justify-between text-xs">
                <span className="text-neutral-600">
                  {s.id} ({s.w}×{s.h} mm)
                </span>
                <span className={isComplete ? 'text-green-600' : 'text-red-500'}>
                  {placed}/{s.qty} {isComplete ? '✓' : '✗'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-neutral-100">
        <div className="text-sm">
          Statut: {allMatch ? (
            <span className="text-green-600 font-medium">
              OK – toutes les pièces sont placées
            </span>
          ) : (
            <span className="text-red-600 font-medium">
              Erreur – pièces manquantes
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}