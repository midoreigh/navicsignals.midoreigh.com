import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Cpu, 
  Satellite, 
  Radio, 
  Building2, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  HelpCircle,
  Check,
  Minus,
  Plus
} from 'lucide-react';
import { CONSTELLATION_METADATA } from '../data/navicSatellites';

export const HowPhonesCombineGnss: React.FC = () => {
  const [selectedConstellation, setSelectedConstellation] = useState<string>('NavIC');
  const [buildingHeight, setBuildingHeight] = useState<number>(75); // 0 (open ground) to 100 (dense urban canyon)
  const [enableNavicInSimulation, setEnableNavicInSimulation] = useState<boolean>(true);

  // Dynamic Ray-Tracing Geometry for Urban Canyon (ViewBox: 0 0 600 370)
  const phoneX = 300;
  const phoneY = 310;
  const groundY = 330;
  
  // Height in pixels: from 40px (at 10m) to 220px (at 100m)
  const buildingPixHeight = 40 + (buildingHeight / 100) * 180;
  const roofY = groundY - buildingPixHeight; // Y ranges from 272 (low) down to 110 (tall skyscraper)

  // Satellite positions (high in the sky, safely clear of tallest buildings)
  const navicX = 300, navicY = 35;
  const gps18X = 80, gps18Y = 50;
  const gps25X = 520, gps25Y = 60;

  // Collision Math:
  // Tower A inner wall at x = 210. Ray from (80, 50) to phone (300, 310) reaches x=210 at y=203.6.
  // If roofY < 204, Tower A physically blocks the direct ray.
  const isGps18Blocked = roofY < 204;
  // Exact impact point on the horizontal roof surface:
  const hit1X = isGps18Blocked ? 80 + (220 / 260) * (roofY - 50) : phoneX;
  const hit1Y = isGps18Blocked ? roofY : phoneY;

  // Tower B inner wall at x = 390. Ray from (520, 60) to phone (300, 310) reaches x=390 at y=207.7.
  // If roofY < 208, Tower B physically blocks the direct ray.
  const isGps25Blocked = roofY < 208;
  // Exact impact point on the horizontal roof surface:
  const hit2X = isGps25Blocked ? 520 - (220 / 250) * (roofY - 60) : phoneX;
  const hit2Y = isGps25Blocked ? roofY : phoneY;

  // Compute simulated accuracy metrics based on urban canyon
  const gpsVisible = (isGps18Blocked && isGps25Blocked) ? 1 : (!isGps18Blocked && !isGps25Blocked) ? 12 : 5;
  const navicVisible = enableNavicInSimulation ? 7 : 0;
  
  const totalSats = gpsVisible + navicVisible;
  const dop = enableNavicInSimulation 
    ? (1.0 + (buildingHeight / 100) * 0.9).toFixed(1)
    : (3.2 + (buildingHeight / 100) * 5.4).toFixed(1);
    
  const estimatedAccuracy = enableNavicInSimulation
    ? (1.2 + (buildingHeight / 100) * 1.5).toFixed(1)
    : (isGps18Blocked && isGps25Blocked)
    ? (38.0 + (buildingHeight / 100) * 18.0).toFixed(1)
    : (4.5 + (buildingHeight / 100) * 12.5).toFixed(1);

  const multipathRisk = (isGps18Blocked || isGps25Blocked) 
    ? (enableNavicInSimulation ? 'Mitigated by NavIC Zenith' : 'CRITICAL: GPS Blocked & Multipath Drift') 
    : 'Clean Direct Line-of-Sight';

  return (
    <section id="how-it-works" className="py-14 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20 mb-3">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>The Science of Satellite Navigation</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How NavIC Works
          </h2>
          <p className="mt-3 text-slate-300 text-xs sm:text-base leading-relaxed px-1">
            Global positioning is built on atomic clock trilateration. Here is how worldwide GNSS operates — and how India's NavIC constellation anchors high-elevation coverage right above you.
          </p>
        </div>

        {/* HOW GNSS & NAVIC WORK EXPLAINER BOX */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-sky-950/40 via-slate-900/90 to-purple-950/30 border border-sky-400/30 shadow-xl space-y-4">
            {/* Top row: What is GNSS + Core Physics */}
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 shrink-0">
                <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-2 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    How GNSS Works (The Global Standard)
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Core Physics
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <strong className="text-sky-300">GNSS</strong> (<strong className="text-white">Global Navigation Satellite System</strong>) is the universal engineering standard for space-based positioning. Satellites carry onboard atomic clocks and broadcast timed radio signals at the speed of light. Your phone's GNSS receiver measures nanosecond arrival delays (<span className="text-sky-300 font-mono">Δt</span>) from at least 4 satellites to calculate your precise 3D latitude, longitude, altitude, and clock bias through <strong>geometric trilateration</strong>.
                </p>
              </div>
            </div>

            {/* Middle row: How NavIC Fits Into That Picture */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-orange-500/10 via-slate-950/80 to-emerald-500/10 border border-orange-500/30">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base sm:text-lg">🇮🇳</span>
                <h4 className="text-xs sm:text-sm font-bold text-orange-400">
                  Where NavIC Fits Into the Picture
                </h4>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 ml-auto">
                  Overhead Anchor
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Global constellations like GPS (USA), Galileo (EU), and BeiDou (China) operate in moving Medium Earth Orbits (~20,000 km), constantly rising and setting at low horizon angles (20°–35°). 
                In contrast, ISRO parked NavIC in <strong className="text-white">Geostationary (GEO) and Geosynchronous (GSO) orbits at 35,786 km</strong> dedicated entirely to the Indian subcontinent. Because their orbit matches Earth's rotation, several NavIC satellites <strong className="text-emerald-300">hover permanently overhead at 70° to 85° zenith</strong>. 
                Your smartphone modem fuses NavIC's overhead anchor with moving GPS satellites to clear urban high-rises and maintain unbroken lane-level accuracy.
              </p>
            </div>

            {/* Strategic Sovereignty: Why India Built NavIC */}
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-orange-500/15 via-slate-900/90 to-amber-500/15 border border-orange-500/40 shadow-lg shadow-orange-500/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-orange-400 shrink-0" />
                  <h4 className="text-xs sm:text-sm font-extrabold text-white">
                    Why India Built NavIC: Strategic Sovereignty &amp; Defense Autonomy
                  </h4>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 whitespace-nowrap">
                  National Security
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                During the 1999 Kargil conflict, India urgently needed vital satellite positioning over the mountainous combat zone, but foreign-controlled GPS access was withheld. That critical denial exposed the vulnerability of depending on foreign space infrastructure during times of national crisis. To guarantee complete self-reliance, ISRO developed NavIC so that India’s positioning, navigation, and timing (PNT) remain 100% sovereign and immune to foreign geopolitical leverage or blackout.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                  <strong className="text-orange-300 block mb-1">Unconditional Reliability</strong>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Foreign constellations can be throttled, encrypted, or selectively degraded during conflicts. NavIC guarantees India continuous, uncompromised positioning that no external power can revoke.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                  <strong className="text-amber-300 block mb-1">Dual-Tier Protection</strong>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    NavIC broadcasts two independent tiers: an open <strong>Standard Positioning Service (SPS)</strong> for civilian smartphones, and an encrypted, jam-resistant <strong>Restricted Service (RS)</strong> exclusively for defense forces.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                  <strong className="text-emerald-300 block mb-1">Critical Infrastructure Anchor</strong>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Beyond defense, NavIC provides sovereign atomic time synchronization for India's telecommunications backbones, power distribution grids, financial banking networks, and civil aviation corridors.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom 2 Cards: The Bisleri Effect & Smartphone Multi-Constellation Modem */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="font-bold text-amber-300 block mb-1">The "Bisleri" Effect</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Just like how in India we say <strong>"Bisleri"</strong> for packaged water, <strong>"Surf"</strong> for detergent, or <strong>"Colgate"</strong> for toothpaste, people casually say <strong>"GPS"</strong> for location. But GPS is actually only the <strong>American government's system</strong> (NAVSTAR).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="font-bold text-emerald-300 block mb-1">Modern Smartphone GNSS</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Your smartphone doesn't have a "GPS chip" — it has a <strong>multi-constellation GNSS modem</strong> that locks onto GPS (USA), NavIC (India), Galileo (EU), and BeiDou (China) at the exact same moment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Constellations Interactive Selector */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
              The 6 GNSS Constellations in Your Pocket
            </h3>
            <span className="text-[10px] sm:text-xs text-slate-400">Tap to inspect</span>
          </div>

          {/* Grid - 2 cols on mobile, 3 on tablet, 6 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {Object.entries(CONSTELLATION_METADATA).map(([key, info]) => {
              const isSelected = selectedConstellation === key;
              const isNavic = key === 'NavIC';

              return (
                <button
                  key={key}
                  onClick={() => setSelectedConstellation(key)}
                  className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                    isSelected
                      ? isNavic
                        ? 'bg-gradient-to-b from-orange-500/20 to-slate-900 border-orange-500/60 shadow-lg shadow-orange-500/10'
                        : 'bg-sky-950/40 border-sky-400/50 shadow-lg shadow-sky-500/10'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl sm:text-2xl">{info.flag}</span>
                    {isNavic && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-orange-500 text-slate-950">
                        Spotlight
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 text-xs sm:text-sm font-bold text-white truncate">{info.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{info.country}</div>
                  <div className="mt-1 text-[10px] font-mono text-slate-400">
                    {info.totalSatellites} Satellites
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Constellation Banner */}
          {selectedConstellation && (
            <div className="mt-3 sm:mt-4 p-4 sm:p-5 rounded-2xl glass-panel border border-sky-500/20">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xl">{CONSTELLATION_METADATA[selectedConstellation].flag}</span>
                    <h4 className="text-base sm:text-lg font-bold text-white">
                      {CONSTELLATION_METADATA[selectedConstellation].name}
                    </h4>
                    <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {CONSTELLATION_METADATA[selectedConstellation].operator}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
                    {CONSTELLATION_METADATA[selectedConstellation].description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-2 text-xs font-mono w-full sm:w-auto min-w-0">
                  <div className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 min-w-0 max-w-full">
                    <span className="text-slate-400 block text-[9px]">Orbit Altitude</span>
                    <span className="text-sky-300 font-semibold text-[11px]">{CONSTELLATION_METADATA[selectedConstellation].orbitAltitude}</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 min-w-0 max-w-full">
                    <span className="text-slate-400 block text-[9px]">Frequency Bands</span>
                    <span className="text-emerald-300 font-semibold text-[11px] break-words">{CONSTELLATION_METADATA[selectedConstellation].bands.join(' • ')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5-Step Sensor Fusion Diagram - Stacked vertically on mobile */}
        <div className="mt-14 sm:mt-16">
          <div className="text-center max-w-2xl mx-auto mb-8 px-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              The 5-Stage GNSS Fusion Pipeline in Your Phone
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              From microscopic RF antennas inside the glass frame to your navigation app in under 2 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Step 1 */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs mb-2 border border-orange-500/30">
                  01
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-orange-400 shrink-0" />
                  Dual-Band RF Antenna
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Modern phones tune into both <strong className="text-orange-300">L1 (1575 MHz)</strong> and <strong className="text-orange-300">L5 (1176 MHz)</strong>. Comparing both eliminates ionospheric atmospheric delay.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[9px] text-slate-400 font-mono">
                Cancels 5m atmospheric drift
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs mb-2 border border-sky-500/30">
                  02
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-sky-400 shrink-0" />
                  Baseband Correlators
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Modem correlators align PRN codes to measure the nanosecond radio travel time (<span className="text-sky-300 font-mono">Δt</span>) from each satellite atomic clock.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[9px] text-slate-400 font-mono">
                ρ = c × (t_rx - t_tx)
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs mb-2 border border-emerald-500/30">
                  03
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Satellite className="w-4 h-4 text-emerald-400 shrink-0" />
                  Trilateration Engine
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Solves a 4-variable equation for 3D coordinates <span className="text-emerald-300 font-mono">(X, Y, Z)</span> and receiver clock bias. Requires 4+ satellites; modern phones fuse 30+.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[9px] text-slate-400 font-mono">
                Geometric Intersection
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs mb-2 border border-purple-500/30">
                  04
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                  A-GNSS Assisted Sync
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Instead of waiting 45 seconds to download orbit ephemeris over slow radio, cell towers push ephemeris in 1 second over 4G/5G.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[9px] text-slate-400 font-mono">
                TTFF drops from 45s to 1.5s
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
              <div>
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-2 border border-amber-500/30">
                  05
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                  IMU Sensor Fusion
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1.5 leading-relaxed">
                  An Extended Kalman Filter (EKF) fuses satellite fixes with the gyroscope, accelerometer, compass, and barometer for flyovers and tunnels.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[9px] text-slate-400 font-mono">
                Dead reckoning smoothing
              </div>
            </div>
          </div>
        </div>

        {/* THE NAVIC ADVANTAGE: Interactive Urban Canyon Simulator */}
        <div className="mt-14 sm:mt-16 rounded-2xl glass-panel p-4 sm:p-8 border border-sky-500/25">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/30">
                <Sparkles className="w-3 h-3" />
                The NavIC Advantage
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mt-1">
                Urban Canyon Simulator: Why NavIC High Elevation Wins in India
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-1">
                Simulate walking down dense streets in Mumbai, Bengaluru, or Delhi with tall high-rises.
              </p>
            </div>

            <div className="self-start sm:self-auto">
              <button
                onClick={() => setEnableNavicInSimulation(!enableNavicInSimulation)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  enableNavicInSimulation
                    ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-md shadow-orange-500/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                <span>{enableNavicInSimulation ? 'NavIC Fused (IRNSS L5)' : 'GPS Only (NavIC Off)'}</span>
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Visual Canyon Illustration - Responsive Full SVG Ray-Tracer */}
            <div className="lg:col-span-7 bg-[#02050f] rounded-2xl p-2.5 sm:p-4 border border-slate-800 relative overflow-hidden flex flex-col justify-between h-full">
              
              {/* Header Status Bar above Canyon Canvas */}
              <div className="w-full flex items-center justify-between pb-2 mb-1 px-1 border-b border-slate-800/80 text-[11px] font-mono shrink-0">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-orange-400" />
                  <span>Urban Canyon Ray Tracing (2.5D Elevation Physics)</span>
                </span>
                <div>
                  {enableNavicInSimulation ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      Zenith Line Clear
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                      NavIC Offline
                    </span>
                  )}
                </div>
              </div>

              {/* The Interactive SVG Ray-Tracing Canvas */}
              <div className="w-full flex-1 flex items-center justify-center min-h-0 py-1">
                <svg 
                  viewBox="0 0 600 370" 
                  className="w-full h-full max-h-[460px] select-none"
                >
                <defs>
                  {/* Sky Gradient */}
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#030718" />
                    <stop offset="70%" stopColor="#0B1536" />
                    <stop offset="100%" stopColor="#02050f" />
                  </linearGradient>

                  {/* Left Building Facade Gradient */}
                  <linearGradient id="towerAGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#091024" />
                    <stop offset="90%" stopColor="#131E3D" />
                    <stop offset="100%" stopColor="#1E293B" />
                  </linearGradient>

                  {/* Right Building Facade Gradient */}
                  <linearGradient id="towerBGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="10%" stopColor="#131E3D" />
                    <stop offset="100%" stopColor="#091024" />
                  </linearGradient>

                  {/* Saffron NavIC Laser Beam Gradient */}
                  <linearGradient id="navicBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF9933" stopOpacity="1" />
                    <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.95" />
                  </linearGradient>

                  {/* Laser Glow Filters */}
                  <filter id="glowSaffron" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  <filter id="glowRed" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Sky Canvas */}
                <rect x="0" y="0" width="600" height="370" fill="url(#skyGrad)" />

                {/* Ground / Street Asphalt */}
                <rect x="0" y={groundY} width="600" height="40" fill="#060914" />
                <line x1="0" y1={groundY} x2="600" y2={groundY} stroke="#1E293B" strokeWidth="2" />
                {/* Dashed Center Road Stripe */}
                <line x1="210" y1="350" x2="390" y2="350" stroke="#FBBF24" strokeWidth="2" strokeDasharray="10 8" opacity="0.6" />
                {/* Sidewalk curbs */}
                <rect x="206" y={groundY} width="4" height="40" fill="#334155" />
                <rect x="390" y={groundY} width="4" height="40" fill="#334155" />

                {/* ============================================================== */}
                {/* RAY TRACING LAYER: RAYS FROM SATELLITES                        */}
                {/* ============================================================== */}

                {/* 1. GPS-18 SIGNAL RAY (Left: 35° Elevation) */}
                {/* Primary Beam (from satellite to hit point or phone) */}
                <line 
                  x1={gps18X} 
                  y1={gps18Y} 
                  x2={hit1X} 
                  y2={hit1Y} 
                  stroke={isGps18Blocked ? '#38BDF8' : '#60A5FA'} 
                  strokeWidth="2"
                  strokeOpacity={isGps18Blocked ? 0.7 : 0.9}
                />

                {/* If BLOCKED by Tower A: Show Shadow Zone & Outward Multipath Bounce */}
                {isGps18Blocked ? (
                  <g>
                    {/* Shadowed blocked path towards phone (dashed faint red) */}
                    <line 
                      x1={hit1X} 
                      y1={hit1Y} 
                      x2={phoneX} 
                      y2={phoneY} 
                      stroke="#EF4444" 
                      strokeWidth="1.2" 
                      strokeDasharray="4 4" 
                      strokeOpacity="0.25"
                    />

                    {/* Bounced Multipath Reflection Ray bouncing AWAY from street towards sky */}
                    <path 
                      d={`M ${hit1X} ${hit1Y} L ${hit1X - 35} ${hit1Y - 26}`} 
                      fill="none"
                      stroke="#F59E0B" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3" 
                      strokeOpacity="0.85"
                    />
                    <text 
                      x={hit1X - 38} 
                      y={hit1Y - 29} 
                      fill="#FCD34D" 
                      fontSize="7" 
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      Multipath (+42ns)
                    </text>

                    {/* Collision burst at Tower A roof (In-place SVG radial pulse) */}
                    <circle cx={hit1X} cy={hit1Y} r="3.5" fill="#EF4444" opacity="0.8">
                      <animate attributeName="r" values="3.5;13" dur="1.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0" dur="1.4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={hit1X} cy={hit1Y} r="3.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" filter="url(#glowRed)" />

                    {/* Clean BLOCKED Badge floating cleanly right above the impact point */}
                    <g transform={`translate(${hit1X - 25}, ${hit1Y - 18})`}>
                      <rect width="50" height="13" rx="2.5" fill="#7F1D1D" stroke="#EF4444" strokeWidth="1" />
                      <text x="25" y="9.5" fill="#FCA5A5" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                        BLOCKED
                      </text>
                    </g>
                  </g>
                ) : (
                  <circle cx={phoneX} cy={phoneY} r="4" fill="#38BDF8" opacity="0.6" />
                )}

                {/* 2. GPS-25 SIGNAL RAY (Right: 25° Elevation) */}
                <line 
                  x1={gps25X} 
                  y1={gps25Y} 
                  x2={hit2X} 
                  y2={hit2Y} 
                  stroke={isGps25Blocked ? '#38BDF8' : '#60A5FA'} 
                  strokeWidth="2"
                  strokeOpacity={isGps25Blocked ? 0.7 : 0.9}
                />

                {/* If BLOCKED by Tower B: Show Shadow Zone & Outward Multipath Bounce */}
                {isGps25Blocked ? (
                  <g>
                    {/* Shadowed blocked path towards phone */}
                    <line 
                      x1={hit2X} 
                      y1={hit2Y} 
                      x2={phoneX} 
                      y2={phoneY} 
                      stroke="#EF4444" 
                      strokeWidth="1.2" 
                      strokeDasharray="4 4" 
                      strokeOpacity="0.25"
                    />

                    {/* Multipath reflection bouncing AWAY from street towards sky */}
                    <path 
                      d={`M ${hit2X} ${hit2Y} L ${hit2X + 35} ${hit2Y - 26}`} 
                      fill="none"
                      stroke="#F59E0B" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3" 
                      strokeOpacity="0.85"
                    />
                    <text 
                      x={hit2X + 38} 
                      y={hit2Y - 29} 
                      fill="#FCD34D" 
                      fontSize="7" 
                      fontFamily="monospace"
                      textAnchor="start"
                    >
                      Multipath (+36ns)
                    </text>

                    {/* Collision burst at Tower B roof (In-place SVG radial pulse) */}
                    <circle cx={hit2X} cy={hit2Y} r="3.5" fill="#EF4444" opacity="0.8">
                      <animate attributeName="r" values="3.5;13" dur="1.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0" dur="1.4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={hit2X} cy={hit2Y} r="3.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" filter="url(#glowRed)" />

                    {/* Clean BLOCKED Badge floating cleanly right above the impact point */}
                    <g transform={`translate(${hit2X - 25}, ${hit2Y - 18})`}>
                      <rect width="50" height="13" rx="2.5" fill="#7F1D1D" stroke="#EF4444" strokeWidth="1" />
                      <text x="25" y="9.5" fill="#FCA5A5" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                        BLOCKED
                      </text>
                    </g>
                  </g>
                ) : (
                  <circle cx={phoneX} cy={phoneY} r="4" fill="#38BDF8" opacity="0.6" />
                )}

                {/* 3. NAVIC IRNSS-1C SIGNAL RAY (Vertical Zenith 80°) */}
                {enableNavicInSimulation && (
                  <g>
                    {/* Glowing Saffron Laser Beam shining straight down the canyon */}
                    <line 
                      x1={navicX} 
                      y1={navicY + 12} 
                      x2={phoneX} 
                      y2={phoneY} 
                      stroke="url(#navicBeamGrad)" 
                      strokeWidth="3.5"
                      filter="url(#glowSaffron)"
                    />
                    {/* Inner solid high-intensity core beam */}
                    <line 
                      x1={navicX} 
                      y1={navicY + 12} 
                      x2={phoneX} 
                      y2={phoneY} 
                      stroke="#FFFFFF" 
                      strokeWidth="1.5"
                      strokeOpacity="0.95"
                    />

                    {/* Unblocked Badge floating cleanly in the upper canyon street opening */}
                    <g transform={`translate(${navicX - 70}, 95)`}>
                      <rect width="140" height="17" rx="4" fill="#14532D" stroke="#22C55E" strokeWidth="1" />
                      <text x="70" y="11.5" fill="#BBF7D0" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                        100% UNBLOCKED ZENITH (79°)
                      </text>
                    </g>
                  </g>
                )}

                {/* ============================================================== */}
                {/* BUILDINGS LAYER: TOWER A & TOWER B                             */}
                {/* ============================================================== */}

                {/* Dynamic Roof Guideline across Street Canyon */}
                <line 
                  x1="210" 
                  y1={roofY} 
                  x2="390" 
                  y2={roofY} 
                  stroke="#38BDF8" 
                  strokeWidth="1.2" 
                  strokeDasharray="4 3" 
                  strokeOpacity="0.4" 
                />

                {/* Tower A (Left Skyscraper - Clickable to cycle height) */}
                <g 
                  onClick={() => setBuildingHeight(prev => prev > 70 ? 15 : prev + 25)}
                  className="cursor-pointer"
                >
                  <title>Click to change building height</title>
                  <rect 
                    x="0" 
                    y={roofY} 
                    width="210" 
                    height={buildingPixHeight} 
                    fill="url(#towerAGrad)" 
                    stroke="#334155" 
                    strokeWidth="2" 
                  />
                  {/* Tower A Roof trim & Antenna spire */}
                  <rect x="0" y={roofY} width="210" height="4" fill="#64748B" />
                  <line x1="25" y1={roofY} x2="25" y2={roofY - 12} stroke="#94A3B8" strokeWidth="1.5" />
                  <circle cx="25" cy={roofY - 13} r="1.5" fill="#EF4444" className="animate-pulse" />

                  {/* Tower A Clean Identification Badge INSIDE the Facade */}
                  <g transform={`translate(15, ${roofY + 14})`}>
                    <rect width="105" height="18" rx="4" fill="#030718" fillOpacity="0.9" stroke="#38BDF8" strokeWidth="1" />
                    <text x="52.5" y="12" fill="#38BDF8" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      Tower A • {buildingHeight}m
                    </text>
                  </g>

                  {/* Tower A Window Grid (starting below the facade label) */}
                  <g opacity="0.35">
                    {Array.from({ length: Math.min(8, Math.floor((buildingPixHeight - 40) / 22)) }).map((_, row) => (
                      <g key={row} transform={`translate(15, ${roofY + 40 + row * 22})`}>
                        <rect x="0" y="0" width="22" height="10" rx="1.5" fill="#FEF08A" />
                        <rect x="30" y="0" width="22" height="10" rx="1.5" fill="#93C5FD" />
                        <rect x="60" y="0" width="22" height="10" rx="1.5" fill="#FEF08A" />
                        <rect x="90" y="0" width="22" height="10" rx="1.5" fill="#FEF08A" />
                        <rect x="120" y="0" width="22" height="10" rx="1.5" fill="#93C5FD" />
                        <rect x="150" y="0" width="22" height="10" rx="1.5" fill="#FEF08A" />
                      </g>
                    ))}
                  </g>
                </g>

                {/* Tower B (Right Skyscraper - Clickable to cycle height) */}
                <g 
                  onClick={() => setBuildingHeight(prev => prev > 70 ? 15 : prev + 25)}
                  className="cursor-pointer"
                >
                  <title>Click to change building height</title>
                  <rect 
                    x="390" 
                    y={roofY} 
                    width="210" 
                    height={buildingPixHeight} 
                    fill="url(#towerBGrad)" 
                    stroke="#334155" 
                    strokeWidth="2" 
                  />
                  {/* Tower B Roof trim & Antenna */}
                  <rect x="390" y={roofY} width="210" height="4" fill="#64748B" />
                  <line x1="575" y1={roofY} x2="575" y2={roofY - 12} stroke="#94A3B8" strokeWidth="1.5" />
                  <circle cx="575" cy={roofY - 13} r="1.5" fill="#EF4444" className="animate-pulse" />

                  {/* Tower B Clean Identification Badge INSIDE the Facade */}
                  <g transform={`translate(480, ${roofY + 14})`}>
                    <rect width="105" height="18" rx="4" fill="#030718" fillOpacity="0.9" stroke="#38BDF8" strokeWidth="1" />
                    <text x="52.5" y="12" fill="#38BDF8" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      Tower B • {buildingHeight}m
                    </text>
                  </g>

                  {/* Tower B Window Grid (starting below the facade label) */}
                  <g opacity="0.35">
                    {Array.from({ length: Math.min(8, Math.floor((buildingPixHeight - 40) / 22)) }).map((_, row) => (
                      <g key={row} transform={`translate(405, ${roofY + 40 + row * 22})`}>
                        <rect x="0" y="0" width="22" height="10" rx="1.5" fill="#93C5FD" />
                        <rect x="30" y="0" width="22" height="10" rx="1.5" fill="#FEF08A" />
                        <rect x="60" y="0" width="22" height="10" rx="1.5" fill="#93C5FD" />
                        <rect x="90" y="0" width="22" height="10" rx="1.5" fill="#FEF08A" />
                        <rect x="120" y="0" width="22" height="10" rx="1.5" fill="#FEF08A" />
                        <rect x="150" y="0" width="22" height="10" rx="1.5" fill="#93C5FD" />
                      </g>
                    ))}
                  </g>
                </g>

                {/* ============================================================== */}
                {/* SATELLITES IN THE SKY                                          */}
                {/* ============================================================== */}

                {/* NavIC Satellite (IRNSS-1C) at Zenith Center */}
                {enableNavicInSimulation && (
                  <g transform={`translate(${navicX}, ${navicY})`}>
                    <circle cx="0" cy="0" r="14" fill="#FF9933" fillOpacity="0.2" className="animate-ping" />
                    <circle cx="0" cy="0" r="9.5" fill="#FF9933" stroke="#FFFFFF" strokeWidth="1.5" />
                    {/* Solar Wings */}
                    <rect x="-24" y="-3.5" width="10" height="7" rx="1" fill="#38BDF8" stroke="#050814" strokeWidth="1" />
                    <rect x="14" y="-3.5" width="10" height="7" rx="1" fill="#38BDF8" stroke="#050814" strokeWidth="1" />
                    {/* Satellite Label */}
                    <g transform="translate(0, -14)">
                      <rect x="-64" y="-13" width="128" height="15" rx="3" fill="#050814" stroke="#FF9933" strokeWidth="1" />
                      <text x="0" y="-2.5" fill="#FED7AA" fontSize="8" fontWeight="bold" textAnchor="middle">
                        🇮🇳 NavIC IRNSS-1C (Zenith 79°)
                      </text>
                    </g>
                  </g>
                )}

                {/* GPS-18 Satellite (USA) at Left Low Horizon */}
                <g transform={`translate(${gps18X}, ${gps18Y})`}>
                  <circle cx="0" cy="0" r="7.5" fill={isGps18Blocked ? '#475569' : '#3B82F6'} stroke="#FFFFFF" strokeWidth="1.2" />
                  <rect x="-17" y="-3" width="7" height="6" rx="1" fill="#38BDF8" opacity="0.8" />
                  <rect x="10" y="-3" width="7" height="6" rx="1" fill="#38BDF8" opacity="0.8" />
                  <g transform="translate(0, -12)">
                    <rect 
                      x="-48" 
                      y="-13" 
                      width="96" 
                      height="14" 
                      rx="3" 
                      fill="#050814" 
                      stroke={isGps18Blocked ? '#EF4444' : '#3B82F6'} 
                      strokeWidth="1" 
                    />
                    <text x="0" y="-2.5" fill={isGps18Blocked ? '#F87171' : '#93C5FD'} fontSize="7.5" fontWeight="bold" textAnchor="middle">
                      {isGps18Blocked ? '🇺🇸 GPS-18 (Blocked)' : '🇺🇸 GPS-18 (35° El)'}
                    </text>
                  </g>
                </g>

                {/* GPS-25 Satellite (USA) at Right Low Horizon */}
                <g transform={`translate(${gps25X}, ${gps25Y})`}>
                  <circle cx="0" cy="0" r="7.5" fill={isGps25Blocked ? '#475569' : '#3B82F6'} stroke="#FFFFFF" strokeWidth="1.2" />
                  <rect x="-17" y="-3" width="7" height="6" rx="1" fill="#38BDF8" opacity="0.8" />
                  <rect x="10" y="-3" width="7" height="6" rx="1" fill="#38BDF8" opacity="0.8" />
                  <g transform="translate(0, -12)">
                    <rect 
                      x="-48" 
                      y="-13" 
                      width="96" 
                      height="14" 
                      rx="3" 
                      fill="#050814" 
                      stroke={isGps25Blocked ? '#EF4444' : '#3B82F6'} 
                      strokeWidth="1" 
                    />
                    <text x="0" y="-2.5" fill={isGps25Blocked ? '#F87171' : '#93C5FD'} fontSize="7.5" fontWeight="bold" textAnchor="middle">
                      {isGps25Blocked ? '🇺🇸 GPS-25 (Blocked)' : '🇺🇸 GPS-25 (25° El)'}
                    </text>
                  </g>
                </g>

                {/* ============================================================== */}
                {/* USER WITH PHONE IN THE CANYON STREET                           */}
                {/* ============================================================== */}
                <g transform={`translate(${phoneX}, ${phoneY})`}>
                  {/* Reception Status Pulse */}
                  {enableNavicInSimulation ? (
                    <circle cx="0" cy="0" r="14" fill="#10B981" fillOpacity="0.25" className="animate-ping" />
                  ) : (isGps18Blocked && isGps25Blocked) ? (
                    <circle cx="0" cy="0" r="16" fill="#EF4444" fillOpacity="0.35" className="animate-ping" />
                  ) : (
                    <circle cx="0" cy="0" r="10" fill="#38BDF8" fillOpacity="0.2" />
                  )}

                  {/* Phone body */}
                  <rect x="-6" y="-12" width="12" height="20" rx="2" fill="#020617" stroke="#38BDF8" strokeWidth="1.5" />
                  <circle cx="0" cy="5" r="1" fill="#94A3B8" />

                  {/* Antenna Dot */}
                  <circle 
                    cx="0" 
                    cy="-2" 
                    r="3" 
                    fill={enableNavicInSimulation ? '#10B981' : (isGps18Blocked && isGps25Blocked) ? '#EF4444' : '#38BDF8'} 
                    stroke="#FFFFFF" 
                    strokeWidth="1" 
                  />

                  {/* Fix status chip below phone */}
                  <g transform="translate(0, 16)">
                    <rect 
                      x="-48" 
                      y="0" 
                      width="96" 
                      height="15" 
                      rx="3" 
                      fill="#050814" 
                      stroke={enableNavicInSimulation ? '#10B981' : (isGps18Blocked && isGps25Blocked) ? '#EF4444' : '#38BDF8'} 
                      strokeWidth="1" 
                    />
                    <text 
                      x="0" 
                      y="10.5" 
                      fill={enableNavicInSimulation ? '#6EE7B7' : (isGps18Blocked && isGps25Blocked) ? '#FCA5A5' : '#7DD3FC'} 
                      fontSize="7.5" 
                      fontWeight="bold" 
                      textAnchor="middle" 
                      fontFamily="monospace"
                    >
                      {enableNavicInSimulation 
                        ? '3D FIX (±1.8m)' 
                        : (isGps18Blocked && isGps25Blocked) 
                        ? 'FIX LOST (±48m)' 
                        : 'GPS FIX (±6.5m)'}
                    </text>
                  </g>
                </g>
              </svg>
              </div>

              {/* Status Banner directly below illustration */}
              <div className="w-full mt-2 p-2 rounded-xl text-[10px] sm:text-xs flex items-center justify-between font-mono border shrink-0">
                {enableNavicInSimulation ? (
                  <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/40 border-emerald-500/30 p-1.5 rounded-lg w-full">
                    <span className="text-sm">🇮🇳</span>
                    <span><strong>NavIC Zenith Lock:</strong> 79° high-elevation radio beam penetrates the narrow street gap cleanly without building blockage!</span>
                  </div>
                ) : (isGps18Blocked && isGps25Blocked) ? (
                  <div className="flex items-center gap-2 text-rose-300 bg-rose-950/40 border-rose-500/30 p-1.5 rounded-lg w-full">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 border border-rose-500/40">WARN</span>
                    <span><strong>All Direct GPS Blocked:</strong> Low-angle rays (25°–35°) crash into Tower A &amp; B roofs. Only delayed multipath reflections remain!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sky-300 bg-sky-950/40 border-sky-500/30 p-1.5 rounded-lg w-full">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 border border-sky-500/40">INFO</span>
                    <span><strong>Partial Reception:</strong> Low buildings allow some GPS signals, but geometry degrades as towers rise.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Controls & Real-time Comparison Metrics */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
              {/* Canyon Height Controller */}
              <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/60 border border-slate-800 relative overflow-hidden">
                {/* Controller Header & Digital Readout */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                        Canyon Height
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Raise towers to test GPS shadow vs NavIC zenith
                    </p>
                  </div>

                  {/* Digital Altitude Meter */}
                  <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-white">
                      {buildingHeight}<span className="text-sm font-normal text-slate-400 ml-0.5">m</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {buildingHeight <= 25 ? 'Open Sky' : buildingHeight <= 60 ? 'Mid Canyon' : 'Deep Canyon'}
                    </div>
                  </div>
                </div>

                {/* Interactive Slider Area */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Height Range</span>
                    <span className="text-[11px] text-slate-400">10m – 100m</span>
                  </div>

                  {/* Stepper controls + Aerospace Slider */}
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <button
                      onClick={() => setBuildingHeight(prev => Math.max(10, prev - 10))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
                      title="Lower buildings (-10m)"
                      aria-label="Lower buildings by 10 meters"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex-1 relative py-1">
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="1"
                        value={buildingHeight}
                        onChange={(e) => setBuildingHeight(Number(e.target.value))}
                        className="aerospace-slider w-full"
                        aria-label="Skyscraper height slider"
                      />
                    </div>

                    <button
                      onClick={() => setBuildingHeight(prev => Math.min(100, prev + 10))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
                      title="Raise buildings (+10m)"
                      aria-label="Raise buildings by 10 meters"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Clickable Height Milestones */}
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1 pt-0.5">
                    {[
                      { val: 10, label: '10m (Open)' },
                      { val: 30, label: '30m' },
                      { val: 50, label: '50m' },
                      { val: 75, label: '75m' },
                      { val: 100, label: '100m (Max)' },
                    ].map((m) => (
                      <button
                        key={m.val}
                        onClick={() => setBuildingHeight(m.val)}
                        className={`hover:text-orange-400 transition-colors cursor-pointer ${
                          Math.abs(buildingHeight - m.val) <= 5 ? 'text-orange-400 font-bold underline decoration-2 underline-offset-2' : ''
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Scenario Presets Integrated Directly in Controller */}
                  <div className="pt-3 border-t border-slate-800">
                    <div className="text-[10px] uppercase font-mono text-slate-400 mb-2 flex items-center justify-between">
                      <span className="font-semibold text-slate-300">Preset Scenarios:</span>
                      <span className="text-[9px] text-slate-500">Instant test</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      <button
                        onClick={() => setBuildingHeight(15)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          buildingHeight <= 25
                            ? 'bg-sky-500/20 border-sky-400 shadow-md shadow-sky-500/20 text-white font-semibold'
                            : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold text-sky-400">15m</div>
                        <div className="text-xs font-bold mt-0.5">Highway</div>
                        <div className="text-[9px] text-slate-400 font-mono">Open • Clear</div>
                      </button>

                      <button
                        onClick={() => setBuildingHeight(45)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          buildingHeight > 25 && buildingHeight <= 60
                            ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/20 text-white font-semibold'
                            : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold text-amber-400">45m</div>
                        <div className="text-xs font-bold mt-0.5">City Road</div>
                        <div className="text-[9px] text-slate-400 font-mono">Mid • Grazing</div>
                      </button>

                      <button
                        onClick={() => setBuildingHeight(85)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          buildingHeight > 60
                            ? 'bg-orange-500/20 border-orange-400 shadow-md shadow-orange-500/20 text-white font-semibold'
                            : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold text-orange-400">85m</div>
                        <div className="text-xs font-bold mt-0.5">Mumbai</div>
                        <div className="text-[9px] text-slate-400 font-mono">Deep • Shadow</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculated Metrics Cards - 2x2 grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[9px] sm:text-[10px] font-mono uppercase text-slate-400">Position Accuracy</div>
                  <div className={`mt-0.5 text-base sm:text-xl font-mono font-bold ${enableNavicInSimulation ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ±{estimatedAccuracy} m
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    {enableNavicInSimulation ? 'Lane-level' : 'Street-jumping'}
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[9px] sm:text-[10px] font-mono uppercase text-slate-400">PDOP Dilution</div>
                  <div className={`mt-0.5 text-base sm:text-xl font-mono font-bold ${Number(dop) < 2.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {dop}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    {Number(dop) < 2.5 ? 'Strong Geometry' : 'Degraded'}
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[9px] sm:text-[10px] font-mono uppercase text-slate-400">Satellites in Fix</div>
                  <div className="mt-0.5 text-base sm:text-xl font-mono font-bold text-white">
                    {totalSats} <span className="text-[10px] font-normal text-slate-400">sats</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    {enableNavicInSimulation ? `(${gpsVisible} GPS + ${navicVisible} NavIC)` : `(${gpsVisible} GPS Only)`}
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[9px] sm:text-[10px] font-mono uppercase text-slate-400">Multipath Status</div>
                  <div className={`mt-0.5 text-[11px] font-semibold leading-tight ${buildingHeight > 50 && !enableNavicInSimulation ? 'text-rose-400' : 'text-emerald-300'}`}>
                    {multipathRisk}
                  </div>
                </div>
              </div>

              {/* Explanatory Callout */}
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                <strong className="text-orange-400">Why this matters:</strong> GPS satellites travel in MEO orbits and frequently sit at low angles (20°-40°), where skyscrapers block them. 
                In contrast, ISRO designed NavIC with <strong className="text-white">GEO &amp; GSO orbits</strong> positioned directly over the Indian Subcontinent at <strong className="text-emerald-300">70° to 85° elevation</strong> — illuminating narrow urban streets directly from above!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
