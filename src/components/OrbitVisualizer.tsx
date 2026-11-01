import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Satellite, 
  Compass, 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  Clock, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface SatelliteOrbitState {
  id: string;
  name: string;
  constellation: 'NavIC' | 'GPS';
  type: 'GEO' | 'GSO' | 'MEO';
  flag: string;
  // Sky view coordinates (Observer in India: 20°N, 78°E)
  azimuth: number; // 0 - 360
  elevation: number; // -90 to +90 (negative = below horizon)
  // World map coordinates
  lat: number;
  lon: number;
  isInSkyView: boolean;
  statusLabel: string;
}

export const OrbitVisualizer: React.FC = () => {
  // Time of day in hours (0.0 to 24.0)
  const [timeHours, setTimeHours] = useState<number>(10.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(4); // hours per second
  const [activeView, setActiveView] = useState<'sky' | 'map'>('sky');
  const [selectedSat, setSelectedSat] = useState<string | null>('irnss-1c');

  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Animation Loop for 24-hour cycle
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lastTimestampRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current !== null) {
        const deltaSeconds = (timestamp - lastTimestampRef.current) / 1000;
        setTimeHours(prev => {
          const next = prev + deltaSeconds * playbackSpeed;
          return next >= 24 ? next - 24 : next;
        });
      }
      lastTimestampRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  // Astrodynamics calculation as a function of time (0 to 24h)
  // theta goes from 0 to 2*PI across 24 hours
  const theta = (timeHours / 24) * 2 * Math.PI;

  // 1. NavIC GEO Satellites (Geostationary, 35,786 km, 0° Inclination)
  // Perfectly static relative to India!
  const navic1C: SatelliteOrbitState = {
    id: 'irnss-1c',
    name: 'IRNSS-1C',
    constellation: 'NavIC',
    type: 'GEO',
    flag: '🇮🇳',
    azimuth: 178,
    elevation: 79, // Near-vertical Zenith
    lat: 0.0,
    lon: 83.0,
    isInSkyView: true,
    statusLabel: 'Motionless Zenith (79° Fixed)',
  };

  const navic1F: SatelliteOrbitState = {
    id: 'irnss-1f',
    name: 'IRNSS-1F',
    constellation: 'NavIC',
    type: 'GEO',
    flag: '🇮🇳',
    azimuth: 245,
    elevation: 51,
    lat: 0.0,
    lon: 32.5,
    isInSkyView: true,
    statusLabel: 'Motionless Western Sky (51° Fixed)',
  };

  const navic1G: SatelliteOrbitState = {
    id: 'irnss-1g',
    name: 'IRNSS-1G',
    constellation: 'NavIC',
    type: 'GEO',
    flag: '🇮🇳',
    azimuth: 110,
    elevation: 42,
    lat: 0.0,
    lon: 129.5,
    isInSkyView: true,
    statusLabel: 'Motionless Eastern Sky (42° Fixed)',
  };

  // 2. NavIC GSO Satellites (Geosynchronous, 35,786 km, 29° Inclined)
  // Gentle figure-8 analemma, permanently staying overhead India!
  const navic1B: SatelliteOrbitState = {
    id: 'irnss-1b',
    name: 'IRNSS-1B',
    constellation: 'NavIC',
    type: 'GSO',
    flag: '🇮🇳',
    azimuth: 152 + 10 * Math.sin(2 * theta),
    elevation: 68 + 12 * Math.sin(theta),
    lat: 29 * Math.sin(theta),
    lon: 55.0 + 3.5 * Math.sin(2 * theta),
    isInSkyView: true,
    statusLabel: 'Overhead Figure-8 Loop (56°–80°)',
  };

  const navic1I: SatelliteOrbitState = {
    id: 'irnss-1i',
    name: 'IRNSS-1I',
    constellation: 'NavIC',
    type: 'GSO',
    flag: '🇮🇳',
    azimuth: 156 + 10 * Math.sin(2 * (theta + Math.PI)),
    elevation: 72 + 12 * Math.sin(theta + Math.PI),
    lat: 29 * Math.sin(theta + Math.PI),
    lon: 55.0 + 3.5 * Math.sin(2 * (theta + Math.PI)),
    isInSkyView: true,
    statusLabel: 'Overhead Figure-8 Loop (60°–84°)',
  };

  const navic1A: SatelliteOrbitState = {
    id: 'irnss-1a',
    name: 'IRNSS-1A',
    constellation: 'NavIC',
    type: 'GSO',
    flag: '🇮🇳',
    azimuth: 150 + 10 * Math.sin(2 * (theta + 0.4)),
    elevation: 66 + 12 * Math.sin(theta + 0.4),
    lat: 29 * Math.sin(theta + 0.4),
    lon: 55.0 + 3.5 * Math.sin(2 * (theta + 0.4)),
    isInSkyView: true,
    statusLabel: 'Short-Message Service Figure-8 (54°–78°)',
  };

  const navic1E: SatelliteOrbitState = {
    id: 'irnss-1e',
    name: 'IRNSS-1E',
    constellation: 'NavIC',
    type: 'GSO',
    flag: '🇮🇳',
    azimuth: 118 + 11 * Math.sin(2 * (theta + 1.5)),
    elevation: 62 + 12 * Math.sin(theta + 1.5),
    lat: 29 * Math.sin(theta + 1.5),
    lon: 111.75 + 3.5 * Math.sin(2 * (theta + 1.5)),
    isInSkyView: true,
    statusLabel: 'Overhead Figure-8 Loop (50°–74°)',
  };

  const navicNVS01: SatelliteOrbitState = {
    id: 'nvs-01',
    name: 'NVS-01 (Gen-2)',
    constellation: 'NavIC',
    type: 'GSO',
    flag: '🇮🇳',
    azimuth: 162 + 9 * Math.sin(2 * (theta + 0.8)),
    elevation: 75 + 11 * Math.sin(theta + 0.8),
    lat: 29 * Math.sin(theta + 0.8),
    lon: 55.0 + 3.5 * Math.sin(2 * (theta + 0.8)),
    isInSkyView: true,
    statusLabel: 'L1+L5 Zenith Figure-8 (64°–86°)',
  };

  const navicNVS02: SatelliteOrbitState = {
    id: 'nvs-02',
    name: 'NVS-02 (Gen-2)',
    constellation: 'NavIC',
    type: 'GSO',
    flag: '🇮🇳',
    azimuth: 122 + 10 * Math.sin(2 * (theta + 2.6)),
    elevation: 61 + 11 * Math.sin(theta + 2.6),
    lat: 29 * Math.sin(theta + 2.6),
    lon: 111.75 + 3.5 * Math.sin(2 * (theta + 2.6)),
    isInSkyView: true,
    statusLabel: 'In Orbit Second-Gen Slot (50°–72°)',
  };

  const navicNVS03: SatelliteOrbitState = {
    id: 'nvs-03',
    name: 'NVS-03 (Gen-2)',
    constellation: 'NavIC',
    type: 'GSO',
    flag: '🇮🇳',
    azimuth: 126 + 10 * Math.sin(2 * (theta + 4.2)),
    elevation: 64 + 11 * Math.sin(theta + 4.2),
    lat: 29 * Math.sin(theta + 4.2),
    lon: 111.75 + 3.5 * Math.sin(2 * (theta + 4.2)),
    isInSkyView: true,
    statusLabel: 'Launched Oct 2026 • L1+L5 GSO Fix (53°–75°)',
  };

  // 3. GPS Satellites (Medium Earth Orbit, 20,200 km, ~12h Period, 55° Inclined)
  // Fast moving relative to India! Crosses sky in ~3.5h, then below horizon for ~8.5h!
  const calculateGpsSatellite = (
    id: string, 
    name: string, 
    phaseOffset: number, 
    crossAzimuthStart: number, 
    peakElevation: number
  ): SatelliteOrbitState => {
    // GPS period is 12 hours -> 2 complete cycles per 24h
    // Earth rotates once -> ground track drifts westward by ~180° per orbit
    const orbitPhase = ((timeHours * 2 + phaseOffset) % 24) / 24 * 2 * Math.PI;
    
    // Elevation curve: positive for only ~3.5 hours out of 12 hours (approx 0.28 of cycle)
    const sinPhase = Math.sin(orbitPhase);
    // When sinPhase > 0.45, satellite is above horizon from India
    const isAboveHorizon = sinPhase > 0.35;
    
    let elevation = -30;
    let azimuth = crossAzimuthStart;
    
    if (isAboveHorizon) {
      // Scale elevation from 0 to peakElevation
      const normalizedPass = (sinPhase - 0.35) / 0.65;
      elevation = normalizedPass * peakElevation;
      // Azimuth sweeps from enter to exit
      const sweepProgress = (Math.cos(orbitPhase) + 1) / 2;
      azimuth = (crossAzimuthStart + sweepProgress * 110) % 360;
    } else {
      // Below horizon
      elevation = -15 - Math.abs(sinPhase) * 40;
      azimuth = (crossAzimuthStart + 180) % 360;
    }

    // World map coordinates
    const mapLon = ((timeHours * 30 + phaseOffset * 15) % 360) - 180;
    const mapLat = 55 * Math.sin(orbitPhase);

    return {
      id,
      name,
      constellation: 'GPS',
      type: 'MEO',
      flag: '🇺🇸',
      azimuth,
      elevation,
      lat: mapLat,
      lon: mapLon,
      isInSkyView: elevation > 0,
      statusLabel: elevation > 0 
        ? `Passing Overhead (${elevation.toFixed(0)}° El, Setting in ~${((sinPhase - 0.35) * 4).toFixed(1)}h)`
        : 'Below Horizon (Behind Earth / Loss of Signal)',
    };
  };

  const gps18 = calculateGpsSatellite('gps-18', 'GPS-18', 0, 40, 52);
  const gps24 = calculateGpsSatellite('gps-24', 'GPS-24', 6, 210, 64);
  const gps12 = calculateGpsSatellite('gps-12', 'GPS-12', 12, 310, 46);
  const gps04 = calculateGpsSatellite('gps-04', 'GPS-04', 18, 110, 38);

  const allSatellites: SatelliteOrbitState[] = [
    navic1C,
    navic1F,
    navic1G,
    navic1A,
    navic1B,
    navic1E,
    navic1I,
    navicNVS01,
    navicNVS02,
    navicNVS03,
    gps18,
    gps24,
    gps12,
    gps04,
  ];

  const visibleGpsCount = [gps18, gps24, gps12, gps04].filter(s => s.isInSkyView).length;
  const visibleNavicCount = 10; // All 10 NavIC satellites in orbit are ALWAYS visible!

  // Polar projection for Sky View (Observer looking up from India)
  // Center: (160, 160), Radius: 135
  const polarToSvg = (azimuth: number, elevation: number) => {
    const center = 160;
    const radius = 135;
    // Cap elevation display: satellites below horizon mapped to outer rim
    const clampedEl = Math.max(0, elevation);
    const r = radius * ((90 - clampedEl) / 90);
    const angleRad = (azimuth - 90) * (Math.PI / 180);
    const x = center + r * Math.cos(angleRad);
    const y = center + r * Math.sin(angleRad);
    return { x, y };
  };

  // Mercator-like projection for World Map
  // Center is India (78°E Longitude, 20°N Latitude)
  // Width: 600, Height: 300
  const latLonToMapSvg = (lat: number, lon: number) => {
    const width = 600;
    const height = 300;
    // Center at 78°E longitude
    let deltaLon = lon - 78;
    if (deltaLon > 180) deltaLon -= 360;
    if (deltaLon < -180) deltaLon += 360;

    const x = (width / 2) + (deltaLon / 180) * (width / 2);
    const y = (height / 2) - (lat / 90) * (height / 2);
    return { x, y };
  };

  // Format time of day
  const formattedHours = Math.floor(timeHours).toString().padStart(2, '0');
  const formattedMinutes = Math.floor((timeHours % 1) * 60).toString().padStart(2, '0');

  const selectedSatelliteData = allSatellites.find(s => s.id === selectedSat) || navic1C;

  return (
    <section id="orbit-mechanics" className="py-14 sm:py-20 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2 sm:mb-3">
            <span>🇮🇳</span>
            <span>Interactive Astrodynamics Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why NavIC Stays Put While GPS Flies Over
          </h2>
          <p className="mt-2.5 sm:mt-3 text-slate-300 text-xs sm:text-base leading-relaxed px-1">
            Watch the 24-hour simulation below. American GPS satellites orbit at 20,000 km, zipping across India in 3 hours and dipping below the horizon. <strong className="text-orange-400">NavIC satellites at 35,786 km stay permanently locked in the sky above India 24/7/365.</strong>
          </p>
        </div>

        {/* Interactive Master Simulator Deck */}
        <div className="mt-8 sm:mt-10 rounded-2xl glass-panel border border-sky-500/30 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          
          {/* Top Control Bar: Time Slider, Play/Pause, View Toggle */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            
            {/* Left: 24h Time Display & Play/Pause */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-orange-500/20 transition-all cursor-pointer shrink-0"
                aria-label={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span className="font-mono text-lg sm:text-xl font-extrabold text-white">
                    {formattedHours}:{formattedMinutes} <span className="text-xs text-orange-400 font-normal">IST (24h Clock)</span>
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Earth Rotation Phase: {((timeHours / 24) * 360).toFixed(0)}°
                </div>
              </div>

              {/* Speed Buttons */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 ml-2">
                {[1, 4, 12].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-all ${
                      playbackSpeed === speed 
                        ? 'bg-orange-500 text-slate-950 font-bold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <button
                onClick={() => setTimeHours(0)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer transition-colors"
                title="Reset to 00:00"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Center: Time Scrubber Slider */}
            <div className="flex-1 max-w-md w-full">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>00:00 Night</span>
                <span className="text-orange-400 font-semibold">Drag to scrub 24 hours</span>
                <span>24:00</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="0.05"
                value={timeHours}
                onChange={(e) => {
                  setTimeHours(parseFloat(e.target.value));
                  setIsPlaying(false);
                }}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
              />
            </div>

            {/* Right: View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0">
              <button
                onClick={() => setActiveView('sky')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeView === 'sky' 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md font-bold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Observer Sky Dome</span>
              </button>
              <button
                onClick={() => setActiveView('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeView === 'map' 
                    ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 shadow-md font-bold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>World Orbit Map</span>
              </button>
            </div>

          </div>

          {/* SIMULATION VISUALIZER CANVAS */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            
            {/* Left Graphic Display (Sky View or Map View) */}
            <div className="lg:col-span-8 flex flex-col items-center justify-center bg-[#030614] rounded-2xl border border-slate-800/90 p-3 sm:p-5 relative min-h-[360px] sm:min-h-[440px] overflow-hidden">
              
              {/* VIEW 1: GROUND OBSERVER IN INDIA (POLAR SKY DOME) */}
              {activeView === 'sky' && (
                <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] max-w-full aspect-square flex items-center justify-center">
                  
                  {/* Subtle sky background */}
                  <svg viewBox="0 0 320 320" className="w-full h-full select-none">
                    {/* Dark Sky Dome */}
                    <circle cx="160" cy="160" r="135" fill="#040817" stroke="#334155" strokeWidth="1.5" />
                    
                    {/* Horizon Ring (0° Elevation) */}
                    <circle cx="160" cy="160" r="135" fill="none" stroke="#475569" strokeWidth="2" />
                    
                    {/* 30° Elevation Ring */}
                    <circle cx="160" cy="160" r="90" fill="none" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1.2" />
                    
                    {/* 60° Elevation Ring */}
                    <circle cx="160" cy="160" r="45" fill="none" stroke="#0284c7" strokeOpacity="0.3" strokeDasharray="2 2" strokeWidth="1" />
                    
                    {/* Zenith Safe Zone (70°–90°) Highlight */}
                    <circle cx="160" cy="160" r="28" fill="#FF9933" fillOpacity="0.08" stroke="#FF9933" strokeOpacity="0.35" strokeWidth="1.2" />
                    <circle cx="160" cy="160" r="3" fill="#38bdf8" />

                    {/* Cardinal Directions */}
                    <line x1="160" y1="25" x2="160" y2="295" stroke="#1e293b" strokeWidth="1" />
                    <line x1="25" y1="160" x2="295" y2="160" stroke="#1e293b" strokeWidth="1" />
                    
                    <text x="160" y="18" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">N (0°)</text>
                    <text x="306" y="163" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">E (90°)</text>
                    <text x="160" y="312" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">S (180°)</text>
                    <text x="14" y="163" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">W (270°)</text>

                    {/* Elevation Labels */}
                    <text x="163" y="118" fill="#64748b" fontSize="7.5" textAnchor="start">60°</text>
                    <text x="163" y="73" fill="#64748b" fontSize="7.5" textAnchor="start">30°</text>
                    <text x="163" y="28" fill="#64748b" fontSize="7.5" textAnchor="start">10° Horizon</text>
                    <text x="163" y="156" fill="#FF9933" fontSize="8" fontWeight="bold" textAnchor="start">90° Zenith</text>

                    {/* NavIC GSO Analemma (Figure-8) Guide Paths */}
                    {/* 55°E Slot (IRNSS-1B, 1I, NVS-01) figure-8 path */}
                    <path
                      d="M 152 76 C 172 65, 172 105, 152 94 C 132 83, 132 123, 152 112"
                      fill="none"
                      stroke="#FF9933"
                      strokeOpacity="0.25"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                    />
                    {/* 111.75°E Slot (IRNSS-1D, 1E) figure-8 path */}
                    <path
                      d="M 215 125 C 230 115, 230 145, 215 138 C 200 130, 200 160, 215 152"
                      fill="none"
                      stroke="#FF9933"
                      strokeOpacity="0.25"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                    />

                    {/* GPS Ground Cross Tracks (Dashed Blue arcs) */}
                    <path
                      d="M 40 180 Q 160 80 280 200"
                      fill="none"
                      stroke="#38bdf8"
                      strokeOpacity="0.2"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M 270 90 Q 160 140 50 250"
                      fill="none"
                      stroke="#38bdf8"
                      strokeOpacity="0.2"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />

                    {/* RENDER SATELLITES IN SKY VIEW */}
                    {allSatellites.map(sat => {
                      const { x, y } = polarToSvg(sat.azimuth, sat.elevation);
                      const isNavic = sat.constellation === 'NavIC';
                      const isSelected = selectedSat === sat.id;
                      const isAbove = sat.isInSkyView;

                      return (
                        <g
                          key={sat.id}
                          transform={`translate(${x}, ${y})`}
                          onClick={() => setSelectedSat(sat.id)}
                          className="cursor-pointer group"
                          opacity={isAbove ? 1 : 0.25}
                        >
                          {/* Selection Halo */}
                          {isSelected && (
                            <circle
                              r="15"
                              fill="none"
                              stroke={isNavic ? '#FF9933' : '#38bdf8'}
                              strokeWidth="2"
                              className="animate-ping"
                              opacity="0.6"
                            />
                          )}

                          {/* Pulsing beacon for Zenith NavIC */}
                          {isNavic && sat.id === 'irnss-1c' && (
                            <circle
                              r="12"
                              fill="#FF9933"
                              fillOpacity="0.25"
                              className="animate-pulse"
                            />
                          )}

                          {/* Satellite Icon Node */}
                          <circle
                            r={isNavic ? '8' : '6'}
                            fill={isNavic ? '#FF9933' : isAbove ? '#38bdf8' : '#64748b'}
                            stroke={isSelected ? '#ffffff' : isNavic ? '#ea580c' : '#0284c7'}
                            strokeWidth="1.5"
                          />

                          {/* Satellite Text Label */}
                          <text
                            x="0"
                            y={isNavic ? -11 : 14}
                            textAnchor="middle"
                            fill={isNavic ? '#fed7aa' : isAbove ? '#bae6fd' : '#64748b'}
                            fontSize="7.5"
                            fontWeight="bold"
                            className="pointer-events-none drop-shadow"
                          >
                            {sat.name}
                          </text>

                          {/* Stationary Tag for NavIC GEO */}
                          {sat.type === 'GEO' && (
                            <text
                              x="0"
                              y={12}
                              textAnchor="middle"
                              fill="#f97316"
                              fontSize="6"
                              fontFamily="monospace"
                              fontWeight="bold"
                              className="pointer-events-none"
                            >
                              [STATIONARY]
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Sky View Legend Annotation */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-slate-400 font-mono px-2 py-1 rounded bg-slate-950/80 border border-slate-800">
                    <span className="flex items-center gap-1 text-orange-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      NavIC: Fixed Zenith (Never Sets)
                    </span>
                    <span className="flex items-center gap-1 text-sky-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      GPS: Moving Fast &amp; Setting
                    </span>
                  </div>
                </div>
              )}

              {/* VIEW 2: WORLD ORBIT & GROUND TRACK MAP */}
              {activeView === 'map' && (
                <div className="relative w-full h-[320px] sm:h-[390px] flex items-center justify-center">
                  <svg viewBox="0 0 600 300" className="w-full h-full select-none">
                    {/* World Grid & Background */}
                    <rect width="600" height="300" fill="#040817" />
                    
                    {/* Latitude grid lines */}
                    <line x1="0" y1="50" x2="600" y2="50" stroke="#1e293b" strokeWidth="0.8" />
                    <line x1="0" y1="100" x2="600" y2="100" stroke="#1e293b" strokeWidth="0.8" />
                    <line x1="0" y1="150" x2="600" y2="150" stroke="#334155" strokeWidth="1.5" /> {/* Equator */}
                    <line x1="0" y1="200" x2="600" y2="200" stroke="#1e293b" strokeWidth="0.8" />
                    <line x1="0" y1="250" x2="600" y2="250" stroke="#1e293b" strokeWidth="0.8" />

                    {/* Longitude grid lines */}
                    <line x1="150" y1="0" x2="150" y2="300" stroke="#1e293b" strokeWidth="0.8" />
                    <line x1="300" y1="0" x2="300" y2="300" stroke="#0284c7" strokeOpacity="0.4" strokeWidth="1.2" strokeDasharray="3 3" /> {/* Prime India Longitude 78°E */}
                    <line x1="450" y1="0" x2="450" y2="300" stroke="#1e293b" strokeWidth="0.8" />

                    {/* Labels */}
                    <text x="302" y="15" fill="#38bdf8" fontSize="8" fontWeight="bold">India Longitude (78°E)</text>
                    <text x="5" y="146" fill="#94a3b8" fontSize="8" fontWeight="bold">Equator (0°)</text>

                    {/* Schematic World Continents centered on Indian Ocean (78°E) */}
                    {/* India Subcontinent Shape */}
                    <polygon
                      points="290,105 310,105 320,125 305,150 290,135 285,115"
                      fill="#0f2b38"
                      stroke="#22c55e"
                      strokeWidth="1.5"
                    />
                    {/* Asia */}
                    <path
                      d="M 230 70 Q 300 40 420 50 Q 450 90 400 120 Q 350 110 320 125 L 310 105 L 290 105 L 280 90 Z"
                      fill="#0c1829"
                      stroke="#1e3a5f"
                      strokeWidth="1"
                    />
                    {/* Africa */}
                    <path
                      d="M 170 110 Q 230 110 240 140 Q 250 190 200 230 Q 170 180 160 130 Z"
                      fill="#0c1829"
                      stroke="#1e3a5f"
                      strokeWidth="1"
                    />
                    {/* Australia */}
                    <ellipse cx="440" cy="200" rx="35" ry="25" fill="#0c1829" stroke="#1e3a5f" strokeWidth="1" />

                    {/* NavIC Primary 1500 km Coverage Footprint (Glowing Area over India) */}
                    <ellipse
                      cx="300"
                      cy="130"
                      rx="75"
                      ry="65"
                      fill="#FF9933"
                      fillOpacity="0.12"
                      stroke="#FF9933"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                    <text x="300" y="132" fill="#fed7aa" fontSize="8" fontWeight="bold" textAnchor="middle">
                      🇮🇳 NavIC 1,500 km Primary Zone
                    </text>

                    {/* NavIC GSO Analemma (Figure-8) Ground Tracks */}
                    {/* 55°E Slot Figure-8 Ground Track */}
                    <path
                      d="M 260 150 C 275 105, 245 105, 260 150 C 275 195, 245 195, 260 150 Z"
                      fill="none"
                      stroke="#FF9933"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />
                    <text x="260" y="88" fill="#f97316" fontSize="7" fontWeight="bold" textAnchor="middle">GSO 55°E</text>

                    {/* 111.75°E Slot Figure-8 Ground Track */}
                    <path
                      d="M 355 150 C 370 105, 340 105, 355 150 C 370 195, 340 195, 355 150 Z"
                      fill="none"
                      stroke="#FF9933"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />
                    <text x="355" y="88" fill="#f97316" fontSize="7" fontWeight="bold" textAnchor="middle">GSO 111.75°E</text>

                    {/* GPS Global Sine-wave Ground Track (MEO 55° Inclination) */}
                    <path
                      d="M 0 100 Q 150 240 300 150 Q 450 60 600 200"
                      fill="none"
                      stroke="#38bdf8"
                      strokeOpacity="0.3"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />

                    {/* RENDER SATELLITES ON WORLD MAP */}
                    {allSatellites.map(sat => {
                      const { x, y } = latLonToMapSvg(sat.lat, sat.lon);
                      const isNavic = sat.constellation === 'NavIC';
                      const isSelected = selectedSat === sat.id;

                      return (
                        <g
                          key={sat.id}
                          transform={`translate(${x}, ${y})`}
                          onClick={() => setSelectedSat(sat.id)}
                          className="cursor-pointer group"
                        >
                          {isSelected && (
                            <circle
                              r="13"
                              fill="none"
                              stroke={isNavic ? '#FF9933' : '#38bdf8'}
                              strokeWidth="1.8"
                              className="animate-ping"
                            />
                          )}

                          <circle
                            r={isNavic ? '7' : '5'}
                            fill={isNavic ? '#FF9933' : '#38bdf8'}
                            stroke={isSelected ? '#ffffff' : '#030614'}
                            strokeWidth="1.2"
                          />

                          <text
                            x="0"
                            y={isNavic ? -9 : 12}
                            textAnchor="middle"
                            fill={isNavic ? '#fed7aa' : '#bae6fd'}
                            fontSize="7"
                            fontWeight="bold"
                            className="pointer-events-none drop-shadow"
                          >
                            {sat.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Map View Legend */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-slate-400 font-mono px-2 py-1 rounded bg-slate-950/80 border border-slate-800">
                    <span className="text-orange-400">● 3 GEO (Stationary) + 7 GSO (Figure-8)</span>
                    <span className="text-sky-400">● GPS (Circumnavigating Earth every 12h)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Live Astrodynamics Telemetry Comparison Panel */}
            <div className="lg:col-span-4 space-y-3.5">
              
              {/* Dynamic Status Metric Card */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Constellation Status
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Calculation
                  </span>
                </div>

                {/* NavIC Status */}
                <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/25">
                  <div className="flex items-center justify-between text-xs font-bold text-orange-400">
                    <span className="flex items-center gap-1.5">
                      <span>🇮🇳</span>
                      <span>NavIC (ISRO)</span>
                    </span>
                    <span className="font-mono text-emerald-400">{visibleNavicCount}/10 in Orbit</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-300">
                    Status: <strong className="text-white">100% Continuous Zenith Lock</strong>
                  </div>
                  <div className="text-[10px] text-orange-300/80 font-mono mt-0.5">
                    Relative Sky Speed: <strong>0.0 km/h (Never Sets)</strong>
                  </div>
                </div>

                {/* GPS Status */}
                <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/25">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-400">
                    <span className="flex items-center gap-1.5">
                      <span>🇺🇸</span>
                      <span>GPS (NAVSTAR)</span>
                    </span>
                    <span className="font-mono text-amber-400">{visibleGpsCount}/4 In Pass</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-300">
                    Status: <strong className="text-white">Fast MEO Flyover (~3.5h window)</strong>
                  </div>
                  <div className="text-[10px] text-sky-300/80 font-mono mt-0.5">
                    Orbital Speed: <strong>3.87 km/s (Constantly Setting)</strong>
                  </div>
                </div>
              </div>

              {/* Selected Satellite Inspector Details */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Selected Spacecraft
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
                    <span>{selectedSatelliteData.flag}</span>
                    <span>{selectedSatelliteData.name}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedSatelliteData.type} Orbit
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed font-mono">
                  {selectedSatelliteData.statusLabel}
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                  <div>
                    Azimuth: <strong className="text-white">{selectedSatelliteData.azimuth.toFixed(0)}°</strong>
                  </div>
                  <div>
                    Elevation: <strong className={selectedSatelliteData.elevation > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {selectedSatelliteData.elevation > 0 ? `${selectedSatelliteData.elevation.toFixed(0)}°` : 'Below Horizon'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Explainer Note */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <p>
                  Press <strong>Play</strong> or drag the <strong>slider</strong>. Notice how GPS dots cross the screen and vanish, while NavIC satellites remain high near the center 24 hours a day!
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Orbit Comparison Architectural Breakdown */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Geostationary Satellites (GEO) */}
          <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-sky-500/20 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  3 Satellites in Equator
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-2">
                  Geostationary Orbits (GEO)
                </h3>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <Satellite className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Stationed at <strong className="text-orange-300">35,786 km</strong> above the equator. Their orbital period exactly matches Earth's 24-hour rotation, meaning from India they <strong className="text-white">never rise or set</strong> — they appear motionless in the sky at fixed azimuths.
            </p>

            <div className="mt-4 space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-white font-bold">IRNSS-1C</span>
                <span className="text-orange-400 text-[11px] sm:text-xs">83° E (Direct Central India Meridian • 79° Zenith)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-white font-bold">IRNSS-1F</span>
                <span className="text-orange-400 text-[11px] sm:text-xs">32.5° E (Western Gateway / Arabian Sea)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-white font-bold">IRNSS-1G</span>
                <span className="text-orange-400 text-[11px] sm:text-xs">129.5° E (Eastern Gateway / Bay of Bengal)</span>
              </div>
            </div>
          </div>

          {/* Geosynchronous Inclined Satellites (GSO) */}
          <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-sky-500/20 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  7 Satellites in Figure-8
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-2">
                  Geosynchronous Orbits (GSO)
                </h3>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Inclined at <strong className="text-sky-300">29° to the equatorial plane</strong>. From the ground, they trace gentle figure-8 ground tracks (analemma) over 55° E and 111.75° E, providing continuous geometric diversity and near-zenith line of sight.
            </p>

            <div className="mt-4 space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-white font-bold">IRNSS-1A, 1B &amp; 1I</span>
                <span className="text-sky-300 text-[11px] sm:text-xs">55° E Longitude (29° Inclination • Figure-8)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-white font-bold">IRNSS-1E</span>
                <span className="text-sky-300 text-[11px] sm:text-xs">111.75° E Longitude (29° Inclination • Figure-8)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-white font-bold">NVS-01, NVS-02 &amp; NVS-03</span>
                <span className="text-emerald-400 text-[11px] sm:text-xs">Next-Gen Fleet (Civilian L1 + Rubidium Clocks)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why Does This Matter to Your Smartphone Callout */}
        <div className="mt-8 rounded-2xl bg-[#02050f] p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-3 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <span>Why This Astrodynamic Architecture Matters to Your Smartphone</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-orange-300 mb-1">Zero Doppler Drift</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Because NavIC GEO satellites stay motionless relative to your phone, their carrier frequency has near-zero Doppler shift, allowing rapid signal acquisition.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-emerald-300 mb-1">Permanent Zenith Angle</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  IRNSS-1C hovers at 79° elevation directly overhead, penetrating down between high-rise buildings where low-horizon GPS signals (20°–35°) get blocked.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-sky-300 mb-1">Guaranteed 10-Satellite Fleet</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  While foreign constellations require 24–32 satellites because they circle the globe, ISRO achieves continuous regional coverage with its dedicated 10-satellite fleet in orbit.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
