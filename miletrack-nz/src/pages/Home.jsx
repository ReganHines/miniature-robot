import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FAQ_ITEMS = [
  {
    q: 'Do I need a vehicle logbook for IRD?',
    a: 'If you use your vehicle for business and want to claim more than 25% of vehicle running costs, yes. IRD requires a logbook kept for at least 90 consecutive days to establish your business use percentage.',
  },
  {
    q: 'How long do I need to keep a logbook in NZ?',
    a: 'You must keep a logbook for a minimum of 90 consecutive days. This logbook period establishes your business use percentage, which is then valid for up to 3 years.',
  },
  {
    q: 'What are the IRD kilometre rates for 2024\u20132025?',
    a: 'Petrol: $1.04/km (Tier 1), $0.35/km (Tier 2). Diesel: $0.81/km, $0.30/km. Petrol Hybrid: $0.93/km, $0.20/km. Electric: $0.91/km, $0.09/km. Tier 1 applies to the first 14,000km of total annual travel.',
  },
  {
    q: 'How do I calculate my business use percentage?',
    a: 'Total business kilometres divided by total kilometres travelled, multiplied by 100. For example, 3,000 business km out of 5,000 total km = 60% business use.',
  },
  {
    q: 'Can I use an app as an IRD vehicle logbook?',
    a: 'Yes! IRD accepts electronic logbooks as long as they record all required information: date, start and end odometer readings, distance, destination, and purpose of each trip.',
  },
  {
    q: 'How long is my logbook percentage valid for?',
    a: 'Your business use percentage is valid for up to 3 years, provided your actual business use doesn\u2019t change by more than 20% from the percentage established in your logbook.',
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left text-on-surface font-body font-medium"
      >
        {q}
        <span className="material-symbols-outlined text-on-surface-variant text-[18px] flex-shrink-0 ml-2">
          {open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
        </span>
      </button>
      {open && <p className="pb-4 text-on-surface-variant font-body text-sm">{a}</p>}
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp, signIn } = useAuth()

  if (user) {
    navigate('/dashboard')
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        await signUp(email, password, name)
      } else {
        await signIn(email, password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="bg-surface-container-lowest font-body">
      {/* Hero */}
      <section className="bg-primary-container text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Klicks
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-body mb-2">
            Your IRD vehicle logbook. Done in seconds.
          </p>
          <p className="text-white/60 font-body mb-8 max-w-xl mx-auto">
            Keep an IRD-compliant vehicle logbook for your business vehicle. Calculate your business use percentage, export a tax-ready PDF report. Built for NZ sole traders.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setShowAuth(true); setIsSignUp(true) }}
              className="bg-tertiary-fixed hover:bg-tertiary-fixed-dim text-on-tertiary-fixed font-body font-semibold px-8 py-3 rounded-full text-lg transition-colors shadow-lg shadow-tertiary-fixed/20"
            >
              Start Free Logbook
            </button>
            <Link
              to="/pricing"
              className="border border-white/30 hover:border-white text-white font-body font-semibold px-8 py-3 rounded-full text-lg transition-colors"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-navy text-center mb-12">
          Everything you need for IRD compliance
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: 'timer', title: 'Log trips in 30 seconds', desc: 'One-thumb, mobile-first trip logging. Auto-fills odometer from your last trip. Tap and go.' },
            { icon: 'directions_car', title: '90-day period tracking', desc: 'Progress bar, countdown, and automatic reminders. Never miss a day of your logbook period.' },
            { icon: 'calculate', title: 'Tax deduction calculator', desc: 'Instantly see your estimated deduction using current IRD kilometre rates for your vehicle type.' },
            { icon: 'description', title: 'IRD-ready PDF export', desc: 'Generate a professional PDF logbook report with cover page, trip log, and summary. Ready for your accountant.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="bg-tertiary-fixed/15 rounded-2xl p-3 h-fit">
                <span className="material-symbols-outlined text-on-tertiary-container text-[24px]">{icon}</span>
              </div>
              <div>
                <h3 className="font-headline font-semibold text-navy mb-1">{title}</h3>
                <p className="text-on-surface-variant font-body text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-navy text-center mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Add your vehicle', desc: 'Enter your vehicle details and current odometer reading. Takes 30 seconds.' },
              { step: '2', title: 'Start your 90-day period', desc: 'IRD requires at least 90 consecutive days. We track your progress automatically.' },
              { step: '3', title: 'Log trips daily', desc: 'Quick-log each trip with destination and purpose. We calculate your business percentage.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="bg-tertiary-fixed text-on-tertiary-fixed w-10 h-10 rounded-full flex items-center justify-center text-lg font-headline font-bold mx-auto mb-4 shadow-lg shadow-tertiary-fixed/20">
                  {step}
                </div>
                <h3 className="font-headline font-semibold text-navy mb-2">{title}</h3>
                <p className="text-on-surface-variant font-body text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-navy mb-4">
          Simple, fair pricing
        </h2>
        <p className="text-on-surface-variant font-body mb-8">Start free. Upgrade when you need PDF exports and tax calculations.</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-surface-container-lowest border border-gray-100 rounded-3xl p-6 text-left shadow-sm">
            <h3 className="font-headline font-bold text-navy mb-1">Free</h3>
            <p className="font-headline text-2xl font-bold text-navy mb-4">$0</p>
            <ul className="font-body text-sm text-on-surface-variant space-y-2">
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-on-tertiary-container text-[16px] flex-shrink-0 mt-0.5">check</span>
                Up to 50 trips
              </li>
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-on-tertiary-container text-[16px] flex-shrink-0 mt-0.5">check</span>
                Business percentage tracking
              </li>
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-on-tertiary-container text-[16px] flex-shrink-0 mt-0.5">check</span>
                90-day period management
              </li>
            </ul>
          </div>
          <div className="bg-surface-container-lowest border-2 border-accent rounded-3xl p-6 text-left shadow-lg relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-tertiary-fixed text-on-tertiary-fixed text-xs font-label font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Most Popular
            </span>
            <h3 className="font-headline font-bold text-navy mb-1">Pro</h3>
            <p className="font-headline text-2xl font-bold text-navy mb-4">$9<span className="text-sm font-body font-normal text-on-surface-variant"> NZD/mo</span></p>
            <ul className="font-body text-sm text-on-surface-variant space-y-2">
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-on-tertiary-container text-[16px] flex-shrink-0 mt-0.5">check</span>
                Unlimited trips
              </li>
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-on-tertiary-container text-[16px] flex-shrink-0 mt-0.5">check</span>
                PDF export
              </li>
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-on-tertiary-container text-[16px] flex-shrink-0 mt-0.5">check</span>
                Tax deduction calculator
              </li>
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-on-tertiary-container text-[16px] flex-shrink-0 mt-0.5">check</span>
                Multiple vehicles
              </li>
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-on-tertiary-container text-[16px] flex-shrink-0 mt-0.5">check</span>
                Email reminders
              </li>
            </ul>
          </div>
          <div className="bg-surface-container-lowest border border-gray-100 rounded-3xl p-6 text-left shadow-sm">
            <h3 className="font-headline font-bold text-navy mb-1">One-Time Export</h3>
            <p className="font-headline text-2xl font-bold text-navy mb-4">$19<span className="text-sm font-body font-normal text-on-surface-variant"> NZD</span></p>
            <ul className="font-body text-sm text-on-surface-variant space-y-2">
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-on-tertiary-container text-[16px] flex-shrink-0 mt-0.5">check</span>
                Unlimited trips
              </li>
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-on-tertiary-container text-[16px] flex-shrink-0 mt-0.5">check</span>
                One PDF export
              </li>
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-on-tertiary-container text-[16px] flex-shrink-0 mt-0.5">check</span>
                Tax deduction calculator
              </li>
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-on-tertiary-container text-[16px] flex-shrink-0 mt-0.5">check</span>
                No subscription
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-navy text-center mb-8">
            Frequently Asked Questions
          </h2>
          {FAQ_ITEMS.map(item => (
            <FAQItem key={item.q} {...item} />
          ))}
        </div>
      </section>

      {/* Auth modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-md p-6 shadow-xl">
            <h2 className="font-headline text-xl font-bold text-navy mb-4">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 font-body text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                />
              )}
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 font-body text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 font-body text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              />
              {error && <p className="text-red-500 font-body text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-tertiary-fixed hover:bg-tertiary-fixed-dim text-on-tertiary-fixed font-body font-semibold py-3 rounded-full transition-colors disabled:opacity-50 shadow-lg shadow-tertiary-fixed/20"
              >
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>
            <p className="text-center font-body text-sm text-on-surface-variant mt-4">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError('') }}
                className="text-on-tertiary-container font-medium"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
            <button
              onClick={() => setShowAuth(false)}
              className="mt-4 w-full text-on-surface-variant font-body text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
