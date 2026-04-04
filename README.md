<a id="readme-top"></a>

<div align="center">

# UndrPin

**A map-first city discovery app for finding real events and underrated places in Azerbaijan.**

[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)](https://tailwindcss.com/)
[![MapLibre](https://img.shields.io/badge/MapLibre-GL_JS-1F2937?style=for-the-badge&logo=maplibre&logoColor=white)](https://maplibre.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20Postgres%20%7C%20Realtime-111827?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.com/)

[Repository](https://github.com/nihadubi/map-prototype)

</div>

---

## About

UndrPin is a modern, map-first web app built to make city discovery feel more useful, local, and real.

Instead of relying on scattered posts or private recommendations, people can explore a live map, discover events and hidden places, and publish their own finds directly from the map itself.

The current prototype is focused on **Azerbaijan**, with **Baku** as the main starting point.

---

## Why UndrPin?

Great places and events are often hard to find for the wrong reasons:

- you hear about events too late
- the best spots stay hidden unless you know someone
- online discovery feels noisy and repetitive

UndrPin is an attempt to build a cleaner alternative:

- **real places**
- **real events**
- **real community-driven discovery**

---

## Current Features

- Full-screen interactive map experience
- Event and place pins
- Map-first pin creation flow
- Click-on-map coordinate selection
- Premium dark UI with glass-style overlays
- Custom marker system for different pin types
- Authentication with protected actions
- Azerbaijan-only pin validation
- Realtime pin updates through Supabase

---

## Built With

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

## Product Flow

1. Open the map
2. Explore existing event and place pins
3. Click on the map to choose a location
4. Open the create-pin panel
5. Submit a new place or event
6. See the new pin appear on the map

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Supabase project

### Installation

1. Clone the repository

```bash
git clone https://github.com/nihadubi/map-prototype.git
cd map-prototype
```

2. Install dependencies

```bash
npm install
```

3. Create an environment file

Copy `.env.example` to `.env` and fill in your Supabase values.

4. Start the development server

```bash
npm run dev
```

5. Build for production

```bash
npm run build
```

---

## Environment Variables

Example:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
VITE_AUTH_PROVIDER=supabase
VITE_PINS_READ_PROVIDER=supabase
VITE_PINS_WRITE_PROVIDER=supabase
```

---

## Project Structure

```text
src/
  app/
    providers/
    router.jsx
  components/
    layout/
  features/
    auth/
    map/
    pins/
  lib/
    backend/
    map/
    supabase/
  styles/
```

---

## Scope

This prototype is intentionally focused on an Azerbaijan-first discovery experience.

At the moment, pin creation is restricted to Azerbaijan so the product stays aligned with its local-first purpose.

---

## Roadmap

- Saved pins
- Better search and filtering
- Richer pin detail cards
- Profile layer
- Improved onboarding
- More polished discovery flows

---

## Status

UndrPin is currently in the **prototype / polish phase**.

The core system is working. The current focus is on:

- UX refinement
- map interaction polish
- consistency across the product
- making the prototype more shareable and testable

---

## Contributing

This is currently a personal prototype, but feedback, ideas, and product suggestions are always welcome.

---

## Contact

GitHub: [nihadubi/map-prototype](https://github.com/nihadubi/map-prototype)

---

<p align="right"><a href="#readme-top">Back to top</a></p>
