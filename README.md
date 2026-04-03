# UndrPin - Map-Based City Discovery

**UndrPin** is a modern, map-first web application for discovering local events and underrated places in Azerbaijan. It combines a polished dark UI, real-time pin data, and a fast create-on-map workflow so users can explore and publish pins without leaving the map experience.

## Key Features

* **Map-First Discovery:**
  * Full-screen interactive map experience centered on Azerbaijan.
  * Search, explore, and inspect pins directly from the map surface.
  * Responsive overlay system for sidebar, settings, and pin details.
* **Smart Pin Creation:**
  * Click anywhere on the map to choose a location.
  * Live coordinate preview before submission.
  * Separate flows for **Places** and **Events**.
* **Azerbaijan-Only Pin Validation:**
  * New pins can only be created inside Azerbaijan.
  * Validation runs both on map selection and during form submission.
  * Mainland and Nakhchivan are supported through polygon-based boundary checks.
* **Modern UI/UX:**
  * Premium dark theme with glassmorphism-inspired overlays.
  * Refined map marker styling with neon-accent visual language.
  * Mobile-aware responsive layout for creation and discovery flows.
* **Realtime Data Layer:**
  * Pins are loaded from Supabase in realtime.
  * Saved pin interactions and filtered views live in one interface.

## Tech Stack

### Backend
![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=ffffff)
![Postgres](https://img.shields.io/badge/Postgres-Realtime-336791?style=for-the-badge&logo=postgresql&logoColor=ffffff)

* **Libraries:** `@supabase/supabase-js`

### Frontend
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-Build-6D28D9?style=for-the-badge&logo=vite&logoColor=FDE047)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111111)
![MapLibre](https://img.shields.io/badge/MapLibre-GL_JS-111827?style=for-the-badge&logo=maplibre&logoColor=ffffff)
![CSS3](https://img.shields.io/badge/CSS3-Glassmorphism-0EA5E9?style=for-the-badge&logo=css3&logoColor=ffffff)

* **Libraries:** `react`, `react-dom`, `react-router-dom`, `maplibre-gl`

## Installation & Setup

### Prerequisites
* Node.js 18+
* A Supabase project
### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/undrpin.git
cd undrpin
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create the Environment File

Copy `.env.example` to `.env` and fill in your values:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

## How It Works

UndrPin is built around a simple but strict product flow:

1. **Discover:** Users browse the city on a full-screen map and filter pins by context.
2. **Select:** Clicking the map opens a location-driven create flow with live coordinate preview.
3. **Validate:** Selected coordinates are checked against Azerbaijan boundaries before submission.
4. **Publish:** Valid pins are stored in Supabase and become available to the interface in realtime.
5. **Explore:** Users can reopen pins, inspect metadata, save them, and continue navigating the map.

## Project Structure

```text
src/
|-- app/
|   |-- providers/
|   `-- router.jsx
|-- components/
|   `-- layout/
|-- features/
|   |-- auth/
|   |-- map/
|   `-- pins/
`-- styles/
    `-- global.css
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Notes

This project currently focuses on Azerbaijan-based city discovery. Pin creation is intentionally restricted to Azerbaijan territory to keep the experience aligned with the product scope.

## Contribution

Pull requests are welcome. For larger product or UI changes, open an issue first so the direction can be discussed before implementation.

---
<p align="right"><i>Developed with ❤️ by nihadubi</i></p>
