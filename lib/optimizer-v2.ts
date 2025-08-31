/**
 * Optimized cutting algorithm with intelligent column split selection
 * Based on the research approach for minimizing cuts in two-stage guillotine
 */

import type { 
  PieceSpec, 
  PlacedPiece, 
  Strip, 
  BoardLayout, 
  Cut,
  OptimizationResult,
  OptimizationConfig 
} from './types'

interface ColumnPackResult {
  success: boolean
  usedHeight: number
  placed: PlacedPiece[]
  strips: Strip[]
  slackTotal: number // Total unused width in strips
  closureCuts: number // Number of right-edge closure cuts needed
}

interface SplitEvaluation {
  splitX: number
  valid: boolean
  placed: PlacedPiece[]
  strips: Strip[]
  numCuts: number
  totalSlack: number
  closureCuts: number
  utilization: number
}

/**
 * Enhanced shelf packer with slack and closure cut tracking
 */
function packColumnShelvesEnhanced(
  board: BoardLayout,
  colX: number,
  colW: number,
  boardH: number,
  items: { specId: string; w: number; h: number; id: string }[],
  kerf: number,
  allowRotate: boolean,
  startingY = 0
): ColumnPackResult {
  // Try each orientation and pick the one maximizing height (NFDH principle)
  const sortable = items.map(it => {
    const orientations = [{ w: it.w, h: it.h, rot: false }]
    if (allowRotate) {
      orientations.push({ w: it.h, h: it.w, rot: true })
    }
    
    const feasible = orientations.filter(o => o.w <= colW)
    if (feasible.length === 0) {
      return { ...it, w: it.w, h: it.h, rot: false, keyH: -1 }
    }
    
    // Choose orientation with maximum height for better strip packing
    feasible.sort((a, b) => b.h - a.h)
    const best = feasible[0]
    return { ...it, w: best.w, h: best.h, rot: best.rot, keyH: best.h }
  })

  // Filter out items that can't fit
  const fittable = sortable.filter(s => s.keyH !== -1)
  if (fittable.length !== sortable.length) {
    return { 
      success: false, 
      usedHeight: 0, 
      placed: [], 
      strips: [], 
      slackTotal: 0,
      closureCuts: 0 
    }
  }

  // Sort by decreasing height (NFDH)
  fittable.sort((a, b) => {
    if (b.h !== a.h) return b.h - a.h
    return Math.max(b.w, b.h) - Math.max(a.w, a.h)
  })

  const strips: Strip[] = []
  const placed: PlacedPiece[] = []
  let slackTotal = 0
  let closureCuts = 0

  let y = startingY
  const remaining = [...fittable]

  while (remaining.length > 0) {
    const stripHeight = remaining[0].h
    const stripItems: typeof remaining = []
    
    // Collect all items that fit in this strip height
    for (let i = 0; i < remaining.length; ) {
      if (remaining[i].h <= stripHeight) {
        stripItems.push(remaining.splice(i, 1)[0])
      } else {
        i++
      }
    }

    // Pack items horizontally in the strip
    let usedWidth = 0
    const stripPieces: PlacedPiece[] = []
    
    for (let i = 0; i < stripItems.length; ) {
      const item = stripItems[i]
      const needWidth = usedWidth === 0 ? item.w : item.w + kerf
      
      if (colX + usedWidth + needWidth <= colX + colW) {
        const px = colX + (usedWidth === 0 ? 0 : usedWidth + kerf)
        const piece: PlacedPiece = {
          id: item.id,
          specId: item.specId,
          w: item.w,
          h: item.h,
          rotated: item.rot,
          x: px,
          y,
          boardIndex: board.index,
          stripIndex: strips.length,
        }
        stripPieces.push(piece)
        usedWidth = (px - colX) + item.w
        i++
      } else {
        // Item doesn't fit, try in next strip
        remaining.unshift(stripItems.splice(i, 1)[0])
      }
    }

    if (stripPieces.length === 0) continue

    // Calculate slack for this strip
    const stripSlack = colW - usedWidth
    slackTotal += stripSlack
    
    // Check if we need a closure cut (strip doesn't reach right edge)
    if (stripSlack > kerf) {
      closureCuts++
    }

    const strip: Strip = {
      x: colX,
      width: colW,
      y,
      height: stripHeight,
      pieces: stripPieces,
      usedWidth
    }
    
    strips.push(strip)
    placed.push(...stripPieces)

    y = y + stripHeight + kerf
    if (y > boardH + 1e-6) {
      return { 
        success: false, 
        usedHeight: 0, 
        placed: [], 
        strips: [], 
        slackTotal: 0,
        closureCuts: 0 
      }
    }
  }

  const usedHeight = strips.length === 0 
    ? 0 
    : (strips[strips.length - 1].y + strips[strips.length - 1].height - startingY)

  return { 
    success: true, 
    usedHeight, 
    placed, 
    strips, 
    slackTotal,
    closureCuts 
  }
}

/**
 * Intelligent simulation for piece allocation between columns
 */
function simulateColumnAllocation(
  items: { specId: string; w: number; h: number; id: string }[],
  leftWidth: number,
  rightWidth: number,
  kerf: number,
  allowRotate: boolean
): { left: typeof items; right: typeof items; valid: boolean } {
  const left: typeof items = []
  const right: typeof items = []
  
  // Sort items by size for better packing
  const sorted = [...items].sort((a, b) => 
    Math.max(b.w, b.h) - Math.max(a.w, a.h)
  )

  // Track simulated height for each column
  type SimState = { 
    totalHeight: number
    currentRowHeight: number
    currentRowRemaining: number
  }
  
  const simLeft: SimState = { 
    totalHeight: 0, 
    currentRowHeight: 0, 
    currentRowRemaining: leftWidth 
  }
  
  const simRight: SimState = { 
    totalHeight: 0, 
    currentRowHeight: 0, 
    currentRowRemaining: rightWidth 
  }

  function getBestOrientation(width: number, item: {w: number; h: number}) {
    const orientations = [{ w: item.w, h: item.h }]
    if (allowRotate) {
      orientations.push({ w: item.h, h: item.w })
    }
    const feasible = orientations.filter(o => o.w <= width)
    if (feasible.length === 0) return null
    // Prefer orientation with max height for better strip packing
    return feasible.sort((a, b) => b.h - a.h)[0]
  }

  function simulateAdd(
    state: SimState, 
    colWidth: number, 
    dims: {w: number; h: number}
  ): SimState {
    const needWidth = state.currentRowRemaining === colWidth 
      ? dims.w 
      : dims.w + kerf
    
    if (needWidth <= state.currentRowRemaining) {
      // Fits in current row
      return {
        totalHeight: state.totalHeight,
        currentRowHeight: Math.max(state.currentRowHeight, dims.h),
        currentRowRemaining: state.currentRowRemaining - needWidth
      }
    } else {
      // Need new row
      const newTotalHeight = state.currentRowHeight > 0 
        ? state.totalHeight + state.currentRowHeight + kerf 
        : 0
      return {
        totalHeight: newTotalHeight,
        currentRowHeight: dims.h,
        currentRowRemaining: colWidth - dims.w
      }
    }
  }

  for (const item of sorted) {
    const leftFit = getBestOrientation(leftWidth, item)
    const rightFit = getBestOrientation(rightWidth, item)
    
    if (leftFit && !rightFit) {
      left.push(item)
      Object.assign(simLeft, simulateAdd(simLeft, leftWidth, leftFit))
    } else if (!leftFit && rightFit) {
      right.push(item)
      Object.assign(simRight, simulateAdd(simRight, rightWidth, rightFit))
    } else if (leftFit && rightFit) {
      // Choose column with lower predicted height after adding
      const newLeft = simulateAdd(simLeft, leftWidth, leftFit)
      const newRight = simulateAdd(simRight, rightWidth, rightFit)
      
      const leftPredicted = newLeft.totalHeight + newLeft.currentRowHeight
      const rightPredicted = newRight.totalHeight + newRight.currentRowHeight
      
      if (leftPredicted <= rightPredicted) {
        left.push(item)
        Object.assign(simLeft, newLeft)
      } else {
        right.push(item)
        Object.assign(simRight, newRight)
      }
    } else {
      // Item doesn't fit in either column
      return { left: [], right: [], valid: false }
    }
  }
  
  return { left, right, valid: true }
}

/**
 * Count cuts for a board layout with proper deduplication
 */
function countCutsForBoard(
  board: BoardLayout,
  boardW: number,
  boardH: number,
  kerf: number
): number {
  const keySet = new Set<string>()
  let count = 0

  // Vertical master cuts (column splits)
  (board.columnSplits || []).forEach(x => {
    const key = `V|${x}|0|${boardH}`
    if (!keySet.has(key)) {
      keySet.add(key)
      count++
    }
  })

  // Horizontal cuts (bottom of each strip)
  board.strips.forEach(strip => {
    const y = strip.y + strip.height
    if (y < boardH) {
      const key = `H|${strip.x}|${y}|${strip.x + strip.width}`
      if (!keySet.has(key)) {
        keySet.add(key)
        count++
      }
    }
  })

  // Vertical cuts within strips
  board.strips.forEach(strip => {
    // Cuts between adjacent pieces
    for (let i = 0; i < strip.pieces.length - 1; i++) {
      const piece = strip.pieces[i]
      const x = piece.x + piece.w + kerf / 2
      const key = `V|${x}|${strip.y}|${strip.y + strip.height}`
      if (!keySet.has(key)) {
        keySet.add(key)
        count++
      }
    }
    
    // Closure cut if strip doesn't reach right edge
    const lastPiece = strip.pieces[strip.pieces.length - 1]
    if (lastPiece) {
      const rightEdge = lastPiece.x + lastPiece.w
      if (rightEdge < strip.x + strip.width - kerf) {
        const key = `V|${rightEdge}|${strip.y}|${strip.y + strip.height}`
        if (!keySet.has(key)) {
          keySet.add(key)
          count++
        }
      }
    }
  })

  return count
}

/**
 * Enhanced two-column optimization with multi-criteria evaluation
 */
export function tryOneBoardTwoColumnsOptimized(
  pieces: { id: string; width: number; height: number; rotated?: boolean; specId: string }[],
  config: OptimizationConfig
): BoardLayout & { utilization: number } {
  const { boardWidth, boardHeight, kerf, allowRotation } = config
  
  // Convert pieces to working format
  const items = pieces.map(p => ({
    specId: p.specId,
    w: p.width,
    h: p.height,
    id: p.id
  }))

  // Generate split candidates from piece dimensions
  const candidateSet = new Set<number>()
  items.forEach(item => {
    candidateSet.add(item.w)
    candidateSet.add(item.h)
    // Also add common fractions of board width
    candidateSet.add(Math.floor(boardWidth * 0.3))
    candidateSet.add(Math.floor(boardWidth * 0.4))
    candidateSet.add(Math.floor(boardWidth * 0.5))
    candidateSet.add(Math.floor(boardWidth * 0.6))
    candidateSet.add(Math.floor(boardWidth * 0.7))
  })

  const candidates = Array.from(candidateSet)
    .filter(w => w > 50 && w < boardWidth - 50)
    .sort((a, b) => a - b) // Sort ascending to try smaller splits first

  const evaluations: SplitEvaluation[] = []

  // Evaluate each split candidate
  for (const splitX of candidates) {
    const leftWidth = splitX
    const rightWidth = boardWidth - splitX - kerf
    
    if (rightWidth <= 0) continue

    // Simulate allocation
    const allocation = simulateColumnAllocation(
      items, 
      leftWidth, 
      rightWidth, 
      kerf, 
      allowRotation
    )
    
    if (!allocation.valid) {
      evaluations.push({
        splitX,
        valid: false,
        placed: [],
        strips: [],
        numCuts: Infinity,
        totalSlack: Infinity,
        closureCuts: Infinity,
        utilization: 0
      })
      continue
    }

    // Create board for evaluation
    const board: BoardLayout = {
      index: 0,
      strips: [],
      width: boardWidth,
      height: boardHeight,
      columnSplits: [splitX]
    }

    // Pack left column
    const leftPack = packColumnShelvesEnhanced(
      board,
      0,
      leftWidth,
      boardHeight,
      allocation.left,
      kerf,
      allowRotation,
      0
    )

    if (!leftPack.success) {
      evaluations.push({
        splitX,
        valid: false,
        placed: [],
        strips: [],
        numCuts: Infinity,
        totalSlack: Infinity,
        closureCuts: Infinity,
        utilization: 0
      })
      continue
    }

    // Pack right column
    const rightPack = packColumnShelvesEnhanced(
      board,
      splitX + kerf,
      rightWidth,
      boardHeight,
      allocation.right,
      kerf,
      allowRotation,
      0
    )

    if (!rightPack.success) {
      evaluations.push({
        splitX,
        valid: false,
        placed: [],
        strips: [],
        numCuts: Infinity,
        totalSlack: Infinity,
        closureCuts: Infinity,
        utilization: 0
      })
      continue
    }

    // Combine results
    const allPlaced = [...leftPack.placed, ...rightPack.placed]
    const allStrips = [...leftPack.strips, ...rightPack.strips]
    board.strips = allStrips.sort((a, b) => a.y - b.y || a.x - b.x)

    // Count cuts
    const numCuts = countCutsForBoard(board, boardWidth, boardHeight, kerf)
    
    // Calculate utilization
    const usedArea = allPlaced.reduce((sum, p) => sum + p.w * p.h, 0)
    const totalArea = boardWidth * boardHeight
    const utilization = usedArea / totalArea

    evaluations.push({
      splitX,
      valid: true,
      placed: allPlaced,
      strips: allStrips,
      numCuts,
      totalSlack: leftPack.slackTotal + rightPack.slackTotal,
      closureCuts: leftPack.closureCuts + rightPack.closureCuts,
      utilization
    })
  }

  // Filter valid evaluations
  const validEvals = evaluations.filter(e => e.valid)
  
  if (validEvals.length === 0) {
    // No valid split found, return empty board
    return {
      index: 0,
      pieces: [],
      unusedPieces: pieces,
      strips: [],
      utilization: 0,
      width: boardWidth,
      height: boardHeight
    }
  }

  // Multi-criteria scoring: prioritize fewer cuts, then less slack
  validEvals.sort((a, b) => {
    // Primary: minimize cuts
    if (a.numCuts !== b.numCuts) {
      return a.numCuts - b.numCuts
    }
    // Secondary: minimize closure cuts
    if (a.closureCuts !== b.closureCuts) {
      return a.closureCuts - b.closureCuts
    }
    // Tertiary: minimize total slack
    if (a.totalSlack !== b.totalSlack) {
      return a.totalSlack - b.totalSlack
    }
    // Quaternary: maximize utilization
    return b.utilization - a.utilization
  })

  // Return best solution
  const best = validEvals[0]
  return {
    index: 0,
    pieces: best.placed,
    unusedPieces: [],
    strips: best.strips,
    columnSplits: [best.splitX],
    utilization: best.utilization,
    width: boardWidth,
    height: boardHeight
  }
}

/**
 * Export the main optimization function that uses the enhanced algorithm
 */
export function optimizeCuttingV2(
  pieces: PieceSpec[],
  config: OptimizationConfig
): OptimizationResult {
  // Convert piece specs to expanded format
  const expandedPieces: { id: string; width: number; height: number; specId: string }[] = []
  let counter = 1
  
  for (const spec of pieces) {
    for (let i = 0; i < spec.quantity; i++) {
      expandedPieces.push({
        id: `piece-${counter++}`,
        width: spec.width,
        height: spec.height,
        specId: spec.id
      })
    }
  }

  // Try optimized two-column approach
  const board = tryOneBoardTwoColumnsOptimized(expandedPieces, config)
  
  // Generate cuts
  const cuts = computeCuts([board], config.boardWidth, config.boardHeight, config.kerf)
  
  return {
    boards: [board],
    unusedPieces: board.unusedPieces || [],
    totalBoards: 1,
    utilization: board.utilization,
    cuts
  }
}

// Re-export the original computeCuts function for compatibility
export { computeCuts } from './optimizer'