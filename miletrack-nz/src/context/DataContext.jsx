import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { LOGBOOK_PERIOD_DAYS, addDays, addYears, todayStr, daysBetween } from '../lib/constants'

const DataContext = createContext({})

export function DataProvider({ children }) {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [activeVehicle, setActiveVehicle] = useState(null)
  const [activePeriod, setActivePeriod] = useState(null)
  const [trips, setTrips] = useState([])
  const [recentPurposes, setRecentPurposes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchVehicles = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setVehicles(data || [])
    if (data?.length && !activeVehicle) {
      setActiveVehicle(data[0])
    }
  }, [user, activeVehicle])

  const fetchActivePeriod = useCallback(async (vehicleId) => {
    if (!vehicleId) return
    const { data } = await supabase
      .from('logbook_periods')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    setActivePeriod(data)
  }, [])

  const fetchTrips = useCallback(async (periodId) => {
    if (!periodId) { setTrips([]); return }
    const { data } = await supabase
      .from('trips')
      .select('*')
      .eq('logbook_period_id', periodId)
      .order('date', { ascending: false })
    setTrips(data || [])
  }, [])

  const fetchRecentPurposes = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('trips')
      .select('purpose')
      .eq('trip_type', 'business')
      .not('purpose', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) {
      const unique = [...new Set(data.map(t => t.purpose).filter(Boolean))]
      setRecentPurposes(unique.slice(0, 5))
    }
  }, [user])

  useEffect(() => {
    if (user) {
      setLoading(true)
      fetchVehicles().then(() => setLoading(false))
    } else {
      setVehicles([])
      setActiveVehicle(null)
      setActivePeriod(null)
      setTrips([])
      setLoading(false)
    }
  }, [user, fetchVehicles])

  useEffect(() => {
    if (activeVehicle) {
      fetchActivePeriod(activeVehicle.id)
    }
  }, [activeVehicle, fetchActivePeriod])

  useEffect(() => {
    if (activePeriod) {
      fetchTrips(activePeriod.id)
      fetchRecentPurposes()
    }
  }, [activePeriod, fetchTrips, fetchRecentPurposes])

  async function addVehicle(vehicle) {
    const { data, error } = await supabase
      .from('vehicles')
      .insert({ ...vehicle, user_id: user.id })
      .select()
      .single()
    if (error) throw error
    setVehicles(prev => [data, ...prev])
    setActiveVehicle(data)
    return data
  }

  async function updateVehicle(id, updates) {
    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setVehicles(prev => prev.map(v => v.id === id ? data : v))
    if (activeVehicle?.id === id) setActiveVehicle(data)
    return data
  }

  async function deleteVehicle(id) {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)
    if (error) throw error
    setVehicles(prev => prev.filter(v => v.id !== id))
    if (activeVehicle?.id === id) setActiveVehicle(vehicles.find(v => v.id !== id) || null)
  }

  async function startLogbookPeriod(vehicleId, startDate, startOdometer) {
    const { data, error } = await supabase
      .from('logbook_periods')
      .insert({
        vehicle_id: vehicleId,
        start_date: startDate,
        start_odometer: startOdometer,
        status: 'active',
      })
      .select()
      .single()
    if (error) throw error
    setActivePeriod(data)
    return data
  }

  async function completeLogbookPeriod(periodId, endOdometer) {
    const period = activePeriod
    const endDate = todayStr()
    const totalKm = endOdometer - period.start_odometer
    const businessKm = trips
      .filter(t => t.trip_type === 'business')
      .reduce((sum, t) => sum + t.distance_km, 0)
    const businessPct = totalKm > 0 ? Math.round((businessKm / totalKm) * 1000) / 10 : 0
    const validUntil = addYears(endDate, 3)

    const { data, error } = await supabase
      .from('logbook_periods')
      .update({
        end_date: endDate,
        end_odometer: endOdometer,
        status: 'complete',
        business_use_percentage: businessPct,
        valid_until: validUntil,
      })
      .eq('id', periodId)
      .select()
      .single()
    if (error) throw error
    setActivePeriod(null)
    return data
  }

  async function addTrip(trip) {
    const { data, error } = await supabase
      .from('trips')
      .insert({
        ...trip,
        logbook_period_id: activePeriod.id,
        vehicle_id: activeVehicle.id,
      })
      .select()
      .single()
    if (error) throw error
    setTrips(prev => [data, ...prev])
    fetchRecentPurposes()
    return data
  }

  async function updateTrip(id, updates) {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setTrips(prev => prev.map(t => t.id === id ? data : t))
    return data
  }

  async function deleteTrip(id) {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id)
    if (error) throw error
    setTrips(prev => prev.filter(t => t.id !== id))
  }

  async function getAllTripsForVehicle(vehicleId) {
    const { data } = await supabase
      .from('trips')
      .select('*, logbook_periods(*)')
      .eq('vehicle_id', vehicleId)
      .order('date', { ascending: false })
    return data || []
  }

  async function getCompletedPeriods(vehicleId) {
    const { data } = await supabase
      .from('logbook_periods')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .eq('status', 'complete')
      .order('end_date', { ascending: false })
    return data || []
  }

  // Computed values
  const businessTrips = trips.filter(t => t.trip_type === 'business')
  const privateTrips = trips.filter(t => t.trip_type === 'private')
  const totalBusinessKm = businessTrips.reduce((sum, t) => sum + t.distance_km, 0)
  const totalPrivateKm = privateTrips.reduce((sum, t) => sum + t.distance_km, 0)
  const totalKm = totalBusinessKm + totalPrivateKm
  const businessPercentage = totalKm > 0 ? Math.round((totalBusinessKm / totalKm) * 1000) / 10 : 0

  const daysElapsed = activePeriod
    ? Math.min(daysBetween(activePeriod.start_date, todayStr()), LOGBOOK_PERIOD_DAYS)
    : 0
  const daysRemaining = Math.max(0, LOGBOOK_PERIOD_DAYS - daysElapsed)
  const periodComplete = daysElapsed >= LOGBOOK_PERIOD_DAYS

  const lastTrip = trips.length > 0 ? trips[0] : null
  const lastEndOdometer = lastTrip?.end_odometer || activePeriod?.start_odometer || 0

  return (
    <DataContext.Provider value={{
      vehicles, activeVehicle, setActiveVehicle,
      activePeriod, trips, recentPurposes,
      loading,
      addVehicle, updateVehicle, deleteVehicle,
      startLogbookPeriod, completeLogbookPeriod,
      addTrip, updateTrip, deleteTrip,
      getAllTripsForVehicle, getCompletedPeriods,
      fetchVehicles, fetchActivePeriod, fetchTrips,
      businessTrips, privateTrips,
      totalBusinessKm, totalPrivateKm, totalKm,
      businessPercentage,
      daysElapsed, daysRemaining, periodComplete,
      lastTrip, lastEndOdometer,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
