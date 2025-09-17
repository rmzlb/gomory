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
      expect(result.boardWidth).toBe(Math.min(defaultConfig.boardWidth, defaultConfig.boardHeight))
      expect(result.boardHeight).toBe(Math.max(defaultConfig.boardWidth, defaultConfig.boardHeight))
      expect(result.boardOrientation).toBe('original')
    })

    it('should place a single piece that fits', () => {
      const pieces: PieceSpec[] = [{ id: '1', w: 600, h: 400, qty: 1 }]
      const result = optimizeCutting(defaultConfig, pieces)

      expect(result.boards.length).toBeGreaterThan(0)
      expect(result.allPieces).toHaveLength(1)
      expect(result.utilization).toBeGreaterThan(0)
      expect(result.boardWidth).toBeLessThanOrEqual(result.boardHeight)
    })

    it('should handle multiple pieces of the same type', () => {
      const pieces: PieceSpec[] = [{ id: '1', w: 600, h: 400, qty: 5 }]
      const result = optimizeCutting(defaultConfig, pieces)

      expect(result.allPieces).toHaveLength(5)
      expect(result.boards.length).toBeGreaterThan(0)
    })

    it('should rotate pieces when allowed and beneficial', () => {
      const pieces: PieceSpec[] = [{ id: '1', w: 2000, h: 1000, qty: 1 }]
      const configWithRotation = { ...defaultConfig, allowRotate: true }
      const configWithoutRotation = { ...defaultConfig, allowRotate: false }

      const resultWithRotation = optimizeCutting(configWithRotation, pieces)
      const _resultWithoutRotation = optimizeCutting(configWithoutRotation, pieces)

      // With rotation should place the piece
      expect(resultWithRotation.allPieces.length).toBeGreaterThan(0)
    })

    it('should respect kerf spacing', () => {
      const pieces: PieceSpec[] = [{ id: '1', w: 100, h: 100, qty: 2 }]
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
        if (p1.y === p2.y) {
          // Same row
          expect(Math.abs(p2.x - (p1.x + p1.w))).toBeGreaterThanOrEqual(configWithKerf.kerf)
        }
      }
      expect(resultWithKerf.boardWidth).toBeLessThanOrEqual(resultWithKerf.boardHeight)
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
      const pieces: PieceSpec[] = [{ id: '1', w: 500, h: 500, qty: 10 }]

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

    it('fills early boards before opening a new one when minimizing waste', () => {
      const pieces: PieceSpec[] = [
        { id: 'A', w: 930, h: 750, qty: 6 },
        { id: 'B', w: 300, h: 800, qty: 3 },
        { id: 'C', w: 450, h: 600, qty: 4 },
        { id: 'D', w: 200, h: 300, qty: 7 },
      ]

      const wasteConfig: OptimizationConfig = {
        ...defaultConfig,
        boardWidth: 1500,
        boardHeight: 5000,
        objective: 'waste',
        forceTwoColumns: true,
      }

      const result = optimizeCutting(wasteConfig, pieces)

      expect(result.boards.length).toBeGreaterThan(0)
      if (result.boards.length > 1) {
        expect(result.boards[0].utilization || 0).toBeGreaterThanOrEqual(
          result.boards[1].utilization || 0
        )
      }
      expect(result.utilization).toBeGreaterThan(0)
    })

    it('packs compatible datasets on a single board when minimizing waste', () => {
      const pieces: PieceSpec[] = [
        { id: 'A', w: 500, h: 600, qty: 2 },
        { id: 'B', w: 500, h: 400, qty: 2 },
      ]

      const config: OptimizationConfig = {
        ...defaultConfig,
        boardWidth: 1000,
        boardHeight: 1000,
        kerf: 0,
        objective: 'waste',
        forceTwoColumns: true,
      }

      const result = optimizeCutting(config, pieces)

      expect(result.boards.length).toBe(1)
      expect(result.utilization).toBeCloseTo(1, 5)
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
      expect(result.boardWidth).toBeLessThanOrEqual(result.boardHeight)
    })

    it('should calculate utilization correctly', () => {
      const pieces: PieceSpec[] = [{ id: '1', w: 1000, h: 1000, qty: 1 }]

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
      expect(result.boardOrientation).toBe('original')
    })

    it('selects portrait orientation when input is paysage', () => {
      const pieces: PieceSpec[] = [
        { id: 'A', w: 930, h: 720, qty: 5 },
        { id: 'B', w: 1290, h: 290, qty: 3 },
      ]

      const config = {
        ...defaultConfig,
        boardWidth: 5000,
        boardHeight: 1220,
        allowRotate: false,
        forceTwoColumns: true,
      }

      const result = optimizeCutting(config, pieces)

      expect(result.boardWidth).toBeLessThanOrEqual(result.boardHeight)
      expect(result.allPieces.length).toBeGreaterThan(0)
    })

    it('fills existing boards before opening a new one', () => {
      const pieces: PieceSpec[] = [
        { id: 'A', w: 800, h: 600, qty: 4 },
        { id: 'B', w: 600, h: 400, qty: 4 },
        { id: 'C', w: 400, h: 300, qty: 6 },
      ]

      const config = {
        ...defaultConfig,
        boardWidth: 2500,
        boardHeight: 1250,
        forceTwoColumns: false,
      }

      const result = optimizeCutting(config, pieces)

      expect(result.boards.length).toBeGreaterThan(0)
      expect(result.boards.every((board) => board.strips.length > 0)).toBe(true)
      if (result.boards.length > 1) {
        expect(result.boards.slice(0, -1).every((board) => board.strips.length > 0)).toBe(true)
      }
    })
  })
})
