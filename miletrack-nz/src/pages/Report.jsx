import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { supabase } from '../lib/supabase'
import { generateLogbookPDF } from '../lib/pdf'
import { formatDate, formatCurrency, calculateDeduction, FUEL_TYPE_LABELS } from '../lib/constants'
import { FileText, Download, Lock } from 'lucide-react'

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

  async function handleDownload() {
    if (!isPro) return
    setGenerating(true)
    try {
      const doc = generateLogbookPDF({
        user: profile,
        vehicle: activeVehicle,
        period: selectedPeriod,
        trips: periodTrips,
      })
      doc.save(`MileTrack-NZ-Logbook-${formatDate(selectedPeriod.start_date)}.pdf`)
    } catch (err) {
      alert('Error generating PDF: ' + err.message)
    }
    setGenerating(false)
  }

  // Can also generate for active period (preview)
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
      doc.save(`MileTrack-NZ-Preview-${formatDate(activePeriod.start_date)}.pdf`)
    } catch (err) {
      alert('Error generating PDF: ' + err.message)
    }
    setGenerating(false)
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-navy">IRD Logbook Report</h2>

      {!isPro && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <Lock className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-medium text-amber-800">Pro feature</p>
            <p className="text-xs text-amber-700">
              PDF export is available on the Pro plan ($9/mo) or as a one-time export ($19).
            </p>
          </div>
        </div>
      )}

      {/* Completed periods */}
      {completedPeriods.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-navy mb-3">Completed Periods</h3>
          <div className="space-y-2">
            {completedPeriods.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPeriod(p)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-colors ${
                  selectedPeriod?.id === p.id ? 'border-accent bg-green-50' : 'border-gray-100'
                }`}
              >
                <p className="font-medium text-navy text-sm">
                  {formatDate(p.start_date)} \u2013 {formatDate(p.end_date)}
                </p>
                <p className="text-xs text-gray-500">
                  {p.business_use_percentage}% business use &middot; Valid until {formatDate(p.valid_until)}
                </p>
              </button>
            ))}
          </div>
          {selectedPeriod && (
            <button
              onClick={handleDownload}
              disabled={!isPro || generating}
              className="w-full mt-4 bg-accent hover:bg-accent-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Download size={18} />
              {generating ? 'Generating...' : 'Download PDF Report'}
            </button>
          )}
        </div>
      )}

      {/* Active period preview */}
      {activePeriod && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-navy mb-2">Current Period Preview</h3>
          <p className="text-sm text-gray-500 mb-3">
            Generate a preview report for your active logbook period. This is not the final report.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Business Use</p>
                <p className="font-bold text-navy">{businessPercentage}%</p>
              </div>
              <div>
                <p className="text-gray-500">Total Trips</p>
                <p className="font-bold text-navy">{trips.length}</p>
              </div>
              <div>
                <p className="text-gray-500">Business km</p>
                <p className="font-bold text-navy">{totalBusinessKm.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-gray-500">Total km</p>
                <p className="font-bold text-navy">{totalKm.toFixed(1)}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handlePreviewActive}
            disabled={!isPro || generating}
            className="w-full border border-accent text-accent hover:bg-green-50 font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FileText size={18} />
            {generating ? 'Generating...' : 'Download Preview PDF'}
          </button>
        </div>
      )}

      {completedPeriods.length === 0 && !activePeriod && (
        <div className="text-center py-8">
          <FileText className="mx-auto text-gray-300 mb-3" size={40} />
          <p className="text-gray-500">No logbook periods to report on yet.</p>
        </div>
      )}
    </div>
  )
}
