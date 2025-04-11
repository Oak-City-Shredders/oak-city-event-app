# 🚀 Oak City Shred Fest App – Deployment Guide

This guide provides instructions for deploying the Oak City Shred Fest app to Web, iOS, and Android platforms. It also includes setup steps for local development and links to CI/CD workflows.

---

## 📦 Platforms

- **iOS** – [App Store](https://apps.apple.com/us/app/oak-city-shred-fest/id6741046929)
- **Android** – [Google Play Store](https://play.google.com/store/apps/details?id=com.oakcityshredfest.app)
- **Web** – [rideoakcity.com](http://rideoakcity.com)
- **Testing Channels**
  - [TestFlight (iOS)](https://testflight.apple.com/join/w26AJ7kP)
  - [Play Store Internal Testing](https://play.google.com/store/apps/details?id=com.oakcityshredfest.app)

---

## 🛠️ Local Development Setup

```bash
git clone https://github.com/Oak-City-Shredders/oak-city-event-app.git
cd oak-city-event-app
npm ci
```

Copy environment variables:

```bash
cp .sample.env .env
```

> Contact David or Jared for access to required secrets.

Start the dev server:

```bash
npm start
```

Or use Ionic:

```bash
ionic serve
```

---

## 📱 Native App Development

### iOS

- Requires macOS + Xcode
- Apple Developer account
- Certificates and provisioning profiles

### Android

- Android Studio or command-line tools
- USB debugging or emulator setup

Sync native platforms:

```bash
npx cap sync
npx cap open ios     # or `android`
```

---

## 🌐 Web Deployment

The web version is automatically deployed via **Netlify** when `main` is updated.

- Netlify: [ocsf5 dashboard](https://app.netlify.com/sites/ocsf5/deploys)

---

## ⚙️ GitHub Actions CI/CD

Automated workflows handle iOS and Android build processes:

- [iOS Build & Upload](https://github.com/Oak-City-Shredders/oak-city-event-app/actions/workflows/build-ios.yml)
- Additional workflows configured under GitHub Actions tab

Includes:

- App version bump via PR
- Artifact build and signing
- Upload to TestFlight or Play Console

---

## 🔖 Versioning

- Follows [Semantic Versioning](https://semver.org/)
- Example: `v1.0.8`, `v1.1.0`
- Automated version bump PRs triggered via workflow

---

## 🔐 Secrets & Configuration

- `.env` file required for local and CI/CD builds
- Secrets include:
  - Firebase config
  - Google Sheets API keys
  - OAuth credentials
- **Do not commit secrets** to the repo
