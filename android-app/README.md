# NavIC SkyView — Android Companion App

A beautiful, native Android application for monitoring live GNSS satellite signals with **India's NavIC (IRNSS) constellation pinned prominently at the top**.

---

## Why NavIC SkyView?

Modern smartphones combine radio signals from up to 6 satellite constellations (GPS, NavIC, Galileo, BeiDou, GLONASS, QZSS). 

Because web browsers run in a sandboxed security environment (W3C Geolocation API), websites cannot inspect raw radio frequency measurements, PRN numbers, or Carrier-to-Noise density ($C/N_0$ in dB-Hz). 

**NavIC SkyView** uses Android's native `GnssStatus.Callback` and `LocationManager` to decode live satellite baseband telemetry directly from your phone's GNSS antenna.

---

## Features

1. **NavIC-First Priority Pinning**:
   - Isolates `GnssStatus.CONSTELLATION_IRNSS` (constant value `7`).
   - Pinned at the very top of your screen with distinctive Indian tricolor badges.
2. **Carrier Frequency Detection**:
   - Detects whether your phone is receiving **L5 (1176.45 MHz)**, **S-band (2492.028 MHz)**, or modernized **L1 (1575.42 MHz)**.
3. **Polar Skyplot Radar**:
   - Custom Jetpack Compose Canvas rendering azimuth ($0^\circ-360^\circ$) and elevation ($0^\circ-90^\circ$).
   - Shows high-elevation NavIC satellites directly overhead at center zenith.
4. **Live Carrier-to-Noise Density ($C/N_0$ dB-Hz) Bars**:
   - Real-time animated signal bars indicating strong carrier lock ($> 35\text{ dB-Hz}$).
5. **Raw NMEA 0183 Telemetry Stream**:
   - Streams live `$GIGSV` (NavIC/IRNSS talker), `$GNGGA`, `$GNRMC` sentences.
6. **100% Offline & Private**:
   - Requires only `ACCESS_FINE_LOCATION`. No analytics, zero network requests, zero ads.

---

## How to Build & Run

### Prerequisites
- Android Studio Hedgehog (2023.1.1) or later
- JDK 17+
- Android SDK 34 (Android 14) / Min SDK 26 (Android 8.0 Oreo)
- Physical Android phone with GNSS / NavIC support (e.g. OnePlus 11/12, Samsung Galaxy S23/S24, Xiaomi 13/14, Pixel 8/9, iPhone 15/16 Pro via CoreLocation)

### Build with Gradle
```bash
cd android-app
./gradlew assembleRelease
```
The APK will be generated at:
`app/build/outputs/apk/release/app-release.apk`

---

## Architecture & Code Highlight

### Reading NavIC Signals via `GnssStatus.Callback`
```kotlin
locationManager.registerGnssStatusCallback(object : GnssStatus.Callback() {
    override fun onSatelliteStatusChanged(status: GnssStatus) {
        val satCount = status.satelliteCount
        val navicSatellites = mutableListOf<GnssSatellite>()
        
        for (i in 0 until satCount) {
            val constellation = status.getConstellationType(i)
            
            // Constellation Type 7 is CONSTELLATION_IRNSS (NavIC)
            if (constellation == GnssStatus.CONSTELLATION_IRNSS) {
                val prn = status.getSvid(i)
                val cn0 = status.getCn0DbHz(i)
                val elevation = status.getElevationDegrees(i)
                val azimuth = status.getAzimuthDegrees(i)
                val usedInFix = status.usedInFix(i)
                val carrierFreq = if (status.hasCarrierFrequencyHz(i)) {
                    status.getCarrierFrequencyHz(i)
                } else null
                
                navicSatellites.add(
                    GnssSatellite(
                        prn = prn,
                        constellation = "NavIC",
                        cn0DbHz = cn0,
                        elevation = elevation,
                        azimuth = azimuth,
                        usedInFix = usedInFix,
                        carrierFrequencyHz = carrierFreq
                    )
                )
            }
        }
        
        // Push NavIC satellites to UI State with top priority
        _uiState.update { it.copy(navicSatellites = navicSatellites) }
    }
}, Handler(Looper.getMainLooper()))
```

---

## License
Open source under Apache License 2.0. Independent open-source project for GNSS tracking and education. Not affiliated with or endorsed by ISRO.
