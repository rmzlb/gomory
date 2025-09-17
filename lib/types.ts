// Types pour l'optimiseur de découpe

export type PieceSpec = {
  id: string
  w: number // largeur en mm
  h: number // hauteur en mm
  qty: number
}

export type PlacedPiece = {
  id: string // #1, #2, ...
  specId: string // référence de la pièce
  w: number
  h: number
  rotated: boolean
  x: number
  y: number
  boardIndex: number
  stripIndex: number
}

export type Strip = {
  x: number // origine X de la bande
  width: number // largeur utile de la bande
  y: number // top Y de la bande
  height: number // hauteur de la bande
  pieces: PlacedPiece[]
  usedWidth: number // largeur utilisée
}

export type BoardLayout = {
  index: number
  strips: Strip[]
  width: number
  height: number
  columnSplits?: number[] // positions X des scissions verticales
  utilization?: number // board utilization ratio
}

export type Cut = {
  id: number
  type: 'H' | 'V'
  x1: number
  y1: number
  x2: number
  y2: number
  boardIndex: number
}

export type HeuristicTrace = {
  id: string
  label: string
  score: number
  metrics: {
    utilization: number
    boards: number
    cuts: number
  }
  selected: boolean
}

export type OptimizationResult = {
  boards: BoardLayout[]
  allPieces: PlacedPiece[]
  cuts: Cut[]
  utilization: number
  boardWidth: number
  boardHeight: number
  boardOrientation: 'original' | 'rotated'
  heuristics: HeuristicTrace[]
}

export type OptimizationConfig = {
  boardWidth: number
  boardHeight: number
  kerf: number
  allowRotate: boolean
  forceTwoColumns: boolean
  objective: 'waste' | 'cuts' | 'balanced'
  useAdvancedOptimizer?: boolean // Enable multi-column + multi-start V3 optimizer
}
