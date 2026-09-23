# DOrSU Campus Pass

A digital campus pass application built with **Expo**, **React Native**, and **TypeScript** for Davao Oriental State University.

The app presents a mobile student ID card with a live gate-access status, a daily gate-scan counter, an editable (and persistently saved) student profile with photo capture, and administrative controls for simulating suspension/reactivation — all packaged as a self-contained demo with no backend required.

![Expo SDK](https://img.shields.io/badge/Expo-SDK%2057-00758F?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS%20%7C%20Web-lightgrey)

## Features

- **Digital student ID card** — avatar, full name, ID number, program, year level, and campus, displayed in a card UI branded with the DOrSU color scheme.
- **Gate access status badge** — clearly shows `ACTIVE STUDENT • PERMITTED` (green) or `SUSPENDED • GATE DENIED` (red).
- **Gate scan counter** — tracks "Gate Scans Today" with **Simulate Scan** and **Reset** buttons.
- **Editable profile** — update full name, ID number, program, and year level through an inline edit form with save/cancel.
- **Profile photo capture** — take a new photo with the camera or choose one from the photo library (with proper permission handling), then crop it to a square avatar.
- **Peer demo profile** — show/hide a second demo profile and switch which profile is currently active, useful for demonstrations.
- **Administrative controls** — simulate an account suspension or reactivate student access, and switch the active profile.
- **Permanent local storage** — profile data, status, scan count, and visibility settings are saved with `AsyncStorage` and restored automatically on next launch.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Expo SDK 57](https://expo.dev/) |
| UI | React Native 0.86 / React 19 |
| Language | TypeScript (strict mode) |
| Icons | `@expo/vector-icons` (MaterialCommunityIcons) |
| Photo capture | `expo-image-picker` |
| Local persistence | `@react-native-async-storage/async-storage` |
| Safe areas | `react-native-safe-area-context` |

## Project Structure

```
dorsu-campus-pass/
├── App.tsx                     # Root component: state, persistence, and screen layout
├── app.json                    # Expo configuration (name, slug, orientation, UI style)
├── tsconfig.json               # TypeScript config (extends expo base, strict: true)
├── package.json
├── README.md
└── src/
    ├── components/
    │   ├── StudentCard.tsx     # Digital ID card with optional edit/photo affordances
    │   ├── StatusBadge.tsx     # Active vs. suspended gate-permission badge
    │   └── ScanCounter.tsx     # Daily gate-scan counter with simulate/reset actions
    └── types/
        └── student.ts          # StudentProfile, StatusBadgeProps, EditableStudentProfile
```

## Getting Started

### Prerequisites

- **Node.js** (current LTS) and **npm**
- **Expo Go** app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)), or an Android/iOS emulator

### Installation

```bash
git clone https://github.com/viahtresrejas-oss/dorsu-campus-pass.git
cd dorsu-campus-pass
npm install
```

### Run the App

```bash
npx expo start
```

Then, in the terminal that opens:

| Command | Action |
| --- | --- |
| `a` | Run on Android emulator / device |
| `i` | Run on iOS simulator (macOS only) |
| `w` | Run in the browser |
| QR code | Scan with **Expo Go** to run on a physical device |

### Available Scripts

| Script | Description |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run android` | Start and open on Android |
| `npm run ios` | Start and open on iOS |
| `npm run web` | Start and open in the browser |

## Using the App

1. **Student card** — the main card shows the active student's identity and gate status.
2. **Edit profile** — tap the ✏️ pencil icon on the card to change name, ID number, program, or year level; tap the 📷 badge on the avatar to take or choose a photo. Changes are saved permanently on the device.
3. **Gate scans** — tap **Simulate Scan** to increment today's scan count, or **Reset** to zero it.
4. **Peer demo profile** — use the *Show Peer Demo Profile* toggle to hide/show the second profile, and **Switch Active Profile (Peer Demo)** to swap which profile is active.
5. **Administrative controls** — tap **Simulate Account Suspension** to flip the pass to `SUSPENDED • GATE DENIED`, or **Reactivate Student Access** to restore it.

> **Note:** The app ships with sample student data for demonstration purposes. It is a fully client-side prototype — there is no backend, authentication, or real gate integration. All data lives only on the device.

