import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { Plus, TrendingUp, Calendar, MapPin, AlertTriangle } from 'lucide-react'
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
      <div className="p-4 pt-8 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-navy mb-2">Welcome to MileTrack NZ</h2>
          <p className="text-gray-600 mb-6">
            Let's get your vehicle logbook set up. It only takes 2 minutes.
          </p>
          <Link
            to="/onboarding"
            className="inline-block bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
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
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <Calendar className="mx-auto text-navy mb-3" size={40} />
          <h2 className="text-xl font-bold text-navy mb-2">Start Your 90-Day Logbook</h2>
          <p className="text-gray-600 text-sm mb-4">
            IRD requires a logbook kept for at least 90 consecutive days to establish your business use percentage.
            Without one, claims are capped at 25%.
          </p>
          <Link
            to="/onboarding/period"
            className="inline-block bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Start 90-Day Period
          </Link>
        </div>
        <CompletedPeriodsBanner />
      </div>
    )
  }

  // Deduction estimate
  const deduction = activeVehicle
    ? calculateDeduction(totalBusinessKm, totalKm, activeVehicle.fuel_type)
    : null

  // Valid until warning
  const validUntilWarning = activePeriod?.valid_until &&
    daysBetween(todayStr(), activePeriod.valid_until) <= 60

  return (
    <div className="p-4 space-y-4">
      {/* Progress bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">90-Day Period Progress</h3>
          <span className="text-sm font-bold text-navy">{daysElapsed} / {LOGBOOK_PERIOD_DAYS} days</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-accent rounded-full h-3 transition-all duration-500"
            style={{ width: `${Math.min(100, (daysElapsed / LOGBOOK_PERIOD_DAYS) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          {periodComplete
            ? 'Period complete! Finalise your logbook below.'
            : `${daysRemaining} days remaining \u2022 Started ${formatDate(activePeriod.start_date)}`
          }
        </p>
      </div>

      {/* Business percentage - hero stat */}
      <div className="bg-navy rounded-2xl p-6 text-center shadow-sm">
        <p className="text-gray-400 text-sm mb-1">Business Use</p>
        <p className="text-5xl font-bold text-white mb-1">{businessPercentage}%</p>
        <p className="text-gray-400 text-sm">
          {totalBusinessKm.toFixed(1)} km business / {totalKm.toFixed(1)} km total
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Business km" value={`${totalBusinessKm.toFixed(1)}`} />
        <StatCard label="Total km" value={`${totalKm.toFixed(1)}`} />
        <StatCard label="Trips logged" value={trips.length} />
        <StatCard
          label="Est. Deduction"
          value={deduction ? formatCurrency(deduction.totalDeduction) : '$0.00'}
        />
      </div>

      {/* Complete period CTA */}
      {periodComplete && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <div className="flex gap-3">
            <TrendingUp className="text-accent flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-navy mb-1">Logbook Period Complete!</h3>
              <p className="text-sm text-gray-600 mb-3">
                Your 90-day period is done. Record your closing odometer to lock in your business use percentage.
              </p>
              <Link
                to="/onboarding/complete"
                className="inline-block bg-accent hover:bg-accent-dark text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Finalise Logbook
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Last trip */}
      {lastTrip && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Last Trip</h3>
          <div className="flex items-start gap-3">
            <MapPin className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p className="font-medium text-navy">
                {lastTrip.trip_type === 'business' ? lastTrip.destination : 'Private trip'}
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(lastTrip.date)} \u2022 {lastTrip.distance_km.toFixed(1)} km \u2022{' '}
                <span className={lastTrip.trip_type === 'business' ? 'text-accent' : 'text-gray-400'}>
                  {lastTrip.trip_type === 'business' ? 'Business' : 'Private'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Log a trip button */}
      <Link
        to="/log"
        className="block bg-accent hover:bg-accent-dark text-white font-semibold py-4 rounded-2xl text-center text-lg transition-colors shadow-lg"
      >
        <Plus className="inline mr-2 -mt-0.5" size={20} />
        Log a Trip
      </Link>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-navy">{value}</p>
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
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-navy mb-3">Previous Periods</h3>
      {periods.map(p => (
        <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
          <div>
            <p className="text-sm font-medium text-navy">
              {formatDate(p.start_date)} \u2013 {formatDate(p.end_date)}
            </p>
            <p className="text-xs text-gray-500">
              {p.business_use_percentage}% business use \u2022 Valid until {formatDate(p.valid_until)}
            </p>
          </div>
          <Link
            to={`/report?period=${p.id}`}
            className="text-accent text-sm font-medium"
          >
            Report
          </Link>
        </div>
      ))}
    </div>
  )
}
