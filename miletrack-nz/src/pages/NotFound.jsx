import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 font-body">
      <div className="text-center">
        <p className="font-headline text-6xl font-extrabold text-surface-container-high mb-4">404</p>
        <h1 className="font-headline text-xl font-bold text-primary mb-2">Page not found</h1>
        <p className="text-on-surface-variant text-sm mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed font-headline font-bold px-6 py-3 rounded-full shadow-lg shadow-tertiary-fixed/20 transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
