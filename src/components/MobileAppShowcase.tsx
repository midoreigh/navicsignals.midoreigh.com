import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  Radio, 
  Terminal, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  Satellite as SatelliteIcon,
  Cpu
} from 'lucide-react';
import { fetchLatestRelease, Release, FALLBACK_RELEASE } from '../lib/releases';

export const MobileAppShowcase: React.FC = () => {
  const [release, setRelease] = useState<Release>(FALLBACK_RELEASE);

  useEffect(() => {
    fetchLatestRelease().then(setRelease);
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
            <strong className="text-white">NavIC Signals</strong> — an open-source Android app that interfaces directly with your phone's GNSS driver to display <strong className="text-orange-400">NavIC satellites prominently highlighted at the top</strong>.
          </p>
        </div>

        {/* The Showcase Layout */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
          
          {/* LEFT: Samsung Galaxy S24 Ultra Mockup with Real Hardware Screenshot */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            
            {/* S24 Ultra Device Container */}
            <div className="relative group">
              {/* Ambient Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 via-sky-500/10 to-transparent blur-2xl opacity-60 rounded-3xl -z-10" />

              {/* Hardware Button Accents on Right Edge (S24 Ultra Power & Volume) */}
              <div className="absolute -right-[7px] top-[120px] w-[3px] h-[58px] bg-slate-600 rounded-r-[2px] hidden sm:block" />
              <div className="absolute -right-[7px] top-[195px] w-[3px] h-[38px] bg-slate-600 rounded-r-[2px] hidden sm:block" />

              {/* Samsung Galaxy S24 Ultra Titanium Frame (Authentic Boxy Silhouette & Ultra-Thin Bezels) */}
              <div className="relative w-[280px] xs:w-[305px] sm:w-[335px] aspect-[720/1560] rounded-[8px] bg-gradient-to-b from-[#333a48] via-[#212631] to-[#181c24] p-[3.5px] sm:p-[4px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(249,115,22,0.15)] border border-slate-600/80 ring-1 ring-white/15 select-none">
                
                {/* S24 Ultra Flat Titanium Chamfer Highlight */}
                <div className="absolute inset-x-1 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* Inner Screen Display (Razor-Thin Uniform Bezels) */}
                <div className="relative w-full h-full rounded-[4px] overflow-hidden bg-[#0A1024] flex flex-col border border-black/40">
                  
                  {/* Infinity-O Centered Punch-Hole Camera */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-black border border-slate-800/80 flex items-center justify-center pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0d162a] ring-[0.5px] ring-indigo-400/40" />
                  </div>

                  {/* Real Live Hardware Screenshot Captured from Connected S24 Ultra */}
                  <img 
                    src="/screenshots/navic-signals-s24.png" 
                    alt="NavIC Signals companion app running live on Samsung Galaxy S24 Ultra" 
                    className="w-full h-full object-cover block select-none pointer-events-none"
                    loading="eager"
                  />

                  {/* Subtle Display Glass Glare Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.05] pointer-events-none" />
                </div>
              </div>

              {/* Device Model Caption Pill */}
              <div className="mt-4 flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Captured on Samsung Galaxy S24 Ultra</span>
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
                Download NavIC Signals for Android
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                NavIC Signals bypasses browser restrictions by using Android's native <code className="text-sky-300 font-mono">GnssStatus.Callback</code>. It identifies the hardware talker codes and groups all IRNSS / NavIC satellites in view right at the top.
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
                  <span>NavIC Signals APK</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    Android Companion
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
                  <span>Release Notes &amp; Checksums</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <a
                href={release.download}
                className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4 text-slate-950 shrink-0" />
                <span>Download APK</span>
              </a>
            </div>

            {/* Alternative: How to test NavIC on Google Play right now */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span>Want to test NavIC with existing Google Play apps?</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                You can also install the acclaimed open-source <strong className="text-sky-300">GPSTest</strong> by Sean Barbeau (available on Google Play). 
                Step outside, switch to the <em>Status</em> tab, and filter by constellation: look for the Indian flag <strong className="text-orange-400">🇮🇳 (IRNSS)</strong> with PRNs 2–12 and carrier frequencies <strong className="text-emerald-300">L5 (1176.45 MHz)</strong> or <strong className="text-sky-300">L1 (1575.42 MHz)</strong>!
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
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Why Live Telemetry Requires a Native App
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                  Web browsers operate in a privacy sandbox, while the Android companion app interfaces directly with raw GNSS baseband hardware.
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
                  <span><strong>Live NavIC PRNs 2–12:</strong> Identifies ISRO constellation spacecraft (<code className="text-orange-300 font-mono text-[10px]">CONSTELLATION_IRNSS = 7</code>) such as IRNSS-1B (PRN 2) through NVS-03 (PRN 12) currently overhead.</span>
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
