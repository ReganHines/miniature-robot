import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, User, CreditCard, Mail } from 'lucide-react'

export default function Account() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-navy">Account</h2>

      {/* Profile */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-navy text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
            {(profile?.name || user?.email || '?')[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-navy">{profile?.name || 'User'}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard size={18} className="text-gray-400" />
          <h3 className="font-semibold text-navy">Subscription</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-navy capitalize">
              {profile?.subscription_tier || 'Free'} Plan
            </p>
            <p className="text-sm text-gray-500">
              {profile?.subscription_tier === 'pro'
                ? '$9 NZD/month'
                : profile?.subscription_tier === 'one_time'
                ? 'One-time export purchased'
                : 'Free tier'}
            </p>
          </div>
          {profile?.subscription_tier === 'free' && (
            <button
              onClick={() => navigate('/pricing')}
              className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="bg-white rounded-2xl shadow-sm divide-y">
        <button
          onClick={() => navigate('/calculator')}
          className="w-full flex items-center gap-3 p-4 text-left"
        >
          <Mail size={18} className="text-gray-400" />
          <span className="text-sm text-navy">Tax Calculator</span>
        </button>
        <button
          onClick={() => navigate('/pricing')}
          className="w-full flex items-center gap-3 p-4 text-left"
        >
          <CreditCard size={18} className="text-gray-400" />
          <span className="text-sm text-navy">Pricing & Plans</span>
        </button>
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 text-red-500"
      >
        <LogOut size={18} />
        <span className="text-sm font-medium">Sign Out</span>
      </button>

      {/* App info */}
      <div className="text-center text-xs text-gray-400 pt-4">
        <p>MileTrack NZ v1.0.0</p>
        <p>Built by Mini Robot (mini-robot.nz)</p>
      </div>
    </div>
  )
}
