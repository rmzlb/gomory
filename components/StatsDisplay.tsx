'use client'

import { motion } from 'motion/react'

import type { OptimizationResult } from '@/lib/types'

interface StatsDisplayProps {
  result: OptimizationResult | null
  pieceCount: number
}

export default function StatsDisplay({ result, pieceCount }: StatsDisplayProps) {
  if (!result) {
    return (
      <motion.div
        className="rounded-2xl bg-white/90 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-sm text-neutral-500">Entrez des pièces pour commencer</div>
      </motion.div>
    )
  }

  const stats = [
    {
      label: 'Utilisation',
      value: `${(result.utilization * 100).toFixed(0)}%`,
      color:
        result.utilization > 0.8
          ? 'text-green-600'
          : result.utilization > 0.6
            ? 'text-neutral-900'
            : 'text-red-500',
    },
    {
      label: 'Planches',
      value: result.boards.length,
      color: 'text-neutral-900',
    },
    {
      label: 'Coupes',
      value: result.cuts.length,
      color: 'text-neutral-900',
    },
    {
      label: 'Pièces',
      value: `${result.allPieces.length}/${pieceCount}`,
      color: result.allPieces.length === pieceCount ? 'text-green-600' : 'text-red-500',
    },
  ]

  return (
    <motion.div
      className="rounded-2xl bg-white/90 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            <div className="mb-0.5 text-xs text-neutral-500">{stat.label}</div>
            <div className={`text-2xl font-light ${stat.color}`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
