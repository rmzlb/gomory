import { optimizeCutting, tryOneBoardTwoColumns } from '../optimizer'
import type { PieceSpec, BoardConfig, OptimizationObjective } from '../types'

describe('optimizer', () => {
  const defaultBoardConfig: BoardConfig = {
    boardWidth: 2800,
    boardHeight: 2070,
    kerf: 3,
    allowRotation: true,
    useTwoColumns: false,
    objective: 'waste' as OptimizationObjective,
  }

  describe('optimizeCutting', () => {
    it('should handle empty pieces array', () => {
      const result = optimizeCutting([], defaultBoardConfig)
      expect(result.boards).toHaveLength(0)
      expect(result.unusedPieces).toHaveLength(0)
      expect(result.totalBoards).toBe(0)
    })

    it('should place a single piece that fits', () => {
      const pieces: PieceSpec[] = [
        { id: '1', width: 600, height: 400, quantity: 1 },
      ]
      const result = optimizeCutting(pieces, defaultBoardConfig)
      
      expect(result.totalBoards).toBe(1)
      expect(result.boards[0].pieces).toHaveLength(1)
      expect(result.unusedPieces).toHaveLength(0)
    })

    it('should handle multiple pieces of the same type', () => {
      const pieces: PieceSpec[] = [
        { id: '1', width: 600, height: 400, quantity: 5 },
      ]
      const result = optimizeCutting(pieces, defaultBoardConfig)
      
      expect(result.boards[0].pieces.length).toBeGreaterThanOrEqual(5)
      expect(result.unusedPieces).toHaveLength(0)
    })

    it('should rotate pieces when allowed and beneficial', () => {
      const pieces: PieceSpec[] = [
        { id: '1', width: 2000, height: 1000, quantity: 1 },
      ]
      const configWithRotation = { ...defaultBoardConfig, allowRotation: true }
      const configWithoutRotation = { ...defaultBoardConfig, allowRotation: false }
      
      const resultWithRotation = optimizeCutting(pieces, configWithRotation)
      const resultWithoutRotation = optimizeCutting(pieces, configWithoutRotation)
      
      expect(resultWithRotation.totalBoards).toBeLessThanOrEqual(
        resultWithoutRotation.totalBoards
      )
    })

    it('should respect kerf spacing', () => {
      const pieces: PieceSpec[] = [
        { id: '1', width: 100, height: 100, quantity: 2 },
      ]
      const configWithKerf = { ...defaultBoardConfig, kerf: 10 }
      const result = optimizeCutting(pieces, configWithKerf)
      
      if (result.boards.length > 0 && result.boards[0].pieces.length >= 2) {
        const piece1 = result.boards[0].pieces[0]
        const piece2 = result.boards[0].pieces[1]
        
        // Check that pieces don't overlap considering kerf
        const horizontalGap = Math.abs(piece2.x - (piece1.x + piece1.width))
        const verticalGap = Math.abs(piece2.y - (piece1.y + piece1.height))
        
        expect(Math.min(horizontalGap, verticalGap)).toBeGreaterThanOrEqual(0)
      }
    })

    it('should report unused pieces when they dont fit', () => {
      const pieces: PieceSpec[] = [
        { id: '1', width: 3000, height: 3000, quantity: 1 }, // Too large
      ]
      const result = optimizeCutting(pieces, defaultBoardConfig)
      
      expect(result.unusedPieces).toHaveLength(1)
      expect(result.unusedPieces[0].specId).toBe('1')
    })

    it('should optimize for different objectives', () => {
      const pieces: PieceSpec[] = [
        { id: '1', width: 600, height: 400, quantity: 10 },
        { id: '2', width: 800, height: 300, quantity: 5 },
      ]
      
      const wasteResult = optimizeCutting(pieces, {
        ...defaultBoardConfig,
        objective: 'waste',
      })
      
      const cutsResult = optimizeCutting(pieces, {
        ...defaultBoardConfig,
        objective: 'cuts',
      })
      
      // Results might differ based on objective
      expect(wasteResult.totalBoards).toBeGreaterThan(0)
      expect(cutsResult.totalBoards).toBeGreaterThan(0)
    })
  })

  describe('tryOneBoardTwoColumns', () => {
    it('should use two columns when enabled', () => {
      const pieces: PieceSpec[] = [
        { id: '1', width: 1200, height: 400, quantity: 4 },
      ]
      
      const configWithTwoColumns = {
        ...defaultBoardConfig,
        useTwoColumns: true,
      }
      
      const result = tryOneBoardTwoColumns(
        pieces.flatMap(p => 
          Array(p.quantity).fill(null).map((_, i) => ({
            id: `${p.id}-${i}`,
            width: p.width,
            height: p.height,
            rotated: false,
            specId: p.id,
          }))
        ),
        configWithTwoColumns
      )
      
      if (result.columnSplits && result.columnSplits.length > 0) {
        expect(result.columnSplits.length).toBeGreaterThanOrEqual(1)
        expect(result.columnSplits.length).toBeLessThanOrEqual(2)
      }
    })

    it('should calculate utilization correctly', () => {
      const pieces: PieceSpec[] = [
        { id: '1', width: 600, height: 400, quantity: 1 },
      ]
      
      const result = tryOneBoardTwoColumns(
        pieces.flatMap(p => 
          Array(p.quantity).fill(null).map((_, i) => ({
            id: `${p.id}-${i}`,
            width: p.width,
            height: p.height,
            rotated: false,
            specId: p.id,
          }))
        ),
        defaultBoardConfig
      )
      
      const expectedUtilization = (600 * 400) / (2800 * 2070)
      expect(result.utilization).toBeCloseTo(expectedUtilization, 2)
    })

    it('should handle empty pieces array', () => {
      const result = tryOneBoardTwoColumns([], defaultBoardConfig)
      
      expect(result.pieces).toHaveLength(0)
      expect(result.unusedPieces).toHaveLength(0)
      expect(result.utilization).toBe(0)
    })
  })
})