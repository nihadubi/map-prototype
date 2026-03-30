# CityLayer

CityLayer is a community-driven city discovery platform that helps people find local events and underrated places on a live map.

![App Screenshot](./screenshot.png)

---

## What it does

CityLayer turns the city into a shared, real-time map where users can:

- discover events happening around them
- find underrated places others recommend
- add their own pins to share with the community

Instead of scattered social posts, everything lives in one map.

---

## Current Features

- Interactive Mapbox map centered on Baku
- Real-time pins loaded from Firestore
- Add new pins from the map or form flow
- Firebase Authentication (email/password)
- Filter pins by type and category
- Pin detail popup with information
- Responsive overlay layout
- Environment-based Firebase and Mapbox config

---

## Tech Stack

- React (Vite)
- Firebase (Auth, Firestore)
- Mapbox GL JS
- React Router
- Tailwind CSS

---

## Setup

1. Install dependencies:
   `npm install`

2. Create environment file:
   Copy `.env.example` to `.env` and fill Firebase config plus your Mapbox token.

3. Run:
   `npm run dev`

---

## Firebase Setup

- Create project in Firebase Console
- Add Web App
- Copy config to `.env`
- Enable Auth (Email/Password)
- Enable Firestore

---

## Mapbox Setup

Add this to `.env`:

```env
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

---

## Project Structure

```text
src/
  app/
  components/
  config/
  features/
    auth/
    map/
    pins/
  pages/
```

---

## Architecture

- Feature-based structure
- Firebase separated from UI
- Map loads first, data loads after
- UI overlays on map
- Shared reusable Mapbox component for map surfaces

---

## Roadmap

- Image upload
- Profiles
- Realtime updates improvements
- Mobile app

---

## Status

Actively in development
