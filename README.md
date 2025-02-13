# Introduction

This repository hosts the client code for the Oak City Shred Fest app.

Latest Production versions:

-   [Apple App Store](https://apps.apple.com/us/app/oak-city-shred-fest/id6741046929)
-   [Google Play Store](https://play.google.com/store/apps/details?id=com.oakcityshredfest.app)
-   [Web](http://rideoakcity.com)

Sign up to test:

-   [Apple](https://testflight.apple.com/join/w26AJ7kP)
-   [Android](https://play.google.com/store/apps/details?id=com.oakcityshredfest.app)

# Overview

This is a Typescript React app with Capacitor for native iOS and Android code

Uses:

-   UI Components are from Ionic
-   Firebase (Authentication and Messaging)
-   Google Sheets for reading data
-   Google Cloud Run Functions (subscribe to topics)
-   Google Calendar
-   Netlify for Web deployment

# Getting Started

### To run project locally

`git clone ` the URL of this repo

`npm ci`

`npm start`

create a .env file and contact David or Jared to get the secrets

`cp .sample.env ./.env`

### To locally deploy the Web application

(Prerequisites include `git` and `npm`):

`ionic serve`

To locally deploy iOS and Android requires a more complex setup that includes:

-   XCode
-   Apple Developer account, certs, etc

# Deployment

This app is deployed when changes are made to `main` by `netlify`
See deployments here [https://app.netlify.com/sites/ocsf5/deploys](https://app.netlify.com/sites/ocsf5/deploys)

Android and iOS deployments can be triggered using this [GitHub Action](https://github.com/Oak-City-Shredders/oak-city-event-app/actions/workflows/build-ios.yml)
