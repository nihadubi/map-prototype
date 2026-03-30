# CityLayer MVP (Foundation)

CityLayer is a community-driven, map-based discovery app for Baku.

This initial scaffold includes:
- Vite + React setup
- Routing and layout shell
- Map/Auth/Add Pin page shells
- Firebase config module with environment placeholders
- Reusable, feature-oriented folder structure

## 1) Prerequisites

- Node.js 20+ recommended
- npm 10+

## 2) Install

```bash
npm install
npm install react-router-dom firebase leaflet react-leaflet
```

## 3) Environment setup

1. Copy [.env.example](.env.example) to `.env`.
2. Add Firebase project values.

## 4) Run locally

```bash
npm run dev
```

## 5) Current routes

- `/` → Map page shell
- `/auth` → Auth page shell
- `/add-pin` → Add pin page shell

## 6) Next implementation phase

- Firebase Auth wiring
- Leaflet map integration (Baku center)
- Firestore pins read/create
- Basic filtering and pin detail UI

## Project structure

```text
src/
  app/
    providers/
    router.jsx
  components/
    layout/
  config/
    firebase.js
  features/
    auth/
    map/
    pins/
  pages/
  styles/
```
