'use client'

import confetti from 'canvas-confetti'
import { motion } from 'motion/react'
import { useState } from 'react'

import { optimizeCutting } from '@/lib/optimizer'
import { saveToHistory } from '@/lib/utils/history'
import { validateConfiguration } from '@/lib/utils/validation'

import BoardInput from './BoardInput'
import BoardVisualizer from './BoardVisualizer'
import ExportPanel from './ExportPanel'
import HistoryPanel from './HistoryPanel'
import HowItWorks from './HowItWorks'
import PieceInput from './PieceInput'
import PositioningReport from './PositioningReport'
import TestsCard from './TestsCard'
import VerificationCard from './VerificationCard'

import type { PieceSpec, OptimizationConfig, OptimizationResult } from '@/lib/types'

export default function CuttingOptimizer() {
  // Board configuration
  const [config, setConfig] = useState<OptimizationConfig>({
    boardWidth: 1500,
    boardHeight: 5000,
    kerf: 3,
    allowRotate: true,
    forceTwoColumns: true,
    objective: 'balanced',
    useAdvancedOptimizer: false,
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

  // Validate configuration
  const validation = validateConfiguration(config, pieces)
  const hasErrors = validation.errors.length > 0
  const hasWarnings = validation.warnings.length > 0

  // Calculate optimization when button is clicked
  const handleOptimize = () => {
    if (pieces.length === 0 || hasErrors) return
    setIsCalculating(true)
    setShowResults(false)

    setTimeout(() => {
      const res = optimizeCutting(config, pieces)
      setResult(res)
      setIsCalculating(false)
      setShowResults(true)

      // Save to history
      saveToHistory(config, pieces, res)

      // Scroll to visualization on mobile devices
      if (window.innerWidth < 1024) {
        // lg breakpoint
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
          colors: ['#10b981', '#3b82f6', '#8b5cf6'],
        })
      }
    }, 500)
  }

  const updateConfig = (updates: Partial<OptimizationConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }

  const handleRestore = (restoredConfig: OptimizationConfig, restoredPieces: PieceSpec[]) => {
    setConfig(restoredConfig)
    setPieces(restoredPieces)
    setShowResults(false)
    setResult(null)
  }

  const resetExample = () => {
    setConfig({
      boardWidth: 1500,
      boardHeight: 5000,
      kerf: 3,
      allowRotate: true,
      forceTwoColumns: true,
      objective: 'balanced',
      useAdvancedOptimizer: false,
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
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-light">Optimiseur de découpe</h1>
              <p className="mt-1 text-sm text-neutral-500">
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
                  <div
                    className={`text-xl font-light ${
                      result.utilization > 0.8
                        ? 'text-green-600'
                        : result.utilization > 0.6
                          ? 'text-neutral-900'
                          : 'text-red-500'
                    }`}
                  >
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

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* How it works explanation */}
        <HowItWorks />

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left sidebar - Controls */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full space-y-4 lg:w-[360px] lg:flex-shrink-0"
          >
            {/* Board configuration */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <BoardInput
                boardWidth={config.boardWidth}
                boardHeight={config.boardHeight}
                kerf={config.kerf}
                allowRotate={config.allowRotate}
                forceTwoColumns={config.forceTwoColumns}
                objective={config.objective}
                useAdvancedOptimizer={config.useAdvancedOptimizer}
                onChange={updateConfig}
              />
            </div>

            {/* Pieces input */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <PieceInput pieces={pieces} onChange={setPieces} />
            </div>

            {/* History panel */}
            <HistoryPanel onRestore={handleRestore} />

            {/* Optimize button in sidebar */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              {/* Validation messages */}
              {(hasErrors || hasWarnings) && (
                <div className="mb-3 space-y-2">
                  {validation.errors.map((error, i) => (
                    <motion.div
                      key={`error-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-2 rounded-lg bg-red-50 p-2 text-xs"
                    >
                      <span className="text-red-600">⚠️</span>
                      <span className="text-red-700">{error}</span>
                    </motion.div>
                  ))}
                  {validation.warnings.map((warning, i) => (
                    <motion.div
                      key={`warning-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-xs"
                    >
                      <span className="text-amber-600">⚡</span>
                      <span className="text-amber-700">{warning}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              <button
                onClick={handleOptimize}
                disabled={pieces.length === 0 || isCalculating || hasErrors}
                className="w-full transform rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-medium text-white transition-all hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCalculating ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                    />
                    Optimisation en cours...
                  </span>
                ) : showResults ? (
                  '🔄 Recalculer'
                ) : (
                  '🚀 Optimiser la découpe'
                )}
              </button>
            </div>

            {/* Action buttons */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="space-y-3">
                <button
                  onClick={resetExample}
                  className="w-full rounded-lg bg-neutral-100 px-4 py-2 text-sm transition-colors hover:bg-neutral-200"
                >
                  Réinitialiser l&apos;exemple
                </button>
                {showResults && (
                  <button
                    onClick={() => setShowTests(!showTests)}
                    className="w-full rounded-lg bg-neutral-100 px-4 py-2 text-sm transition-colors hover:bg-neutral-200"
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
            className="min-w-0 flex-1 space-y-4"
          >
            {/* Zoom controls */}
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Zoom visuel</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 transition-colors hover:bg-neutral-200"
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
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 transition-colors hover:bg-neutral-200"
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                  <span className="w-12 text-right text-sm text-neutral-500">
                    {(zoom * 100).toFixed(0)}%
                  </span>
                  <div className="ml-4 flex gap-1">
                    <button
                      onClick={() => setZoom(0.75)}
                      className="rounded-lg bg-neutral-100 px-3 py-1 text-xs transition-colors hover:bg-neutral-200"
                    >
                      75%
                    </button>
                    <button
                      onClick={() => setZoom(1)}
                      className="rounded-lg bg-neutral-100 px-3 py-1 text-xs transition-colors hover:bg-neutral-200"
                    >
                      100%
                    </button>
                    <button
                      onClick={() => setZoom(1.5)}
                      className="rounded-lg bg-neutral-100 px-3 py-1 text-xs transition-colors hover:bg-neutral-200"
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
                <div className="mb-4 flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4">
                  <div>
                    <h3 className="font-medium">Plan de découpe complet</h3>
                    <p className="mt-1 text-sm text-neutral-600">
                      {result.boards.length} planche{result.boards.length > 1 ? 's' : ''} •{' '}
                      {result.allPieces.length} pièces • {(result.utilization * 100).toFixed(1)}%
                      d'utilisation
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
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {/* Positioning report */}
                  <PositioningReport boards={result.boards} cuts={result.cuts} />

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
                className="flex min-h-[600px] items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="mb-8 inline-block"
                  >
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
                      <span className="text-6xl">🪚</span>
                    </div>
                  </motion.div>

                  <h2 className="mb-4 text-2xl font-light">Prêt à optimiser vos découpes</h2>

                  <p className="mx-auto mb-8 max-w-md text-neutral-600">
                    {pieces.length === 0
                      ? 'Ajoutez des pièces à découper dans le panneau de gauche pour commencer'
                      : hasErrors
                        ? 'Corrigez les erreurs de configuration pour continuer'
                        : "Cliquez sur le bouton pour lancer l'optimisation"}
                  </p>

                  {/* Show validation errors in center view */}
                  {hasErrors && (
                    <div className="mx-auto mb-6 max-w-md space-y-2">
                      {validation.errors.map((error, i) => (
                        <motion.div
                          key={`center-error-${i}`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm"
                        >
                          <span className="text-red-600">⚠️</span>
                          <span className="text-red-700">{error}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={handleOptimize}
                    disabled={pieces.length === 0 || isCalculating || hasErrors}
                    className="transform rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-lg font-medium text-white transition-all hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isCalculating ? (
                      <span className="flex items-center justify-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
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
                        <span className="block text-2xl font-light text-neutral-900">
                          {pieces.length}
                        </span>
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
