import type { PieceSpec, OptimizationConfig, OptimizationResult } from '@/lib/types'

export interface SavedConfiguration {
  id: string
  name?: string
  timestamp: number
  config: OptimizationConfig
  pieces: PieceSpec[]
  result?: {
    utilization: number
    boardCount: number
    cutCount: number
    pieceCount: number
  }
}

const STORAGE_KEY = 'gomory_history'
const MAX_HISTORY_ITEMS = 10

/**
 * Load history from localStorage
 */
export function loadHistory(): SavedConfiguration[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const history = JSON.parse(stored) as SavedConfiguration[]
    // Ensure we have valid data
    return Array.isArray(history) ? history.slice(0, MAX_HISTORY_ITEMS) : []
  } catch (error) {
    console.error('Failed to load history:', error)
    return []
  }
}

/**
 * Save configuration to history
 */
export function saveToHistory(
  config: OptimizationConfig,
  pieces: PieceSpec[],
  result?: OptimizationResult,
  name?: string
): void {
  if (typeof window === 'undefined') return

  try {
    const history = loadHistory()

    // Create new entry
    const entry: SavedConfiguration = {
      id: `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name || generateName(pieces, result),
      timestamp: Date.now(),
      config,
      pieces: pieces.map((p) => ({ ...p })), // Deep copy
      result: result
        ? {
            utilization: result.utilization,
            boardCount: result.boards.length,
            cutCount: result.cuts.length,
            pieceCount: result.allPieces.length,
          }
        : undefined,
    }

    // Add to beginning of history
    const newHistory = [entry, ...history].slice(0, MAX_HISTORY_ITEMS)

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
  } catch (error) {
    console.error('Failed to save to history:', error)
  }
}

/**
 * Delete a specific configuration from history
 */
export function deleteFromHistory(id: string): void {
  if (typeof window === 'undefined') return

  try {
    const history = loadHistory()
    const newHistory = history.filter((item) => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
  } catch (error) {
    console.error('Failed to delete from history:', error)
  }
}

/**
 * Clear all history
 */
export function clearHistory(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear history:', error)
  }
}

/**
 * Generate a default name for a configuration
 */
function generateName(pieces: PieceSpec[], result?: OptimizationResult): string {
  const pieceTypes = pieces.filter((p) => p.qty > 0).length
  const totalPieces = pieces.reduce((sum, p) => sum + p.qty, 0)

  if (result) {
    const utilization = Math.round(result.utilization * 100)
    return `${pieceTypes} types, ${totalPieces} pièces (${utilization}%)`
  }

  return `${pieceTypes} types, ${totalPieces} pièces`
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return "À l'instant"
  if (diffMins < 60) return `Il y a ${diffMins} min`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `Il y a ${diffHours}h`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `Il y a ${diffDays}j`

  // Format as date for older items
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Export configuration as JSON
 */
export function exportConfiguration(config: SavedConfiguration): void {
  const dataStr = JSON.stringify(config, null, 2)
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

  const exportName = `gomory_config_${config.name?.replace(/\s+/g, '_') || config.id}.json`

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportName)
  linkElement.click()
}

/**
 * Import configuration from JSON file
 */
export function importConfiguration(file: File): Promise<SavedConfiguration> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const config = JSON.parse(content) as SavedConfiguration

        // Validate structure
        if (!config.config || !config.pieces) {
          throw new Error('Invalid configuration file')
        }

        // Update timestamp and ID for imported config
        config.timestamp = Date.now()
        config.id = `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        config.name = `${config.name || 'Imported'} (importé)`

        resolve(config)
      } catch {
        reject(new Error('Failed to parse configuration file'))
      }
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
