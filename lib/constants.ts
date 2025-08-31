/**
 * Application-wide constants
 * All magic numbers and configuration values should be defined here
 */

export const VISUALIZATION = {
  BASE_WIDTH: 1100,
  BASE_HEIGHT: 700,
  CUT_RADIUS: 8,
  CUT_FONT_SIZE: 10,
  PIECE_FONT_SIZE: 11,
  MIN_ZOOM: 0.5,
  MAX_ZOOM: 2,
  DEFAULT_ZOOM: 1,
} as const

export const BOARD_DEFAULTS = {
  WIDTH: 2800,
  HEIGHT: 2070,
  KERF: 3,
  MIN_DIMENSION: 1,
  MAX_DIMENSION: 10000,
} as const

export const PIECE_DEFAULTS = {
  WIDTH: 600,
  HEIGHT: 400,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 999,
  MIN_DIMENSION: 1,
  MAX_DIMENSION: 10000,
} as const

export const EXPORT_SIZES = {
  SMALL: { width: 800, height: 600, scale: 1 },
  MEDIUM: { width: 1600, height: 1200, scale: 2 },
  LARGE: { width: 3200, height: 2400, scale: 4 },
  PRINT: { width: 4000, height: 3000, scale: 5 },
} as const

export const ANIMATION = {
  SPRING: {
    GENTLE: { stiffness: 300, damping: 30 },
    SNAPPY: { stiffness: 400, damping: 25 },
    SMOOTH: { stiffness: 200, damping: 20 },
  },
  DURATION: {
    FAST: 0.2,
    NORMAL: 0.3,
    SLOW: 0.6,
  },
  STAGGER: 0.1,
} as const

export const OPTIMIZATION = {
  MAX_ITERATIONS: 100,
  MIN_UTILIZATION_THRESHOLD: 0.5,
  ROTATION_ENABLED_DEFAULT: true,
  TWO_COLUMNS_DEFAULT: false,
} as const

export const STORAGE_KEYS = {
  LANGUAGE: 'language',
  BOARD_CONFIG: 'board_config',
  LAST_PIECES: 'last_pieces',
} as const