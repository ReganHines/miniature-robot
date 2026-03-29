import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getStripe } from '../lib/stripe'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '',
    features: [
      'Up to 50 trips',
      'Business percentage tracking',
      '90-day period management',
      'Dashboard and stats',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9',
    period: 'NZD/month',
    stripePriceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
    features: [
      'Unlimited trips',
      'PDF export \u2014 IRD-ready report',
      'Tax deduction calculator',
      'Multiple vehicles',
      'Email reminders',
      'Valid-until alerts',
    ],
    cta: 'Start Pro Plan',
    popular: true,
  },
  {
    id: 'one_time',
    name: 'One-Time Export',
    price: '$19',
    period: 'NZD one-time',
    stripePriceId: import.meta.env.VITE_STRIPE_ONETIME_PRICE_ID,
    features: [
      'Unlimited trips',
      'One PDF export',
      'Tax deduction calculator',
      'No subscription required',
    ],
    cta: 'Buy One-Time Export',
    popular: false,
  },
]

export default function Pricing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)

  async function handleSelect(plan) {
    if (!user) {
      navigate('/')
      return
    }
    if (plan.id === 'free') {
      navigate('/dashboard')
      return
    }

    if (!plan.stripePriceId) {
      alert('Payment is being set up. Please try again shortly.')
      return
    }

    setLoading(plan.id)
    try {
      const stripe = await getStripe()
      if (!stripe) {
        alert('Payment system is not configured yet.')
        return
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: plan.stripePriceId, quantity: 1 }],
        mode: plan.id === 'pro' ? 'subscription' : 'payment',
        successUrl: `${window.location.origin}/dashboard?payment=success`,
        cancelUrl: `${window.location.origin}/pricing?payment=cancelled`,
        clientReferenceId: user.id,
        customerEmail: user.email,
      })

      if (error) {
        console.error('Stripe error:', error)
        alert(error.message)
      }
    } catch (err) {
      console.error('Payment error:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-surface-container-lowest font-body">
      {/* Header */}
      <div className="bg-primary-container text-white px-4 py-12 text-center">
        <Link to="/" className="inline-flex items-center gap-1 text-white/60 hover:text-white font-body text-sm mb-4">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back
        </Link>
        <h1 className="font-headline text-3xl font-bold mb-2 text-white">Simple, fair pricing</h1>
        <p className="text-white/70 font-body">Start free. Upgrade when you need PDF exports and tax calculations.</p>
        <p className="text-white/40 font-label text-[10px] font-bold uppercase tracking-widest mt-2">All prices in NZD. GST inclusive.</p>
      </div>

      {/* Plans */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`bg-surface-container-lowest rounded-3xl p-6 ${
                plan.popular
                  ? 'border-2 border-accent shadow-lg relative'
                  : 'border border-gray-100 shadow-sm'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-tertiary-fixed text-on-tertiary-fixed font-label text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </span>
              )}
              <h3 className="font-headline text-lg font-bold text-navy">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="font-headline text-3xl font-bold text-navy">{plan.price}</span>
                {plan.period && <span className="font-body text-sm text-on-surface-variant ml-1">{plan.period}</span>}
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex gap-2 items-start font-body text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-on-tertiary-container text-[16px] flex-shrink-0 mt-0.5">check</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelect(plan)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-full font-body font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-tertiary-fixed hover:bg-tertiary-fixed-dim text-on-tertiary-fixed shadow-lg shadow-tertiary-fixed/20'
                    : 'border border-gray-200 text-navy hover:bg-gray-50'
                } ${loading === plan.id ? 'opacity-50 cursor-wait' : ''}`}
              >
                {loading === plan.id ? 'Redirecting...' : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-headline text-xl font-bold text-navy mb-4">Questions?</h2>
          <p className="text-on-surface-variant font-body text-sm">
            The free plan gives you everything you need to start your 90-day logbook.
            Upgrade to Pro when you're ready to generate your IRD-ready PDF report and use the tax deduction calculator.
            The one-time export is perfect if you just need a single PDF for your accountant.
          </p>
        </div>
      </div>
    </div>
  )
}
