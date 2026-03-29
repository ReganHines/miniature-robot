import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Plus, Car, Receipt, User, FileText, Calculator } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const LEGAL_DISCLAIMER = 'MileTrack NZ is a record-keeping tool designed to help you maintain an IRD-compliant vehicle logbook. It does not constitute tax advice. Kilometre rates and claiming rules may change \u2014 always verify current requirements at ird.govt.nz. Built by Mini Robot (mini-robot.nz).'

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 text-xs transition-colors ${
          isActive ? 'text-accent' : 'text-gray-400'
        }`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
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
        <footer className="bg-navy text-gray-400 text-xs text-center p-4 mt-auto">
          {LEGAL_DISCLAIMER}
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Top bar */}
      <header className="bg-navy text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-lg font-bold tracking-tight">MileTrack NZ</h1>
        <NavLink to="/account" className="text-gray-300 hover:text-white">
          <User size={20} />
        </NavLink>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-lg mx-auto w-full">
        <Outlet />
      </main>

      {/* Footer disclaimer */}
      <div className="text-gray-400 text-[10px] text-center px-4 py-2 max-w-lg mx-auto">
        {LEGAL_DISCLAIMER}
      </div>

      {/* Bottom navigation */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 flex justify-around items-center z-50 safe-area-bottom">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/trips" icon={Receipt} label="Trips" />
          <NavLink
            to="/log"
            className="bg-accent text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg -mt-4"
          >
            <Plus size={24} />
          </NavLink>
          <NavItem to="/vehicles" icon={Car} label="Vehicles" />
          <NavItem to="/report" icon={FileText} label="Report" />
        </nav>
      )}
    </div>
  )
}
