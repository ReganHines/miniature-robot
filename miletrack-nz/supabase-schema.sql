-- MileTrack NZ Database Schema
-- Run this in Supabase SQL Editor to set up your database

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'one_time')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'petrol_hybrid', 'electric')),
  registration TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Logbook periods table
CREATE TABLE IF NOT EXISTS logbook_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  start_odometer NUMERIC NOT NULL,
  end_date DATE,
  end_odometer NUMERIC,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'complete')),
  business_use_percentage NUMERIC,
  valid_until DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logbook_period_id UUID NOT NULL REFERENCES logbook_periods(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_odometer NUMERIC NOT NULL,
  end_odometer NUMERIC NOT NULL,
  distance_km NUMERIC NOT NULL,
  destination TEXT,
  purpose TEXT,
  trip_type TEXT NOT NULL CHECK (trip_type IN ('business', 'private')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_logbook_periods_vehicle_id ON logbook_periods(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_logbook_periods_status ON logbook_periods(status);
CREATE INDEX IF NOT EXISTS idx_trips_logbook_period_id ON trips(logbook_period_id);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_date ON trips(date);
CREATE INDEX IF NOT EXISTS idx_trips_trip_type ON trips(trip_type);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE logbook_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Vehicles: users can only access their own vehicles
CREATE POLICY "Users can manage own vehicles" ON vehicles
  FOR ALL USING (auth.uid() = user_id);

-- Logbook periods: users can access periods for their vehicles
CREATE POLICY "Users can manage own logbook periods" ON logbook_periods
  FOR ALL USING (
    vehicle_id IN (SELECT id FROM vehicles WHERE user_id = auth.uid())
  );

-- Trips: users can access trips for their vehicles
CREATE POLICY "Users can manage own trips" ON trips
  FOR ALL USING (
    vehicle_id IN (SELECT id FROM vehicles WHERE user_id = auth.uid())
  );
