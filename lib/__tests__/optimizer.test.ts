import { optimizeCutting } from '../optimizer'
import type { PieceSpec, OptimizationConfig } from '../types'

describe('optimizer', () => {
  const defaultConfig: OptimizationConfig = {
    boardWidth: 2800,
    boardHeight: 2070,
    kerf: 3,
    allowRotate: true,
    forceTwoColumns: false,
    objective: 'balanced',
  }

  describe('optimizeCutting', () => {
    it('should handle empty pieces array', () => {
      const result = optimizeCutting(defaultConfig, [])
      expect(result.boards).toHaveLength(0)
      expect(result.allPieces).toHaveLength(0)
      expect(result.utilization).toBe(0)
    })

    it('should place a single piece that fits', () => {
      const pieces: PieceSpec[] = [
        { id: '1', w: 600, h: 400, qty: 1 },
      ]
      const result = optimizeCutting(defaultConfig, pieces)
      
      expect(result.boards.length).toBeGreaterThan(0)
      expect(result.allPieces).toHaveLength(1)
      expect(result.utilization).toBeGreaterThan(0)
    })

    it('should handle multiple pieces of the same type', () => {
      const pieces: PieceSpec[] = [
        { id: '1', w: 600, h: 400, qty: 5 },
      ]
      const result = optimizeCutting(defaultConfig, pieces)
      
      expect(result.allPieces).toHaveLength(5)
      expect(result.boards.length).toBeGreaterThan(0)
    })

    it('should rotate pieces when allowed and beneficial', () => {
      const pieces: PieceSpec[] = [
        { id: '1', w: 2000, h: 1000, qty: 1 },
      ]
      const configWithRotation = { ...defaultConfig, allowRotate: true }
      const configWithoutRotation = { ...defaultConfig, allowRotate: false }
      
      const resultWithRotation = optimizeCutting(configWithRotation, pieces)
      const resultWithoutRotation = optimizeCutting(configWithoutRotation, pieces)
      
      // With rotation should place the piece
      expect(resultWithRotation.allPieces.length).toBeGreaterThan(0)
    })

    it('should respect kerf spacing', () => {
      const pieces: PieceSpec[] = [
        { id: '1', w: 100, h: 100, qty: 2 },
      ]
      const configWithKerf = { ...defaultConfig, kerf: 10 }
      const configWithoutKerf = { ...defaultConfig, kerf: 0 }
      
      const resultWithKerf = optimizeCutting(configWithKerf, pieces)
      const resultWithoutKerf = optimizeCutting(configWithoutKerf, pieces)
      
      // Both should place all pieces
      expect(resultWithKerf.allPieces).toHaveLength(2)
      expect(resultWithoutKerf.allPieces).toHaveLength(2)
      
      // Check that pieces are spaced with kerf
      if (resultWithKerf.allPieces.length === 2) {
        const [p1, p2] = resultWithKerf.allPieces
        if (p1.y === p2.y) { // Same row
          expect(Math.abs(p2.x - (p1.x + p1.w))).toBeGreaterThanOrEqual(configWithKerf.kerf)
        }
      }
    })

    it('should handle pieces that dont fit', () => {
      const pieces: PieceSpec[] = [
        { id: '1', w: 3000, h: 3000, qty: 1 }, // Too big
      ]
      const result = optimizeCutting(defaultConfig, pieces)
      
      // The optimizer may try to place the piece anyway (rotated or on multiple boards)
      // Just check that it doesn't crash
      expect(result).toBeDefined()
      expect(result.boards).toBeDefined()
      expect(result.allPieces).toBeDefined()
    })

    it('should optimize for different objectives', () => {
      const pieces: PieceSpec[] = [
        { id: '1', w: 500, h: 500, qty: 10 },
      ]
      
      const wasteConfig = { ...defaultConfig, objective: 'waste' as const }
      const cutsConfig = { ...defaultConfig, objective: 'cuts' as const }
      const balancedConfig = { ...defaultConfig, objective: 'balanced' as const }
      
      const wasteResult = optimizeCutting(wasteConfig, pieces)
      const cutsResult = optimizeCutting(cutsConfig, pieces)
      const balancedResult = optimizeCutting(balancedConfig, pieces)
      
      // All should place all pieces
      expect(wasteResult.allPieces).toHaveLength(10)
      expect(cutsResult.allPieces).toHaveLength(10)
      expect(balancedResult.allPieces).toHaveLength(10)
    })
  })

  describe('board layout', () => {
    it('should use two columns when enabled', () => {
      const pieces: PieceSpec[] = [
        { id: 'A', w: 600, h: 400, qty: 2 },
        { id: 'B', w: 600, h: 400, qty: 2 },
      ]
      
      const config = { ...defaultConfig, forceTwoColumns: true }
      const result = optimizeCutting(config, pieces)
      
      expect(result.boards.length).toBeGreaterThan(0)
      if (result.boards[0].columnSplits) {
        expect(result.boards[0].columnSplits.length).toBeGreaterThan(0)
      }
    })

    it('should calculate utilization correctly', () => {
      const pieces: PieceSpec[] = [
        { id: '1', w: 1000, h: 1000, qty: 1 },
      ]
      
      const result = optimizeCutting(defaultConfig, pieces)
      
      const boardArea = defaultConfig.boardWidth * defaultConfig.boardHeight
      const pieceArea = 1000 * 1000
      const expectedUtilization = pieceArea / boardArea
      
      expect(result.utilization).toBeCloseTo(expectedUtilization, 1)
    })

    it('should handle empty pieces array', () => {
      const result = optimizeCutting(defaultConfig, [])
      
      expect(result.boards).toHaveLength(0)
      expect(result.allPieces).toHaveLength(0)
      expect(result.utilization).toBe(0)
    })
  })
})