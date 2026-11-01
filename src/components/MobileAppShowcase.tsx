import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  Radio, 
  Terminal, 
  CheckCircle2, 
  Layers, 
  Code, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles,
  Wifi,
  Battery,
  Flame,
  Satellite as SatelliteIcon,
  Radar as RadarIcon,
  Activity,
  BookOpen
} from 'lucide-react';
import { NAVIC_SATELLITES } from '../data/navicSatellites';
import { fetchLatestRelease, Release, FALLBACK_RELEASE, REPO } from '../lib/releases';

export const MobileAppShowcase: React.FC = () => {
  const [activeScreenTab, setActiveScreenTab] = useState<'radar' | 'satellites' | 'nmea' | 'guide'>('radar');
  const [nmeaLines, setNmeaLines] = useState<string[]>([]);
  const [release, setRelease] = useState<Release>(FALLBACK_RELEASE);

  useEffect(() => {
    fetchLatestRelease().then(setRelease);
  }, []);

  // Generate simulated live NMEA stream including NavIC ($GIGSV / $IRGSV) sentences
  useEffect(() => {
    const nmeaSamples = [
      '$GNGGA,094512.00,1258.4521,N,07735.6124,E,1,16,0.85,912.4,M,-86.3,M,,*4A',
      '$GNRMC,094512.00,A,1258.4521,N,07735.6124,E,0.08,184.2,011126,,,A*7C',
      '$GIGSV,3,1,08,02,68,142,42,03,79,178,45,04,59,114,41,05,64,108,40,1*61',
      '$GIGSV,3,2,08,06,51,246,40,09,72,154,44,10,76,162,46,,,1*68',
      '$GPGSV,3,1,12,04,32,048,34,10,54,312,39,18,41,086,37,25,19,220,28,1*69',
      '$GAGSV,2,1,08,05,62,295,42,11,47,210,39,19,38,130,36,24,51,035,41,1*72',
    ];

    let counter = 0;
    const interval = setInterval(() => {
      setNmeaLines(prev => {
        const nextLine = nmeaSamples[counter % nmeaSamples.length];
        counter++;
        const updated = [nextLine, ...prev.slice(0, 10)];
        return updated;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="mobile-app" className="py-14 sm:py-20 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30 mb-2 sm:mb-3">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Companion Native Android App</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            See Real NavIC Radio Signals on Your Phone
          </h2>
          <p className="mt-2.5 sm:mt-3 text-slate-300 text-xs sm:text-base leading-relaxed px-1">
            Because web browsers cannot access raw satellite baseband data due to OS sandboxing, we built{' '}
            <strong className="text-white">NavIC SkyView</strong> — an open-source Android app that interfaces directly with your phone's GNSS driver to display <strong className="text-orange-400">NavIC satellites prominently highlighted at the top</strong>.
          </p>
        </div>

        {/* The Showcase Layout */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
          
          {/* LEFT: Realistic Phone Mockup Running NavIC SkyView Live */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[290px] xs:w-[310px] sm:w-[340px] max-w-full rounded-[40px] sm:rounded-[44px] bg-[#090d16] p-2.5 sm:p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-sky-500/20">
              
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/10 to-transparent rounded-t-[38px] pointer-events-none" />

              <div className="relative w-full h-[540px] sm:h-[620px] rounded-[32px] sm:rounded-[36px] bg-[#040714] overflow-hidden flex flex-col border border-slate-800">
                
                {/* Phone Status Bar */}
                <div className="pt-2 px-4 sm:px-6 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400 select-none">
                  <span className="font-bold text-white">09:45</span>
                  {/* Notch pill */}
                  <div className="w-16 sm:w-20 h-3.5 sm:h-4 bg-black rounded-full border border-slate-800 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
                    <span className="text-[8px] sm:text-[9px] text-emerald-400 font-mono">GNSS ON</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Wifi className="w-3 h-3" />
                    <Battery className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* App Header Inside Phone */}
                <div className="p-3 pb-2 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-orange-500 flex items-center justify-center text-slate-950 font-black text-xs shadow-md shadow-orange-500/30">
                      🇮🇳
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-white tracking-tight flex items-center gap-1">
                        NavIC SkyView
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        3D Fix: ±1.2m • 7 NavIC Locked
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[10px] font-mono font-bold border border-orange-500/20">
                    68 Sats
                  </div>
                </div>

                {/* App Content Area */}
                <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2.5 font-sans">
                  
                  {activeScreenTab === 'satellites' && (
                    <div className="space-y-2.5">
                      {/* NavIC Pinned Group */}
                      <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-orange-500/15 via-slate-900 to-emerald-500/10 border border-orange-500/40">
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-2 font-bold text-white">
                          <span className="flex items-center gap-1.5 text-orange-300">
                            <span>🇮🇳</span> NavIC / IRNSS
                          </span>
                          <span className="text-[9px] font-mono text-emerald-400">7 in 3D Fix</span>
                        </div>

                        <div className="space-y-1.5">
                          {NAVIC_SATELLITES.slice(0, 4).map(sat => (
                            <div key={sat.id} className="p-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[10px] flex items-center justify-between">
                              <div className="flex items-center gap-1.5 font-mono">
                                <span className="font-bold text-orange-400">PRN {sat.prn}</span>
                                <span className="text-slate-300 truncate max-w-[70px] sm:max-w-[85px]">{sat.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-mono">
                                <span className="text-[8px] px-1 py-0.2 rounded bg-orange-500/20 text-orange-300">L5</span>
                                <span className="text-emerald-400 font-bold">{sat.cn0DbHz} dB</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* GPS Group Collapsed */}
                      <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <span>🇺🇸</span> GPS (NAVSTAR)
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">12 in view</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="p-1.5 rounded-lg bg-slate-950/50 text-[10px] flex justify-between font-mono text-slate-400">
                            <span>PRN 04 (L1+L5)</span>
                            <span className="text-sky-400">34.2 dB</span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-slate-950/50 text-[10px] flex justify-between font-mono text-slate-400">
                            <span>PRN 10 (L1+L5)</span>
                            <span className="text-sky-400">38.6 dB</span>
                          </div>
                        </div>
                      </div>

                      {/* Galileo Group */}
                      <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <span>🇪🇺</span> Galileo
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">8 in view</span>
                        </div>
                      </div>

                      {/* BeiDou Group */}
                      <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <span>🇨🇳</span> BeiDou (BDS-3)
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">11 in view</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeScreenTab === 'radar' && (
                    <div className="space-y-2.5">
                      {/* Radar Instrument */}
                      <div className="p-2 flex flex-col items-center">
                        <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full border border-sky-500/30 bg-[#020510] relative flex items-center justify-center">
                          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-slate-800" />
                          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border border-slate-800" />
                          <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          
                          {/* Clean dots without flag clutter */}
                          <div className="absolute top-10 left-16 px-1.5 py-0.5 rounded-full bg-orange-500 text-slate-950 text-[8px] font-bold shadow-md animate-pulse">
                            PRN 3
                          </div>
                          <div className="absolute top-14 right-14 px-1.5 py-0.5 rounded-full bg-orange-500 text-slate-950 text-[8px] font-bold shadow-md">
                            PRN 2
                          </div>
                          <div className="absolute bottom-8 left-10 px-1 py-0.2 rounded-full bg-sky-500 text-slate-950 text-[7px] font-bold">
                            GPS 18
                          </div>
                          <div className="absolute bottom-10 right-8 px-1 py-0.2 rounded-full bg-cyan-500 text-slate-950 text-[7px] font-bold">
                            GAL 05
                          </div>
                        </div>
                      </div>

                      {/* NavIC HUD Card */}
                      <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[10px]">
                        <div className="flex items-center justify-between font-bold text-white mb-1">
                          <span className="text-orange-400 font-bold">🇮🇳 NavIC High-Zenith Fix</span>
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300">3D FIX</span>
                        </div>
                        <div className="font-mono text-slate-300 text-[9px]">
                          10.6568° N, 76.5005° E (±1.2m)
                        </div>
                      </div>

                      {/* Live Constellation Tracking Grid */}
                      <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="text-[9px] font-mono font-bold text-slate-400 mb-1.5">
                          LIVE CONSTELLATION TRACKING
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[9px] font-mono">
                          <div className="p-1 rounded bg-orange-500/10 text-orange-300 flex justify-between">
                            <span>🇮🇳 NavIC</span>
                            <span className="font-bold">3 in fix</span>
                          </div>
                          <div className="p-1 rounded bg-blue-500/10 text-blue-300 flex justify-between">
                            <span>🇺🇸 GPS</span>
                            <span className="font-bold">12 in fix</span>
                          </div>
                          <div className="p-1 rounded bg-cyan-500/10 text-cyan-300 flex justify-between">
                            <span>🇪🇺 Galileo</span>
                            <span className="font-bold">10 in fix</span>
                          </div>
                          <div className="p-1 rounded bg-pink-500/10 text-pink-300 flex justify-between">
                            <span>🇨🇳 BeiDou</span>
                            <span className="font-bold">28 in fix</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeScreenTab === 'guide' && (
                    <div className="space-y-2 text-[10px]">
                      <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800">
                        <div className="text-sky-400 font-bold mb-1">WHAT IS GNSS?</div>
                        <div className="text-white font-semibold">Global Navigation Satellite System</div>
                        <div className="text-slate-400 text-[9px] mt-1 leading-relaxed">
                          Scientific umbrella term covering all orbital navigation networks. GPS is only USA; your phone fuses 6 global constellations.
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800">
                        <div className="text-orange-400 font-bold mb-1">THE URBAN CANYON ADVANTAGE</div>
                        <div className="text-slate-300 text-[9px] leading-relaxed">
                          ISRO stationed NavIC at 35,786 km directly overhead India (70°–85° Zenith), shining down street canyons without building blockage.
                        </div>
                      </div>
                    </div>
                  )}

                  {activeScreenTab === 'nmea' && (
                    <div className="p-2 bg-black rounded-xl border border-slate-800 font-mono text-[8px] sm:text-[9px] text-emerald-400 space-y-1 overflow-hidden">
                      <div className="text-slate-500 pb-1 border-b border-slate-900 flex justify-between">
                        <span>LIVE NMEA 0183 FEED</span>
                        <span className="text-orange-400">$GIGSV ACTIVE</span>
                      </div>
                      {nmeaLines.map((line, i) => (
                        <div 
                          key={i} 
                          className={`truncate ${line.includes('$GIGSV') ? 'text-orange-300 font-bold' : 'text-slate-400'}`}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  )}

                </div>

                {/* Native Android Bottom Navigation Bar (Vector Icons, No Emojis) */}
                <div className="p-1.5 bg-[#0A1024] border-t border-slate-800/80 grid grid-cols-4 gap-1 text-center">
                  <button
                    onClick={() => setActiveScreenTab('radar')}
                    className={`py-1 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                      activeScreenTab === 'radar'
                        ? 'bg-orange-500/20 text-orange-400 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <RadarIcon className="w-4 h-4" />
                    <span className="text-[9px]">Radar</span>
                  </button>

                  <button
                    onClick={() => setActiveScreenTab('satellites')}
                    className={`py-1 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                      activeScreenTab === 'satellites'
                        ? 'bg-orange-500/20 text-orange-400 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <SatelliteIcon className="w-4 h-4" />
                    <span className="text-[9px]">Satellites</span>
                  </button>

                  <button
                    onClick={() => setActiveScreenTab('nmea')}
                    className={`py-1 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                      activeScreenTab === 'nmea'
                        ? 'bg-orange-500/20 text-orange-400 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span className="text-[9px]">Telemetry</span>
                  </button>

                  <button
                    onClick={() => setActiveScreenTab('guide')}
                    className={`py-1 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                      activeScreenTab === 'guide'
                        ? 'bg-orange-500/20 text-orange-400 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[9px]">Guide</span>
                  </button>
                </div>

                <div className="py-2 flex justify-center">
                  <div className="w-20 sm:w-24 h-1 bg-slate-700 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: App Description, Features & Instant Download */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Ads • Open Source • Privacy First</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-bold text-white">
                Download NavIC SkyView for Android
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                NavIC SkyView bypasses browser restrictions by using Android's native <code className="text-sky-300 font-mono">GnssStatus.Callback</code>. It identifies the hardware talker codes and groups all IRNSS / NavIC satellites in view right at the top.
              </p>
            </div>

            {/* Core Features Checklist - 2 cols on tablet, 1 on small mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <div className="p-1 rounded bg-orange-500/20 text-orange-400 shrink-0">
                  <SatelliteIcon className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block text-xs">NavIC-First Pinning</strong>
                  <span className="text-slate-400 text-[11px]">Keeps India's IRNSS satellites permanently locked at the top of your screen.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <div className="p-1 rounded bg-sky-500/20 text-sky-400 shrink-0">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block text-xs">Dual-Band L5 Indicator</strong>
                  <span className="text-slate-400 text-[11px]">Verifies whether your chipset receives 1176.45 MHz L5 or S-band carrier frequencies.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block text-xs">Live NMEA Console</strong>
                  <span className="text-slate-400 text-[11px]">Stream and export raw <code className="text-orange-300">$GIGSV</code> sentences and observations.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <div className="p-1 rounded bg-purple-500/20 text-purple-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block text-xs">100% Offline &amp; Private</strong>
                  <span className="text-slate-400 text-[11px]">No account required, zero telemetry uploaded, direct on-device signal decoding.</span>
                </div>
              </div>
            </div>

            {/* Direct Download Action Card - Stacked on mobile */}
            <div className="p-4 sm:p-5 rounded-2xl glass-card-navic border border-orange-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>NavIC SkyView APK</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    GitHub Release
                  </span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Requires Android 8.0+ • Pure Native Android (Zero Tracking)
                </p>
                <a
                  href={release.page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1 mt-1"
                >
                  <span>View GitHub Release &amp; Checksums</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <a
                href={release.download}
                className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4 text-slate-950 shrink-0" />
                <span>Download APK from GitHub</span>
              </a>
            </div>

            {/* Alternative: How to test NavIC on Google Play right now */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                <span>Want to test NavIC with existing Google Play apps?</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                You can also install the acclaimed open-source <strong className="text-sky-300">GPSTest</strong> by Sean Barbeau (available on Google Play). 
                Step outside, switch to the <em>Status</em> tab, and filter by constellation: look for the Indian flag <strong className="text-orange-400">🇮🇳 (IRNSS)</strong> with PRNs 2–10 and carrier frequency <strong className="text-emerald-300">L5 (1176.45 MHz)</strong>!
              </p>
            </div>

          </div>
        </div>

        {/* Technical Deep Dive: Web Explanation vs. Live Hardware Telemetry via Native APK */}
        <div className="mt-10 sm:mt-12 max-w-4xl mx-auto rounded-2xl glass-panel p-4 sm:p-6 border border-orange-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex flex-wrap items-center gap-2">
                  <span>Live Hardware Telemetry vs. Web Explanation</span>
                  <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    Why the Native App is Required for Live Data
                  </span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Websites explain the science — only the native APK can measure the hardware baseband
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Left: Web Browser Sandbox */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-rose-300 font-bold mb-2">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span>Web Browser Limitations</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 ml-auto">
                  Sandboxed
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                Modern browsers are restricted by the strict W3C Geolocation Sandbox to protect user privacy against hardware fingerprinting:
              </p>
              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>No Satellite PRN Access:</strong> Browsers cannot identify which satellites (NavIC, GPS, Galileo) are in view.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>No Carrier Strength (C/N₀):</strong> Browsers cannot measure signal quality (dB-Hz) or carrier frequencies (L1 vs L5).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Only Fused Coordinates:</strong> Browsers receive only a generic computed latitude/longitude pair from the OS.</span>
                </li>
              </ul>
            </div>

            {/* Right: Native Android App */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 via-slate-900 to-emerald-500/10 border border-orange-500/40">
              <div className="flex items-center gap-2 text-emerald-300 font-bold mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span>Native Android Companion App</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 ml-auto">
                  Raw Hardware
                </span>
              </div>
              <p className="text-[11px] text-slate-200 leading-relaxed mb-3">
                Our open standalone Android APK interfaces directly with the Android GNSS baseband subsystem via <code className="text-orange-300 font-mono text-[10px]">GnssStatus.Callback</code>:
              </p>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Live NavIC PRNs 2–10:</strong> Identifies ISRO constellation spacecraft (<code className="text-orange-300 font-mono text-[10px]">CONSTELLATION_IRNSS = 7</code>) currently overhead.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Live C/N₀ dB-Hz Bars:</strong> Shows real-time carrier-to-noise density and active 3D fix utilization.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>L5 Carrier Frequency:</strong> Verifies whether your phone locks onto NavIC's 1176.45 MHz frequency.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
