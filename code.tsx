import React, { useMemo, useState } from 'react'

/**
 * Optimiseur de Découpe Bois – Guillotine (One‑Shot)
 * v2 — Ajoute un essai « 1 planche / 2‑colonnes » (two‑stage guillotine) + compte‑rendu écrit
 *
 * - Heuristique prioritaire : essai 1 planche avec scission verticale maîtresse (two‑stage)
 *   • splitX choisi parmi un ensemble de largeurs candidates (w et h des pièces)
 *   • chaque colonne est packée avec un algorithme « shelf/NFDH » (bandes horizontales)
 * - Fallback : heuristique guillotine en bandes pleine largeur (packGuillotine)
 * - Comptage des coupes : lignes guillotine edge‑to‑edge, sans double‑comptage entre bandes
 * - Visualisation : SVG proportionnel, badges des coupes, bords alignés
 * - Rapport écrit : détail par planche/colonne/bande + résumé des coupes
 *
 * ⚠️ Tout est en millimètres en interne
 */

// ---------- Types ----------

type Unit = 'mm' | 'cm' | 'm'

type PieceSpec = { id: string; w: number; h: number; qty: number }

type PlacedPiece = {
  id: string // #1, #2, ...
  specId: string
  w: number
  h: number
  rotated: boolean
  x: number
  y: number
  boardIndex: number
  stripIndex: number
}

type Strip = {
  x: number // origine X de la bande (colonne)
  width: number // largeur utile de la bande/colonne
  y: number // top Y de la bande
  height: number // hauteur de la bande
  pieces: PlacedPiece[]
  usedWidth: number // largeur utilisée (sans compter le kerf de droite)
}

type BoardLayout = {
  index: number
  strips: Strip[]
  width: number
  height: number
  columnSplits?: number[] // positions X des scissions verticales maîtresses
}

type Cut = {
  id: number
  type: 'H' | 'V'
  x1: number
  y1: number
  x2: number
  y2: number
  boardIndex: number
}

// ---------- Helpers ----------
const unitFactor: Record<Unit, number> = { mm: 1, cm: 10, m: 1000 }

function mm(value: number, unit: Unit): number {
  return Math.round((Number.isFinite(value as any) ? value : 0) * unitFactor[unit])
}

function fmt(vmm: number, unit: Unit) {
  if (unit === 'mm') return `${vmm} mm`
  if (unit === 'cm') return `${(vmm / 10).toFixed(1)} cm`
  return `${(vmm / 1000).toFixed(3)} m`
}

// ---------- Core: Shelf packer (NFDH‑like) pour une colonne ----------

function packColumnShelves(
  board: BoardLayout,
  colX: number,
  colW: number,
  boardH: number,
  items: { specId: string; w: number; h: number; id: string }[],
  kerf: number,
  allowRotate: boolean,
  startingY = 0
): { success: boolean; usedHeight: number; placed: PlacedPiece[]; strips: Strip[] } {
  // Tri NFDH : hauteurs décroissantes (après choix d'orientation au plus haut)
  const sortable = items.map((it) => {
    const o1 = { w: it.w, h: it.h, rot: false }
    const o2 = allowRotate ? { w: it.h, h: it.w, rot: true } : null
    // Choisir l'orientation qui rentre et maximise la hauteur (meilleur empilement vertical)
    const cand = [o1, o2].filter(Boolean) as { w: number; h: number; rot: boolean }[]
    // Si aucune orient ne tient en largeur → on échoue directement
    const feasible = cand.filter((c) => c.w <= colW)
    if (feasible.length === 0) return { ...it, w: it.w, h: it.h, rot: false, keyH: -1 }
    // pick tallest
    feasible.sort((a, b) => b.h - a.h)
    const best = feasible[0]
    return { ...it, w: best.w, h: best.h, rot: best.rot, keyH: best.h }
  })

  // Si un item keyH == -1 → il ne peut pas rentrer
  if (sortable.some((s) => s.keyH === -1))
    return { success: false, usedHeight: 0, placed: [], strips: [] }

  sortable.sort((a, b) => b.h - a.h || Math.max(b.w, b.h) - Math.max(a.w, a.h))

  const strips: Strip[] = []
  const placed: PlacedPiece[] = []

  let y = startingY // démarrage en haut
  // Construire les bandes successives
  while (sortable.length > 0) {
    const stripItems: typeof sortable = []
    const stripHeight = sortable[0].h // NFDH : hauteur de la première pièce

    // Sélectionner les pièces qui tiennent en hauteur (même hauteur max pour la bande)
    for (let i = 0; i < sortable.length; ) {
      if (sortable[i].h <= stripHeight) {
        stripItems.push(sortable.splice(i, 1)[0])
      } else {
        i++
      }
    }

    // Remplir la bande de gauche à droite
    let x = colX
    let used = 0
    const rowPieces: PlacedPiece[] = []
    for (let i = 0; i < stripItems.length; ) {
      const it = stripItems[i]
      const needW = used === 0 ? it.w : it.w + kerf
      if (colX + used + needW <= colX + colW) {
        const px = colX + (used === 0 ? 0 : used + kerf)
        const piece: PlacedPiece = {
          id: it.id,
          specId: it.specId,
          w: it.w,
          h: it.h,
          rotated: it.rot,
          x: px,
          y,
          boardIndex: board.index,
          stripIndex: strips.length,
        }
        rowPieces.push(piece)
        used = px - colX + it.w // distance depuis colX jusqu'au bord droit de la pièce
        i++
      } else {
        // pas de place → pièce non placée, on la remet en tête du tableau global pour la bande suivante
        sortable.unshift(stripItems.splice(i, 1)[0])
      }
    }

    const strip: Strip = {
      x: colX,
      width: colW,
      y,
      height: stripHeight,
      pieces: rowPieces,
      usedWidth: used,
    }
    strips.push(strip)
    placed.push(...rowPieces)

    y = y + stripHeight + kerf // bande suivante sous la précédente
    if (y > boardH + 1e-6) return { success: false, usedHeight: 0, placed: [], strips: [] }
  }

  const usedHeight =
    strips.length === 0
      ? 0
      : strips[strips.length - 1].y + strips[strips.length - 1].height - startingY
  return { success: true, usedHeight, placed, strips }
}

// ---------- Essai « 1 planche / 2‑colonnes » ----------

function tryOneBoardTwoColumns(
  boardW: number,
  boardH: number,
  specs: PieceSpec[],
  kerf: number,
  allowRotate: boolean
): { boards: BoardLayout[]; allPieces: PlacedPiece[] } | null {
  // Générer la liste des pièces (id stables #1..)
  const items: { specId: string; w: number; h: number; id: string }[] = []
  let counter = 1
  for (const s of specs)
    for (let q = 0; q < s.qty; q++)
      items.push({ specId: s.id, w: s.w, h: s.h, id: `#${counter++}` })

  // Largeurs candidates pour splitX : toutes largeurs/hauteurs possibles (rotation) triées décroissantes et ≤ boardW - 50
  const candSet = new Set<number>()
  items.forEach((it) => {
    candSet.add(it.w)
    candSet.add(it.h)
  })
  const candidates = Array.from(candSet)
    .filter((w) => w > 0 && w < boardW - 50)
    .sort((a, b) => b - a)

  // Essayer chaque splitX : colonne gauche = [0, splitX], coupe (kerf), colonne droite = [splitX+kerf, boardW]
  for (const splitX of candidates) {
    const colL = { x: 0, w: splitX }
    const colR = { x: splitX + kerf, w: boardW - splitX - kerf }
    if (colR.w <= 0) continue

    // Répartition gloutonne : envoyer d'abord les pièces les plus larges vers la colonne où elles tiennent le mieux
    const itemsSorted = items.slice().sort((a, b) => Math.max(b.w, b.h) - Math.max(a.w, a.h))
    const left: typeof items = []
    const right: typeof items = []

    // simulateur de hauteur NFDH approximatif pour affectation gloutonne
    type Sim = { totalH: number; rowH: number; rowRemW: number }
    const simL: Sim = { totalH: 0, rowH: 0, rowRemW: colL.w }
    const simR: Sim = { totalH: 0, rowH: 0, rowRemW: colR.w }

    function bestOrientFor(colW: number, it: { w: number; h: number }) {
      const o: { w: number; h: number }[] = [{ w: it.w, h: it.h }]
      if (allowRotate) o.push({ w: it.h, h: it.w })
      const feas = o.filter((k) => k.w <= colW)
      if (feas.length === 0) return null
      feas.sort((a, b) => b.h - a.h) // privilégier hauteur
      return feas[0]
    }
    function simulate(sim: Sim, colW: number, wh: { w: number; h: number }) {
      // copie
      let { totalH, rowH, rowRemW } = sim
      const needW = rowRemW === colW ? wh.w : wh.w + kerf
      if (needW <= rowRemW) {
        rowRemW -= needW
        rowH = Math.max(rowH, wh.h)
      } else {
        // nouvelle bande
        if (rowH > 0) totalH += rowH + kerf
        rowH = wh.h
        rowRemW = colW - wh.w
      }
      return { totalH, rowH, rowRemW, predicted: totalH + rowH }
    }

    let valid = true
    for (const it of itemsSorted) {
      const fitL = bestOrientFor(colL.w, it)
      const fitR = bestOrientFor(colR.w, it)
      if (fitL && !fitR) {
        left.push(it)
        const s = simulate(simL, colL.w, fitL)
        simL.totalH = s.totalH
        simL.rowH = s.rowH
        simL.rowRemW = s.rowRemW
      } else if (!fitL && fitR) {
        right.push(it)
        const s = simulate(simR, colR.w, fitR)
        simR.totalH = s.totalH
        simR.rowH = s.rowH
        simR.rowRemW = s.rowRemW
      } else if (fitL && fitR) {
        const sL = simulate({ ...simL }, colL.w, fitL)
        const sR = simulate({ ...simR }, colR.w, fitR)
        if (sL.predicted <= sR.predicted) {
          left.push(it)
          simL.totalH = sL.totalH
          simL.rowH = sL.rowH
          simL.rowRemW = sL.rowRemW
        } else {
          right.push(it)
          simR.totalH = sR.totalH
          simR.rowH = sR.rowH
          simR.rowRemW = sR.rowRemW
        }
      } else {
        valid = false
        break
      }
    }

    if (!valid) continue

    // Pack colonne gauche puis droite
    const board: BoardLayout = {
      index: 0,
      strips: [],
      width: boardW,
      height: boardH,
      columnSplits: [splitX],
    }

    const leftPack = packColumnShelves(board, colL.x, colL.w, boardH, left, kerf, allowRotate, 0)
    if (!leftPack.success) continue

    const rightPack = packColumnShelves(board, colR.x, colR.w, boardH, right, kerf, allowRotate, 0)
    if (!rightPack.success) continue

    // Vérif : toutes les pièces placées ?
    const placed = [...leftPack.placed, ...rightPack.placed]
    if (placed.length !== items.length) continue

    // OK — construit la planche
    board.strips = [...leftPack.strips, ...rightPack.strips].sort((a, b) => a.y - b.y || a.x - b.x)
    return { boards: [board], allPieces: placed }
  }

  return null // aucun split ne passe
}

// ---------- Fallback : Guillotine bandes pleine largeur ----------

function packGuillotine(
  boardW: number,
  boardH: number,
  specs: PieceSpec[],
  kerf: number,
  allowRotate: boolean,
  objective: 'waste' | 'cuts' | 'balanced' = 'balanced'
): { boards: BoardLayout[]; allPieces: PlacedPiece[] } {
  // Expand all pieces
  const expanded: { specId: string; w: number; h: number; id: string }[] = []
  let counter = 1
  for (const s of specs)
    for (let i = 0; i < s.qty; i++)
      expanded.push({ specId: s.id, w: s.w, h: s.h, id: `#${counter++}` })

  // Sorting strategy according to objective
  expanded.sort((a, b) => {
    const aMax = Math.max(a.w, a.h)
    const bMax = Math.max(b.w, b.h)
    const aArea = a.w * a.h
    const bArea = b.w * b.h
    if (objective === 'cuts') return bMax - aMax || bArea - aArea // bandes plus uniformes
    if (objective === 'waste') return bArea - aArea || bMax - aMax // FFD sur l'aire
    return bMax - aMax || bArea - aArea // équilibré
  })

  const boards: BoardLayout[] = []
  const placed: PlacedPiece[] = []

  function newBoard(): BoardLayout {
    const b: BoardLayout = {
      index: boards.length,
      strips: [],
      width: boardW,
      height: boardH,
      columnSplits: [],
    }
    boards.push(b)
    return b
  }

  let board = newBoard()

  for (const item of expanded) {
    let placedFlag = false

    const candidateStrips = board.strips
      .map((st, idx) => ({ st, idx }))
      .filter(({ st }) => {
        const fitsNormal = item.h <= st.height
        const fitsRot = allowRotate && item.w <= st.height
        return fitsNormal || fitsRot
      })
      .sort((a, b) => a.st.height - b.st.height)

    for (const { st, idx } of candidateStrips) {
      const nextX =
        st.pieces.length === 0 ? st.x : st.x + st.usedWidth + (st.usedWidth > 0 ? kerf : 0)
      const tryOrients = [{ w: item.w, h: item.h, rot: false }] as const
      const orients = allowRotate
        ? [
            { w: item.w, h: item.h, rot: false },
            { w: item.h, h: item.w, rot: true },
          ]
        : [{ w: item.w, h: item.h, rot: false }]
      // préférer orientation qui colle au bord droit
      orients.sort(
        (o1, o2) =>
          Math.abs(st.x + st.width - (nextX + o1.w)) - Math.abs(st.x + st.width - (nextX + o2.w))
      )
      for (const o of orients) {
        if (o.h <= st.height && nextX + o.w <= st.x + st.width) {
          const piece: PlacedPiece = {
            id: item.id,
            specId: item.specId,
            w: o.w,
            h: o.h,
            rotated: o.rot,
            x: nextX,
            y: st.y,
            boardIndex: board.index,
            stripIndex: idx,
          }
          st.pieces.push(piece)
          st.usedWidth = piece.x - st.x + piece.w
          placed.push(piece)
          placedFlag = true
          break
        }
      }
      if (placedFlag) break
    }

    if (placedFlag) continue

    // nouvelle bande pleine largeur
    const orients = allowRotate
      ? [
          { w: item.w, h: item.h, rot: false },
          { w: item.h, h: item.w, rot: true },
        ]
      : [{ w: item.w, h: item.h, rot: false }]
    orients.sort((a, b) => b.h - a.h) // favoriser bandes hautes

    const chosen = orients[0]
    const totalHeightUsed = board.strips.reduce(
      (acc, s, i) => acc + s.height + (i > 0 ? kerf : 0),
      0
    )
    const stripY = totalHeightUsed + (board.strips.length > 0 ? kerf : 0)

    if (stripY + chosen.h > boardH) {
      board = newBoard()
    }

    const stripY2 =
      board.strips.reduce((acc, s, i) => acc + s.height + (i > 0 ? kerf : 0), 0) +
      (board.strips.length > 0 ? kerf : 0)
    const strip: Strip = {
      x: 0,
      width: boardW,
      y: stripY2,
      height: chosen.h,
      pieces: [],
      usedWidth: 0,
    }
    board.strips.push(strip)

    const piece: PlacedPiece = {
      id: item.id,
      specId: item.specId,
      w: chosen.w,
      h: chosen.h,
      rotated: chosen.rot,
      x: 0,
      y: strip.y,
      boardIndex: board.index,
      stripIndex: board.strips.length - 1,
    }
    strip.pieces.push(piece)
    strip.usedWidth = chosen.w
    placed.push(piece)
  }

  return { boards, allPieces: placed }
}

// ---------- Cut counting (par bande/colonne, sans doublon) ----------

function computeCuts(boards: BoardLayout[], boardW: number, boardH: number, kerf: number) {
  const cuts: Cut[] = []
  let cid = 1
  const keySet = new Set<string>() // pour dédoublonner (board,type,x1,y1,x2,y2)

  for (const b of boards) {
    // Coupes verticales maîtresses (scissions de colonnes)
    ;(b.columnSplits || []).forEach((x) => {
      const k = `B${b.index}|V|${x}|0|${x}|${boardH}`
      if (!keySet.has(k)) {
        keySet.add(k)
        cuts.push({ id: cid++, type: 'V', x1: x, y1: 0, x2: x, y2: boardH, boardIndex: b.index })
      }
    })

    // Horizontales : bas de chaque bande, limitées à la largeur de la colonne
    for (let i = 0; i < b.strips.length; i++) {
      const st = b.strips[i]
      const y = st.y + st.height
      // entre bandes (si autre bande au‑dessus/au‑dessous dans la même colonne)
      const k = `B${b.index}|H|${st.x}|${y}|${st.x + st.width}|${y}`
      if (y < boardH && !keySet.has(k)) {
        keySet.add(k)
        cuts.push({
          id: cid++,
          type: 'H',
          x1: st.x,
          y1: y,
          x2: st.x + st.width,
          y2: y,
          boardIndex: b.index,
        })
      }
    }

    // Verticales intra‑bande : entre pièces + bord droit de la bande si non atteint
    for (const st of b.strips) {
      for (let i = 0; i < st.pieces.length - 1; i++) {
        const p = st.pieces[i]
        const x = p.x + p.w + kerf / 2 // position médiane du trait
        const k = `B${b.index}|V|${x}|${st.y}|${x}|${st.y + st.height}`
        if (!keySet.has(k)) {
          keySet.add(k)
          cuts.push({
            id: cid++,
            type: 'V',
            x1: x,
            y1: st.y,
            x2: x,
            y2: st.y + st.height,
            boardIndex: b.index,
          })
        }
      }
      const last = st.pieces[st.pieces.length - 1]
      if (last) {
        const xRight = last.x + last.w // bord droit des pièces
        if (xRight < st.x + st.width - 1e-6) {
          const k2 = `B${b.index}|V|${xRight}|${st.y}|${xRight}|${st.y + st.height}`
          if (!keySet.has(k2)) {
            keySet.add(k2)
            cuts.push({
              id: cid++,
              type: 'V',
              x1: xRight,
              y1: st.y,
              x2: xRight,
              y2: st.y + st.height,
              boardIndex: b.index,
            })
          }
        }
      }
    }
  }

  return cuts
}

// ---------- Visualization ----------

function BoardSVG({
  board,
  boardW,
  boardH,
  unit,
  cuts,
  zoom,
}: {
  board: BoardLayout
  boardW: number
  boardH: number
  unit: Unit
  cuts: Cut[]
  zoom: number
}) {
  const baseWpx = 1100 // base display width (agrandi)
  const baseHpx = 700 // base display height (agrandi)
  const scale = Math.min(
    (baseWpx * Math.max(0.5, zoom)) / boardW,
    (baseHpx * Math.max(0.5, zoom)) / boardH
  )
  const wpx = Math.max(1, boardW * scale)
  const hpx = Math.max(1, boardH * scale)
  // Texte et marqueurs fixes (petits) — ne suivent pas le zoom
  const fsMain = 9
  const fsDims = 8
  const cutRadius = 7
  const cutStroke = 2

  const boardCuts = cuts.filter((c) => c.boardIndex === board.index)

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">
          🪵 Planche #{board.index + 1}{' '}
          <span className="text-gray-500">
            ({fmt(boardW, unit)} × {fmt(boardH, unit)})
          </span>
        </h3>
        <span className="text-sm text-gray-600">
          {board.strips.reduce((n, s) => n + s.pieces.length, 0)} pièce(s) • {boardCuts.length}{' '}
          coupe(s)
        </span>
      </div>
      <div className="overflow-visible">
        <svg
          width={wpx}
          height={hpx}
          className="rounded border bg-gray-50"
          style={{ imageRendering: 'crisp-edges' }}
        >
          {/* outer border */}
          <rect
            x={0}
            y={0}
            width={wpx}
            height={hpx}
            fill="#f8fafc"
            stroke="#1f2937"
            strokeWidth={1}
          />

          {/* column split guides */}
          {(board.columnSplits || []).map((x, i) => (
            <line
              key={`split-${i}`}
              x1={x * scale}
              y1={0}
              x2={x * scale}
              y2={hpx}
              stroke="#10b981"
              strokeDasharray="4 6"
              strokeWidth={1.5}
            />
          ))}

          {/* pieces */}
          {board.strips.map((st, si) => (
            <g key={si}>
              {st.pieces.map((p) => {
                const x = p.x * scale
                const y = p.y * scale
                const w = p.w * scale
                const h = p.h * scale
                return (
                  <g key={p.id}>
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill="#bfdbfe"
                      stroke="#2563eb"
                      strokeWidth={1}
                    />
                    <text x={x + 6} y={y + 16} fontSize={fsMain} fill="#1f2937">
                      {p.id}
                    </text>
                    <text
                      x={x + 6}
                      y={y + 32}
                      fontSize={fsDims}
                      fill="#374151"
                    >{`${Math.round(p.w)}×${Math.round(p.h)} mm${p.rotated ? ' ↻' : ''}`}</text>
                  </g>
                )
              })}
            </g>
          ))}

          {/* cuts overlay */}
          {boardCuts.map((c) => {
            const x1 = c.x1 * scale
            const y1 = c.y1 * scale
            const x2 = c.x2 * scale
            const y2 = c.y2 * scale
            return (
              <g key={`c${c.id}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#ef4444"
                  strokeDasharray="6 6"
                  strokeWidth={cutStroke}
                />
                <circle cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} r={cutRadius} fill="#ef4444" />
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 + 4}
                  textAnchor="middle"
                  fontSize={fsMain}
                  fill="#fff"
                >
                  {c.id}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

// ---------- Positioning Report (texte) ----------

function PositioningReport({
  boards,
  cuts,
  unit,
}: {
  boards: BoardLayout[]
  cuts: Cut[]
  unit: Unit
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">📝 Compte‑rendu de positionnement</h3>
      <div className="space-y-3 text-sm">
        {boards.map((b) => {
          const byColumn = new Map<string, Strip[]>()
          b.strips.forEach((st) => {
            const key = `${st.x}-${st.width}`
            if (!byColumn.has(key)) byColumn.set(key, [])
            byColumn.get(key)!.push(st)
          })
          return (
            <div key={b.index}>
              <div className="mb-1 font-medium">
                Planche #{b.index + 1} — {fmt(b.width, unit)} × {fmt(b.height, unit)}
              </div>
              {[...byColumn.entries()]
                .sort((a, b) => parseFloat(a[0].split('-')[0]) - parseFloat(b[0].split('-')[0]))
                .map(([key, strips], idx) => {
                  const [sx, sw] = key.split('-').map(Number)
                  strips.sort((a, b2) => a.y - b2.y)
                  return (
                    <div key={key} className="ml-2">
                      <div className="text-gray-700">
                        Colonne {idx + 1} : X {fmt(sx, unit)} → {fmt(sx + sw, unit)} (largeur{' '}
                        {fmt(sw, unit)})
                      </div>
                      {strips.map((st, si) => (
                        <div key={si} className="ml-4">
                          <div>
                            • Bande {si + 1} @ Y={fmt(st.y, unit)} hauteur {fmt(st.height, unit)} :
                          </div>
                          <div className="ml-4">
                            {st.pieces.map((p) => (
                              <div key={p.id}>
                                – {p.id} ({p.specId}) {p.rotated ? '↻ ' : ''}
                                {Math.round(p.w)}×{Math.round(p.h)} mm @ (x={Math.round(p.x)}, y=
                                {Math.round(p.y)})
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              <div className="mt-1 text-gray-700">
                Coupes sur la planche : {cuts.filter((c) => c.boardIndex === b.index).length}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------- Verification Card ----------

function VerificationCard({
  boards,
  allPieces,
  specs,
  boardW,
  boardH,
  unit,
}: {
  boards: BoardLayout[]
  allPieces: PlacedPiece[]
  specs: PieceSpec[]
  boardW: number
  boardH: number
  unit: Unit
}) {
  const areaPieces = allPieces.reduce((acc, p) => acc + p.w * p.h, 0)
  const boardsArea = boards.length * boardW * boardH

  // Count per spec
  const perSpecPlaced: Record<string, number> = {}
  specs.forEach((s) => {
    perSpecPlaced[s.id] = 0
  })
  allPieces.forEach((p) => {
    perSpecPlaced[p.specId] = (perSpecPlaced[p.specId] || 0) + 1
  })

  const allMatch = specs.every((s) => perSpecPlaced[s.id] === s.qty)
  const utilization = boardsArea > 0 ? areaPieces / boardsArea : 0

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">✅ Carte de vérification</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div>
            Pièces placées : <b>{allPieces.length}</b>
          </div>
          <div>
            Surface pièces : <b>{fmt(areaPieces, unit)}²</b>
          </div>
          <div>
            Surface planches ({boards.length}) : <b>{fmt(boardsArea, unit)}²</b>
          </div>
          <div>
            Taux d'utilisation : <b>{(utilization * 100).toFixed(1)}%</b>
          </div>
        </div>
        <div>
          <div className="mb-1 font-medium">Quantités par référence</div>
          {specs.map((s) => (
            <div key={s.id} className="flex justify-between">
              <span>
                {s.id} — {s.w}×{s.h} mm
              </span>
              <span>
                {perSpecPlaced[s.id] || 0} / {s.qty} {perSpecPlaced[s.id] === s.qty ? '✓' : '✗'}
              </span>
            </div>
          ))}
          <div className="mt-2">
            Statut :{' '}
            {allMatch ? (
              <span className="font-semibold text-green-600">
                OK – toutes les pièces sont présentes
              </span>
            ) : (
              <span className="font-semibold text-red-600">Erreur – pièces manquantes</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- Tests / Diagnostics Card ----------

function TestsCard({
  boards,
  cuts,
  specs,
  allPieces,
  boardW,
  boardH,
  kerf,
  unit,
}: {
  boards: BoardLayout[]
  cuts: Cut[]
  specs: PieceSpec[]
  allPieces: PlacedPiece[]
  boardW: number
  boardH: number
  kerf: number
  unit: Unit
}) {
  const eps = 1e-6
  const issues: string[] = []
  const warnings: string[] = []
  const passes: string[] = []

  // Helper: total expected area from specs
  const expectedArea = specs.reduce((acc, s) => acc + s.w * s.h * s.qty, 0)
  const actualArea = allPieces.reduce((acc, p) => acc + p.w * p.h, 0)
  if (expectedArea === actualArea)
    passes.push('Surface totale des découpes = somme attendue des références ✓')
  else issues.push(`Surface mismatch: attendu ${expectedArea} mm², calculé ${actualArea} mm²`)

  // Helper: per-spec counts
  const perSpecExp: Record<string, number> = {}
  specs.forEach((s) => (perSpecExp[s.id] = s.qty))
  const perSpecGot: Record<string, number> = {}
  allPieces.forEach((p) => (perSpecGot[p.specId] = (perSpecGot[p.specId] || 0) + 1))
  for (const s of specs) {
    if ((perSpecGot[s.id] || 0) !== s.qty)
      issues.push(`Quantité ${s.id}: ${perSpecGot[s.id] || 0}/${s.qty}`)
  }
  if (!issues.find((t) => t.startsWith('Quantité ')))
    passes.push('Quantités par référence conformes ✓')

  // Helper: find strip for a piece by containment
  function findStripForPiece(b: BoardLayout, p: PlacedPiece): Strip | null {
    for (const st of b.strips) {
      const inCol = p.x + eps >= st.x && p.x + p.w <= st.x + st.width + eps
      const sameY = Math.abs(p.y - st.y) < 1e-6 // notre packer place les pièces sur le haut de la bande
      if (inCol && sameY) return st
    }
    return null
  }

  // Bounds checks + column containment
  boards.forEach((b) => {
    const pieces = b.strips.flatMap((st) => st.pieces)
    pieces.forEach((p) => {
      if (p.x < -eps || p.y < -eps || p.x + p.w > boardW + eps || p.y + p.h > boardH + eps)
        issues.push(`${p.id}: en dehors des limites planche`)
      const st = findStripForPiece(b, p)
      if (!st) warnings.push(`${p.id}: bande non trouvée (tolérance) – vérif visuelle recommandée`)
      else {
        if (Math.abs(p.y - st.y) > 1e-6) warnings.push(`${p.id}: Y != top bande`)
        if (p.x + p.w > st.x + st.width + eps || p.x < st.x - eps)
          issues.push(`${p.id}: dépasse la colonne`)
        if (p.h - st.height > eps)
          warnings.push(`${p.id}: plus haut que la bande (${p.h} > ${st.height})`)
      }
    })
  })
  if (!issues.some((t) => t.includes('limites') || t.includes('colonne')))
    passes.push('Aucune pièce hors limites/colonne ✓')

  // Overlap test (within same board)
  function overlap(a: PlacedPiece, b: PlacedPiece) {
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
  boards.forEach((b) => {
    const pieces = b.strips.flatMap((st) => st.pieces)
    for (let i = 0; i < pieces.length; i++)
      for (let j = i + 1; j < pieces.length; j++) {
        if (overlap(pieces[i], pieces[j]))
          issues.push(`Chevauchement: ${pieces[i].id} & ${pieces[j].id} (planche ${b.index + 1})`)
      }
  })
  if (!issues.find((t) => t.startsWith('Chevauchement')))
    passes.push('Aucun chevauchement détecté ✓')

  // Kerf checks: horizontal dans chaque bande
  boards.forEach((b) => {
    const byCol = new Map<string, Strip[]>()
    b.strips.forEach((st) => {
      const key = `${st.x}-${st.width}`
      if (!byCol.has(key)) byCol.set(key, [])
      byCol.get(key)!.push(st)
    })
    for (const [, sts] of byCol) {
      sts.sort((a, b) => a.y - b.y)
      // vertical kerf entre bandes
      for (let i = 1; i < sts.length; i++) {
        const expectedY = sts[i - 1].y + sts[i - 1].height + kerf
        const diff = Math.abs(sts[i].y - expectedY)
        if (diff > 1e-6)
          warnings.push(`Ecart kerf vertical entre bandes @X=${sts[i].x}: ${diff.toFixed(3)} mm`)
      }
      // horizontal kerf entre pièces
      for (const st of sts) {
        const sorted = st.pieces.slice().sort((a, b) => a.x - b.x)
        for (let i = 1; i < sorted.length; i++) {
          const gap = sorted[i].x - (sorted[i - 1].x + sorted[i - 1].w)
          const diff = Math.abs(gap - kerf)
          if (diff > 1e-6)
            warnings.push(`Ecart kerf horizontal dans une bande @Y=${st.y}: ${diff.toFixed(3)} mm`)
        }
      }
    }
  })
  if (!warnings.find((w) => w.includes('kerf'))) passes.push('Kerf respecté (tolérance) ✓')

  // Cuts integrity: aucune duplication
  const cutKey = (c: Cut) => `${c.boardIndex}|${c.type}|${c.x1}|${c.y1}|${c.x2}|${c.y2}`
  const mapCuts = new Map<string, number>()
  cuts.forEach((c) => mapCuts.set(cutKey(c), (mapCuts.get(cutKey(c)) || 0) + 1))
  const duplicates = Array.from(mapCuts.entries()).filter(([, n]) => n > 1)
  if (duplicates.length > 0) issues.push(`Coupes dupliquées: ${duplicates.length}`)
  else passes.push('Pas de double‑comptage des coupes ✓')

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">🧪 Tests automatiques</h3>
      <div className="grid gap-4 text-sm md:grid-cols-3">
        <div>
          <div className="mb-1 font-medium">Pass ✅</div>
          {passes.length === 0 ? (
            <div className="text-gray-500">—</div>
          ) : (
            passes.map((t, i) => <div key={i}>• {t}</div>)
          )}
        </div>
        <div>
          <div className="mb-1 font-medium">Avertissements ⚠️</div>
          {warnings.length === 0 ? (
            <div className="text-gray-500">—</div>
          ) : (
            warnings.map((t, i) => <div key={i}>• {t}</div>)
          )}
        </div>
        <div>
          <div className="mb-1 font-medium">Erreurs ❌</div>
          {issues.length === 0 ? (
            <div className="text-gray-500">—</div>
          ) : (
            issues.map((t, i) => <div key={i}>• {t}</div>)
          )}
        </div>
      </div>
    </div>
  )
}

// ---------- Main App ----------

export default function App() {
  // Inputs
  const [unit, setUnit] = useState<Unit>('mm')
  const [boardWInput, setBoardWInput] = useState('1500')
  const [boardHInput, setBoardHInput] = useState('5000')
  const [kerfInput, setKerfInput] = useState('3')
  const [allowRotate, setAllowRotate] = useState(true)
  const [objective, setObjective] = useState<'waste' | 'cuts' | 'balanced'>('balanced')
  const [forceTwoCols, setForceTwoCols] = useState(true)
  const [zoom, setZoom] = useState(1.0)

  const [specs, setSpecs] = useState<PieceSpec[]>([
    { id: 'A', w: 930, h: 750, qty: 5 },
    { id: 'B', w: 300, h: 800, qty: 3 },
    { id: 'C', w: 450, h: 600, qty: 4 },
    { id: 'D', w: 200, h: 300, qty: 6 },
  ])

  // Convert inputs → mm
  const boardW = useMemo(() => mm(parseFloat(boardWInput || '0'), unit), [boardWInput, unit])
  const boardH = useMemo(() => mm(parseFloat(boardHInput || '0'), unit), [boardHInput, unit])
  const kerf = useMemo(() => mm(parseFloat(kerfInput || '0'), unit), [kerfInput, unit])

  // Layout: essai 1 planche/2‑colonnes puis fallback
  const { boards, allPieces } = useMemo(() => {
    const validSpecs = specs.filter((s) => s.w > 0 && s.h > 0 && s.qty > 0)
    if (forceTwoCols) {
      const attempt = tryOneBoardTwoColumns(boardW, boardH, validSpecs, kerf, allowRotate)
      if (attempt) return attempt
    }
    return packGuillotine(boardW, boardH, validSpecs, kerf, allowRotate, objective)
  }, [boardW, boardH, specs, kerf, allowRotate, objective, forceTwoCols])

  // Cuts
  const cuts = useMemo(
    () => computeCuts(boards, boardW, boardH, kerf),
    [boards, boardW, boardH, kerf]
  )

  // Utilisation
  const usage = useMemo(() => {
    const areaPieces = allPieces.reduce((acc, p) => acc + p.w * p.h, 0)
    const boardsArea = boards.length * boardW * boardH
    return boardsArea > 0 ? areaPieces / boardsArea : 0
  }, [allPieces, boards, boardW, boardH])

  // Actions
  function addSpec() {
    setSpecs((prev) => [
      ...prev,
      { id: String.fromCharCode(65 + prev.length), w: 100, h: 100, qty: 1 },
    ])
  }
  function updateSpec(idx: number, patch: Partial<PieceSpec>) {
    setSpecs((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)))
  }
  function removeSpec(idx: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== idx))
  }
  function resetExample() {
    setUnit('mm')
    setBoardWInput('1500')
    setBoardHInput('5000')
    setKerfInput('3')
    setAllowRotate(true)
    setObjective('balanced')
    setForceTwoCols(true)
    setSpecs([
      { id: 'A', w: 930, h: 750, qty: 5 },
      { id: 'B', w: 300, h: 800, qty: 3 },
      { id: 'C', w: 450, h: 600, qty: 4 },
      { id: 'D', w: 200, h: 300, qty: 6 },
    ])
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Optimiseur de Découpe Bois – Guillotine (One‑Shot)</h1>
      <p className="text-gray-600">
        Deux stratégies : (1) essai prioritaire sur <b>1 planche en 2‑colonnes</b> (two‑stage
        guillotine, bandes horizontales par colonne), (2) fallback en <b>bandes pleine largeur</b>.
        Compteur de coupes exact et visualisation proportionnelle.
      </p>

      {/* Controls */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-5">
          <div>
            <label className="block text-sm font-medium">Unité</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              className="mt-1 w-full rounded border px-2 py-1"
            >
              <option value="mm">Millimètres (mm)</option>
              <option value="cm">Centimètres (cm)</option>
              <option value="m">Mètres (m)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Largeur planche</label>
            <input
              value={boardWInput}
              onChange={(e) => setBoardWInput(e.target.value)}
              className="mt-1 w-full rounded border px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Longueur planche</label>
            <input
              value={boardHInput}
              onChange={(e) => setBoardHInput(e.target.value)}
              className="mt-1 w-full rounded border px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Trait de scie (kerf)</label>
            <input
              value={kerfInput}
              onChange={(e) => setKerfInput(e.target.value)}
              className="mt-1 w-full rounded border px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Essai 1 planche (2‑colonnes)</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                id="twoCols"
                type="checkbox"
                checked={forceTwoCols}
                onChange={(e) => setForceTwoCols(e.target.checked)}
              />
              <label htmlFor="twoCols">Activer</label>
            </div>
          </div>
        </div>
        <div className="mt-4 grid items-center gap-4 md:grid-cols-4">
          <div className="flex items-center gap-2">
            <input
              id="rot"
              type="checkbox"
              checked={allowRotate}
              onChange={(e) => setAllowRotate(e.target.checked)}
            />
            <label htmlFor="rot">Autoriser la rotation 90°</label>
          </div>
          <div>
            <label className="block text-sm font-medium">Objectif (fallback)</label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value as any)}
              className="mt-1 w-full rounded border px-2 py-1"
            >
              <option value="waste">Minimiser les chutes</option>
              <option value="balanced">Équilibré</option>
              <option value="cuts">Minimiser les coupes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Zoom visuel</label>
            <div className="mt-1 flex items-center gap-2">
              <button
                className="rounded border px-2 py-1"
                onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.2).toFixed(1)))}
              >
                −
              </button>
              <input
                type="range"
                min={0.6}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-40"
              />
              <button
                className="rounded border px-2 py-1"
                onClick={() => setZoom((z) => Math.min(3, +(z + 0.2).toFixed(1)))}
              >
                ＋
              </button>
              <span className="w-12 text-right text-sm text-gray-600">x{zoom.toFixed(1)}</span>
              <button className="rounded border bg-gray-100 px-2 py-1" onClick={() => setZoom(1)}>
                100%
              </button>
              <button
                className="rounded border bg-blue-50 px-2 py-1 text-blue-700"
                onClick={() => setZoom(2)}
              >
                Agrandir
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button className="rounded bg-gray-100 px-3 py-2" onClick={resetExample}>
              🔄 Réinitialiser l'exemple
            </button>
          </div>
        </div>
      </div>

      {/* Specs table */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">📦 Pièces à découper</h3>
          <button className="rounded bg-blue-600 px-3 py-2 text-white" onClick={addSpec}>
            ➕ Ajouter
          </button>
        </div>
        <div className="mb-1 grid grid-cols-12 gap-2 text-sm font-medium text-gray-600">
          <div className="col-span-2">Réf</div>
          <div className="col-span-3">Largeur (mm)</div>
          <div className="col-span-3">Hauteur (mm)</div>
          <div className="col-span-2">Quantité</div>
          <div className="col-span-2"></div>
        </div>
        {specs.map((s, idx) => (
          <div key={idx} className="mb-1 grid grid-cols-12 items-center gap-2">
            <input
              className="col-span-2 rounded border px-2 py-1"
              value={s.id}
              onChange={(e) => updateSpec(idx, { id: e.target.value })}
            />
            <input
              className="col-span-3 rounded border px-2 py-1"
              type="number"
              value={s.w}
              onChange={(e) => updateSpec(idx, { w: Number(e.target.value) })}
            />
            <input
              className="col-span-3 rounded border px-2 py-1"
              type="number"
              value={s.h}
              onChange={(e) => updateSpec(idx, { h: Number(e.target.value) })}
            />
            <input
              className="col-span-2 rounded border px-2 py-1"
              type="number"
              value={s.qty}
              onChange={(e) => updateSpec(idx, { qty: Number(e.target.value) })}
            />
            <button
              className="col-span-2 rounded bg-red-50 px-3 py-2 text-red-700"
              onClick={() => removeSpec(idx)}
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-sm">
            Planches utilisées : <b>{boards.length}</b>
          </div>
          <div className="text-sm">
            Pièces placées : <b>{allPieces.length}</b>
          </div>
          <div className="text-sm">
            Coupes totales : <b>{computeCuts(boards, boardW, boardH, kerf).length}</b>
          </div>
          <div className="text-sm">
            Utilisation : <b>{(usage * 100).toFixed(1)}%</b>
          </div>
        </div>
      </div>

      {/* Boards display */}
      <div className={`grid ${zoom >= 1.6 ? 'grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
        {boards.map((b) => (
          <BoardSVG
            key={b.index}
            board={b}
            boardW={boardW}
            boardH={boardH}
            unit={unit}
            cuts={cuts}
            zoom={zoom}
          />
        ))}
      </div>

      {/* Positioning report */}
      <PositioningReport boards={boards} cuts={cuts} unit={unit} />

      {/* Verification */}
      <VerificationCard
        boards={boards}
        allPieces={allPieces}
        specs={specs}
        boardW={boardW}
        boardH={boardH}
        unit={unit}
      />

      <div className="text-xs text-gray-500">
        Astuce : l’essai « 2‑colonnes » correspond aux <em>two‑stage guillotine patterns</em> :
        d’abord scission verticale maîtresse, puis bandes horizontales par colonne. Placez la
        première bande à y=0 pour économiser une coupe.
      </div>
    </div>
  )
}
