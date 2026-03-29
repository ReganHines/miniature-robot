import { useState } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'klicks-admin-2024'

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
    setStats({
      totalUsers: users.count || 0,
      proUsers: (users.data || []).filter(u => u.subscription_tier === 'pro').length,
      totalTrips: trips.count || 0,
      completedPeriods: (periods.data || []).filter(p => p.status === 'complete').length,
    })
  }

  async function handleBroadcast(e) {
    e.preventDefault()
    if (!confirm('Send email to all users?')) return
    setSending(true)
    alert('Broadcast email queued (implement Resend integration)')
    setSending(false)
    setBroadcastSubject('')
    setBroadcastBody('')
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-surface font-body">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm w-full max-w-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary-container">lock</span>
            <h2 className="font-headline text-lg font-bold text-primary">Admin Panel</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-tertiary-fixed outline-none"
            />
            <button type="submit" className="w-full bg-primary-container text-white py-2.5 rounded-full font-headline font-bold">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface p-4 font-body">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="font-headline text-xl font-bold text-primary">Admin Panel</h2>

        {stats && (
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon="group" label="Total Users" value={stats.totalUsers} />
            <StatCard icon="star" label="Pro Subscribers" value={stats.proUsers} />
            <StatCard icon="receipt_long" label="Trips Logged" value={stats.totalTrips} />
            <StatCard icon="description" label="Completed Periods" value={stats.completedPeriods} />
          </div>
        )}

        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-lg">send</span>
            <h3 className="font-headline font-bold text-primary">Broadcast Email</h3>
          </div>
          <form onSubmit={handleBroadcast} className="space-y-3">
            <input
              type="text"
              value={broadcastSubject}
              onChange={e => setBroadcastSubject(e.target.value)}
              placeholder="Email subject"
              required
              className="w-full border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-tertiary-fixed outline-none"
            />
            <textarea
              value={broadcastBody}
              onChange={e => setBroadcastBody(e.target.value)}
              placeholder="Email body"
              required
              rows={5}
              className="w-full border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-tertiary-fixed outline-none resize-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-primary-container text-white px-6 py-2.5 rounded-full font-headline font-bold disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send to All Users'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
      <span className="material-symbols-outlined text-on-surface-variant text-lg mb-2 block">{icon}</span>
      <p className="font-headline text-2xl font-bold text-primary">{value}</p>
      <p className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{label}</p>
    </div>
  )
}
