# Evynture App – Technical Overview

The **Evynture App** is a cross-platform mobile application built to support the premier PEV (Personal Electric Vehicle) racing and lifestyle festival: **Evynture**. The app improves event logistics, enhances attendee engagement, and fosters community interaction throughout the multi-day event.

---

## 🧱 Architecture & Tech Stack

- **Frontend**: React + TypeScript
- **Framework**: [Ionic Framework](https://ionicframework.com/) (with Capacitor for native access)
- **Backend**: [Firebase](https://firebase.google.com/)
  - Firestore (NoSQL database)
  - Firebase Auth (authentication)
  - Firebase Storage (media assets)
  - Firebase Cloud Functions (planned)
- **Mapping**: Leaflet.js + React-Leaflet
- **CI/CD**: GitHub Actions

---

## 🚀 Key Features

### 1. 📅 Dynamic Event Schedule

- Pulled in real-time from Google Calendar

### 2. 🗺️ Interactive Festival Map

- Custom-built with Leaflet.js and React-Leaflet
- Displays Points of Interest (POIs) such as:
  - FloatTrack
  - Vendor Village
  - Food trucks
  - Stages
  - Medical tents
- Dynamic filtering based on user preferences

### 3. 🐿️ Scavenger Hunt Integration

- Supports Oak City’s famous **Squirrel Hunt**
- Shows live locations and clue visibility
- Designed to evolve into UV-based or AR-enhanced experiences

### 4. 🔔 Push Notifications

- Powered by Firebase Messaging and Google Sheets/AppScript
- Can be Used for live updates, race starts, emergencies, and schedule changes
- Users can register for specific topics including, shedule, racing, et. al.

### 5. 🔒 Version Enforcement

- Checks app version against minimum required version from Firestore
- Prompts users to upgrade if they are using outdated versions

### 6. 🧑‍🚀 Authentication (Planned/Partial)

- Firebase Auth integration
- Future support for:
  - Racer check-ins
  - Personalized schedules
  - Volunteer access levels

### 7. 📡 Offline-Ready

- Schedule and map views retain cached data
- Resilient against poor network conditions in rural festival areas

---

## 🔧 DevOps & Deployment

- CI/CD pipeline via **GitHub Actions**
- Semantic versioning (`v1.x.x`)
- Automated version bump PRs for App Store releases
- iOS via TestFlight and App Store Connect
- Android via Google Play Console

---

## 🔐 Permissions & Security

- Location permissions only used for interactive features (e.g. map tracking, squirrel submissions)
- Firestore rules scoped by role:
  - Public (readonly)
  - Volunteer
  - Racer
  - Admin
- No PII stored unless explicitly submitted by the user

---

## 🧭 Planned Features

- Racer profiles and race result displays
- Live leaderboards
- Chat and messaging within the app
- QR code scanning for check-in and contest entries
- Geofenced notifications
- Rider telemetry or race check-ins

---

## 📲 Download

- [Google Play Store](https://play.google.com/store/apps/details?id=com.oakcityshredfest.app)
- [Apple App Store](https://apps.apple.com/us/app/oak-city-shred-fest/id6741046929)

---

For more information about Evynture, visit: [www.oakcityshredfest.com](https://www.oakcityshredfest.com)

---
