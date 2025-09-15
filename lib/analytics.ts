'use client';

import { track } from '@vercel/analytics';

export type AnalyticsEvent =
  | 'calculator_used'
  | 'results_exported'
  | 'methodology_viewed'
  | 'piece_optimized'
  | 'error_occurred';

interface CalculatorUsedProps {
  stockWidth: number;
  stockHeight: number;
  piecesCount: number;
  method: 'v1' | 'v2' | 'v3';
  utilizationRate?: number;
}

interface ResultsExportedProps {
  format: 'png' | 'pdf';
  utilizationRate: number;
  piecesCount: number;
}

interface PieceOptimizedProps {
  originalUtilization: number;
  optimizedUtilization: number;
  improvement: number;
}

interface ErrorOccurredProps {
  error: string;
  context: string;
}

export const analytics = {
  track: (event: AnalyticsEvent, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      track(event, properties);
    }
  },

  calculatorUsed: (props: CalculatorUsedProps) => {
    analytics.track('calculator_used', {
      stock_width: props.stockWidth,
      stock_height: props.stockHeight,
      pieces_count: props.piecesCount,
      method: props.method,
      utilization_rate: props.utilizationRate?.toFixed(2),
      timestamp: new Date().toISOString(),
    });
  },

  resultsExported: (props: ResultsExportedProps) => {
    analytics.track('results_exported', {
      format: props.format,
      utilization_rate: props.utilizationRate.toFixed(2),
      pieces_count: props.piecesCount,
      timestamp: new Date().toISOString(),
    });
  },

  methodologyViewed: () => {
    analytics.track('methodology_viewed', {
      timestamp: new Date().toISOString(),
    });
  },

  pieceOptimized: (props: PieceOptimizedProps) => {
    analytics.track('piece_optimized', {
      original_utilization: props.originalUtilization.toFixed(2),
      optimized_utilization: props.optimizedUtilization.toFixed(2),
      improvement_percentage: props.improvement.toFixed(2),
      timestamp: new Date().toISOString(),
    });
  },

  errorOccurred: (props: ErrorOccurredProps) => {
    analytics.track('error_occurred', {
      error: props.error,
      context: props.context,
      timestamp: new Date().toISOString(),
    });
  },
};