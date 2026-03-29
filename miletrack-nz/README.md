# Klicks

**Your IRD vehicle logbook. Done in seconds.**

A mobile-first web app for NZ sole traders, contractors, and small business owners to keep an IRD-compliant vehicle logbook.

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS v4
- Supabase (Auth + PostgreSQL)
- jsPDF (PDF export)
- PWA (installable, works offline)

## Quick Start

### 1. Install dependencies

```bash
cd miletrack-nz
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Authentication > Providers** and ensure **Email** is enabled
4. Copy your project URL and anon key from **Settings > API**

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_PASSWORD=your-admin-password
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deploy to Netlify

1. Connect the repo to Netlify
2. Set **Base directory** to `miletrack-nz`
3. Set **Build command** to `npm run build`
4. Set **Publish directory** to `miletrack-nz/dist`
5. Add environment variables in **Site settings > Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`

The `netlify.toml` and `_redirects` are already configured for SPA routing.

## Features

- 30-second trip logging with auto-fill odometer
- 90-day logbook period tracking
- Business use percentage calculation
- Tax deduction calculator (IRD 2024-2025 km rates)
- IRD-ready PDF export
- Multiple vehicle support
- PWA — installable, works offline
- Admin panel at `/admin`

## Built by

[Mini Robot](https://mini-robot.nz)
