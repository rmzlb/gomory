'use client'

import { motion } from 'motion/react'

import type { HeuristicTrace } from '@/lib/types'

interface HeuristicSummaryProps {
  heuristics: HeuristicTrace[]
}

export default function HeuristicSummary({ heuristics }: HeuristicSummaryProps) {
  if (!heuristics || heuristics.length <= 1) return null

  const best = heuristics.find((h) => h.selected)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs text-neutral-600"
    >
      <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wide text-neutral-400">
        <span>Comparaison heuristique</span>
        {best && (
          <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
            Meilleur · {best.label}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {heuristics.map((heuristic) => (
          <div
            key={heuristic.id}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
              heuristic.selected
                ? 'border-green-300 bg-green-50 text-green-700'
                : 'border-neutral-200 bg-neutral-50'
            }`}
          >
            <span className="text-[11px] font-medium">{heuristic.label}</span>
            <span className="text-[10px] text-neutral-400">
              {(heuristic.metrics.utilization * 100).toFixed(1)}% · {heuristic.metrics.boards}{' '}
              planche
              {heuristic.metrics.boards > 1 ? 's' : ''} · {heuristic.metrics.cuts} coupes
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
