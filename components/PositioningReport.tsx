'use client'

import { motion } from 'motion/react'

import type { BoardLayout, Cut } from '@/lib/types'

interface PositioningReportProps {
  boards: BoardLayout[]
  cuts: Cut[]
}

export default function PositioningReport({ boards, cuts }: PositioningReportProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-neutral-200 bg-white p-5"
    >
      <h3 className="mb-3 text-base font-medium">📝 Compte-rendu de positionnement</h3>
      <div className="space-y-3 text-sm">
        {boards.map((b) => {
          const byColumn = new Map<string, typeof b.strips>()
          b.strips.forEach((st) => {
            const key = `${st.x}-${st.width}`
            if (!byColumn.has(key)) byColumn.set(key, [])
            byColumn.get(key)!.push(st)
          })

          return (
            <div key={b.index} className="border-b border-neutral-100 pb-3 last:border-0">
              <div className="mb-2 font-medium">
                Planche #{b.index + 1} — {b.width} × {b.height} mm
              </div>

              {[...byColumn.entries()]
                .sort((a, b) => parseFloat(a[0].split('-')[0]) - parseFloat(b[0].split('-')[0]))
                .map(([key, strips], idx) => {
                  const [sx, sw] = key.split('-').map(Number)
                  strips.sort((a, b) => a.y - b.y)

                  return (
                    <div key={key} className="mb-2 ml-3">
                      <div className="mb-1 text-xs text-neutral-600">
                        Colonne {idx + 1}: X {sx} → {sx + sw} mm (largeur {sw} mm)
                      </div>
                      {strips.map((st, si) => (
                        <div key={si} className="ml-3">
                          <div className="text-xs text-neutral-500">
                            • Bande {si + 1} @ Y={st.y} mm, hauteur {st.height} mm:
                          </div>
                          <div className="ml-3 text-xs">
                            {st.pieces.map((p) => (
                              <div key={p.id} className="text-neutral-400">
                                – {p.id} ({p.specId}) {p.rotated ? '↻ ' : ''}
                                {Math.round(p.w)}×{Math.round(p.h)} mm @ ({Math.round(p.x)},{' '}
                                {Math.round(p.y)})
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}

              <div className="mt-2 text-xs text-neutral-500">
                Coupes sur la planche: {cuts.filter((c) => c.boardIndex === b.index).length}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
