import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LEGAL_DISCLAIMER = 'Klicks is a record-keeping tool designed to help you maintain an IRD-compliant vehicle logbook. It does not constitute tax advice. Kilometre rates and claiming rules may change \u2014 always verify current requirements at ird.govt.nz. Built by Mini Robot (mini-robot.nz).'

function NavItem({ to, icon, label, filled }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center px-5 py-2 transition-all duration-200 ${
          isActive
            ? 'bg-tertiary-fixed-dim text-on-surface rounded-full scale-105 shadow-lg shadow-tertiary-fixed/20'
            : 'text-slate-400 hover:text-tertiary-fixed-dim'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`material-symbols-outlined mb-1 ${isActive ? 'filled' : ''}`}>{icon}</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </>
      )}
    </NavLink>
  )
}

export default function Layout() {
  const { user } = useAuth()
  const location = useLocation()
  const isMarketing = location.pathname === '/' || location.pathname === '/pricing'

  if (isMarketing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Outlet />
        <footer className="bg-primary-container text-on-primary-container text-xs text-center p-4 mt-auto">
          {LEGAL_DISCLAIMER}
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface pb-32">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full flex items-center justify-between px-6 h-16 bg-surface/80 backdrop-blur-xl z-50 shadow-sm shadow-slate-900/5">
        <button className="text-on-surface hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="font-headline font-extrabold text-xl tracking-tight text-on-surface">Klicks NZ</h1>
        <NavLink to="/account" className="text-on-surface hover:opacity-80">
          <span className="material-symbols-outlined">person</span>
        </NavLink>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-20 max-w-md mx-auto w-full">
        <Outlet />
      </main>

      {/* Footer disclaimer */}
      <div className="text-on-surface-variant text-[10px] text-center px-6 py-3 max-w-md mx-auto">
        {LEGAL_DISCLAIMER}
      </div>

      {/* Bottom Navigation */}
      {user && (
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-white/90 backdrop-blur-md rounded-t-3xl shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
          <NavItem to="/dashboard" icon="dashboard" label="Dashboard" />
          <NavItem to="/log" icon="add_road" label="Log Trip" />
          <NavItem to="/trips" icon="history" label="Trips" />
          <NavItem to="/report" icon="assessment" label="Report" />
        </nav>
      )}
    </div>
  )
}
