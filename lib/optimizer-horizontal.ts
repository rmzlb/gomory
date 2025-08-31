/**
 * Horizontal-first cutting strategy
 * Creates full-width strips first, then vertical cuts within each strip
 * This can sometimes reduce the total number of cuts by aligning vertical cuts across the board
 */

import type { 
  PieceSpec, 
  PlacedPiece, 
  Strip, 
  BoardLayout,
  OptimizationConfig
} from './types'

interface HorizontalPackResult {
  boards: BoardLayout[]
  allPieces: PlacedPiece[]
  totalCuts: number
}

/**
 * Pack items into horizontal strips (full board width)
 * Then make vertical cuts within each strip
 */
function packHorizontalFirst(
  boardW: number,
  boardH: number,
  specs: PieceSpec[],
  kerf: number,
  allowRotate: boolean,
  objective: 'waste' | 'cuts' | 'balanced' = 'balanced'
): HorizontalPackResult {
  // Expand pieces
  const items: { specId: string; w: number; h: number; id: string }[] = []
  let counter = 1
  for (const spec of specs) {
    for (let i = 0; i < spec.qty; i++) {
      items.push({ 
        specId: spec.id, 
        w: spec.w, 
        h: spec.h, 
        id: `#${counter++}` 
      })
    }
  }

  // Group items by height for better strip formation
  const heightGroups = new Map<number, typeof items>()
  
  items.forEach(item => {
    // Consider both orientations if rotation allowed
    const heights = [item.h]
    if (allowRotate) heights.push(item.w)
    
    // Find best height that fits
    let bestHeight = -1
    let bestOrientation = { w: item.w, h: item.h, rotated: false }
    
    for (const h of heights) {
      if (h <= boardH) {
        if (bestHeight === -1 || h > bestHeight) {
          bestHeight = h
          bestOrientation = h === item.h 
            ? { w: item.w, h: item.h, rotated: false }
            : { w: item.h, h: item.w, rotated: true }
        }
      }
    }
    
    if (bestHeight > 0) {
      if (!heightGroups.has(bestHeight)) {
        heightGroups.set(bestHeight, [])
      }
      heightGroups.get(bestHeight)!.push({
        ...item,
        w: bestOrientation.w,
        h: bestOrientation.h
      })
    }
  })

  // Sort height groups by decreasing height
  const sortedHeights = Array.from(heightGroups.keys()).sort((a, b) => b - a)
  
  const boards: BoardLayout[] = []
  const allPieces: PlacedPiece[] = []
  let currentBoard: BoardLayout | null = null
  let currentY = 0

  function createNewBoard(): BoardLayout {
    const board: BoardLayout = {
      index: boards.length,
      strips: [],
      width: boardW,
      height: boardH,
      columnSplits: []
    }
    boards.push(board)
    currentY = 0
    return board
  }

  // Process each height group
  for (const stripHeight of sortedHeights) {
    const itemsInGroup = heightGroups.get(stripHeight)!
    
    // Sort items in group by width (descending) for better packing
    itemsInGroup.sort((a, b) => b.w - a.w)
    
    while (itemsInGroup.length > 0) {
      if (!currentBoard || currentY + stripHeight > boardH) {
        currentBoard = createNewBoard()
      }
      
      // Create a new strip
      const strip: Strip = {
        x: 0,
        width: boardW,
        y: currentY,
        height: stripHeight,
        pieces: [],
        usedWidth: 0
      }
      
      // Pack items into the strip
      let stripX = 0
      const piecesInStrip: PlacedPiece[] = []
      
      for (let i = 0; i < itemsInGroup.length; ) {
        const item = itemsInGroup[i]
        const needWidth = stripX === 0 ? item.w : item.w + kerf
        
        if (stripX + needWidth <= boardW) {
          const piece: PlacedPiece = {
            id: item.id,
            specId: item.specId,
            w: item.w,
            h: item.h,
            rotated: item.w !== specs.find(s => s.id === item.specId)?.w,
            x: stripX === 0 ? 0 : stripX + kerf,
            y: currentY,
            boardIndex: currentBoard.index,
            stripIndex: currentBoard.strips.length
          }
          
          piecesInStrip.push(piece)
          allPieces.push(piece)
          stripX = piece.x + piece.w
          itemsInGroup.splice(i, 1)
        } else {
          i++
        }
      }
      
      if (piecesInStrip.length > 0) {
        strip.pieces = piecesInStrip
        strip.usedWidth = stripX
        currentBoard.strips.push(strip)
        currentY += stripHeight + kerf
      } else {
        break // Can't fit any more items in this height
      }
    }
  }

  // Calculate total cuts
  let totalCuts = 0
  boards.forEach(board => {
    // Horizontal cuts (one per strip except last)
    totalCuts += Math.max(0, board.strips.length - 1)
    
    // Vertical cuts within strips
    board.strips.forEach(strip => {
      // Cuts between pieces
      totalCuts += Math.max(0, strip.pieces.length - 1)
      
      // Closure cut if strip doesn't use full width
      if (strip.usedWidth < boardW - kerf) {
        totalCuts++
      }
    })
  })

  return { boards, allPieces, totalCuts }
}

/**
 * Compare horizontal-first vs vertical-first strategies
 */
export function compareStrategies(
  specs: PieceSpec[],
  config: OptimizationConfig
): {
  horizontalFirst: HorizontalPackResult
  verticalFirst: { boards: BoardLayout[]; totalCuts: number } | null
  recommendation: 'horizontal' | 'vertical' | 'equal'
} {
  // Run horizontal-first strategy
  const horizontalResult = packHorizontalFirst(
    config.boardWidth,
    config.boardHeight,
    specs,
    config.kerf,
    config.allowRotate,
    config.objective
  )

  // For vertical-first, we would use the existing tryOneBoardTwoColumns
  // This is a placeholder - would need to import and use the actual function
  const verticalResult = null // Would call tryOneBoardTwoColumns here

  // Determine recommendation based on cuts and utilization
  let recommendation: 'horizontal' | 'vertical' | 'equal' = 'equal'
  
  if (verticalResult) {
    if (horizontalResult.totalCuts < verticalResult.totalCuts) {
      recommendation = 'horizontal'
    } else if (verticalResult.totalCuts < horizontalResult.totalCuts) {
      recommendation = 'vertical'
    }
  } else {
    recommendation = 'horizontal'
  }

  return {
    horizontalFirst: horizontalResult,
    verticalFirst: verticalResult,
    recommendation
  }
}

/**
 * Advanced multi-stage optimization
 * Tries different patterns and selects the best
 */
export function optimizeMultiStage(
  specs: PieceSpec[],
  config: OptimizationConfig
): {
  strategy: 'horizontal' | 'vertical' | 'mixed'
  boards: BoardLayout[]
  totalCuts: number
  utilization: number
} {
  // Try horizontal-first
  const horizontal = packHorizontalFirst(
    config.boardWidth,
    config.boardHeight,
    specs,
    config.kerf,
    config.allowRotate,
    config.objective
  )

  // Calculate utilization
  const totalArea = horizontal.boards.length * config.boardWidth * config.boardHeight
  const usedArea = horizontal.allPieces.reduce((sum, p) => sum + p.w * p.h, 0)
  const utilization = usedArea / totalArea

  return {
    strategy: 'horizontal',
    boards: horizontal.boards,
    totalCuts: horizontal.totalCuts,
    utilization
  }
}

/**
 * Pattern recognition for repetitive pieces
 * Groups pieces by dimensions to optimize placement
 */
export function analyzePatterns(specs: PieceSpec[]): {
  patterns: Map<string, { width: number; height: number; count: number }>
  recommendation: string
} {
  const patterns = new Map<string, { width: number; height: number; count: number }>()
  
  specs.forEach(spec => {
    const key = `${spec.w}x${spec.h}`
    const existing = patterns.get(key) || { width: spec.w, height: spec.h, count: 0 }
    existing.count += spec.qty
    patterns.set(key, existing)
  })

  // Sort patterns by count
  const sortedPatterns = Array.from(patterns.entries())
    .sort((a, b) => b[1].count - a[1].count)

  let recommendation = ''
  if (sortedPatterns.length > 0 && sortedPatterns[0][1].count > 5) {
    const dominant = sortedPatterns[0][1]
    recommendation = `Consider optimizing for ${dominant.width}x${dominant.height} pieces (${dominant.count} pieces)`
  }

  return { patterns, recommendation }
}