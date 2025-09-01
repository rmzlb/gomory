'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import type { PlacedPiece, PieceSpec } from '@/lib/types'

interface PieceHoverCardProps {
  piece: PlacedPiece
  spec: PieceSpec | undefined
  pieceNumber: number
  totalPieces: number
  boardNumber: number
  children: React.ReactNode
}

export default function PieceHoverCard({
  piece,
  spec,
  pieceNumber,
  totalPieces,
  boardNumber,
  children,
}: PieceHoverCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Determine actual dimensions (accounting for rotation)
  const displayWidth = piece.rotated ? piece.h : piece.w
  const displayHeight = piece.rotated ? piece.w : piece.h
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none"
          >
            <div className="bg-neutral-900 text-white rounded-lg shadow-xl px-3 py-2 min-w-[160px]">
              <div className="space-y-1.5">
                {/* Header with piece ID and count */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    {piece.id}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {pieceNumber}/{totalPieces}
                  </span>
                </div>
                
                {/* Spec name if available */}
                {spec && (
                  <div className="text-xs text-blue-300 font-medium">
                    Type {spec.id}
                  </div>
                )}
                
                {/* Dimensions */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-300">
                    {displayWidth} × {displayHeight} mm
                  </span>
                  {piece.rotated && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded">
                      90°
                    </span>
                  )}
                </div>
                
                {/* Position info */}
                <div className="text-[10px] text-neutral-400 border-t border-neutral-700 pt-1.5 mt-1.5">
                  <div className="flex justify-between">
                    <span>Position:</span>
                    <span className="text-neutral-300">
                      ({Math.round(piece.x)}, {Math.round(piece.y)})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Planche:</span>
                    <span className="text-neutral-300">#{boardNumber}</span>
                  </div>
                </div>
              </div>
              
              {/* Arrow pointer */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-neutral-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}