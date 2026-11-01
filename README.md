# NavIC Signals

An open-source satellite intelligence web portal and native Android companion application dedicated to **NavIC (Navigation with Indian Constellation / IRNSS)** — India's regional satellite positioning system developed by the Indian Space Research Organisation (ISRO).

Web Portal: [https://navicsignals.midoreigh.com](https://navicsignals.midoreigh.com)  
Android Release: [GitHub Releases](https://github.com/midoreigh/navicsignals.midoreigh.com/releases/latest)

---

## Overview

Global Navigation Satellite Systems (GNSS) like GPS 🇺🇸, Galileo 🇪🇺, BeiDou 🇨🇳, and GLONASS 🇷🇺 rely on Medium Earth Orbit (MEO) constellations (~20,000 km altitude) that continuously transit across the sky. In dense metropolitan environments, deep valleys, and urban canyons, tall buildings frequently obstruct low-elevation MEO satellites, causing multipath signal bouncing and loss of position lock.

**NavIC** takes a fundamentally different architectural approach tailored for South Asia:
- **10 Satellites in High Geostationary (GEO) and Geosynchronous (GSO) Orbits** (~35,786 km altitude).
- **Perpetual High Zenith Geometry**: Because the satellites are parked over the Indian Ocean longitude belt (32.5°E to 131.5°E), several NavIC satellites remain directly overhead (high elevation angles $>60^\circ$ to $80^\circ$) across the Indian subcontinent 24 hours a day, 365 days a year.
- **Urban Canyon Resilience**: Direct overhead line-of-sight clears high-rise buildings and narrow street corridors, dramatically reducing multipath reflection errors.
- **Dual-Band Transmission**: NavIC operates across **L5 (1176.45 MHz)**, **S-band (2492.028 MHz)**, and modernized **L1 (1575.42 MHz)**.

**NavIC Signals** provides both an interactive, educational web portal to understand these orbital dynamics and a companion native Android application for direct hardware inspection on compatible mobile devices.

---

## Repository Structure

```
├── android-app/             # Native Android companion application (Kotlin, Jetpack Compose)
│   ├── app/                 # Android app module (GnssStatus, NMEA decoding, skyplot)
│   ├── build.gradle.kts     # Gradle build configurations
│   └── README.md            # Detailed Android module documentation
├── public/                  # Web static assets, icons, manifest
├── src/                     # React web portal frontend
│   ├── components/          # Interactive UI components (Hero globe, Urban Simulator, etc.)
│   ├── data/                # Constellation specs, Survey of India vector paths, chipsets
│   ├── index.css            # Tailwind CSS styling
│   └── App.tsx              # Application layout & section assembly
├── .github/
│   └── workflows/           # CI and Automated Release pipelines
├── index.html               # Web entry point
├── package.json             # Web dependencies (React 19, Tailwind CSS 4, Vite 8)
└── tsconfig.json            # TypeScript configuration
```

---

## Features

### 1. Interactive Web Portal
- **Planetary Orbital Visualizer**: Canvas-rendered 3D Earth globe featuring the authentic Survey of India (SOI) boundary outline, realistic Earth occultation/dimming for orbiting MEO satellites, and real-time visualization of NavIC's GEO stationary points and GSO figure-8 ground tracks.
- **Urban Canyon Simulator**: Interactive comparison between low-elevation GNSS satellite lines-of-sight vs. NavIC's steep overhead geometry between urban skyscrapers, demonstrating multipath signal reflection mitigation.
- **Device & Chipset Compatibility Matrix**: Searchable database of consumer smartphones (Snapdragon, MediaTek Dimensity, Google Tensor, Apple Silicon) with NavIC L5/S-band/L1 hardware support.
- **Technical Constellation Reference**: Detailed breakdowns of orbital parameters, atomic rubidium clock payloads, carrier frequencies, signal structures, and coverage footprints.

### 2. Native Android Companion App
Modern web browsers are strictly sandboxed by the W3C Geolocation specification, which only exposes latitude, longitude, and generalized accuracy estimates. They cannot access raw radio frequencies, PRNs, or baseband signal strengths.

The **NavIC Signals** Android app bridges this gap by directly interfacing with Android's hardware GNSS subsystem via `GnssStatus.Callback` and `OnNmeaMessageListener`:
- **NavIC-First Priority Pinning**: Isolates `CONSTELLATION_IRNSS` (`7`) and pins Indian satellites at the top of the interface with national origin badges.
- **Carrier Frequency Identification**: Real-time decoding of carrier frequency in Hz, identifying active L5 (1176.45 MHz), S-band (2492.028 MHz), or modernized L1 (1575.42 MHz) signals.
- **Polar Skyplot Radar**: Custom Jetpack Compose Canvas rendering azimuth ($0^\circ-360^\circ$) and elevation ($0^\circ-90^\circ$) coordinates to visualize high-zenith satellites overhead.
- **Carrier-to-Noise Density ($C/N_0$)**: Live animated signal meters showing tracking lock status in dB-Hz.
- **Raw NMEA 0183 Telemetry**: Live stream of raw NMEA sentences including `$GIGSV` / `$IRGSV` (NavIC/IRNSS talker), `$GNGGA`, and `$GNRMC`.
- **Private & Offline**: Requires only `ACCESS_FINE_LOCATION`. Operates 100% offline with zero network requests, zero telemetry, and zero ads.

---

## Getting Started

### Web Portal Development

#### Prerequisites
- Node.js 20+
- npm 10+

#### Installation & Local Run
```bash
# Clone the repository
git clone https://github.com/midoreigh/navicsignals.midoreigh.com.git
cd navicsignals.midoreigh.com

# Install dependencies
npm install

# Start local Vite development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Production Build
```bash
npm run build
```
The optimized static bundle will be generated in `dist/`.

---

### Android Companion App Development

#### Prerequisites
- Android Studio Hedgehog (2023.1.1) or later
- JDK 17
- Android SDK 34 (compileSdk 34, minSdk 26)
- Physical Android smartphone with GNSS hardware support (NavIC requires compatible chipsets such as Snapdragon 8 Gen 1/2/3, Snapdragon 778G/7+ Gen 2, Dimensity 9000/9200/9300, etc.)

#### Building the APK
```bash
cd android-app

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease
```
The output APK will be located at:
`android-app/app/build/outputs/apk/release/app-release.apk`

#### Installing via ADB
```bash
adb install -r android-app/app/build/outputs/apk/release/app-release.apk
```

Pre-compiled release APKs are also available directly on [GitHub Releases](https://github.com/midoreigh/navicsignals.midoreigh.com/releases/latest).

---

## Constellation Summary

| Parameter | NavIC (IRNSS) 🇮🇳 | GPS 🇺🇸 | Galileo 🇪🇺 | BeiDou 🇨🇳 |
| :--- | :--- | :--- | :--- | :--- |
| **Orbit Types** | 3 GEO + 4 GSO | 31 MEO | 24+ MEO | 3 GEO + 3 IGSO + 24 MEO |
| **Orbital Altitude** | ~35,786 km | ~20,180 km | ~23,222 km | ~21,528 km (MEO) / 35,786 km |
| **Primary Region** | India & 1,500 km Buffer | Global | Global | Global + Asia-Pacific Focus |
| **Frequencies** | L5, S-band, modernized L1 | L1, L2, L5 | E1, E5a, E5b, E6 | B1I, B1C, B2a, B3I |
| **Elevation over India** | High Zenith ($>60^\circ-80^\circ$) | Variable ($10^\circ-70^\circ$) | Variable ($10^\circ-70^\circ$) | Variable to High |
| **Android Constellation ID** | `CONSTELLATION_IRNSS` (`7`) | `CONSTELLATION_GPS` (`1`) | `CONSTELLATION_GALILEO` (`6`) | `CONSTELLATION_BEIDOU` (`5`) |
| **NMEA Talker Prefix** | `$GI` or `$IR` | `$GP` | `$GA` | `$GB` or `$BD` |

---

## Disclaimer

**NavIC Signals is an independent, open-source educational project.**

This project and its authors are not affiliated with, funded by, sponsored by, or endorsed by the Indian Space Research Organisation (ISRO), the Department of Space, or the Government of India. "NavIC" and "IRNSS" are names of the satellite navigation system operated by ISRO. All constellation specifications and data are derived from publicly accessible technical literature and standard Android Open Source Project (AOSP) GNSS APIs.

---

## License

This project is licensed under the [Apache License 2.0](LICENSE).
