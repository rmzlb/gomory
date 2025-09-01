import type { PieceSpec, OptimizationConfig } from '@/lib/types'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validate if the optimization configuration is possible
 */
export function validateConfiguration(
  config: OptimizationConfig,
  pieces: PieceSpec[]
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if we have pieces
  const activePieces = pieces.filter((p) => p.qty > 0)
  if (activePieces.length === 0) {
    warnings.push('Aucune pièce à découper')
    return { isValid: true, errors, warnings }
  }

  // Check board dimensions
  if (config.boardWidth <= 0 || config.boardHeight <= 0) {
    errors.push('Les dimensions de la planche doivent être positives')
  }

  // Check kerf
  if (config.kerf < 0) {
    errors.push("L'épaisseur de trait de scie ne peut pas être négative")
  }

  // Check if kerf is too large
  if (config.kerf > Math.min(config.boardWidth, config.boardHeight) / 10) {
    warnings.push("L'épaisseur de trait de scie semble très grande")
  }

  // Check each piece
  for (const piece of activePieces) {
    // Check piece dimensions
    if (piece.w <= 0 || piece.h <= 0) {
      errors.push(`Pièce ${piece.id}: dimensions invalides`)
      continue
    }

    // Check if piece fits on board (considering rotation if allowed)
    const fitsNormally = piece.w <= config.boardWidth && piece.h <= config.boardHeight
    const fitsRotated =
      config.allowRotate && piece.h <= config.boardWidth && piece.w <= config.boardHeight

    if (!fitsNormally && !fitsRotated) {
      errors.push(
        `Pièce ${piece.id} (${piece.w}×${piece.h}mm) trop grande pour la planche (${config.boardWidth}×${config.boardHeight}mm)`
      )
    }

    // Check if piece is almost as large as the board
    const utilizationW = piece.w / config.boardWidth
    const utilizationH = piece.h / config.boardHeight
    if (utilizationW > 0.95 || utilizationH > 0.95) {
      warnings.push(`Pièce ${piece.id} utilise plus de 95% de la largeur ou hauteur de la planche`)
    }
  }

  // Check total area
  const totalPieceArea = activePieces.reduce((sum, p) => sum + p.w * p.h * p.qty, 0)
  const boardArea = config.boardWidth * config.boardHeight

  if (totalPieceArea > boardArea) {
    warnings.push(
      `Surface totale des pièces (${(totalPieceArea / 1000000).toFixed(2)}m²) dépasse la surface de la planche (${(boardArea / 1000000).toFixed(2)}m²)`
    )
  }

  // Check if two-column mode makes sense
  if (config.forceTwoColumns) {
    const smallestPieceWidth = Math.min(
      ...activePieces.map((p) => (config.allowRotate ? Math.min(p.w, p.h) : p.w))
    )

    if (smallestPieceWidth * 2 > config.boardWidth) {
      warnings.push(
        'Mode deux colonnes activé mais certaines pièces sont trop larges pour tenir sur deux colonnes'
      )
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Get a summary message for validation results
 */
export function getValidationSummary(result: ValidationResult): string {
  if (result.errors.length > 0) {
    return `Configuration impossible: ${result.errors[0]}`
  }
  if (result.warnings.length > 0) {
    return `Attention: ${result.warnings[0]}`
  }
  return ''
}
