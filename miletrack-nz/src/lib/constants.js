export const FUEL_TYPES = ['petrol', 'diesel', 'petrol_hybrid', 'electric']

export const FUEL_TYPE_LABELS = {
  petrol: 'Petrol',
  diesel: 'Diesel',
  petrol_hybrid: 'Petrol Hybrid',
  electric: 'Electric',
}

// IRD kilometre rates 2024-2025
export const KM_RATES = {
  petrol: { tier1: 1.04, tier2: 0.35 },
  diesel: { tier1: 0.81, tier2: 0.30 },
  petrol_hybrid: { tier1: 0.93, tier2: 0.20 },
  electric: { tier1: 0.91, tier2: 0.09 },
}

// Tier 1 applies to business portion of first 14,000km total annual travel
export const TIER1_THRESHOLD = 14000

export const LOGBOOK_PERIOD_DAYS = 90
export const LOGBOOK_VALIDITY_YEARS = 3
export const BUSINESS_CHANGE_THRESHOLD = 20 // percent

export const FREE_TRIP_LIMIT = 50

export const SUBSCRIPTION_TIERS = {
  free: { name: 'Free', price: 0, trips: 50, pdf: false, calculator: false },
  pro: { name: 'Pro', price: 9, trips: Infinity, pdf: true, calculator: true },
  one_time: { name: 'One-Time Export', price: 19, trips: Infinity, pdf: true, calculator: true },
}

export function calculateDeduction(businessKm, totalKm, fuelType) {
  const rates = KM_RATES[fuelType] || KM_RATES.petrol
  const businessRatio = totalKm > 0 ? businessKm / totalKm : 0

  // Business km within first 14,000 total km get Tier 1
  const tier1TotalKm = Math.min(totalKm, TIER1_THRESHOLD)
  const tier1BusinessKm = Math.min(businessKm, tier1TotalKm * businessRatio)
  const tier2BusinessKm = Math.max(0, businessKm - tier1BusinessKm)

  const tier1Amount = tier1BusinessKm * rates.tier1
  const tier2Amount = tier2BusinessKm * rates.tier2

  return {
    tier1BusinessKm: Math.round(tier1BusinessKm * 10) / 10,
    tier2BusinessKm: Math.round(tier2BusinessKm * 10) / 10,
    tier1Amount: Math.round(tier1Amount * 100) / 100,
    tier2Amount: Math.round(tier2Amount * 100) / 100,
    totalDeduction: Math.round((tier1Amount + tier2Amount) * 100) / 100,
    businessPercentage: totalKm > 0 ? Math.round((businessKm / totalKm) * 1000) / 10 : 0,
    rates,
  }
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(amount)
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-NZ', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export function daysBetween(date1, date2) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24))
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export function addYears(dateStr, years) {
  const d = new Date(dateStr)
  d.setFullYear(d.getFullYear() + years)
  return d.toISOString().split('T')[0]
}

export function todayStr() {
  return new Date().toISOString().split('T')[0]
}
