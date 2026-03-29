import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { formatDate } from '../lib/constants'
import { Search, Filter, MapPin, Trash2, Edit3 } from 'lucide-react'

export default function Trips() {
  const { trips, deleteTrip, activeVehicle, getAllTripsForVehicle } = useData()
  const [allTrips, setAllTrips] = useState([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [editingTrip, setEditingTrip] = useState(null)

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

  const totalBusiness = filtered.filter(t => t.trip_type === 'business').reduce((s, t) => s + t.distance_km, 0)
  const totalPrivate = filtered.filter(t => t.trip_type === 'private').reduce((s, t) => s + t.distance_km, 0)

  async function handleDelete(id) {
    if (confirm('Delete this trip?')) {
      await deleteTrip(id)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-navy">Trip History</h2>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search destination, purpose..."
          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
        />
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'business', 'private'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterType === type
                ? 'bg-navy text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="flex gap-3 text-sm">
        <span className="text-gray-500">{filtered.length} trips</span>
        <span className="text-accent">{totalBusiness.toFixed(1)} km business</span>
        <span className="text-gray-400">{totalPrivate.toFixed(1)} km private</span>
      </div>

      {/* Trip list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-8">No trips found</p>
        )}
        {filtered.map(trip => (
          <div key={trip.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  trip.trip_type === 'business' ? 'bg-accent' : 'bg-gray-300'
                }`} />
                <div className="min-w-0">
                  <p className="font-medium text-navy truncate">
                    {trip.trip_type === 'business' ? trip.destination : 'Private trip'}
                  </p>
                  {trip.purpose && (
                    <p className="text-sm text-gray-500 truncate">{trip.purpose}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(trip.date)} &middot; {trip.distance_km.toFixed(1)} km &middot;{' '}
                    {trip.start_odometer.toLocaleString()} &rarr; {trip.end_odometer.toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(trip.id)}
                className="text-gray-300 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
