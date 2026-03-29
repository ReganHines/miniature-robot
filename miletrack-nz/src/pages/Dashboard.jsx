import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { LOGBOOK_PERIOD_DAYS, calculateDeduction, formatCurrency, formatDate, daysBetween, todayStr } from '../lib/constants'

export default function Dashboard() {
  const { profile } = useAuth()
  const {
    activeVehicle, activePeriod, vehicles,
    totalBusinessKm, totalKm, businessPercentage,
    daysElapsed, daysRemaining, periodComplete,
    lastTrip, trips,
  } = useData()
  const navigate = useNavigate()

  // No vehicles - go to onboarding
  if (vehicles.length === 0) {
    return (
      <div className="px-6 pt-8 text-center">
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <span className="material-symbols-outlined text-5xl text-primary-container mb-4 block">directions_car</span>
          <h2 className="font-headline text-xl font-extrabold text-primary mb-2">Welcome to Klicks</h2>
          <p className="text-on-surface-variant text-sm mb-6">
            Let's get your vehicle logbook set up. It only takes 2 minutes.
          </p>
          <Link
            to="/onboarding"
            className="inline-block bg-tertiary-fixed text-on-tertiary-fixed font-headline font-bold px-8 py-4 rounded-full shadow-lg shadow-tertiary-fixed/20 transition-transform active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </div>
    )
  }

  // No active period
  if (!activePeriod) {
    return (
      <div className="px-6 space-y-6">
        <div className="bg-surface-container-lowest rounded-3xl p-7 shadow-sm text-center">
          <span className="material-symbols-outlined text-5xl text-primary-container mb-3 block">calendar_month</span>
          <h2 className="font-headline text-xl font-extrabold text-primary mb-2">Start Your 90-Day Logbook</h2>
          <p className="text-on-surface-variant text-sm mb-6">
            IRD requires a logbook kept for at least 90 consecutive days to establish your business use percentage.
            Without one, claims are capped at 25%.
          </p>
          <Link
            to="/onboarding/period"
            className="inline-block bg-tertiary-fixed text-on-tertiary-fixed font-headline font-bold px-8 py-4 rounded-full shadow-lg shadow-tertiary-fixed/20 transition-transform active:scale-95"
          >
            Start 90-Day Period
          </Link>
        </div>
        <CompletedPeriodsBanner />
      </div>
    )
  }

  const deduction = activeVehicle
    ? calculateDeduction(totalBusinessKm, totalKm, activeVehicle.fuel_type)
    : null

  const progressPercent = Math.min(100, (daysElapsed / LOGBOOK_PERIOD_DAYS) * 100)

  return (
    <div className="px-6 space-y-8">
      {/* Kinetic Ring Tracker */}
      <section className="flex flex-col items-center justify-center py-4">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Background Ring */}
          <div className="absolute inset-0 rounded-full border-[12px] border-surface-container-high"></div>
          {/* Progress Ring */}
          <div
            className="absolute inset-0 rounded-full border-[12px] border-transparent kinetic-ring"
            style={{
              '--progress': `${progressPercent}%`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: 0,
            }}
          ></div>
          {/* Inner Content */}
          <div className="text-center z-10">
            <span className="block font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
              Current Period
            </span>
            <div className="font-headline text-5xl font-extrabold text-primary-container leading-none">
              {daysElapsed}<span className="text-2xl text-on-surface-variant">/{LOGBOOK_PERIOD_DAYS}</span>
            </div>
            <span className="block font-body text-sm font-semibold text-on-secondary-container mt-1">
              {periodComplete ? 'Period Complete!' : 'Days Complete'}
            </span>
          </div>
        </div>
      </section>

      {/* Business Use Percentage Card */}
      <section className="bg-surface-container-lowest rounded-3xl p-7 shadow-sm shadow-slate-900/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <span className="material-symbols-outlined filled text-tertiary-fixed-dim opacity-40 text-4xl">trending_up</span>
        </div>
        <h2 className="font-label text-[10px] font-bold uppercase tracking-widest text-on-secondary-container mb-4">Business Use</h2>
        <div className="flex items-baseline gap-2">
          <span className="font-headline text-6xl font-extrabold text-primary-container tracking-tighter">
            {businessPercentage.toFixed(1)}
          </span>
          <span className="font-headline text-2xl font-bold text-primary-container">%</span>
        </div>
        <p className="font-body text-sm text-on-surface-variant mt-2">
          {totalBusinessKm.toFixed(1)} km business / {totalKm.toFixed(1)} km total
        </p>
      </section>

      {/* Kilometre Grid (Bento Style) */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-low rounded-3xl p-6">
          <span className="material-symbols-outlined text-primary mb-3 block">moving</span>
          <span className="block font-label text-[10px] font-bold uppercase tracking-widest text-on-secondary-container mb-1">Business KM</span>
          <span className="block font-headline text-2xl font-bold text-primary">{totalBusinessKm.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
        </div>
        <div className="bg-surface-container-low rounded-3xl p-6">
          <span className="material-symbols-outlined text-primary mb-3 block">speed</span>
          <span className="block font-label text-[10px] font-bold uppercase tracking-widest text-on-secondary-container mb-1">Total KM</span>
          <span className="block font-headline text-2xl font-bold text-primary">{totalKm.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
        </div>
      </section>

      {/* Tax Deduction Card */}
      {deduction && (
        <section className="bg-primary-container rounded-3xl p-7 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-tertiary-fixed to-transparent"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="block font-label text-[10px] font-bold uppercase tracking-widest text-on-primary-container mb-1">Estimated Deduction</span>
                <div className="font-headline text-4xl font-extrabold text-tertiary-fixed tracking-tight">
                  {formatCurrency(deduction.totalDeduction)}
                </div>
              </div>
              <Link to="/calculator">
                <span className="material-symbols-outlined text-on-primary-container">info</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 py-2 px-4 bg-white/5 rounded-full w-fit">
              <span className="material-symbols-outlined filled text-tertiary-fixed text-sm">check_circle</span>
              <span className="text-[11px] font-bold text-on-primary-container uppercase tracking-wider">IRD Rate Compliant</span>
            </div>
          </div>
        </section>
      )}

      {/* Complete period CTA */}
      {periodComplete && (
        <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-tertiary-fixed/20">
          <div className="flex gap-3">
            <span className="material-symbols-outlined filled text-on-tertiary-container text-3xl">task_alt</span>
            <div>
              <h3 className="font-headline font-bold text-primary mb-1">Logbook Period Complete!</h3>
              <p className="text-sm text-on-surface-variant mb-3">
                Record your closing odometer to lock in your business use percentage.
              </p>
              <Link
                to="/onboarding/complete"
                className="inline-block bg-tertiary-fixed text-on-tertiary-fixed font-headline font-bold px-6 py-3 rounded-full text-sm shadow-lg shadow-tertiary-fixed/20 transition-transform active:scale-95"
              >
                Finalise Logbook
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-28 right-6 z-40">
        <Link
          to="/log"
          className="bg-tertiary-fixed text-on-tertiary-fixed px-8 py-4 rounded-full font-headline font-bold text-md shadow-2xl shadow-emerald-500/30 flex items-center gap-3 hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined filled">add_road</span>
          Log a Trip
        </Link>
      </div>

      {/* Spacer for FAB */}
      <div className="h-12"></div>
    </div>
  )
}

function CompletedPeriodsBanner() {
  const { getCompletedPeriods, activeVehicle } = useData()
  const [periods, setPeriods] = useState([])

  useEffect(() => {
    if (activeVehicle) {
      getCompletedPeriods(activeVehicle.id).then(setPeriods)
    }
  }, [activeVehicle, getCompletedPeriods])

  if (periods.length === 0) return null

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
      <h3 className="font-headline font-bold text-primary mb-3">Previous Periods</h3>
      {periods.map(p => (
        <div key={p.id} className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-0">
          <div>
            <p className="text-sm font-semibold text-primary">
              {formatDate(p.start_date)} \u2013 {formatDate(p.end_date)}
            </p>
            <p className="text-xs text-on-surface-variant">
              {p.business_use_percentage}% business use &middot; Valid until {formatDate(p.valid_until)}
            </p>
          </div>
          <Link
            to={`/report?period=${p.id}`}
            className="text-on-tertiary-container text-sm font-bold"
          >
            Report
          </Link>
        </div>
      ))}
    </div>
  )
}
