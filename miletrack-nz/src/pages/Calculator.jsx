import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { calculateDeduction, formatCurrency, FUEL_TYPES, FUEL_TYPE_LABELS, KM_RATES } from '../lib/constants'
import { Calculator as CalcIcon } from 'lucide-react'

export default function CalculatorPage() {
  const { activeVehicle, totalBusinessKm, totalKm } = useData()

  const [fuelType, setFuelType] = useState(activeVehicle?.fuel_type || 'petrol')
  const [businessKm, setBusinessKm] = useState(String(Math.round(totalBusinessKm)))
  const [totalKmInput, setTotalKmInput] = useState(String(Math.round(totalKm)))

  useEffect(() => {
    if (activeVehicle) setFuelType(activeVehicle.fuel_type)
  }, [activeVehicle])

  useEffect(() => {
    setBusinessKm(String(Math.round(totalBusinessKm)))
    setTotalKmInput(String(Math.round(totalKm)))
  }, [totalBusinessKm, totalKm])

  const bkm = parseFloat(businessKm) || 0
  const tkm = parseFloat(totalKmInput) || 0
  const result = calculateDeduction(bkm, tkm, fuelType)

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-navy">Tax Deduction Calculator</h2>

      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Fuel Type</label>
          <select
            value={fuelType}
            onChange={e => setFuelType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none"
          >
            {FUEL_TYPES.map(ft => (
              <option key={ft} value={ft}>{FUEL_TYPE_LABELS[ft]}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business km</label>
            <input
              type="number"
              value={businessKm}
              onChange={e => setBusinessKm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total annual km</label>
            <input
              type="number"
              value={totalKmInput}
              onChange={e => setTotalKmInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="bg-navy rounded-2xl p-6 text-center">
        <p className="text-gray-400 text-sm mb-1">Estimated Vehicle Deduction</p>
        <p className="text-4xl font-bold text-white mb-2">{formatCurrency(result.totalDeduction)}</p>
        <p className="text-gray-400 text-sm">
          Business use: {result.businessPercentage}%
        </p>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-navy mb-3">Calculation Breakdown</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">
              Tier 1: {result.tier1BusinessKm.toLocaleString()} km x {formatCurrency(result.rates.tier1)}/km
            </span>
            <span className="font-medium text-navy">{formatCurrency(result.tier1Amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">
              Tier 2: {result.tier2BusinessKm.toLocaleString()} km x {formatCurrency(result.rates.tier2)}/km
            </span>
            <span className="font-medium text-navy">{formatCurrency(result.tier2Amount)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-semibold">
            <span className="text-navy">Total</span>
            <span className="text-accent">{formatCurrency(result.totalDeduction)}</span>
          </div>
        </div>
      </div>

      {/* Rates table */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-navy mb-3">IRD Kilometre Rates 2024-2025</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Vehicle Type</th>
                <th className="pb-2">Tier 1</th>
                <th className="pb-2">Tier 2</th>
              </tr>
            </thead>
            <tbody>
              {FUEL_TYPES.map(ft => (
                <tr key={ft} className="border-b last:border-0">
                  <td className="py-2 text-navy">{FUEL_TYPE_LABELS[ft]}</td>
                  <td className="py-2">{formatCurrency(KM_RATES[ft].tier1)}/km</td>
                  <td className="py-2">{formatCurrency(KM_RATES[ft].tier2)}/km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Tier 1 applies to the business portion of the first 14,000km of total annual travel (including private).
          Tier 2 applies to business km beyond that threshold.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs text-amber-800">
          IRD kilometre rates for 2024-2025: {FUEL_TYPE_LABELS[fuelType]} {formatCurrency(KM_RATES[fuelType].tier1)}/km (Tier 1), {formatCurrency(KM_RATES[fuelType].tier2)}/km (Tier 2).
          Rates for 2025-2026 will be published by IRD around May 2026.
          This is an estimate only — confirm with your accountant.
        </p>
      </div>
    </div>
  )
}
