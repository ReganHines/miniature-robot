import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
        <h1 className="text-xl font-bold text-navy mb-2">Page not found</h1>
        <p className="text-gray-500 text-sm mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
