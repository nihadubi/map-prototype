# CityLayer

CityLayer is a community-driven city discovery platform that helps people find local events and underrated places on a live map.

![App Screenshot](./screenshot.png)

---

## 🚀 What it does

CityLayer turns the city into a shared, real-time map where users can:

- discover events happening around them  
- find underrated places others recommend  
- add their own pins to share with the community  

Instead of scattered social posts, everything lives in one map.

---

## ✨ Current Features

- Interactive Leaflet map centered on Baku  
- Real-time pins loaded from Firestore  
- Add new pins (events or places)  
- Firebase Authentication (email/password)  
- Filter pins by type (events / places)  
- Pin detail popup with information  
- Responsive layout  
- Environment-based Firebase config  

---

## 🧱 Tech Stack

- React (Vite)
- Firebase (Auth, Firestore)
- Leaflet (React Leaflet)
- React Router
- Tailwind CSS

---

## 🛠️ Setup

1. Install dependencies:
npm install

2. Create environment file:
Copy .env.example to .env and fill Firebase config

3. Run:
npm run dev

---

## 🔥 Firebase Setup

- Create project in Firebase Console  
- Add Web App  
- Copy config to .env  
- Enable Auth (Email/Password)  
- Enable Firestore  

---

## 📁 Project Structure

src/
  app/
  components/
  config/
  features/
    auth/
    map/
    pins/
  pages/

---

## 🧠 Architecture

- Feature-based structure
- Firebase separated from UI
- Map loads first, data loads after
- UI overlays on map

---

## 🗺️ Roadmap

- Map click → auto-fill location  
- Category filters  
- Image upload  
- Profiles  
- Realtime updates  
- Mobile app  

---

## 📌 Status

Actively in development