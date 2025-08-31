'use client'

import { motion } from 'motion/react'

import type { OptimizationResult, PieceSpec, Strip, BoardLayout, PlacedPiece } from '@/lib/types'

interface TestsCardProps {
  result: OptimizationResult
  specs: PieceSpec[]
  boardWidth: number
  boardHeight: number
  kerf: number
}

export default function TestsCard({
  result,
  specs,
  boardWidth,
  boardHeight,
  kerf,
}: TestsCardProps) {
  const eps = 1e-6
  const issues: string[] = []
  const warnings: string[] = []
  const passes: string[] = []

  // Surface checks
  const expectedArea = specs.reduce((acc, s) => acc + s.w * s.h * s.qty, 0)
  const actualArea = result.allPieces.reduce((acc, p) => acc + p.w * p.h, 0)
  if (Math.abs(expectedArea - actualArea) < eps) {
    passes.push('Surface totale correcte ✓')
  } else {
    issues.push(`Surface: attendu ${expectedArea} mm², obtenu ${actualArea} mm²`)
  }

  // Quantity checks
  const perSpecExp: Record<string, number> = {}
  specs.forEach((s) => (perSpecExp[s.id] = s.qty))
  const perSpecGot: Record<string, number> = {}
  result.allPieces.forEach((p) => {
    perSpecGot[p.specId] = (perSpecGot[p.specId] || 0) + 1
  })

  let quantityOk = true
  for (const s of specs) {
    if ((perSpecGot[s.id] || 0) !== s.qty) {
      issues.push(`Quantité ${s.id}: ${perSpecGot[s.id] || 0}/${s.qty}`)
      quantityOk = false
    }
  }
  if (quantityOk) passes.push('Quantités conformes ✓')

  // Find strip for piece
  function findStripForPiece(b: BoardLayout, p: PlacedPiece): Strip | null {
    for (const st of b.strips) {
      const inCol = p.x + eps >= st.x && p.x + p.w <= st.x + st.width + eps
      const sameY = Math.abs(p.y - st.y) < eps
      if (inCol && sameY) return st
    }
    return null
  }

  // Bounds checks
  let boundsOk = true
  result.boards.forEach((b) => {
    const pieces = b.strips.flatMap((st) => st.pieces)
    pieces.forEach((p) => {
      if (
        p.x < -eps ||
        p.y < -eps ||
        p.x + p.w > boardWidth + eps ||
        p.y + p.h > boardHeight + eps
      ) {
        issues.push(`${p.id}: hors limites`)
        boundsOk = false
      }

      const st = findStripForPiece(b, p)
      if (!st) {
        warnings.push(`${p.id}: bande non trouvée`)
      } else {
        if (p.h - st.height > eps) {
          warnings.push(`${p.id}: dépasse la bande`)
        }
      }
    })
  })
  if (boundsOk) passes.push('Aucune pièce hors limites ✓')

  // Overlap test
  function overlap(a: PlacedPiece, b: PlacedPiece): boolean {
    const ax1 = a.x,
      ay1 = a.y,
      ax2 = a.x + a.w,
      ay2 = a.y + a.h
    const bx1 = b.x,
      by1 = b.y,
      bx2 = b.x + b.w,
      by2 = b.y + b.h
    const ix = Math.max(0, Math.min(ax2, bx2) - Math.max(ax1, bx1))
    const iy = Math.max(0, Math.min(ay2, by2) - Math.max(ay1, by1))
    return ix > eps && iy > eps
  }

  let overlapFound = false
  result.boards.forEach((b) => {
    const pieces = b.strips.flatMap((st) => st.pieces)
    for (let i = 0; i < pieces.length; i++) {
      for (let j = i + 1; j < pieces.length; j++) {
        if (overlap(pieces[i], pieces[j])) {
          issues.push(`Chevauchement: ${pieces[i].id} & ${pieces[j].id}`)
          overlapFound = true
        }
      }
    }
  })
  if (!overlapFound) passes.push('Aucun chevauchement ✓')

  // Kerf checks
  let kerfOk = true
  result.boards.forEach((b) => {
    const byCol = new Map<string, Strip[]>()
    b.strips.forEach((st) => {
      const key = `${st.x}-${st.width}`
      if (!byCol.has(key)) byCol.set(key, [])
      byCol.get(key)!.push(st)
    })

    for (const [, sts] of byCol) {
      sts.sort((a, b) => a.y - b.y)

      // Vertical kerf between strips
      for (let i = 1; i < sts.length; i++) {
        const expectedY = sts[i - 1].y + sts[i - 1].height + kerf
        const diff = Math.abs(sts[i].y - expectedY)
        if (diff > eps) {
          warnings.push(`Écart kerf vertical: ${diff.toFixed(3)} mm`)
          kerfOk = false
        }
      }

      // Horizontal kerf between pieces
      for (const st of sts) {
        const sorted = st.pieces.slice().sort((a, b) => a.x - b.x)
        for (let i = 1; i < sorted.length; i++) {
          const gap = sorted[i].x - (sorted[i - 1].x + sorted[i - 1].w)
          const diff = Math.abs(gap - kerf)
          if (diff > eps) {
            warnings.push(`Écart kerf horizontal: ${diff.toFixed(3)} mm`)
            kerfOk = false
          }
        }
      }
    }
  })
  if (kerfOk) passes.push('Kerf respecté ✓')

  // Cut duplicates
  const cutKey = (c: any) => `${c.boardIndex}|${c.type}|${c.x1}|${c.y1}|${c.x2}|${c.y2}`
  const mapCuts = new Map<string, number>()
  result.cuts.forEach((c) => {
    const key = cutKey(c)
    mapCuts.set(key, (mapCuts.get(key) || 0) + 1)
  })
  const duplicates = Array.from(mapCuts.entries()).filter(([, n]) => n > 1)
  if (duplicates.length > 0) {
    issues.push(`Coupes dupliquées: ${duplicates.length}`)
  } else {
    passes.push('Pas de double-comptage ✓')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-neutral-200 bg-white p-5"
    >
      <h3 className="mb-3 text-base font-medium">🧪 Tests automatiques</h3>

      <div className="grid gap-4 text-sm md:grid-cols-3">
        <div>
          <div className="mb-2 font-medium text-green-600">Pass ✅</div>
          {passes.length === 0 ? (
            <div className="text-xs text-neutral-400">—</div>
          ) : (
            passes.map((t, i) => (
              <div key={i} className="mb-1 text-xs text-neutral-600">
                • {t}
              </div>
            ))
          )}
        </div>

        <div>
          <div className="mb-2 font-medium text-yellow-600">Avertissements ⚠️</div>
          {warnings.length === 0 ? (
            <div className="text-xs text-neutral-400">—</div>
          ) : (
            warnings.map((t, i) => (
              <div key={i} className="mb-1 text-xs text-neutral-600">
                • {t}
              </div>
            ))
          )}
        </div>

        <div>
          <div className="mb-2 font-medium text-red-600">Erreurs ❌</div>
          {issues.length === 0 ? (
            <div className="text-xs text-neutral-400">—</div>
          ) : (
            issues.map((t, i) => (
              <div key={i} className="mb-1 text-xs text-neutral-600">
                • {t}
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}
