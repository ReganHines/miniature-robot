import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import LogTrip from './pages/LogTrip'
import NotFound from './pages/NotFound'

// Lazy-load less-frequently used pages
const Trips = lazy(() => import('./pages/Trips'))
const Vehicles = lazy(() => import('./pages/Vehicles'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Report = lazy(() => import('./pages/Report'))
const CalculatorPage = lazy(() => import('./pages/Calculator'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Account = lazy(() => import('./pages/Account'))
const Admin = lazy(() => import('./pages/Admin'))

// Lazy wrappers for named exports
const OnboardingPeriod = lazy(() =>
  import('./pages/Onboarding').then(m => ({ default: m.OnboardingPeriod }))
)
const CompletePeriod = lazy(() =>
  import('./pages/Onboarding').then(m => ({ default: m.CompletePeriod }))
)

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/log" element={
                <ProtectedRoute><LogTrip /></ProtectedRoute>
              } />
              <Route path="/trips" element={
                <ProtectedRoute><Trips /></ProtectedRoute>
              } />
              <Route path="/vehicles" element={
                <ProtectedRoute><Vehicles /></ProtectedRoute>
              } />
              <Route path="/onboarding" element={
                <ProtectedRoute><Onboarding /></ProtectedRoute>
              } />
              <Route path="/onboarding/period" element={
                <ProtectedRoute><OnboardingPeriod /></ProtectedRoute>
              } />
              <Route path="/onboarding/complete" element={
                <ProtectedRoute><CompletePeriod /></ProtectedRoute>
              } />
              <Route path="/report" element={
                <ProtectedRoute><Report /></ProtectedRoute>
              } />
              <Route path="/calculator" element={
                <ProtectedRoute><CalculatorPage /></ProtectedRoute>
              } />
              <Route path="/account" element={
                <ProtectedRoute><Account /></ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </DataProvider>
    </AuthProvider>
  )
}
