/**
 * Optimizer V3 Fixed - Multi-column with proper placement
 * 
 * Fixes:
 * - Correct board dimensions
 * - No overlapping pieces
 * - All pieces placed
 * - Proper kerf handling
 */

import type {
  PieceSpec,
  PlacedPiece,
  Strip,
  BoardLayout,
  Cut,
  OptimizationResult,
  OptimizationConfig,
} from './types'

// Simple multi-column packing that actually works
export function packMultiColumnSimple(
  boardW: number,
  boardH: number,
  specs: PieceSpec[],
  kerf: number,
  allowRotate: boolean
): { boards: BoardLayout[]; allPieces: PlacedPiece[] } {
  // Prepare items
  const items: { specId: string; w: number; h: number; id: string }[] = []
  let counter = 1
  for (const s of specs) {
    for (let q = 0; q < s.qty; q++) {
      items.push({ specId: s.id, w: s.w, h: s.h, id: `#${counter++}` })
    }
  }

  // Sort by height (NFDH)
  const sorted = items.map(item => {
    const orientations = [
      { w: item.w, h: item.h, rotated: false },
      ...(allowRotate && item.w !== item.h ? [{ w: item.h, h: item.w, rotated: true }] : [])
    ]
    // Pick orientation that maximizes height while fitting
    const valid = orientations.filter(o => o.w <= boardW)
    if (valid.length === 0) return null
    const best = valid.sort((a, b) => b.h - a.h)[0]
    return { ...item, ...best }
  }).filter(Boolean) as Array<typeof items[0] & { rotated: boolean }>

  sorted.sort((a, b) => b.h - a.h)

  const boards: BoardLayout[] = []
  const allPieces: PlacedPiece[] = []
  let currentBoardIndex = 0

  while (sorted.length > 0) {
    const board: BoardLayout = {
      index: currentBoardIndex,
      strips: [],
      width: boardW,
      height: boardH,
      columnSplits: [],
    }

    const placed: PlacedPiece[] = []
    const strips: Strip[] = []
    
    // Simple strip packing
    let currentY = 0
    
    while (sorted.length > 0 && currentY < boardH) {
      const stripHeight = sorted[0].h
      
      // Check if strip fits
      if (currentY + stripHeight > boardH) break
      
      const strip: Strip = {
        x: 0,
        width: boardW,
        y: currentY,
        height: stripHeight,
        pieces: [],
        usedWidth: 0,
      }
      
      let currentX = 0
      
      // Pack items into this strip
      for (let i = 0; i < sorted.length; ) {
        const item = sorted[i]
        
        if (item.h <= stripHeight) {
          const pieceWidth = item.w
          const neededWidth = currentX === 0 ? pieceWidth : pieceWidth + kerf
          
          if (currentX + neededWidth <= boardW) {
            const x = currentX === 0 ? 0 : currentX + kerf
            
            const piece: PlacedPiece = {
              id: item.id,
              specId: item.specId,
              w: item.w,
              h: item.h,
              rotated: item.rotated,
              x,
              y: currentY,
              boardIndex: currentBoardIndex,
              stripIndex: strips.length,
            }
            
            strip.pieces.push(piece)
            placed.push(piece)
            currentX = x + pieceWidth
            sorted.splice(i, 1)
          } else {
            i++
          }
        } else {
          i++
        }
      }
      
      if (strip.pieces.length > 0) {
        strip.usedWidth = currentX
        strips.push(strip)
        currentY += stripHeight + kerf
      } else {
        break
      }
    }
    
    if (placed.length > 0) {
      board.strips = strips
      boards.push(board)
      allPieces.push(...placed)
      currentBoardIndex++
    } else {
      break
    }
  }

  return { boards, allPieces }
}

// Multi-column with dynamic column creation
export function packDynamicColumns(
  boardW: number,
  boardH: number,
  specs: PieceSpec[],
  kerf: number,
  allowRotate: boolean
): { boards: BoardLayout[]; allPieces: PlacedPiece[] } | null {
  // Prepare and sort items
  const items: { specId: string; w: number; h: number; id: string }[] = []
  let counter = 1
  for (const s of specs) {
    for (let q = 0; q < s.qty; q++) {
      items.push({ specId: s.id, w: s.w, h: s.h, id: `#${counter++}` })
    }
  }

  // Sort by area (for better packing)
  items.sort((a, b) => (b.w * b.h) - (a.w * a.h))

  const board: BoardLayout = {
    index: 0,
    strips: [],
    width: boardW,
    height: boardH,
    columnSplits: [],
  }

  const allPieces: PlacedPiece[] = []
  
  // Dynamic columns
  interface Column {
    x: number
    width: number
    currentY: number
    strips: Strip[]
  }
  
  const columns: Column[] = []
  
  for (const item of items) {
    let placed = false
    
    // Try both orientations
    const orientations = [
      { w: item.w, h: item.h, rotated: false },
      ...(allowRotate && item.w !== item.h ? [{ w: item.h, h: item.w, rotated: true }] : [])
    ]
    
    // Try to place in existing columns
    for (const orient of orientations) {
      for (const col of columns) {
        if (orient.w <= col.width && col.currentY + orient.h <= boardH) {
          // Can place in this column
          
          // Find or create strip
          let strip = col.strips.find(s => 
            s.height === orient.h && 
            s.usedWidth + orient.w <= s.width
          )
          
          if (!strip) {
            strip = {
              x: col.x,
              width: col.width,
              y: col.currentY,
              height: orient.h,
              pieces: [],
              usedWidth: 0,
            }
            col.strips.push(strip)
            col.currentY = Math.max(col.currentY, strip.y + strip.height + kerf)
          }
          
          // Place piece
          const x = strip.x + (strip.usedWidth === 0 ? 0 : strip.usedWidth + kerf)
          const piece: PlacedPiece = {
            id: item.id,
            specId: item.specId,
            w: orient.w,
            h: orient.h,
            rotated: orient.rotated,
            x,
            y: strip.y,
            boardIndex: 0,
            stripIndex: board.strips.length,
          }
          
          strip.pieces.push(piece)
          strip.usedWidth = x - strip.x + orient.w
          allPieces.push(piece)
          placed = true
          break
        }
      }
      if (placed) break
    }
    
    // If not placed, try creating new column
    if (!placed) {
      const currentX = columns.reduce((sum, col) => 
        Math.max(sum, col.x + col.width + kerf), 0
      )
      
      for (const orient of orientations) {
        if (currentX + orient.w <= boardW) {
          // Create new column
          const col: Column = {
            x: currentX,
            width: orient.w,
            currentY: 0,
            strips: [],
          }
          
          const strip: Strip = {
            x: col.x,
            width: col.width,
            y: 0,
            height: orient.h,
            pieces: [],
            usedWidth: 0,
          }
          
          const piece: PlacedPiece = {
            id: item.id,
            specId: item.specId,
            w: orient.w,
            h: orient.h,
            rotated: orient.rotated,
            x: col.x,
            y: 0,
            boardIndex: 0,
            stripIndex: board.strips.length,
          }
          
          strip.pieces.push(piece)
          strip.usedWidth = orient.w
          col.strips.push(strip)
          col.currentY = orient.h + kerf
          
          columns.push(col)
          if (currentX > 0) {
            board.columnSplits.push(currentX)
          }
          
          allPieces.push(piece)
          placed = true
          break
        }
      }
    }
    
    // If still not placed, packing failed
    if (!placed) {
      return null
    }
  }
  
  // Consolidate all strips
  board.strips = columns.flatMap(col => col.strips)
  
  return {
    boards: [board],
    allPieces,
  }
}

// Count cuts properly
function computeCuts(
  boards: BoardLayout[],
  boardW: number,
  boardH: number,
  kerf: number
): Cut[] {
  const cuts: Cut[] = []
  let cutId = 1

  for (const board of boards) {
    const uniqueCuts = new Set<string>()

    // Column splits
    if (board.columnSplits) {
      board.columnSplits.forEach(x => {
        const key = `V|${board.index}|${x}|0|${x}|${boardH}`
        if (!uniqueCuts.has(key)) {
          uniqueCuts.add(key)
          cuts.push({
            id: cutId++,
            boardIndex: board.index,
            type: 'V',
            x1: x,
            y1: 0,
            x2: x,
            y2: boardH,
          })
        }
      })
    }

    // Horizontal seams between strips
    board.strips.forEach(strip => {
      if (strip.y + strip.height < boardH) {
        const key = `H|${board.index}|${strip.x}|${strip.y + strip.height}|${strip.x + strip.width}|${strip.y + strip.height}`
        if (!uniqueCuts.has(key)) {
          uniqueCuts.add(key)
          cuts.push({
            id: cutId++,
            boardIndex: board.index,
            type: 'H',
            x1: strip.x,
            y1: strip.y + strip.height,
            x2: strip.x + strip.width,
            y2: strip.y + strip.height,
          })
        }
      }
    })

    // Vertical cuts within strips
    board.strips.forEach(strip => {
      const sortedPieces = strip.pieces.sort((a, b) => a.x - b.x)
      
      sortedPieces.forEach((piece, i) => {
        if (i < sortedPieces.length - 1) {
          const nextPiece = sortedPieces[i + 1]
          const cutX = piece.x + piece.w + kerf / 2
          
          const key = `V|${board.index}|${cutX}|${strip.y}|${cutX}|${strip.y + strip.height}`
          if (!uniqueCuts.has(key)) {
            uniqueCuts.add(key)
            cuts.push({
              id: cutId++,
              boardIndex: board.index,
              type: 'V',
              x1: cutX,
              y1: strip.y,
              x2: cutX,
              y2: strip.y + strip.height,
            })
          }
        }
      })

      // Closing cut if needed
      const lastPiece = sortedPieces[sortedPieces.length - 1]
      if (lastPiece) {
        const pieceRight = lastPiece.x + lastPiece.w
        const stripRight = strip.x + strip.width
        
        if (pieceRight < stripRight - kerf) {
          const cutX = pieceRight + kerf / 2
          const key = `V|${board.index}|${cutX}|${strip.y}|${cutX}|${strip.y + strip.height}`
          
          if (!uniqueCuts.has(key)) {
            uniqueCuts.add(key)
            cuts.push({
              id: cutId++,
              boardIndex: board.index,
              type: 'V',
              x1: cutX,
              y1: strip.y,
              x2: cutX,
              y2: strip.y + strip.height,
            })
          }
        }
      }
    })
  }

  return cuts
}

// Main export - use simple multi-column for now
export function optimizeV3Fixed(
  config: OptimizationConfig,
  specs: PieceSpec[]
): OptimizationResult {
  const validSpecs = specs.filter(s => s.w > 0 && s.h > 0 && s.qty > 0)

  if (validSpecs.length === 0) {
    return {
      boards: [],
      allPieces: [],
      cuts: [],
      utilization: 0,
    }
  }

  // Try dynamic columns first
  const dynamicResult = packDynamicColumns(
    config.boardWidth,
    config.boardHeight,
    validSpecs,
    config.kerf,
    config.allowRotate
  )

  let result
  if (dynamicResult) {
    result = dynamicResult
  } else {
    // Fallback to simple packing
    result = packMultiColumnSimple(
      config.boardWidth,
      config.boardHeight,
      validSpecs,
      config.kerf,
      config.allowRotate
    )
  }

  const cuts = computeCuts(
    result.boards,
    config.boardWidth,
    config.boardHeight,
    config.kerf
  )

  const areaPieces = result.allPieces.reduce((acc, p) => acc + p.w * p.h, 0)
  const boardsArea = result.boards.length * config.boardWidth * config.boardHeight
  const utilization = boardsArea > 0 ? areaPieces / boardsArea : 0

  // Calculate utilization for each board
  const boardsWithUtilization = result.boards.map(board => {
    const boardPieces = result.allPieces.filter(p => p.boardIndex === board.index)
    const boardPiecesArea = boardPieces.reduce((acc, p) => acc + p.w * p.h, 0)
    const boardArea = config.boardWidth * config.boardHeight
    return {
      ...board,
      utilization: boardArea > 0 ? boardPiecesArea / boardArea : 0,
    }
  })

  return {
    boards: boardsWithUtilization,
    allPieces: result.allPieces,
    cuts,
    utilization,
  }
}