# 🔌 Evynture App – API Reference

This document provides an overview of the backend services, data schema, and integrations used in the Evynture App. It includes Firestore collections, callable functions, and external API integrations.

---

## 📂 Firestore Collections

### `events`

Stores all scheduled events during the festival.

| Field         | Type      | Description                              |
| ------------- | --------- | ---------------------------------------- |
| `id`          | string    | Unique identifier for the event          |
| `title`       | string    | Event title                              |
| `type`        | string    | Category of the event (e.g., race, ride) |
| `startTime`   | timestamp | Start time of the event                  |
| `endTime`     | timestamp | End time of the event                    |
| `location`    | string    | Location name or reference               |
| `description` | string    | Description of the event                 |

---

### `notifications`

Used for push alerts and in-app announcements.

| Field           | Type      | Description                      |
| --------------- | --------- | -------------------------------- |
| `id`            | string    | Unique ID for the notification   |
| `Details`       | string    | Details of message               |
| `Message`       | string    | Title text                       |
| `Topic`         | string    | Type (e.g., all_users, racing)   |
| `visible`       | boolean   | Whether to show the notification |
| `scheduled`     | timestamp | When to show/send                |
| `Date Sent`     | timestamp | Date sent                        |
| `Publish State` | timestamp | "Publish" or blank               |

---

### `MapData`

Displays map icons and features within the interactive Leaflet map.

| Field       | Type             | Description                          |
| ----------- | ---------------- | ------------------------------------ |
| `id`        | number           | Unique ID                            |
| `lat`       | number           | Latitude                             |
| `lng`       | number           | Longitude                            |
| `type`      | string           | Type (e.g., food, vendor, stage)     |
| `icon`      | string           | Icon filename                        |
| `bounds`    | array (optional) | LatLngBounds if using image overlays |
| `isVisible` | boolean          | Show or hide based on filters        |

---

## ☁️ Cloud Functions

### `subscribeToNotificationTopic`

**Type**: Callable  
**Input**: `{ email: string, topic: string }`  
**Description**: Subscribes a user to a Firebase Messaging topic for updates.

---

### `logVersionCheck`

**Type**: Callable  
**Input**: `{ version: string, platform: string }`  
**Description**: Logs version check attempts for analytics purposes.

---

## 📊 External Integrations

### Google Sheets

- Used for managing dynamic content such as event schedules and sponsor info.
- Imported into Firestore during the build or via scheduled tasks.

---

## 🔐 Environment Variables

Defined in `.env`, required for proper configuration.

| Variable                        | Description                            |
| ------------------------------- | -------------------------------------- |
| `REACT_APP_FIREBASE_API_KEY`    | Firebase access key                    |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID                    |
| `REACT_APP_GOOGLE_SHEETS_ID`    | ID of connected Google Sheet           |
| `REACT_APP_MINIMUM_VERSION`     | Used to prompt users to update the app |

---

## 🧪 Notes

This document will evolve as new endpoints, collections, or services are added to the app infrastructure.
