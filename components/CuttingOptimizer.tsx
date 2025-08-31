'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { optimizeCutting } from '@/lib/optimizer'
import BoardInput from './BoardInput'
import PieceInput from './PieceInput'
import BoardVisualizer from './BoardVisualizer'
import StatsDisplay from './StatsDisplay'
import PositioningReport from './PositioningReport'
import VerificationCard from './VerificationCard'
import TestsCard from './TestsCard'
import ExportPanel from './ExportPanel'
import HowItWorks from './HowItWorks'
import type { PieceSpec, OptimizationConfig, OptimizationResult } from '@/lib/types'

export default function CuttingOptimizer() {
  // Board configuration
  const [config, setConfig] = useState<OptimizationConfig>({
    boardWidth: 1500,
    boardHeight: 5000,
    kerf: 3,
    allowRotate: true,
    forceTwoColumns: true,
    objective: 'balanced'
  })

  // Visual settings
  const [zoom, setZoom] = useState(1.0)
  const [showTests, setShowTests] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [result, setResult] = useState<OptimizationResult | null>(null)

  // Pieces to cut
  const [pieces, setPieces] = useState<PieceSpec[]>([
    { id: 'A', w: 930, h: 750, qty: 5 },
    { id: 'B', w: 300, h: 800, qty: 3 },
    { id: 'C', w: 450, h: 600, qty: 4 },
    { id: 'D', w: 200, h: 300, qty: 6 },
  ])

  // Calculate optimization when button is clicked
  const handleOptimize = () => {
    if (pieces.length === 0) return
    setIsCalculating(true)
    setShowResults(false)
    
    setTimeout(() => {
      const res = optimizeCutting(config, pieces)
      setResult(res)
      setIsCalculating(false)
      setShowResults(true)
      
      // Scroll to visualization on mobile devices
      if (window.innerWidth < 1024) { // lg breakpoint
        setTimeout(() => {
          const visualizationElement = document.getElementById('visualization-area')
          if (visualizationElement) {
            visualizationElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }
      
      // Trigger confetti for good results
      if (res.utilization > 0.75) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#8b5cf6']
        })
      }
    }, 500)
  }


  const totalPieces = pieces.reduce((sum, p) => sum + p.qty, 0)

  const updateConfig = (updates: Partial<OptimizationConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const resetExample = () => {
    setConfig({
      boardWidth: 1500,
      boardHeight: 5000,
      kerf: 3,
      allowRotate: true,
      forceTwoColumns: true,
      objective: 'balanced'
    })
    setPieces([
      { id: 'A', w: 930, h: 750, qty: 5 },
      { id: 'B', w: 300, h: 800, qty: 3 },
      { id: 'C', w: 450, h: 600, qty: 4 },
      { id: 'D', w: 200, h: 300, qty: 6 },
    ])
    setZoom(1.0)
    setShowResults(false)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-light">
                Optimiseur de découpe
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                Algorithme guillotine avec optimisation deux colonnes
              </p>
            </div>
            
            {/* Quick stats */}
            {result && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-6 text-sm"
              >
                <div>
                  <span className="text-neutral-500">Utilisation</span>
                  <div className={`text-xl font-light ${
                    result.utilization > 0.8 ? 'text-green-600' : 
                    result.utilization > 0.6 ? 'text-neutral-900' : 
                    'text-red-500'
                  }`}>
                    {(result.utilization * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <span className="text-neutral-500">Planches</span>
                  <div className="text-xl font-light">{result.boards.length}</div>
                </div>
                <div>
                  <span className="text-neutral-500">Coupes</span>
                  <div className="text-xl font-light">{result.cuts.length}</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* How it works explanation */}
        <HowItWorks />
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar - Controls */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-[360px] lg:flex-shrink-0 space-y-4"
          >
            {/* Board configuration */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <BoardInput
                boardWidth={config.boardWidth}
                boardHeight={config.boardHeight}
                kerf={config.kerf}
                allowRotate={config.allowRotate}
                forceTwoColumns={config.forceTwoColumns}
                objective={config.objective}
                onChange={updateConfig}
              />
            </div>

            {/* Pieces input */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <PieceInput 
                pieces={pieces}
                onChange={setPieces}
              />
            </div>

            {/* Optimize button in sidebar */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <button
                onClick={handleOptimize}
                disabled={pieces.length === 0 || isCalculating}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 
                         text-white font-medium rounded-lg hover:shadow-lg 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all transform hover:scale-[1.02]"
              >
                {isCalculating ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Optimisation en cours...
                  </span>
                ) : (
                  showResults ? '🔄 Recalculer' : '🚀 Optimiser la découpe'
                )}
              </button>
            </div>

            {/* Action buttons */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <div className="space-y-3">
                <button
                  onClick={resetExample}
                  className="w-full py-2 px-4 bg-neutral-100 hover:bg-neutral-200 
                           rounded-lg text-sm transition-colors"
                >
                  Réinitialiser l&apos;exemple
                </button>
                {showResults && (
                  <button
                    onClick={() => setShowTests(!showTests)}
                    className="w-full py-2 px-4 bg-neutral-100 hover:bg-neutral-200 
                             rounded-lg text-sm transition-colors"
                  >
                    {showTests ? 'Masquer' : 'Afficher'} les tests
                  </button>
                )}
              </div>
            </div>
          </motion.aside>

          {/* Main content - Visualization */}
          <motion.main
            id="visualization-area"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 min-w-0 space-y-4"
          >
            {/* Zoom controls */}
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Zoom visuel</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                             bg-neutral-100 hover:bg-neutral-200 transition-colors"
                    aria-label="Zoom out"
                  >
                    −
                  </button>
                  <input
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-32"
                  />
                  <button
                    onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                             bg-neutral-100 hover:bg-neutral-200 transition-colors"
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                  <span className="text-sm text-neutral-500 w-12 text-right">
                    {(zoom * 100).toFixed(0)}%
                  </span>
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => setZoom(0.75)}
                      className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 
                               rounded-lg transition-colors"
                    >
                      75%
                    </button>
                    <button
                      onClick={() => setZoom(1)}
                      className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 
                               rounded-lg transition-colors"
                    >
                      100%
                    </button>
                    <button
                      onClick={() => setZoom(1.5)}
                      className="px-3 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 
                               rounded-lg transition-colors"
                    >
                      150%
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Board visualizations */}
            {showResults && result ? (
              <>
                {/* Global export button */}
                <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Plan de découpe complet</h3>
                    <p className="text-sm text-neutral-600 mt-1">
                      {result.boards.length} planche{result.boards.length > 1 ? 's' : ''} • 
                      {' '}{result.allPieces.length} pièces • 
                      {' '}{(result.utilization * 100).toFixed(1)}% d'utilisation
                    </p>
                  </div>
                  <ExportPanel
                    result={result}
                    specs={pieces}
                    boardWidth={config.boardWidth}
                    boardHeight={config.boardHeight}
                  />
                </div>

                {result.boards.map((board, index) => (
                  <BoardVisualizer
                    key={`board-${index}`}
                    board={board}
                    cuts={result.cuts}
                    boardWidth={config.boardWidth}
                    boardHeight={config.boardHeight}
                    zoom={zoom}
                    specs={pieces}
                  />
                ))}

                {/* Reports section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {/* Positioning report */}
                  <PositioningReport
                    boards={result.boards}
                    cuts={result.cuts}
                  />

                  {/* Verification card */}
                  <VerificationCard
                    result={result}
                    specs={pieces}
                    boardWidth={config.boardWidth}
                    boardHeight={config.boardHeight}
                  />
                </div>

                {/* Tests card (optional) */}
                {showTests && (
                  <TestsCard
                    result={result}
                    specs={pieces}
                    boardWidth={config.boardWidth}
                    boardHeight={config.boardHeight}
                    kerf={config.kerf}
                  />
                )}
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-[600px]"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="inline-block mb-8"
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 
                                  rounded-full flex items-center justify-center">
                      <span className="text-6xl">🪚</span>
                    </div>
                  </motion.div>
                  
                  <h2 className="text-2xl font-light mb-4">
                    Prêt à optimiser vos découpes
                  </h2>
                  
                  <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                    {pieces.length === 0 
                      ? "Ajoutez des pièces à découper dans le panneau de gauche pour commencer"
                      : "Cliquez sur le bouton pour lancer l'optimisation"}
                  </p>
                  
                  <button
                    onClick={handleOptimize}
                    disabled={pieces.length === 0 || isCalculating}
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 
                             text-white font-medium rounded-xl hover:shadow-2xl 
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all transform hover:scale-105 text-lg"
                  >
                    {isCalculating ? (
                      <span className="flex items-center justify-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Optimisation en cours...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span>🚀</span>
                        <span>Optimiser la découpe</span>
                      </span>
                    )}
                  </button>
                  
                  {pieces.length > 0 && (
                    <div className="mt-8 flex justify-center gap-8 text-sm text-neutral-600">
                      <div>
                        <span className="block text-2xl font-light text-neutral-900">{pieces.length}</span>
                        <span>types de pièces</span>
                      </div>
                      <div>
                        <span className="block text-2xl font-light text-neutral-900">
                          {pieces.reduce((sum, p) => sum + p.qty, 0)}
                        </span>
                        <span>pièces totales</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.main>
        </div>
      </div>
    </div>
  )
}