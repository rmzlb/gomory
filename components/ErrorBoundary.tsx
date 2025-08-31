import { motion } from 'motion/react'
import React, { Component } from 'react'

import type { ErrorInfo, ReactNode } from 'react'

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
      className="flex min-h-screen items-center justify-center p-4"
    >
      <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <span className="text-lg text-red-600">⚠</span>
          </div>
          <h2 className="text-lg font-medium text-neutral-900">Something went wrong</h2>
        </div>

        <p className="mb-4 text-sm text-neutral-600">
          An unexpected error occurred. The error has been logged and we'll look into it.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-4">
            <summary className="cursor-pointer text-xs text-neutral-500 hover:text-neutral-700">
              Error details (development only)
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-neutral-50 p-3 text-xs">
              {error.stack || error.message}
            </pre>
          </details>
        )}

        <div className="flex gap-3">
          <button
            onClick={resetError}
            className="flex-1 rounded bg-neutral-900 px-4 py-2 font-mono text-sm text-white transition-colors hover:bg-neutral-800"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="flex-1 rounded border border-neutral-300 px-4 py-2 font-mono text-sm text-neutral-700 transition-colors hover:border-neutral-400"
          >
            Go home
          </button>
        </div>
      </div>
    </motion.div>
  )
}
