# UndrPin

<p align="center">
  <strong>Map-first city discovery with a premium dark interface.</strong>
</p>

<p align="center">
  UndrPin helps people discover local events and underrated places, then publish new pins directly on the map with a fast, focused workflow.
</p>

## Overview

UndrPin is a map-native discovery app built around one core idea: the map should be the product, not just a supporting view.

It combines live pin data, map-based creation, responsive overlays, and a polished visual language into a single flow for exploring and publishing city locations.

## Stack

### Backend

![Firebase](https://img.shields.io/badge/FIREBASE-FFCA28?style=for-the-badge&logo=firebase&logoColor=111111)
![Firestore](https://img.shields.io/badge/FIRESTORE-FF8F00?style=for-the-badge&logo=firebase&logoColor=ffffff)
![Auth](https://img.shields.io/badge/AUTH-1F2937?style=for-the-badge&logo=google&logoColor=ffffff)

- Libraries: `firebase`

### Frontend

![React](https://img.shields.io/badge/REACT-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/VITE-6D28D9?style=for-the-badge&logo=vite&logoColor=FDE047)
![JavaScript](https://img.shields.io/badge/JAVASCRIPT-1F2937?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Mapbox](https://img.shields.io/badge/MAPBOX-111827?style=for-the-badge&logo=mapbox&logoColor=ffffff)
![CSS3](https://img.shields.io/badge/CSS3-0F172A?style=for-the-badge&logo=css3&logoColor=38BDF8)
![Glassmorphism](https://img.shields.io/badge/GLASSMORPHISM-0EA5E9?style=for-the-badge&logoColor=ffffff)

- Libraries: `react`, `react-dom`, `react-router-dom`, `mapbox-gl`

## Highlights

- Real-time pins loaded from Firestore
- Event and place publishing flows
- Premium full-screen map UI
- Search, save, filter, and inspect flows on the same screen
- Azerbaijan-only pin placement validation
- Responsive overlays for sidebar, settings, auth, and pin details

## Product Flow

### Discover

Browse the city through a full-screen map experience and inspect places or events without losing spatial context.

### Create

Click directly on the map, preview the selected location, and publish a new pin through a guided map-first flow.

### Explore

Open a pin card, inspect metadata, save it, share it, or use it as your next destination.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

Copy `.env.example` to `.env` and add your Firebase plus Mapbox values.

```env
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run locally

```bash
npm run dev
```

### 4. Production build

```bash
npm run build
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Architecture

- `src/features/auth`: authentication pages, validation, and route protection
- `src/features/map`: map rendering, overlays, config, and pin interaction
- `src/features/pins`: add-pin flow, form logic, validation, and services
- `src/app`: providers and routing
- `src/styles`: global interface styling

## Map Rules

New pins can only be placed inside Azerbaijan. The restriction is checked during map selection and again during form validation before submission.

## Roadmap

- Pin images and richer media
- User identity and profile layers
- Better chunk splitting and performance optimization
- Moderation and discovery improvements

## Status

Active prototype with a premium UI direction and ongoing product refinement.

