'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { PlacedPiece, PieceSpec } from '@/lib/types'

interface PieceHoverCardPortalProps {
  piece: PlacedPiece
  spec: PieceSpec | undefined
  pieceNumber: number
  totalPieces: number
  boardNumber: number
  children: React.ReactNode
}

export default function PieceHoverCardPortal({
  piece,
  spec,
  pieceNumber,
  totalPieces,
  boardNumber,
  children,
}: PieceHoverCardPortalProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  // Ensure component is mounted before using portal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Update position when hovering
  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true)
    updatePosition(e)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isHovered) {
      updatePosition(e)
    }
  }

  const updatePosition = (e: React.MouseEvent) => {
    if (!elementRef.current) return

    const rect = elementRef.current.getBoundingClientRect()
    const tooltipWidth = 180
    const tooltipHeight = 140
    const offset = 10

    // Calculate position relative to viewport
    let x = rect.left + rect.width / 2 - tooltipWidth / 2
    let y = rect.top - tooltipHeight - offset

    // Smart positioning to avoid edges
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Horizontal adjustment
    if (x < offset) {
      x = offset
    } else if (x + tooltipWidth > viewportWidth - offset) {
      x = viewportWidth - tooltipWidth - offset
    }

    // Vertical adjustment - flip to bottom if too close to top
    if (y < offset) {
      y = rect.bottom + offset
    }

    // If still off bottom, position at mouse
    if (y + tooltipHeight > viewportHeight - offset) {
      y = e.clientY - tooltipHeight - offset
      if (y < offset) {
        y = e.clientY + offset
      }
    }

    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  // Determine actual dimensions (accounting for rotation)
  const displayWidth = piece.rotated ? piece.h : piece.w
  const displayHeight = piece.rotated ? piece.w : piece.h

  // Tooltip content
  const tooltipContent = (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className="pointer-events-none fixed z-[9999]"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          <div className="min-w-[180px] rounded-lg bg-neutral-900 px-3 py-2 text-white shadow-xl">
            <div className="space-y-1.5">
              {/* Header with piece ID and count */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{piece.id}</span>
                <span className="text-xs text-neutral-400">
                  {pieceNumber}/{totalPieces}
                </span>
              </div>

              {/* Spec name if available */}
              {spec && <div className="text-xs font-medium text-blue-300">Type {spec.id}</div>}

              {/* Dimensions */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-300">
                  {displayWidth} × {displayHeight} mm
                </span>
                {piece.rotated && (
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300">
                    90°
                  </span>
                )}
              </div>

              {/* Surface area */}
              <div className="text-xs text-neutral-400">
                Surface: {((displayWidth * displayHeight) / 10000).toFixed(2)} cm²
              </div>

              {/* Position info */}
              <div className="mt-1.5 border-t border-neutral-700 pt-1.5 text-[10px] text-neutral-400">
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <div
        ref={elementRef}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {mounted && createPortal(tooltipContent, document.body)}
    </>
  )
}
