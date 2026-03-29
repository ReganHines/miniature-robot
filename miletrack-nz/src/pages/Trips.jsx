import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { formatDate } from '../lib/constants'

export default function Trips() {
  const { trips, deleteTrip, activeVehicle, getAllTripsForVehicle } = useData()
  const [allTrips, setAllTrips] = useState([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    if (activeVehicle) {
      getAllTripsForVehicle(activeVehicle.id).then(setAllTrips)
    }
  }, [activeVehicle, trips, getAllTripsForVehicle])

  const filtered = allTrips.filter(t => {
    if (filterType !== 'all' && t.trip_type !== filterType) return false
    if (search) {
      const s = search.toLowerCase()
      return (
        (t.destination || '').toLowerCase().includes(s) ||
        (t.purpose || '').toLowerCase().includes(s) ||
        (t.notes || '').toLowerCase().includes(s)
      )
    }
    return true
  })

  const totalKm = filtered.reduce((s, t) => s + t.distance_km, 0)
  const businessKm = filtered.filter(t => t.trip_type === 'business').reduce((s, t) => s + t.distance_km, 0)

  async function handleDelete(id) {
    if (confirm('Delete this trip?')) {
      await deleteTrip(id)
    }
  }

  return (
    <div className="px-4 pb-8 max-w-md mx-auto">
      {/* Filter Toggle */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex p-1 bg-surface-container-high rounded-full w-full">
          {['all', 'business', 'private'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 py-2 px-4 rounded-full font-semibold text-sm transition-all ${
                filterType === type
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sticky Totals Header */}
      <div className="sticky top-16 z-40 -mx-4 px-4 py-4 mb-6 bg-surface/95 backdrop-blur-md">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary-container p-5 rounded-xl shadow-sm border border-white/5">
            <p className="font-label text-[10px] font-bold uppercase tracking-widest text-on-primary-container mb-1">Total KM</p>
            <div className="flex items-baseline gap-1">
              <span className="font-headline text-2xl font-bold text-white">
                {totalKm.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </span>
              <span className="text-on-primary-container text-xs font-medium">km</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/10">
            <p className="font-label text-[10px] font-bold uppercase tracking-widest text-on-secondary-container mb-1">Business KM</p>
            <div className="flex items-baseline gap-1">
              <span className="font-headline text-2xl font-bold text-on-surface">
                {businessKm.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </span>
              <span className="text-on-secondary-container text-xs font-medium">km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trip List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-center text-on-surface-variant py-12">No trips found</p>
        )}
        {filtered.map(trip => (
          <div
            key={trip.id}
            className="bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:scale-[0.98] active:scale-[0.95] transition-transform duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="min-w-0 flex-1">
                <span className="font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                  {formatDate(trip.date)}
                </span>
                <h3 className="font-headline font-bold text-on-surface text-lg truncate">
                  {trip.trip_type === 'business'
                    ? (trip.destination || 'Business trip')
                    : 'Private trip'}
                </h3>
                {trip.purpose && (
                  <p className="text-xs text-on-surface-variant truncate mt-0.5">{trip.purpose}</p>
                )}
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                trip.trip_type === 'business'
                  ? 'bg-tertiary-fixed text-on-tertiary-fixed shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                {trip.trip_type === 'business' ? 'B' : 'P'}
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-secondary-container text-lg">route</span>
                <span className="font-body text-sm font-semibold text-on-surface">{trip.distance_km.toFixed(1)} km</span>
              </div>
              <button
                onClick={() => handleDelete(trip.id)}
                className="text-outline-variant hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
