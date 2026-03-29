import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
            <div className="text-4xl mb-4">&#128679;</div>
            <h1 className="text-xl font-bold text-navy mb-2">Something went wrong</h1>
            <p className="text-gray-600 text-sm mb-4">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <pre className="bg-gray-50 border rounded-lg p-3 text-xs text-red-600 text-left overflow-x-auto mb-4">
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
