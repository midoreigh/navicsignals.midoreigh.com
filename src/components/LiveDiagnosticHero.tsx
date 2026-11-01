import React, { useState, useEffect, useRef } from 'react';
import { 
  Satellite, 
  Smartphone, 
  Compass, 
  Radio
} from 'lucide-react';
import { WORLD_LAND_PATH } from '../data/earthGlobePaths';
import { INDIA_STATES } from '../data/indiaMapPaths';

interface LiveDiagnosticHeroProps {
  onCheckPhone: () => void;
  onGetApp: () => void;
}

export const LiveDiagnosticHero: React.FC<LiveDiagnosticHeroProps> = ({
  onCheckPhone,
  onGetApp,
}) => {
  const [orbitProgress, setOrbitProgress] = useState(0.2);
  const animFrameRef = useRef<number | null>(null);

  // Smooth continuous ambient animation for GPS flyover in MEO orbit (60fps)
  useEffect(() => {
    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      // GPS completes full 360-degree MEO orbit sweep every 14 seconds
      setOrbitProgress(prev => (prev + delta * (1 / 14)) % 1);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // MEO Inclined Orbit Parametric Math (Ellipse: center=(270, 250), rx=265, ry=110, tilt=-32°)
  const cx = 270;
  const cy = 250;
  const rx = 265;
  const ry = 110;
  const tiltRad = -32 * (Math.PI / 180);
  const cosTilt = Math.cos(tiltRad);
  const sinTilt = Math.sin(tiltRad);

  // Authentic Survey of India Map Scale & Alignment on Hero Globe
  const indiaScale = 0.265;
  const indiaTx = cx - 275 * indiaScale;
  const indiaTy = 235 - 340 * indiaScale;

  // Calculate GPS satellite position along the inclined ellipse
  const alpha = 2 * Math.PI * orbitProgress;
  const x0 = rx * Math.cos(alpha);
  const y0 = ry * Math.sin(alpha);
  const gpsX = cx + x0 * cosTilt - y0 * sinTilt;
  const gpsY = cy + x0 * sinTilt + y0 * cosTilt;

  // Tangent angle for motion trail & velocity vector
  const dx0 = -rx * Math.sin(alpha);
  const dy0 = ry * Math.cos(alpha);
  const vx = dx0 * cosTilt - dy0 * sinTilt;
  const vy = dx0 * sinTilt + dy0 * cosTilt;
  const headingAngle = Math.atan2(vy, vx) * (180 / Math.PI);

  // Trail back-points for tail streak (120ms behind)
  const tailLength = 28;
  const tailX = -Math.cos(headingAngle * (Math.PI / 180)) * tailLength;
  const tailY = -Math.sin(headingAngle * (Math.PI / 180)) * tailLength;

  // 3D Occlusion Math: Earth sphere radius = 210 px
  // When y0 < 0 (alpha between π and 2π), GPS is in the rear half of its orbit (behind Earth's plane).
  // If its 2D projected distance from Earth's center is < 210 px, it is physically behind the solid Earth.
  const distFromCenter = Math.hypot(gpsX - cx, gpsY - cy);
  const isBehindEarth = y0 < 0;
  const isOcculted = isBehindEarth && distFromCenter < 210;

  // Opacity: 1.0 when in front of Earth; 0.75 in space on the far side;
  // clearly dimmed to 0.35 with dashed telemetry marker when passing behind Earth.
  let gpsOpacity = 1.0;
  if (isBehindEarth) {
    if (distFromCenter < 210) {
      gpsOpacity = 0.35; // Dimmed when behind Earth
    } else {
      gpsOpacity = 0.75; // Far side of orbit in space
    }
  }

  return (
    <section className="relative overflow-hidden pt-4 pb-14 sm:pt-8 sm:pb-20 bg-[#02040b]">
      {/* Full-Bleed Deep Space Background: Stars, Cosmic Coordinates & Distant Nebular Dust */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Deep space color aura */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[900px] h-[400px] sm:h-[650px] bg-gradient-to-tr from-sky-950/30 via-slate-900/10 to-orange-950/15 blur-[120px] rounded-full" />
        <div className="absolute top-10 right-0 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-sky-900/15 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-950/10 blur-[110px] rounded-full" />
        
        {/* Starfield Particles */}
        <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
          <circle cx="5%" cy="12%" r="1" fill="#ffffff" opacity="0.5" />
          <circle cx="14%" cy="28%" r="0.8" fill="#38bdf8" opacity="0.6" />
          <circle cx="22%" cy="8%" r="1.2" fill="#ffffff" opacity="0.7" />
          <circle cx="31%" cy="45%" r="0.7" fill="#ffffff" opacity="0.3" />
          <circle cx="42%" cy="18%" r="1" fill="#facc15" opacity="0.5" />
          <circle cx="48%" cy="75%" r="0.9" fill="#ffffff" opacity="0.4" />
          <circle cx="58%" cy="10%" r="1.3" fill="#38bdf8" opacity="0.6" />
          <circle cx="68%" cy="32%" r="0.8" fill="#ffffff" opacity="0.5" />
          <circle cx="75%" cy="85%" r="1" fill="#ffffff" opacity="0.4" />
          <circle cx="85%" cy="15%" r="1.1" fill="#fb923c" opacity="0.6" />
          <circle cx="92%" cy="62%" r="0.7" fill="#38bdf8" opacity="0.5" />
          <circle cx="96%" cy="25%" r="1" fill="#ffffff" opacity="0.7" />
        </svg>

        {/* Subtle Celestial Coordinate Grid */}
        <div 
          className="absolute inset-0 opacity-[0.025]" 
          style={{ 
            backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.9) 1px, transparent 1px)`, 
            backgroundSize: '32px 32px' 
          }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ============================================================ */}
          {/* LEFT COLUMN: Title, Subtitle, Actions, and Specifications     */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left z-10">
            
            {/* Constellation Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-orange-500/30 shadow-lg shadow-orange-500/5 text-[11px] sm:text-xs text-orange-200">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="font-semibold text-orange-400">NavIC (IRNSS) Active</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Indian Subcontinent Orbit</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Is Your Phone Using India's{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200">
                NavIC
              </span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
                Satellites
              </span>
              ?
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Discover how ISRO's indigenous constellation hovers permanently above the Indian Subcontinent, delivering continuous high-elevation line-of-sight where foreign GPS satellites constantly fly past and set below the horizon.
            </p>

            {/* Educational Exploration CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 max-w-lg mx-auto lg:mx-0">
              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer min-h-[46px]"
              >
                <Compass className="w-4 h-4 text-slate-950 shrink-0" />
                <span>How NavIC Works</span>
              </button>

              <button
                onClick={onCheckPhone}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900/80 hover:bg-slate-800 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/5 hover:border-purple-400 transition-all cursor-pointer min-h-[46px]"
              >
                <Smartphone className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Phone Lookup</span>
              </button>

              <button
                onClick={onGetApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900/80 hover:bg-slate-800 text-sky-300 border border-sky-500/30 shadow-lg shadow-sky-500/5 hover:border-sky-400 transition-all cursor-pointer min-h-[46px]"
              >
                <Radio className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Companion App</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center lg:text-left border-t border-slate-800/80">
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-sm sm:text-lg font-extrabold text-orange-400 font-mono">8 Birds</div>
                <div className="text-[10px] text-slate-400">Regional IRNSS Fleet</div>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-sm sm:text-lg font-extrabold text-sky-400 font-mono truncate">1176.45 MHz</div>
                <div className="text-[10px] text-slate-400">NavIC L5 Carrier</div>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-sm sm:text-lg font-extrabold text-emerald-400 font-mono">&lt; 2.5 m</div>
                <div className="text-[10px] text-slate-400">Precision in India</div>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-sm sm:text-lg font-extrabold text-purple-400 font-mono">75° - 85°</div>
                <div className="text-[10px] text-slate-400">Zenith Lock Angle</div>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: 3D Dark Earth with Cyber Telemetry & Satellites */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[620px] aspect-[600/560] flex items-center justify-center select-none">
              
              <svg viewBox="0 0 600 560" className="w-full h-full overflow-visible">
                <defs>
                  {/* Atmospheric Glow Filters */}
                  <filter id="atmosphereLimbGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="10" result="blur1" />
                    <feGaussianBlur stdDeviation="22" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur2" />
                      <feMergeNode in="blur1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="telemetryBeaconGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Dark Earth Ocean Body Sphere Gradient */}
                  <radialGradient id="earthGlobeBody" cx="50%" cy="40%" r="55%">
                    <stop offset="0%" stopColor="#0c192c" />
                    <stop offset="65%" stopColor="#060c17" />
                    <stop offset="90%" stopColor="#03070f" />
                    <stop offset="100%" stopColor="#010307" />
                  </radialGradient>

                  {/* Atmospheric Rim Highlight */}
                  <radialGradient id="earthRimGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="85%" stopColor="#06b6d4" stopOpacity="0" />
                    <stop offset="96%" stopColor="#38bdf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
                  </radialGradient>

                  {/* NavIC Transmission Conical Beam */}
                  <linearGradient id="navicTransmissionCone" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                    <stop offset="40%" stopColor="#fb923c" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                  </linearGradient>

                  {/* GPS Dynamic Motion Streak */}
                  <linearGradient id="gpsMotionStreak" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* 1. Atmospheric Outer Halo & Rim Aura */}
                <circle cx={cx} cy={cy} r="218" fill="none" stroke="#06b6d4" strokeWidth="6" opacity="0.35" filter="url(#atmosphereLimbGlow)" />
                <circle cx={cx} cy={cy} r="212" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.75" />

                {/* 2. Dark Earth Sphere Body */}
                <circle cx={cx} cy={cy} r="210" fill="url(#earthGlobeBody)" />
                <circle cx={cx} cy={cy} r="210" fill="url(#earthRimGlow)" />

                {/* 3. Spherical Lat/Lon Coordinate Graticules */}
                <ellipse cx={cx} cy={cy} rx="210" ry="60" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.6" />
                <ellipse cx={cx} cy={cy - 50} rx="198" ry="52" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.5" />
                <ellipse cx={cx} cy={cy + 50} rx="198" ry="52" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.5" />
                <line x1={cx} y1={cy - 210} x2={cx} y2={cy + 210} stroke="#0ea5e9" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.25" />

                {/* 4. Global Continents Silhouettes in Natural Geographic Context */}
                <path d={WORLD_LAND_PATH} fill="#111c2e" stroke="#1e293b" strokeWidth="0.7" opacity="0.75" />

                {/* 5. Surrounding Water Bodies */}
                <text x="155" y="270" fill="#334155" fontSize="8" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
                  ARABIAN SEA
                </text>
                <text x="365" y="270" fill="#334155" fontSize="8" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
                  BAY OF BENGAL
                </text>
                <text x={cx} y="388" fill="#334155" fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="1.5" textAnchor="middle">
                  INDIAN OCEAN
                </text>

                {/* 6. INDIA: Authentic Official Survey of India (SOI) Compliant Map with Cyber Elevation & Glow */}
                <g transform={`translate(${indiaTx}, ${indiaTy}) scale(${indiaScale})`}>
                  {/* Outer Glow Aura */}
                  <g fill="#10b981" opacity="0.3" filter="url(#telemetryBeaconGlow)">
                    {INDIA_STATES.map((state) => (
                      <path key={`glow-${state.id}`} d={state.d} />
                    ))}
                  </g>
                  {/* Topographic Cyber Landmass Fill & Administrative State Boundaries */}
                  <g fill="#06281e" stroke="#34d399" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round">
                    {INDIA_STATES.map((state) => (
                      <path key={state.id} d={state.d} id={`state-${state.id}`} />
                    ))}
                  </g>
                </g>

                {/* Sri Lanka Island across Palk Strait */}
                <ellipse cx="268" cy="330" rx="5.5" ry="9" fill="#06281e" stroke="#34d399" strokeWidth="1.2" transform="rotate(10 268 330)" />

                {/* Active Smartphone Receiver Beacon in Central India */}
                <g transform="translate(262, 248)">
                  <circle r="14" fill="none" stroke="#f97316" strokeWidth="1.2" opacity="0.3" className="animate-ping" />
                  <circle r="7" fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.7" />
                  <circle r="3" fill="#ffedd5" stroke="#f97316" strokeWidth="1.5" />
                  <text x="0" y="16" fill="#fed7aa" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    INDIA
                  </text>
                  <text x="0" y="24" fill="#6ee7b7" fontSize="6.5" fontWeight="600" textAnchor="middle" fontFamily="monospace">
                    [RECEIVER ZENITH]
                  </text>
                </g>

                {/* 7. MEO INCLINED ORBITAL RING (GPS 20,200 km Altitude, 55° Inclination) */}
                {/* Rear half of orbit (passes on the far side of Earth - dimmed) */}
                <path 
                  d="M 5,250 A 265 110 0 0 1 535,250" 
                  transform="rotate(-32 270 250)" 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="1.2" 
                  strokeDasharray="3 5" 
                  opacity="0.18" 
                />
                {/* Front half of orbit (loops in front of Southern Hemisphere / Indian Ocean) */}
                <path 
                  d="M 535,250 A 265 110 0 0 1 5,250" 
                  transform="rotate(-32 270 250)" 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="1.5" 
                  strokeDasharray="3 5" 
                  opacity="0.5" 
                />
                <text x="75" y="380" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  MEO 20,200 km [INCLINED 55°]
                </text>

                {/* 8. NAVIC CONSTELLATION (ISRO GEO SATELLITES - STATIONARY OVER INDIA) */}
                {/* Overhead Regional Canopy Arc Connecting the 3 Stationary Satellites */}
                <path d="M 160,115 Q 270,72 380,115" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

                {/* Saffron Transmission Beams Projecting Downward onto Indian Subcontinent */}
                <polygon points="270,82 195,260 345,260" fill="url(#navicTransmissionCone)" stroke="#f97316" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.7" />
                <polygon points="160,115 205,255 285,300" fill="url(#navicTransmissionCone)" opacity="0.25" />
                <polygon points="380,115 255,300 335,255" fill="url(#navicTransmissionCone)" opacity="0.25" />

                {/* NavIC Prime Satellite: IRNSS-1C (Stationary at Zenith 79°) */}
                <g transform="translate(270, 82)">
                  <circle r="16" fill="#f97316" opacity="0.25" filter="url(#telemetryBeaconGlow)" className="animate-pulse" />
                  <circle r="8" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5" />
                  {/* Solar Arrays */}
                  <rect x="-24" y="-4" width="12" height="8" rx="1.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="-18" y1="-4" x2="-18" y2="4" stroke="#040817" strokeWidth="0.8" />
                  <rect x="12" y="-4" width="12" height="8" rx="1.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="18" y1="-4" x2="18" y2="4" stroke="#040817" strokeWidth="0.8" />
                  {/* Antenna Dish */}
                  <path d="M -4,6 Q 0,10 4,6" fill="none" stroke="#facc15" strokeWidth="1.5" />
                  
                  <text x="0" y="-12" fill="#fed7aa" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    🇮🇳 IRNSS-1C (GEO)
                  </text>
                  <text x="0" y="24" fill="#fb923c" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    STATIONARY ZENITH (79°)
                  </text>
                </g>

                {/* NavIC Flank Satellite 1: IRNSS-1F (Western Sky) */}
                <g transform="translate(160, 115)">
                  <circle r="6" fill="#ea580c" stroke="#ffffff" strokeWidth="1.2" />
                  <rect x="-18" y="-3" width="9" height="6" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.6" />
                  <rect x="9" y="-3" width="9" height="6" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.6" />
                  <text x="0" y="-10" fill="#fed7aa" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    IRNSS-1F (GEO)
                  </text>
                </g>

                {/* NavIC Flank Satellite 2: IRNSS-1G (Eastern Sky) */}
                <g transform="translate(380, 115)">
                  <circle r="6" fill="#ea580c" stroke="#ffffff" strokeWidth="1.2" />
                  <rect x="-18" y="-3" width="9" height="6" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.6" />
                  <rect x="9" y="-3" width="9" height="6" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.6" />
                  <text x="0" y="-10" fill="#fed7aa" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    IRNSS-1G (GEO)
                  </text>
                </g>

                {/* 9. GPS SATELLITE (USA NAVSTAR - 60FPS AMBIENT MEO FLYOVER) */}
                {gpsOpacity > 0 && (
                  <g 
                    transform={`translate(${gpsX}, ${gpsY})`}
                    opacity={gpsOpacity}
                    style={{ transition: 'opacity 0.2s ease-out' }}
                  >
                    {/* Motion Streak Trailing Behind Satellite (only visible in foreground) */}
                    {gpsOpacity > 0.4 && (
                      <line 
                        x1={tailX} 
                        y1={tailY} 
                        x2="0" 
                        y2="0" 
                        stroke="url(#gpsMotionStreak)" 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                      />
                    )}
                    <circle 
                      r="7" 
                      fill={isOcculted ? '#0f172a' : '#0284c7'} 
                      stroke={isOcculted ? '#64748b' : '#ffffff'} 
                      strokeWidth="1.4" 
                      strokeDasharray={isOcculted ? '2 2' : 'none'} 
                    />
                    {/* Solar Wings */}
                    <rect x="-16" y="-3.5" width="8" height="7" rx="1" fill={isOcculted ? '#334155' : '#38bdf8'} stroke={isOcculted ? '#64748b' : '#ffffff'} strokeWidth="0.6" />
                    <rect x="8" y="-3.5" width="8" height="7" rx="1" fill={isOcculted ? '#334155' : '#38bdf8'} stroke={isOcculted ? '#64748b' : '#ffffff'} strokeWidth="0.6" />
                    
                    <text x="0" y="-12" fill={isOcculted ? '#94a3b8' : '#bae6fd'} fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      🇺🇸 GPS-18 (MEO)
                    </text>
                    <text x="0" y="18" fill={isOcculted ? '#f59e0b' : '#38bdf8'} fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {isOcculted ? 'BEHIND EARTH' : 'FLYOVER • ~3.87 km/s'}
                    </text>
                  </g>
                )}

              </svg>
            </div>

            {/* Bottom Comparison Telemetry Strip (Subtle & Unboxed) */}
            <div className="mt-3 w-full max-w-[560px] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                  <span className="font-bold text-orange-400">🇮🇳 NavIC (35,786 km)</span>
                </div>
                <span className="text-emerald-400 font-bold">Stationary Zenith Lock</span>
              </div>

              <div className={`p-2 rounded-xl border flex items-center justify-between transition-colors ${isOcculted ? 'bg-slate-900/60 border-slate-700/60' : 'bg-sky-500/10 border-sky-500/25'}`}>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isOcculted ? 'bg-slate-500' : 'bg-sky-400 animate-pulse'}`}></span>
                  <span className={`font-bold ${isOcculted ? 'text-slate-400' : 'text-sky-400'}`}>🇺🇸 GPS (20,200 km)</span>
                </div>
                <span className={`font-bold text-[10.5px] ${isOcculted ? 'text-amber-400' : 'text-sky-300'}`}>
                  {isOcculted ? 'Occulted (Behind Earth)' : 'Fast Flyover (Sets in ~3h)'}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
