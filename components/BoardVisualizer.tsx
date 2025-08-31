'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { getPieceColorBySpecId } from '@/lib/colors'
import type { BoardLayout, Cut, PieceSpec } from '@/lib/types'

interface BoardVisualizerProps {
  board: BoardLayout
  cuts: Cut[]
  boardWidth: number
  boardHeight: number
  zoom?: number
  specs?: PieceSpec[]
}

export default function BoardVisualizer({ 
  board, 
  cuts, 
  boardWidth, 
  boardHeight,
  zoom = 1,
  specs = []
}: BoardVisualizerProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  // Calculate scale to fit in viewport
  const baseWidth = 1100
  const baseHeight = 700
  const scale = Math.min((baseWidth * zoom) / boardWidth, (baseHeight * zoom) / boardHeight)
  const width = boardWidth * scale
  const height = boardHeight * scale
  
  const boardCuts = cuts.filter(c => c.boardIndex === board.index)
  const pieceCount = board.strips.reduce((n, s) => n + s.pieces.length, 0)

  // Fixed sizes that don't scale with zoom
  const fontSize = 10
  const dimFontSize = 8
  const cutRadius = 8
  const cutStrokeWidth = 2

  // Export functions
  const exportPNG = async (size: 'small' | 'medium' | 'large') => {
    setIsExporting(true)
    try {
      const boardElement = document.getElementById(`board-svg-${board.index}`)
      if (boardElement) {
        const scale = size === 'small' ? 1 : size === 'medium' ? 2 : 3
        const canvas = await html2canvas(boardElement, {
          scale,
          backgroundColor: '#ffffff'
        })
        
        canvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `planche-${board.index + 1}-${size}.png`
            a.click()
            URL.revokeObjectURL(url)
          }
        })
      }
    } catch (error) {
      console.error('Export PNG error:', error)
    } finally {
      setIsExporting(false)
      setShowMenu(false)
    }
  }

  const exportSVG = () => {
    setIsExporting(true)
    try {
      const svg = document.querySelector(`#board-svg-${board.index} svg`)
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg)
        const blob = new Blob([svgData], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `planche-${board.index + 1}.svg`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export SVG error:', error)
    } finally {
      setIsExporting(false)
      setShowMenu(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
      className="bg-white rounded-xl border border-neutral-200 p-5"
    >
      {/* Header with stats */}
      <div className="border-b border-neutral-100 pb-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <span className="text-xl">🪵</span>
            Planche #{board.index + 1}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">
              {boardWidth} × {boardHeight} mm
            </span>
            
            {/* Export menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                disabled={isExporting}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Options d'export"
              >
                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 
                             overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <p className="text-xs text-neutral-500 px-3 py-1">Export PNG</p>
                      <button
                        onClick={() => exportPNG('small')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 rounded-lg transition-colors"
                      >
                        📷 PNG (1x)
                      </button>
                      <button
                        onClick={() => exportPNG('medium')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 rounded-lg transition-colors"
                      >
                        📷 PNG (2x)
                      </button>
                      <button
                        onClick={() => exportPNG('large')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 rounded-lg transition-colors"
                      >
                        📷 PNG (3x)
                      </button>
                      <div className="border-t border-neutral-100 my-1" />
                      <button
                        onClick={exportSVG}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 rounded-lg transition-colors"
                      >
                        🎨 SVG (Vectoriel)
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Stats bar */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Utilisation:</span>
            <span className="font-medium">
              {board.utilization ? `${(board.utilization * 100).toFixed(1)}%` : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Pièces:</span>
            <span className="font-medium">{pieceCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Coupes:</span>
            <span className="font-medium">{boardCuts.length}</span>
          </div>
        </div>
      </div>

      {/* SVG Visualization */}
      <div id={`board-svg-${board.index}`} className="relative overflow-auto bg-neutral-50 rounded-lg p-4 board-svg-container">
        <svg 
          width={width} 
          height={height} 
          className="mx-auto"
          style={{ minWidth: width, minHeight: height }}
        >
          {/* Board background with dimensions */}
          <g>
            <rect 
              width={boardWidth * scale} 
              height={boardHeight * scale}
              className="fill-white stroke-neutral-900"
              strokeWidth={2}
            />
            
            {/* Dimension labels */}
            <text
              x={boardWidth * scale / 2}
              y={-5}
              textAnchor="middle"
              className="fill-neutral-600"
              fontSize={dimFontSize}
            >
              {boardWidth} mm
            </text>
            <text
              x={-5}
              y={boardHeight * scale / 2}
              textAnchor="middle"
              className="fill-neutral-600"
              fontSize={dimFontSize}
              transform={`rotate(-90 ${-5} ${boardHeight * scale / 2})`}
            >
              {boardHeight} mm
            </text>
          </g>
          
          {/* Column splits (if any) */}
          <AnimatePresence>
            {(board.columnSplits || []).map((x, i) => (
              <motion.line
                key={`split-${i}`}
                x1={x * scale}
                y1={0}
                x2={x * scale}
                y2={height}
                className="stroke-green-500"
                strokeWidth={2}
                strokeDasharray="6 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
            ))}
          </AnimatePresence>

          {/* Pieces */}
          <AnimatePresence>
            {board.strips.map((strip, stripIndex) => (
              <g key={`strip-${stripIndex}`}>
                {strip.pieces.map((piece, pieceIndex) => {
                  const px = piece.x * scale
                  const py = piece.y * scale
                  const pw = piece.w * scale
                  const ph = piece.h * scale
                  const color = getPieceColorBySpecId(piece.specId, specs)
                  
                  return (
                    <motion.g
                      key={piece.id}
                      initial={{ 
                        opacity: 0,
                        y: -20 
                      }}
                      animate={{ 
                        opacity: 1,
                        y: 0
                      }}
                      transition={{ 
                        delay: stripIndex * 0.05 + pieceIndex * 0.02,
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                      }}
                    >
                      <motion.rect
                        x={px}
                        y={py}
                        width={pw}
                        height={ph}
                        fill={color.light}
                        stroke={color.border}
                        strokeWidth={1.5}
                        whileHover={{ 
                          fill: color.bg,
                          opacity: 0.6,
                          transition: { duration: 0.15 }
                        }}
                      />
                      
                      {/* Piece ID */}
                      <text
                        x={px + 6}
                        y={py + 16}
                        className="fill-neutral-900 font-medium pointer-events-none"
                        fontSize={fontSize}
                      >
                        {piece.id}
                      </text>
                      
                      {/* Piece dimensions and rotation indicator */}
                      <text
                        x={px + 6}
                        y={py + 30}
                        className="fill-neutral-600 pointer-events-none"
                        fontSize={dimFontSize}
                      >
                        {Math.round(piece.w)}×{Math.round(piece.h)} mm
                        {piece.rotated && ' ↻'}
                      </text>
                    </motion.g>
                  )
                })}
              </g>
            ))}
          </AnimatePresence>

          {/* Cut lines with badges */}
          <AnimatePresence>
            {boardCuts.map((cut, i) => {
              const x1 = cut.x1 * scale
              const y1 = cut.y1 * scale
              const x2 = cut.x2 * scale
              const y2 = cut.y2 * scale
              const cx = (x1 + x2) / 2
              const cy = (y1 + y2) / 2
              
              return (
                <motion.g
                  key={`cut-${cut.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    delay: 0.8 + i * 0.03,
                    duration: 0.3
                  }}
                >
                  {/* Cut line */}
                  <motion.line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className="stroke-red-500"
                    strokeWidth={cutStrokeWidth}
                    strokeDasharray="6 6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Cut badge */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={cutRadius}
                    className="fill-red-500"
                  />
                  <text
                    x={cx}
                    y={cy + 3}
                    textAnchor="middle"
                    className="fill-white font-medium pointer-events-none"
                    fontSize={fontSize - 2}
                  >
                    {cut.id}
                  </text>
                </motion.g>
              )
            })}
          </AnimatePresence>
        </svg>
      </div>
      
      {/* Footer info */}
      <div className="mt-3 flex justify-between text-xs text-neutral-500">
        <span>
          Mode: {board.columnSplits && board.columnSplits.length > 0 ? '2 colonnes' : 'Bandes'}
        </span>
        <span>
          Utilisation: {board.strips.length} bandes
        </span>
      </div>
    </motion.div>
  )
}