import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import LogTrip from './pages/LogTrip'
import Trips from './pages/Trips'
import Vehicles from './pages/Vehicles'
import Onboarding, { OnboardingPeriod, CompletePeriod } from './pages/Onboarding'
import Report from './pages/Report'
import CalculatorPage from './pages/Calculator'
import Pricing from './pages/Pricing'
import Account from './pages/Account'
import Admin from './pages/Admin'

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
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
          </Route>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </DataProvider>
    </AuthProvider>
  )
}
