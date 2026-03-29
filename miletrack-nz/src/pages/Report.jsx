import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { supabase } from '../lib/supabase'
import { generateLogbookPDF } from '../lib/pdf'
import { formatDate, formatCurrency, calculateDeduction } from '../lib/constants'

export default function Report() {
  const { profile } = useAuth()
  const { activeVehicle, activePeriod, trips, getCompletedPeriods, totalBusinessKm, totalKm, businessPercentage } = useData()
  const [searchParams] = useSearchParams()
  const [completedPeriods, setCompletedPeriods] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [periodTrips, setPeriodTrips] = useState([])
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (activeVehicle) {
      getCompletedPeriods(activeVehicle.id).then(periods => {
        setCompletedPeriods(periods)
        const paramPeriodId = searchParams.get('period')
        if (paramPeriodId) {
          const found = periods.find(p => p.id === paramPeriodId)
          if (found) setSelectedPeriod(found)
        } else if (periods.length > 0) {
          setSelectedPeriod(periods[0])
        }
      })
    }
  }, [activeVehicle, getCompletedPeriods, searchParams])

  useEffect(() => {
    if (selectedPeriod) {
      supabase
        .from('trips')
        .select('*')
        .eq('logbook_period_id', selectedPeriod.id)
        .order('date', { ascending: true })
        .then(({ data }) => setPeriodTrips(data || []))
    }
  }, [selectedPeriod])

  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'one_time'

  const reportPeriod = selectedPeriod || activePeriod
  const reportBusinessKm = selectedPeriod
    ? periodTrips.filter(t => t.trip_type === 'business').reduce((s, t) => s + t.distance_km, 0)
    : totalBusinessKm
  const reportTotalKm = selectedPeriod
    ? (selectedPeriod.end_odometer - selectedPeriod.start_odometer)
    : totalKm
  const reportPct = selectedPeriod ? selectedPeriod.business_use_percentage : businessPercentage

  const deduction = activeVehicle
    ? calculateDeduction(reportBusinessKm, reportTotalKm, activeVehicle.fuel_type)
    : null

  async function handleDownload() {
    if (!isPro || !selectedPeriod) return
    setGenerating(true)
    try {
      const doc = generateLogbookPDF({
        user: profile,
        vehicle: activeVehicle,
        period: selectedPeriod,
        trips: periodTrips,
      })
      doc.save(`Klicks-Logbook-${formatDate(selectedPeriod.start_date)}.pdf`)
    } catch (err) {
      alert('Error generating PDF: ' + err.message)
    }
    setGenerating(false)
  }

  function handlePreviewActive() {
    if (!activePeriod || !isPro) return
    setGenerating(true)
    try {
      const previewPeriod = {
        ...activePeriod,
        end_date: new Date().toISOString().split('T')[0],
        end_odometer: trips.length > 0 ? trips[0].end_odometer : activePeriod.start_odometer,
      }
      const doc = generateLogbookPDF({
        user: profile,
        vehicle: activeVehicle,
        period: previewPeriod,
        trips: [...trips].reverse(),
      })
      doc.save(`Klicks-Preview-${formatDate(activePeriod.start_date)}.pdf`)
    } catch (err) {
      alert('Error generating PDF: ' + err.message)
    }
    setGenerating(false)
  }

  return (
    <div className="px-6 pb-8 max-w-md mx-auto">
      <section className="space-y-8">
        {/* Summary Dashboard */}
        <div className="bg-surface-container-lowest rounded-xl p-7 shadow-sm shadow-slate-900/5 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-fixed/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-secondary-container block mb-1">
                {selectedPeriod ? `${formatDate(selectedPeriod.start_date)} \u2013 ${formatDate(selectedPeriod.end_date)}` : 'Current Period'}
              </span>
              <h2 className="font-headline text-2xl font-extrabold text-primary tracking-tight">Klicks Report</h2>
            </div>
            <div className="bg-primary-container p-3 rounded-xl rotate-3 shadow-lg shadow-primary-container/20">
              <span className="material-symbols-outlined filled text-tertiary-fixed text-3xl">account_balance_wallet</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between aspect-square">
              <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-secondary-container">Business Use</span>
              <div>
                <span className="font-headline text-3xl font-extrabold text-primary">{reportPct}%</span>
                <p className="text-[11px] text-on-surface-variant font-medium mt-1">Based on {reportTotalKm.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}km</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between aspect-square">
              <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-secondary-container">Valid Until</span>
              <div>
                <span className="font-headline text-xl font-bold text-primary block">
                  {selectedPeriod?.valid_until ? formatDate(selectedPeriod.valid_until) : 'In progress'}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                  <p className="text-[11px] text-on-tertiary-container font-bold uppercase tracking-wide">
                    {selectedPeriod?.status === 'complete' ? 'Compliant' : 'Active'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Estimated Deduction */}
          {deduction && (
            <div className="bg-primary-container p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-primary opacity-90"></div>
              <div className="relative z-10">
                <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-primary-container block mb-2">Estimated Deduction</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline text-4xl font-extrabold text-white tracking-tighter">
                    {formatCurrency(deduction.totalDeduction)}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-white/40 text-[10px] font-medium">
                    calculated at {formatCurrency(deduction.rates.tier1)}/km
                  </span>
                  <span className="material-symbols-outlined text-tertiary-fixed text-lg">info</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Period selector */}
        {completedPeriods.length > 1 && (
          <div className="space-y-3">
            <label className="block font-label text-[11px] font-extrabold uppercase tracking-[0.1em] text-on-secondary-container px-1">
              Select Period
            </label>
            <div className="space-y-2">
              {completedPeriods.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPeriod(p)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                    selectedPeriod?.id === p.id
                      ? 'border-tertiary-fixed bg-surface-container-lowest shadow-sm'
                      : 'border-transparent bg-surface-container-low'
                  }`}
                >
                  <p className="font-headline font-bold text-primary text-sm">
                    {formatDate(p.start_date)} \u2013 {formatDate(p.end_date)}
                  </p>
                  <p className="text-xs text-on-surface-variant">{p.business_use_percentage}% business use</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-6">
          {!isPro && (
            <div className="flex items-center gap-3 p-4 bg-surface-container-high rounded-xl">
              <span className="material-symbols-outlined text-on-secondary-container">lock</span>
              <div className="flex-1">
                <p className="text-[11px] font-bold uppercase tracking-widest text-on-secondary-container">Pro Feature</p>
                <p className="text-sm font-medium text-primary">PDF export requires Pro ($9/mo) or One-Time Export ($19)</p>
              </div>
            </div>
          )}

          {selectedPeriod && (
            <button
              onClick={handleDownload}
              disabled={!isPro || generating}
              className="w-full bg-tertiary-fixed hover:bg-tertiary-fixed-dim text-primary font-headline font-bold py-5 rounded-full shadow-lg shadow-tertiary-fixed/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-40 group"
            >
              <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">picture_as_pdf</span>
              <span className="tracking-tight text-lg">{generating ? 'Generating...' : 'Generate PDF'}</span>
            </button>
          )}

          {activePeriod && !selectedPeriod && (
            <button
              onClick={handlePreviewActive}
              disabled={!isPro || generating}
              className="w-full bg-surface-container-high text-primary font-headline font-bold py-5 rounded-full flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-2xl">preview</span>
              <span className="tracking-tight text-lg">{generating ? 'Generating...' : 'Preview PDF'}</span>
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <footer className="space-y-4">
          <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/15">
            <p className="text-[11px] leading-relaxed text-on-surface-variant font-medium text-center">
              This report has been prepared in accordance with IRD vehicle logbook requirements. Refer to{' '}
              <span className="text-primary font-bold">ird.govt.nz</span> for current rates. Built by Mini Robot.
            </p>
          </div>
          <div className="flex justify-center opacity-20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span className="font-label text-[10px] font-extrabold uppercase tracking-[0.2em]">IRD Compliant 2024</span>
            </div>
          </div>
        </footer>
      </section>
    </div>
  )
}
