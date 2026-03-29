import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { todayStr } from '../lib/constants'

export default function LogTrip() {
  const {
    activePeriod, activeVehicle, lastEndOdometer,
    addTrip, recentPurposes,
    totalBusinessKm, totalKm,
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
    if (lastEndOdometer) setStartOdo(String(lastEndOdometer))
  }, [lastEndOdometer])

  useEffect(() => {
    const s = parseFloat(startOdo)
    const e = parseFloat(endOdo)
    if (s && e && e > s) setDistance((e - s).toFixed(1))
  }, [startOdo, endOdo])

  if (!activePeriod) {
    return (
      <div className="px-6 pt-8 text-center">
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3 block">event_busy</span>
          <h2 className="font-headline font-bold text-primary mb-2">No Active Logbook Period</h2>
          <p className="text-on-surface-variant text-sm mb-4">Start a 90-day logbook period before logging trips.</p>
          <Link to="/dashboard" className="text-on-tertiary-container font-bold">Go to Dashboard</Link>
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

  // Success state
  if (saved) {
    const newBusinessKm = totalBusinessKm + (saved.trip_type === 'business' ? saved.distance_km : 0)
    const newTotalKm = totalKm + saved.distance_km
    const newPct = newTotalKm > 0 ? (newBusinessKm / newTotalKm * 100).toFixed(1) : '0.0'

    return (
      <div className="px-6 pt-8">
        {/* Toast-style confirmation */}
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm text-center">
          <div className="bg-tertiary-fixed-dim text-on-tertiary-fixed rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined filled text-3xl">check_circle</span>
          </div>
          <h2 className="font-headline text-xl font-bold text-primary mb-2">Trip Saved!</h2>
          <p className="text-on-surface-variant mb-6">
            {saved.distance_km.toFixed(1)} km {saved.trip_type}
          </p>
          <div className="bg-surface-container-low rounded-xl p-5 mb-6">
            <p className="font-label text-[10px] font-bold uppercase tracking-widest text-on-secondary-container mb-2">Running Total</p>
            <p className="font-headline text-3xl font-extrabold text-primary-container">{newPct}%</p>
            <p className="text-sm text-on-surface-variant mt-1">
              {newBusinessKm.toFixed(1)} km business / {newTotalKm.toFixed(1)} km total
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 bg-tertiary-fixed text-on-tertiary-fixed font-headline font-bold py-4 rounded-full shadow-lg shadow-tertiary-fixed/20 transition-transform active:scale-95"
            >
              Log Another
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-surface-container-high text-on-surface font-headline font-bold py-4 rounded-full transition-transform active:scale-95"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 pb-8">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-md mx-auto">
        {/* Date */}
        <section className="space-y-3">
          <label className="block font-label text-[11px] font-extrabold uppercase tracking-[0.1em] text-on-secondary-container px-1">
            Trip Date
          </label>
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
              <span className="material-symbols-outlined">calendar_today</span>
            </div>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="flex-1 bg-transparent border-none p-0 font-headline font-bold text-primary focus:ring-0 outline-none"
            />
          </div>
        </section>

        {/* Odometer Entry */}
        <section className="space-y-3">
          <label className="block font-label text-[11px] font-extrabold uppercase tracking-[0.1em] text-on-secondary-container px-1">
            Distance Details
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-high/50 p-5 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Start Odometer</span>
              <input
                type="number"
                step="0.1"
                value={startOdo}
                onChange={e => setStartOdo(e.target.value)}
                required
                placeholder="00000"
                className="w-full bg-transparent border-none p-0 text-xl font-headline font-extrabold text-primary focus:ring-0 outline-none"
              />
            </div>
            <div className="bg-surface-container-high/50 p-5 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">End Odometer</span>
              <input
                type="number"
                step="0.1"
                value={endOdo}
                onChange={e => setEndOdo(e.target.value)}
                required
                placeholder="-----"
                className="w-full bg-transparent border-none p-0 text-xl font-headline font-extrabold text-primary focus:ring-0 outline-none"
              />
            </div>
          </div>

          {/* Total Distance Display */}
          <div className="bg-primary-container bg-gradient-to-br from-primary-container to-primary p-6 rounded-xl shadow-lg mt-4 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex items-end justify-between">
              <div>
                <p className="text-on-primary-container text-[11px] font-bold uppercase tracking-widest mb-1">Total Distance</p>
                <h2 className="text-4xl font-headline font-extrabold text-white tracking-tighter">
                  {distance || '0.0'} <span className="text-lg font-body font-medium opacity-60">km</span>
                </h2>
              </div>
              <div className="w-12 h-12 bg-tertiary-fixed/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary-fixed text-2xl">route</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trip Context */}
        {tripType === 'business' && (
          <section className="space-y-6">
            <div className="space-y-3">
              <label className="block font-label text-[11px] font-extrabold uppercase tracking-[0.1em] text-on-secondary-container px-1">
                Destination
              </label>
              <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex items-center gap-3">
                <span className="material-symbols-outlined text-outline">location_on</span>
                <input
                  type="text"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  required
                  placeholder="Where did you go?"
                  className="w-full bg-transparent border-none p-0 text-on-surface placeholder:text-outline focus:ring-0 outline-none font-medium"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block font-label text-[11px] font-extrabold uppercase tracking-[0.1em] text-on-secondary-container px-1">
                Purpose & Reason
              </label>
              <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-outline">edit_note</span>
                  <input
                    type="text"
                    value={purpose}
                    onChange={e => setPurpose(e.target.value)}
                    required
                    placeholder="Purpose of trip"
                    className="w-full bg-transparent border-none p-0 text-on-surface placeholder:text-outline focus:ring-0 outline-none font-medium"
                  />
                </div>
                {/* Quick Purpose Chips */}
                {recentPurposes.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {recentPurposes.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPurpose(p)}
                        className="whitespace-nowrap px-4 py-2 rounded-full bg-surface-container text-on-secondary-container text-xs font-bold hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Business/Private Toggle */}
        <section className="bg-surface-container-low p-2 rounded-full flex gap-1 items-center">
          <button
            type="button"
            onClick={() => setTripType('business')}
            className={`flex-1 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
              tripType === 'business'
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-secondary-container hover:bg-surface-container-high'
            }`}
          >
            <span className={`material-symbols-outlined text-lg ${tripType === 'business' ? 'filled' : ''}`}>business_center</span>
            Business
          </button>
          <button
            type="button"
            onClick={() => setTripType('private')}
            className={`flex-1 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
              tripType === 'private'
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-secondary-container hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            Private
          </button>
        </section>

        {/* Save Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-tertiary-fixed text-on-tertiary-fixed font-headline font-extrabold text-lg py-5 rounded-full shadow-xl shadow-tertiary-fixed/20 flex items-center justify-center gap-3 active:scale-[0.97] transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined font-bold">save</span>
            {saving ? 'Saving...' : 'Save Trip'}
          </button>
        </div>
      </form>
    </div>
  )
}
