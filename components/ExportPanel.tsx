'use client'

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'

import type { OptimizationResult, PieceSpec } from '@/lib/types'

interface ExportPanelProps {
  result: OptimizationResult
  specs: PieceSpec[]
  boardWidth: number
  boardHeight: number
}

export default function ExportPanel({ result, specs, boardWidth, boardHeight }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const exportPDF = async () => {
    setIsExporting(true)
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // Title and header
      pdf.setFontSize(20)
      pdf.text('Plan de Découpe - Gomory', 20, 20)

      pdf.setFontSize(12)
      pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30)
      pdf.text(`Planches: ${result.boards.length}`, 20, 37)
      pdf.text(`Utilisation: ${(result.utilization * 100).toFixed(1)}%`, 80, 37)
      pdf.text(`Coupes totales: ${result.cuts.length}`, 140, 37)

      // Board dimensions
      pdf.text(`Dimensions planche: ${boardWidth} × ${boardHeight} mm`, 20, 44)

      // Pieces summary
      let yPos = 55
      pdf.setFontSize(14)
      pdf.text('Pièces à découper:', 20, yPos)
      yPos += 8

      pdf.setFontSize(10)
      specs.forEach((spec) => {
        const placed = result.allPieces.filter((p) => p.specId === spec.id).length
        pdf.text(`${spec.id}: ${spec.w}×${spec.h} mm - Quantité: ${placed}/${spec.qty}`, 25, yPos)
        yPos += 6
      })

      // Cutting list
      yPos += 10
      pdf.setFontSize(14)
      pdf.text('Liste de découpe:', 20, yPos)
      yPos += 8

      pdf.setFontSize(9)
      result.boards.forEach((board, bIndex) => {
        pdf.text(`Planche #${bIndex + 1}:`, 25, yPos)
        yPos += 5

        board.strips.forEach((strip) => {
          strip.pieces.forEach((piece) => {
            pdf.text(
              `  - ${piece.id} (${piece.specId}): ${piece.w}×${piece.h} mm @ (${Math.round(piece.x)}, ${Math.round(piece.y)})${piece.rotated ? ' [Rotation 90°]' : ''}`,
              30,
              yPos
            )
            yPos += 4

            // New page if needed
            if (yPos > 180) {
              pdf.addPage()
              yPos = 20
            }
          })
        })
        yPos += 5
      })

      // Save PDF
      pdf.save(`plan-decoupe-${new Date().getTime()}.pdf`)
    } catch (error) {
      console.error('Export PDF error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportImage = async (format: 'png' | 'svg', size: 'small' | 'medium' | 'large') => {
    setIsExporting(true)
    try {
      const boards = document.querySelectorAll('.board-svg-container')

      for (let i = 0; i < boards.length; i++) {
        const board = boards[i] as HTMLElement

        if (format === 'png') {
          const scale = size === 'small' ? 1 : size === 'medium' ? 2 : 3
          const canvas = await html2canvas(board, {
            scale,
            backgroundColor: '#ffffff',
          })

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `planche-${i + 1}-${size}.png`
              a.click()
              URL.revokeObjectURL(url)
            }
          })
        } else {
          // SVG export
          const svg = board.querySelector('svg')
          if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg)
            const blob = new Blob([svgData], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `planche-${i + 1}.svg`
            a.click()
            URL.revokeObjectURL(url)
          }
        }
      }
    } catch (error) {
      console.error('Export image error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isExporting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-3 w-3 rounded-full border-2 border-white border-t-transparent"
            />
            Export...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Exporter tout
          </>
        )}
      </button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
          >
            <div className="p-2">
              <button
                onClick={() => {
                  exportPDF()
                  setShowMenu(false)
                }}
                className="w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📄</span>
                  <div>
                    <div className="text-sm font-medium">Plan de découpe PDF</div>
                    <div className="text-xs text-neutral-500">
                      Document complet avec toutes les planches
                    </div>
                  </div>
                </div>
              </button>

              <div className="my-2 border-t border-neutral-100" />

              <p className="px-3 py-1 text-xs text-neutral-500">
                Export images (toutes les planches)
              </p>

              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    exportImage('png', size)
                    setShowMenu(false)
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-neutral-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🖼️</span>
                    <div className="text-sm">
                      PNG {size === 'small' ? '(1x)' : size === 'medium' ? '(2x)' : '(3x)'}
                    </div>
                  </div>
                </button>
              ))}

              <button
                onClick={() => {
                  exportImage('svg', 'medium')
                  setShowMenu(false)
                }}
                className="w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎨</span>
                  <div className="text-sm">SVG (Vectoriel)</div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
