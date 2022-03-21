import { Component } from 'react'

type ErrorBoundaryState = {
  error: unknown | undefined
}

// eslint-disable-next-line @typescript-eslint/ban-types
class ErrorBoundary extends Component<{}, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: undefined }

  static getDerivedStateFromError(error: unknown) {
    return { error }
  }

  render() {
    const { error } = this.state
    if (error !== undefined) {
      if (error instanceof Error) {
        return (
          <div>
            <div>{error.name}</div>
            <div>{error.message}</div>
            {error.stack && (
              <details>
                <summary>Stack</summary>
                <pre>{error.stack}</pre>
              </details>
            )}
          </div>
        )
      } else if (typeof error === 'string') {
        return (
          <div>
            <div>Error</div>
            <div>{error}</div>
          </div>
        )
      } else {
        return (
          <div>
            <div>Error</div>
            <pre>{JSON.stringify(error, undefined, 2)}</pre>
          </div>
        )
      }
    }

    return this.props.children
  }
}

export default ErrorBoundary
