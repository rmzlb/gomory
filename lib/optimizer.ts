import type {
  PieceSpec,
  PlacedPiece,
  Strip,
  BoardLayout,
  Cut,
  OptimizationResult,
  OptimizationConfig,
  HeuristicTrace,
} from './types'

import { optimizeV3Fixed } from './optimizer-v3-fixed'

type OrientationOption = { w: number; h: number; rotated: boolean }
type CandidateResult = { id: string; label: string; outcome: OptimizationResult }

// Core: Shelf packer (NFDH-like) pour une colonne
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
  // Tri NFDH : hauteurs décroissantes
  const sortable = items.map((it) => {
    const o1 = { w: it.w, h: it.h, rot: false }
    const o2 = allowRotate ? { w: it.h, h: it.w, rot: true } : null
    const cand = [o1, o2].filter(Boolean) as { w: number; h: number; rot: boolean }[]
    const remainingHeight = boardH - startingY + 1e-6
    const feasible = cand.filter((c) => c.w <= colW + 1e-6 && c.h <= remainingHeight)
    if (feasible.length === 0) return { ...it, w: it.w, h: it.h, rot: false, keyH: -1 }
    feasible.sort((a, b) => b.h - a.h)
    const best = feasible[0]
    return { ...it, w: best.w, h: best.h, rot: best.rot, keyH: best.h }
  })

  if (sortable.some((s) => s.keyH === -1))
    return { success: false, usedHeight: 0, placed: [], strips: [] }

  sortable.sort((a, b) => b.h - a.h || Math.max(b.w, b.h) - Math.max(a.w, a.h))

  const strips: Strip[] = []
  const placed: PlacedPiece[] = []

  let y = startingY
  while (sortable.length > 0) {
    const stripItems: typeof sortable = []
    const stripHeight = sortable[0].h

    if (y + stripHeight > boardH + 1e-6) {
      return { success: false, usedHeight: 0, placed: [], strips: [] }
    }

    for (let i = 0; i < sortable.length; ) {
      if (sortable[i].h <= stripHeight) {
        stripItems.push(sortable.splice(i, 1)[0])
      } else {
        i++
      }
    }

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
        used = px - colX + it.w
        i++
      } else {
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

    y = y + stripHeight + kerf
    if (y > boardH + 1e-6) return { success: false, usedHeight: 0, placed: [], strips: [] }
  }

  const usedHeight =
    strips.length === 0
      ? 0
      : strips[strips.length - 1].y + strips[strips.length - 1].height - startingY
  return { success: true, usedHeight, placed, strips }
}

// Essai « 1 planche / 2-colonnes » avec sélection intelligente du split
interface SplitCandidate {
  splitX: number
  leftItems: { specId: string; w: number; h: number; id: string }[]
  rightItems: { specId: string; w: number; h: number; id: string }[]
  numCuts: number
  totalSlack: number
  utilization: number
}

function tryOneBoardTwoColumns(
  boardW: number,
  boardH: number,
  specs: PieceSpec[],
  kerf: number,
  allowRotate: boolean
): { boards: BoardLayout[]; allPieces: PlacedPiece[] } | null {
  const items: { specId: string; w: number; h: number; id: string }[] = []
  let counter = 1
  for (const s of specs) {
    for (let q = 0; q < s.qty; q++) {
      items.push({ specId: s.id, w: s.w, h: s.h, id: `#${counter++}` })
    }
  }

  // Largeurs candidates pour splitX
  const candSet = new Set<number>()
  items.forEach((it) => {
    candSet.add(it.w)
    candSet.add(it.h)
  })
  const candidates = Array.from(candSet)
    .filter((w) => w > 0 && w < boardW - 50)
    .sort((a, b) => b - a)

  // Evaluate ALL split candidates instead of taking first valid
  const splitEvaluations: SplitCandidate[] = []

  for (const splitX of candidates) {
    const colL = { x: 0, w: splitX }
    const colR = { x: splitX + kerf, w: boardW - splitX - kerf }
    if (colR.w <= 0) continue

    const itemsSorted = items.slice().sort((a, b) => Math.max(b.w, b.h) - Math.max(a.w, a.h))
    const left: typeof items = []
    const right: typeof items = []

    // Simulateur pour affectation gloutonne
    type Sim = { totalH: number; rowH: number; rowRemW: number }
    const simL: Sim = { totalH: 0, rowH: 0, rowRemW: colL.w }
    const simR: Sim = { totalH: 0, rowH: 0, rowRemW: colR.w }

    function bestOrientFor(colW: number, it: { w: number; h: number }) {
      const o: { w: number; h: number }[] = [{ w: it.w, h: it.h }]
      if (allowRotate) o.push({ w: it.h, h: it.w })
      const feas = o.filter((k) => k.w <= colW)
      if (feas.length === 0) return null
      feas.sort((a, b) => b.h - a.h)
      return feas[0]
    }

    function simulate(sim: Sim, colW: number, wh: { w: number; h: number }) {
      let { totalH, rowH, rowRemW } = sim
      const needW = rowRemW === colW ? wh.w : wh.w + kerf
      if (needW <= rowRemW) {
        rowRemW -= needW
        rowH = Math.max(rowH, wh.h)
      } else {
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

    const placed = [...leftPack.placed, ...rightPack.placed]
    if (placed.length !== items.length) continue

    board.strips = [...leftPack.strips, ...rightPack.strips].sort((a, b) => a.y - b.y || a.x - b.x)

    // Calculate metrics for this split
    const numCuts = countCutsForCandidate(board, boardW, boardH, kerf)
    const totalSlack = calculateTotalSlack(board.strips)
    const utilization = placed.reduce((sum, p) => sum + p.w * p.h, 0) / (boardW * boardH)

    splitEvaluations.push({
      splitX,
      leftItems: left,
      rightItems: right,
      numCuts,
      totalSlack,
      utilization,
    })
  }

  // Select best split based on multi-criteria
  if (splitEvaluations.length === 0) return null

  splitEvaluations.sort((a, b) => {
    // Priority 1: Minimize cuts
    if (a.numCuts !== b.numCuts) return a.numCuts - b.numCuts
    // Priority 2: Minimize slack
    if (a.totalSlack !== b.totalSlack) return a.totalSlack - b.totalSlack
    // Priority 3: Maximize utilization
    return b.utilization - a.utilization
  })

  // Re-run packing with best split
  const best = splitEvaluations[0]
  const bestBoard: BoardLayout = {
    index: 0,
    strips: [],
    width: boardW,
    height: boardH,
    columnSplits: [best.splitX],
  }

  const colL = { x: 0, w: best.splitX }
  const colR = { x: best.splitX + kerf, w: boardW - best.splitX - kerf }

  const leftPack = packColumnShelves(
    bestBoard,
    colL.x,
    colL.w,
    boardH,
    best.leftItems,
    kerf,
    allowRotate,
    0
  )
  const rightPack = packColumnShelves(
    bestBoard,
    colR.x,
    colR.w,
    boardH,
    best.rightItems,
    kerf,
    allowRotate,
    0
  )

  const finalPlaced = [...leftPack.placed, ...rightPack.placed]
  bestBoard.strips = [...leftPack.strips, ...rightPack.strips].sort(
    (a, b) => a.y - b.y || a.x - b.x
  )

  return { boards: [bestBoard], allPieces: finalPlaced }
}

// Helper: Count cuts for a candidate board
function countCutsForCandidate(
  board: BoardLayout,
  boardW: number,
  boardH: number,
  kerf: number
): number {
  let count = 0
  const keySet = new Set<string>()

  // Column splits
  ;(board.columnSplits || []).forEach((x) => {
    const key = `V|${x}`
    if (!keySet.has(key)) {
      keySet.add(key)
      count++
    }
  })

  // Horizontal cuts
  board.strips.forEach((strip) => {
    const y = strip.y + strip.height
    if (y < boardH) {
      const key = `H|${y}|${strip.x}|${strip.x + strip.width}`
      if (!keySet.has(key)) {
        keySet.add(key)
        count++
      }
    }
  })

  // Vertical cuts within strips
  board.strips.forEach((strip) => {
    // Between pieces
    for (let i = 0; i < strip.pieces.length - 1; i++) {
      count++
    }
    // Closure cut if needed
    const last = strip.pieces[strip.pieces.length - 1]
    if (last && last.x + last.w < strip.x + strip.width - kerf) {
      count++
    }
  })

  return count
}

// Helper: Calculate total slack
function calculateTotalSlack(strips: Strip[]): number {
  return strips.reduce((total, strip) => {
    const slack = strip.width - strip.usedWidth
    return total + slack
  }, 0)
}

// Fallback historique : Guillotine bandes pleine largeur (legacy)
function packGuillotineLegacy(
  boardW: number,
  boardH: number,
  specs: PieceSpec[],
  kerf: number,
  allowRotate: boolean,
  objective: 'waste' | 'cuts' | 'balanced' = 'balanced'
): { boards: BoardLayout[]; allPieces: PlacedPiece[] } {
  const expanded: { specId: string; w: number; h: number; id: string }[] = []
  let counter = 1
  for (const s of specs) {
    for (let i = 0; i < s.qty; i++) {
      expanded.push({ specId: s.id, w: s.w, h: s.h, id: `#${counter++}` })
    }
  }

  expanded.sort((a, b) => {
    const aMax = Math.max(a.w, a.h)
    const bMax = Math.max(b.w, b.h)
    const aArea = a.w * a.h
    const bArea = b.w * b.h
    if (objective === 'cuts') return bMax - aMax || bArea - aArea
    if (objective === 'waste') return bArea - aArea || bMax - aMax
    return bMax - aMax || bArea - aArea
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
      const orients = allowRotate
        ? [
            { w: item.w, h: item.h, rot: false },
            { w: item.h, h: item.w, rot: true },
          ]
        : [{ w: item.w, h: item.h, rot: false }]

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

    // Nouvelle bande pleine largeur
    const orients = allowRotate
      ? [
          { w: item.w, h: item.h, rot: false },
          { w: item.h, h: item.w, rot: true },
        ]
      : [{ w: item.w, h: item.h, rot: false }]
    orients.sort((a, b) => b.h - a.h)

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

function packGuillotineFillFirst(
  boardW: number,
  boardH: number,
  specs: PieceSpec[],
  kerf: number,
  allowRotate: boolean,
  objective: 'waste' | 'cuts' | 'balanced' = 'balanced'
): { boards: BoardLayout[]; allPieces: PlacedPiece[] } {
  const items: { specId: string; w: number; h: number; id: string }[] = []
  let counter = 1
  for (const s of specs) {
    for (let i = 0; i < s.qty; i++) {
      items.push({ specId: s.id, w: s.w, h: s.h, id: `#${counter++}` })
    }
  }

  items.sort((a, b) => {
    const aMax = Math.max(a.w, a.h)
    const bMax = Math.max(b.w, b.h)
    const aArea = a.w * a.h
    const bArea = b.w * b.h
    if (objective === 'cuts') return bMax - aMax || bArea - aArea
    if (objective === 'waste') return bArea - aArea || bMax - aMax
    return bMax - aMax || bArea - aArea
  })

  interface OrientationChoice {
    w: number
    h: number
    rot: boolean
  }

  const boards: BoardLayout[] = []
  const placed: PlacedPiece[] = []
  const eps = 1e-6

  const getOrientations = (it: { w: number; h: number }): OrientationChoice[] => {
    const list: OrientationChoice[] = [{ w: it.w, h: it.h, rot: false }]
    if (allowRotate && it.w !== it.h) {
      list.push({ w: it.h, h: it.w, rot: true })
    }
    return list
      .filter((o) => o.w <= boardW + eps && o.h <= boardH + eps)
      .sort((a, b) => b.h - a.h || b.w - a.w)
  }

  const createBoard = () => {
    const board: BoardLayout = {
      index: boards.length,
      strips: [],
      width: boardW,
      height: boardH,
      columnSplits: [],
    }
    boards.push(board)
    return board
  }

  const computeNextStripY = (board: BoardLayout) => {
    if (board.strips.length === 0) return 0
    const last = board.strips[board.strips.length - 1]
    return last.y + last.height + kerf
  }

  const tryPlaceInBoard = (
    board: BoardLayout,
    item: { specId: string; id: string },
    orientations: OrientationChoice[]
  ): PlacedPiece | null => {
    // Try existing strips first (top to bottom)
    for (let stripIndex = 0; stripIndex < board.strips.length; stripIndex++) {
      const strip = board.strips[stripIndex]
      const nextX =
        strip.pieces.length === 0
          ? strip.x
          : strip.x + strip.usedWidth + (strip.usedWidth > 0 ? kerf : 0)

      const orients = orientations
        .filter((o) => o.h <= strip.height + eps)
        .sort((o1, o2) => {
          const slack1 = strip.x + strip.width - (nextX + o1.w)
          const slack2 = strip.x + strip.width - (nextX + o2.w)
          return slack1 - slack2
        })

      for (const orient of orients) {
        const fitsWidth = nextX + orient.w <= strip.x + strip.width + eps
        if (!fitsWidth) continue

        const piece: PlacedPiece = {
          id: item.id,
          specId: item.specId,
          w: orient.w,
          h: orient.h,
          rotated: orient.rot,
          x: nextX,
          y: strip.y,
          boardIndex: board.index,
          stripIndex,
        }

        strip.pieces.push(piece)
        strip.usedWidth = piece.x - strip.x + orient.w
        return piece
      }
    }

    // Create a new strip if there is vertical space left
    const nextStripY = computeNextStripY(board)
    const remainingHeight = boardH - nextStripY
    if (remainingHeight <= 0) return null

    const orientForStrip = orientations.find((o) => o.h <= remainingHeight + eps)
    if (!orientForStrip) return null

    const strip: Strip = {
      x: 0,
      width: boardW,
      y: nextStripY,
      height: orientForStrip.h,
      pieces: [],
      usedWidth: 0,
    }

    const piece: PlacedPiece = {
      id: item.id,
      specId: item.specId,
      w: orientForStrip.w,
      h: orientForStrip.h,
      rotated: orientForStrip.rot,
      x: 0,
      y: strip.y,
      boardIndex: board.index,
      stripIndex: board.strips.length,
    }

    strip.pieces.push(piece)
    strip.usedWidth = orientForStrip.w
    board.strips.push(strip)
    return piece
  }

  for (const item of items) {
    const orientations = getOrientations(item)
    if (orientations.length === 0) {
      continue
    }

    let placedPiece: PlacedPiece | null = null

    for (const board of boards) {
      placedPiece = tryPlaceInBoard(board, item, orientations)
      if (placedPiece) break
    }

    if (!placedPiece) {
      const board = createBoard()
      placedPiece = tryPlaceInBoard(board, item, orientations)
    }

    if (placedPiece) {
      placed.push(placedPiece)
    }
  }

  // Ensure strips ordered by Y for each board (safety)
  boards.forEach((board, index) => {
    board.strips.sort((a, b) => a.y - b.y)
    board.index = index
    board.strips.forEach((strip, stripIndex) => {
      strip.pieces.forEach((piece) => {
        piece.boardIndex = index
        piece.stripIndex = stripIndex
      })
    })
  })

  return { boards, allPieces: placed }
}

interface ColumnState {
  x: number
  width: number
  currentY: number
  strips: Strip[]
}

interface WasteBoardState {
  board: BoardLayout
  columns: ColumnState[]
}

function createOrientations(
  it: { w: number; h: number },
  allowRotate: boolean
): OrientationOption[] {
  const options: OrientationOption[] = [{ w: it.w, h: it.h, rotated: false }]
  if (allowRotate && it.w !== it.h) {
    options.push({ w: it.h, h: it.w, rotated: true })
  }
  return options
}

function sortOrientationsByWaste(options: OrientationOption[]): OrientationOption[] {
  return options.slice().sort((a, b) => {
    const areaA = a.w * a.h
    const areaB = b.w * b.h
    if (areaA !== areaB) return areaB - areaA
    return b.h - a.h
  })
}

function packWasteOptimized(
  boardW: number,
  boardH: number,
  specs: PieceSpec[],
  kerf: number,
  allowRotate: boolean,
  maxColumns?: number
): { boards: BoardLayout[]; allPieces: PlacedPiece[] } | null {
  const eps = 1e-6
  const items: { specId: string; w: number; h: number; id: string }[] = []
  let counter = 1
  for (const s of specs) {
    for (let q = 0; q < s.qty; q++) {
      items.push({ specId: s.id, w: s.w, h: s.h, id: `#${counter++}` })
    }
  }

  items.sort((a, b) => {
    const areaA = a.w * a.h
    const areaB = b.w * b.h
    if (areaA !== areaB) return areaB - areaA
    return Math.max(b.w, b.h) - Math.max(a.w, a.h)
  })

  const boardStates: WasteBoardState[] = []
  const placedPieces: PlacedPiece[] = []

  const startNewBoard = () => {
    const board: BoardLayout = {
      index: boardStates.length,
      strips: [],
      width: boardW,
      height: boardH,
      columnSplits: [],
    }
    const state: WasteBoardState = { board, columns: [] }
    boardStates.push(state)
    return state
  }

  const placeInColumn = (
    state: WasteBoardState,
    col: ColumnState,
    orient: OrientationOption
  ): PlacedPiece | null => {
    // Try existing strips first (fill horizontally)
    const strips = col.strips.slice().sort((a, b) => a.y - b.y)
    for (const strip of strips) {
      if (orient.h > strip.height + eps) continue
      const nextX =
        strip.pieces.length === 0
          ? strip.x
          : strip.x + strip.usedWidth + (strip.usedWidth > 0 ? kerf : 0)
      if (nextX + orient.w > strip.x + strip.width + eps) continue

      const piece: PlacedPiece = {
        id: '',
        specId: '',
        w: orient.w,
        h: orient.h,
        rotated: orient.rotated,
        x: nextX,
        y: strip.y,
        boardIndex: state.board.index,
        stripIndex: 0,
      }
      strip.pieces.push(piece)
      strip.usedWidth = piece.x - strip.x + orient.w
      return piece
    }

    const nextY = col.strips.length === 0 ? 0 : col.currentY
    if (nextY + orient.h > state.board.height + eps) return null

    const strip: Strip = {
      x: col.x,
      width: col.width,
      y: nextY,
      height: orient.h,
      pieces: [],
      usedWidth: 0,
    }
    const piece: PlacedPiece = {
      id: '',
      specId: '',
      w: orient.w,
      h: orient.h,
      rotated: orient.rotated,
      x: col.x,
      y: strip.y,
      boardIndex: state.board.index,
      stripIndex: 0,
    }
    strip.pieces.push(piece)
    strip.usedWidth = orient.w
    col.strips.push(strip)
    col.currentY = strip.y + strip.height + kerf
    return piece
  }

  const tryPlaceOnBoard = (
    state: WasteBoardState,
    item: { specId: string; w: number; h: number; id: string }
  ): PlacedPiece | null => {
    const orientations = sortOrientationsByWaste(createOrientations(item, allowRotate))
    if (orientations.length === 0) return null

    const colsOrdered = state.columns.slice().sort((a, b) => a.currentY - b.currentY)
    for (const col of colsOrdered) {
      for (const orient of orientations) {
        if (orient.w > col.width + eps) continue
        const placed = placeInColumn(state, col, orient)
        if (placed) {
          placed.id = item.id
          placed.specId = item.specId
          return placed
        }
      }
    }

    // Try to create a new column if we have space
    if (maxColumns && state.columns.length >= maxColumns) return null

    const baseX = state.columns.reduce((max, c) => Math.max(max, c.x + c.width), 0)
    for (const orient of orientations) {
      const startX = state.columns.length === 0 ? 0 : baseX + kerf
      if (startX + orient.w > boardW + eps) continue

      const column: ColumnState = {
        x: startX,
        width: orient.w,
        currentY: 0,
        strips: [],
      }
      const placed = placeInColumn(state, column, orient)
      if (!placed) continue
      placed.id = item.id
      placed.specId = item.specId
      state.columns.push(column)
      if (column.x > 0) {
        state.board.columnSplits = Array.from(
          new Set([...(state.board.columnSplits || []), column.x])
        ).sort((a, b) => a - b)
      }
      return placed
    }

    return null
  }

  for (const item of items) {
    let placed: PlacedPiece | null = null

    for (const state of boardStates) {
      placed = tryPlaceOnBoard(state, item)
      if (placed) break
    }

    if (!placed) {
      const state = startNewBoard()
      placed = tryPlaceOnBoard(state, item)
    }

    if (!placed) {
      return null
    }

    placedPieces.push(placed)
  }

  // Finalise board layouts
  boardStates.forEach((state, boardIdx) => {
    state.board.index = boardIdx
    const orderedColumns = state.columns.slice().sort((a, b) => a.x - b.x)
    const strips: Strip[] = []
    orderedColumns.forEach((col) => {
      col.strips.sort((a, b) => a.y - b.y)
      col.strips.forEach((strip) => {
        const copyStrip: Strip = {
          x: col.x,
          width: col.width,
          y: strip.y,
          height: strip.height,
          pieces: [],
          usedWidth: strip.usedWidth,
        }
        strip.pieces
          .slice()
          .sort((a, b) => a.x - b.x)
          .forEach((piece) => {
            piece.boardIndex = boardIdx
            piece.stripIndex = strips.length
            copyStrip.pieces.push(piece)
          })
        strips.push(copyStrip)
      })
    })
    state.board.strips = strips
    state.board.columnSplits = (state.board.columnSplits || []).sort((a, b) => a - b)
  })

  return {
    boards: boardStates.map((s) => s.board),
    allPieces: placedPieces,
  }
}

function packGuillotine(
  boardW: number,
  boardH: number,
  specs: PieceSpec[],
  kerf: number,
  allowRotate: boolean,
  objective: 'waste' | 'cuts' | 'balanced' = 'balanced',
  strategy: 'legacy' | 'fillFirstBoard' = 'legacy'
): { boards: BoardLayout[]; allPieces: PlacedPiece[] } {
  if (strategy === 'fillFirstBoard') {
    return packGuillotineFillFirst(boardW, boardH, specs, kerf, allowRotate, objective)
  }
  return packGuillotineLegacy(boardW, boardH, specs, kerf, allowRotate, objective)
}

// Calcul des coupes (sans doublon)
export function computeCuts(
  boards: BoardLayout[],
  boardW: number,
  boardH: number,
  kerf: number
): Cut[] {
  const cuts: Cut[] = []
  let cid = 1
  const keySet = new Set<string>()

  for (const b of boards) {
    // Coupes verticales maîtresses
    ;(b.columnSplits || []).forEach((x) => {
      const k = `B${b.index}|V|${x}|0|${x}|${boardH}`
      if (!keySet.has(k)) {
        keySet.add(k)
        cuts.push({
          id: cid++,
          type: 'V',
          x1: x,
          y1: 0,
          x2: x,
          y2: boardH,
          boardIndex: b.index,
        })
      }
    })

    // Horizontales : bas de chaque bande
    for (let i = 0; i < b.strips.length; i++) {
      const st = b.strips[i]
      const y = st.y + st.height
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

    // Verticales intra-bande
    for (const st of b.strips) {
      for (let i = 0; i < st.pieces.length - 1; i++) {
        const p = st.pieces[i]
        const x = p.x + p.w + kerf / 2
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
        const xRight = last.x + last.w
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

      // Horizontal bottom cuts for pieces shorter than strip height
      for (const p of st.pieces) {
        if (p.h < st.height - 1e-6) {
          // This piece is shorter than the strip, needs a bottom cut
          const yBottom = st.y + p.h
          const k = `B${b.index}|H|${p.x}|${yBottom}|${p.x + p.w}|${yBottom}`
          if (!keySet.has(k)) {
            keySet.add(k)
            cuts.push({
              id: cid++,
              type: 'H',
              x1: p.x,
              y1: yBottom,
              x2: p.x + p.w,
              y2: yBottom,
              boardIndex: b.index,
            })
          }
        }
      }
    }
  }

  return cuts
}

// Fonction principale d'optimisation
export function optimizeCutting(
  config: OptimizationConfig,
  specs: PieceSpec[]
): OptimizationResult {
  const normalizedConfig: OptimizationConfig = {
    ...config,
    boardWidth: Math.min(config.boardWidth, config.boardHeight),
    boardHeight: Math.max(config.boardWidth, config.boardHeight),
  }

  const validSpecs = specs.filter((s) => s.w > 0 && s.h > 0 && s.qty > 0)

  if (validSpecs.length === 0) {
    return {
      boards: [],
      allPieces: [],
      cuts: [],
      utilization: 0,
      boardWidth: normalizedConfig.boardWidth,
      boardHeight: normalizedConfig.boardHeight,
      boardOrientation: 'original',
      heuristics: [],
    }
  }

  const portraitWidth = normalizedConfig.boardWidth
  const portraitHeight = normalizedConfig.boardHeight
  const packingStrategy: 'legacy' | 'fillFirstBoard' = 'fillFirstBoard'

  const computeResult = (
    base: { boards: BoardLayout[]; allPieces: PlacedPiece[] } | null,
    tag: 'original' | 'rotated'
  ): OptimizationResult | null => {
    if (!base) return null
    const cuts = computeCuts(base.boards, portraitWidth, portraitHeight, normalizedConfig.kerf)
    const areaPieces = base.allPieces.reduce((acc, p) => acc + p.w * p.h, 0)
    const boardsArea = base.boards.length * portraitWidth * portraitHeight
    const utilization = boardsArea > 0 ? areaPieces / boardsArea : 0
    const boardsWithUtilization = base.boards.map((board, idx) => {
      const boardPieces = base.allPieces.filter((p) => p.boardIndex === board.index)
      const boardPiecesArea = boardPieces.reduce((acc, p) => acc + p.w * p.h, 0)
      const boardArea = portraitWidth * portraitHeight
      return {
        ...board,
        index: idx,
        utilization: boardArea > 0 ? boardPiecesArea / boardArea : 0,
      }
    })
    return {
      boards: boardsWithUtilization,
      allPieces: base.allPieces,
      cuts,
      utilization,
      boardWidth: portraitWidth,
      boardHeight: portraitHeight,
      boardOrientation: tag,
      heuristics: [],
    }
  }

  const candidates: CandidateResult[] = []

  const registerCandidate = (id: string, label: string, result: OptimizationResult | null) => {
    if (!result) return
    candidates.push({ id, label, outcome: result })
  }

  if (normalizedConfig.objective === 'waste') {
    const wasteBase = packWasteOptimized(
      portraitWidth,
      portraitHeight,
      validSpecs,
      normalizedConfig.kerf,
      normalizedConfig.allowRotate,
      normalizedConfig.forceTwoColumns ? 2 : undefined
    )
    registerCandidate('waste-optimized', 'Waste optimisé', computeResult(wasteBase, 'original'))
  }

  if (normalizedConfig.forceTwoColumns) {
    const twoColumns = tryOneBoardTwoColumns(
      portraitWidth,
      portraitHeight,
      validSpecs,
      normalizedConfig.kerf,
      normalizedConfig.allowRotate
    )
    registerCandidate('two-columns', 'Deux colonnes', computeResult(twoColumns, 'original'))
  }

  const guillotineBase = packGuillotine(
    portraitWidth,
    portraitHeight,
    validSpecs,
    normalizedConfig.kerf,
    normalizedConfig.allowRotate,
    normalizedConfig.objective,
    packingStrategy
  )
  registerCandidate('guillotine', 'Guillotine', computeResult(guillotineBase, 'original'))

  if (normalizedConfig.useAdvancedOptimizer) {
    try {
      const advanced = optimizeV3Fixed(normalizedConfig, validSpecs)
      if (advanced.boards.length > 0) {
        candidates.push({
          id: 'advanced',
          label: 'Multi-colonnes',
          outcome: {
            ...advanced,
            boardWidth: portraitWidth,
            boardHeight: portraitHeight,
            boardOrientation: 'original',
            heuristics: [],
          },
        })
      }
    } catch (error) {
      console.warn('V3 optimizer failed, skipping advanced heuristic', error)
    }
  }

  if (candidates.length === 0) {
    registerCandidate('guillotine', 'Guillotine', computeResult(guillotineBase, 'original'))
  }

  const compareResults = (a: OptimizationResult, b: OptimizationResult) => {
    const eps = 1e-6
    switch (normalizedConfig.objective) {
      case 'waste':
        if (Math.abs(a.utilization - b.utilization) > eps) {
          return a.utilization > b.utilization ? 1 : -1
        }
        if (a.boards.length !== b.boards.length) {
          return a.boards.length < b.boards.length ? 1 : -1
        }
        if (a.cuts.length !== b.cuts.length) {
          return a.cuts.length < b.cuts.length ? 1 : -1
        }
        return 0
      case 'cuts':
        if (a.cuts.length !== b.cuts.length) {
          return a.cuts.length < b.cuts.length ? 1 : -1
        }
        if (Math.abs(a.utilization - b.utilization) > eps) {
          return a.utilization > b.utilization ? 1 : -1
        }
        if (a.boards.length !== b.boards.length) {
          return a.boards.length < b.boards.length ? 1 : -1
        }
        return 0
      case 'balanced':
      default: {
        const score = (res: OptimizationResult) =>
          res.utilization - res.cuts.length * 1e-4 - (res.boards.length - 1) * 5e-3
        const sa = score(a)
        const sb = score(b)
        if (Math.abs(sa - sb) > 1e-9) {
          return sa > sb ? 1 : -1
        }
        return 0
      }
    }
  }

  let best = candidates[0]
  for (const candidate of candidates.slice(1)) {
    if (compareResults(candidate.outcome, best.outcome) > 0) {
      best = candidate
    }
  }

  const heuristics: HeuristicTrace[] = candidates.map((candidate) => ({
    id: candidate.id,
    label: candidate.label,
    score: candidate.outcome.utilization,
    metrics: {
      utilization: candidate.outcome.utilization,
      boards: candidate.outcome.boards.length,
      cuts: candidate.outcome.cuts.length,
    },
    selected: candidate.id === best.id,
  }))

  return {
    ...best.outcome,
    heuristics,
  }
}
