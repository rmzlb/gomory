import { motion } from 'motion/react'
import React, { Component } from 'react'

import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
    
    // Here you could send error to monitoring service
    // logErrorToService(error, errorInfo)
  }

  private resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError && this.state.error) {
      const { fallback: Fallback } = this.props
      
      if (Fallback) {
        return <Fallback error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-white border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-lg">⚠</span>
          </div>
          <h2 className="text-lg font-medium text-neutral-900">Something went wrong</h2>
        </div>
        
        <p className="text-sm text-neutral-600 mb-4">
          An unexpected error occurred. The error has been logged and we'll look into it.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-4">
            <summary className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-700">
              Error details (development only)
            </summary>
            <pre className="mt-2 text-xs bg-neutral-50 p-3 rounded overflow-auto">
              {error.stack || error.message}
            </pre>
          </details>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={resetError}
            className="flex-1 px-4 py-2 bg-neutral-900 text-white text-sm font-mono rounded
                     hover:bg-neutral-800 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 text-sm font-mono rounded
                     hover:border-neutral-400 transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    </motion.div>
  )
}