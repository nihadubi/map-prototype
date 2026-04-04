<a id="readme-top"></a>

<div align="center">

# UndrPin

**A premium map-first city discovery prototype for events and underrated places in Baku and Azerbaijan.**

[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)](https://tailwindcss.com/)
[![MapLibre](https://img.shields.io/badge/MapLibre-GL_JS-1F2937?style=for-the-badge&logo=maplibre&logoColor=white)](https://maplibre.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20Postgres%20%7C%20Realtime-111827?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.com/)

[Repository](https://github.com/nihadubi/map-prototype)

</div>

---

## Preview

Replace the image below with your latest product screenshot before publishing the repo.

![UndrPin Preview](images/preview.png)

---

## About

UndrPin is a fullscreen map-first web app for discovering places and events through a dark, premium map experience.

The current prototype is focused on **Azerbaijan**, with **Baku** as the main starting point. Users can browse pins, inspect details directly on the map, and create new pins from an in-map slide-in panel.

---

## Current Features

- Fullscreen MapLibre map experience
- Premium dark glass UI
- Distinct event and place pins
- In-map create-pin flow
- Custom marker system
- Supabase auth and pins backend
- Realtime-ready pin updates
- Azerbaijan-only pin validation

---

## Stack

### Frontend
- React
- Vite
- Tailwind CSS
- MapLibre GL JS

### Backend
- Supabase Auth
- Supabase Postgres
- Supabase Realtime

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- a Supabase project
- a `profiles` table and `pins` table configured in Supabase

### Installation

```bash
git clone https://github.com/nihadubi/map-prototype.git
cd map-prototype
npm install
```

Copy `.env.example` to `.env` and add your Supabase values:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Environment Variables

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## Product Flow

1. Open the main map
2. Browse visible event and place pins
3. Search or filter the current map view
4. Click on the map to choose a location
5. Open the create-pin panel
6. Publish a new place or event pin
7. See the new pin appear on the map

---

## Routes

- `/` main map experience
- `/auth` standalone fullscreen auth route
- `/add-pin` lightweight fallback redirect to the in-map create flow

---

## Deploy Notes

Before deploying:

- set `VITE_SUPABASE_URL`
- set `VITE_SUPABASE_ANON_KEY`
- make sure `profiles` and `pins` tables exist
- make sure Supabase RLS policies are configured for auth, profiles, and pins
- verify signup, login, pin read, and pin creation in a production-like environment

UndrPin is a static frontend app, so any standard Vite-compatible host works well for deployment.

---

## Status

UndrPin is currently in the **prototype / polish** phase.

The architecture is already on:

- Supabase for auth and data
- MapLibre for map rendering
- in-map pin creation instead of route-based creation

Current focus:

- deploy-readiness
- product polish
- tighter data and RLS safety
- public presentation quality

---

## Roadmap

- Saved pins
- Better filtering and discovery
- Image uploads for pins
- Richer profile layer
- More polished onboarding and sharing

---

## Contributing

This is currently a personal prototype, but product feedback, ideas, and suggestions are welcome.

---

## Contact

GitHub: [nihadubi/map-prototype](https://github.com/nihadubi/map-prototype)

---

<p align="right"><a href="#readme-top">Back to top</a></p>
