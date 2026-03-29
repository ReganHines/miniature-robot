import { useState } from 'react'
import { useData } from '../context/DataContext'
import { FUEL_TYPE_LABELS, FUEL_TYPES } from '../lib/constants'

export default function Vehicles() {
  const { vehicles, activeVehicle, setActiveVehicle, addVehicle, deleteVehicle } = useData()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    make: '', model: '', year: '', fuel_type: 'petrol', registration: '',
  })
  const [saving, setSaving] = useState(false)

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await addVehicle({ ...form, year: parseInt(form.year) })
      setShowAdd(false)
      setForm({ make: '', model: '', year: '', fuel_type: 'petrol', registration: '' })
    } catch (err) {
      alert('Error: ' + err.message)
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (confirm('Delete this vehicle and all its data?')) {
      await deleteVehicle(id)
    }
  }

  return (
    <div className="p-4 space-y-4 font-body">
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-lg font-bold text-navy">Vehicles</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-tertiary-fixed text-on-tertiary-fixed p-2 rounded-full shadow-lg shadow-tertiary-fixed/20"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
      </div>

      {vehicles.length === 0 && !showAdd && (
        <div className="text-center py-8">
          <span className="material-symbols-outlined text-gray-300 text-[40px] block mb-3">directions_car</span>
          <p className="text-on-surface-variant font-body">No vehicles added yet</p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-3 text-on-tertiary-container font-body font-medium"
          >
            Add your first vehicle
          </button>
        </div>
      )}

      {vehicles.map(v => (
        <div
          key={v.id}
          className={`bg-surface-container-lowest rounded-xl p-4 shadow-sm border-2 transition-colors cursor-pointer ${
            activeVehicle?.id === v.id ? 'border-accent' : 'border-transparent'
          }`}
          onClick={() => setActiveVehicle(v)}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-headline font-semibold text-navy">
                {v.year} {v.make} {v.model}
                {activeVehicle?.id === v.id && (
                  <span className="ml-2 font-label text-[10px] font-bold uppercase tracking-widest bg-tertiary-fixed/15 text-on-tertiary-container px-2 py-0.5 rounded-full">Active</span>
                )}
              </p>
              <p className="font-body text-sm text-on-surface-variant mt-1">
                {FUEL_TYPE_LABELS[v.fuel_type]} &middot; {v.registration || 'No rego'}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(v.id) }}
              className="text-gray-300 hover:text-red-500 transition-colors p-1"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </div>
      ))}

      {/* Add vehicle form */}
      {showAdd && (
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <h3 className="font-headline font-semibold text-navy mb-4">Add Vehicle</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text" placeholder="Make" required value={form.make}
                onChange={e => setForm({ ...form, make: e.target.value })}
                className="border border-gray-200 rounded-xl px-3 py-2.5 font-body text-sm focus:ring-2 focus:ring-accent outline-none"
              />
              <input
                type="text" placeholder="Model" required value={form.model}
                onChange={e => setForm({ ...form, model: e.target.value })}
                className="border border-gray-200 rounded-xl px-3 py-2.5 font-body text-sm focus:ring-2 focus:ring-accent outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number" placeholder="Year" required value={form.year}
                onChange={e => setForm({ ...form, year: e.target.value })}
                className="border border-gray-200 rounded-xl px-3 py-2.5 font-body text-sm focus:ring-2 focus:ring-accent outline-none"
              />
              <select
                value={form.fuel_type}
                onChange={e => setForm({ ...form, fuel_type: e.target.value })}
                className="border border-gray-200 rounded-xl px-3 py-2.5 font-body text-sm focus:ring-2 focus:ring-accent outline-none"
              >
                {FUEL_TYPES.map(ft => (
                  <option key={ft} value={ft}>{FUEL_TYPE_LABELS[ft]}</option>
                ))}
              </select>
            </div>
            <input
              type="text" placeholder="Registration plate" value={form.registration}
              onChange={e => setForm({ ...form, registration: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 font-body text-sm focus:ring-2 focus:ring-accent outline-none"
            />
            <div className="flex gap-3">
              <button
                type="submit" disabled={saving}
                className="flex-1 bg-tertiary-fixed text-on-tertiary-fixed font-body font-semibold py-2.5 rounded-full disabled:opacity-50 shadow-lg shadow-tertiary-fixed/20"
              >
                {saving ? 'Adding...' : 'Add Vehicle'}
              </button>
              <button
                type="button" onClick={() => setShowAdd(false)}
                className="flex-1 border border-gray-200 text-on-surface-variant font-body py-2.5 rounded-full"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
