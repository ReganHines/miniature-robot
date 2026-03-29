import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Check, ArrowLeft } from 'lucide-react'

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

  function handleSelect(planId) {
    if (!user) {
      navigate('/')
      return
    }
    if (planId === 'free') {
      navigate('/dashboard')
      return
    }
    // Stripe checkout would go here
    alert('Stripe checkout coming soon! For now, all features are available.')
    navigate('/dashboard')
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-navy text-white px-4 py-12 text-center">
        <Link to="/" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="text-3xl font-bold mb-2">Simple, fair pricing</h1>
        <p className="text-gray-400">Start free. Upgrade when you need PDF exports and tax calculations.</p>
        <p className="text-gray-500 text-xs mt-2">All prices in NZD. GST inclusive.</p>
      </div>

      {/* Plans */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 ${
                plan.popular
                  ? 'border-2 border-accent shadow-lg relative'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-bold text-navy">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-navy">{plan.price}</span>
                {plan.period && <span className="text-sm text-gray-500 ml-1">{plan.period}</span>}
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex gap-2 text-sm text-gray-600">
                    <Check size={16} className="text-accent flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelect(plan.id)}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-accent hover:bg-accent-dark text-white'
                    : 'border border-gray-300 text-navy hover:bg-gray-50'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-navy mb-4">Questions?</h2>
          <p className="text-gray-600 text-sm">
            The free plan gives you everything you need to start your 90-day logbook.
            Upgrade to Pro when you're ready to generate your IRD-ready PDF report and use the tax deduction calculator.
            The one-time export is perfect if you just need a single PDF for your accountant.
          </p>
        </div>
      </div>
    </div>
  )
}
