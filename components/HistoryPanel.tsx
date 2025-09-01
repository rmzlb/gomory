'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'

import {
  loadHistory,
  deleteFromHistory,
  clearHistory,
  formatTimestamp,
  exportConfiguration,
  type SavedConfiguration,
} from '@/lib/utils/history'

import type { PieceSpec, OptimizationConfig } from '@/lib/types'

interface HistoryPanelProps {
  onRestore: (config: OptimizationConfig, pieces: PieceSpec[]) => void
}

export default function HistoryPanel({ onRestore }: HistoryPanelProps) {
  const [history, setHistory] = useState<SavedConfiguration[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  // Load history on mount and when expanded
  useEffect(() => {
    if (isExpanded) {
      setHistory(loadHistory())
    }
  }, [isExpanded])

  // Refresh history periodically when expanded
  useEffect(() => {
    if (!isExpanded) return

    const interval = setInterval(() => {
      setHistory(loadHistory())
    }, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [isExpanded])

  const handleRestore = (item: SavedConfiguration) => {
    onRestore(item.config, item.pieces)
    setSelectedItem(item.id)

    // Visual feedback
    setTimeout(() => setSelectedItem(null), 1000)
  }

  const handleDelete = (id: string) => {
    deleteFromHistory(id)
    setHistory(loadHistory())
  }

  const handleClearAll = () => {
    if (confirm("Supprimer tout l'historique ?")) {
      clearHistory()
      setHistory([])
    }
  }

  const handleExport = (item: SavedConfiguration) => {
    exportConfiguration(item)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-neutral-50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-sm text-white">
            📜
          </div>
          <div className="text-left">
            <h3 className="text-sm font-medium text-neutral-900">Historique</h3>
            <p className="text-xs text-neutral-500">
              {history.length > 0
                ? `${history.length} configuration${history.length > 1 ? 's' : ''} sauvegardée${history.length > 1 ? 's' : ''}`
                : 'Aucune configuration sauvegardée'}
            </p>
          </div>
          {history.length > 0 && (
            <div className="flex flex-col items-end gap-1">
              <div
                className={`flex items-center gap-1 rounded-full px-2 py-1 ${
                  history.length >= 10
                    ? 'bg-red-100'
                    : history.length >= 7
                      ? 'bg-amber-100'
                      : 'bg-neutral-100'
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    history.length >= 10
                      ? 'text-red-700'
                      : history.length >= 7
                        ? 'text-amber-700'
                        : 'text-neutral-700'
                  }`}
                >
                  {history.length}
                </span>
                <span className="text-xs text-neutral-500">/</span>
                <span className="text-xs text-neutral-500">10</span>
              </div>
              {/* Visual progress bar */}
              <div className="h-1 w-20 overflow-hidden rounded-full bg-neutral-200">
                <div
                  className={`h-full transition-all ${
                    history.length >= 10
                      ? 'bg-red-500'
                      : history.length >= 7
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                  }`}
                  style={{ width: `${(history.length / 10) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-neutral-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-neutral-100"
          >
            <div className="max-h-96 overflow-y-auto p-3">
              {history.length === 0 ? (
                <div className="py-8 text-center text-sm text-neutral-500">
                  <p>Aucune configuration sauvegardée</p>
                  <p className="mt-2 text-xs">
                    Les configurations sont automatiquement sauvegardées lors de l'optimisation
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`relative cursor-pointer rounded-lg border p-3 transition-all ${
                        selectedItem === item.id
                          ? 'border-green-400 bg-green-50'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      } `}
                      onClick={() => handleRestore(item)}
                    >
                      {/* Item number badge */}
                      <div className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-medium text-white shadow-sm">
                        {index + 1}
                      </div>

                      {/* Configuration info */}
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                          <p className="mt-0.5 text-xs text-neutral-500">
                            {formatTimestamp(item.timestamp)}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="ml-2 flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleExport(item)
                            }}
                            className="rounded p-1.5 transition-colors hover:bg-neutral-200"
                            title="Exporter"
                          >
                            <svg
                              className="h-3.5 w-3.5 text-neutral-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(item.id)
                            }}
                            className="rounded p-1.5 transition-colors hover:bg-red-100"
                            title="Supprimer"
                          >
                            <svg
                              className="h-3.5 w-3.5 text-red-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-neutral-600">
                          Planche: {item.config.boardWidth}×{item.config.boardHeight}mm
                        </span>
                        {item.result && (
                          <>
                            <span className="text-neutral-400">•</span>
                            <span
                              className={`font-medium ${
                                item.result.utilization > 0.8
                                  ? 'text-green-600'
                                  : item.result.utilization > 0.6
                                    ? 'text-neutral-600'
                                    : 'text-amber-600'
                              }`}
                            >
                              {Math.round(item.result.utilization * 100)}%
                            </span>
                            <span className="text-neutral-400">•</span>
                            <span className="text-neutral-600">
                              {item.result.pieceCount} pièces
                            </span>
                          </>
                        )}
                      </div>

                      {/* Visual preview of pieces */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.pieces
                          .filter((p) => p.qty > 0)
                          .slice(0, 5)
                          .map((piece, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 text-xs"
                            >
                              <span className="font-medium">{piece.id}</span>
                              <span className="text-neutral-500">
                                {piece.w}×{piece.h}
                              </span>
                              {piece.qty > 1 && (
                                <span className="font-medium text-blue-600">×{piece.qty}</span>
                              )}
                            </span>
                          ))}
                        {item.pieces.filter((p) => p.qty > 0).length > 5 && (
                          <span className="text-xs text-neutral-500">
                            +{item.pieces.filter((p) => p.qty > 0).length - 5}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Clear all button */}
                  {history.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="mt-2 w-full py-2 text-xs text-neutral-500 transition-colors hover:text-red-500"
                    >
                      Effacer tout l'historique
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
