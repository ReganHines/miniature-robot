import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { todayStr } from '../lib/constants'
import { Check, ArrowLeft } from 'lucide-react'

export default function LogTrip() {
  const {
    activePeriod, activeVehicle, lastEndOdometer,
    addTrip, recentPurposes,
    totalBusinessKm, totalKm, businessPercentage,
  } = useData()
  const navigate = useNavigate()

  const [date, setDate] = useState(todayStr())
  const [startOdo, setStartOdo] = useState('')
  const [endOdo, setEndOdo] = useState('')
  const [distance, setDistance] = useState('')
  const [destination, setDestination] = useState('')
  const [purpose, setPurpose] = useState('')
  const [tripType, setTripType] = useState('business')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(null)

  useEffect(() => {
    if (lastEndOdometer) {
      setStartOdo(String(lastEndOdometer))
    }
  }, [lastEndOdometer])

  // Auto-calculate distance
  useEffect(() => {
    const s = parseFloat(startOdo)
    const e = parseFloat(endOdo)
    if (s && e && e > s) {
      setDistance((e - s).toFixed(1))
    }
  }, [startOdo, endOdo])

  if (!activePeriod) {
    return (
      <div className="p-4 pt-8 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-navy mb-2">No Active Logbook Period</h2>
          <p className="text-gray-600 text-sm mb-4">Start a 90-day logbook period before logging trips.</p>
          <Link to="/dashboard" className="text-accent font-medium">Go to Dashboard</Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const trip = await addTrip({
        date,
        start_odometer: parseFloat(startOdo),
        end_odometer: parseFloat(endOdo),
        distance_km: parseFloat(distance),
        destination: tripType === 'business' ? destination : null,
        purpose: tripType === 'business' ? purpose : null,
        trip_type: tripType,
        notes: notes || null,
      })
      setSaved(trip)
    } catch (err) {
      alert('Error saving trip: ' + err.message)
    }
    setSaving(false)
  }

  function handleReset() {
    setSaved(null)
    setStartOdo(String(parseFloat(endOdo) || lastEndOdometer))
    setEndOdo('')
    setDistance('')
    setDestination('')
    setPurpose('')
    setNotes('')
    setTripType('business')
    setDate(todayStr())
  }

  if (saved) {
    const newBusinessKm = totalBusinessKm + (saved.trip_type === 'business' ? saved.distance_km : 0)
    const newTotalKm = totalKm + saved.distance_km
    const newPct = newTotalKm > 0 ? (newBusinessKm / newTotalKm * 100).toFixed(1) : '0.0'

    return (
      <div className="p-4 pt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-accent" size={32} />
          </div>
          <h2 className="text-lg font-bold text-navy mb-2">Trip Logged</h2>
          <p className="text-gray-600 mb-4">
            {saved.distance_km.toFixed(1)} km {saved.trip_type}
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Running Total</p>
            <p className="text-2xl font-bold text-navy">{newPct}% business</p>
            <p className="text-sm text-gray-500">
              {newBusinessKm.toFixed(1)} km business / {newTotalKm.toFixed(1)} km total
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 bg-accent hover:bg-accent-dark text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Log Another
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 border border-gray-300 text-navy font-semibold py-3 rounded-lg transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-400">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-navy">Log a Trip</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Trip type toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setTripType('business')}
            className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-colors ${
              tripType === 'business' ? 'bg-accent text-white' : 'text-gray-500'
            }`}
          >
            Business
          </button>
          <button
            type="button"
            onClick={() => setTripType('private')}
            className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-colors ${
              tripType === 'private' ? 'bg-navy text-white' : 'text-gray-500'
            }`}
          >
            Private
          </button>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
          />
        </div>

        {/* Odometer fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Odometer</label>
            <input
              type="number"
              step="0.1"
              value={startOdo}
              onChange={e => setStartOdo(e.target.value)}
              required
              placeholder="km"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Odometer</label>
            <input
              type="number"
              step="0.1"
              value={endOdo}
              onChange={e => setEndOdo(e.target.value)}
              required
              placeholder="km"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Distance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
          <input
            type="number"
            step="0.1"
            value={distance}
            onChange={e => setDistance(e.target.value)}
            required
            placeholder="Auto-calculated from odometer"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-gray-50 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
          />
        </div>

        {/* Business-only fields */}
        {tripType === 'business' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                required
                placeholder="e.g. Client office, Wellington CBD"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
              <input
                type="text"
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                required
                placeholder="e.g. Client meeting, Site visit"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              />
              {/* Recent purposes */}
              {recentPurposes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {recentPurposes.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPurpose(p)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Notes (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any additional notes"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-4 rounded-lg text-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Trip'}
        </button>
      </form>
    </div>
  )
}
