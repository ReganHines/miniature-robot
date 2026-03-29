import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { FUEL_TYPES, FUEL_TYPE_LABELS, todayStr } from '../lib/constants'

export default function Onboarding() {
  const navigate = useNavigate()
  const { vehicles, addVehicle, startLogbookPeriod, activeVehicle } = useData()
  const [step, setStep] = useState(vehicles.length > 0 ? 2 : 1)

  const [vehicleForm, setVehicleForm] = useState({
    make: '', model: '', year: '', fuel_type: 'petrol', registration: '', opening_odometer: '',
  })

  const [startDate, setStartDate] = useState(todayStr())
  const [startOdometer, setStartOdometer] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleAddVehicle(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await addVehicle({
        make: vehicleForm.make,
        model: vehicleForm.model,
        year: parseInt(vehicleForm.year),
        fuel_type: vehicleForm.fuel_type,
        registration: vehicleForm.registration,
      })
      setStartOdometer(vehicleForm.opening_odometer)
      setStep(2)
    } catch (err) {
      alert('Error: ' + err.message)
    }
    setSaving(false)
  }

  async function handleStartPeriod(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const vehicle = activeVehicle || vehicles[0]
      await startLogbookPeriod(vehicle.id, startDate, parseFloat(startOdometer))
      setStep(3)
    } catch (err) {
      alert('Error: ' + err.message)
    }
    setSaving(false)
  }

  const steps = [
    { num: 1, label: 'Add Vehicle', icon: 'directions_car' },
    { num: 2, label: 'Start Period', icon: 'calendar_month' },
    { num: 3, label: 'Log First Trip', icon: 'location_on' },
  ]

  return (
    <div className="px-6 pt-6 font-body">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map(({ num, label, icon }, i) => (
          <div key={num} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step > num ? 'bg-tertiary-fixed text-on-tertiary-fixed'
              : step === num ? 'bg-primary-container text-white'
              : 'bg-surface-container-high text-on-surface-variant'
            }`}>
              {step > num ? <span className="material-symbols-outlined text-sm">check</span> : num}
            </div>
            <span className={`text-xs hidden sm:inline font-label ${step >= num ? 'text-primary' : 'text-on-surface-variant'}`}>
              {label}
            </span>
            {i < 2 && <div className="w-8 h-px bg-outline-variant" />}
          </div>
        ))}
      </div>

      {/* Step 1: Add Vehicle */}
      {step === 1 && (
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
          <h2 className="font-headline text-xl font-extrabold text-primary mb-1">Add Your Vehicle</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            IRD requires vehicle details in your logbook. This takes 30 seconds.
          </p>
          <form onSubmit={handleAddVehicle} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Make" value={vehicleForm.make} required
                onChange={v => setVehicleForm({ ...vehicleForm, make: v })} placeholder="e.g. Toyota" />
              <Input label="Model" value={vehicleForm.model} required
                onChange={v => setVehicleForm({ ...vehicleForm, model: v })} placeholder="e.g. Corolla" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Year" type="number" value={vehicleForm.year} required
                onChange={v => setVehicleForm({ ...vehicleForm, year: v })} placeholder="e.g. 2020" />
              <div>
                <label className="block font-label text-[11px] font-extrabold uppercase tracking-[0.1em] text-on-secondary-container mb-1">Fuel Type</label>
                <select
                  value={vehicleForm.fuel_type}
                  onChange={e => setVehicleForm({ ...vehicleForm, fuel_type: e.target.value })}
                  className="w-full border border-outline-variant/30 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-tertiary-fixed outline-none bg-surface-container-low"
                >
                  {FUEL_TYPES.map(ft => (
                    <option key={ft} value={ft}>{FUEL_TYPE_LABELS[ft]}</option>
                  ))}
                </select>
              </div>
            </div>
            <Input label="Registration Plate" value={vehicleForm.registration}
              onChange={v => setVehicleForm({ ...vehicleForm, registration: v })} placeholder="e.g. ABC123" />
            <Input label="Current Odometer Reading (km)" type="number" value={vehicleForm.opening_odometer} required
              onChange={v => setVehicleForm({ ...vehicleForm, opening_odometer: v })} placeholder="e.g. 45000" />
            <button
              type="submit" disabled={saving}
              className="w-full bg-tertiary-fixed text-on-tertiary-fixed font-headline font-bold py-4 rounded-full shadow-lg shadow-tertiary-fixed/20 transition-transform active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Continue'}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Start Period */}
      {step === 2 && (
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
          <h2 className="font-headline text-xl font-extrabold text-primary mb-1">Start Your 90-Day Period</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            IRD requires at least 90 consecutive days of logbook records to establish your business use percentage.
          </p>
          <form onSubmit={handleStartPeriod} className="space-y-4">
            <Input label="Start Date" type="date" value={startDate} onChange={setStartDate} />
            <Input label="Opening Odometer (km)" type="number" value={startOdometer} required
              onChange={setStartOdometer} placeholder="Current odometer reading" />
            <button
              type="submit" disabled={saving}
              className="w-full bg-tertiary-fixed text-on-tertiary-fixed font-headline font-bold py-4 rounded-full shadow-lg shadow-tertiary-fixed/20 transition-transform active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Starting...' : 'Start 90-Day Period'}
            </button>
          </form>
        </div>
      )}

      {/* Step 3: Go log a trip */}
      {step === 3 && (
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm text-center">
          <div className="bg-tertiary-fixed-dim text-on-tertiary-fixed w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined filled text-3xl">check_circle</span>
          </div>
          <h2 className="font-headline text-xl font-extrabold text-primary mb-2">You're All Set!</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            Your 90-day logbook period has started. Log each trip after you drive to build your business use percentage.
          </p>
          <button
            onClick={() => navigate('/log')}
            className="w-full bg-tertiary-fixed text-on-tertiary-fixed font-headline font-bold py-4 rounded-full shadow-lg shadow-tertiary-fixed/20 transition-transform active:scale-95 mb-3"
          >
            Log Your First Trip
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-surface-container-high text-on-surface font-headline font-bold py-4 rounded-full"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  )
}

function OnboardingPeriod() {
  const navigate = useNavigate()
  const { activeVehicle, startLogbookPeriod } = useData()
  const [startDate, setStartDate] = useState(todayStr())
  const [startOdometer, setStartOdometer] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await startLogbookPeriod(activeVehicle.id, startDate, parseFloat(startOdometer))
      navigate('/dashboard')
    } catch (err) {
      alert('Error: ' + err.message)
    }
    setSaving(false)
  }

  return (
    <div className="px-6 pt-6 font-body">
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
        <h2 className="font-headline text-xl font-extrabold text-primary mb-1">Start a New 90-Day Period</h2>
        <p className="text-sm text-on-surface-variant mb-6">Record your starting odometer to begin a new logbook period.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Start Date" type="date" value={startDate} onChange={setStartDate} />
          <Input label="Opening Odometer (km)" type="number" value={startOdometer} required
            onChange={setStartOdometer} placeholder="Current odometer reading" />
          <button type="submit" disabled={saving}
            className="w-full bg-tertiary-fixed text-on-tertiary-fixed font-headline font-bold py-4 rounded-full shadow-lg shadow-tertiary-fixed/20 transition-transform active:scale-95 disabled:opacity-50">
            {saving ? 'Starting...' : 'Start Period'}
          </button>
        </form>
      </div>
    </div>
  )
}

function CompletePeriod() {
  const navigate = useNavigate()
  const { activePeriod, completeLogbookPeriod, totalBusinessKm, totalKm, businessPercentage } = useData()
  const [endOdometer, setEndOdometer] = useState('')
  const [saving, setSaving] = useState(false)

  if (!activePeriod) {
    navigate('/dashboard')
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await completeLogbookPeriod(activePeriod.id, parseFloat(endOdometer))
      navigate('/dashboard')
    } catch (err) {
      alert('Error: ' + err.message)
    }
    setSaving(false)
  }

  return (
    <div className="px-6 pt-6 font-body">
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
        <h2 className="font-headline text-xl font-extrabold text-primary mb-1">Finalise Your Logbook</h2>
        <p className="text-sm text-on-surface-variant mb-6">Record your closing odometer to lock in your business use percentage.</p>
        <div className="bg-surface-container-low rounded-xl p-5 mb-6">
          <p className="font-label text-[10px] font-bold uppercase tracking-widest text-on-secondary-container mb-2">Current Business Use</p>
          <p className="font-headline text-4xl font-extrabold text-primary-container">{businessPercentage}%</p>
          <p className="text-sm text-on-surface-variant">{totalBusinessKm.toFixed(1)} km business / {totalKm.toFixed(1)} km total</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Closing Odometer (km)" type="number" value={endOdometer} required
            onChange={setEndOdometer} placeholder="Current odometer reading" />
          <button type="submit" disabled={saving}
            className="w-full bg-tertiary-fixed text-on-tertiary-fixed font-headline font-bold py-4 rounded-full shadow-lg shadow-tertiary-fixed/20 transition-transform active:scale-95 disabled:opacity-50">
            {saving ? 'Completing...' : 'Complete Logbook Period'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Input({ label, value, onChange, ...props }) {
  return (
    <div>
      {label && <label className="block font-label text-[11px] font-extrabold uppercase tracking-[0.1em] text-on-secondary-container mb-1">{label}</label>}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-tertiary-fixed outline-none bg-surface-container-low"
        {...props}
      />
    </div>
  )
}

export { OnboardingPeriod, CompletePeriod }
