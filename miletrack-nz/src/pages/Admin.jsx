import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Users, Receipt, FileText, Send, Lock } from 'lucide-react'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'miletrack-admin-2024'

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [stats, setStats] = useState(null)
  const [broadcastSubject, setBroadcastSubject] = useState('')
  const [broadcastBody, setBroadcastBody] = useState('')
  const [sending, setSending] = useState(false)

  function handleLogin(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      fetchStats()
    } else {
      alert('Invalid password')
    }
  }

  async function fetchStats() {
    const [users, trips, periods] = await Promise.all([
      supabase.from('users').select('id, subscription_tier', { count: 'exact' }),
      supabase.from('trips').select('id', { count: 'exact' }),
      supabase.from('logbook_periods').select('id, status', { count: 'exact' }),
    ])

    const totalUsers = users.count || 0
    const proUsers = (users.data || []).filter(u => u.subscription_tier === 'pro').length
    const totalTrips = trips.count || 0
    const completedPeriods = (periods.data || []).filter(p => p.status === 'complete').length

    setStats({ totalUsers, proUsers, totalTrips, completedPeriods })
  }

  async function handleBroadcast(e) {
    e.preventDefault()
    if (!confirm('Send email to all users?')) return
    setSending(true)
    // In production, this would call a Supabase Edge Function or Resend API
    alert('Broadcast email queued (implement Resend integration)')
    setSending(false)
    setBroadcastSubject('')
    setBroadcastBody('')
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={20} className="text-navy" />
            <h2 className="text-lg font-bold text-navy">Admin Panel</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none"
            />
            <button
              type="submit"
              className="w-full bg-navy text-white py-2.5 rounded-lg font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl font-bold text-navy">Admin Panel</h2>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={Users} label="Total Users" value={stats.totalUsers} />
            <StatCard icon={Users} label="Pro Subscribers" value={stats.proUsers} />
            <StatCard icon={Receipt} label="Trips Logged" value={stats.totalTrips} />
            <StatCard icon={FileText} label="Completed Periods" value={stats.completedPeriods} />
          </div>
        )}

        {/* Broadcast email */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Send size={18} className="text-navy" />
            <h3 className="font-semibold text-navy">Broadcast Email</h3>
          </div>
          <form onSubmit={handleBroadcast} className="space-y-3">
            <input
              type="text"
              value={broadcastSubject}
              onChange={e => setBroadcastSubject(e.target.value)}
              placeholder="Email subject"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none"
            />
            <textarea
              value={broadcastBody}
              onChange={e => setBroadcastBody(e.target.value)}
              placeholder="Email body"
              required
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none resize-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-navy text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send to All Users'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <Icon size={18} className="text-gray-400 mb-2" />
      <p className="text-2xl font-bold text-navy">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}
