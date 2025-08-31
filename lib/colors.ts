// Color system for piece visualization
// Inspired by scientific/technical color palettes

export const pieceColors = [
  { bg: '#0ea5e9', border: '#0284c7', light: '#e0f2fe' }, // Sky blue
  { bg: '#10b981', border: '#059669', light: '#d1fae5' }, // Emerald
  { bg: '#f59e0b', border: '#d97706', light: '#fef3c7' }, // Amber
  { bg: '#8b5cf6', border: '#7c3aed', light: '#ede9fe' }, // Violet
  { bg: '#ef4444', border: '#dc2626', light: '#fee2e2' }, // Red
  { bg: '#06b6d4', border: '#0891b2', light: '#cffafe' }, // Cyan
  { bg: '#ec4899', border: '#db2777', light: '#fce7f3' }, // Pink
  { bg: '#84cc16', border: '#65a30d', light: '#ecfccb' }, // Lime
  { bg: '#f97316', border: '#ea580c', light: '#fed7aa' }, // Orange
  { bg: '#6366f1', border: '#4f46e5', light: '#e0e7ff' }, // Indigo
]

export function getPieceColor(index: number) {
  return pieceColors[index % pieceColors.length]
}

export function getPieceColorBySpecId(specId: string, specs: Array<{ id: string }>) {
  const index = specs.findIndex(s => s.id === specId)
  return index >= 0 ? getPieceColor(index) : pieceColors[0]
}