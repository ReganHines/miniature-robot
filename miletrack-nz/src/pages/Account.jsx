import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Account() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="p-4 space-y-4 font-body">
      <h2 className="font-headline text-lg font-bold text-navy">Account</h2>

      {/* Profile */}
      <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary-container text-white w-12 h-12 rounded-full flex items-center justify-center font-headline font-bold text-lg flex-shrink-0">
            {(profile?.name || user?.email || '?')[0].toUpperCase()}
          </div>
          <div>
            <p className="font-headline font-semibold text-navy">{profile?.name || 'User'}</p>
            <p className="font-body text-sm text-on-surface-variant">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">credit_card</span>
          <h3 className="font-headline font-semibold text-navy">Subscription</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body font-medium text-navy capitalize">
              {profile?.subscription_tier || 'Free'} Plan
            </p>
            <p className="font-body text-sm text-on-surface-variant">
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
              className="bg-tertiary-fixed hover:bg-tertiary-fixed-dim text-on-tertiary-fixed font-body font-semibold px-4 py-2 rounded-full text-sm shadow-lg shadow-tertiary-fixed/20 transition-colors"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="bg-surface-container-lowest rounded-3xl shadow-sm divide-y divide-gray-100">
        <button
          onClick={() => navigate('/calculator')}
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 rounded-t-3xl transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">calculate</span>
          <span className="font-body text-sm text-navy">Tax Calculator</span>
          <span className="material-symbols-outlined text-on-surface-variant text-[16px] ml-auto">chevron_right</span>
        </button>
        <button
          onClick={() => navigate('/pricing')}
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 rounded-b-3xl transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">sell</span>
          <span className="font-body text-sm text-navy">Pricing & Plans</span>
          <span className="material-symbols-outlined text-on-surface-variant text-[16px] ml-auto">chevron_right</span>
        </button>
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full bg-surface-container-lowest rounded-3xl p-4 shadow-sm flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
        <span className="font-body text-sm font-medium">Sign Out</span>
      </button>

      {/* App info */}
      <div className="text-center font-body text-xs text-on-surface-variant pt-4">
        <p>Klicks v1.0.0</p>
        <p>Built by Mini Robot (mini-robot.nz)</p>
      </div>
    </div>
  )
}
